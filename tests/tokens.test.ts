import { describe, it, expect } from 'vitest';
import {
  BRAND,
  BRAND_GOLD,
  HEADING_SCALE,
  STATUS_STYLES,
  SCORE_COLORS,
  getScoreColor,
  needsDarkTextOnBackground,
} from '../src/tokens/shared';
import { themeConfig as sixIdTheme, IDENTITY_COLORS } from '../src/tokens/6id';
import { themeConfig as etfTheme } from '../src/tokens/etfframework';

describe('tokens/shared', () => {
  it('exposes brand palette with expected primary/accent', () => {
    expect(BRAND.primary).toBe('#2D7A7B');
    expect(BRAND.accent).toBe('#C27B5C');
    expect(BRAND.gold).toBe(BRAND_GOLD);
  });

  it('HEADING_SCALE encodes the canonical h1 size', () => {
    expect(HEADING_SCALE.h1.size).toBe(44);
    expect(HEADING_SCALE.h1.lineHeight).toBe(1.15);
  });

  it('STATUS_STYLES has the five canonical statuses', () => {
    expect(Object.keys(STATUS_STYLES).sort()).toEqual(['caution', 'info', 'neutral', 'success', 'urgent']);
  });

  it('getScoreColor returns urgent/developing/strong by score thresholds', () => {
    expect(getScoreColor(5)).toBe(SCORE_COLORS.urgent);
    expect(getScoreColor(15)).toBe(SCORE_COLORS.developing);
    expect(getScoreColor(20)).toBe(SCORE_COLORS.strong);
  });

  it('needsDarkTextOnBackground returns true for very light colors', () => {
    expect(needsDarkTextOnBackground('#FFFFFF')).toBe(true);
    expect(needsDarkTextOnBackground('#000000')).toBe(false);
  });
});

describe('tokens/6id', () => {
  it('exposes IDENTITY_COLORS for all six types', () => {
    expect(Object.keys(IDENTITY_COLORS).sort()).toEqual([
      'anchor', 'catalyst', 'compass', 'mirage', 'sentinel', 'signal',
    ]);
  });

  it('themeConfig binds colorPrimary to --color-brand with terracotta fallback (§5.1)', () => {
    // v1.0.4 — site sets --color-brand in globals.css; fallback is the
    // directive's Anchor terracotta (#A04B37). Updated from the v1.0.3
    // assertion which expected the legacy brand teal #2D7A7B.
    expect(sixIdTheme.token?.colorPrimary).toBe('var(--color-brand, #A04B37)');
    expect(sixIdTheme.token?.colorInfo).toBe('var(--color-brand, #A04B37)');
  });
});

describe('tokens/etfframework', () => {
  it('themeConfig binds colorPrimary to --color-brand with navy fallback (§5.2)', () => {
    // v1.0.4 — site sets --color-brand in globals.css; fallback is the
    // directive's Downriver navy (#0A2540). Updated from the v1.0.3
    // assertion which expected the legacy brand teal #2D7A7B.
    expect(etfTheme.token?.colorPrimary).toBe('var(--color-brand, #0A2540)');
    expect(etfTheme.token?.colorInfo).toBe('var(--color-brand, #0A2540)');
    expect(etfTheme.token?.colorLink).toBe('var(--color-brand-interaction, #3656D6)');
  });
});
