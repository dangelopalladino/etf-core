/**
 * Canonical Stripe Price-ID map.
 *
 * Single source of truth at runtime. Replaces `docs/stripe-catalog.md` as the
 * authoritative ledger of which env-var Price ID maps to which product type
 * across both consumer sites.
 *
 * Adding a new SKU is a `@dangelopalladino/etf-core` minor release.
 */

export type ProductType =
  // Assessment / results products
  | 'premium_results'
  | 'full_package'
  | 'premium_upgrade'
  // Way Forward modules (named by topic to match 6id implementation)
  | 'way_forward_bundle'
  | 'way_forward_career'
  | 'way_forward_relationships'
  | 'way_forward_body'
  | 'way_forward_money'
  // Books
  | 'book_motion'
  | 'book_understanding_the_crash'
  | 'book_family_playbook'
  | 'book_family_bundle'
  // Practitioner / certification
  | 'practitioner_portal'
  | 'practitioner_credits'
  | 'extra_links'
  | 'implementer_cert'
  | 'implementer_renewal'
  // Implementer license tier (etfframework.com — also sold on 6identities.com)
  | 'implementer_license'
  | 'implementer_license_renewal';

export interface PriceEntry {
  /** Env-var name holding the Stripe Price ID. Resolved at runtime. */
  envVar: string;
  /** Display amount in USD (informational; Stripe is the source of truth). */
  amountUsd: number;
  /** Stripe checkout mode. */
  mode: 'payment' | 'subscription';
  /** Optional success URL path (relative) or absolute URL override. */
  successUrl?: string;
  /** Cancel URL override. */
  cancelUrl?: string;
}

export const PRICE_MAP: Record<ProductType, PriceEntry> = {
  premium_results:        { envVar: 'STRIPE_PRICE_PREMIUM_RESULTS',      amountUsd: 9.99,  mode: 'payment' },
  full_package:           { envVar: 'STRIPE_PRICE_FULL_PACKAGE',         amountUsd: 29.99, mode: 'payment' },
  premium_upgrade:        { envVar: 'STRIPE_PRICE_PREMIUM_UPGRADE',      amountUsd: 19.99, mode: 'payment' },

  way_forward_bundle:        { envVar: 'STRIPE_PRICE_WAY_FORWARD_BUNDLE',         amountUsd: 9.99,  mode: 'payment' },
  way_forward_career:        { envVar: 'STRIPE_PRICE_WAY_FORWARD_CAREER',         amountUsd: 2.99,  mode: 'payment' },
  way_forward_relationships: { envVar: 'STRIPE_PRICE_WAY_FORWARD_RELATIONSHIPS',  amountUsd: 2.99,  mode: 'payment' },
  way_forward_body:          { envVar: 'STRIPE_PRICE_WAY_FORWARD_BODY',           amountUsd: 2.99,  mode: 'payment' },
  way_forward_money:         { envVar: 'STRIPE_PRICE_WAY_FORWARD_MONEY',          amountUsd: 2.99,  mode: 'payment' },

  book_motion:                  { envVar: 'STRIPE_PRICE_BOOK_MOTION',            amountUsd: 19.99, mode: 'payment' },
  // Both checkout routes use STRIPE_PRICE_BOOK_UTC (not STRIPE_PRICE_BOOK_UNDERSTANDING_CRASH).
  book_understanding_the_crash: { envVar: 'STRIPE_PRICE_BOOK_UTC',               amountUsd: 9.99,  mode: 'payment' },
  book_family_playbook:         { envVar: 'STRIPE_PRICE_BOOK_FAMILY_PLAYBOOK',   amountUsd: 9.99,  mode: 'payment' },
  book_family_bundle:           { envVar: 'STRIPE_PRICE_BOOK_FAMILY_BUNDLE',     amountUsd: 19.99, mode: 'payment' },

  practitioner_portal:    { envVar: 'STRIPE_PRICE_PRACTITIONER_PORTAL',   amountUsd: 49.0,  mode: 'subscription' },
  practitioner_credits:   { envVar: 'STRIPE_PRICE_PRACTITIONER_CREDITS',  amountUsd: 8.99,  mode: 'payment' },
  extra_links:            { envVar: 'STRIPE_PRICE_EXTRA_LINKS',           amountUsd: 5.99,  mode: 'payment' },

  implementer_cert:    { envVar: 'STRIPE_PRICE_IMPLEMENTER_CERT',     amountUsd: 99.0,  mode: 'payment',
    // ETF routes through /purchase/success (which links to the 6id LMS). If ETF builds
    // its own LMS route, swap this to 'https://etfframework.com/certification/modules?success=true'.
    // See docs/architecture/cert-lms-migration-plan.md.
    successUrl: 'https://6identities.com/professionals/certification/modules?success=true' },
  implementer_renewal: { envVar: 'STRIPE_PRICE_IMPLEMENTER_RENEWAL',  amountUsd: 49.0,  mode: 'subscription' },

  implementer_license:          { envVar: 'STRIPE_PRICE_IMPLEMENTER_LICENSE',          amountUsd: 99.0, mode: 'payment',      successUrl: '/implementer/success' },
  implementer_license_renewal:  { envVar: 'STRIPE_PRICE_IMPLEMENTER_LICENSE_RENEWAL',  amountUsd: 49.0, mode: 'subscription', successUrl: '/implementer/success' },
};

export function resolvePriceId(productType: ProductType): string | null {
  const entry = PRICE_MAP[productType];
  if (!entry) return null;
  return process.env[entry.envVar] ?? null;
}

export const BOOK_PRODUCT_TYPES = new Set<ProductType>([
  'book_motion',
  'book_understanding_the_crash',
  'book_family_playbook',
  'book_family_bundle',
]);

export const PROFESSIONAL_PRODUCT_TYPES = new Set<ProductType>([
  'practitioner_portal',
  'practitioner_credits',
  'extra_links',
  'implementer_cert',
  'implementer_renewal',
  'implementer_license',
  'implementer_license_renewal',
]);
