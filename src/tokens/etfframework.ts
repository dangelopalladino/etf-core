/**
 * ETF FRAMEWORK — site-specific tokens.
 *
 * Re-exports all shared tokens, then layers etfframework-only constants:
 *  - ETF_COLORS (forest-green / warm-white / gold palette)
 *  - ETF_TYPE_SCALE, ETF_SPACING, ETF_RADII, ETF_SHADOWS, ETF_MOTION, ETF_WIDTHS
 *  - themeConfig (full etfframework AntD theme)
 *
 * Source of truth: etfframework/etf-framework-design-system/project/
 *
 * Display font (Source Serif 4) cannot be set as a separate AntD heading font
 * via token — apply a site-level CSS override targeting .ant-typography h1–h4.
 */

import type { ThemeConfig } from 'antd';
import { baseThemeConfig, fonts } from './shared';

export * from './shared';

// ─── Site Palette ─────────────────────────────────────────────────────────────
export const ETF_COLORS = {
  // Brand
  forest:     '#1A3D2B',   // Primary brand
  forestMid:  '#2D6A4F',   // Hover / secondary actions
  forestDeep: '#0F2A1D',   // Headings on warm white, extra weight

  // Surfaces
  warmWhite: '#FAFAF8',    // Page background
  white:     '#FFFFFF',    // Cards, surfaces
  stone:     '#F2F1ED',    // Subtle alt-band background

  // Text
  charcoal:  '#1C1C1E',    // Body text
  gray:      '#6B7280',    // Secondary text, metadata
  grayLight: '#9CA3AF',    // Disabled, placeholder

  // CTA accent
  gold:      '#B07B2A',    // Primary CTA
  goldHover: '#8E6321',    // Primary CTA hover
  goldSoft:  '#D4A859',    // Decorative gold (badges, dividers)

  // Semantic
  emerald:     '#059669',  // Success, completion
  emeraldSoft: '#D1FAE5',
  red:         '#B91C1C',  // Destructive
  redSoft:     '#FEE2E2',
  amber:       '#D97706',  // Warning

  // Ecosystem bridge (footer, cross-links to 6identities.com)
  navy:    '#0D1B3E',
  navyMid: '#1E2D5C',

  // Borders
  border:       '#E5E7EB',
  borderStrong: '#D1D5DB',
  borderOnDark: 'rgba(255,255,255,0.12)',
} as const;

// ─── Font stacks — etfframework overrides display to Source Serif 4 ──────────
// AntD fontFamily token applies globally; use the CSS override below
// to apply Source Serif 4 to heading elements at the site level:
//   .ant-typography h1, h2, h3, h4 { font-family: var(--etf-font-serif); }
export const ETF_FONTS = {
  serif: fonts.serif,  // "Source Serif 4", Georgia — display & headings
  body:  fonts.body,   // "General Sans" — body & UI
  mono:  fonts.mono,   // "JetBrains Mono" — code & data
} as const;

