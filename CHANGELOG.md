# Changelog

All notable changes to `@dangelopalladino/etf-core` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **major** — breaking prop or API changes
- **minor** — new components, exported fields, or analytics events
- **patch** — bug fixes and content corrections

## [Unreleased]

### Changed — v1.11 ratchet completion + non-UI consistency sweep (v1.11.1 candidate)

Closes the gaps left by the v1.11.0 release. The off-grid + hex sweep was correct in intent but its enforcement layer (the new ESLint regex selectors) was over-escaped — the rules silently matched literal `\s` / `\b` / `\[` / `\]` instead of whitespace / word-boundary / bracket characters, so every selector was effectively a no-op. v1.11.1 corrects the escaping, extends the migrated-primitive allowlist to the five audit-clean primitives v1.11.0 left out, finishes the mixed-step spacing sweep across the remaining ladders, and applies the same v1.11 token discipline to non-UI surfaces (commerce email templates, seo-automation email template, webhook).

**ESLint ratchet bug fix (`eslint.config.mjs`)**

- Regex selectors corrected: `\\\\s` → `\\s`, `\\\\b` → `\\b`, `\\\\[` → `\\[`, `\\\\]` → `\\]`, `\\\\d` → `\\d`. The body-text-token, heading-token-only, hex-literal, and rounded-3xl bans now actually fire on violations. Empirically verified: a test file with `text-3xl rounded-3xl border-[#FF0000] text-[14px]` now produces 4 errors (it produced 0 before).
- Migrated-primitive allowlist extended from 15 to 20 files: adds `MetricPanel`, `ScoreBar`, `StatusBadge`, `IconBadge`, `Stack` (the audit-clean primitives v1.11.0 explicitly noted but did not pin).

**Hidden ratchet violations surfaced and fixed**

- `src/ui-client/SectionHeader.tsx` (subtitle classes for `editorial` / `hero` / `manifesto` / `display` variants) used `text-lg` / `text-xl` literals — body-text-token ban. Replaced with inline `text-[clamp(...)]` matching `FLUID_TYPE_SCALE.lg` (18 → 24px) and `.xl` (24 → 36px) respectively. No visual regression vs. consumer-with-paste; deterministic visual vs. consumer-without-paste.
- `src/ui-client/MetricPanel.tsx:41` value used `text-2xl` literal — body-text-token ban. Replaced with inline `text-[clamp(1.5rem,1.127vw+1.236rem,2.25rem)]` (matches `FLUID_TYPE_SCALE.xl`).

**Mixed-step spacing sweep (continuation)**

