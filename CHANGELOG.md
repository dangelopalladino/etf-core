# Changelog

All notable changes to `@dangelopalladino/etf-core` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **major** — breaking prop or API changes
- **minor** — new components, exported fields, or analytics events
- **patch** — bug fixes and content corrections

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

[1.0.0]: https://github.com/dangelopalladino/etf-core/releases/tag/v1.0.0
