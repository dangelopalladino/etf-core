# Changelog

All notable changes to `@dangelopalladino/etf-core` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **major** — breaking prop or API changes
- **minor** — new components, exported fields, or analytics events
- **patch** — bug fixes and content corrections

## [1.6.0] — 2026-04-29

### Added (additive only — zero existing exports removed or modified)

**Tokens (`@dangelopalladino/etf-core/tokens/shared`)**
- `DISPLAY_CLASSES` (`sm` | `md` | `lg`) — poster-tier title classes using
  `clamp()` for fluid scaling between mobile and desktop. Tracking `-0.04em`,
  leading `1.02`. One display headline per page max.
- `DisplayScale` type alias (keys of `DISPLAY_CLASSES`).
- `MOTION_TOKENS_IMPECCABLE` — `{ ease, durations: { fast, base, slow },
  keyframes: ['fadeSlide', 'textRise', 'fadeUp'] }`. Mirrors the values used
  in 6id `globals.css`. The keyframe list is the allowlist enforced by
  6id's `tools/eslint-rules/animation-allowlist.js`.

**Server primitives (`@dangelopalladino/etf-core/ui-server`)**
- `SectionWrapper` — new `maxWidth='full'` (edge-to-edge, drops outer
  horizontal padding), new `spacing` levels `'tight'` (py-8 md:py-12) and
  `'spacious'` (py-20 md:py-28), and new optional `tone='warm'` prop.
  `tone` wins over `background` for the bg layer when both are passed.
  Existing call signatures render byte-identical output.

**Client primitives (`@dangelopalladino/etf-core/ui-client`)**
- `SectionHeader` — new `'manifesto'` and `'display'` variants. Both use
  `<h1>`-level semantics via the existing `titleLevel` prop and apply
  `clamp()`-based display sizing matching `DISPLAY_CLASSES`.
- `BrandCta` — new optional `weight` prop (`'standard' | 'editorial'`,
  default `'standard'`). When `editorial`, the primary renders as an
  inline arrow-suffixed text link in the brand color (no button chrome);
  the secondary still renders as a normal button.
- `StatusBadge` — new optional `variant='text-only'` (bare colored label,
  no background, no border, ignores `dot`). Existing `pill` and `subtle`
  variants are unchanged.

### Fixed

- **Brand bundle `'use client'` directive.** `dist/brand/index.{cjs,mjs}`
  and `dist/ui-client/index.{cjs,mjs}` now begin with `'use client';` so
  Next.js 16 RSC can import these entries directly into Server Components
  (e.g. `app/layout.tsx`). Previously the directive was stripped during
  bundling, requiring consumer apps to write a thin `'use client'` shim
  to re-export `BrandProvider` for RSC trees. tsup config now injects the
  directive via `banner` on the client-bundled entries only.

---

## [1.5.0] — 2026-04-29

### Added (additive only — zero existing exports removed or modified)

**Brand context (`@dangelopalladino/etf-core/brand`)**
- `BrandProvider` (client) + `useBrand()` hook + `getBrand()` server
  function. `Brand = 'etf' | '6id' | 'shared'`. Fallback is `'shared'`.
- `brandShadows` / `brandRadius` / `brandMotion` / `brandFocusRing`
  helpers; `FOCUS_RING_TOKENS` re-export.

**Tokens (`@dangelopalladino/etf-core/tokens/shared`)**
- New: `Brand` type, `BREAKPOINTS`, `STATE_TONES` + `StateTone`,
  `STATE_TONE_TO_STATUS`, `STATE_TONE_STYLES`, `EMAIL_SAFE_TOKENS`,
  `SHARED_RADIUS_SCALE` + `RadiusKey`, `SHARED_SPACING_SCALE` +
  `SpaceKey`, `SHARED_MOTION` + `MotionDuration`, `FOCUS_RING_TOKENS`,
  `HEADING_CLASSES`.
- Helpers: `space()`, `radius()`, `motion()`, `focusRing()`.
- `SHADOW_TOKENS` JSDoc strengthened with explicit migration map
  (`xs/sm → BLUEPRINT_SHADOWS.subtle`; `md/lg/xl → .overlay`). Export
  retained for v1.x; removal scheduled for v2.0.

