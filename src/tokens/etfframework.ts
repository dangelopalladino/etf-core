/**
 * ETF FRAMEWORK — site-specific tokens.
 *
 * v1.0.6 — Switched colorPrimary / colorInfo / colorLink from
 * `var(--color-brand, …)` strings to literal hex. AntD v6's CSS-var-mode
 * generator could not parse var() strings as colors (emitted #000000
 * black). The site-wide --color-brand and --color-brand-interaction CSS
 * variables in globals.css remain for non-AntD components, but AntD
 * itself consumes the literal hex.
 *
 * Brand reference: §5.2 Downriver navy (#0A2540), AAA on white (14.91:1).
 * colorLink uses ETF's interaction blue (#3656D6).
 *
 * Diverges from 6id's themeConfig only at the colorPrimary / colorLink /
 * colorInfo level — all other tokens (radii, shadows, font, control sizes)
 * inherit from baseThemeConfig.
 */

import type { ThemeConfig } from 'antd';
import { baseThemeConfig } from './shared';

export * from './shared';

export const themeConfig: ThemeConfig = {
  ...baseThemeConfig,
  token: {
    ...baseThemeConfig.token,
    colorPrimary: '#0A2540',
    colorInfo:    '#0A2540',
    colorLink:    '#3656D6',
  },
};
