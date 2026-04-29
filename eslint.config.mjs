// Minimal eslint config matching consumer-repo style. Full design-rule
// enforcement happens in the consumer repos (AGENTS.md §16) since this
// package's primitives are framework-agnostic and consumed by both.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      // v1.5 additive: enforce DESIGN.md anti-patterns inside etf-core's own src/.
      // Scoped to this package only; consumer apps are unaffected.
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/\\\\brounded-3xl\\\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap (max rounded-[20px] = xl). Use radius('xl') or smaller.",
        },
        {
          selector: "TemplateElement[value.raw=/\\\\brounded-3xl\\\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap. Use radius('xl') or smaller.",
        },
      ],
    },
  },
  {
    // SHADOW_TOKENS is @deprecated. Restrict named imports outside the tokens
    // module itself — `tokens/{6id,etfframework,index}.ts` keep their
    // `export *` re-exports for binary compat with consumer apps.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/tokens/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '../tokens/shared',
              importNames: ['SHADOW_TOKENS'],
              message: 'SHADOW_TOKENS is @deprecated; new code must use BLUEPRINT_SHADOWS instead.',
            },
            {
              name: '../../tokens/shared',
              importNames: ['SHADOW_TOKENS'],
              message: 'SHADOW_TOKENS is @deprecated; new code must use BLUEPRINT_SHADOWS instead.',
            },
            {
              name: '@dangelopalladino/etf-core/tokens/shared',
              importNames: ['SHADOW_TOKENS'],
              message: 'SHADOW_TOKENS is @deprecated; new code must use BLUEPRINT_SHADOWS instead.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist', 'node_modules', 'tests'],
  },
);
