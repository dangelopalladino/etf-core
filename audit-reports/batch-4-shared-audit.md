# Batch 4 — Shared Assets & Infrastructure Audit

**Canonical source:** `~/.claude/skills/etf-brand-shared/references/shared-assets.md`
**Sites audited:** `ETFtestSite` (6i), `etfframework` (ETF), and `etf-core` (shared library)
**Executed:** 2026-04-18 (static code scan; one `ls` bash for public/ listings)

Legend — *Consistency*: `pass` · `drift (MINOR)` · `drift (MAJOR)` · `contradiction (CRITICAL)` · `needs-human-review` · `not referenced`.

---

## Headline finding

Both sites **emit `FAQPage` JSON-LD schema** — explicitly banned by canonical (CRITICAL, both sites). **Cross-brand UTMs are entirely absent** from both footers (CRITICAL). **ETF footer has no cross-link to 6identities.com at all**, violating canonical's ecosystem-link rule (CRITICAL). Fonts drift: 6i ships **General Sans**, ETF ships **Inter** (MAJOR). Icon libraries: **both sites use AntD icons; canonical specifies Lucide** (MAJOR → canonical-expansion candidate). 

**Upside:** `@dangelopalladino/etf-core` consumption is extensive and consistent on both sites — tokens, UI primitives, analytics, commerce, SEO factories, webhook handler, books content, testimonials — all flow through etf-core. Infrastructure parity is strong at the code level even where content/schema drift exists.

---

## Section 1 — etf-core consumption

Both sites import from `@dangelopalladino/etf-core` via thin re-export shims.

#### Match: etf-core `/tokens/6id` and `/tokens/etfframework` theme consumption

**Canonical location:** canonical expects each site to consume its own design-token layer from a shared library.
**Canonical definition:** "packages/tokens/ imported by each app" (shared-assets.md:408–409).
**Found in:** `ETFtestSite/src/lib/brand-tokens.ts:3` → `export * from '@dangelopalladino/etf-core/tokens/6id'`; `ETFtestSite/src/lib/antd-theme.ts:24–25` → same. `etfframework/src/lib/brand-tokens.ts:2` → `export * from '@dangelopalladino/etf-core/tokens/etfframework'`; `etfframework/src/lib/antd-theme.ts:26–27` → same.
**Site version:** both sites correctly pull their own token layer from etf-core.
**Consistency:** **pass**.

#### Match: etf-core `/ui-client` and `/ui-server` consumption

**Canonical location:** shared-assets.md:408 — "packages/ui/ shared React components."
**Canonical definition:** both apps import components from the shared package.
**Found in:** both sites' `components/shared/{SectionWrapper,SectionHeader,BrandCta,CtaSection,MetricPanel,ScoreBar,StatusBadge,ServerTypography}.tsx` files contain `export { … } from '@dangelopalladino/etf-core/ui-client'` or `ui-server`.
**Site version:** both sites re-export every shared component as a thin shim.
**Consistency:** **pass**.

#### Match: etf-core `/analytics`, `/commerce`, `/commerce/webhook`, `/content`, `/seo` consumption

**Canonical location:** shared-assets.md:402–411.
**Canonical definition:** — (implicit: shared logic lives in shared packages).
**Found in:** `{site}/src/lib/analytics-events.ts`, `downloads.ts`, `download-tokens.ts`, `pdf-watermark.ts`, `testimonials.ts`, `content/books.ts`, `email/send-book-fulfillment.ts`, `email/send-certification-guide.ts`, `seo/json-ld.ts` on both sites all `export * from '@dangelopalladino/etf-core/{module}'`. `layout.tsx` (6i) and `components/analytics/GA4.tsx` (ETF) both import `GA4Loader` from `'@dangelopalladino/etf-core/analytics'`. Both `api/webhook/route.ts` import `handleStripeEvent`.
**Site version:** consistent consumption across both sites.
**Consistency:** **pass**.

---

