import 'server-only';
import type Stripe from 'stripe';

/**
 * Embedded Stripe Checkout helpers.
 *
 * Both consumer sites (6identities.com, etfframework.com) migrated their
 * `/api/checkout` route from the hosted redirect (`session.url`) to embedded
 * checkout (`ui_mode: 'embedded_page'`, returning `{ clientSecret, sessionId }`)
 * with an inline `<EmbeddedCheckout>` mount on `/checkout` and a
 * `/checkout/return` post-payment route.
 *
 * This module is the canonical contract: response types, a thin
 * `createEmbeddedCheckoutSession` wrapper that enforces `ui_mode` and
 * `return_url`, and a `retrieveCheckoutSessionStatus` helper for the return
 * page. Sites stay in charge of price resolution, line-item shape, optional
 * items (e.g. order bumps), test-mode price_data, and metadata composition —
 * those vary per site and we don't want one to drift from the other behind a
 * shared abstraction.
 */

/** Response body returned by an embedded checkout endpoint to the browser. */
export interface EmbeddedCheckoutSessionResponse {
  clientSecret: string;
  sessionId: string;
}

/** Standard error shape used by both sites' `/api/checkout` routes. */
export interface CheckoutErrorResponse {
  error: string;
}

/** Subset of session fields the `/checkout/return` page consults. */
export interface CheckoutSessionStatus {
  status: Stripe.Checkout.Session.Status | null;
  paymentStatus: Stripe.Checkout.Session.PaymentStatus | null;
  metadata: Record<string, string> | null;
}

/**
 * Params accepted by `createEmbeddedCheckoutSession`. Mirrors
 * `Stripe.Checkout.SessionCreateParams` with `ui_mode` and `return_url`
 * forced. `success_url` and `cancel_url` are intentionally absent — they're
 * incompatible with embedded mode.
 */
export type CreateEmbeddedCheckoutSessionParams = Omit<
  Stripe.Checkout.SessionCreateParams,
  'ui_mode' | 'return_url' | 'success_url' | 'cancel_url'
> & {
  /** Absolute URL Stripe redirects to after payment. Must include
   *  `{CHECKOUT_SESSION_ID}` so the return page can retrieve the session. */
  returnUrl: string;
};

/**
 * Build the canonical embedded return URL for a site.
 * Both sites use the same `/checkout/return?session_id={CHECKOUT_SESSION_ID}`
 * shape; centralize the literal here so a future change is one edit.
 */
export function buildEmbeddedReturnUrl(siteUrl: string): string {
  const trimmed = siteUrl.replace(/\/+$/, '');
  return `${trimmed}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
}

/**
 * Create an embedded Stripe Checkout Session. Forces `ui_mode: 'embedded_page'`
 * and the `return_url`; everything else (line_items, mode, metadata,
 * optional_items, automatic_tax, allow_promotion_codes, customer_email …)
 * is passed through unchanged.
 */
export async function createEmbeddedCheckoutSession(
  stripe: Stripe,
  params: CreateEmbeddedCheckoutSessionParams,
): Promise<EmbeddedCheckoutSessionResponse> {
  const { returnUrl, ...rest } = params;
  const session = await stripe.checkout.sessions.create({
    ...rest,
    ui_mode: 'embedded_page',
    return_url: returnUrl,
  });

  if (!session.client_secret) {
    throw new Error(
      'Stripe did not return a client_secret for the embedded session. ' +
        'Confirm the Stripe API version supports `ui_mode: embedded_page`.',
    );
  }

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
  };
}

/**
 * Retrieve a session's status for the `/checkout/return` page. Returns a
 * normalized subset that's safe to expose to the client.
 */
export async function retrieveCheckoutSessionStatus(
  stripe: Stripe,
  sessionId: string,
): Promise<CheckoutSessionStatus> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return {
    status: session.status ?? null,
    paymentStatus: session.payment_status ?? null,
    metadata: (session.metadata as Record<string, string> | null) ?? null,
  };
}
