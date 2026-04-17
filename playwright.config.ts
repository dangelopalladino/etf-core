import { defineConfig, devices } from '@playwright/test';

/**
 * Cross-site Playwright config — Phase 11 Track F.
 *
 * Tests run against LIVE deployments of both 6id and etfframework. Configure
 * the URLs via env:
 *   SIX_ID_URL          (default: https://www.6identities.com)
 *   ETFFRAMEWORK_URL    (default: https://etfframework.com)
 *
 * Nightly schedule lives in `.github/workflows/nightly-cross-site.yml`.
 */
export default defineConfig({
  testDir: './e2e/cross-site',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 30_000 },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'flow-a-6id-to-etfframework',
      testMatch: /flow-a-.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'flow-b-etfframework-to-6id',
      testMatch: /flow-b-.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
