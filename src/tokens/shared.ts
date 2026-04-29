/**
 * Shared design tokens for both 6identities and etfframework sites.
 *
 * Tokens here apply to BOTH brands. Site-specific overrides live in
 * `tokens/6id.ts` and `tokens/etfframework.ts`. Both site repos consume their
 * respective module via a one-line re-export shim in `src/lib/antd-theme.ts`.
 *
 * Brand Guide Reference: /Brand Direction Package Markdown.md
 */

import type { ThemeConfig } from 'antd';

// ─── Brand Accent — muted gold for badges, certifications, practitioner elements ───
export const BRAND_GOLD = '#C9A96E';

// ─── Score Bar Colors ───
export const SCORE_COLORS = {
  urgent:     '#E74C3C',  // 0-10
  developing: '#C27B5C',  // 11-17
  strong:     '#4BA86A',  // 18-25
} as const;

// ─── Heading Scale — SINGLE SOURCE OF TRUTH ───
// Both AntD themeConfig and ServerTypography consume these constants.
export const HEADING_SCALE = {
  h1: { size: 44, mobileSize: 30, tabletSize: 36, lineHeight: 1.15, tracking: '-0.02em', trackingLg: '-0.03em' },
  h2: { size: 30, mobileSize: 24, lineHeight: 1.2 },
  h3: { size: 24, mobileSize: 20, lineHeight: 1.25 },
  h4: { size: 20, mobileSize: 16, lineHeight: 1.3 },
  h5: { size: 16, mobileSize: 14, lineHeight: 1.4 },
} as const;

// ─── Functional Status Styles — UI meaning ONLY ───
export const STATUS_STYLES = {
  urgent:  { bg: '#FDF2F0', border: '#E8C4BE', text: '#B83A2A' },
  caution: { bg: '#FDF8EE', border: '#E8D9B8', text: '#9A7B3C' },
  info:    { bg: '#F0F7F7', border: '#B8D8D8', text: '#1F6060' },
  success: { bg: '#F2F8F4', border: '#B8D8C0', text: '#2D7A42' },
  neutral: { bg: '#F5F2EE', border: '#DDD6CC', text: '#6B6560' },
} as const;

export type StatusType = keyof typeof STATUS_STYLES;

// ─── Surface Tokens ───
export const SURFACE_TOKENS = {
  ground:   '#EDE6DA',
  default:  '#F5EFE6',
  raised:   '#FAF5EE',
  elevated: '#FFFFFF',
} as const;

// ─── Border Tokens ───
export const BORDER_TOKENS = {
  subtle:   '#F0E8DF',
  default:  '#E5DDD4',
  emphasis: '#D4CBC0',
} as const;

// ─── Shadow Tokens — warm-tinted depth system ───
/**
 * @deprecated Use {@link BLUEPRINT_SHADOWS} instead. Migration map:
 *   xs/sm → BLUEPRINT_SHADOWS.subtle
 *   md/lg/xl → BLUEPRINT_SHADOWS.overlay
 * Removal scheduled for v2.0 (semver-major). Retained in v1.5 for binary
 * compatibility with consumer apps already importing SHADOW_TOKENS.
 */
export const SHADOW_TOKENS = {
  xs:  '0 1px 2px rgba(58, 54, 50, 0.04)',
  sm:  '0 2px 8px rgba(58, 54, 50, 0.06)',
  md:  '0 4px 16px rgba(58, 54, 50, 0.08), 0 1px 4px rgba(58, 54, 50, 0.04)',
  lg:  '0 8px 32px rgba(58, 54, 50, 0.10), 0 2px 8px rgba(58, 54, 50, 0.05)',
  xl:  '0 16px 48px rgba(58, 54, 50, 0.12), 0 4px 16px rgba(58, 54, 50, 0.06)',
} as const;

// ─── BLUEPRINT_SHADOWS — directive §5.3 3-token cap ───
// AntD baseThemeConfig consumes these so the rendered shadow set is
// directive-compliant (≤ 3 unique box-shadow values per Eight-Number Audit).
// Sites can override at the var(--shadow-*) level via tokens.css if needed.
export const BLUEPRINT_SHADOWS = {
  none:    'none',
  subtle:  '0 1px 3px rgba(0, 0, 0, 0.04)',
  overlay: '0 8px 24px rgba(58, 54, 50, 0.12)',
} as const;

