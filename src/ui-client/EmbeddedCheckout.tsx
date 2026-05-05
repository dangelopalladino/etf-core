'use client';

import React, { useMemo } from 'react';
// Optional peer deps. Sites that import this component must install
// `@stripe/stripe-js` and `@stripe/react-stripe-js`. We import lazily-typed so
// `@dangelopalladino/etf-core` itself doesn't fail to install for non-checkout
// consumers (these aren't in `peerDependencies` — they're only needed by sites
// that actually mount the embedded checkout).
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckout as StripeEmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';

export interface EmbeddedCheckoutProps {
  /** `pk_live_…` / `pk_test_…` from `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. */
  publishableKey: string | null | undefined;
  /** Client secret returned by `/api/checkout`. */
  clientSecret: string;
  /** Optional className passed to the outer wrapper. */
  className?: string;
}

/**
 * Memoized loadStripe — called once per publishable key, per page lifetime.
 * `loadStripe` is cheap to call repeatedly (it caches internally) but Stripe's
 * docs are explicit about hoisting it out of the render path, so we cache the
 * promise per key.
 */
const stripePromiseCache = new Map<string, Promise<Stripe | null>>();
function getStripePromise(key: string | null | undefined): Promise<Stripe | null> {
  if (!key) return Promise.resolve(null);
  let p = stripePromiseCache.get(key);
  if (!p) {
    p = loadStripe(key);
    stripePromiseCache.set(key, p);
  }
  return p;
}

/**
 * Shared embedded Stripe Checkout mount.
 *
 * Both consumer sites render this on `/checkout` after fetching a
 * `clientSecret` from their own `/api/checkout` POST. Data-fetching is left to
 * the caller because each site's request shape differs (legacy aliases,
 * test-mode price_data, license tiers, etc.); this component owns only the
 * Stripe.js initialization and provider wiring.
 *
 * If `publishableKey` is missing the component renders nothing — callers
 * should surface an upstream error in that case.
 */
export function EmbeddedCheckout({
  publishableKey,
  clientSecret,
  className,
}: EmbeddedCheckoutProps): React.ReactElement | null {
  const stripePromise = useMemo(
    () => getStripePromise(publishableKey),
    [publishableKey],
  );

  if (!publishableKey) return null;

  return (
    <div className={className}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <StripeEmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default EmbeddedCheckout;
