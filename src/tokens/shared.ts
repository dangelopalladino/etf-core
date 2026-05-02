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

/**
 * AntD v6 base theme — numeric component tokens consumed by the
 * brand-specific theme configs (`6id.ts`, `etfframework.ts`).
 *
 * AntD v6 theme tokens are NUMERIC ONLY. `controlHeight`, `borderRadius`,
 * `paddingInline`, `fontSize*` etc. cannot accept `clamp()` strings or any
 * CSS expression. Component fluid scaling reaches AntD-rendered surfaces
 * only via outer wrapper `className` (see `SectionHeader.tsx` for the
 * pattern). Do NOT push fluid expressions into `token.fontSize*` or
 * `components.{Button,Input,...}` here — see `FLUID_TYPE_SCALE` and the
 * fluid contract block at the end of this file.
 *
 * The numeric anchors used below are surfaced as `CONTROL_HEIGHT_TOKENS`
 * (sm=32, md=40, lg=48, touch=44). `Button.controlHeight: 44` matches
 * `BrandCta size='middle'` and the WCAG minimum touch target.
 */
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
 * Heading class strings — Tailwind classnames using `clamp()` for fluid
 * scaling between mobile and desktop. Mobile minima match HEADING_SCALE
 * `mobileSize`; desktop maxima match `size`. The single source of truth
 * for `<ServerHeading>`, the `Hero` primitive, and any consumer that wants
 * to apply heading typography to non-heading tags.
 *
 * Migrated from a `text-[Npx] md:text-[Mpx] lg:text-[Kpx]` breakpoint
 * ladder to fluid `text-[clamp(...)]` in v1.7.x as part of the
 * mobile-sizing remediation. Behavior at the 320px and ≥1280px endpoints
 * is unchanged; intermediate viewports scale smoothly.
 */
export const HEADING_CLASSES: Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5', string> = {
  h1: 'text-[clamp(1.875rem,1.2rem+2.4vw,2.75rem)] tracking-[-0.03em] leading-[1.15]',
  h2: 'text-[clamp(1.5rem,1.1rem+1.4vw,1.875rem)] leading-[1.2]',
  h3: 'text-[clamp(1.25rem,1rem+0.85vw,1.5rem)] leading-[1.25]',
  h4: 'text-[clamp(1rem,0.85rem+0.55vw,1.25rem)] leading-[1.3]',
  h5: 'text-[clamp(0.875rem,0.8rem+0.25vw,1rem)] leading-[1.4]',
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

// ───────────────────────────────────────────────────────────────────────────
// v1.6 ADDITIVE — Impeccable display + motion tokens.
// Additive only; no existing export above is modified.
// ───────────────────────────────────────────────────────────────────────────

/**
 * Display-tier headline classes — poster-scale typography for landing /
 * manifesto surfaces. Each entry is a Tailwind class string using `clamp()`
 * for fluid scaling between mobile and desktop. Tracking and leading match
 * the Phase 1 Impeccable display tier (`-0.04em`, `1.02`).
 *
 * Use one display headline per page max; pair with `<DisplayHeading>` (server)
 * or the equivalent client primitive — never inline raw clamp().
 *
 * Added in v1.6.0.
 */
export const DISPLAY_CLASSES = {
  /** ~40 → 64px. Use on landing sub-sections. */
  sm: 'text-[clamp(40px,6vw,64px)] tracking-[-0.04em] leading-[1.02]',
  /** ~48 → 80px. Default manifesto/headline. */
  md: 'text-[clamp(48px,7vw,80px)] tracking-[-0.04em] leading-[1.02]',
  /** ~56 → 96px. Reserve for hero-only display moments. */
  lg: 'text-[clamp(56px,8vw,96px)] tracking-[-0.04em] leading-[1.02]',
} as const;
export type DisplayScale = keyof typeof DISPLAY_CLASSES;

/**
 * Hero-tier composition classes for `<Hero>`. Title sits between the regular
 * heading scale (`HEADING_CLASSES.h1`) and the poster `DISPLAY_CLASSES.sm` —
 * larger than a typical h1 but not poster-scale. Subtitle and eyebrow are
 * pinned to readable sizes that scale fluidly.
 *
 * Added in v1.7.x to remove the inline arbitrary-value typography that the
 * `Hero` primitive previously carried.
 */