// ─── WCAG Contrast Utility ───
export function needsDarkTextOnBackground(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return (1.05) / (L + 0.05) < 4.5;
}

// ─── BRAND object — for Satori OG, react-pdf, share cards ───
export const BRAND = {
  primary:        '#2D7A7B',
  accent:         '#C27B5C',
  background:     SURFACE_TOKENS.raised,
  surface:        SURFACE_TOKENS.default,
  surfaceGround:  SURFACE_TOKENS.ground,
  foreground:     '#3A3632',
  textSecondary:  '#6B6560',
  textMuted:      '#A8A29E',
  border:         BORDER_TOKENS.default,
  borderSubtle:   BORDER_TOKENS.subtle,
  borderEmphasis: BORDER_TOKENS.emphasis,
  gold:           BRAND_GOLD,
  white:          SURFACE_TOKENS.elevated,
} as const;

/** Score bar color by numeric score value. */
export function getScoreColor(score: number): string {
  if (score <= 10) return SCORE_COLORS.urgent;
  if (score <= 17) return SCORE_COLORS.developing;
  return SCORE_COLORS.strong;
}

/**
 * Base AntD theme shared by both sites. Site-specific layers add identity
 * colors, dark mode, additional component overrides.
 *
 * v1.0.6 — Drops `var(--color-brand, …)` from token color values.
 * AntD v6's CSS-var-mode generator could not parse var() strings as
 * colors and emitted `--ant-color-primary: #000000` (black). Even with
 * cssVar config removed, AntD v6 enables CSS-var-mode classes regardless
 * of explicit configuration; the only path that consistently renders the
 * brand color is to pass a literal hex into the AntD token. Sites that
 * want runtime brand override can still use `--color-brand` in their own
 * non-AntD CSS — but AntD itself gets a hex.
 *
 * What this means in practice: each site bakes its brand into the
 * upstream token file. `tokens/6id.themeConfig.colorPrimary = '#A04B37'`
 * (terracotta per §5.1). `tokens/etfframework.themeConfig.colorPrimary
 * = '#0A2540'` (navy per §5.2). Adding a third site means adding a third
 * tokens file with its own hex.
 *
 * baseThemeConfig keeps the legacy teal `#2D7A7B` as a sensible default
 * for any consumer that doesn't override at the per-site layer.
 *
 * Everything else from v1.0.4/v1.0.5 stays — 4-radii cap, BLUEPRINT_SHADOWS,
 * focus ring, no-shadow Buttons. As of v1.1.0 the font stack is General Sans
 * (see `fonts` export below); sites serve the woff2 files from their own
 * public/ directories.
 */

// ─── Font stacks (v1.1.0) — General Sans per canonical §6.x ───
// Declaration only: etf-core does not ship the woff2 files in the tarball.
// Each consumer site is responsible for loading General Sans (and JetBrains
// Mono for code blocks) via next/font or a site-level @font-face rule.
export const fonts = {
  display: "'General Sans', Georgia, 'Times New Roman', serif",
  body: "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
  serif: "'Source Serif 4', Georgia, serif",
} as const;

