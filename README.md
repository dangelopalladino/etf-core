# `@dangelopalladino/etf-core`

Private, scoped npm package on **GitHub Packages**. Single source of truth for
shared business logic across the two sibling Next.js apps:

- [`6identities.com`](https://6identities.com) — `ETFtestSite` repo
- [`etfframework.com`](https://etfframework.com) — `etfframework` repo

Both apps stay on **independent Vercel projects** and **independent repos**.
This package collapses the previously-duplicated bytes (design tokens, shared
UI, downloads, fulfillment emails, watermarking, analytics events, Stripe
webhook handler, JSON-LD factories) into a single versioned dependency.

---

## Install (consumers)

Both site repos ship a `.npmrc` pinning the GitHub Packages registry:

```
@dangelopalladino:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Then in each site's `package.json`:

```json
"dependencies": {
  "@dangelopalladino/etf-core": "^1.0.0"
}
```

### Vercel build setup

Add `NPM_TOKEN` to **each Vercel project's environment variables**:

- Token: a GitHub fine-grained PAT scoped to **read:packages** for
  `dangelopalladino/etf-core`.
- Scope: Production, Preview, Development.

Without `NPM_TOKEN`, Vercel `npm install` fails because the package is private.

### Local development

Either authenticate locally with `gh auth token > .npmrc-token` and reference
that file, or use the local file dependency during active migration:

```json
"dependencies": {
  "@dangelopalladino/etf-core": "file:../etf-core"
}
```

Switch back to `^1.0.0` (GitHub Packages resolution) before merging to main.

---

## Entry points

| Import | Purpose |
|---|---|
| `@dangelopalladino/etf-core/tokens/shared` | Base palette, shadow tokens, scale, status palette |
| `@dangelopalladino/etf-core/tokens/6id` | 6identities-flavored AntD `themeConfig` + `IDENTITY_COLORS` |
| `@dangelopalladino/etf-core/tokens/etfframework` | etfframework-flavored AntD `themeConfig` |
| `@dangelopalladino/etf-core/ui-server` | `SectionWrapper`, `ServerHeading`, `ServerText` |
| `@dangelopalladino/etf-core/ui-client` | `SectionHeader`, `BrandCta`, `CtaSection`, `MetricPanel`, `ScoreBar`, `StatusBadge`, `BookSalesPage` |
| `@dangelopalladino/etf-core/content` | `books`, `testimonials` |
| `@dangelopalladino/etf-core/commerce` | All commerce surfaces (re-exports) |
| `@dangelopalladino/etf-core/commerce/webhook` | `handleStripeEvent(event, supabaseAdmin, resend, opts)` |
| `@dangelopalladino/etf-core/commerce/priceMap` | Canonical Stripe Price-ID map (runtime SOT) |
| `@dangelopalladino/etf-core/analytics` | Event catalog, `GA4Loader`, source helpers |
| `@dangelopalladino/etf-core/seo` | `json-ld` factories |

---

## Build

```bash
npm install
npm run build      # tsup → ESM + CJS + .d.ts
npm test
npm run typecheck
npm run lint
```

## Publish

Automatic via `.github/workflows/publish.yml` on every push to `main` whose
commit-prefix indicates a release (`feat:` → minor, `fix:` → patch, `feat!:` or
`BREAKING CHANGE:` → major). Manual:

```bash
npm version <patch|minor|major>
npm publish    # GitHub Packages auth via .npmrc + GITHUB_TOKEN
git push --tags
```

## Versioning

Strict semver:

- **major** — breaking prop / API change
- **minor** — additive component or field
- **patch** — bug fix

Both consumers pin `^1.0.0`, so minor releases are picked up on next install.

---

## Repository conventions

- TypeScript 5, ESM-first
- `tsup` for dual ESM/CJS build
- `vitest` for unit tests (commerce/webhook is gated by full event-type coverage)
- `eslint` shares the consumer config style (no design-token violations)
- All UI primitives identical to the consumer convention — AntD-only, brand
  classes only, no raw HTML headings, see consumer repos' `AGENTS.md`.

---

## Fluid type and spacing contract (v1.9.0+)

**Two-layer design system:**

| Layer | What it covers | Source of truth |
|---|---|---|
| **Foundation tokens** | type scale, spacing scale, container, radius, color, shadow, control heights | `src/tokens/shared.ts` exports + the `@theme` paste block below |
| **Component tokens** | AntD `Button` / `Input` / `Card` / `Modal` / `Menu` / `Form` / `Divider` numeric overrides | `baseThemeConfig` in `src/tokens/shared.ts`, brand-extended in `6id.ts` and `etfframework.ts` |

The fluid contract anchors body text and structural spacing to `clamp()` between **375px** and **1440px** viewports. Headings stay on their existing fluid scale (`HEADING_CLASSES`, `DISPLAY_CLASSES`, `HERO_CLASSES`). Component (AntD) tokens stay numeric — AntD v6 theme tokens cannot accept `clamp()` strings — and align to the same 44px touch target the `BrandCta` uses (`CONTROL_HEIGHT_TOKENS.touch`).

### Foundation token reference

| Tokens | Range | Tailwind utility (after paste) |
|---|---|---|
| `--text-xs` | 12 → 13 | `text-xs` |
| `--text-sm` | 14 → 16 | `text-sm` |
| `--text-base` | 16 → 18 | `text-base` |
| `--text-lg` | 18 → 24 | `text-lg` |
| `--text-xl` | 24 → 36 | `text-xl` |
| `--text-2xl` | 32 → 52 | `text-2xl` |
| `--spacing-section-y` | 48 → 96 | `py-section-y` |
| `--spacing-section-x` | 20 → 80 | `px-section-x` |
| `--spacing-card` | 16 → 32 | `p-card` |
| `--spacing-gap-md` | 16 → 32 | `gap-gap-md` |
| `--spacing-gap-section` | 48 → 96 | `gap-gap-section` |
| `--container-clamp` | min(100% − 2rem, 72rem) | use via `var()` or arbitrary `max-w-[var(--container-clamp)]` |

### Canonical `@theme` paste block

Paste into your app's `src/app/globals.css` once, immediately after `@import "tailwindcss";`:

```css
@theme {
  /* etf-core fluid contract — 375 → 1440 viewport bracket */

  /* Type scale */
  --text-xs: clamp(0.75rem, 0.094vw + 0.728rem, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.188vw + 0.831rem, 1rem);
  --text-base: clamp(1rem, 0.188vw + 0.956rem, 1.125rem);
  --text-lg: clamp(1.125rem, 0.563vw + 0.993rem, 1.5rem);
  --text-xl: clamp(1.5rem, 1.127vw + 1.236rem, 2.25rem);
  --text-2xl: clamp(2rem, 1.878vw + 1.560rem, 3.25rem);

  /* Spacing scale */
  --spacing-section-y: clamp(3rem, 4.507vw + 1.944rem, 6rem);
  --spacing-section-x: clamp(1.25rem, 5.634vw - 0.071rem, 5rem);
  --spacing-card: clamp(1rem, 1.502vw + 0.648rem, 2rem);
  --spacing-gap-md: clamp(1rem, 1.502vw + 0.648rem, 2rem);
  --spacing-gap-section: clamp(3rem, 4.507vw + 1.944rem, 6rem);

  /* Container clamp */
  --container-clamp: min(100% - 2rem, 72rem);
}
```

> **Consumer drift call-out:** `ETFtestSite/src/app/globals.css` and `etfframework/src/app/globals.css` currently define `--text-base` outside this contract — `15 → 16` and `16 → 17` respectively, neither matching the canonical `16 → 18`. Replacing them with the block above aligns body sizing across both brands. **After paste, no consumer code change is required** — `text-base`, `text-sm`, etc. utilities resolve through the new variables automatically.
>
> **Body text grows on paste:** ETFtestSite `+12.5%` at desktop (16 → 18), etfframework `+6%`. Audit downstream layouts that pin to a fixed body line-height before merging the consumer-side bump.

### One-line upgrade snippet

To regenerate the block at any time (e.g., to verify your paste hasn't drifted):

```bash
node -e "import('@dangelopalladino/etf-core/tokens/shared').then(m => console.log(m.buildThemeBlock()))"
```

The `buildThemeBlock()` output is byte-stable so consumers can `diff` it against their own `globals.css` block to detect drift.

### Tailwind v4 only

This contract requires Tailwind v4 (`@theme` directive). Both downstream consumers (`ETFtestSite`, `etfframework`) are on v4 today. For a hypothetical v3 consumer, fall back to `FLUID_TYPE_TAILWIND` (e.g., `text-[clamp(...)]` arbitrary value strings exported from `tokens/shared`).

### AntD component tokens

AntD components (`Button`, `Input`, `Card`, `Modal`, `Menu`, `Form`, `Divider`) inherit numeric values from `baseThemeConfig`. Brand-specific overrides live in `tokens/6id.ts` and `tokens/etfframework.ts`. The fluid `--text-base` reaches AntD-rendered surfaces through outer wrapper `className` — AntD v6 theme tokens cannot accept `clamp()` strings, so do **not** push fluid expressions into `baseThemeConfig.token.fontSize*` or `baseThemeConfig.components.{Button,Input,...}`.

The numeric anchors:

| Anchor | Px | Used by |
|---|---|---|
| `CONTROL_HEIGHT_TOKENS.sm` | 32 | AntD `size='small'` |
| `CONTROL_HEIGHT_TOKENS.md` | 40 | AntD default |
| `CONTROL_HEIGHT_TOKENS.lg` | 48 | etfframework default Button/Input |
| `CONTROL_HEIGHT_TOKENS.touch` | 44 | `BrandCta size='middle'` (WCAG min) |

---

## Phase 11 reference

Authoritative worklist:
[`ETFtestSite/docs/PromptsLocker/mergePlanPhase11.md`](https://github.com/dangelopalladino/ETFtestSite/blob/main/docs/PromptsLocker/mergePlanPhase11.md)

Initial release closes Phase 11 deferrals D1, D2, D8 (token duplication,
shared digital-product infra, single webhook handler).
