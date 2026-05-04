import 'server-only';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { sendBookFulfillmentEmail } from './emails/send-book-fulfillment';
import { sendCertificationGuideEmail } from './emails/send-certification-guide';
import { BOOK_PRODUCT_TYPES, PRICE_MAP, PROFESSIONAL_PRODUCT_TYPES } from './priceMap';
import type { BookProductType } from '../content/books';

/** Referral credit per completed referee purchase. Cents (Stripe convention). */
const REFERRAL_CREDIT_CENTS = 2500;

/**
 * Pure Stripe-event handler — no Next.js coupling. Signature verification and
 * route framing live in each consumer's `src/app/api/webhook/route.ts` wrapper.
 *
 * Both repos call the same exported function. Idempotency is enforced via the
 * `processed_webhook_events` table.
 *
 * Returns:
 *   { ok: true, status: 'processed' | 'duplicate' } on success
 *   { ok: false, reason } on failure (caller decides 400 vs 500)
 */
export interface HandleStripeEventOpts {
  stripe: Stripe;
  /** Site that mounted this wrapper. Used as fallback when metadata.origin_site is missing. */
  originSiteFallback?: 'six-identities' | 'etfframework';
}

export type HandleStripeEventResult =
  | { ok: true; status: 'processed' | 'duplicate' }
  | { ok: false; reason: string };

export async function handleStripeEvent(
  event: Stripe.Event,
  supabase: SupabaseClient,
  opts: HandleStripeEventOpts,
): Promise<HandleStripeEventResult> {
  // Idempotency check
  const { data: existing } = await supabase
    .from('processed_webhook_events')
    .select('id')
    .eq('event_id', event.id)
    .single();

  if (existing) {
    console.info(`[APP_AUDIT] Duplicate webhook event ${event.id} — skipping`);
    return { ok: true, status: 'duplicate' };
  }

  await supabase
    .from('processed_webhook_events')
    .insert({ event_id: event.id, event_type: event.type });

  if (event.type === 'checkout.session.completed') {
    return handleCheckoutCompleted(event, supabase, opts);
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    return handleSubscriptionLifecycle(event, supabase);
  }

  return { ok: true, status: 'processed' };
}

