import { describe, it, expect } from 'vitest';
import { withUtm } from '../../src/utils/withUtm';

describe('utils/withUtm', () => {
  it('tags a bare URL with source/medium/campaign for 6identities', () => {
    const out = withUtm('https://etfframework.com/pricing', '6identities', 'footer');
    const url = new URL(out);
    expect(url.searchParams.get('utm_source')).toBe('6identities');
    expect(url.searchParams.get('utm_medium')).toBe('cross_brand');
    expect(url.searchParams.get('utm_campaign')).toBe('footer');
  });

  it('tags a bare URL for etfframework side', () => {
    const out = withUtm('https://6identities.com/quiz', 'etfframework', 'professionals');
    const url = new URL(out);
    expect(url.searchParams.get('utm_source')).toBe('etfframework');
    expect(url.searchParams.get('utm_medium')).toBe('cross_brand');
    expect(url.searchParams.get('utm_campaign')).toBe('professionals');
  });

  it('preserves unrelated pre-existing query params', () => {
    const out = withUtm(
      'https://etfframework.com/methodology?ref=oldparam&page=2',
      '6identities',
      'methodology'
    );
    const url = new URL(out);
    expect(url.searchParams.get('ref')).toBe('oldparam');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('utm_source')).toBe('6identities');
    expect(url.searchParams.get('utm_campaign')).toBe('methodology');
  });

  it('overwrites any pre-existing utm_* params (set semantics)', () => {
    const out = withUtm(
      'https://etfframework.com/?utm_source=stale&utm_campaign=old',
      '6identities',
      'nav'
    );
    const url = new URL(out);
    expect(url.searchParams.get('utm_source')).toBe('6identities');
    expect(url.searchParams.get('utm_campaign')).toBe('nav');
    expect(url.searchParams.get('utm_medium')).toBe('cross_brand');
  });

  it('handles all four canonical campaigns', () => {
    for (const campaign of ['footer', 'professionals', 'methodology', 'nav'] as const) {
      const url = new URL(withUtm('https://etfframework.com/', '6identities', campaign));
      expect(url.searchParams.get('utm_campaign')).toBe(campaign);
    }
  });
});
