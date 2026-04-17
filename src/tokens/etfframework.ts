/**
 * ETF FRAMEWORK — site-specific tokens.
 *
 * Re-exports all shared tokens. The current themeConfig matches `baseThemeConfig`
 * (parity with 6id's foundational AntD overrides). Add etfframework-only
 * overrides here when the brand visually diverges.
 */

import type { ThemeConfig } from 'antd';
import { baseThemeConfig } from './shared';

export * from './shared';

export const themeConfig: ThemeConfig = baseThemeConfig;