export const baseThemeConfig: ThemeConfig = {
  token: {
    colorPrimary:       '#2D7A7B',
    colorLink:          '#C27B5C',
    colorSuccess:       '#4BA86A',
    colorWarning:       '#D4A853',
    colorError:         '#E74C3C',
    colorInfo:          '#2D7A7B',
    colorBgBase:        '#FAF5EE',
    colorBgContainer:   '#FFFFFF',
    colorBgLayout:      '#F5EFE6',
    colorBorder:        '#E5DDD4',
    colorBorderSecondary: '#F0E8DF',
    colorTextBase:      '#3A3632',
    colorTextSecondary: '#6B6560',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 1.57,
    fontSizeHeading1: HEADING_SCALE.h1.size,
    fontSizeHeading2: HEADING_SCALE.h2.size,
    fontSizeHeading3: HEADING_SCALE.h3.size,
    fontSizeHeading4: HEADING_SCALE.h4.size,
    fontSizeHeading5: HEADING_SCALE.h5.size,
    lineHeightHeading1: HEADING_SCALE.h1.lineHeight,
    lineHeightHeading2: HEADING_SCALE.h2.lineHeight,
    lineHeightHeading3: HEADING_SCALE.h3.lineHeight,
    lineHeightHeading4: HEADING_SCALE.h4.lineHeight,
    lineHeightHeading5: HEADING_SCALE.h5.lineHeight,
    boxShadow:          BLUEPRINT_SHADOWS.subtle,
    boxShadowSecondary: BLUEPRINT_SHADOWS.overlay,
    boxShadowTertiary:  BLUEPRINT_SHADOWS.none,
    borderRadius: 6,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 4,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    lineWidthFocus: 2,
  },
  components: {
    Button: {
      borderRadius: 9999,
      controlHeight: 44,
      controlHeightLG: 52,
      paddingInline: 28,
      fontWeight: 600,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
    },
    Card:      { borderRadiusLG: 12, paddingLG: 32 },
    Input:     { borderRadius: 8, controlHeight: 44, paddingInline: 16 },
    Modal:     { borderRadiusLG: 12 },
    Menu:      { itemBorderRadius: 8 },
    Typography:{ fontWeightStrong: 700 },
    Form:      { itemMarginBottom: 20 },
    Divider:   { colorSplit: '#E5DDD4' },
  },
};

// ───────────────────────────────────────────────────────────────────────────
// v1.5 ADDITIVE SURFACE — additions only; no existing export above is touched.
// All new types/values default to 'shared' brand and degrade safely when no
// <BrandProvider> is present (production state for both consumer apps).
// ───────────────────────────────────────────────────────────────────────────

/** Brand identity. 'shared' is the safe fallback used when no BrandProvider wraps the tree. */
export type Brand = 'etf' | '6id' | 'shared';

/** Mobile-first responsive breakpoints. min-width only. Used by primitives' JSDoc and DESIGN.md. */
export const BREAKPOINTS = {
  /** 320px — base layer. Every primitive's default styles target this width. */
  base: 0,
  /** 640px — tablets in portrait, large phones in landscape. */
  sm: 640,
  /** 768px — tablets in landscape, small laptops. */
  md: 768,
  /** 1024px — laptops, desktop. */
  lg: 1024,
  /** 1280px — large desktop. */
  xl: 1280,
} as const;
export type BreakpointKey = keyof typeof BREAKPOINTS;

/** State tone vocabulary used by NoticeCard, EmptyState, IconBadge, StatusBadge composition. */
export const STATE_TONES = ['urgent', 'caution', 'info', 'success', 'neutral', 'locked', 'loading'] as const;
export type StateTone = typeof STATE_TONES[number];

/** Tone → STATUS_STYLES key mapping. locked/loading collapse onto 'neutral' for color resolution. */
export const STATE_TONE_TO_STATUS: Record<StateTone, StatusType> = {
  urgent:  'urgent',
  caution: 'caution',
  info:    'info',
  success: 'success',
  neutral: 'neutral',
  locked:  'neutral',
  loading: 'neutral',
};

/** Resolved STATUS_STYLES per tone. New code should prefer this over reaching into STATUS_STYLES. */
export const STATE_TONE_STYLES: Record<StateTone, { bg: string; border: string; text: string }> = {
  urgent:  STATUS_STYLES.urgent,
  caution: STATUS_STYLES.caution,
  info:    STATUS_STYLES.info,
  success: STATUS_STYLES.success,
  neutral: STATUS_STYLES.neutral,
  locked:  STATUS_STYLES.neutral,
  loading: STATUS_STYLES.neutral,
};

/**
 * Email-safe tokens — resolved hex literals for HTML email contexts where CSS
 * variables and design-token modules don't resolve. Consumers may reference
 * these in inline style strings inside react-email templates.
 */
