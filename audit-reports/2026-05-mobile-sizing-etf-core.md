# Mobile-Sizing Audit — etf-core (shared primitives)

**Date:** 2026-05-01
**Scope:** `etf-core` only — the shared primitive + token library at `/Users/dangelor.palladinolckroomr/Code/etf-core`. Consumer apps (`ETFtestSite`, `etfframework`) are explicitly out of scope.
**Method:** Static analysis. No live browser verification.
**Brief:** The audit prompt specifies a Next.js + Tailwind v4 + AntD codebase and asks why the mobile UI feels oversized. This document audits the upstream primitive layer that every consumer inherits.

---

## 1. Executive assessment

1. **The library ships an oversized default contract.** `BrandCta` defaults to `size="large"` (`src/ui-client/BrandCta.tsx:38`), and `ServerText` defaults body copy to `text-base md:text-lg` (`src/ui-server/ServerTypography.tsx:41`). Every consumer that uses these primitives without explicitly overriding inherits a 52px-tall pill button and 18px-at-md body type as the defaults. Both are exactly the anti-patterns called out in the audit brief.
2. **Typography is mobile-first but not fluid.** All headings use a fixed-pixel breakpoint ladder via Tailwind arbitrary values (`text-[30px] md:text-[36px] lg:text-[44px]`). The library has the infrastructure for fluid sizing — `DISPLAY_CLASSES` uses `clamp()` (`src/tokens/shared.ts:400–407`) — but only for poster-tier display headlines. The default headings, body text, and `Hero` title all skip the fluid path.
3. **`SectionWrapper` padding is also a breakpoint ladder, not `clamp()`.** Vertical padding maps `tight`→`generous` to `py-8 md:py-12` … `py-24 md:py-32` (`src/ui-server/SectionWrapper.tsx:45–55`), and horizontal padding is `px-4 sm:px-6` (`src/ui-server/SectionWrapper.tsx:111`). Mobile-first ordering is correct; fluid scaling between viewports is absent.
4. **AntD theming is correctly token-controlled at the library level.** `baseThemeConfig.components.Button` (`src/tokens/shared.ts:201–204`) sets `controlHeight: 44`, `controlHeightLG: 52`, `paddingInline: 28` — the prompt's "buttons should rely on AntD root theming" requirement is met. The 44px default also satisfies the WCAG 2.1 target-size guidance. The vulnerability is downstream: consumers can — and do — override these tokens per site.
5. **`Hero` and `CtaSection` bypass the shared scale.** `Hero` defines its own breakpoint-ladder typography inline (`src/ui-server/Hero.tsx:60`) instead of consuming `HEADING_CLASSES`. `CtaSection` carries hardcoded heavy padding (`p-8 sm:p-12 md:p-24`, `src/ui-client/CtaSection.tsx:18–19`), uses `rounded-3xl` (which violates etf-core's own ESLint rule at `eslint.config.mjs:21–31`), and inherits `BrandCta`'s `size="large"` default. These primitives drift from the system they belong to.
6. **The library has almost no design-system lint enforcement.** `eslint.config.mjs:21–31` enforces only a radius cap (`rounded-3xl` ban) and a deprecated-import rule for `SHADOW_TOKENS`. There is no rule for mobile-first responsive ordering, no rule restricting `size="large"` to specific contexts, and no rule preventing body copy from using heading-scale tokens. The comment at `eslint.config.mjs:1–3` explicitly punts enforcement to consumer repos. This is the structural reason regressions keep recurring: the library has no guardrail to defend its own contract.

**Verdict:** The UI feels oversized on mobile because the design system is internally inconsistent — the library ships fluid `clamp()` for display headlines but a fixed breakpoint ladder everywhere else, defaults its primary CTA to the largest button size, defaults body copy to the heading-adjacent `text-lg` at the most common viewport (md+), and provides no lint protection against drift. These are systemic issues at the primitive layer; no amount of consumer-side patching will resolve them durably.

---

## 2. Findings table

| Severity | Area | File:line | Current pattern | Why it is a problem | Recommended fix |
|---|---|---|---|---|---|
| **P0** | Button default | `src/ui-client/BrandCta.tsx:38` | `size = 'large'` default param | Every consumer call without explicit `size` gets 52px button. Prompt's decision rule: large reserved for hero/display only. | Flip default to `'middle'`. Add `size="large"` only at explicit hero call sites (e.g., `Hero` primary slot). Breaking change → minor bump. |
| **P0** | Body copy size | `src/ui-server/ServerTypography.tsx:41` | `body: 'text-base md:text-lg leading-relaxed text-text-secondary'` | Body copy grows to 18px at md+ — the prompt's named anti-pattern ("body copy using `text-lg`"). Body should be `text-base`. | Change body variant to `'text-base leading-relaxed text-text-secondary'` (drop the `md:text-lg`). |
| **P0** | Drift in `CtaSection` | `src/ui-client/CtaSection.tsx:18–19` | `rounded-3xl` in `dark` and `light` variant class strings | Violates etf-core's own ESLint rule (`eslint.config.mjs:21–31` bans `rounded-3xl`) and the radius cap in `DESIGN.md`. Indicates the lint rule isn't running on this file or wasn't enforced when the variant was added. | Replace `rounded-3xl` with `rounded-[20px]` (the documented `xl` cap) and verify ESLint runs against `src/ui-client/`. |
| **P1** | Section padding strategy | `src/ui-server/SectionWrapper.tsx:45–55, 111` | `SPACING_MAP` is breakpoint-ladder (`py-8 md:py-12` … `py-24 md:py-32`); horizontal `px-4 sm:px-6` | Discrete jumps at md (768px) — between 320px and 768px, padding is locked to mobile minimum; between 768px and 1024px+, padding is locked to desktop. Prompt requires fluid `clamp()` padding. | Move padding values into `@theme` tokens like `--space-section-default: clamp(2rem, 6vw, 6rem)` and consume via `py-[var(--space-section-default)]`. Requires a Tailwind preset (see P2). |
| **P1** | Heading typography is not fluid | `src/ui-server/ServerTypography.tsx:21–26`, `src/tokens/shared.ts:342–348` | `text-[30px] md:text-[36px] lg:text-[44px]` and equivalents for h2–h5 | Breakpoint ladder; identical to `Hero` inline values. The prompt's first decision rule: typography should be fluid via `--text-*` clamp tokens. | Migrate `HEADING_SCALE` to a fluid contract: `h1 → clamp(1.875rem, 1.2rem + 2.4vw, 2.75rem)` etc. Update `HEADING_CLASSES` and `HEADING_SIZES` to consume `--text-h1`, etc. Requires Tailwind preset (P2). |
| **P1** | `Hero` duplicates the type scale | `src/ui-server/Hero.tsx:60` | `text-[28px] sm:text-[32px] md:text-[40px] lg:text-[52px]` inline (4-step ladder) | `Hero` does not consume `HEADING_CLASSES`/`HEADING_SCALE`. Drift risk + same breakpoint-ladder anti-pattern. Subtitle also inline (`text-[15px] md:text-[17px] lg:text-[18px]` at `:64`). | Replace inline classes with `HEADING_CLASSES.h1` (or a new `HERO_CLASSES`). Once headings are fluid, this fix is automatic. |
| **P1** | `CtaSection` heavy fixed padding | `src/ui-client/CtaSection.tsx:18–20` | `p-8 sm:p-12 md:p-24` (32px → 48px → 96px); hardcoded `mb-16` (no ramp); inherits `BrandCta size="large"` | At md (768px), 96px of padding leaves ~576px of usable width. Hardcoded `mb-16` (64px) does not ramp by viewport. CTA inherits `size="large"` — large pill on a very padded card. | Reduce to `p-6 sm:p-10 md:p-16` (or fluid `p-[clamp(1.5rem,4vw,4rem)]`). Replace `mb-16` with `mb-12 md:mb-16`. Pass `size="middle"` (or accept a `ctaSize` prop) instead of inheriting the new `BrandCta` default once P0#1 lands. |
| **P2** | No `ConfigProvider` wrapper export | `src/tokens/index.ts` and `package.json` exports | etf-core ships only `themeConfig` objects; consumers wrap `<ConfigProvider>` themselves | Each consumer overrides tokens differently — observed in prior consumer audits where one site reduces `controlHeightLG` to 44 (still WCAG-safe) and another to 38 (below WCAG target). The token contract can't be defended. | Export an opt-in `BrandConfigProvider` wrapper from `etf-core/ui-client` that takes a brand name and applies the canonical `themeConfig` without per-consumer mutation. Document the existing manual path as the escape hatch, not the default. |
| **P2** | No Tailwind preset shipped | none | etf-core has no `tailwind.config.*`, no `@theme` block, no globals.css. Consumers define their own type scale. | etf-core cannot enforce a fluid `--text-*` scale at the source — it can only emit Tailwind class strings that consumers' Tailwind configs must interpret. This is the structural blocker for P1 fluid typography. | Ship `etf-core/tailwind.preset.css` with a canonical `@theme` block defining `--text-h1`…`--text-h5`, `--text-body`, `--space-section-*`, etc., as `clamp()` values. Document opt-in via consumer's `globals.css` `@import` or `@source`. |
| **P2** | No design-system lint rules | `eslint.config.mjs:21–31` | Only `rounded-3xl` ban + `SHADOW_TOKENS` deprecation. Comment defers all design enforcement to consumer repos. | The library has no guardrail against the very anti-patterns the audit prompt names: body using `text-lg`, `size="large"` outside hero, mobile-first ordering, fixed-px sizing. Defects re-enter on every primitive change. | Add a custom plugin `etf-core/eslint-plugin` exporting rules: `body-text-token` (bans `text-lg` in `<p>`/`<span>` / `ServerText body`), `heading-token-only` (bans inline arbitrary text-px on heading tags), `mobile-first-order` (bans desktop-first class ordering). Apply inside `src/`; export for consumers to opt into. |
| **Info** | `BrandCta` accessibility fix preserved | `src/ui-client/BrandCta.tsx:64–82` | Uses `useRouter().push(href)` instead of `<Link><Button>` | Prior nested-anchor fix from v1.0.7 still in place. Not a regression. | None — keep. |
| **Info** | Breakpoint contract is mobile-first | `src/tokens/shared.ts:228–240` | `BREAKPOINTS` defined as min-width only | Satisfies the prompt's mobile-first ordering requirement at the contract level. All primitive class strings observed are base→sm→md→lg. | None — keep. |
| **Info** | Display headlines are fluid | `src/tokens/shared.ts:400–407` | `DISPLAY_CLASSES.{sm,md,lg}` use `text-[clamp(...)]` | Pattern exists. Generalize it (P1). | None standalone — informs P1. |

---

## 3. Typography audit

### Tokens inventory

| Token | File:line | Type | Fluid? | Used by |
|---|---|---|---|---|
| `HEADING_SCALE` (h1–h5 px sizes) | `src/tokens/shared.ts:23–31` | Numeric px | ❌ Fixed | AntD theme `fontSizeHeading*`, brand themes |
| `HEADING_CLASSES` (h1–h5 Tailwind class strings) | `src/tokens/shared.ts:342–348` | Tailwind class string | ❌ Fixed (breakpoint ladder) | `ServerHeading` (mirrors), and any consumer that imports the strings |
| `HEADING_SIZES` (inline mirror in `ServerTypography`) | `src/ui-server/ServerTypography.tsx:21–26` | Tailwind class string | ❌ Fixed (breakpoint ladder) | `ServerHeading` |
| `DISPLAY_CLASSES.{sm,md,lg}` | `src/tokens/shared.ts:400–407` | Tailwind `text-[clamp(...)]` | ✅ Fluid | poster/manifesto headlines only |
| `fonts.{display,body,mono,serif}` | `src/tokens/shared.ts:147–156` | CSS font stack | n/a | AntD `fontFamily` |
| `baseThemeConfig.token.fontSize` | `src/tokens/shared.ts:178` | `14` (px) | ❌ Fixed | AntD body sizing |
| `baseThemeConfig.token.fontSizeHeading*` | `src/tokens/shared.ts:181–185` | sourced from `HEADING_SCALE` | ❌ Fixed | AntD typography components |
| `SHARED_SPACING_SCALE` (0…30, in px) | `src/tokens/shared.ts:287–303` | Numeric px | ❌ Fixed | `Stack`, `Cluster`, `Card` via `space()` helper |
| `BREAKPOINTS` (min-width in px) | `src/tokens/shared.ts:228–240` | Numeric px | n/a | docs / TS types |

**Verdict on the prompt's body-text question:**

`ServerText.body` at `src/ui-server/ServerTypography.tsx:41`:

```ts
body: 'text-base md:text-lg leading-relaxed text-text-secondary',
```

Body copy renders at `text-base` (16px) on mobile and **`text-lg` (18px) at md+**. This is the prompt's named anti-pattern: "Is body copy incorrectly using heading-scale classes like `text-lg`?" — yes, at all viewports ≥ 768px. Recommended fix: drop `md:text-lg`. Body should remain `text-base` across all viewports unless a consumer explicitly opts in to a larger reading scale.

**Verdict on the prompt's fluid-type-scale question:**

The library has fluid `clamp()` infrastructure (`DISPLAY_CLASSES`) but does not use it for the default heading scale. `HEADING_CLASSES` and `HEADING_SIZES` are pure breakpoint ladders. Tailwind v4's recommended pattern is `--text-*` theme variables that can be `clamp()` expressions (verified against current Tailwind v4 docs: `@theme { --text-tiny: 0.625rem; }` with optional sub-modifiers). etf-core ships no `@theme` block (it ships no Tailwind preset at all), so it cannot define `--text-h1: clamp(...)` at the source. Both gaps need closing for the audit's typography contract to hold.

---

## 4. AntD sizing audit

### Root token configuration

`baseThemeConfig` at `src/tokens/shared.ts:158–217`:

```ts
token: {
  fontSize: 14,
  fontSizeHeading1: HEADING_SCALE.h1.size,  // 44
  fontSizeHeading2: HEADING_SCALE.h2.size,  // 30
  fontSizeHeading3: HEADING_SCALE.h3.size,  // 24
  fontSizeHeading4: HEADING_SCALE.h4.size,  // 20
  fontSizeHeading5: HEADING_SCALE.h5.size,  // 16
  controlHeight: 40,
  controlHeightLG: 48,
  controlHeightSM: 32,
  // …
},
components: {
  Button: {
    borderRadius: 9999,
    controlHeight: 44,
    controlHeightLG: 52,
    paddingInline: 28,
    fontWeight: 600,
    // …
  },
  Input: { borderRadius: 8, controlHeight: 44, paddingInline: 16 },
  // …
}
```

### Brand overrides

| Token | base | 6id (`src/tokens/6id.ts`) | etfframework (`src/tokens/etfframework.ts`) |
|---|---|---|---|
| `token.controlHeight` | 40 | 44 | 48 |
| `token.controlHeightLG` | 48 | 52 | 56 |
| `token.controlHeightSM` | 32 | 32 | 36 |
| `Button.controlHeight` | 44 | 44 | 48 |
| `Button.controlHeightLG` | 52 | 52 | 56 |
| `Button.paddingInline` | 28 | 24 | 22 |
| `Button.borderRadius` | 9999 (pill) | 10 (rounded) | 6 (institutional) |
| `Button.fontWeight` | 600 | 600 | 600 |

**Verdict on prompt question 4 (root tokens for `controlHeight*`, `fontSize*`, `paddingInline*`, button padding):** ✅ All present and centrally configured at the etf-core layer. Buttons rely on AntD root theming, not page-level overrides. The default 44px (`Button.controlHeight`) and 52px (`Button.controlHeightLG`) heights both satisfy the WCAG 2.1 target-size minimum of 44×44 CSS px when applied as documented.

**Components that bypass the token system inside etf-core:** none observed. Brand themes spread `baseThemeConfig.components` and override only specific keys; the inheritance chain is intact.

### `ConfigProvider` wrapper

**Not exported.** etf-core ships `themeConfig` objects from `tokens/6id` and `tokens/etfframework` and expects consumers to pass them to `<ConfigProvider theme={themeConfig}>` themselves. There is no wrapper component, no preset factory, no enforcement.

**Judgment:** This was a deliberate boundary at v1.x — consumers need control over where the provider sits relative to other client providers (BrandProvider, Auth, etc.). However, the absence of a sanctioned wrapper means each consumer can — and does — mutate the token contract. A library-owned wrapper that accepts a brand and applies the canonical `themeConfig` without allowing per-site reduction (or that warns when reductions cross the WCAG threshold) would close this loophole without removing flexibility.

---

## 5. Primitive audit

For each shared primitive, verdict on whether it enforces or undermines the mobile-first contract. Files checked: `src/ui-client/{BrandCta, CtaSection, SectionHeader, MetricPanel, ScoreBar, StatusBadge, LoadingState, SkeletonCard, LockedGate}.tsx`, `src/ui-server/{SectionWrapper, ServerTypography, Eyebrow, Kicker, NoticeCard, EmptyState, IconBadge, Stat, Stack, Hero, Card}.tsx`.

### `BrandCta` — `src/ui-client/BrandCta.tsx`

**Verdict: undermines.** Default `size = 'large'` at `:38` makes every undecorated call site render the largest pill button (52px tall, 28px horizontal padding via base theme). The prompt's first decision rule requires `size="middle"` as default with `large` reserved for hero/display variants; this primitive does the opposite. The component otherwise behaves correctly: it forwards `size` straight to AntD Button so the centrally-configured tokens apply, alignment uses `Space size={12} wrap`, and the editorial weight variant correctly avoids the button altogether. Single-line fix at `:38`.

### `SectionWrapper` — `src/ui-server/SectionWrapper.tsx`

**Verdict: partially undermines.** Mobile-first ordering is correct (every spacing token is `py-N md:py-M` with M ≥ N). Density tokens, max-width tokens, and tone fallback are clean. The defect is the absence of fluid scaling: between 320px and 767px, padding is locked to the smaller value; between 768px and infinity, it's locked to the larger value. The user's prompt explicitly requires fluid `clamp()` padding instead of breakpoint ladders. Comment at `:6–24` suggests density/spacing decisions are intentional, but the contract is too rigid for a true fluid layout. Fix requires either a Tailwind preset with `--space-section-*` tokens or inline `py-[clamp(...)]` strings; the former is preferable for governance.

### `ServerHeading` — `src/ui-server/ServerTypography.tsx:7–28`

**Verdict: partially undermines.** Mobile-first ordering is correct; level-based defaults are sensible; `font-serif font-bold text-primary` base is consistent. The defect is the breakpoint-ladder type scale (`text-[30px] md:text-[36px] lg:text-[44px]` for h1, etc.) — the same anti-pattern as `SectionWrapper`. Also: `HEADING_SIZES` at `:21–26` duplicates `HEADING_CLASSES` from `src/tokens/shared.ts:342–348`, which is a single-source-of-truth violation even though both currently agree (a `tests/tokens.test.ts` lock-step assertion is mentioned in the comment but the duplication still exists in source).

### `ServerText` — `src/ui-server/ServerTypography.tsx:30–47`

**Verdict: undermines.** Body variant ramps to `text-lg` at md+ — the prompt's high-confidence anti-pattern. Other variants (`secondary`, `muted`, `eyebrow`, `caption`) are sensibly sized at `text-sm`/`text-xs`. Single-line fix at `:41`.

### `Hero` — `src/ui-server/Hero.tsx`

**Verdict: undermines.** Inline typography classes (`text-[28px] sm:text-[32px] md:text-[40px] lg:text-[52px]` for title at `:60`, `text-[15px] md:text-[17px] lg:text-[18px]` for subtitle at `:64`, `text-[11px] md:text-[12px]` for eyebrow at `:59`) bypass `HEADING_CLASSES`/`HEADING_SCALE` entirely. Padding is also a four-step breakpoint ladder (`py-10 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-10` at `:83`). The JSDoc comment at `:21–37` documents this layout intentionally and notes "Padding ramps up — never starts large and shrinks," which is correct mobile-first practice — but every value is fixed-pixel breakpoint-ladder, not fluid. Should consume the canonical scale.

### `CtaSection` — `src/ui-client/CtaSection.tsx`

**Verdict: undermines.** Three issues:
1. **Heavy fixed padding** (`p-8 sm:p-12 md:p-24` at `:18–19`): 96px padding at md leaves ~576px usable width; on a 768px viewport that is 25% of horizontal space consumed by padding alone. Mobile-first ordering is correct (32→48→96), but `p-24` at md is excessive.
2. **`rounded-3xl`** at `:18–19` violates etf-core's own ESLint rule (`eslint.config.mjs:21–31` bans the class). This is an active rule violation in source.
3. **Inherits `BrandCta size="large"` default** at `:51–56` — the same anti-pattern as P0#1 cascading into a CTA-specific composition.

### `SectionHeader` — `src/ui-client/SectionHeader.tsx` (not re-read in execution; surfaced from imports)

Not directly inspected during execution but cited by `CtaSection`. Worth a follow-up read in any P1 work. Not blocking this audit.

### `Stack` and `Cluster` — `src/ui-server/Stack.tsx`

**Verdict: enforces.** Token-bound gap via `space()` helper, mobile-first ramp via optional `gapMd`. JSDoc explicitly documents the 320px base layout. No fixed widths or heights. Width is `w-full` — flexes to container. Polymorphic `as` prop allows semantic correctness. No issues.

### `Card` — `src/ui-server/Card.tsx`

**Verdict: enforces.** Token-bound padding via `space()`, mobile-first ramp via `paddingMd`/`paddingLg` props (defaults: 16/24/— px), token-bound radius. JSDoc explicitly documents "Padding never starts large and shrinks." `w-full`, no fixed height. Polymorphic `as`. Tone variants use brand-token colors. No issues.

### Smaller primitives (Eyebrow, Kicker, NoticeCard, EmptyState, IconBadge, Stat, MetricPanel, ScoreBar, StatusBadge, LoadingState, SkeletonCard, LockedGate)

Not individually re-read in execution. Recommend a P2 sweep applying the same lens (look for `text-lg` body usage, fixed-px breakpoint ladders, hardcoded large padding) once the P0 and P1 changes establish the new contract.

---

## 6. Layout audit

etf-core does not own page layouts; consumer apps do. The library does own `SectionWrapper` (the layout primitive consumers reach for first), the spacing scale (`SHARED_SPACING_SCALE`), and the layout primitives (`Stack`, `Cluster`, `Card`).

### `SectionWrapper` review

Already covered in §5 — verdict: partially undermines due to breakpoint-ladder padding instead of fluid `clamp()`. Max-width tokens (`max-w-3xl` / `max-w-5xl` / `max-w-6xl` / `max-w-none`) are sensible. `maxWidth='full'` correctly drops outer horizontal padding so children can self-constrain. Density gap scale (`[&>*+*]:mt-6 md:[&>*+*]:mt-8` … `[&>*+*]:mt-16 md:[&>*+*]:mt-20`) follows the same breakpoint-ladder pattern.

### Spacing scale

`SHARED_SPACING_SCALE` at `src/tokens/shared.ts:287–303` is a fixed 4px-base numeric scale (0/4/8/12/16/20/24/32/40/48/56/64/80/96/120). Consumed via `space()` helper by `Stack`, `Cluster`, `Card`. Fixed numeric values are correct here — these are gap/padding primitives intended to be composed into responsive layouts via the `gapMd`/`paddingMd`/`paddingLg` props. The mobile-first ramp lives in the consuming primitive, not the scale.

### Grid primitive

**etf-core does not export a Grid primitive.** Consumer apps assemble grids ad hoc with Tailwind (`grid grid-cols-N md:grid-cols-M`). Consequence: the prompt's auto-fit/auto-fill recommendation (`grid-cols-[repeat(auto-fit,minmax(N,1fr))]`) cannot be enforced from the library. Out of scope for this audit, but a candidate primitive for a future release.

### Layout findings that live in consumers

The prompt's grid-overflow checks (`grid-cols-2 md:grid-cols-3` at base, etc.) and the page-level `<Button size="large">` audit live in the consumer apps. Per the user's scope decision, those are explicitly out of scope here. Reference the prior audit cohort `audit-reports/MASTER-SHARED-AUDIT-REPORT.md` for the consumer-side workstream.

---

## 7. Linting audit

### Current rules

`eslint.config.mjs` (full file) enforces:

1. **`no-restricted-syntax`** for `rounded-3xl` (lines 21–31) — both `Literal` and `TemplateElement` selectors. Message: "rounded-3xl is banned per DESIGN.md §radius cap."
2. **`no-restricted-imports`** for `SHADOW_TOKENS` from any path (lines 38–63), with token module exempted via `ignores: ['src/tokens/**']`.
3. **`@typescript-eslint/no-unused-vars`** scoped to `src/`, ignoring `_`-prefixed args.
4. **`@typescript-eslint/no-explicit-any`** turned off.

The comment at `eslint.config.mjs:1–3` is explicit: *"Minimal eslint config matching consumer-repo style. Full design-rule enforcement happens in the consumer repos (AGENTS.md §16) since this package's primitives are framework-agnostic and consumed by both."*

### Live violation

The `rounded-3xl` rule appears to be currently violated by `src/ui-client/CtaSection.tsx:18–19` (the `dark` and `light` variant class strings both contain `rounded-3xl`). Either the rule isn't running on this file (lint scoped narrower than expected, or `CtaSection` was added to an `ignores` list that was later removed), or the rule was added after `CtaSection` was last linted in CI. Worth verifying by running `pnpm lint` (not done in this audit; observation only).

### What's missing

None of the following — all of which the audit prompt asks about — are enforced:

- No rule preventing `text-lg` (or larger) on `<p>` / `<span>` / `ServerText body` (prompt question: "Is body copy incorrectly using heading-scale classes?").
- No rule restricting `BrandCta` / `Button` `size="large"` to specific call contexts (prompt question 10: "Is there a lint or architectural guardrail preventing non-hero buttons from using `size='large'`?").
- No mobile-first responsive ordering rule (prompt question 9: "Does the custom ESLint rule catch desktop-first ordering?").
- No rule against fixed-px text values (`text-[Npx]`) at the heading tags, which would force consumers through `HEADING_CLASSES`.
- No rule against `<ConfigProvider>` token mutations that lower `controlHeight*` below 44 (the WCAG target-size threshold).

### Why this matters

The library has the strongest contract (mobile-first breakpoints, token-bound spacing, single-source heading scale) but the weakest enforcement. Every primitive deviation surfaced in §5 (`BrandCta size="large"` default, `ServerText body` ramping to `text-lg`, `Hero` inline arbitrary px values, `CtaSection rounded-3xl`) would have been caught by a custom plugin had one existed. The prompt's "fix plan" guidance explicitly favors lint rules that prevent regression — that path is wide open here.

The deferral to consumer repos is internally inconsistent: the radius cap and SHADOW_TOKENS rules are enforced *inside* etf-core, so the "framework-agnostic" justification doesn't fully hold. The same model can extend to a typography rule, a button-size rule, and a mobile-first ordering rule, all scoped to `src/**` here and re-exported as a consumer-opt-in plugin.

---

## 8. Prioritized fix plan

### P0 — immediate, low-risk default flips (single-line changes; minor version bump)

1. **`src/ui-client/BrandCta.tsx:38`** — change `size = 'large'` to `size = 'middle'`. Document the breaking change in CHANGELOG; consumers that want the old behavior add `size="large"` at the call site (only at hero contexts, per the prompt's contract). Update primary `<Button>` and secondary `<Button>` rendering (both forward `size`). No other code change needed.
2. **`src/ui-server/ServerTypography.tsx:41`** — change body variant to `'text-base leading-relaxed text-text-secondary'` (drop the `md:text-lg`). Body copy stays at 16px across all viewports.
3. **`src/ui-client/CtaSection.tsx:18–19`** — replace `rounded-3xl` with `rounded-[20px]` (the `xl` cap from `DESIGN.md`). Verify ESLint catches future regressions by running `pnpm lint` after the change.

Suggested release: a single `feat:` PR titled `feat(ui): mobile-first defaults — BrandCta size, body copy size, radius cap`. Triggers minor bump on merge per CI.

### P1 — shared primitive refactors (require Tailwind preset to land cleanly)

4. **Ship a Tailwind preset.** Create `etf-core/tailwind.preset.css` with an `@theme` block defining:
   - `--text-h1: clamp(1.875rem, 1.2rem + 2.4vw, 2.75rem);` (and h2–h5 via the same shape, sourced from a refreshed `HEADING_SCALE` that adds `min`/`max`/`vw` fields)
   - `--text-body: 1rem;` (intentionally non-fluid so reading line-length stays predictable)
   - `--space-section-tight`/`compact`/`default`/`spacious`/`generous` as `clamp()` values matching the existing breakpoint-ladder targets
   - Document opt-in via consumer `globals.css` `@import '@dangelopalladino/etf-core/tailwind.preset.css'`
5. **Migrate `HEADING_CLASSES`/`HEADING_SIZES` to consume `--text-h1`–`--text-h5`** — once the preset lands, replace `text-[30px] md:text-[36px] lg:text-[44px]` with `text-[var(--text-h1)]` etc. Single source of truth restored; fluid scaling automatic.
6. **Migrate `SectionWrapper.SPACING_MAP`** to consume `--space-section-*` — replace `py-8 md:py-12` etc. with `py-[var(--space-section-tight)]` etc. Horizontal padding becomes `px-[var(--space-section-h)]` similarly.
7. **Refactor `Hero`** to consume `HEADING_CLASSES.h1` (or a new `HERO_CLASSES.title`) instead of inline arbitrary values. Same for subtitle and eyebrow — promote to named tokens.
8. **Refactor `CtaSection`** to use lighter padding (`p-6 sm:p-10 md:p-16` or fluid via tokens) and an explicit `ctaSize` prop that defaults to `middle`. Drop `mb-16` in favor of `mb-12 md:mb-16` (or fluid).

Suggested release: a single `feat:` PR per item or grouped per primitive; minor bumps. Communicates well in CHANGELOG.

### P2 — governance and lint enforcement

9. **Export an opt-in `BrandConfigProvider`** from `etf-core/ui-client` that takes a brand identifier and applies the canonical `themeConfig` without per-consumer mutation. Keep the manual `<ConfigProvider theme={themeConfig}>` path as the documented escape hatch for advanced cases. Add a runtime warning (development-only) when a consumer-supplied theme reduces `controlHeight*` below 44.
10. **Build a custom ESLint plugin** at `src/eslint-plugin/` exporting:
    - `body-text-token` — bans `text-lg` (or larger) on `<p>` / `<span>` and on `ServerText body` variant
    - `heading-token-only` — bans inline `text-[Npx]` on heading tags; requires `HEADING_CLASSES.hN` consumption
    - `mobile-first-order` — ports the consumer-side rule (already present in `ETFtestSite/eslint.config.mjs:271–286`) into etf-core, scoped to `src/**`, with the same `max-*` and unguarded fixed-px width/height detection
    - `no-cta-size-large-default` — flags `<BrandCta>` calls without an explicit hero context comment when `size="large"` is passed
    Apply inside `src/`; export as a sub-package consumers can opt into.
11. **Sweep the smaller primitives** (Eyebrow, Kicker, NoticeCard, EmptyState, IconBadge, Stat, MetricPanel, ScoreBar, StatusBadge, LoadingState, SkeletonCard, LockedGate, SectionHeader) for the same `text-lg` / fixed-px / heavy padding defects. Document findings as a follow-up issue.
12. **Resolve the `HEADING_SIZES` / `HEADING_CLASSES` duplication** — `ServerTypography.tsx:21–26` and `tokens/shared.ts:342–348` should be a single import, not two copies kept in sync by a test assertion.

Suggested release: each P2 item ships independently. The lint plugin can be a new `etf-core/eslint-plugin` export with its own semver.

---

## 9. Out-of-scope reference

Consumer-side findings (page-level button audits, grid-overflow scans, consumer `ConfigProvider` token reductions, consumer ESLint rule scope) live in `ETFtestSite` and `etfframework` and are explicitly out of scope per the user's audit-scope decision on 2026-05-01. When a consumer audit lands, the report should pair against this document so primitive-level fixes (P0/P1 above) are not duplicated as consumer-side patches.

The closed audit cohort at `audit-reports/MASTER-SHARED-AUDIT-REPORT.md` is a different scope (canonical drift, ecosystem events, withUtm helper, fonts/icons tokens, etc.) and does not overlap with mobile sizing.

---

## 10. Verification record

- Every row in the §2 findings table cites a real `path:line` and the cited code is reproduced verbatim elsewhere in this document or available in the source files at the cited locations as of 2026-05-01.
- All 11 audit questions from the user's brief are answered:
  1. `globals.css` fluid type scale → §3, §4 (etf-core ships none; recommend P2#9)
  2. text-* mapped to fluid → §3 (no, breakpoint ladder; recommend P1#4–5)
  3. body using heading-scale → §3 (yes at md+; P0#2)
  4. AntD ConfigProvider tokens → §4 (configured at base + brand layers; ✅)
  5. BrandCta default → §5 (defaults to `large`; P0#1)
  6. SectionWrapper fluid padding → §5, §6 (no; P1#6)
  7. Auto-fill/minmax grids → §6 (no Grid primitive; out of scope deferred)
  8. Mobile-first ordering → §6, §7 (yes at primitive layer; ✅)
  9. ESLint catches desktop-first → §7 (no rule; P2#10)
  10. Lint guardrail vs `size="large"` → §7 (no rule; P2#10)
  11. 44×44 tap target → §4 (✅ at base/brand themes; P2#9 to defend against consumer reductions)
- Things etf-core does correctly are explicitly enumerated (Info rows in §2; verdicts in §5 for `Stack`, `Cluster`, `Card`; §4 verdict on AntD theming).
- Out-of-scope items are named in §9 so a future consumer-side audit knows where to begin.
- The fix plan separates default flips (P0) from refactors (P1) from governance (P2) so a P0 release can ship as a single small PR without depending on the larger primitive migrations.
