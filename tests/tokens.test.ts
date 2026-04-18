import { describe, it, expect } from 'vitest';
import {
  BRAND,
  BRAND_GOLD,
  HEADING_SCALE,
  STATUS_STYLES,
  SCORE_COLORS,
  baseThemeConfig,
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

  // v1.0.6 — locks in the literal-hex shape. v1.0.4 enabled cssVar mode
  // and used var(--color-brand, …) strings in token color values; v1.0.5
  // tried to disable cssVar mode; both rendered primary buttons #000000
  // because AntD v6 keeps cssVar-mode classes active regardless of config
  // and its color parser cannot evaluate var() strings. v1.0.6 abandons
  // var() in token color values entirely — sites get a literal hex baked
  // into the upstream tokens file.
  it('baseThemeConfig does NOT enable cssVar mode', () => {
    expect(baseThemeConfig.cssVar).toBeUndefined();
    expect(baseThemeConfig.hashed).toBeUndefined();
  });

  it('baseThemeConfig colorPrimary is literal hex (no var()) — v1.0.6 fix', () => {
    expect(baseThemeConfig.token?.colorPrimary).toBe('#2D7A7B');
    expect(baseThemeConfig.token?.colorInfo).toBe('#2D7A7B');
    // Negative assertion: no var() string allowed. Catches regression to
    // the v1.0.4/v1.0.5 var(--color-brand, …) approach.
    expect(baseThemeConfig.token?.colorPrimary).not.toMatch(/^var\(/);
  });

  it('baseThemeConfig fontFamily MAY contain var() (font parser accepts it)', () => {
    // fontFamily is the one place var() works because AntD does not try
    // to parse it as a color. Inter is delivered by site via next/font.
    expect(baseThemeConfig.token?.fontFamily).toMatch(/var\(--font-sans\)/);
  });
});

describe('tokens/6id', () => {
  it('exposes IDENTITY_COLORS for all six types', () => {
    expect(Object.keys(IDENTITY_COLORS).sort()).toEqual([
      'anchor', 'catalyst', 'compass', 'mirage', 'sentinel', 'signal',
    ]);
  });

  it('themeConfig.colorPrimary is literal terracotta hex (§5.1)', () => {
    expect(sixIdTheme.token?.colorPrimary).toBe('#A04B37');
    expect(sixIdTheme.token?.colorInfo).toBe('#A04B37');
    expect(sixIdTheme.token?.colorPrimary).not.toMatch(/^var\(/);
  });
});

describe('tokens/etfframework', () => {
  it('themeConfig.colorPrimary is literal navy hex (§5.2)', () => {
    expect(etfTheme.token?.colorPrimary).toBe('#0A2540');
    expect(etfTheme.token?.colorInfo).toBe('#0A2540');
    expect(etfTheme.token?.colorLink).toBe('#3656D6');
    expect(etfTheme.token?.colorPrimary).not.toMatch(/^var\(/);
  });
});
