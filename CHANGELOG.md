# Changelog

All notable changes to `@dangelopalladino/etf-core` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **major** — breaking prop or API changes
- **minor** — new components, exported fields, or analytics events
- **patch** — bug fixes and content corrections

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

[1.0.0]: https://github.com/dangelopalladino/etf-core/releases/tag/v1.0.0
