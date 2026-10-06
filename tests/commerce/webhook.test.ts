import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';
import { handleStripeEvent } from '../../src/commerce/webhook';

// Lightweight chainable mock — covers the from()/select()/insert()/update()/eq()/single()/maybeSingle() patterns the handler uses.
function makeSupabaseMock(overrides: {
  existingEvent?: { id: string } | null;
  insertedPurchase?: { id: string; fulfillment_sent_at: string | null } | null;
  referralLink?: { user_id: string } | null;
  insertedReferral?: { id: string } | null;
  referrerProfile?: { email: string } | null;
} = {}) {
  const calls: { table: string; op: string; payload?: unknown }[] = [];

  function mkChain(table: string) {
    let lastOp = '';
    let lastPayload: unknown;
    let resolveValue: { data: unknown; error: unknown } = { data: null, error: null };

    const chain: any = {
      select: (..._args: unknown[]) => {
        lastOp = 'select';
        return chain;
      },
      insert: (payload: unknown) => {
        lastOp = 'insert';
        lastPayload = payload;
        calls.push({ table, op: 'insert', payload });
        if (table === 'purchases' && overrides.insertedPurchase !== undefined) {
          resolveValue = { data: overrides.insertedPurchase, error: null };
        } else if (table === 'referrals' && overrides.insertedReferral !== undefined) {
          resolveValue = { data: overrides.insertedReferral, error: null };
        } else {
          resolveValue = { data: null, error: null };
        }
        return chain;
      },
      update: (payload: unknown) => {
        lastOp = 'update';
        lastPayload = payload;
        calls.push({ table, op: 'update', payload });
        return chain;
      },
      eq: (..._args: unknown[]) => chain,
      in: (..._args: unknown[]) => chain,
      order: (..._args: unknown[]) => chain,
      limit: (..._args: unknown[]) => chain,
      single: () => {
        if (table === 'processed_webhook_events' && lastOp === 'select') {
          return Promise.resolve({ data: overrides.existingEvent ?? null, error: null });
        }
        if (table === 'referral_links' && lastOp === 'select') {
          return Promise.resolve({ data: overrides.referralLink ?? null, error: null });
        }
        if (table === 'professional_profiles' && lastOp === 'select') {
          return Promise.resolve({ data: overrides.referrerProfile ?? null, error: null });
        }
        return Promise.resolve(resolveValue);
      },
      maybeSingle: () => Promise.resolve(resolveValue),
      then: (onResolve: (v: unknown) => unknown) => Promise.resolve(resolveValue).then(onResolve),
    };
    return chain;
  }

  const supabase: any = {
    from: (table: string) => mkChain(table),
    storage: { from: () => ({ createSignedUrl: () => Promise.resolve({ data: { signedUrl: 'https://x' }, error: null }) }) },
    _calls: calls,
  };
  return supabase;
}

