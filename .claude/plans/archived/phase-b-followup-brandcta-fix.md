> **ARCHIVED 2026-04-19 — superseded by prior shipped work.**
>
> The fix this plan describes (BrandCta `<Link><Button>` → `router.push` single-element pattern) was already landed by commit `2d79886 fix(ui-client): remove banned side-stripe + fix nested anchor/button in shared primitives` and tagged in **v1.0.7, v1.1.0, and v1.1.1**. Current `src/ui-client/BrandCta.tsx` uses `useRouter().push(href)` with no `<Link>` wrapper; local `dist/ui-client/index.mjs:66–105` matches.
>
> The seeding verification report (`etfframework/audit-reports/branch-verification-64af44e-9cd1db3.md`) was run against `node_modules/@dangelopalladino/etf-core@1.0.6` — before commit `2d79886` was consumed. Its "Option 1 — fix ships in etf-core v1.1.0" recommendation is satisfied.
>
> No v1.1.2 patch release is needed. Remaining remediation is consumer-side: etfframework and ETFtestSite bump past 1.0.6 (Phase C, each site's own session). Body of this plan retained unchanged below for audit trail.
>
> ---

## Phase B follow-up — BrandCta nested-anchor fix

### Context
Phase B shipped as v1.1.1 (v1.1.0 tombstoned). A post-merge finding from etfframework branch verification (report at etfframework/audit-reports/branch-verification-64af44e-9cd1db3.md) identified BrandCta in dist/ui-client/index.mjs:75 still uses <Link><Button> pattern, producing nested <a><button> in consumer DOM. Not included in Phase B.

### Scope
Fix BrandCta source (likely src/ui-client/BrandCta.tsx) to emit a single element — either LinkButton primitive or Button with router-aware onClick — instead of <Link><Button>.

### Proposed release
v1.1.2 patch (fix: prefix → CI patch bump). One-commit PR.

### Acceptance
- etfframework /app/page.tsx probe shows zero <a href><button> instances across all five viewports after consumer bump
- ETFtestSite equivalent probe (if BrandCta used there) clean
- LinkButton pattern documented in CHANGELOG

### Next session steps
1. Open BrandCta source, confirm current <Link><Button> pattern
2. Refactor to single-element output matching LinkButton.tsx convention
3. Add test in tests/ui-client/brand-cta.test.tsx asserting no nested anchor/button in rendered output
4. Branch fix/brand-cta-nested-anchor
5. PR with subject "fix(ui-client): BrandCta emits single element"
6. Squash-merge, CI patch-bumps to v1.1.2, publishes

### Out of scope
Consumer bumps (Phase C work in etfframework and ETFtestSite).