## Section 2 — Banned schema types

Canonical `shared-assets.md:289–291`:
> **The banned schema types** — HowTo schema. FAQPage schema. "If either appears in either site's markup, remove it."

#### Match: `FAQPage` schema on 6i

**Canonical location:** `shared-assets.md:290`.
**Canonical definition:** banned; remove on sight.
**Found in:**
- `ETFtestSite/src/app/faq/page.tsx:5` — `import { faqPageSchema } from '@/lib/seo/json-ld';`
- `ETFtestSite/src/app/faq/page.tsx:19` — `const faqSchema = faqPageSchema(allItems);`
- `ETFtestSite/src/components/primitives/FAQ.tsx:50` — emits `'@type': 'FAQPage'` directly.
- `ETFtestSite/src/components/shared/FAQ.tsx:45` — a second component also emits `'@type': 'FAQPage'`.

**Site version:** FAQPage schema is actively generated on the 6i `/faq` page and wherever FAQ components ship.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical says the schema must be removed. It is in active production use.

#### Match: `FAQPage` schema on ETF

**Canonical location:** `shared-assets.md:290`.
**Canonical definition:** banned; remove on sight.
**Found in:**
- `etfframework/src/app/faq/page.tsx:6` — `import { faqPageSchema } from '@/lib/seo/json-ld';`
- `etfframework/src/app/faq/page.tsx:51` — `const faqSchema = faqPageSchema(faqs.map(...))`.
- `etfframework/src/components/primitives/FAQ.tsx:50` — direct `'@type': 'FAQPage'`.

**Site version:** same as 6i: FAQPage schema is in active production use.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** same.

#### Match: `faqPageSchema` factory in etf-core

**Canonical location:** `shared-assets.md:289–291` bans the schema type; canonical does not explicitly ban the factory.
**Canonical definition:** — (gap — should etf-core retain a factory for a banned schema?).
**Found in:** `etf-core/src/seo/json-ld.ts:86–96` defines `faqPageSchema(items)`.
**Site version:** factory exists in the shared library, which makes its use on both sites trivially easy.
**Consistency:** **drift (MAJOR)** → canonical-expansion candidate.
**Severity justification:** The factory's existence is the root enabler of the CRITICAL violations above. Recommendation: canonical should explicitly require removal from etf-core, OR etf-core should mark it deprecated with a runtime warning. Flag for Master item 6.

#### Match: `HowTo` schema

**Canonical location:** `shared-assets.md:289`.
**Canonical definition:** banned.
**Found in:** grep `HowTo` returned no matches in either site's `src/`.
**Site version:** not present.
**Consistency:** **pass**.

---

## Section 3 — Cross-site linking + UTM parameters

Canonical `shared-assets.md:204–214` + `etf-brand-shared/SKILL.md` §"Cross-site linking rules":
- 6i footer must link to ETF with line *"Are you a therapist, coach, or practitioner…? Visit etfframework.com."*
- ETF footer must link to 6i with line *"The consumer-facing diagnostic assessment is hosted at 6identities.com."*
- All cross-site links must carry UTMs: `?utm_source=[site]&utm_medium=cross_brand&utm_campaign=[footer|for_practitioners|methodology]`.

#### Match: 6i footer → ETF link

**Canonical location:** `etf-brand-shared/SKILL.md` (cross-site linking rules).
**Canonical definition:** one line: *"Are you a therapist, coach, or practitioner working with athletes? Visit etfframework.com."* + UTM `?utm_source=6identities&utm_medium=cross_brand&utm_campaign=footer`.
**Found in:** `ETFtestSite/src/components/Footer.tsx:89–107`.
**Site version:** link exists (`<Link href={etfUrl} target="_blank" rel="noopener">Built on the Executable Transition Framework (ETF™) →</Link>`) but:
- Link text differs from canonical (no *"Are you a therapist…"* framing).
- **No UTM parameters appended** (`href` is the bare `NEXT_PUBLIC_ETF_FRAMEWORK_URL`).

