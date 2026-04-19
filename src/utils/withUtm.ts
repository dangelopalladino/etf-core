// Cross-brand attribution helper. Replaces ad-hoc ?ref=etfframework strings
// across both sites with a single tagged URL shape GA4 can resolve to a
// consistent utm_source / utm_medium / utm_campaign triple.
//
// Per docs/canonical-patches/2026-04-phase-a.md §B.2.

export type Site = '6identities' | 'etfframework';

export type Campaign = 'footer' | 'professionals' | 'methodology' | 'nav';

export function withUtm(
  href: string,
  source: Site,
  campaign: Campaign
): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'cross_brand');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}