**Server primitives (`@dangelopalladino/etf-core/ui-server`)**
- `Eyebrow`, `Kicker`, `NoticeCard`, `EmptyState`, `IconBadge`,
  `Stat` / `StatValue` / `StatLabel`, `Stack`, `Cluster`, `Hero`,
  `Card`.

**Client primitives (`@dangelopalladino/etf-core/ui-client`)**
- `LoadingState`, `SkeletonCard`, `LockedGate`.

### Mobile-first responsive contract (binding for every new primitive)

1. Base classes target 320px; no viewport assumptions in base layer.
2. Responsive scaling via `min-width` breakpoints only (`sm:`/`md:`/`lg:`);
   no `max-width` media queries except print.
3. No fixed heights on content containers — `aspect-ratio` or token
   `min-h-*` only.
4. No fixed widths below 768px. Documented decorative-px exemptions:
   IconBadge sizes 28/36/44, LoadingState spinner 16/24/32.
5. Padding and spacing scale up; never start large and compress down.
6. Each primitive's JSDoc `@remarks` describes its 320px base layout
   first, before anything else.

### ARIA contracts (encoded into the API, verified by tests)

- `NoticeCard`: tone-derived role — `urgent`/`caution` →
  `role="alert"` + `aria-live="assertive"`; `info`/`success`/`neutral`/
  `locked`/`loading` → `role="status"` + `aria-live="polite"`. Title
  rendered as `<h3>` and referenced via `aria-labelledby`.
- `EmptyState`: `<section>` + `aria-labelledby`. Illustration slot
  `aria-hidden="true"` by default. No fallback action injected.
- `IconBadge`: `label` ⇒ `role="img"` + `aria-label` (inner icon
  `aria-hidden`); no `label` ⇒ entire span `aria-hidden` (decorative).
- `Stat`: semantic `<dl>` / `<dd>` / `<dt>`; `tabular-nums` +
  `overflow-wrap: anywhere` for long values.
- `Hero`: `<header>` + `<h1>` (or `<h2>` at `level={2}`); eyebrow is
  `<p>`, never a heading.
- `LoadingState`: `role="status"` + `aria-live="polite"` +
  `aria-busy="true"`; spinner SVG `aria-hidden`; visible label or
  `sr-only` "Loading"; `motion-reduce:animate-none`.
- `SkeletonCard`: entire card `aria-hidden="true"` (decorative);
  shimmer gated via `motion-safe`. Media slot uses `aspect-ratio`,
  not a fixed pixel height.
- `LockedGate`: `role="dialog"` + `aria-modal="true"` +
  `aria-labelledby`; gated children carry `inert={true}` +
  `aria-hidden` (no blur-tease); focus moves to first focusable on
  mount; Tab cycles within the panel; Esc fires `onDismiss` only when
  `dismissible`; focus restores to previously-focused element on
  unmount.

### Adoption notes (for consumer apps)

> **Important — `BrandProvider` is required for RSC contexts.**
> v1.5's `getBrand()` does not thread brand through the React Server
> Components → Client Components boundary on its own. Without
> `<BrandProvider brand="etf"|"6id">` in the tree (typically wrapping
> the root layout), every primitive resolves `Brand = 'shared'` and
> renders the safe neutral defaults (BLUEPRINT_SHADOWS, neutral focus
> ring, SHARED_MOTION, no serif). Consumer apps must wrap their root
> layout in `BrandProvider` before adopting any of the new primitives
> if they want brand-correct rendering. AsyncLocalStorage-based
> server-side resolution is deferred to v2.

- **Visual verification record.** A scratch harness at `scratch/`
  (Next.js + Tailwind + Playwright, isolated from the published
  package) renders every v1.5 primitive in three brand contexts at
  four viewports (320 / 375 / 768 / 1280). 52 PNGs are committed at
  `scratch/screenshots/` as the visual verification record. The
  `scratch/` directory is dev-only — it is **not** part of the
  published tarball (`package.json` `files` ships only `dist`,
  `CHANGELOG.md`, `README.md`).
- **Adoption blocker cleared.** v1.5 primitives now have visual
  verification. Consumer-app migration PRs may open against this
  version.

### Existing surface unchanged

