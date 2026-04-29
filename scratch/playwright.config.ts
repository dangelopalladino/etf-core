import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3030',
    trace: 'off',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3030',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