// ─── Type Scale ───────────────────────────────────────────────────────────────
export const ETF_TYPE_SCALE = {
  display: { size: 64, lineHeight: 1.1,  weight: 600, letterSpacing: '-0.025em', font: 'serif' },
  h1:      { size: 48, lineHeight: 1.1,  weight: 600, letterSpacing: '-0.02em',  font: 'serif' },
  h2:      { size: 36, lineHeight: 1.25, weight: 600, letterSpacing: '-0.018em', font: 'serif' },
  h3:      { size: 24, lineHeight: 1.25, weight: 600, letterSpacing: '-0.015em', font: 'serif' },
  h4:      { size: 20, lineHeight: 1.25, weight: 600, font: 'serif' },
  bodyLg:  { size: 18, lineHeight: 1.65, weight: 400, font: 'sans' },
  body:    { size: 16, lineHeight: 1.65, weight: 400, font: 'sans' },
  small:   { size: 14, lineHeight: 1.5,  weight: 400, font: 'sans' },
  eyebrow: { size: 12, lineHeight: 1.4,  weight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.14em', font: 'sans' },
} as const;

// ─── Spacing Scale — 4px base ─────────────────────────────────────────────────
export const ETF_SPACING = {
  1:  4,  2:  8,  3: 12,  4:  16, 5: 20,
  6: 24,  8: 32, 10: 40, 12:  48,
  14: 56, 20: 80, 30: 120,
} as const;

// ─── Radii — conservative, institutional ──────────────────────────────────────
export const ETF_RADII = {
  sm:   4,    // small elements
  md:   6,    // buttons, inputs
  lg:   10,   // cards
  pill: 999,  // badges only
} as const;

// ─── Shadows — cool / navy-cast, three steps ─────────────────────────────────
export const ETF_SHADOWS = {
  sm:    '0 1px 2px rgba(13, 27, 62, 0.06)',
  md:    '0 4px 12px rgba(13, 27, 62, 0.08)',
  lg:    '0 16px 40px rgba(13, 27, 62, 0.12)',
  focus: '0 0 0 3px rgba(176, 123, 42, 0.25)',  // gold-tinted focus ring
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────
export const ETF_MOTION = {
  fast:    120,
  base:    180,
  slow:    280,
  counter: 600,  // numerical counter animation on scroll
  ease:    'cubic-bezier(0.2, 0, 0, 1)',
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────
export const ETF_WIDTHS = {
  container: 1200,
  navHeight: 72,
} as const;

// ─── Full AntD Theme ──────────────────────────────────────────────────────────
export const themeConfig: ThemeConfig = {
  ...baseThemeConfig,
  token: {
    ...baseThemeConfig.token,
    // Forest is the brand identity color for AntD's interactive system (radios, switches, tabs, progress)
    // Gold CTAs are applied via .btn-primary CSS class at the site level, not AntD primary Button
    colorPrimary:         ETF_COLORS.forest,        // #1A3D2B
    colorInfo:            ETF_COLORS.forest,        // #1A3D2B
    colorLink:            ETF_COLORS.forest,        // #1A3D2B
    colorSuccess:         ETF_COLORS.emerald,       // #059669
    colorWarning:         ETF_COLORS.amber,         // #D97706
    colorError:           ETF_COLORS.red,           // #B91C1C
    // Surfaces
    colorBgBase:          ETF_COLORS.warmWhite,     // #FAFAF8
    colorBgContainer:     ETF_COLORS.white,         // #FFFFFF
    colorBgLayout:        ETF_COLORS.warmWhite,
    // Text
    colorTextBase:        ETF_COLORS.charcoal,      // #1C1C1E
    colorTextSecondary:   ETF_COLORS.gray,          // #6B7280
    // Borders
    colorBorder:          ETF_COLORS.border,         // #E5E7EB
    colorBorderSecondary: ETF_COLORS.border,        // #E5E7EB
    // Typography — body in General Sans; site CSS handles serif headings
    fontFamily:           ETF_FONTS.body,
    fontSize:             ETF_TYPE_SCALE.body.size,     // 16
    lineHeight:           ETF_TYPE_SCALE.body.lineHeight,// 1.65
    fontSizeHeading1:     ETF_TYPE_SCALE.h1.size,       // 48
    fontSizeHeading2:     ETF_TYPE_SCALE.h2.size,       // 36
    fontSizeHeading3:     ETF_TYPE_SCALE.h3.size,       // 24
    fontSizeHeading4:     ETF_TYPE_SCALE.h4.size,       // 20
    fontSizeHeading5:     16,
    lineHeightHeading1:   ETF_TYPE_SCALE.h1.lineHeight, // 1.1
    lineHeightHeading2:   ETF_TYPE_SCALE.h2.lineHeight, // 1.25
    lineHeightHeading3:   ETF_TYPE_SCALE.h3.lineHeight, // 1.25
    lineHeightHeading4:   ETF_TYPE_SCALE.h4.lineHeight, // 1.25
    lineHeightHeading5:   1.4,
    // Radii — conservative / institutional
    borderRadius:    ETF_RADII.md,   // 6 — buttons, inputs
    borderRadiusLG:  ETF_RADII.lg,   // 10 — cards
    borderRadiusSM:  ETF_RADII.sm,   // 4
    borderRadiusXS:  4,
    // Shadows (navy-cast)
    boxShadow:          ETF_SHADOWS.sm,
    boxShadowSecondary: ETF_SHADOWS.md,
    boxShadowTertiary:  'none',
    // Controls — 48px default height matches .btn spec
    controlHeight:   48,
    controlHeightLG: 56,
    controlHeightSM: 36,
    // Motion
    motionDurationFast: '0.12s',
    motionDurationMid:  '0.18s',
    motionDurationSlow: '0.28s',
    motionEaseOut:      ETF_MOTION.ease,
  },
  components: {
    ...baseThemeConfig.components,
    Button: {
      borderRadius:    ETF_RADII.md,  // 6px — institutional, never pill
      controlHeight:   48,
      controlHeightLG: 56,
      controlHeightSM: 36,
      paddingInline:   22,
      fontWeight:      600,           // semibold per design system
      primaryShadow:   ETF_SHADOWS.sm,
      defaultShadow:   'none',
      dangerShadow:    'none',
    },
    Card: {
      borderRadiusLG: ETF_RADII.lg,  // 10px
      paddingLG:      32,
    },
    Input: {
      borderRadius:  ETF_RADII.md,   // 6px
      controlHeight:  48,
      paddingInline:  14,
    },
    Modal:     { borderRadiusLG: ETF_RADII.lg },
    Menu:      { itemBorderRadius: ETF_RADII.sm },
    Progress:  { defaultColor: ETF_COLORS.gold },
    Collapse:  { borderRadiusLG: ETF_RADII.md },
    Statistic: { contentFontSize: 36 },
    Tabs:      { itemActiveColor: ETF_COLORS.forestDeep, itemSelectedColor: ETF_COLORS.forestDeep, inkBarColor: ETF_COLORS.gold },
    Tag:       { borderRadiusSM: ETF_RADII.sm },
    Alert:     { borderRadiusLG: ETF_RADII.md },
    Table:     { borderRadius: ETF_RADII.md, headerBg: ETF_COLORS.stone },
    Form:      { itemMarginBottom: 20 },
    Divider:   { colorSplit: ETF_COLORS.border },
    Typography: { fontWeightStrong: 600 },
  },
};
