import { defineConfig } from 'tsup';

const sharedExternal = [
  'react',
  'react-dom',
  'next',
  'antd',
  '@ant-design/icons',
  '@react-pdf/renderer',
  '@supabase/supabase-js',
  'stripe',
  'resend',
  'jose',
  'pdf-lib',
  'server-only',
  'groq-sdk',
  '@react-email/components',
  '@react-email/render',
  '@stripe/stripe-js',
  '@stripe/react-stripe-js',
];

const sharedBase = {
  format: ['esm', 'cjs'] as ('esm' | 'cjs')[],
  dts: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
  external: sharedExternal,
  outExtension({ format }: { format: 'esm' | 'cjs' }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
};

export default defineConfig([
  // Server-safe + neutral entries (no 'use client' banner).
  // Note: clean is intentionally false here. The npm `prepublishOnly` /
  // `clean` script wipes dist before the build, and running tsup with
  // clean:true in one of two parallel array configs caused the parallel
  // config's DTS output to be deleted mid-build.
  {
    ...sharedBase,
    clean: false,
    entry: {
      'tokens/index':         'src/tokens/index.ts',
      'tokens/shared':        'src/tokens/shared.ts',
      'tokens/6id':           'src/tokens/6id.ts',
      'tokens/etfframework':  'src/tokens/etfframework.ts',
      'ui-server/index':      'src/ui-server/index.ts',
      'content/index':        'src/content/index.ts',
      'commerce/index':       'src/commerce/index.ts',
      'commerce/webhook':     'src/commerce/webhook.ts',
      'commerce/priceMap':    'src/commerce/priceMap.ts',
      'commerce/checkout':    'src/commerce/checkout.ts',
      'analytics/index':      'src/analytics/index.ts',
      'seo/index':            'src/seo/index.ts',
      'seo-automation/index': 'src/seo-automation/index.ts',
      'utils/index':          'src/utils/index.ts',
      'hooks/index':          'src/hooks/index.ts',
    },
  },
  // Client-bundled entries: tsup/esbuild strip React directives during
  // bundling, so we inject `'use client'` at the top of every output file
  // via an onSuccess hook. Next.js 16 RSC requires the directive on the
  // actual published file when these modules are imported directly into a
  // Server Component (e.g. app/layout.tsx).
  {
    ...sharedBase,
    clean: false,
    entry: {
      'ui-client/index': 'src/ui-client/index.ts',
      'brand/index':     'src/brand/index.ts',
    },
    async onSuccess() {
      const { promises: fs } = await import('node:fs');
      const path = await import('node:path');
      const targets = [
        'dist/ui-client/index.mjs',
        'dist/ui-client/index.cjs',
        'dist/brand/index.mjs',
        'dist/brand/index.cjs',
      ];
      for (const rel of targets) {
        const full = path.resolve(process.cwd(), rel);
        try {
          const body = await fs.readFile(full, 'utf8');
          if (body.startsWith("'use client'") || body.startsWith('"use client"')) continue;
          await fs.writeFile(full, `'use client';\n${body}`);
        } catch (err) {
          // Surface but don't fail the build — caller will catch via head check.
          console.warn(`[etf-core onSuccess] could not patch ${rel}:`, err);
        }
      }
    },
  },
]);
