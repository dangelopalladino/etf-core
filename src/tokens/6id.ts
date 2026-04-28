/**
 * 6 IDENTITIES — site-specific tokens.
 *
 * Re-exports all shared tokens, then layers 6id-only constants:
 *  - SIX_ID_COLORS (site palette — navy + off-white + electric blue)
 *  - IDENTITY_COLORS (saturated type badge colors per design system)
 *  - IDENTITY_WASHES (6% tint over white for result-screen backdrops)
 *  - SIX_ID_TYPE_SCALE, SIX_ID_SPACING, SIX_ID_RADII, SIX_ID_SHADOWS
 *  - SIX_ID_MOTION, SIX_ID_WIDTHS
 *  - darkThemeConfig (future dark mode toggle — not active)
 *  - themeConfig (full 6id AntD theme)
 *
 * Source of truth: ETFtestSite/docs/6identities Design System/
 */

import type { ThemeConfig } from 'antd';
import { baseThemeConfig, fonts } from './shared';

export * from './shared';

// ─── Site Palette ─────────────────────────────────────────────────────────────
export const SIX_ID_COLORS = {
  // Surfaces
  bgPage:     '#F7F8FA',  // default page bg — soft off-white
  bgSurface:  '#FFFFFF',  // cards / floating surfaces
  bgNavy:     '#0D1B3E',  // full-bleed hero / result reveal
  bgNavySoft: '#142554',  // navy elevation +1 (rare)

  // Foreground
  fgPrimary:     '#0D1B3E',  // brand / strong headings
  fgBody:        '#1E1E2E',  // body text
  fgMuted:       '#6B7280',  // metadata, labels, captions
  fgFaint:       '#9CA3AF',  // placeholder, disabled
  fgOnNavy:      '#FFFFFF',
  fgOnNavyMuted: 'rgba(255,255,255,0.72)',
  fgOnNavyFaint: 'rgba(255,255,255,0.48)',

  // Interactive — electric blue is the single action color
  action:        '#1877F2',
  actionHover:   '#1466D4',
  actionPress:   '#1158B8',
  actionAlt:     '#0EA5E9',  // alternate CTA (teal)
  actionAltHover:'#0B8FCC',

  // Status
  danger:       '#DC2626',
  dangerHover:  '#B91C1C',
  success:      '#059669',
  successHover: '#047857',
  warning:      '#B45309',

  // Borders — navy-tinted, expressed as composited hex on white
  borderHairline: '#ECEDF0',  // rgba(13,27,62,0.08)
  borderSoft:     '#E2E4E8',  // rgba(13,27,62,0.12)
  borderStrong:   '#D8DBE0',  // rgba(13,27,62,0.16)
  borderOnNavy:   'rgba(255,255,255,0.12)',
} as const;

// ─── Identity Type Colors — saturated badge palette ────────────────────────
// Used ONLY inside the type system (cards, badges, result screens).
// Never leak into nav, body text, or chrome.
export const IDENTITY_COLORS = {
  signal:   '#1B4FD8',   // 01 · Deep cobalt    — direction
  compass:  '#D97706',   // 02 · Burnt amber    — drive
  sentinel: '#0F766E',   // 03 · Forest teal    — resilience
  anchor:   '#6D28D9',   // 04 · Slate violet   — introspection
  momentum: '#B45309',   // 05 · Warm gold      — achievement
  catalyst: '#059669',   // 06 · Vivid emerald  — growth
  mirage:   '#B45309',   // kept for backward compat (alias of momentum)
} as const;

/** Canonical identity type keys (excludes legacy `mirage` alias). */
export type IdentityTypeKey = Exclude<keyof typeof IDENTITY_COLORS, 'mirage'>;

// ─── Identity Washes — result-screen backdrops only ───────────────────────
// 6% tint of the type color over white. Never used elsewhere.
export const IDENTITY_WASHES = {
  signal:   '#F2F5FE',
  compass:  '#FDF6EE',
  sentinel: '#EEF6F5',
  anchor:   '#F4F0FC',
  momentum: '#FCF5EB',
  catalyst: '#EDF7F2',
} as const;