`SectionHeader`, `BrandCta`, `MetricPanel`, `StatusBadge`,
`SectionWrapper`, `ServerHeading`, `ServerText` render byte-identically
to v1.4. `SHADOW_TOKENS` export is retained.

### Verification

- `tsc --noEmit`: zero errors
- `vitest`: 105/105 (57 prior + 21 v1.5 token/helper + 27 ARIA
  contract tests)
- `tsup build`: dist/ clean; `brand/index.{mjs,cjs,d.ts,d.cts}`
  present; all prior export paths preserved
- `eslint`: clean (new `rounded-3xl` literal ban + `SHADOW_TOKENS`
  named-import block scoped to non-`tokens/` etf-core src)
- `npx impeccable detect --json src/`: `[]` (zero findings); report
  committed at `impeccable-detect-report.json`

### Deferred to v2

- jsdom render tests beyond ARIA contracts (full visual snapshot
  coverage)
- Husky / lint-staged pre-commit hook (`tsc && vitest && impeccable
  detect`)
- AsyncLocalStorage-based server-side `getBrand()` resolution so
  RSC trees pick up the nearest `<BrandProvider>` without a manual
  layout wrap

## [1.1.1] — 2026-04-19

Republishes the v1.1.0 Phase B content under a new patch number.

**Why:** the v1.1.0 CI publish failed with `E409 Cannot publish over
existing version` against GitHub Packages even though no prior
successful publish.yml run for this workflow ever published 1.1.0.
The registry appears to treat 1.1.0 as already-claimed (tombstoned),
so the version number is unreclaimable. The `v1.1.0` git tag and the
`chore(release): 1.1.0` commit on main exist, but no npm artifact
corresponds — consumers pinning to `^1.1.0` would receive nothing
from this pipeline. Bumping to 1.1.1 lets the same Phase B content
reach the registry.

**Content:** identical to the intended v1.1.0 release — see the
v1.1.0 entry below for the full B.1 / B.2 / B.3 / B.6 / B.7 summary.
No additional code changes; this is a release-mechanics fix only.

## [1.1.0] — 2026-04-19

Phase B canonical alignment for the 6identities ↔ etfframework
dual-brand ecosystem. All first-party changes — no `peerDependencies`
bumps. Consumers inherit on their next `npm install` + bump.

**Registry note:** this version was never successfully published.
See the [1.1.1] entry above for the republish. The content summary
below describes what v1.1.1 ships.

### Added

- `ECOSYSTEM_EVENTS` + `EcosystemEventName` exported from `./analytics`.
  Two canonical cross-brand transition event names
  (`ecosystem_6i_to_etf_transition`, `ecosystem_etf_to_6i_transition`)
  so GA4 dashboards on both sites can reference a single source of truth.
- New `./utils` subpath with `withUtm(href, source, campaign)` —
  typed URL tagger that sets `utm_source` / `utm_medium=cross_brand` /
  `utm_campaign` in one call. Replaces ad-hoc `?ref=etfframework`
  strings across both sites. Exports the `Site` and `Campaign` types.
- `fonts` export on `./tokens/shared` with `display` / `body` / `mono`
  stacks. All three default to General Sans (display/body) or
  JetBrains Mono (mono). Declaration only — sites load the woff2
  files themselves.

### Changed

- `baseThemeConfig.token.fontFamily` now references `fonts.body`
  directly, dropping the site-supplied `var(--font-sans)` binding.
  Each consumer site continues to load General Sans via next/font
  or an @font-face rule in its own `globals.css`.
- `src/content/books.ts` terminology aligned with canonical taxonomy:
  three occurrences of "patterns" → "types" (lines 54, 130, 164).
  `The Foundation™` reference on line 74 is unchanged (concept
  reference, not a component rename).

### Deprecated

- `faqPageSchema(items)` in `./seo` — still returns a valid FAQPage
  JSON-LD payload and all existing call sites continue to work, but
  emits a one-shot `console.warn` in client-side dev builds
  (`typeof window !== 'undefined' && NODE_ENV !== 'production'`) and
  carries a JSDoc `@deprecated` tag. Removal is deferred to a future
  major release once both consumer sites drop their calls — Google
  restricted FAQPage rich results to government and health-authority
  sites in August 2023, so the schema no longer earns rich snippets
  for either brand.

### Tests

