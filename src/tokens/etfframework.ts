/**
 * ETF FRAMEWORK — site-specific tokens.
 *
 * v1.0.4 — colorPrimary fallback set to navy per directive §5.2 (#0A2540
 * Downriver navy, AAA on white surfaces, 14.91:1). colorLink uses ETF's
 * interaction blue (#3656D6, §5.2). Site repo continues to set
 * --color-brand and --color-brand-interaction in globals.css; var() wins
 * when set, fallback ships navy when not.
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
    colorPrimary: 'var(--color-brand, #0A2540)',
    colorInfo:    'var(--color-brand, #0A2540)',
    colorLink:    'var(--color-brand-interaction, #3656D6)',
  },
};