export const EMAIL_SAFE_TOKENS = {
  brandPrimary:  BRAND.primary,
  brandAccent:   BRAND.accent,
  surface:       SURFACE_TOKENS.default,
  surfaceRaised: SURFACE_TOKENS.raised,
  border:        BORDER_TOKENS.default,
  text:          BRAND.foreground,
  textMuted:     BRAND.textMuted,
  white:         '#FFFFFF',
  black:         '#000000',
} as const;

/** Shared spacing scale (px). Used by space() helper. */
export const SHARED_SPACING_SCALE = {
  0:   0,
  1:   4,
  2:   8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  8:   32,
  10:  40,
  12:  48,
  14:  56,
  16:  64,
  20:  80,
  24:  96,
  30:  120,
} as const;
export type SpaceKey = keyof typeof SHARED_SPACING_SCALE;

/** Shared radius scale (px). Capped at 20 — `rounded-3xl` and above are banned per DESIGN.md. */
export const SHARED_RADIUS_SCALE = {
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   20,
} as const;
export type RadiusKey = keyof typeof SHARED_RADIUS_SCALE;

/** Shared motion durations (ms). 'reveal' is reserved for scroll-driven counter/grid reveals only. */
export const SHARED_MOTION = {
  fast:   120,
  base:   180,
  slow:   280,
  reveal: 600,
} as const;
export type MotionDuration = keyof typeof SHARED_MOTION;

/**
 * Focus ring tokens — one per brand. shared = neutral charcoal, conservative
 * default that renders correctly without a BrandProvider. ETF gold mirrors
 * the inline value already used in etfframework.ts. 6id electric blue mirrors
 * SIX_ID_COLORS.action. Consumers reach these via {@link focusRing}.
 */
export const FOCUS_RING_TOKENS = {
  etf:    { color: '#B07B2A', width: 3, offset: 2, alpha: 0.25, shadow: '0 0 0 3px rgba(176, 123, 42, 0.25)' },
  '6id':  { color: '#1877F2', width: 3, offset: 2, alpha: 0.30, shadow: '0 0 0 3px rgba(24, 119, 242, 0.30)' },
  shared: { color: '#3A3632', width: 2, offset: 2, alpha: 0.35, shadow: '0 0 0 2px rgba(58, 54, 50, 0.35)' },
} as const;

/**
 * Heading class strings — Tailwind classnames mirroring HEADING_SCALE. Kept in
 * lock-step with HEADING_SCALE via tests/tokens.test.ts assertion. Mobile-first:
 * each entry begins with the 320px base size, then scales up via md:/lg:.
 */
export const HEADING_CLASSES: Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5', string> = {
  h1: 'text-[30px] md:text-[36px] lg:text-[44px] tracking-[-0.02em] lg:tracking-[-0.03em] leading-[1.15]',
  h2: 'text-[24px] md:text-[30px] leading-[1.2]',
  h3: 'text-[20px] md:text-[24px] leading-[1.25]',
  h4: 'text-[16px] md:text-[20px] leading-[1.3]',
  h5: 'text-[14px] md:text-[16px] leading-[1.4]',
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns spacing value in px for a SpaceKey. Dev-only warn on unknown keys. */
export function space(n: SpaceKey | number): number {
  if (typeof n === 'number' && !(n in SHARED_SPACING_SCALE)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[etf-core] space(${n}) is not in SHARED_SPACING_SCALE; returning raw px.`);
    }
    return n;
  }
  return SHARED_SPACING_SCALE[n as SpaceKey];
}

/** Returns radius value in px for a RadiusKey. Dev-only warn on unknown keys. */
export function radius(name: RadiusKey): number {
  if (!(name in SHARED_RADIUS_SCALE)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[etf-core] radius(${String(name)}) is not in SHARED_RADIUS_SCALE; defaulting to md=8.`);
    }
    return SHARED_RADIUS_SCALE.md;
  }
  return SHARED_RADIUS_SCALE[name];
}

/** Returns motion duration in ms for a key. */
export function motion(key: MotionDuration): number {
  return SHARED_MOTION[key];
}

/** Returns focus-ring shadow string for a brand. Defaults to 'shared' for unknown brands. */
export function focusRing(brand: Brand = 'shared'): string {
  return (FOCUS_RING_TOKENS[brand] ?? FOCUS_RING_TOKENS.shared).shadow;
}
