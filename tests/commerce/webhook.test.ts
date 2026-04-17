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
