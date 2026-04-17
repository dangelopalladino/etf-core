import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.tsx', 'src/**/index.ts'],
    },
    alias: {
      // server-only throws when imported outside Next.js Server Components;
      // alias to a no-op shim for unit tests that exercise server-tagged code.
      'server-only': path.resolve(__dirname, 'tests/__shims__/server-only.ts'),
    },
  },
});