- New: `tests/analytics/ecosystem-events.test.ts`,
  `tests/utils/withUtm.test.ts`, `tests/seo/json-ld.test.ts`.
- Extended: `tests/tokens.test.ts` locks in the new `fonts` shape
  and the `baseThemeConfig.token.fontFamily === fonts.body` identity
  with a negative `/var\(/` assertion to catch regression.

### Consumer note

ETFtestSite and etfframework will inherit these changes on their
next `npm install @dangelopalladino/etf-core` bump (Phase C, separate
sessions). Sites that currently call `faqPageSchema(...)` will start
seeing the deprecation warning in local dev; both will be migrated
off the factory in Phase C.

## [1.0.6] — 2026-04-17

### Fixed — drop var() from token color values

v1.0.5 reverted the `cssVar: { key: 'etfbrand' }` config but **AntD v6
keeps cssVar-mode classes active regardless of explicit configuration**
(verified: button still got class `css-var-_R_elb_` and stylesheet
still defined `--ant-color-primary: #000000`). The only path that
consistently renders the brand color is to remove `var()` strings from
AntD token color fields entirely and pass literal hex.

Changes:
- `baseThemeConfig.token.colorPrimary`: `'var(--color-brand, #2D7A7B)'` → `'#2D7A7B'`
- `baseThemeConfig.token.colorInfo`: same
- `tokens/6id.themeConfig.token.colorPrimary`: → `'#A04B37'` (terracotta §5.1)
- `tokens/6id.themeConfig.token.colorInfo`: → `'#A04B37'`
- `tokens/etfframework.themeConfig.token.colorPrimary`: → `'#0A2540'` (navy §5.2)
- `tokens/etfframework.themeConfig.token.colorInfo`: → `'#0A2540'`
- `tokens/etfframework.themeConfig.token.colorLink`: → `'#3656D6'`

`fontFamily` keeps `var(--font-sans), -apple-system, …` — AntD's font
parser accepts `var()` strings unchanged. Only color parsers fail.

What this means for sites: each site repo bakes its brand into the
upstream tokens file. Adding a third site means adding a third
`tokens/<site>.ts` with its own hex literals. The site-wide
`--color-brand` CSS variable in each site's `globals.css` remains for
non-AntD components to consume — AntD itself uses the literal hex.

Test additions in `tests/tokens.test.ts` lock in the literal-hex shape
with negative `not.toMatch(/^var\(/)` assertions to catch any future
regression to var() bindings.

### Production verification

Both `https://6identities.com` and `https://etfframework.com` confirmed
rendering correct brand colors after the equivalent hotfix landed at
the site level (commits dbb430c on 6i, f68f75e on ETF). v1.0.6 brings
the same fix upstream so the site wrappers can be collapsed to thin
re-exports without re-introducing the bug.

## [1.0.5] — 2026-04-17

### Fixed — revert cssVar mode

v1.0.4 added `cssVar: { key: 'etfbrand' }` and `hashed: false` to
`baseThemeConfig`. AntD v6's cssVar generator failed to parse the
`var(--color-brand, <fallback>)` token strings as colors and emitted
`--ant-color-primary: #000000` (black) for the generated CSS variable.
Result: every `<Button type="primary">` rendered black on both sites.

v1.0.5 reverts only those two settings. Everything else from v1.0.4
stays — the brand `var()` bindings, Inter font binding, 4-radii cap,
`BLUEPRINT_SHADOWS`, focus ring, no-shadow Buttons. Without cssVar
mode, AntD inlines token values into component styles, and `var()`
expressions resolve correctly at the consuming element's CSS scope.

New tests in `tests/tokens.test.ts` lock in the no-cssVar shape so this
regression cannot return silently.

Note: an automated `chore(release): 1.1.0` commit landed on `main` after
v1.0.4 (the publish workflow's `^feat(:|\()` trigger fired on the v1.0.4
merge). The v1.1.0 tag has been deleted as redundant noise — same buggy
code as v1.0.4. v1.0.5 is the canonical fix.

## [1.0.4] — 2026-04-17

### Changed — directive-compliant brand tokens