const stripeMock: any = {
  checkout: {
    sessions: {
      listLineItems: vi.fn(async () => ({ data: [{ quantity: 3 }] })),
    },
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleStripeEvent', () => {
  it('returns duplicate when the event was already processed', async () => {
    const supabase = makeSupabaseMock({ existingEvent: { id: 'row1' } });
    const event: Stripe.Event = {
      id: 'evt_dup',
      type: 'checkout.session.completed',
      data: { object: { id: 'sess_x', metadata: {}, customer_details: { email: 'a@b.c' } } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result).toEqual({ ok: true, status: 'duplicate' });
  });

  it('records book purchase and triggers fulfillment for book_motion', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_book',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_book',
        metadata: { productType: 'book_motion', origin_site: '6identities' },
        customer_details: { email: 'reader@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock, originSiteFallback: 'six-identities' });
    expect(result.ok).toBe(true);
    expect(supabase._calls.some((c: any) => c.table === 'purchases' && c.op === 'insert')).toBe(true);
  });

  it('records implementer_cert purchase and sends cert guide when not previously fulfilled', async () => {
    const supabase = makeSupabaseMock({ insertedPurchase: { id: 'p1', fulfillment_sent_at: null } });
    const event: Stripe.Event = {
      id: 'evt_cert',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_cert',
        metadata: { productType: 'implementer_cert', origin_site: 'etfframework' },
        customer_details: { email: 'pro@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
  });

  it('activates professional portal subscription', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_portal',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_portal',
        metadata: { productType: 'practitioner_portal', userId: 'user-1' },
        customer: 'cus_x',
        subscription: 'sub_x',
        customer_details: { email: 'pro@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
    expect(supabase._calls.some((c: any) => c.table === 'professional_profiles' && c.op === 'update')).toBe(true);
  });

  it('generates practitioner_credits links by quantity', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_credits',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_credits',
        amount_total: 8990 * 5,
        metadata: { productType: 'practitioner_credits', userId: 'pract-1' },
        customer_details: { email: 'p@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
    expect(stripeMock.checkout.sessions.listLineItems).toHaveBeenCalled();
  });

  it('handles customer.subscription.updated', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_sub_update',
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_x', status: 'active' } as Stripe.Subscription },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
  });

  it('handles customer.subscription.deleted by entering grace period', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_sub_delete',
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_y', status: 'canceled' } as Stripe.Subscription },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
  });

  it('uses originSiteFallback when metadata.origin_site is missing', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_no_origin',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_no_origin',
        metadata: { productType: 'premium_results' },
        customer_details: { email: 'unknown@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock, originSiteFallback: 'etfframework' });
    expect(result.ok).toBe(true);
    const purchaseInsert = supabase._calls.find((c: any) => c.table === 'purchases' && c.op === 'insert');
    expect(purchaseInsert).toBeDefined();
    expect((purchaseInsert?.payload as any[])[0].origin_site).toBe('etfframework');
  });

  it('records a second purchase row and fulfills the bump when bumpProductType is set', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_bump',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_bump',
        metadata: {
          productType: 'premium_results',
          bumpProductType: 'book_motion_bump',
          origin_site: '6identities',
        },
        customer_details: { email: 'buyer@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    const result = await handleStripeEvent(event, supabase, { stripe: stripeMock });
    expect(result.ok).toBe(true);
    const purchaseInserts = supabase._calls.filter(
      (c: any) => c.table === 'purchases' && c.op === 'insert'
    );
    expect(purchaseInserts).toHaveLength(2);
    const products = purchaseInserts.map((c: any) => c.payload[0].product);
    expect(products).toContain('premium_results');
    expect(products).toContain('book_motion_bump');
  });

  it('ignores bumpProductType when it is not a known book product', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_bad_bump',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_bad_bump',
        metadata: {
          productType: 'premium_results',
          bumpProductType: 'not_a_real_product',
          origin_site: '6identities',
        },
        customer_details: { email: 'buyer@example.com' },
      } as Stripe.Checkout.Session },
    } as never;
    await handleStripeEvent(event, supabase, { stripe: stripeMock });
    const purchaseInserts = supabase._calls.filter(
      (c: any) => c.table === 'purchases' && c.op === 'insert'
    );
    expect(purchaseInserts).toHaveLength(1);
  });

  it('rejects non-soft-launch cohort metadata as null', async () => {
    const supabase = makeSupabaseMock();
    const event: Stripe.Event = {
      id: 'evt_bad_cohort',
      type: 'checkout.session.completed',
      data: { object: {
        id: 'sess_bad_cohort',
        metadata: { productType: 'premium_results', cohort: 'arbitrary-string' },
        customer_details: { email: 'a@b.c' },
      } as Stripe.Checkout.Session },
    } as never;
    await handleStripeEvent(event, supabase, { stripe: stripeMock });
    const purchaseInsert = supabase._calls.find((c: any) => c.table === 'purchases' && c.op === 'insert');
    expect((purchaseInsert?.payload as any[])[0].cohort).toBeNull();
  });
});

// ── Referral processing (implementer_cert + metadata.referralCode) ─────────
//
// These use a more flexible per-table mock than makeSupabaseMock above,
// since processReferral touches referral_links, user_referral_accounts,
// professional_profiles, referrals, renewal_credits, and pending_notifications
// in a single pass.

type Row = Record<string, unknown> | null;

