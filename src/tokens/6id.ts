/**
 * 6 IDENTITIES — site-specific tokens.
 *
 * Re-exports all shared tokens, then layers 6id-only constants:
 *  - IDENTITY_COLORS (pottery glaze palette per type)
 *  - DARK_MODE_COLORS + darkThemeConfig
 *  - themeConfig (extends baseThemeConfig with full 6id component overrides)
 */

import type { ThemeConfig } from 'antd';
import { baseThemeConfig } from './shared';

export * from './shared';

// ─── Identity Type Colors — "pottery glaze" palette (45–55% sat, 55–65% light) ───
export const IDENTITY_COLORS = {
  compass:  '#2A6B6B',   // Deep Teal — introspection, depth
  mirage:   '#8B6B7B',   // Warm Plum — creativity, wisdom
  sentinel: '#7B8C6E',   // Sage/Olive — growth, groundedness
  signal:   '#C2898A',   // Dusty Rose — empathy, relational depth
  anchor:   '#C9705B',   // Terracotta — action, connection
  catalyst: '#D4A853',   // Amber/Gold — energy, leadership
} as const;

// ─── Dark Mode Palette ───
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

// ─── Dark Mode AntD Theme (not active — future toggle) ───
export const darkThemeConfig: ThemeConfig = {
  token: {
    colorPrimary:       '#2D7A7B',
    colorLink:          '#C27B5C',
    colorSuccess:       '#4BA86A',
    colorWarning:       '#D4A853',
    colorError:         '#E74C3C',
    colorInfo:          '#2D7A7B',
    colorBgBase:        DARK_MODE_COLORS.bgBase,
    colorBgContainer:   DARK_MODE_COLORS.bgContainer,
    colorBgLayout:      DARK_MODE_COLORS.bgLayout,
    colorBorder:        DARK_MODE_COLORS.border,
    colorBorderSecondary: DARK_MODE_COLORS.borderSecondary,
    colorTextBase:      DARK_MODE_COLORS.textPrimary,
    colorTextSecondary: DARK_MODE_COLORS.textSecondary,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    lineHeight: 1.57,
    borderRadius: 6,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: { borderRadius: 9999, controlHeight: 44, controlHeightLG: 52, paddingInline: 28, fontWeight: 600 },
    Card:   { borderRadiusLG: 24, paddingLG: 32 },
    Input:  { borderRadius: 8, controlHeight: 44, paddingInline: 16 },
    Modal:  { borderRadiusLG: 16 },
    Tabs:   { itemActiveColor: DARK_MODE_COLORS.textPrimary, itemSelectedColor: DARK_MODE_COLORS.textPrimary, inkBarColor: '#C27B5C' },
    Table:  { borderRadius: 12, headerBg: DARK_MODE_COLORS.surface },
  },
};

// ─── 6id full themeConfig — extends shared base with full overrides ───
export const themeConfig: ThemeConfig = {
  ...baseThemeConfig,
  components: {
    ...baseThemeConfig.components,
    Progress:  { defaultColor: '#C27B5C' },
    Collapse:  { borderRadiusLG: 12 },
    Drawer:    { borderRadius: 0 },
    Statistic: { contentFontSize: 36 },
    Tabs:      { itemActiveColor: '#3A3632', itemSelectedColor: '#3A3632', inkBarColor: '#C27B5C' },
    Tag:       { borderRadiusSM: 4 },
    Alert:     { borderRadiusLG: 12 },
    Table:     { borderRadius: 12, headerBg: '#F5EFE6' },
  },
};