async function handleCheckoutCompleted(
  event: Stripe.Event,
  supabase: SupabaseClient,
  opts: HandleStripeEventOpts,
): Promise<HandleStripeEventResult> {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata || {};
  const productType = metadata.productType || null;
  const rawAssessmentId = metadata.assessmentId || null;
  const userId = metadata.userId || null;
  const customerEmail = session.customer_details?.email || session.customer_email || '';

  const originSite =
    metadata.origin_site === '6identities' || metadata.origin_site === 'etfframework'
      ? metadata.origin_site
      : (opts.originSiteFallback === 'six-identities'
          ? '6identities'
          : opts.originSiteFallback === 'etfframework'
            ? 'etfframework'
            : null);

  const cohort =
    typeof metadata.cohort === 'string' && metadata.cohort.startsWith('soft-launch-')
      ? metadata.cohort
      : null;

  const isProfessional =
    productType !== null &&
    PROFESSIONAL_PRODUCT_TYPES.has(productType as never);
  const assessmentId = isProfessional ? null : rawAssessmentId;

  if (productType === 'practitioner_portal' && userId) {
    const { error } = await supabase
      .from('professional_profiles')
      .update({
        status: 'active',
        is_professional: true,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      })
      .eq('id', userId);
    if (error) console.error('🔴 Failed to upgrade professional profile:', error);
    else console.log(`✅ Professional Portal activated for user ${userId}`);
    return { ok: true, status: 'processed' };
  }

  if (
    (productType === 'practitioner_credits' || productType === 'extra_links') &&
    userId
  ) {
    // Derived from the canonical ledger so a price change in priceMap.ts
    // propagates to the line-item quantity calc.
    const unitPrice = Math.round(PRICE_MAP[productType].amountUsd * 100);
    const fallbackQuantity = session.amount_total
      ? Math.round(session.amount_total / unitPrice)
      : 1;
    const lineItems = await opts.stripe.checkout.sessions.listLineItems(session.id);
    const actualQuantity = lineItems.data[0]?.quantity || fallbackQuantity;

    const links: Array<{ token: string; practitioner_id: string; status: string }> = [];
    for (let i = 0; i < actualQuantity; i++) {
      const token = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${i}`)
        .split('-')[0]
        .toUpperCase();
      links.push({ token, practitioner_id: userId, status: 'active' });
    }

    const { error: linkError } = await supabase
      .from('practitioner_links')
      .insert(links);
    if (linkError) {
      console.error('🔴 Failed to generate practitioner links:', linkError);
    } else {
      await supabase
        .from('professional_profiles')
        .update({ status: 'active', is_professional: true })
        .eq('id', userId);
      console.log(`✅ Generated ${actualQuantity} ${productType} links for ${userId}`);
    }
    return { ok: true, status: 'processed' };
  }

  if (productType === 'implementer_cert') {
    const { data: insertedPurchase, error } = await supabase
      .from('purchases')
      .insert([
        {
          email: customerEmail,
          product: productType,
          stripe_session_id: session.id,
          assessment_id: assessmentId,
          origin_site: originSite,
          cohort,
        },
      ])
      .select('id, fulfillment_sent_at')
      .maybeSingle();
    if (error) console.error('🔴 Failed to record implementer cert:', error);
    else console.log(`✅ Implementer certification recorded for ${customerEmail}`);

    if (userId) {
      const { error: certError } = await supabase
        .from('professional_profiles')
        .update({ certification_status: 'pending', is_professional: true })
        .eq('id', userId);
      if (certError) console.error('🔴 Failed to update certification status:', certError);
    }

    if (customerEmail && insertedPurchase && !insertedPurchase.fulfillment_sent_at) {
      try {
        const result = await sendCertificationGuideEmail({
          email: customerEmail,
          userId,
          sessionId: session.id,
        });
        if (result.success) {
          const { error: stampErr } = await supabase
            .from('purchases')
            .update({ fulfillment_sent_at: new Date().toISOString() })
            .eq('id', insertedPurchase.id);
          if (stampErr) {
            console.error(`🔴 Cert guide sent but stamp failed for ${insertedPurchase.id}:`, stampErr.message);
          }
        } else if (result.error) {
          console.error(`🔴 Cert guide email failed for ${customerEmail}:`, result.error);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`🔴 Cert guide threw for ${customerEmail}:`, msg);
      }
    }

    const referralCode = metadata.referralCode || null;
    if (referralCode) {
      await processReferral({ supabase, referralCode, customerEmail, sessionId: session.id });
    }

    return { ok: true, status: 'processed' };
  }

  if (productType === 'implementer_renewal' && userId) {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error } = await supabase
      .from('professional_profiles')
      .update({
        certification_status: 'active',
        is_professional: true,
        cert_expires_at: expiresAt.toISOString(),
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      })
      .eq('id', userId);
    if (error) console.error('🔴 Failed to activate implementer renewal:', error);
    else console.log(`✅ Implementer renewal activated for user ${userId}`);
    return { ok: true, status: 'processed' };
  }

  // Default branch: assessment / book / module purchase
  const { error } = await supabase.from('purchases').insert([
    {
      email: customerEmail,
      product: productType,
      stripe_session_id: session.id,
      assessment_id: assessmentId,
      origin_site: originSite,
      cohort,
    },
  ]);
  if (error) {
    console.error('🔴 Failed to save purchase to Supabase:', error);
    return { ok: false, reason: 'database error on purchases insert' };
  }
  console.log(`✅ Recorded purchase for ${customerEmail} (product: ${productType})`);

  if (
    productType &&
    BOOK_PRODUCT_TYPES.has(productType as never) &&
    customerEmail
  ) {
    try {
      const result = await sendBookFulfillmentEmail({
        email: customerEmail,
        productKey: productType as BookProductType,
      });
      if (result.error) {
        console.error(`🔴 Book fulfillment failed for ${customerEmail}:`, result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`🔴 Book fulfillment threw for ${customerEmail}:`, msg);
    }
  }

  // Order-bump fulfillment. Sites pass `metadata.bumpProductType` when a
  // checkout-only add-on (e.g. `book_motion_bump` alongside `premium_results`)
  // is included as a second line item. We record a second purchase row and
  // fulfill the bump as a book.
  const bumpProductType = metadata.bumpProductType || null;
  if (
    bumpProductType &&
    BOOK_PRODUCT_TYPES.has(bumpProductType as never) &&
    customerEmail
  ) {
    const { error: bumpInsertErr } = await supabase.from('purchases').insert([
      {
        email: customerEmail,
        product: bumpProductType,
        stripe_session_id: session.id,
        assessment_id: assessmentId,
        origin_site: originSite,
        cohort,
      },
    ]);
    if (bumpInsertErr) {
      console.error('🔴 Failed to save bump purchase to Supabase:', bumpInsertErr);
    } else {
      console.log(`✅ Recorded bump purchase for ${customerEmail} (product: ${bumpProductType})`);
    }

    try {
      const result = await sendBookFulfillmentEmail({
        email: customerEmail,
        productKey: bumpProductType as BookProductType,
      });
      if (result.error) {
        console.error(`🔴 Bump fulfillment failed for ${customerEmail}:`, result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`🔴 Bump fulfillment threw for ${customerEmail}:`, msg);
    }
  }

  return { ok: true, status: 'processed' };
}

async function processReferral(args: {
  supabase: SupabaseClient;
  referralCode: string;
  customerEmail: string;
  sessionId: string;
}): Promise<void> {
  const { supabase, referralCode, customerEmail, sessionId } = args;
  const { data: referralLink } = await supabase
    .from('referral_links')
    .select('user_id')
    .eq('referral_code', referralCode)
    .eq('is_active', true)
    .single();

  if (!referralLink) {
    console.warn(`⚠️ Referral code ${referralCode} not found or inactive`);
    return;
  }

  const { data: referral, error: refError } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referralLink.user_id,
      referee_email: customerEmail,
      referee_stripe_session_id: sessionId,
      status: 'completed',
      credit_amount: REFERRAL_CREDIT_CENTS,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (refError) {
    console.error('🔴 Failed to record referral:', refError);
    return;
  }

  const { error: creditError } = await supabase
    .from('renewal_credits')
    .insert({
      user_id: referralLink.user_id,
      referral_id: referral.id,
      amount: REFERRAL_CREDIT_CENTS,
    });
  if (creditError) console.error('🔴 Failed to create renewal credit:', creditError);

  const { data: referrerProfile } = await supabase
    .from('professional_profiles')
    .select('email')
    .eq('id', referralLink.user_id)
    .single();

  if (referrerProfile?.email) {
    await supabase.from('pending_notifications').insert({
      recipient_email: referrerProfile.email,
      notification_type: 'referral_credit_earned',
      payload: {
        refereeEmail: customerEmail,
        creditAmount: REFERRAL_CREDIT_CENTS,
        referralCode,
      },
    });
  }
}

async function handleSubscriptionLifecycle(
  event: Stripe.Event,
  supabase: SupabaseClient,
): Promise<HandleStripeEventResult> {
  const subscription = event.data.object as Stripe.Subscription;
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    unpaid: 'past_due',
    canceled: 'canceled',
    incomplete: 'trial',
    incomplete_expired: 'canceled',
    trialing: 'trial',
  };

  const newStatus = statusMap[subscription.status] || 'canceled';

  const { error } = await supabase
    .from('professional_profiles')
    .update({ status: newStatus })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('🔴 Failed to update subscription status:', error);
    return { ok: false, reason: 'subscription update failed' };
  }
  console.log(`✅ Subscription ${subscription.id} status updated to ${newStatus}`);

  if (['canceled', 'past_due'].includes(newStatus)) {
    const { error: certError } = await supabase
      .from('professional_profiles')
      .update({ certification_status: 'grace_period' })
      .eq('stripe_subscription_id', subscription.id)
      .in('certification_status', ['active', 'pending']);
    if (certError) console.error('🔴 Failed to expire certification:', certError);
  }

  return { ok: true, status: 'processed' };
}