function makeTable(defaultData: Row) {
  const calls: { insert: unknown[][]; update: unknown[][]; delete: unknown[][] } = {
    insert: [],
    update: [],
    delete: [],
  };
  const result = { data: defaultData, error: null };
  const chain: any = {
    select: (..._args: unknown[]) => chain,
    insert: (...args: unknown[]) => {
      calls.insert.push(args);
      return chain;
    },
    update: (...args: unknown[]) => {
      calls.update.push(args);
      return chain;
    },
    delete: (...args: unknown[]) => {
      calls.delete.push(args);
      return chain;
    },
    eq: (..._args: unknown[]) => chain,
    in: (..._args: unknown[]) => chain,
    order: (..._args: unknown[]) => chain,
    limit: (..._args: unknown[]) => chain,
    single: async () => result,
    maybeSingle: async () => result,
    then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
    calls,
  };
  return chain;
}

let referralTables: Record<string, ReturnType<typeof makeTable>>;

function makeReferralSupabase() {
  return {
    from: (table: string) => {
      if (!referralTables[table]) referralTables[table] = makeTable(null);
      return referralTables[table];
    },
  };
}

function makeCertCheckoutEvent(
  metadata: Record<string, string>,
  customerEmail = 'referee@example.com',
) {
  return {
    id: `evt_${Math.random().toString(36).slice(2)}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_cert_1',
        metadata,
        customer_details: { email: customerEmail },
        customer_email: customerEmail,
        amount_total: 49900,
      } as Stripe.Checkout.Session,
    },
  } as unknown as Stripe.Event;
}

describe('processReferral (via implementer_cert checkout.session.completed)', () => {
  beforeEach(() => {
    referralTables = {
      processed_webhook_events: makeTable(null),
      referral_links: makeTable({ user_id: 'referrer-1' }),
      purchases: makeTable({ id: 'purchase-1', fulfillment_sent_at: new Date().toISOString() }),
      professional_profiles: makeTable({ email: 'referrer@example.com' }),
      user_referral_accounts: makeTable(null),
      referrals: makeTable({ id: 'referral-1' }),
      renewal_credits: makeTable(null),
      pending_notifications: makeTable(null),
    };
  });

  it('issues a 10%-of-sale renewal credit for a valid, non-self referral', async () => {
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent({
      productType: 'implementer_cert',
      referralCode: 'VALIDCODE',
    });

    const result = await handleStripeEvent(event, supabase as never, { stripe: stripeMock });
    expect(result.ok).toBe(true);

    const referralInsert = referralTables.referrals.calls.insert[0]?.[0] as Record<string, unknown>;
    expect(referralInsert).toMatchObject({
      referrer_id: 'referrer-1',
      referee_email: 'referee@example.com',
      status: 'completed',
      credit_amount: 4990, // 10% of amount_total (49900)
    });

    const creditInsert = referralTables.renewal_credits.calls.insert[0]?.[0] as Record<string, unknown>;
    expect(creditInsert).toMatchObject({ user_id: 'referrer-1', amount: 4990 });
  });

  it('still issues store credit even when the referrer has an active Stripe Connect account (no transfer_data wired up yet)', async () => {
    referralTables.user_referral_accounts = makeTable({
      stripe_connect_account_id: 'acct_referrer',
      stripe_connect_status: 'active',
    });
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent({
      productType: 'implementer_cert',
      referralCode: 'CONNECTCODE',
    });

    await handleStripeEvent(event, supabase as never, { stripe: stripeMock });

    // Regression guard: previously this branch skipped renewal_credits
    // whenever hasStripeConnect was true, silently paying the referrer $0
    // since no checkout attaches a real transfer_data for cert referrals.
    expect(referralTables.renewal_credits.calls.insert).toHaveLength(1);
  });

  it('does not issue a credit when the referral code is inactive/unknown', async () => {
    referralTables.referral_links = makeTable(null);
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent({
      productType: 'implementer_cert',
      referralCode: 'DEADCODE',
    });

    await handleStripeEvent(event, supabase as never, { stripe: stripeMock });

    expect(referralTables.referrals.calls.insert).toHaveLength(0);
    expect(referralTables.renewal_credits.calls.insert).toHaveLength(0);
  });

  it('blocks self-referral by buyer userId match', async () => {
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent({
      productType: 'implementer_cert',
      referralCode: 'SELFCODE',
      userId: 'referrer-1', // same as referral_links.user_id
    });

    await handleStripeEvent(event, supabase as never, { stripe: stripeMock });

    expect(referralTables.referrals.calls.insert).toHaveLength(0);
    expect(referralTables.renewal_credits.calls.insert).toHaveLength(0);
  });

  it('blocks self-referral by matching referrer email (unauthenticated checkout)', async () => {
    referralTables.professional_profiles = makeTable({ email: 'Referrer@Example.com' });
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent(
      { productType: 'implementer_cert', referralCode: 'EMAILSELF' },
      'referrer@example.com', // same email, different case
    );

    await handleStripeEvent(event, supabase as never, { stripe: stripeMock });

    expect(referralTables.referrals.calls.insert).toHaveLength(0);
    expect(referralTables.renewal_credits.calls.insert).toHaveLength(0);
  });

  it('never calls processReferral when metadata has no referralCode', async () => {
    const supabase = makeReferralSupabase();
    const event = makeCertCheckoutEvent({ productType: 'implementer_cert' });

    await handleStripeEvent(event, supabase as never, { stripe: stripeMock });

    expect(referralTables.referrals.calls.insert).toHaveLength(0);
  });
});

// ── Refund clawback (charge.refunded) ───────────────────────────────────────

function makeRefundEvent(overrides: Partial<{ paymentIntent: string | null; amountRefunded: number }> = {}) {
  const { paymentIntent = 'pi_test_1', amountRefunded = 4990 } = overrides;
  return {
    id: `evt_refund_${Math.random().toString(36).slice(2)}`,
    type: 'charge.refunded',
    data: {
      object: {
        id: 'ch_test_1',
        payment_intent: paymentIntent,
        amount_refunded: amountRefunded,
      } as Stripe.Charge,
    },
  } as unknown as Stripe.Event;
}

describe('handleChargeRefunded (charge.refunded)', () => {
  let listSessionsMock: ReturnType<typeof vi.fn>;
  let refundStripeMock: any;

  beforeEach(() => {
    referralTables = {
      processed_webhook_events: makeTable(null),
      referrals: makeTable({ id: 'referral-1' }),
      renewal_credits: makeTable(null),
    };
    listSessionsMock = vi.fn(async () => ({ data: [{ id: 'cs_cert_1' }] }));
    refundStripeMock = {
      checkout: { sessions: { list: listSessionsMock, listLineItems: vi.fn() } },
    };
  });

  it('claws back the unapplied renewal credit for the matching referral', async () => {
    const supabase = makeReferralSupabase();
    const event = makeRefundEvent();

    const result = await handleStripeEvent(event, supabase as never, { stripe: refundStripeMock });

    expect(result.ok).toBe(true);
    expect(listSessionsMock).toHaveBeenCalledWith({ payment_intent: 'pi_test_1', limit: 1 });
    expect(referralTables.renewal_credits.calls.delete).toHaveLength(1);
  });

  it('does nothing when the charge has no payment_intent', async () => {
    const supabase = makeReferralSupabase();
    const event = makeRefundEvent({ paymentIntent: null });

    await handleStripeEvent(event, supabase as never, { stripe: refundStripeMock });

    expect(listSessionsMock).not.toHaveBeenCalled();
    expect(referralTables.renewal_credits.calls.delete).toHaveLength(0);
  });

  it('does nothing when no checkout session resolves from the payment_intent', async () => {
    listSessionsMock.mockResolvedValueOnce({ data: [] });
    const supabase = makeReferralSupabase();
    const event = makeRefundEvent();

    await handleStripeEvent(event, supabase as never, { stripe: refundStripeMock });

    expect(referralTables.renewal_credits.calls.delete).toHaveLength(0);
  });

  it('does nothing when no referral matches the resolved session', async () => {
    referralTables.referrals = makeTable(null);
    const supabase = makeReferralSupabase();
    const event = makeRefundEvent();

    await handleStripeEvent(event, supabase as never, { stripe: refundStripeMock });

    expect(referralTables.renewal_credits.calls.delete).toHaveLength(0);
  });
});