// ─── Type Scale — 1.25 major-third on a 16px base ─────────────────────────
export const SIX_ID_TYPE_SCALE = {
  display: { size: 80, lineHeight: 1.05, weight: 600, letterSpacing: '-0.02em' },
  h1:      { size: 52, lineHeight: 1.05, weight: 600, letterSpacing: '-0.02em' },
  h2:      { size: 40, lineHeight: 1.2,  weight: 600, letterSpacing: '-0.01em' },
  h3:      { size: 32, lineHeight: 1.2,  weight: 600, letterSpacing: '-0.01em' },
  h4:      { size: 24, lineHeight: 1.2,  weight: 600 },
  lead:    { size: 18, lineHeight: 1.6,  weight: 400 },
  body:    { size: 16, lineHeight: 1.6,  weight: 400 },
  small:   { size: 14, lineHeight: 1.45, weight: 400 },
  eyebrow: { size: 12, lineHeight: 1.4,  weight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
  data:    { size: 32, lineHeight: 1.2,  weight: 500 },
} as const;

// ─── Spacing Scale — 4px base ──────────────────────────────────────────────
export const SIX_ID_SPACING = {
  1:  4,  2:  8,  3: 12,  4: 16,  5: 20,
  6: 24,  8: 32, 10: 40, 12: 48, 16: 64,
  20: 80, 24: 96, 32: 128,
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────
export const SIX_ID_RADII = {
  sm:   6,    // chips, tags, inline elements
  md:   10,   // buttons, inputs
  lg:   14,   // cards
  xl:   20,   // modals, hero panels
  pill: 999,  // avatars, status dots, progress pill
} as const;

// ─── Shadows — navy-tinted elevation ──────────────────────────────────────
export const SIX_ID_SHADOWS = {
  xs: '0 1px 2px rgba(13, 27, 62, 0.06)',
  sm: '0 2px 4px rgba(13, 27, 62, 0.06), 0 1px 2px rgba(13, 27, 62, 0.04)',
  md: '0 6px 16px rgba(13, 27, 62, 0.08), 0 2px 4px rgba(13, 27, 62, 0.04)',
  lg: '0 16px 32px rgba(13, 27, 62, 0.10), 0 4px 8px rgba(13, 27, 62, 0.04)',
  xl: '0 28px 56px rgba(13, 27, 62, 0.14), 0 8px 16px rgba(13, 27, 62, 0.06)',
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────
export const SIX_ID_MOTION = {
  fast:    150,   // hover states
  base:    200,   // state changes
  slow:    350,   // page transitions
  reveal:  600,   // result reveal sequence
  easeOut: 'cubic-bezier(0.2, 0, 0, 1)',
  easeStd: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─── Layout Widths ────────────────────────────────────────────────────────
export const SIX_ID_WIDTHS = {
  marketing: 1200,  // marketing pages
  app:       1040,  // app surfaces
  reading:    640,  // assessment / reading column
} as const;

// ─── Dark Mode Palette ────────────────────────────────────────────────────
export const DARK_MODE_COLORS = {
  bgBase:          '#1C1917',
  bgContainer:     '#292524',
  bgLayout:        '#1C1917',
  surface:         '#292524',
  surfaceElevated: '#44403C',
  border:          '#44403C',
  borderSecondary: '#57534E',
  textPrimary:     '#FAF5EE',
  textSecondary:   '#D6D3D1',
  textTertiary:    '#A8A29E',
} as const;

// ─── Dark Mode AntD Theme (not active — future toggle) ────────────────────
export const darkThemeConfig: ThemeConfig = {
  token: {
    colorPrimary:         '#3B82F6',
    colorLink:            '#3B82F6',
    colorSuccess:         '#10B981',
    colorWarning:         '#F59E0B',
    colorError:           '#EF4444',
    colorInfo:            '#3B82F6',
    colorBgBase:          DARK_MODE_COLORS.bgBase,
    colorBgContainer:     DARK_MODE_COLORS.bgContainer,
    colorBgLayout:        DARK_MODE_COLORS.bgLayout,
    colorBorder:          DARK_MODE_COLORS.border,
    colorBorderSecondary: DARK_MODE_COLORS.borderSecondary,
    colorTextBase:        DARK_MODE_COLORS.textPrimary,
    colorTextSecondary:   DARK_MODE_COLORS.textSecondary,
    fontFamily:      fonts.body,
    fontSize:        16,
    lineHeight:      1.6,
    borderRadius:    SIX_ID_RADII.md,
    borderRadiusLG:  SIX_ID_RADII.lg,
    borderRadiusSM:  SIX_ID_RADII.sm,
    borderRadiusXS:  4,
    controlHeight:   44,
    controlHeightLG: 52,
    controlHeightSM: 32,
  },
  components: {
    Button: { borderRadius: SIX_ID_RADII.md, controlHeight: 44, controlHeightLG: 52, paddingInline: 24, fontWeight: 600 },
    Card:   { borderRadiusLG: SIX_ID_RADII.lg, paddingLG: 24 },
    Input:  { borderRadius: SIX_ID_RADII.md, controlHeight: 44, paddingInline: 16 },
    Modal:  { borderRadiusLG: SIX_ID_RADII.xl },
  },
};

// ─── 6id full themeConfig ─────────────────────────────────────────────────
export const themeConfig: ThemeConfig = {
  ...baseThemeConfig,
  token: {
    ...baseThemeConfig.token,
    // Action / interactive — electric blue is the single CTA color
    colorPrimary:         SIX_ID_COLORS.action,        // #1877F2
    colorInfo:            SIX_ID_COLORS.action,
    colorLink:            SIX_ID_COLORS.action,
    colorSuccess:         SIX_ID_COLORS.success,       // #059669
    colorWarning:         SIX_ID_COLORS.warning,       // #B45309
    colorError:           SIX_ID_COLORS.danger,        // #DC2626
    // Surfaces
    colorBgBase:          SIX_ID_COLORS.bgPage,        // #F7F8FA
    colorBgContainer:     SIX_ID_COLORS.bgSurface,     // #FFFFFF
    colorBgLayout:        SIX_ID_COLORS.bgPage,
    // Text
    colorTextBase:        SIX_ID_COLORS.fgBody,        // #1E1E2E
    colorTextSecondary:   SIX_ID_COLORS.fgMuted,       // #6B7280
    // Borders
    colorBorder:          SIX_ID_COLORS.borderStrong,     // #D8DBE0
    colorBorderSecondary: SIX_ID_COLORS.borderHairline,   // #ECEDF0
    // Typography
    fontSize:             SIX_ID_TYPE_SCALE.body.size,     // 16
    lineHeight:           SIX_ID_TYPE_SCALE.body.lineHeight,// 1.6
    fontSizeHeading1:     SIX_ID_TYPE_SCALE.h1.size,       // 52
    fontSizeHeading2:     SIX_ID_TYPE_SCALE.h2.size,       // 40
    fontSizeHeading3:     SIX_ID_TYPE_SCALE.h3.size,       // 32
    fontSizeHeading4:     SIX_ID_TYPE_SCALE.h4.size,       // 24
    fontSizeHeading5:     20,
    lineHeightHeading1:   SIX_ID_TYPE_SCALE.h1.lineHeight, // 1.05
    lineHeightHeading2:   SIX_ID_TYPE_SCALE.h2.lineHeight, // 1.2
    lineHeightHeading3:   SIX_ID_TYPE_SCALE.h3.lineHeight, // 1.2
    lineHeightHeading4:   SIX_ID_TYPE_SCALE.h4.lineHeight, // 1.2
    lineHeightHeading5:   1.4,
    // Radii
    borderRadius:    SIX_ID_RADII.md,   // 10 — buttons, inputs
    borderRadiusLG:  SIX_ID_RADII.lg,   // 14 — cards
    borderRadiusSM:  SIX_ID_RADII.sm,   //  6 — chips, tags
    borderRadiusXS:  4,
    // Shadows (navy-tinted)
    boxShadow:          SIX_ID_SHADOWS.sm,
    boxShadowSecondary: SIX_ID_SHADOWS.md,
    boxShadowTertiary:  'none',
    // Controls
    controlHeight:   44,
    controlHeightLG: 52,
    controlHeightSM: 32,
    // Motion
    motionDurationFast: '0.15s',
    motionDurationMid:  '0.2s',
    motionDurationSlow: '0.35s',
    motionEaseInOut:    SIX_ID_MOTION.easeStd,
  },
  components: {
    ...baseThemeConfig.components,
    Button: {
      borderRadius:    SIX_ID_RADII.md,  // 10 — never pill, never sharp
      controlHeight:   44,
      controlHeightLG: 52,
      paddingInline:   24,
      fontWeight:      600,  // semibold per design system
      primaryShadow:   'none',
      defaultShadow:   'none',
      dangerShadow:    'none',
    },
    Card:      { borderRadiusLG: SIX_ID_RADII.lg, paddingLG: 24 },   // 14px
    Input:     { borderRadius: SIX_ID_RADII.md, controlHeight: 44, paddingInline: 16 }, // 10px
    Modal:     { borderRadiusLG: SIX_ID_RADII.xl },   // 20px
    Menu:      { itemBorderRadius: SIX_ID_RADII.sm },
    Progress:  { defaultColor: SIX_ID_COLORS.action },
    Collapse:  { borderRadiusLG: SIX_ID_RADII.md },
    Statistic: { contentFontSize: 32 },
    Tabs:      { itemActiveColor: SIX_ID_COLORS.fgPrimary, itemSelectedColor: SIX_ID_COLORS.fgPrimary, inkBarColor: SIX_ID_COLORS.action },
    Tag:       { borderRadiusSM: SIX_ID_RADII.sm },
    Alert:     { borderRadiusLG: SIX_ID_RADII.md },
    Table:     { borderRadius: SIX_ID_RADII.md, headerBg: SIX_ID_COLORS.bgPage },
    Form:      { itemMarginBottom: 20 },
    Divider:   { colorSplit: SIX_ID_COLORS.borderHairline },
    Typography: { fontWeightStrong: 600 },  // semibold per design system
  },
};
