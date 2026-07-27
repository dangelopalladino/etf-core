# Shared Ecosystem Audit — Execution Plan

**Status:** CLOSED 2026-04-19
**Last updated:** 2026-04-19 (closure pass)
**Source of truth:** this file. Do not re-derive from the audit spec (`audit0419/audit-shared-ecosystem-v3.md`).

## 0. Closure summary

**Corrections tracking has moved:** this file (`EXECUTION-PLAN.md`) tracks *discovery* (audit batches 1–5) and is **CLOSED**. Post-audit *fixes* are tracked in `./MASTER-SHARED-AUDIT-REPORT.md` — a stateful corrections plan (Waves A–E) with an embedded Skill-Routed Execution Contract (Impeccable plugin: `/impeccable:distill`, `/impeccable:audit`, `/impeccable:adapt`, `/impeccable:harden`, `/impeccable:optimize`, `/impeccable:critique`, `/impeccable:layout`, `/impeccable:typeset`, `/impeccable:polish`, `/impeccable:impeccable`) and the subagent batching workflow established during the audit. The `handoff` skill consumes MASTER **§3 "Current state" — specifically the `Next exact action` bullet — first** on resume; then §1.2 compliance mandate; then §4 entry for `nextWave`. At 2026-04-19: Waves A + B sealed; `nextWave: C`. Do not re-derive state from this file or from batch reports — MASTER is source of truth for corrections.

- **Audit:** all 5 batches + MASTER report complete. Deliverable shipped.
- **Phase A (canonical resolution):** complete. Patch archived at `docs/canonical-patches/2026-04-phase-a.md`. All 10 human-decision items in §7 resolved there.
- **Phase B (etf-core propagation):** shipped as **v1.1.1** (v1.1.0 tombstoned by GitHub Packages E409; republished as 1.1.1 with identical content). Absorbed items B.1, B.2, B.3, B.4, B.6, B.7, B.8. B.5 (Core Code archetype rename) is Phase C site-repo work — type doesn't live in etf-core.
- **Phase C/D/E (site propagation):** out of scope for this repo; tracked separately in each site's own session.

### etf-core follow-up still open

None. The BrandCta nested-anchor fix was already shipped in v1.0.7 / v1.1.0 / v1.1.1 via commit `2d79886`; verified at HEAD on 2026-04-19 (source uses `useRouter().push(href)`, no `<Link>` wrapper; `git tag --contains 2d79886` → v1.0.7, v1.1.0, v1.1.1). The follow-up plan that assumed it was still open has been archived at `.claude/plans/archived/phase-b-followup-brandcta-fix.md` with a closure header. Consumer bumps past 1.0.6 in etfframework and ETFtestSite are Phase C site-repo work.

## 1. Current state

- **Last completed batch:** 5 (+ MASTER report + `/harden` reconciliation applied)
- **Next batch:** none — deliverable complete. Master report at `audit-reports/MASTER-SHARED-AUDIT-REPORT.md`.
- **Open blockers:** none. No open etf-core work (see §0 — BrandCta fix already shipped).
- **Repos audited:**
  - shared: `/Users/dangelor.palladinolckroomr/Code/etf-core` (`@dangelopalladino/etf-core` — v1.0.6 at audit time; v1.1.1 shipped 2026-04-19)
  - 6i: `/Users/dangelor.palladinolckroomr/Code/ETFtestSite`
  - ETF: `/Users/dangelor.palladinolckroomr/Code/etfframework`

## 2. Batches

### Batch 1 — Canonical definitions
- [x] Six identity types (Compass/Mirage/Sentinel/Signal/Anchor/Catalyst) cross-checked — **CRITICAL taxonomy contradiction**
- [x] Eight components (branded Motion order + clinical translations) cross-checked — **CRITICAL**
- [x] Three phases (Build/Consolidate/Integrate) cross-checked — **not referenced on either site** (canonical uses 4 phases: baseline/build/peak/recover)
- [x] Core Code archetypes (Autonomous/Servant/Competitor/Connector/Creator) cross-checked — **CRITICAL; 6i has two internally inconsistent variants**
- [x] Compound code format (CP-AU-XUA pattern) cross-checked — structural pass; stale `PF` example MINOR
- [x] Batch report saved (`batch-1-shared-audit.md`)
- [x] Plan updated