export const HERO_CLASSES = {
  /** Title — fluid clamp ~28px → 52px, tight tracking, tight leading. */
  title:    'text-[clamp(1.75rem,1.2rem+2.5vw,3.25rem)] tracking-[-0.02em] leading-[1.1]',
  /** Subtitle — fluid clamp ~15px → 18px. */
  subtitle: 'text-[clamp(0.9375rem,0.875rem+0.25vw,1.125rem)] leading-[1.5]',
  /** Eyebrow — fluid clamp ~11px → 12px, semibold uppercase tracked. */
  eyebrow:  'text-[clamp(0.6875rem,0.65rem+0.1vw,0.75rem)] font-semibold uppercase tracking-[0.1em]',
} as const;
export type HeroScale = keyof typeof HERO_CLASSES;

/**
 * Impeccable motion tokens — easing + duration + allowlisted keyframe names.
 * Mirrors the values used in 6id `globals.css` so consumers (and renderers
 * that can't reach CSS variables) share one canonical motion vocabulary.
 *
 * The keyframe name list is the allowlist enforced by
 * `tools/eslint-rules/animation-allowlist.js` in 6id. New keyframes must be
 * added in BOTH places.
 *
 * Added in v1.6.0.
 */
export const MOTION_TOKENS_IMPECCABLE = {
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  durations: { fast: '160ms', base: '320ms', slow: '560ms' },
  keyframes: ['fadeSlide', 'textRise', 'fadeUp'] as const,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// FLUID CONTRACT — added v1.8.0 (375 → 1440 viewport bracket)
//
// Two-layer design system:
//   1. Foundation tokens (this section): fluid type scale, fluid spacing scale,
//      container clamp, numeric control-height anchors. Consumed via Tailwind
//      v4 `@theme { ... }` paste block in consumer globals.css. The paste-ready
//      block is generated by `buildThemeBlock()` below.
//   2. Component tokens (`baseThemeConfig` above, line ~158): AntD v6 numeric
//      overrides for Button / Input / Card / Modal / Menu / Form / Divider.
//      AntD v6 theme tokens are NUMERIC ONLY — `controlHeight`, `borderRadius`,
//      `paddingInline`, `fontSize` cannot accept clamp() strings. Component
//      fluid scaling reaches AntD-rendered surfaces only via outer wrapper
//      className. Do NOT push clamp() expressions into baseThemeConfig.token
//      or baseThemeConfig.components.*.
//
// Linear-interpolation math (validated at both anchors and intermediate vp):
//   slope_vw  = (maxRem - minRem) / (maxVp - minVp) * 100
//   intercept = minRem - slope_vw * minVp / 100   (in rem)
// At vp = 375  → value = minSize
// At vp = 1440 → value = maxSize
// ───────────────────────────────────────────────────────────────────────────

/**
 * Fluid type scale — clamp() between 375 and 1440 viewports.
 *
 * Consumed by `text-{xs|sm|base|lg|xl|2xl}` Tailwind utilities once the
 * consumer has pasted the `buildThemeBlock()` output into globals.css.
 * Body text (`ServerText body` → `text-base`) is the primary downstream
 * surface; consumer apps presently override `--text-base` outside this
 * contract (ETFtestSite 15 → 16, etfframework 16 → 17). The canonical
 * paste block aligns body sizing to 16 → 18 across both brands.
 */
export const FLUID_TYPE_SCALE = {
  xs:   'clamp(0.75rem, 0.094vw + 0.728rem, 0.8125rem)',  // 12px → 13px
  sm:   'clamp(0.875rem, 0.188vw + 0.831rem, 1rem)',      // 14px → 16px
  base: 'clamp(1rem, 0.188vw + 0.956rem, 1.125rem)',      // 16px → 18px
  lg:   'clamp(1.125rem, 0.563vw + 0.993rem, 1.5rem)',    // 18px → 24px
  xl:   'clamp(1.5rem, 1.127vw + 1.236rem, 2.25rem)',     // 24px → 36px
  '2xl':'clamp(2rem, 1.878vw + 1.560rem, 3.25rem)',       // 32px → 52px
} as const;
export type FluidTypeKey = keyof typeof FLUID_TYPE_SCALE;

/**
 * Fluid structural spacing — clamp() between 375 and 1440 viewports.
 *
 * Consumed via CSS variables (`var(--spacing-section-y)`) in component
 * styles, or via Tailwind `--spacing-*` namespace utilities once the
 * `@theme` block is pasted (e.g., `py-section-y`, `p-card`).
 * `SectionWrapper` adopts the `sectionPx` literal directly in PR 2 so it
 * works without consumer paste; other primitives reach these via @theme.
 */
export const FLUID_SPACING_SCALE = {
  sectionPy:  'clamp(3rem, 4.507vw + 1.944rem, 6rem)',     // 48px → 96px
  sectionPx:  'clamp(1.25rem, 5.634vw - 0.071rem, 5rem)',  // 20px → 80px
  cardP:      'clamp(1rem, 1.502vw + 0.648rem, 2rem)',     // 16px → 32px
  gapMd:      'clamp(1rem, 1.502vw + 0.648rem, 2rem)',     // 16px → 32px
  gapSection: 'clamp(3rem, 4.507vw + 1.944rem, 6rem)',     // 48px → 96px
} as const;
export type FluidSpacingKey = keyof typeof FLUID_SPACING_SCALE;

/** Container width clamp — full bleed minus 2rem gutters, capped at 72rem (1152px). */
export const CONTAINER_CLAMP = 'min(100% - 2rem, 72rem)';

/**
 * Numeric AntD control-height anchors. Surfaced as a foundation token so the
 * AntD-numeric constraint is discoverable alongside the fluid CSS scales.
 *   sm = 32   – AntD 'small' size (compact toolbars, dense table cells)
 *   md = 40   – AntD default
 *   lg = 48   – AntD 'large' size (etfframework Button/Input default)
 *   touch = 44 – minimum WCAG touch target (BrandCta size='middle' default)
 *
 * Consumed by `baseThemeConfig` and the brand-specific theme overrides in
 * 6id.ts / etfframework.ts. Treat as the single source of truth for any new
 * AntD component's `controlHeight*` overrides.
 */
export const CONTROL_HEIGHT_TOKENS = {
  sm:    32,
  md:    40,
  lg:    48,
  touch: 44,
} as const;
export type ControlHeightKey = keyof typeof CONTROL_HEIGHT_TOKENS;

/**
 * Tailwind escape hatch — `text-[clamp(...)]` arbitrary-value strings.
 * Prefer the `@theme` paste block in consumer globals.css; this map exists
 * for adjacent libs that cannot run a paste step (scratch harness, one-off
 * Storybook stories, email-template previews).
 */
export const FLUID_TYPE_TAILWIND = {
  xs:   `text-[${FLUID_TYPE_SCALE.xs}]`,
  sm:   `text-[${FLUID_TYPE_SCALE.sm}]`,
  base: `text-[${FLUID_TYPE_SCALE.base}]`,
  lg:   `text-[${FLUID_TYPE_SCALE.lg}]`,
  xl:   `text-[${FLUID_TYPE_SCALE.xl}]`,
  '2xl':`text-[${FLUID_TYPE_SCALE['2xl']}]`,
} as const;

/**
 * Returns a copy-paste-ready Tailwind v4 `@theme { ... }` block for consumer
 * globals.css. After paste:
 *   • `text-{xs|sm|base|lg|xl|2xl}` utilities resolve through fluid `--text-*`
 *   • `--spacing-*` variables become available for `var()`-driven custom CSS
 *     and Tailwind `--spacing-*` namespace utilities (e.g., `py-section-y`)
 *   • `--container-clamp` provides a single-source container width
 *
 * Output is byte-stable so consumers can diff-detect drift. Used by:
 *   • README "Fluid type and spacing contract" section (verbatim copy)
 *   • One-line upgrade snippet:
 *       node -e "import('@dangelopalladino/etf-core/tokens/shared').then(m => console.log(m.buildThemeBlock()))"
 *
 * Requires Tailwind v4. Both downstream consumers (ETFtestSite, etfframework)
 * are on v4 today.
 */
export function buildThemeBlock(): string {
  return [
    '@theme {',
    '  /* etf-core fluid contract — 375 → 1440 viewport bracket */',
    '',
    '  /* Type scale */',
    `  --text-xs: ${FLUID_TYPE_SCALE.xs};`,
    `  --text-sm: ${FLUID_TYPE_SCALE.sm};`,
    `  --text-base: ${FLUID_TYPE_SCALE.base};`,
    `  --text-lg: ${FLUID_TYPE_SCALE.lg};`,
    `  --text-xl: ${FLUID_TYPE_SCALE.xl};`,
    `  --text-2xl: ${FLUID_TYPE_SCALE['2xl']};`,
    '',
    '  /* Spacing scale */',
    `  --spacing-section-y: ${FLUID_SPACING_SCALE.sectionPy};`,
    `  --spacing-section-x: ${FLUID_SPACING_SCALE.sectionPx};`,
    `  --spacing-card: ${FLUID_SPACING_SCALE.cardP};`,
    `  --spacing-gap-md: ${FLUID_SPACING_SCALE.gapMd};`,
    `  --spacing-gap-section: ${FLUID_SPACING_SCALE.gapSection};`,
    '',
    '  /* Container clamp */',
    `  --container-clamp: ${CONTAINER_CLAMP};`,
    '}',
    '',
  ].join('\n');
}
