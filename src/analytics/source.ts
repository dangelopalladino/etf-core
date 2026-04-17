/**
 * Origin-site + cohort attribution helpers.
 *
 * `origin_site` distinguishes which sibling domain generated an event when the
 * GA4 property is shared. `cohort` namespace ('soft-launch-...') is enforced
 * here to keep the column controlled.
 */

export type OriginSite = '6identities' | 'etfframework';

export function isOriginSite(value: unknown): value is OriginSite {
  return value === '6identities' || value === 'etfframework';
}

export function safeCohort(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.startsWith('soft-launch-') ? value : null;
}