### Batch 2 — Ecosystem copy
- [x] Founder bio (3 lengths) cross-checked — ETF bio matches none (MAJOR)
- [x] Academic citations (Brewer 1993, Schlossberg 1981, Matveyev 1977, Bompa 2019 + 6 more on sites)
- [x] Scope-of-practice statement verbatim match — **absent from both sites (CRITICAL)**
- [x] Press kit boilerplate — not referenced (no press page)
- [x] "Built by someone who went through it" proof block — **absent on both (CRITICAL)**
- [x] Batch report saved (`batch-2-shared-audit.md`)
- [x] Plan updated

### Batch 3 — llms.txt integrity
- [x] Fetch `https://6identities.com/llms.txt` via WebFetch — **HTTP 404 (CRITICAL)**
- [x] Fetch `https://etfframework.com/llms.txt` via WebFetch — **HTTP 404 (CRITICAL)**
- [x] Key facts match canonical templates — N/A (files absent)
- [x] 6i does NOT use "operating system for athlete transition" — N/A
- [x] ETF DOES use "operating system for athlete transition" — N/A
- [x] Both link to the other domain — N/A
- [x] Batch report saved (`batch-3-shared-audit.md`)
- [x] Plan updated

### Batch 4 — Shared assets + infrastructure
- [x] Brand mark SVGs at expected paths — no shared repo; ad-hoc per site (MAJOR)
- [x] Both sites pull from shared asset repository — **no shared asset repo exists (MAJOR)**
- [x] Favicon + OG images exist for both sites — partial on 6i (missing .ico); SVG-only on ETF (MAJOR); per-page OG absent both (CRITICAL)
- [x] Both sites use General Sans font — **6i yes, ETF ships Inter (MAJOR)**
- [x] Both sites use AntD icons (canonical locked in Phase A) — **both ship AntD; canonical still says Lucide (MAJOR / canonical-expansion)**
- [x] Founder Person schema identical on both sites — structural pass; payload needs live-check
- [x] Organization schema references sibling site via `sameAs` — needs-human-review (no evidence of call sites)
- [x] Neither site uses HowTo or FAQPage JSON-LD — **FAQPage in active use on both (CRITICAL)**
- [x] Analytics events follow `[surface]_[action]` pattern (shared namespace per Phase A) — shared namespace shipped; canonical still wants `[site]_` prefix (CRITICAL / canonical-expansion)
- [x] Cross-site links carry UTM parameters via `withUtm` helper — **no helper; no UTMs (CRITICAL)**
- [x] Pricing-drift: `practitioner_portal` = $49/mo in etf-core vs $19.99/mo canonical — **CRITICAL (needs-human)**
- [x] Batch report saved (`batch-4-shared-audit.md`)
- [x] Plan updated (ETF footer cross-link severity corrected post-`/harden`: CRITICAL→MAJOR)

### Batch 5 — Cross-site voice drift
- [x] Fetch 6i homepage hero via WebFetch — **matches canonical's "Incorrect" example (CRITICAL)**
- [x] Fetch ETF homepage hero via WebFetch
- [x] Run strip test on both heroes — 6i fails; ETF trivial pass but voice drift
- [x] 6i hero reads editorial (intensity 6/10) — hero copy is off-canonical entirely
- [x] ETF hero reads institutional (intensity 2/10) — **drifted to ~5/10 (MAJOR)**
- [x] Heroes would NOT read correctly swapped — partial swap possible ETF→6i direction (voice asymmetry partially collapsed)
- [x] Fetch + evaluate both footer cross-links — ETF cross-link exists but paraphrased + `?ref=etfframework` non-canonical UTM (MAJOR)
- [x] Fetch + evaluate 6i `/professionals` page — **`/for-practitioners` canonical URL is 404 (CRITICAL)**; subhead swaps "systems failure"→"identity crisis" (MAJOR)
- [x] Fetch + evaluate ETF `/methodology` first screen — voice on-register; taxonomy CRITICAL already counted in Batch 1
- [x] Batch report saved (`batch-5-shared-audit.md`)
- [x] Plan updated

## 3. CRITICAL findings (reconciled: 30)

