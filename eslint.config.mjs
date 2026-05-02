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
      //
      // v1.7.x mobile-sizing addition: cta-default-size bans `size = 'large'`
      // as a default-parameter value in primitives so the new `size = 'middle'`
      // default in BrandCta cannot be silently re-flipped.
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/\\brounded-3xl\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap (max rounded-[20px] = xl). Use radius('xl') or smaller.",
        },
        {
          selector: "TemplateElement[value.raw=/\\brounded-3xl\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap. Use radius('xl') or smaller.",
        },
        {
          selector: "AssignmentPattern[left.name='size'][right.value='large']",
          message: "Default CTA/Button `size` must be `'middle'` (WCAG-safe at 44px via brand themes). `'large'` is opt-in at hero/display call sites only.",
        },
      ],
    },
  },
  {
    // v1.7.x mobile-sizing typography contract. Enforced ONLY on the
    // primitives migrated to the fluid HEADING_CLASSES/HERO_CLASSES/
    // DISPLAY_CLASSES contract. v1.11.1 extends to MetricPanel, StatusBadge,
    // ScoreBar, IconBadge, Stack — audit-clean primitives that v1.11.0 left
    // outside the ratchet, plus fixes the regex over-escaping bug that
    // rendered every selector a no-op (the prior `\\\\s` produced a regex
    // matching literal backslash+s, not whitespace).
    //
    // - body-text-token: bans `text-lg` or larger in any string/template
    //   literal so paragraph-like surfaces cannot ramp body copy into the
    //   heading scale.
    // - heading-token-only: bans inline `text-[Npx]` so heading primitives
    //   consume the shared fluid clamp() tokens instead of arbitrary px
    //   ladders.
    files: [
      'src/ui-client/BrandCta.tsx',
      'src/ui-client/CtaSection.tsx',
      'src/ui-client/LoadingState.tsx',
      'src/ui-client/LockedGate.tsx',
      'src/ui-client/MetricPanel.tsx',
      'src/ui-client/ScoreBar.tsx',
      'src/ui-client/SectionHeader.tsx',
      'src/ui-client/SkeletonCard.tsx',
      'src/ui-client/StatusBadge.tsx',
      'src/ui-server/Card.tsx',
      'src/ui-server/EmptyState.tsx',
      'src/ui-server/Eyebrow.tsx',
      'src/ui-server/Hero.tsx',
      'src/ui-server/IconBadge.tsx',
      'src/ui-server/Kicker.tsx',
      'src/ui-server/NoticeCard.tsx',
      'src/ui-server/SectionWrapper.tsx',
      'src/ui-server/ServerTypography.tsx',
      'src/ui-server/Stack.tsx',
      'src/ui-server/Stat.tsx',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/\\brounded-3xl\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap (max rounded-[20px] = xl).",
        },
        {
          selector: "TemplateElement[value.raw=/\\brounded-3xl\\b/]",
          message: "rounded-3xl is banned per DESIGN.md §radius cap.",
        },
        {
          selector: "AssignmentPattern[left.name='size'][right.value='large']",
          message: "Default CTA/Button `size` must be `'middle'`. `'large'` is opt-in at hero/display call sites only.",
        },
        {
          selector: "Literal[value=/(^|\\s)(md:|lg:|xl:)?text-(lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(\\s|$)/]",
          message: "Body-oriented text utilities must stay at `text-base` or smaller. Use ServerHeading/HEADING_CLASSES/HERO_CLASSES/DISPLAY_CLASSES for heading-scale typography.",
        },
        {
          selector: "TemplateElement[value.raw=/(^|\\s)(md:|lg:|xl:)?text-(lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(\\s|$)/]",
          message: "Body-oriented text utilities must stay at `text-base` or smaller. Use ServerHeading/HEADING_CLASSES/HERO_CLASSES/DISPLAY_CLASSES for heading-scale typography.",
        },
        {
          selector: "Literal[value=/(^|\\s)(md:|lg:|xl:)?text-\\[\\d+px\\]/]",
          message: "Inline `text-[Npx]` is banned in migrated primitives. Consume HEADING_CLASSES/HERO_CLASSES/DISPLAY_CLASSES (fluid clamp() since v1.7.x).",
        },
        {
          selector: "TemplateElement[value.raw=/(^|\\s)(md:|lg:|xl:)?text-\\[\\d+px\\]/]",
          message: "Inline `text-[Npx]` is banned in migrated primitives. Consume HEADING_CLASSES/HERO_CLASSES/DISPLAY_CLASSES (fluid clamp() since v1.7.x).",
        },
        {
          // v1.11.0 — hex literals in className arbitrary values are banned
          // in migrated primitives. Use SURFACE_TOKENS / BORDER_TOKENS /
          // BLUEPRINT_SHADOWS or semantic Tailwind utilities (border-border,
          // bg-surface-raised, etc.). Hex belongs in src/tokens/, not ui-*.
          selector: "Literal[value=/(border|bg|text|ring)-\\[#[0-9A-Fa-f]{3,8}\\]/]",
          message: "Hex literals in className arbitrary values are banned in migrated primitives. Use SURFACE_TOKENS / BORDER_TOKENS / BLUEPRINT_SHADOWS or semantic Tailwind utilities.",
        },
        {
          selector: "TemplateElement[value.raw=/(border|bg|text|ring)-\\[#[0-9A-Fa-f]{3,8}\\]/]",
          message: "Hex literals in className arbitrary values are banned in migrated primitives. Use SURFACE_TOKENS / BORDER_TOKENS / BLUEPRINT_SHADOWS or semantic Tailwind utilities.",
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
