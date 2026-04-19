import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'tokens/index':              'src/tokens/index.ts',
    'tokens/shared':             'src/tokens/shared.ts',
    'tokens/6id':                'src/tokens/6id.ts',
    'tokens/etfframework':       'src/tokens/etfframework.ts',
    'ui-server/index':           'src/ui-server/index.ts',
    'ui-client/index':           'src/ui-client/index.ts',
    'content/index':             'src/content/index.ts',
    'commerce/index':            'src/commerce/index.ts',
    'commerce/webhook':          'src/commerce/webhook.ts',
    'commerce/priceMap':         'src/commerce/priceMap.ts',
    'analytics/index':           'src/analytics/index.ts',
    'seo/index':                 'src/seo/index.ts',
    'utils/index':               'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
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
  ],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
});