| ID | Title | Site affected | Status |
|----|-------|---------------|--------|
| C-01 | llms.txt absent (live 404 + not in repo) | both | open |
| C-02 | llms.txt absent — ETF | ETF | open |
| C-03 | llms.txt absent — 6i source | 6i | open |
| C-04 | llms.txt absent — ETF source | ETF | open |
| C-05 | FAQPage JSON-LD in active use — 6i | 6i | open |
| C-06 | FAQPage JSON-LD in active use — ETF | ETF | open |
| C-07 | 6i footer → ETF link missing UTM | 6i | open |
| C-08 | 6i footer → ETF /careers missing UTM | 6i | open |
| C-09 | No site-level UTM writer helper | both | open |
| C-10 | Analytics catalog missing `[site]_` prefix | shared/both | open — canonical-expansion candidate |
| C-11 | Missing `ecosystem_*_transition` events in etf-core | shared | open |
| C-12 | Canonical six-type taxonomy not shipped (Commander/Craftsman/…) | canonical | open — canonical-expansion candidate |
| C-13 | 6i ships undocumented six types (Compass/Mirage/…) | 6i → canonical gap | open |
| C-14 | etf-core `books.ts` mirrors site taxonomy, contradicts canonical | shared | open |
| C-15 | ETF `/our-network` puts Core Code adjacent to the 8 components (internal ETF contradiction) | ETF | open |
| C-16 | Five canonical Core Code archetypes (Driver/Anchor/Scout/Guardian/Craftsman Code) absent | both | open |
| C-17 | 6i Variant A Core Code (Sovereign/Guardian/Rival/Bonded/Pioneer) in TypeScript | 6i internal conflict | open — human decision |
| C-18 | 6i Variant B Core Code (Autonomous/Servant/Competitor/Connector/Creator) in knowledgebase/methodology | 6i internal conflict | open — human decision |
| C-19 | Eight-component branded names on ETF methodology not in canonical | ETF | open — canonical-expansion candidate |
| C-20 | Scope-of-practice statement absent from ETF methodology/cert/portal | ETF | open |
| C-21 | Scope-of-practice paraphrase variants on 6i/ETF footers + disclosures + FAQ + cert terms | both | open |
| C-22 | Schlossberg (1981) citation absent from ETF methodology | ETF | open |
| C-23 | Matveyev (1977) + Bompa/Buzzichelli (2019) citations absent | ETF | open |
| C-24 | "Built by someone who went through it" proof block absent — 6i | 6i | open |
| C-25 | "Built by someone who went through it" proof block absent — ETF | ETF | open |
| C-26 | 15-item "what this is not" list absent from ETF methodology | ETF | open |
| C-27 | 6i homepage hero matches canonical's documented "Incorrect" example | 6i | open |
| C-28 | "trademark" literal word leaking next to ™ in 6i hero (`<TM />` bug) | 6i | open |
| C-29 | `/for-practitioners` canonical URL returns 404 (page moved to `/professionals`) | 6i / canonical | open |
| C-30 | "Brewer and Cornelius" wrong-citation variant on 6i `/guide` | 6i | open — canonical-expansion candidate |
| C-31 | Per-page OG images absent on both sites | both | open |
| C-32 | etf-core `practitioner_portal` price = $49/mo vs canonical $19.99/mo | shared | open — human decision |
| C-33 | etf-core `faqPageSchema` factory enables banned schema | shared | open |
| C-34 | ETF homepage hero drift + voice convergence (intensity ~5/10 vs 2/10) | ETF | open |

(Table count: 34 entries; 4 of these are sub-items of 2 parent CRITICALs — C-01 split + taxonomy parents. Reconciled MASTER §1 total remains **30 CRITICAL**. Use table for tracking granular fix items; use MASTER §1 for count.)

## 4. MAJOR findings (reconciled: 16)

| ID | Type | Details | Status |
|----|------|---------|--------|
| M-01 | Definition drift | `books.ts` uses "six transition patterns" vs canonical "six types" | open |
| M-02 | Definition drift | `etf-core` `books.ts` Motion TOC uses unregistered ™ on component names | open |
| M-03 | Citation drift | Brewer short-form varies (`&` / `, and` / `et al.`) across surfaces | open |
| M-04 | Citation drift | ETF research pages ship 7-citation evidence base beyond canonical's 3 | open — canonical-expansion |
| M-05 | Copy drift | ETF `/about` founder bio matches no canonical template | open |
| M-06 | Copy drift | 6i homepage 4-item "what this is not" shipped as 2-item | open |
| M-07 | Copy drift | 6i `/professionals` subhead swaps "systems failure"→"identity crisis" | open |
| M-08 | Infrastructure | Fonts split: 6i=General Sans, ETF=Inter | open |
| M-09 | Infrastructure | AntD icons on both sites; canonical requires Lucide | open — canonical-expansion |
| M-10 | Infrastructure | 6i `favicon.ico` declared but missing; ETF favicon set SVG-only | open |
| M-11 | Infrastructure | No shared brand-mark asset repository | open |
| M-12 | Infrastructure | ETF footer cross-link uses `?ref=etfframework` instead of canonical UTM triple | open |
| M-13 | Voice | ETF homepage hero ~5/10 vs canonical 2/10 | open |
| M-14 | Voice | 6i `/professionals` CTA keeps cert flow on 6i instead of linking to ETF | open — architectural |
| M-15 | Infrastructure | etf-core `priceMap.ts` implementer_cert successUrl still on 6i (transitional TODO) | open |
| M-16 | Copy drift | 6i footer cross-link copy paraphrased from canonical practitioner framing | open |

