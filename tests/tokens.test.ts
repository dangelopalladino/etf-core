import { describe, it, expect } from 'vitest';
import {
  BRAND,
  BRAND_GOLD,
  HEADING_SCALE,
  STATUS_STYLES,
  SCORE_COLORS,
  baseThemeConfig,
  fonts,
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

  it('baseThemeConfig fontFamily references fonts.body (General Sans, v1.1.0)', () => {
    // v1.1.0 drops the site-supplied var(--font-sans) binding in favor of
    // a direct General Sans stack baked upstream. Sites load the woff2
    // files; etf-core declares the stack.
    expect(baseThemeConfig.token?.fontFamily).toBe(fonts.body);
    expect(baseThemeConfig.token?.fontFamily).not.toMatch(/var\(/);
  });
});

describe('tokens/shared fonts (v1.1.0)', () => {
  it('exposes display / body / mono stacks', () => {
    expect(Object.keys(fonts).sort()).toEqual(['body', 'display', 'mono']);
  });

  it('display and body start with General Sans', () => {
    expect(fonts.display).toMatch(/^'General Sans'/);
    expect(fonts.body).toMatch(/^'General Sans'/);
  });

  it('mono starts with JetBrains Mono', () => {
    expect(fonts.mono).toMatch(/^'JetBrains Mono'/);
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