**Consistency:** **drift (MAJOR)** for copy + **contradiction (CRITICAL)** for UTM absence.
**Severity justification:** Cross-site attribution is impossible without UTMs; canonical requires them. Copy paraphrase is MAJOR because canonical is specific about the practitioner-framing.

#### Match: 6i footer → ETF /careers link

**Canonical location:** canonical does not mandate this link; site-specific.
**Canonical definition:** — (canonical's UTM rule still applies to *all* cross-site links).
**Found in:** `ETFtestSite/src/components/Footer.tsx:64` → `{ name: 'Careers', href: `${ETF_FRAMEWORK_URL}/careers`, external: true }`.
**Site version:** no UTM.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Any cross-site link must carry UTM per canonical rule; this one does not.

#### Match: ETF footer → 6i link

**Canonical location:** `etf-brand-shared/SKILL.md` (cross-site linking rules).
**Canonical definition:** *"The consumer-facing diagnostic assessment is hosted at 6identities.com."* + UTM `?utm_source=etfframework&utm_medium=cross_brand&utm_campaign=footer`.
**Found in:** `etfframework/src/components/Footer.tsx:55` declares `const sixidUrl = process.env.NEXT_PUBLIC_SIXID_URL || 'https://6identities.com';` — but **`sixidUrl` is never used in the rendered JSX**. The footer has link columns for Company / Framework / Community / Resources / Connect. None point to `sixidUrl`.
**Site version:** no cross-link to 6i at all.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** ETF is missing the canonical-required cross-link entirely. The variable exists but has no callsite. This is strictly worse than 6i's situation — 6i has the link with missing UTM; ETF has no link.

#### Match: site-level UTM writers

**Canonical location:** `shared-assets.md:204–214`.
**Canonical definition:** UTM appended to every cross-brand link.
**Found in:** grep `utm_source|utm_medium|utm_campaign` on both sites — only in `src/lib/analytics-source.ts` (reader, not writer). No outbound-link UTM construction anywhere in `src/`.
**Site version:** neither site has a UTM-appending helper, and no component appends UTMs inline.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** The infrastructure to write UTMs does not exist at all.

---

## Section 4 — Analytics event naming

Canonical `shared-assets.md:174–202`:
> All events follow the pattern: `[site]_[surface]_[action]`.
> 6i examples: `6i_homepage_hero_cta_clicked`, `6i_assessment_started`, etc.
> ETF examples: `etf_homepage_hero_cta_clicked`, `etf_methodology_viewed`, etc.
> Cross-site: `ecosystem_6i_to_etf_transition`, `ecosystem_etf_to_6i_transition`.

#### Match: shared event catalog (etf-core `EVENTS`)

**Canonical location:** `shared-assets.md:176–202`.
**Canonical definition:** events carry site prefix; shared events carry `ecosystem_` prefix.
**Found in:** `etf-core/src/analytics/events.ts:4–79` — `EVENTS` object with entries like `ASSESSMENT_STARTED: 'assessment_started'`, `LANDING_CTA_SELECTED: 'landing_cta_selected'`, `RESULTS_VIEWED: 'results_viewed'`, `CHECKOUT_STARTED: 'checkout_started'`, `CERT_STARTED: 'certification_started'`. Both sites re-export this catalog verbatim via `analytics-events.ts`.
**Site version:** all event names are `[surface]_[action]` with **no site prefix** and **no `ecosystem_` prefix** on cross-site events.
**Consistency:** **contradiction (CRITICAL)** → canonical-expansion candidate.
**Severity justification:** Sites share a single namespace because the catalog lives in etf-core. This is more rigorous than canonical's split-namespace approach (single source of truth vs two parallel catalogs). But canonical's pattern is not what the sites ship. Recommendation: canonical should document the shared-namespace pattern and remove the `[site]_` requirement; alternatively, add site prefixes at GA4 emission time (major refactor). **Defer to human decision in Master item 6/7.**

#### Match: cross-site ecosystem events

**Canonical location:** `shared-assets.md:199–202`.
**Canonical definition:** `ecosystem_6i_to_etf_transition`, `ecosystem_etf_to_6i_transition`.
**Found in:** `etf-core/src/analytics/events.ts` — neither event name is present in the `EVENTS` catalog.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Without these events, cross-site journey tracking (canonical's stated reason for the analytics schema) is impossible. Plus cross-site UTMs are absent (Section 3) — so there are no signals to attribute.

---

## Section 5 — Schema markup (schema.org)

### Person schema (founder)

#### Match: Person schema shape on both sites

**Canonical location:** `shared-assets.md:227–253`.
**Canonical definition:** `@type: Person`, name, jobTitle `Founder`, two `worksFor` orgs, description, sameAs links. Identical on both sites.
**Found in:** `ETFtestSite/src/components/seo/AuthorSection.tsx:20` and `etfframework/src/components/seo/AuthorSection.tsx:22` both call `personSchema({...})` from the etf-core factory.
**Site version:** factory usage is identical shape; content passed to the factory varies by site (full live-JSON-LD comparison requires network fetch — flagged for Batch 5 cross-check).
**Consistency:** **pass (structural)**; **needs-human-review** for payload identity (content-level diff requires live-fetch).
**Severity justification:** Canonical says the Person schema must be *identical* on both sites. Static analysis confirms the factory is the same; confirming the payload is identical requires comparing two live JSON-LD blobs.

### Organization schema (per-site)

#### Match: Organization schema shape

**Canonical location:** `shared-assets.md:257–285`.
**Canonical definition:** each site is its own `@type: Organization`; references the other site via `sameAs`.
**Found in:** `etf-core/src/seo/json-ld.ts:127–141` defines `organizationSchema(opts)` factory. Grep for `"@type": "Organization"` literal did not surface direct-string uses in either site's production code (both likely use the factory). Factory `sameAs` is an array but does not enforce that the other site is listed — the caller must pass it.
**Site version:** factory emits whatever `sameAs` the caller provides. No grep evidence that either site passes the other's domain into `sameAs`.
**Consistency:** **needs-human-review**.
**Severity justification:** Without finding a site-level `organizationSchema({ ... sameAs: [otherDomain] ... })` call in either repo, canonical's *"each site's Organization references the other via sameAs"* rule cannot be confirmed. Probable gap — no direct evidence either site emits Organization schema at all on its homepage.

---

## Section 6 — Typography

Canonical `shared-assets.md:9–47`:
- Display: `[YOUR DISPLAY SERIF]` (placeholder)
- Body: `[YOUR GROTESK SANS]` (placeholder)
- Mono: `[YOUR MONOSPACE]` (placeholder)
- Rule: both sites load from the same source.

#### Match: display serif

**Canonical location:** `shared-assets.md:16`.
**Canonical definition:** same display serif on both sites.
**Found in:** `ETFtestSite/src/app/layout.tsx:37–40` and `etfframework/src/app/layout.tsx:23–26` both declare `Source_Serif_4` via `next/font/google`.
**Site version:** both load `Source Serif 4` from Google Fonts → `--font-source-serif`.
**Consistency:** **pass**.

#### Match: body grotesk sans

**Canonical location:** `shared-assets.md:17`.
**Canonical definition:** same body sans on both sites.
**Found in:**
- 6i `layout.tsx:23–35` — loads **General Sans** via `next/font/local` from `./fonts/GeneralSans-Variable.ttf`, Fontshare FFL license. Comment at line 23–24: *"Body font: General Sans … Swapped from Inter for warmer, less SaaS-default identity."*
- ETF `layout.tsx:17–21` — loads **Inter** via `next/font/google`. Comment at line 15: *"Directive §5.3: body font is Inter via next/font, bound to --font-sans."*

**Site version:** 6i ships General Sans; ETF ships Inter.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical is explicit that both sites load fonts from the same source (`shared-assets.md:21–27`). 6i's comment acknowledges the deliberate deviation. Either canonical accepts the split (and drops its "same source" rule), or 6i/ETF must converge. The checklist at `shared-assets.md:423` (*"Both sites load fonts from the same CDN or self-hosted path?"*) fails.

#### Match: font preload pattern

**Canonical location:** `shared-assets.md:29–36`.
**Canonical definition:** both sites implement the same `<link rel="preconnect">` + `<link rel="preload" as="font">` pattern.
**Found in:**
- 6i `layout.tsx:112–114` — `<link rel="preconnect" href="https://www.googletagmanager.com" />`, Supabase preconnect. **No explicit font preload** beyond what `next/font` adds automatically.
- ETF `layout.tsx:81` — `<link rel="preconnect" href="https://www.googletagmanager.com" />` only.

**Site version:** both delegate font preloading to `next/font` (which does add preloads automatically for above-the-fold fonts).
**Consistency:** **drift (MINOR)**.
**Severity justification:** Canonical's explicit preload pattern is not implemented by hand, but `next/font` effectively replaces it. Low-impact deviation.

---

## Section 7 — Iconography

Canonical `shared-assets.md:55–106`:
- **Primary:** Lucide (`lucide-react`), 1.5px stroke.
- **Secondary:** Phosphor (regular weight).
- **Banned ecosystem-wide:** Font Awesome, Material Icons, emoji in UI.

#### Match: Lucide icon usage

**Canonical location:** `shared-assets.md:57–72`.
**Canonical definition:** primary library on both sites.
**Found in:** grep `lucide-react` in `ETFtestSite/src/` and `etfframework/src/` — **0 matches** on either site.
**Site version:** not installed, not imported.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical declares Lucide the primary library. Neither site uses it.

#### Match: Phosphor icon usage

**Canonical location:** `shared-assets.md:74–87`.
**Canonical definition:** secondary library.
**Found in:** grep `@phosphor-icons` on both sites — 0 matches.
**Site version:** not used.
**Consistency:** **not referenced**.
**Severity justification:** Canonical says secondary "for icons not available in Lucide." Since Lucide is not in use, Phosphor absence is downstream, not independent.

#### Match: actual icon library in use

**Canonical location:** not in canonical.
**Canonical definition:** — (canonical does not sanction any alternative).
**Found in:** both sites use `@ant-design/icons`:
- `ETFtestSite/src/components/assessment/FeatureCards.tsx:17,24,31` — `FileDoneOutlined`, `StarOutlined`, `ClockCircleOutlined` with inline `strokeWidth: 1.5`.
- `etfframework/src/app/certification/page.tsx:5` imports `ArrowRightOutlined, CheckCircleOutlined`.

**Site version:** AntD icons (`*Outlined`) family, with 1.5 strokeWidth applied by inline style where possible.
**Consistency:** **contradiction (CRITICAL)** → canonical-expansion candidate.
**Severity justification:** Canonical iconography rule is not followed. But the sites use AntD consistently (both as UI framework and as icon library), which is coherent from a design-system standpoint. Recommendation: canonical should document AntD icons as the actual library, OR the sites should migrate to Lucide. Defer to Master item 6/7.

#### Match: icon stroke width

**Canonical location:** `shared-assets.md:70–71`.
**Canonical definition:** never change 1.5px stroke-width.
**Found in:** 
- 6i: several `strokeWidth="1.5"` usages (Footer `<circle>`, `ArticleClient.tsx:172`). Also `strokeWidth="2"` in `ShareCard.tsx:342` and `Characters.tsx` (various values 0.4/0.5/0.6/0.8/1/1.2/1.5 — decorative line art, not iconography per se).
- ETF: no `strokeWidth` matches outside skill references.

**Site version:** 6i honors 1.5 where icons are concerned; 2.0 in ShareCard.tsx is a violation; decorative line-art values are out of icon scope.
**Consistency:** **drift (MINOR)** — ShareCard.tsx 2.0 stroke.
**Severity justification:** Low-impact in a share-card rendering context (SVG output for social sharing). Flag for correction.

---

## Section 8 — Favicons & Open Graph images

Canonical `shared-assets.md:367–391`:
- **6i favicon files:** `/favicons/6i/favicon.ico` (multi-res), `apple-touch-icon.png` (180×180), `android-chrome-512x512.png`.
- **ETF favicon files:** `/favicons/etf/favicon.ico`, `apple-touch-icon.png`, `android-chrome-512x512.png`.
- **OG images:** per-page, at `/og-images/[slug]-og.png`. 1200×630.

#### Match: 6i favicon set

**Canonical location:** `shared-assets.md:372–375`.
**Canonical definition:** ico (multi-res), apple-touch-icon.png (180×180), android-chrome-512x512.png.
**Found in:** `ETFtestSite/public/` contents (via `ls`):
- `favicon.svg` ✓ (canonical spec unclear — canonical names .ico, site has .svg)
- `apple-touch-icon.png` ✓
- `icon-48.png`, `icon-192.png`, `icon-512.png` — canonical spec doesn't list icon-48.png / icon-192.png; canonical lists android-chrome-512x512.png which 6i ships as `icon-512.png`.
- **No `favicon.ico`** (despite `layout.tsx:62` declaring `shortcut: ['/favicon.ico']`).
- **No `/favicons/6i/` subdirectory** (canonical spec has subdirectory layout).

**Site version:** partially compliant; file names differ from canonical; `.ico` missing.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** The `favicon.ico` declared in metadata doesn't exist — likely 404s for IE/legacy clients. File naming differs from canonical.

#### Match: ETF favicon set

**Canonical location:** `shared-assets.md:377–380`.
**Canonical definition:** ico, apple-touch-icon.png, android-chrome-512x512.png; "stylized `E` monogram (not the full wordmark)."
**Found in:** `etfframework/public/` contents:
- `etf-icon.svg` + `etf-logo.svg` only.
- **No `favicon.ico`, no apple-touch-icon.png, no android-chrome-512x512.png, no PNG at any size.**

**Site version:** SVG-only; deeply minimal.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** Apple touch, Android home-screen, and legacy-browser .ico fallbacks are all missing. The layout.tsx only declares SVG paths, so the site does not break; but canonical's favicon set is largely absent.

#### Match: Open Graph images

**Canonical location:** `shared-assets.md:381–391`.
**Canonical definition:** 1200×630 per-page OG images at `/og-images/[slug]-og.png`. No photography. Display-serif headline.
**Found in:** both sites have a single `public/og-static.png` (one file) and neither `layout.tsx` metadata openGraph block declares an `images` entry. No `/og-images/` directory.
**Site version:** single static OG image, probably not rendered on any page (metadata doesn't reference it).
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical's per-page OG system is a paved path for shareable URL cards. Neither site implements it; both serve bare metadata (only text-card on social). `og-static.png` exists as an asset but is not declared in metadata.

---

## Section 9 — Brand marks (SVGs)

Canonical `shared-assets.md:308–333`:
- Mark files live at `etf-brand-assets/logos/{6i-mark,etf-mark,ecosystem-lockup}/*.svg`.
- Both sites pull at build time from the shared repository.

#### Match: shared-asset repository pattern

**Canonical location:** `shared-assets.md:302–345`.
**Canonical definition:** Git submodule or CDN sync from `etf-brand-assets/` into each site's public.
**Found in:** neither repo has a submodule, a sync script, or a pull-on-build step referencing a shared assets repo. 6i Footer (`Footer.tsx:80–83`) hand-draws the logo as inline SVG (`<circle>` + `<text>`). ETF `public/etf-icon.svg` and `etf-logo.svg` are site-local files.
**Site version:** no shared-asset repository exists; brand marks are ad-hoc per site (inline SVG on 6i; site-local SVG on ETF).
**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical's infrastructure pattern for brand marks is not implemented. The sites do not drift against each other *in ways detectable at this layer*, but the canonical's stated mechanism (monorepo `/packages/assets` or shared submodule) is absent. Low urgency if the inline/local marks are correct; higher urgency when brand updates need to propagate.

#### Match: ecosystem lockup `6 Identities × ETF™`

**Canonical location:** `etf-brand-shared/SKILL.md` §"The ecosystem lockup"; `shared-assets.md:318–320`.
**Canonical definition:** `6 Identities × ETF™` where `×` is U+00D7, serif display.
**Found in:** grep for `6 Identities × ETF` or U+00D7 usage — 0 production matches. No `ecosystem-lockup/` asset directory anywhere.
**Site version:** not referenced.
**Consistency:** **not referenced**.
**Severity justification:** Canonical says the lockup is "only used in ecosystem contexts, never as a primary mark on either site." Its absence may be intentional (no press kit, no investor deck surfaces); flag but do not rank severity.

---

## Section 10 — Infrastructure checklist (from `shared-assets.md:421–435`)

| Canonical check | Status |
|---|---|
| Both sites load fonts from the same CDN or self-hosted path? | **FAIL** (General Sans vs Inter) |
| Both sites use Lucide at 1.5px stroke, no other icon libraries except Phosphor regular? | **FAIL** (AntD icons on both) |
| Custom component icons (if present) are in the shared asset repository? | N/A (no custom icons shipped) |
| Photography on both sites is tracked with license metadata? | **not checked** (scope exceeds static scan; flagged) |
| Analytics events on both sites follow `[site]_[surface]_[action]` naming convention? | **FAIL** (no site prefix) |
| Cross-site links carry UTM parameters? | **FAIL** (no UTMs) |
| Founder `Person` schema is identical on both sites? | **needs-live-check** (shape yes, payload undetermined) |
| Organization schema on each site references the other via `sameAs`? | **needs-human-review** (no evidence of call sites) |
| Neither site uses `HowTo` or `FAQPage` schema? | **FAIL** (FAQPage used on both) |
| Both sites' favicons, OG images, and logos pull from the shared asset repository? | **FAIL** (no shared repository) |
| Brand-mark SVGs are versioned; both sites pin to the same version? | **FAIL** (no versioned repo) |
| llms.txt files on both domains share canonical facts with site-specific voice? | **FAIL** (files missing — Batch 3) |

**12 items. 8 fails, 1 N/A, 2 undetermined, 1 deferred to Batch 5.**

---

## Section 11 — Pricing-drift reminder (surfaced in Step 3 rubric, resolved here)

#### Match: practitioner portal monthly price

**Canonical location:** `etf-brand-shared/SKILL.md` §"The two pricing tracks" ($19.99/month portal access); `ecosystem-copy.md:180` — "$19.99/month portal access."
**Canonical definition:** $19.99/month.
**Found in:** `etf-core/src/commerce/priceMap.ts:61` — `practitioner_portal: { envVar: 'STRIPE_PRICE_PRACTITIONER_PORTAL', amountUsd: 49.0, mode: 'subscription' }`.
**Site version:** $49.00/month in runtime.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical declares $19.99/month; etf-core ships $49.00/month; both sites import etf-core. The canonical llms.txt templates echo the canonical price. This is either a canonical-stale (etf-core shipped a repricing) or etf-core-wrong. Resolution: check live Stripe prices and current pricing page on ETF certification. Flag for Master item 1.

#### Match: implementer_cert success URL

**Canonical location:** not specified.
**Canonical definition:** — (canonical assumes ETF's certification module flow is hosted on etfframework.com).
**Found in:** `etf-core/src/commerce/priceMap.ts:65–67` — `successUrl: 'https://6identities.com/professionals/certification/modules?success=true'` with TODO comment: *"Track C will flip this to https://etfframework.com/certification/modules once etfframework's LMS routes are live."*
**Site version:** professional certification module flow is still hosted on 6i.
**Consistency:** **drift (MAJOR)** → transitional state explicitly acknowledged in code.
**Severity justification:** A professional-facing URL routes to the consumer site. Canonical says the ETF delivery layer lives at etfframework.com. In-code TODO acknowledges the fix path. Flag for Master item 3 as planned transition.

---

## Section 12 — Severity rollup

| Severity | Count |
|---|---|
| CRITICAL (contradiction) | 10 |
| MAJOR (drift of required form) | 6 |
| MINOR (paraphrase/low-impact drift) | 2 |
| needs-human-review | 2 |
| not referenced (explicit) | 2 |
| N/A / deferred | 1 |
| pass | 5 |
| **total findings** | **28** |

---

## Section 13 — Recommendations surfaced for Master Report

### Immediate CRITICAL remediations

1. **Master item 2 (CRITICAL, both sites):** remove `FAQPage` schema from FAQ components and pages. Audit `{site}/src/components/primitives/FAQ.tsx`, `{site}/src/components/shared/FAQ.tsx` (6i only), and both `/app/faq/page.tsx` handlers. Keep the FAQ UI; drop the JSON-LD emission.
2. **Master item 6 (CRITICAL, etf-core):** mark `faqPageSchema` factory deprecated in `etf-core/src/seo/json-ld.ts`; consider removing it in a next major release.
3. **Master item 2 (CRITICAL, ETF):** add the canonical cross-link to 6identities.com in the ETF footer. Use `sixidUrl` variable already declared at `Footer.tsx:55`.
4. **Master item 2 (CRITICAL, both sites):** implement a `withUtm(href, campaign)` helper in etf-core and use it for every cross-brand link (footer, For Practitioners, methodology).
5. **Master item 2 (CRITICAL, both sites):** add ETF → 6i and 6i → ETF Organization schema payloads that reference the other site via `sameAs`. Verify Person schema payload identity via live JSON-LD fetch.

### MAJOR drifts to reconcile

6. **Master item 3 (MAJOR):** align body fonts. Either both sites ship General Sans, both ship Inter, or canonical documents the split with rationale. The etf-core v1.0.4 changelog and 6i `layout.tsx:23–24` comment both indicate deliberate past divergence — bring to a head.
7. **Master item 3 (MAJOR, both sites):** implement per-page OG images per canonical `[slug]-og.png` convention. Canonical describes 1200×630, display-serif headline, no photography — build the render at `/api/og/[slug]` using edge runtime.
8. **Master item 3 (MAJOR, ETF):** ship full favicon set (apple-touch-icon.png, icon-512.png, favicon.ico) in `etfframework/public/`.
9. **Master item 3 (MAJOR, 6i):** add missing `favicon.ico` file referenced in metadata.
10. **Master item 3 (MAJOR, both sites):** establish shared brand-asset distribution — either a monorepo `packages/assets` folder or a submodule as canonical describes, including ecosystem lockup SVGs.

### Canonical expansion candidates

11. **Master item 6 (canonical):** adopt AntD icons as the approved library (or mandate migration to Lucide ecosystem-wide). Current state violates canonical but is internally consistent.
12. **Master item 6 (canonical):** document etf-core's shared-namespace analytics pattern (no site prefix) as the canonical rule; add site-level segmentation via GA4 data-stream filters instead of event-name prefix.
13. **Master item 6 (canonical):** resolve the $19.99/mo vs $49/mo practitioner-portal price — canonical or etf-core is stale.

### Deferred for live-check (flagged for Batch 5 or separate follow-up)

14. Person schema payload identity across both domains (requires HTML/JSON-LD fetch).
15. Organization schema actual presence and `sameAs` content on both homepages.

End of Batch 4.