## 5. MINOR findings (8)

| ID | Resource | Details |
|----|----------|---------|
| N-01 | Font preload | next/font delegation vs explicit `<link rel="preload">` on both sites |
| N-02 | Icon stroke | 6i `ShareCard.tsx:342` uses `strokeWidth="2"` (canonical: 1.5) |
| N-03 | Terminology | "six transition patterns" / "six 6 Identities patterns" (book copy) |
| N-04 | Citation typography | Typographic `'` in `Hercules'` vs canonical straight `'` |
| N-05 | Compound code | Canonical example uses `PF-AU-XUA`; `PF` not in shipped CP/MI/SE/SI/AN/CA codes |
| N-06 | Caps | 6i `/professionals` H1 title-case vs canonical sentence-case |
| N-07 | Trademark | ETF hero omits `ETF™` mark |
| N-08 | Trademark | ETF footer omits `®` on "6 Identities" cross-link |

## 6. Canonical-expansion candidates (10)

(From MASTER §6 — canonical should absorb shipped reality rather than force site rewrites.)

- [ ] Six-type taxonomy → adopt Compass/Mirage/Sentinel/Signal/Anchor/Catalyst
- [ ] Five Core Code archetypes → adopt whichever variant wins 6i internal resolution
- [ ] Eight-component branded names → document clinical ↔ branded mapping
- [ ] Analytics shared-namespace pattern → canonical drops `[site]_` prefix requirement
- [ ] Evidence base expansion (Lochbaum / Haslam / Sheldon & Elliot / Gollwitzer / Wood & Neal / Volkow; decide on Brewer & Cornelius 2001)
- [ ] Iconography library → adopt AntD or mandate Lucide migration
- [ ] `/for-practitioners` → `/professionals` URL update
- [ ] Compound code example → fix stale `PF` pattern code
- [ ] `faqPageSchema` factory in etf-core → explicit ban + removal
- [ ] Brand-asset distribution → document etf-core-package pattern (not monorepo submodule)

## 7. Human-decision items (10)

(From MASTER §7 — audit does not recommend a direction.)

- [ ] Canonical six-type taxonomy vs shipped taxonomy (cascades through 82+ 6i files)
- [ ] 6i Core Code internal conflict: Sovereign-set (TypeScript) vs Autonomous-set (knowledgebase/methodology)
- [ ] Non-canonical ™ marks (The Build™, The Dashboard™, …) legitimate or overclaiming?
- [ ] Practitioner portal: $19.99/mo (canonical) or $49/mo (etf-core)? Check live Stripe
- [ ] `implementer_cert` success flow: stay on 6i or move to ETF?
- [ ] Brewer & Cornelius (2001) on 6i `/guide` sanctioned or stale?
- [ ] FAQPage schema — reconcile canonical ban with shipped dual-site use
- [ ] AntD vs Lucide migration
- [ ] Shared body font — General Sans, Inter, or third option?
- [ ] 6i footer legal disclaimer — canonical or site-specific?

## 8. Pointers

- Audit spec: `./audit0419/audit-shared-ecosystem-v3.md`
- Master report: `./audit-reports/MASTER-SHARED-AUDIT-REPORT.md`
- Canonical files:
  - `~/.claude/skills/etf-brand-shared/references/canonical-definitions.md`
  - `~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md`
  - `~/.claude/skills/etf-brand-shared/references/shared-assets.md`
  - `~/.claude/skills/etf-brand-shared/references/skill-orchestration.md`
  - `~/.claude/skills/etf-brand-messaging/references/trademark-placement.md`
- 6i tokens: `~/.claude/skills/etf-brand-design/references/tokens-6identities.md`
- ETF tokens: `~/.claude/skills/etf-brand-design/references/tokens-etfframework.md`
- `/harden` note: Batch 4 ETF-footer-cross-link CRITICAL → MAJOR demotion applied in MASTER §1; Batch 4 report retains pre-correction tally for audit-trail integrity.