The v1.11.0 sweep fixed two `mt-1 md:mt-2` ladders and one asymmetric `pt/pb` ladder. v1.11.1 finishes the job across every remaining ladder in the migrated allowlist, applying the same principle: ≤4px range collapses to a single value (matching v1.11.0's `mt-1 md:mt-2 → mt-2` move); ≥8px range fluidizes via inline `clamp()` preserving original mobile/desktop endpoints exactly.

| File | Was | Now |
|---|---|---|
| `src/ui-server/Hero.tsx` (inner content) | `gap-4 sm:gap-5 md:gap-6` | `gap-[clamp(1rem,0.751vw+0.824rem,1.5rem)]` (16 → 24) |
| `src/ui-server/Hero.tsx` (split grid) | `md:gap-10 lg:gap-14` | `md:gap-[clamp(2.5rem,1.502vw+2.148rem,3.5rem)]` (40 → 56) |
| `src/ui-server/Hero.tsx` (column) | `gap-6 md:gap-8` | `gap-[clamp(1.5rem,0.751vw+1.324rem,2rem)]` (24 → 32) |
| `src/ui-server/NoticeCard.tsx` | `p-3 sm:p-4 md:p-5` | `p-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)]` (12 → 20) |
| `src/ui-server/NoticeCard.tsx` | `gap-2 sm:gap-3 md:gap-4` | `gap-[clamp(0.5rem,0.751vw+0.324rem,1rem)]` (8 → 16) |
| `src/ui-server/NoticeCard.tsx` (icon) | `w-5 h-5 md:w-6 md:h-6` | `w-6 h-6` (collapse, 4px range) |
| `src/ui-server/EmptyState.tsx` | 4-step py/px/gap ladder | `py-[clamp(2rem,3.005vw+1.296rem,4rem)] px-[clamp(1rem,1.502vw+0.648rem,2rem)] gap-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)]` (matches `FLUID_SPACING_SCALE.cardP` for px) |
| `src/ui-server/EmptyState.tsx` (illustration) | `max-w-[200px] md:max-w-[280px]` | `max-w-[clamp(12.5rem,7.512vw+10.74rem,17.5rem)]` (200 → 280) |
| `src/ui-server/EmptyState.tsx` (action) | `mt-2 md:mt-3` | `mt-3` (collapse, 4px range) |
| `src/ui-client/CtaSection.tsx` (dark + light variants) | `p-6 sm:p-10 md:p-16` | `p-[clamp(1.5rem,3.756vw+0.620rem,4rem)]` (24 → 64) |
| `src/ui-client/CtaSection.tsx` (all 3 variants) | `mb-12 md:mb-16` | `mb-[clamp(3rem,1.502vw+2.648rem,4rem)]` (48 → 64) |
| `src/ui-client/CtaSection.tsx` (minimal) | `px-4 sm:px-6` | `px-[clamp(1rem,0.751vw+0.824rem,1.5rem)]` (16 → 24) |
| `src/ui-client/LockedGate.tsx` (panel) | `max-w-[320px] md:max-w-[420px] lg:max-w-[480px] p-5 md:p-6 lg:p-8 gap-3 md:gap-4` | `max-w-[clamp(20rem,15.023vw+16.479rem,30rem)] p-[clamp(1.25rem,1.127vw+0.986rem,2rem)] gap-[clamp(0.75rem,0.376vw+0.662rem,1rem)]` |
| `src/ui-client/SkeletonCard.tsx` | `p-3 md:p-4`, `mb-3 md:mb-4`, `space-y-2 md:space-y-3` | `p-4`, `mb-4`, `space-y-3` (collapses, 4px range each) |

**Non-UI surfaces — same v1.11 token discipline**

- `src/commerce/emails/send-book-fulfillment.ts` — replaces hardcoded `BRAND_TEAL/BG/TEXT/MUTED` constants and inline `#FFFFFF` / `#E5DDD4` literals with `EMAIL_SAFE_TOKENS.{brandPrimary,surface,text,textMuted,white,border}`. Replaces `'DM Sans', -apple-system, sans-serif` with `fonts.body` / `fonts.serif` (General Sans per v1.1.0 brand stack).
- `src/commerce/emails/send-certification-guide.ts` — same fix.
- `src/seo-automation/email-template.tsx` — `primaryText: '#FFFFFF'` → `EMAIL_SAFE_TOKENS.white`.

**Type unification**

- `src/content/books.ts` `BookProductType` — was a duplicate string-literal union of the four `book_*` members. Now `Extract<ProductType, \`book_${string}\`>` derived from the canonical `ProductType` ledger in `src/commerce/priceMap.ts`. Adding a new book SKU now requires editing one file, not two.
- `src/content/books.ts` `BOOK_PRODUCT_TYPES` — was a duplicate `Set` instance reference-distinct from `priceMap.BOOK_PRODUCT_TYPES`. Now re-exports the canonical Set so identity checks across consumers compare equal.
- `src/commerce/webhook.ts` — inline `'book_motion' | 'book_understanding_the_crash' | ...` cast literal replaced with `BookProductType` import.

**Webhook constants + bug-prone calls**

- `src/commerce/webhook.ts` — `unitPrice = productType === 'extra_links' ? 599 : 899` is now derived from `PRICE_MAP[productType].amountUsd * 100`. Magic `2500` (referral credit, three call sites) extracted to `REFERRAL_CREDIT_CENTS = 2500` module constant.

**SDK-strictness fix**

- `src/seo-automation/groq-client.ts` — `chat()` was always passing `strict: true` to Groq's OpenAI-compatible JSON-schema response_format. The default `DRAFT_JSON_SCHEMA` declares `additionalProperties: true` on `jsonLd` (JSON-LD permits arbitrary `@`-prefixed keys), which violates strict mode and will be rejected by the API. `strict` is now opt-in via `jsonSchema.strict?: boolean`, default `false`. Caller-side validation in `validateDraftShape` is unchanged.

**Defensive guard**

- `src/utils/withUtm.ts` — `new URL(href)` would throw on relative inputs (`/professionals` style). Guarded with `URL.canParse(href)` pass-through. Cross-brand attribution still requires absolute URLs to be meaningful; relative inputs are returned unchanged rather than crashing.

**Type annotations + export shape**

- `src/seo/json-ld.ts` — every exported factory now returns explicit `JsonLdSchema` (alias for `Record<string, unknown>`) instead of inferred shape.
- `src/analytics/ga4-loader.tsx` — `GA4LoaderProps` is now exported. `export default GA4Loader` removed (named export was the only one re-exported through `analytics/index.ts`).

**JSDoc accuracy**

Hero, Stat, EmptyState, NoticeCard, LoadingState JSDocs updated to describe current fluid behavior — prior text referenced the removed `text-[Npx] md:text-[Mpx]` ladders.

**Audit (no-op)**

- `MetricPanel`, `StatusBadge`, `ScoreBar`, `IconBadge`, `Stack` — added to ratchet allowlist (see above). Empirical re-test on a representative file confirms all four bans (text-3xl, text-[14px], hex literal, rounded-3xl) now fail lint with descriptive messages.

## [1.11.0] — 2026-05-02

### Changed — Off-grid sweep + ESLint ratchet

Sweeps every remaining off-grid type literal, mixed-step margin, and hardcoded hex color across `src/ui-server/` and `src/ui-client/`, then ratchets ESLint to prevent regressions.

> **Known issue (resolved in v1.11.1):** the ESLint regex selectors introduced in this release were over-escaped, rendering every ratchet rule a no-op. Hidden violations in `SectionHeader.tsx` (subtitle `text-lg`/`text-xl`) and `MetricPanel.tsx` (`text-2xl`) shipped uncaught. v1.11.1 corrects the escaping and removes the violations.

**Tokens added (`@dangelopalladino/etf-core/tokens/shared`)**

- `KICKER_CLASS` — `text-[clamp(0.75rem,0.188vw+0.706rem,0.875rem)] font-bold uppercase tracking-[0.08em]` (12px → 14px fluid).
- `STAT_NUMBER_CLASS` — `text-[clamp(2rem,1.502vw+1.648rem,3rem)] font-bold leading-[1.1] tabular-nums` (32px → 48px fluid).

**Off-grid type sweep**

| File | Was | Now |
|---|---|---|
| `src/ui-server/Eyebrow.tsx` | `text-[11px] md:text-[12px]` | `HERO_CLASSES.eyebrow` (11→12 fluid) |
| `src/ui-server/Kicker.tsx` | `text-[12px] md:text-[14px]` | `KICKER_CLASS` (12→14 fluid) |
| `src/ui-server/Stat.tsx` (StatValue) | `text-[32px] md:text-[40px] lg:text-[48px]` | `STAT_NUMBER_CLASS` (32→48 fluid) |
| `src/ui-server/Stat.tsx` (StatLabel) | `text-[12px] md:text-[13px]` | `KICKER_CLASS` (+1px desktop max, accepted) |
| `src/ui-server/EmptyState.tsx` (h2) | `text-[18px] md:text-[22px] lg:text-[24px]` | `HEADING_CLASSES.h3` (20→24, +2px small-screen floor) |
| `src/ui-server/EmptyState.tsx` (body) | `text-[14px] md:text-[15px]` | `text-sm` |
| `src/ui-server/NoticeCard.tsx` (h3) | `text-[14px] md:text-[16px]` | `text-sm md:text-base` |
| `src/ui-server/NoticeCard.tsx` (body) | `text-[13px] md:text-[14px]` | `text-xs md:text-sm` |
| `src/ui-client/LoadingState.tsx` | `text-[13px] md:text-[14px]` | `text-xs md:text-sm` (plan called for KICKER_CLASS but its bold/uppercase composition is wrong for microcopy — substituted Tailwind utilities) |
| `src/ui-client/LockedGate.tsx` (h2) | `text-[18px] md:text-[20px]` | `HEADING_CLASSES.h4` (16→20, -2px small-screen floor) |
| `src/ui-client/LockedGate.tsx` (body) | `text-[14px] md:text-[15px]` | `text-sm` |

**Mixed-step spacing sweep**

| File | Was | Now |
|---|---|---|
| `src/ui-server/Hero.tsx` | `mt-1 md:mt-2` | `mt-2` |
| `src/ui-server/NoticeCard.tsx` | `mt-1 md:mt-2` | `mt-2` |
| `src/ui-client/CtaSection.tsx` (minimal variant) | `pt-10 sm:pt-14 pb-6 sm:pb-8` | `py-[clamp(2rem,5vw,4rem)]` |

**Hardcoded hex sweep**

| File | Was | Now |
|---|---|---|
| `src/ui-server/Card.tsx` | inline `'#F5EFE6' / '#FAF5EE' / '#EDE6DA'` and `'#E5DDD4'` border | `SURFACE_TOKENS.default / raised / ground` and `BORDER_TOKENS.default` |
| `src/ui-client/SkeletonCard.tsx` | `border-[#E5DDD4] bg-[#FAF5EE] bg-[#EDE6DA]` | `border-border bg-surface-raised bg-surface-ground` |
| `src/ui-client/LockedGate.tsx` | `border-[#E5DDD4] shadow-[0_8px_24px_rgba(58,54,50,0.12)]` | `border-border` + `style={{ boxShadow: BLUEPRINT_SHADOWS.overlay }}` |

**ESLint ratchet (`eslint.config.mjs`)**

- Migrated-primitives `files` allowlist extended from 5 to 15 files (adds Eyebrow, Kicker, Stat, EmptyState, NoticeCard, LoadingState, LockedGate, SectionHeader, Card, SkeletonCard).
- New `no-restricted-syntax` selector inside the migrated-primitive block: bans hex literals in className arbitrary values — `(border|bg|text|ring)-[#hex]`. Forces use of `SURFACE_TOKENS` / `BORDER_TOKENS` / `BLUEPRINT_SHADOWS` or semantic Tailwind utilities. Scoped to the allowlist; `src/tokens/` definitions remain legal. Future contributors who reintroduce hex into a migrated primitive get an ESLint failure in the same commit.

**Audit (no-op)**

- `MetricPanel`, `StatusBadge`, `ScoreBar`, `IconBadge`, `Stack` audited per the addendum — already clean (no off-grid `text-[Npx]`, no mixed-step margins, no hex strings). Will be added to the migrated-primitive allowlist in a future PR once they pick up additional fluid-contract usage.

### Changed — Wire primitives to fluid contract (v1.10.0 candidate)

**Behavior change** in this repo: `SectionWrapper` outer X-padding is now fluid by default.

- `SectionWrapper` (`src/ui-server/SectionWrapper.tsx`) — new `paddingX?: 'fluid' | 'static' | 'none'` prop, default `'fluid'`. The `'fluid'` value applies `px-[clamp(1.25rem, 5.634vw - 0.071rem, 5rem)]` (matches `FLUID_SPACING_SCALE.sectionPx`, 20 → 80px between 375 and 1440 viewports). `'static'` is the legacy `px-4 sm:px-6` escape hatch; `'none'` is `px-0`. `maxWidth='full'` continues to force no horizontal padding regardless. Mobile (320–375) unchanged at 20px; desktop (≥1440) grows from 24 to 80px (+56px gutters at the upper anchor).
- `SectionHeader` (`src/ui-client/SectionHeader.tsx`) — `hero` / `breakdown` / `compact` title classes now derive from `HEADING_CLASSES.h1 / h2 / h3` via a new `forceTitle()` helper that prepends `!` (AntD important-class composition). Replaces the prior `text-[Npx] md:text-[Mpx] lg:text-[Kpx]` breakpoint ladders with fluid clamp(). Computed font-size at endpoint viewports is unchanged; intermediate viewports scale smoothly. Hero variant's small-viewport tracking collapses from `-0.02em` to `-0.03em` (matches the prior `lg:` anchor). `manifesto` and `display` variants intentionally retain custom clamp literals — JSDoc updated to call out the deviation from `DISPLAY_CLASSES`.
- `ServerText` (`src/ui-server/ServerTypography.tsx`) — JSDoc cross-reference added pointing `body` variant readers to the fluid contract paste block. No code change; `text-base` continues to resolve through the consumer's `@theme` block.
- `baseThemeConfig` (`src/tokens/shared.ts`) — JSDoc cross-reference + AntD numeric-only constraint warning added directly above the export. Prevents future contributors from attempting to push `clamp()` strings into AntD theme tokens.

## [1.9.0] — 2026-05-02

### Added — Fluid type + spacing contract

**Tokens (`@dangelopalladino/etf-core/tokens/shared`)** — pure additive; zero existing exports modified.

- `FLUID_TYPE_SCALE` (`xs`/`sm`/`base`/`lg`/`xl`/`2xl`) — `clamp()` strings interpolating between 375px and 1440px viewports. `xs` 12 → 13, `sm` 14 → 16, `base` 16 → 18, `lg` 18 → 24, `xl` 24 → 36, `2xl` 32 → 52. Linear-interpolation math validated at both anchors and intermediate viewports.
- `FLUID_SPACING_SCALE` (`sectionPy`/`sectionPx`/`cardP`/`gapMd`/`gapSection`) — fluid structural spacing tokens. `sectionPy`/`gapSection` 48 → 96; `sectionPx` 20 → 80; `cardP`/`gapMd` 16 → 32.
- `CONTAINER_CLAMP` — `'min(100% - 2rem, 72rem)'` single-source container width.
- `CONTROL_HEIGHT_TOKENS` (`sm`=32, `md`=40, `lg`=48, `touch`=44) — numeric AntD control-height anchors surfaced as a foundation token. `touch` matches `BrandCta size='middle'` (WCAG minimum touch target).
- `FLUID_TYPE_TAILWIND` — Tailwind escape-hatch `text-[clamp(...)]` arbitrary-value strings for libs that cannot run a paste step.
- `buildThemeBlock()` — returns a copy-paste-ready Tailwind v4 `@theme { ... }` body for consumer `globals.css`. Output is byte-stable and matches the README block verbatim.
- New TypeScript exports: `FluidTypeKey`, `FluidSpacingKey`, `ControlHeightKey`.

**Docs**

- New README section "Fluid type and spacing contract (v1.9.0+)" covering the two-layer design system (foundation + AntD component tokens), the six fluid type tokens, the five fluid spacing tokens, the canonical paste block, the upgrade snippet, the AntD numeric-only constraint, and the consumer drift call-out (ETFtestSite `--text-base` 15 → 16, etfframework 16 → 17, both diverge from canonical 16 → 18).

### Added — Server-only SEO automation (`@dangelopalladino/etf-core/seo-automation`)
- New subpath export with brand-aware (`'6id' | 'etf'`) draft generation,
  revision, and approval-email dispatch.
- `generateDraft(input)` and `reviseDraft({ draft, critique })` — wrap
  `groq-sdk` chat completions with a JSON schema (`response_format`) and
  hand-rolled validation; throws `SeoDraftError` with the raw model output
  on parse/schema failure. Default model `llama-3.3-70b-versatile`,
  overridable via `GROQ_MODEL` env or per-call `model`.
- `signApprovalToken(claims, opts?)` / `verifyApprovalToken(token)` — HS256
  JWTs via `jose`, mirroring the `commerce/download-tokens.ts` idiom.
  `SEO_APPROVAL_SECRET` env var, issuer `etf-core`, audience `seo-approval`,
  default 7d expiry, hard cap 30d.
- `sendApprovalEmail({ to, brand, draft, draftId, baseUrl, ... })` — mints
  three single-purpose tokens (approve/revise/reject), renders an
  `<ApprovalEmail/>` React Email component to HTML via `@react-email/render`,
  and sends via Resend. Returns `{ success } | { skipped } | { error }`,
  matching `sendBookFulfillmentEmail`. ETF brand requires explicit `from`
  until a verified sender domain is configured.
- New optional peer deps: `groq-sdk`, `@react-email/components`,
  `@react-email/render`. Required env: `GROQ_API_KEY`,
  `SEO_APPROVAL_SECRET`. Optional: `RESEND_API_KEY`, `GROQ_MODEL`.

Server-only constraint: consume only from server components, API
routes, server actions, or cron handlers — never from `'use client'` code.

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