Aligns `baseThemeConfig` and the per-site `themeConfig` exports with the
8-phase rebuild directive (`docs/PromptsLocker/8phaseHardReset.md` §5
+ §8.1). Both site repos can now consume their `themeConfig` directly and
drop the local wrapper overrides they shipped in their respective rebuild
PRs (6i PR #24, ETF PR #1).

- `baseThemeConfig` now sets `cssVar: { key: 'etfbrand' }` and `hashed: false`.
- `colorPrimary` and `colorInfo` bound to `var(--color-brand, <fallback>)` —
  fallback is the legacy teal `#2D7A7B` in `baseThemeConfig`, terracotta
  `#A04B37` in `tokens/6id`, navy `#0A2540` in `tokens/etfframework`.
- `tokens/etfframework.themeConfig.token.colorLink` bound to
  `var(--color-brand-interaction, #3656D6)` (ETF interaction blue per §5.2).
- `fontFamily` bound to `var(--font-sans), -apple-system, …` so sites supply
  the font (Inter via `next/font`).
- Radii capped at directive's `{4, 6, 8, 12, pill}`: `borderRadiusXS` 2 → 4;
  `Card.borderRadiusLG` 24 → 12; `Modal.borderRadiusLG` 16 → 12.
- Drawer's `borderRadius: 0` override removed from `tokens/6id.themeConfig`
  (outside the compliant set; inherits base 6).
- New `BLUEPRINT_SHADOWS = { none, subtle, overlay }` export. AntD shadow
  tokens (`boxShadow`, `boxShadowSecondary`, `boxShadowTertiary`) reference
  these so the rendered set is the directive-required 3 values. Legacy
  `SHADOW_TOKENS.{xs,sm,md,lg,xl}` is retained for component backwards-compat.
- New `lineWidthFocus: 2` in base token (§6.6 focus ring).
- `Button` now sets `primaryShadow / defaultShadow / dangerShadow: 'none'`
  to honor the no-shadow blueprint.

### Compatibility

This is technically a behavioral change to a published export, but the
package is private to `@dangelopalladino/*` consumers (the two sibling site
repos). Both sites' rebuild PRs have already merged with site-level
overrides that were doing this exact work locally; consuming v1.0.4 lets
them drop those overrides.

## [1.0.0] — 2026-04-16

### Added — Phase 11 initial extraction

- `tokens/shared`, `tokens/6id`, `tokens/etfframework` — single-source design tokens
  composed per-site from a shared base (palette, shadows, status colors, score
  colors, heading scale, surface and border tokens).
- `ui-server` — `SectionWrapper`, `ServerHeading`, `ServerText` (server-safe
  primitives, no `'use client'`).
- `ui-client` — `SectionHeader`, `BrandCta`, `CtaSection`, `MetricPanel`,
  `ScoreBar`, `StatusBadge`, `BookSalesPage`.
- `content` — `books`, `testimonials`.
- `commerce` — `downloads`, `download-tokens` (JWT), `pdf-watermark`, fulfillment
  emails (`send-book-fulfillment`, `send-certification-guide`), `priceMap` as the
  runtime single source of truth for Stripe SKUs, `handleStripeEvent` (Track B
  webhook handler — pure function, no Next.js coupling).
- `analytics` — event catalog, source/origin helpers, `GA4Loader` client
  component with cross-domain linker baked in (`6identities.com`,
  `etfframework.com`).
- `seo` — `json-ld` factories.

### Migrated from

- `ETFtestSite/src/lib/{antd-theme,brand-tokens,downloads,download-tokens,pdf-watermark,analytics,analytics-events,analytics-source,substack,stripe,testimonials}.ts`
- `ETFtestSite/src/lib/email/{send-book-fulfillment,send-certification-guide}.ts`
- `ETFtestSite/src/lib/content/books.ts`
- `ETFtestSite/src/lib/seo/json-ld.ts`
- `ETFtestSite/src/components/shared/*` and `BookSalesPage`
- `etfframework/src/lib/*` and `src/components/shared/*` (identical duplicates)

### Closed Phase 11 deferrals

- D1 — token duplication
- D2 — shared digital-product infra
- D8 — single webhook handler

[1.6.0]: https://github.com/dangelopalladino/etf-core/releases/tag/v1.6.0
[1.0.0]: https://github.com/dangelopalladino/etf-core/releases/tag/v1.0.0
