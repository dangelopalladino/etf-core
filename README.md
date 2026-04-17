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

## Phase 11 reference

Authoritative worklist:
[`ETFtestSite/docs/PromptsLocker/mergePlanPhase11.md`](https://github.com/dangelopalladino/ETFtestSite/blob/main/docs/PromptsLocker/mergePlanPhase11.md)

Initial release closes Phase 11 deferrals D1, D2, D8 (token duplication,
shared digital-product infra, single webhook handler).
