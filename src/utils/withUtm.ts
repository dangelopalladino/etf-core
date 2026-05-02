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
  // Cross-brand attribution is meaningful only across origins. Pass-through
  // relative or protocol-less hrefs unchanged so consumers can pipe internal
  // links through `withUtm` defensively without crashing on `/professionals`
  // style values. `URL.canParse` (Node 18.17+ / modern browsers) avoids the
  // try/catch dance.
  if (!URL.canParse(href)) return href;
  const url = new URL(href);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'cross_brand');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}
