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
import {
  themeConfig as sixIdTheme,
  IDENTITY_COLORS,
  SIX_ID_COLORS,
  IDENTITY_WASHES,
  SIX_ID_RADII,
  SIX_ID_SPACING,
  SIX_ID_SHADOWS,
  SIX_ID_MOTION,
  SIX_ID_WIDTHS,
} from '../src/tokens/6id';
import { themeConfig as etfTheme, ETF_COLORS, ETF_RADII, ETF_FONTS, ETF_WIDTHS } from '../src/tokens/etfframework';

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
  it('exposes display / body / mono / serif stacks', () => {
    expect(Object.keys(fonts).sort()).toEqual(['body', 'display', 'mono', 'serif']);
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
  it('exposes IDENTITY_COLORS for all six types plus mirage compat alias', () => {
    expect(Object.keys(IDENTITY_COLORS).sort()).toEqual([
      'anchor', 'catalyst', 'compass', 'mirage', 'momentum', 'sentinel', 'signal',
    ]);
  });

  it('themeConfig.colorPrimary is literal electric-blue hex — v2 design system', () => {
    expect(sixIdTheme.token?.colorPrimary).toBe('#1877F2');
    expect(sixIdTheme.token?.colorInfo).toBe('#1877F2');
    expect(sixIdTheme.token?.colorPrimary).not.toMatch(/^var\(/);
  });

  it('SIX_ID_COLORS exposes site palette with literal hex values', () => {
    expect(SIX_ID_COLORS.action).toBe('#1877F2');
    expect(SIX_ID_COLORS.bgPage).toBe('#F7F8FA');
    expect(SIX_ID_COLORS.bgNavy).toBe('#0D1B3E');
    expect(SIX_ID_COLORS.fgBody).toBe('#1E1E2E');
    expect(SIX_ID_COLORS.action).not.toMatch(/^var\(/);
  });

  it('IDENTITY_WASHES exposes tint colors for all six identity types', () => {
    expect(Object.keys(IDENTITY_WASHES).sort()).toEqual([
      'anchor', 'catalyst', 'compass', 'momentum', 'sentinel', 'signal',
    ]);
    expect(IDENTITY_WASHES.signal).toBe('#F2F5FE');
  });

  it('SIX_ID_RADII has expected pixel values', () => {
    expect(SIX_ID_RADII.sm).toBe(6);
    expect(SIX_ID_RADII.md).toBe(10);
    expect(SIX_ID_RADII.lg).toBe(14);
    expect(SIX_ID_RADII.xl).toBe(20);
    expect(SIX_ID_RADII.pill).toBe(999);
  });

  it('SIX_ID_SPACING is a 4px-base scale', () => {
    expect(SIX_ID_SPACING[1]).toBe(4);
    expect(SIX_ID_SPACING[2]).toBe(8);
    expect(SIX_ID_SPACING[6]).toBe(24);
  });

  it('SIX_ID_SHADOWS are navy-tinted rgba strings', () => {
    expect(SIX_ID_SHADOWS.xs).toMatch(/rgba\(13, 27, 62/);
    expect(SIX_ID_SHADOWS.xl).toMatch(/rgba\(13, 27, 62/);
  });

  it('SIX_ID_MOTION has expected timing values', () => {
    expect(SIX_ID_MOTION.fast).toBe(150);
    expect(SIX_ID_MOTION.base).toBe(200);
    expect(SIX_ID_MOTION.reveal).toBe(600);
  });

  it('SIX_ID_WIDTHS defines marketing/app/reading breakpoints', () => {
    expect(SIX_ID_WIDTHS.marketing).toBe(1200);
    expect(SIX_ID_WIDTHS.app).toBe(1040);
    expect(SIX_ID_WIDTHS.reading).toBe(640);
  });
});

describe('tokens/etfframework', () => {
  it('themeConfig.colorPrimary is literal forest hex — ETF Framework design system', () => {
    expect(etfTheme.token?.colorPrimary).toBe('#1A3D2B');  // forest — brand identity
    expect(etfTheme.token?.colorInfo).toBe('#1A3D2B');     // forest
    expect(etfTheme.token?.colorLink).toBe('#1A3D2B');     // forest — design system: a { color: var(--etf-forest) }
    expect(etfTheme.token?.colorPrimary).not.toMatch(/^var\(/);
  });

  it('ETF_COLORS exposes brand palette with literal hex values', () => {
    expect(ETF_COLORS.forest).toBe('#1A3D2B');
    expect(ETF_COLORS.warmWhite).toBe('#FAFAF8');
    expect(ETF_COLORS.gold).toBe('#B07B2A');
    expect(ETF_COLORS.charcoal).toBe('#1C1C1E');
    expect(ETF_COLORS.forest).not.toMatch(/^var\(/);
  });

  it('ETF_RADII has conservative institutional values', () => {
    expect(ETF_RADII.sm).toBe(4);
    expect(ETF_RADII.md).toBe(6);
    expect(ETF_RADII.lg).toBe(10);
    expect(ETF_RADII.pill).toBe(999);
  });

  it('ETF_FONTS exposes serif/body/mono stacks', () => {
    expect(Object.keys(ETF_FONTS).sort()).toEqual(['body', 'mono', 'serif']);
    expect(ETF_FONTS.serif).toMatch(/Source Serif 4/);
  });

  it('ETF_WIDTHS exposes container and navHeight', () => {
    expect(ETF_WIDTHS.container).toBe(1200);
    expect(ETF_WIDTHS.navHeight).toBe(72);
  });
});
