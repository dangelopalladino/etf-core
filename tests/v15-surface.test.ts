import { describe, it, expect } from 'vitest';
import {
  BREAKPOINTS,
  STATE_TONES,
  STATE_TONE_TO_STATUS,
  STATE_TONE_STYLES,
  EMAIL_SAFE_TOKENS,
  SHARED_SPACING_SCALE,
  SHARED_RADIUS_SCALE,
  SHARED_MOTION,
  FOCUS_RING_TOKENS,
  HEADING_CLASSES,
  HEADING_SCALE,
  STATUS_STYLES,
  BRAND,
  space,
  radius,
  motion,
  focusRing,
} from '../src/tokens/shared';
import { brandShadows, brandRadius, brandMotion, brandFocusRing } from '../src/brand/brandHelpers';
import { getBrand } from '../src/brand/getBrand';

describe('v1.5 surface — tokens/shared additions', () => {
  it('BREAKPOINTS uses min-width values only (mobile-first)', () => {
    expect(BREAKPOINTS.base).toBe(0);
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
  });

  it('STATE_TONES is the canonical 7-tone vocabulary', () => {
    expect([...STATE_TONES].sort()).toEqual(
      ['caution', 'info', 'loading', 'locked', 'neutral', 'success', 'urgent']
    );
  });

  it('STATE_TONE_TO_STATUS maps locked + loading onto neutral', () => {
    expect(STATE_TONE_TO_STATUS.locked).toBe('neutral');
    expect(STATE_TONE_TO_STATUS.loading).toBe('neutral');
    expect(STATE_TONE_TO_STATUS.urgent).toBe('urgent');
  });

  it('STATE_TONE_STYLES resolves every tone to a palette object', () => {
    for (const tone of STATE_TONES) {
      const style = STATE_TONE_STYLES[tone];
      expect(style).toBeTruthy();
      expect(style.bg).toMatch(/^#/);
      expect(style.border).toMatch(/^#/);
      expect(style.text).toMatch(/^#/);
    }
  });

  it('STATE_TONE_STYLES.locked and .loading mirror STATUS_STYLES.neutral', () => {
    expect(STATE_TONE_STYLES.locked).toEqual(STATUS_STYLES.neutral);
    expect(STATE_TONE_STYLES.loading).toEqual(STATUS_STYLES.neutral);
  });

  it('EMAIL_SAFE_TOKENS exposes resolved hex literals', () => {
    expect(EMAIL_SAFE_TOKENS.brandPrimary).toBe(BRAND.primary);
    expect(EMAIL_SAFE_TOKENS.white).toBe('#FFFFFF');
    expect(EMAIL_SAFE_TOKENS.black).toBe('#000000');
  });

  it('SHARED_SPACING_SCALE is monotonically non-decreasing', () => {
    const entries = Object.entries(SHARED_SPACING_SCALE).map(([k, v]) => [Number(k), v] as const);
    entries.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < entries.length; i += 1) {
      expect(entries[i][1]).toBeGreaterThanOrEqual(entries[i - 1][1]);
    }
  });

  it('SHARED_RADIUS_SCALE caps at 20 (rounded-3xl ban)', () => {
    expect(Math.max(...Object.values(SHARED_RADIUS_SCALE))).toBeLessThanOrEqual(20);
  });

  it('SHARED_MOTION provides the 4 canonical durations', () => {
    expect(Object.keys(SHARED_MOTION).sort()).toEqual(['base', 'fast', 'reveal', 'slow']);
  });

  it('FOCUS_RING_TOKENS covers all three brands', () => {
    expect(Object.keys(FOCUS_RING_TOKENS).sort()).toEqual(['6id', 'etf', 'shared']);
    for (const [, ring] of Object.entries(FOCUS_RING_TOKENS)) {
      expect(ring.shadow).toMatch(/^0 0 0 \dpx /);
    }
  });

  it('HEADING_CLASSES is mobile-first (md:/lg: only, no max-width queries)', () => {
    for (const value of Object.values(HEADING_CLASSES)) {
      expect(value).not.toMatch(/max-width/);
      expect(value).not.toMatch(/max-w:/);
      // Each h-level mentions a base text size before any md:/lg:.
      expect(value).toMatch(/^text-\[\d+px\]/);
    }
  });

  it('HEADING_CLASSES stays in sync with HEADING_SCALE for h1–h4', () => {
    // h1 mobile size 30, md 36, lg 44
    expect(HEADING_CLASSES.h1).toContain(`text-[${HEADING_SCALE.h1.mobileSize}px]`);
    expect(HEADING_CLASSES.h1).toContain(`md:text-[${HEADING_SCALE.h1.tabletSize}px]`);
    expect(HEADING_CLASSES.h1).toContain(`lg:text-[${HEADING_SCALE.h1.size}px]`);
    // h2/h3/h4 base = mobileSize, md = size
    expect(HEADING_CLASSES.h2).toContain(`text-[${HEADING_SCALE.h2.mobileSize}px]`);
    expect(HEADING_CLASSES.h2).toContain(`md:text-[${HEADING_SCALE.h2.size}px]`);
    expect(HEADING_CLASSES.h3).toContain(`text-[${HEADING_SCALE.h3.mobileSize}px]`);
    expect(HEADING_CLASSES.h3).toContain(`md:text-[${HEADING_SCALE.h3.size}px]`);
    expect(HEADING_CLASSES.h4).toContain(`text-[${HEADING_SCALE.h4.mobileSize}px]`);
    expect(HEADING_CLASSES.h4).toContain(`md:text-[${HEADING_SCALE.h4.size}px]`);
  });
});

describe('v1.5 surface — helpers', () => {
  it('space() looks up SHARED_SPACING_SCALE entries', () => {
    expect(space(0)).toBe(0);
    expect(space(4)).toBe(16);
    expect(space(8)).toBe(32);
    expect(space(30)).toBe(120);
  });

  it('radius() looks up canonical keys; defaults md on unknown', () => {
    expect(radius('none')).toBe(0);
    expect(radius('md')).toBe(8);
    expect(radius('xl')).toBe(20);
  });

  it('motion() returns ms', () => {
    expect(motion('fast')).toBe(120);
    expect(motion('base')).toBe(180);
    expect(motion('slow')).toBe(280);
    expect(motion('reveal')).toBe(600);
  });

  it('focusRing() defaults to shared and resolves per-brand', () => {
    expect(focusRing()).toBe(FOCUS_RING_TOKENS.shared.shadow);
    expect(focusRing('etf')).toBe(FOCUS_RING_TOKENS.etf.shadow);
    expect(focusRing('6id')).toBe(FOCUS_RING_TOKENS['6id'].shadow);
  });
});

describe('v1.5 surface — brand helpers', () => {
  it('brandShadows always returns the BLUEPRINT 3-token cap', () => {
    const s = brandShadows('etf');
    expect(Object.keys(s).sort()).toEqual(['none', 'overlay', 'subtle']);
    expect(brandShadows('6id')).toBe(s);
    expect(brandShadows('shared')).toBe(s);
  });

  it('brandRadius applies ETF cap on xl', () => {
    expect(brandRadius('etf', 'xl')).toBe(10);
    expect(brandRadius('6id', 'xl')).toBe(20);
    expect(brandRadius('shared', 'xl')).toBe(20);
    expect(brandRadius('etf', 'md')).toBe(8);
  });

  it('brandMotion resolves per-brand', () => {
    expect(brandMotion('etf', 'base')).toBe(180);
    expect(brandMotion('6id', 'base')).toBe(200);
    expect(brandMotion('shared', 'base')).toBe(180);
    expect(brandMotion('etf', 'reveal')).toBe(600);
  });

  it('brandFocusRing matches FOCUS_RING_TOKENS by brand', () => {
    expect(brandFocusRing('etf')).toBe(FOCUS_RING_TOKENS.etf.shadow);
    expect(brandFocusRing('6id')).toBe(FOCUS_RING_TOKENS['6id'].shadow);
    expect(brandFocusRing('shared')).toBe(FOCUS_RING_TOKENS.shared.shadow);
  });

  it('getBrand() returns the safe shared default in v1.5', () => {
    expect(getBrand()).toBe('shared');
  });
});
