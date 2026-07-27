# Master Shared-Ecosystem Corrections — Execution Plan

**Status:** IN PROGRESS (Waves A + B closed; C/D/E open).
**Last updated:** 2026-04-19
**Source of truth:** this file. Do not re-derive from the frozen batch reports (`./batch-[1-5]-shared-audit.md`). Do not re-run the audit — `./EXECUTION-PLAN.md` is closed. All canonical decisions locked in Phase A are immutable in future waves.

**Canonical patches directory** (authoritative home — absolute path, resolves from any repo): `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/`. Current patch: `2026-04-phase-a.md`. New patches land here only. See §1.2 for precedence and §12 for full pointer set.

## 0. Purpose and relationship to EXECUTION-PLAN.md

| File | Tracks | Status | Resume pointer |
|---|---|---|---|
| `EXECUTION-PLAN.md` | Audit batches 1–5 (discovery) | **CLOSED** 2026-04-19 | `nextBatch` → none |
| `MASTER-SHARED-AUDIT-REPORT.md` (this file) | Correction waves A–E (fixes) | **IN PROGRESS** | `nextWave` → C |

"Wave" and "Phase" are interchangeable labels. CHANGELOG, canonical patch, and memory use "Phase"; this plan uses "Wave" to match the `nextWave` resume pointer read by the `handoff` skill.

## 1. Skill-Routed Execution Contract

Future execution **must** route through the Impeccable skills below. These are not decorative — they exist to keep canonical compliance, shared-repo integrity, and cross-repo continuity intact across operators and sessions.

### 1.1 Required skills (Impeccable plugin)

| Skill | Invocation | Purpose |
|---|---|---|
| Distill | `/impeccable:distill` | Strip a wave to essence at wave start. Confirm the minimum set of edits; remove scope creep. |
| Audit | `/impeccable:audit` | Pre-edit technical-quality baseline per repo (a11y, perf, theming, anti-patterns). Gates propagation. |
| Adapt | `/impeccable:adapt` | Context-register switching between canonical / shared-package / consumer-site / llms / governance surfaces. |
| Harden | `/impeccable:harden` | Production-readiness stress test for any change that could introduce downstream drift — canonical, shared lib, analytics, SEO, UTMs, schema, pricing, cross-site links, llms.txt. |
| Optimize | `/impeccable:optimize` | Consolidate and tighten before finalizing shared-package propagation or repeated cross-repo edits. |
| Critique | `/impeccable:critique` | UX / hierarchy / cognitive-load review before marking a wave item done. |
| Layout | `/impeccable:layout` | Spacing, visual rhythm, and document structure on plan edits, wave entries, handoff records. |
| Typeset | `/impeccable:typeset` | Typographic hierarchy and readability on documentation changes. |
| Polish | `/impeccable:polish` | Final alignment / spacing / consistency pass on written wave deltas and summaries. |
| Impeccable | `/impeccable:impeccable` | Terminal quality gate before wave close. |

Short forms (`/harden`, `/audit`, etc.) are acceptable invocations; the namespaced form above is canonical in this document.

### 1.2 Compliance mandate

Every wave execution must remain compliant with, in this order of precedence:

1. **User instructions** (including AGENTS.md, project rules, and direct session directives).
2. **Canonical decisions** from patches in `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/` (relative: `../docs/canonical-patches/`). This is the **only** directory that holds canonical patches; they are date-stamped (`YYYY-MM-phase-{letter}.md`). Current members:
   - `2026-04-phase-a.md` — Phase A resolution of the ten human-decision items (see §"The ten locked decisions"). **Immutable; not re-litigable.**

   Future canonical patches land in this directory with matching naming. Operators reading MASTER from consumer repos (etfframework, ETFtestSite) during Waves C/D must resolve canonical pointers via the **absolute path above**, not the relative one.
3. **Shared references** at `~/.claude/skills/etf-brand-{shared,messaging,design}/references/*.md` after Phase A patch application.
4. **Project repo rules** — etf-core main is PR-protected; publish is CI-driven on `fix:`/`feat:` merge; never `git push origin main`; `fix(release):` is the recovery path for GitHub Packages E409 tombstones.
5. **Source-of-truth invariant** — wave state lives only in this file. Memory, batch reports, and session scratchpads are not wave state.

### 1.3 Subagent batching workflow (correction → verify → next)

The audit established parallel-subagent patterns for read-only work. This plan extends them with one operational upgrade for corrections: **subagents run corrections and verify each one via Playwright MCP before advancing to the next item.** Per-item verification replaces end-of-batch verification.

- **Parallel dispatch** — independent repo-local reads, inventory scans, OR corrections on disjoint files. Dispatch via `superpowers:dispatching-parallel-agents`. One agent per surface or per independent file scope.
- **Correction subagents** — authorized to edit repo source files within assigned scope, run the Playwright MCP probe that corresponds to the wave item, and return (a) diff summary, (b) probe output quoted verbatim, (c) wave-item ID the probe satisfies. Subagents must not advance to the next item until the current item's probe passes.
- **Main session** — dispatches correction subagents, reconciles their outputs into §4 via Edit, handles single-file low-blast-radius edits (with its own probe), and owns **all** writes to this file. Never delegate MASTER edits.
- **Per-repo batches** — consumer propagation bundles by repo (Wave C = etfframework session; Wave D = ETFtestSite session). Do not interleave C and D in the same session — shared analytics events risk double-resolution.
- **Coordinated separate wave** — llms.txt rollout (Wave E) gates on C and D closing; its verification is `curl -f` on deploy URL + source grep (no DOM).
- **Central recording** — wave state flows to §3 + §4 via main-session Edit only after probe evidence is cited. Subagent outputs are transient.
- **Subagent restrictions** — subagents must not (a) reopen closed audit batches, (b) override canonical decisions, (c) flip a status box without Playwright-passing evidence in the reconciled output, (d) write to MASTER directly, or (e) batch multiple corrections and verify once at the end — each correction verifies before the next begins.

## 2. How to Execute Each Wave

The routing below is the operational playbook. Every remaining wave follows this sequence unless the wave body overrides a step.

### 2.1 Wave lifecycle

| Step | Skill / action | Scope | Gate |
|---|---|---|---|
| 1. Open | `/impeccable:distill` on wave entry | Once per wave | Minimum-edit set confirmed; TASKS.md written at active repo |
| 2. Baseline | `/impeccable:audit` on target repo | Once per wave | Pre-edit state captured to `{repo}/audit-reports/pre-wave-{X}.md` |
| 3. Register | `/impeccable:adapt` | On every surface switch | Register noted (6i ~6/10 / ETF ~2/10 / llms facts-only); canonical refs re-read for the surface |
| **4. Correct** | Subagent edits per wave item | **Per item** | Edit lands; diff summary captured |
| **5. Verify** | **Playwright MCP probe** | **Per item** | **Probe passes → flip `[x]` with probe citation. Fail → revert or iterate. Do not advance to the next item.** |
| 6. Harden | `/impeccable:harden` | Per sub-batch | Edge-case sweep (long/short/empty, i18n, RTL, network fail, permission) on the sub-batch as a whole — catches what per-item probes miss |
| 7. Optimize | `/impeccable:optimize` | Per sub-batch | Consolidation pass before next sub-batch or wave close |
| 8. Critique | `/impeccable:critique` | Per wave | UX / hierarchy / emotional-resonance review on items flagged "critique required" in the wave body |
| 9. Document | `/impeccable:layout` + `/impeccable:typeset` | Per documentation edit | Quality pass on MASTER edits, TASKS.md, CHANGELOG, handoff records |
| 10. Polish | `/impeccable:polish` | Per wave | Close-phase consistency pass on all written deltas |
| 11. Gate | `/impeccable:impeccable` | Terminal | Wave close; only after this may §3 `nextWave` advance |

Steps 4–5 form the inner loop: correct one item, verify one item, then move to the next. Steps 6–7 apply to sub-batches (infrastructure sweep, content sweep) after every item in the sub-batch has individually passed Step 5. Steps 8–11 run once at wave close in the main session.

### 2.2 Batching playbook

- **Wave open**: single main-session turn runs `/impeccable:distill` + `handoff` writes `TASKS.md` at active repo root. Do not fan out before scope is distilled.
- **Baseline read-phase**: dispatch up to three Explore subagents in parallel for multi-surface waves (one agent per surface — e.g. `/methodology`, `/certification`, `/portal` for Wave C). Each returns a terse evidence report; main session consolidates.
- **Correction loop (the inner loop, per wave item)**:
  - **Single-file / low-risk item** → main session edits directly, then runs its own Playwright probe, then flips `[x]` citing the probe output.
  - **Multi-file / content-sweep item** → dispatch one correction subagent owning **both** the edit and the Playwright verification for that item. Subagent returns `{diff, probe_output, wave_item_id}` and stops. Main session reconciles into §4.
  - **Independent items on disjoint files** → correction subagents may run in parallel, but each one must verify its own item before returning. Never batch multiple edits with a single end-of-run verification.
  - **Cross-repo items** (etf-core + consumer) → never parallel. Ship etf-core first (shared-package invariant), verify published, then consumer.
  - **Probe failure** → subagent reports the failure with the probe output quoted; main session decides revert vs iterate. Never advance to the next item on a red probe.
- **Harden-phase** (per sub-batch): `/impeccable:harden` runs against the sub-batch after every item has individually passed Step 5 — catches cross-item edge cases (long text in one item breaking layout in another, UTM encoding affecting cross-link in another, etc.). May dispatch one harden subagent per repo in parallel when C and D are running concurrently across sessions.
- **Optimize-phase** (per sub-batch): `/impeccable:optimize` before moving to the next sub-batch. Verify no regression against the baseline from Step 2.
- **Close-phase**: main session only. Critique + layout + typeset + polish + impeccable run in-session so final state lands in MASTER without round-trip risk.

### 2.3 Non-negotiables

- Every `[ ]` → `[x]` flip **must** cite verification evidence appended to the wave-item line after `—`: for DOM items the Playwright probe shape (e.g. *"verified @ localhost:3001/methodology, 1920×1080 + 768×1024 + 375×667, `document.querySelector('[data-testid=scope-of-practice]').textContent.startsWith(...)` → pass"*); for code-only items test / grep / build output + commit SHA. No status flips from assumption.
- Subagents verify each correction before returning. Batching N corrections with 1 end-of-run verification is banned.
- Canonical decisions from Phase A do not reopen. New evidence files under §10 Deferred; does not mutate §4.A / §4.B / §8 / §9.
- Subagents never edit MASTER. Return structured reports; main session reconciles.
- Frozen audit evidence (`batch-[1-5]-shared-audit.md`, `../audit0419/audit-shared-ecosystem-v3.md`) is read-only forever.
- **Playwright MCP is the verification tool** for every DOM-observable correction. Ports 3000 (ETFtestSite) and 3001 (etfframework) are reserved for the local dev servers the probes hit. If the dev server isn't running, Step 5 cannot complete — the correction does not flip `[x]`.

## 3. Current state

- **Last completed wave:** **B** — etf-core propagation shipped as v1.1.1 (v1.1.0 tombstoned by GitHub Packages E409).
- **Next wave:** **C** (ETF site — etfframework.com). May run in parallel with Wave D (6i site) when each session stays in its own repo; they share a consumer-bump prereq (etf-core ≥ v1.1.1) but no ordering dependency.
- **Open blockers:** none for C/D/E execution. Four Phase-A-deferred items tracked in §10 (USPTO trademark check, live Stripe pricing, General Sans license scope, descriptor backfill); none block wave execution.
- **Wave F (Content Boundary):** PLANNED. See §4.F. Does NOT block C/D/E. Runs after C + D close (or in parallel in a separate session). Full plan at `/Users/dangelor.palladinolckroomr/.claude/plans/ultrathink-i-have-3-scalable-candy.md`.
- **Active repos:**
  - shared: `/Users/dangelor.palladinolckroomr/Code/etf-core` — `@dangelopalladino/etf-core` v1.1.1 (published; CI publish-on-merge)
  - ETF: `/Users/dangelor.palladinolckroomr/Code/etfframework` — etfframework.com
  - 6i: `/Users/dangelor.palladinolckroomr/Code/ETFtestSite` — 6identities.com
- **Reconciled finding counts (post-Phase-A):** 30 CRITICAL / 16 MAJOR / 8 MINOR.
- **Next exact action** (read this field first on resume): **Open Wave C in the etfframework repo (cwd `/Users/dangelor.palladinolckroomr/Code/etfframework`). Run `/impeccable:distill` on §4.C. Run `/impeccable:audit` → `audit-reports/pre-wave-c.md`. Start dev server on `:3001`. Execute C.0 (consumer bump) first — main session edit, Playwright probe per §4.C probe shape, flip `[x]` with citation. Then dispatch a correction subagent for C.9 (smallest DOM-observable item: remove `faqPageSchema` call) as the first inner-loop iteration to validate the correction→verify→next pattern end-to-end before fanning out.**

## 4. Waves

### 4.A — Canonical resolution (no code, human decision) — **SEALED**

Repo: `~/.claude/skills/etf-brand-shared/`. Shipped 2026-04-19. Patch at `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/2026-04-phase-a.md` (relative: `../docs/canonical-patches/2026-04-phase-a.md`). All ten human-decision items resolved.

- [x] A.1 Six-type taxonomy → Compass / Mirage / Sentinel / Signal / Anchor / Catalyst
- [x] A.2 Five Core Code archetypes → Autonomous / Servant / Competitor / Connector / Creator
- [x] A.3 Eight-component names → branded first, clinical in parens on first use per page
- [x] A.4 Analytics naming → shared namespace; site segmentation at GA4 data-stream level
- [x] A.5 Portal price → $49/month (canonical catches up to etf-core; etf-core unchanged)
- [x] A.6 Implementer flow → moves to ETF; 6i redirect
- [x] A.7 Research citations → all seven shipped additions sanctioned
- [x] A.8 FAQPage schema → banned at markup level; FAQ content stays
- [x] A.9 Iconography → AntD Outlined canonical; Lucide retired
- [x] A.10 Body font → General Sans on both sites
- [x] A.11 Bonus: `/for-practitioners` → `/professionals` canonicalized
- [x] A.12 Bonus: compound-code example `CP-AU-XUA` confirmed

**Do not reopen.** Any challenge to A.1–A.12 files under §10 Deferred with explicit evidence — it does not unflip checkboxes here.

### 4.B — etf-core propagation — **SEALED**

Repo: `/Users/dangelor.palladinolckroomr/Code/etf-core`. Shipped 2026-04-19 as v1.1.1 (see `../CHANGELOG.md`).

- [x] B.1 `ECOSYSTEM_EVENTS` + `EcosystemEventName` exported from `src/analytics/events.ts`
- [x] B.2 `withUtm(href, source, campaign)` helper in `src/utils/withUtm.ts`
- [x] B.3 `faqPageSchema()` deprecation — `@deprecated` + dev-mode `console.warn`
- [x] B.4 `src/commerce/priceMap.ts` — no change (was correct at $49/mo)
- [~] B.5 Core Code archetype TypeScript rename — **deferred to Wave D.11** (type lives in `ETFtestSite/src/types/index.ts`)
- [x] B.6 `src/content/books.ts` — "patterns" → "types" (3 occurrences)
- [x] B.7 `src/tokens/shared.ts` — new `fonts` export → General Sans + JetBrains Mono
- [x] B.8 Release — v1.1.0 tombstoned (E409); republished as v1.1.1 via `fix(release):` bump
- [x] B.9 Post-B verification: BrandCta nested-anchor fix already shipped in v1.0.7 / v1.1.0 / v1.1.1 (commit `2d79886`)

### 4.C — ETF site propagation (etfframework.com)

Repo: `/Users/dangelor.palladinolckroomr/Code/etfframework`. Runs in its own session from that repo's root. Main-session orchestration; Explore subagents permitted for parallel page baselines.

**Execution method for Wave C** (correction → Playwright verify → next):
- **Open:** `/impeccable:distill` on this entry → `handoff` writes `etfframework/TASKS.md` listing unchecked items with their probe specs.
- **Baseline:** `/impeccable:audit` of etfframework at HEAD → save to `etfframework/audit-reports/pre-wave-c.md`. Start dev server on `:3001`. Dispatch up to 3 Explore subagents in parallel for `/methodology`, `/certification`, `/portal` inventories (read-only).
- **Register:** `/impeccable:adapt` — ETF institutional ~2/10. Re-read `~/.claude/skills/etf-brand-messaging/references/trademark-placement.md` before any copy edit (C.1, C.6, C.7) and before hero ™ restoration.
- **Inner loop:** dispatch correction subagents **one wave item at a time** (or in parallel across disjoint files). For each: subagent edits → runs Playwright MCP probe at `localhost:3001` → returns diff + probe output. Main session reconciles into §4 and flips `[x]` with probe citation. Do not advance to the next item on a red probe.
- **Per-item probe shapes** (subagent MUST execute these before returning):
  - C.0 (bump): `require('@dangelopalladino/etf-core/package.json').version === '1.1.1'` + `npm ls withUtm ECOSYSTEM_EVENTS fonts` resolves.
  - C.1 (scope-of-practice): `playwright:browser_navigate(/methodology)` → `browser_snapshot` → assert `[data-testid=scope-of-practice]` present above-the-fold at 1920×1080, 768×1024, 375×667; same probe on `/certification` and `/portal`. Text startsWith canonical opener.
  - C.2 (Schlossberg citation): navigate `/methodology`, assert `page.getByText('Schlossberg')` visible; assert `references` section list length +1 vs baseline.
  - C.3 (Matveyev + Bompa): same pattern on `/methodology` and `/methodology/90-day-cycle`; Brewer short-form uses `&`.
  - C.4 (proof block): assert 51-word block under founder section; word-count probe in `browser_evaluate`.
  - C.5 (15-item list): assert `li` count inside "what this is not" section == 15; snapshot at 375×667 for layout sanity.
  - C.6 (hero rewrite): assert H1 matches canonical copy exactly; `ETF™` mark present; `Become ETF Certified — $99` CTA visible. Cross-viewport `probeC_count` (`a button, a [role="button"]`) === 0.
  - C.7 (founder bio): word-count matches one of three templates; research paragraph is in a separate `section`.
  - C.8 (UTM): footer link `href` contains `utm_source=etfframework&utm_medium=cross_brand&utm_campaign=footer`; `?ref=etfframework` absent anywhere on page.
  - C.9 (FAQPage removal): `browser_evaluate(() => document.querySelector('script[type="application/ld+json"]').textContent)` does not include `"@type":"FAQPage"`; FAQ text still renders.
  - C.10 (General Sans): computed `fontFamily` on `body` contains `General Sans`; Inter absent.
  - C.11 (favicon set): `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="icon" sizes="512x512">`, `/favicon.ico` HTTP 200 via `browser_network_requests`.
  - C.12 (OG route): navigate a sample slug; `browser_evaluate` reads `<meta property="og:image">`; hit the URL directly → 200; unknown-slug → graceful default; emoji-slug URL-encodes.
- **Harden** (after sub-batch passes): `/impeccable:harden` on infrastructure batch (C.9–C.12) and on content batch (C.1–C.8) separately — cross-item stress beyond per-item probes.
- **Optimize:** `/impeccable:optimize` between batches; verify no regression against baseline.
- **Critique:** `/impeccable:critique` on C.6 (hero) and C.7 (founder bio) before flipping — hierarchy / emotional resonance / cognitive load.
- **Close:** `/impeccable:polish` + `/impeccable:impeccable` in main session.

**Consumer bump prereq:**
- [ ] C.0 Bump `@dangelopalladino/etf-core` to `^1.1.1`; `npm install`; verify `ECOSYSTEM_EVENTS`, `withUtm`, and `fonts` imports resolve.

**Content fixes:**
- [ ] C.1 Install canonical scope-of-practice verbatim above the fold on `/methodology`, `/certification`, `/portal` (closes C-20, reconciles C-21 ETF portion). Harden: confirm section stays above-the-fold at 320px viewport.
- [ ] C.2 Add Schlossberg (1981) citation to `/methodology` (closes C-22).
- [ ] C.3 Add Matveyev (1977) + Bompa & Buzzichelli (2019) to `/methodology` and `/methodology/90-day-cycle` (closes C-23). Typeset: standardize Brewer short-form to canonical `&` (closes M-03 ETF portion).
- [ ] C.4 Install "Built by someone who went through it" 51-word proof block on `/methodology` founder section (closes C-25).
- [ ] C.5 Install 15-item "what this is not" list on `/methodology` (closes C-26). Layout: 15 items at intensity ~2/10 — no decorative side-stripes; restrained spacing.
- [ ] C.6 Rewrite `/` homepage hero to canonical ("Sports psychology treats athletes during competition. ETF™ treats them after."); intensity ~5/10 → 2/10; restore `ETF™` mark + `Become ETF Certified — $99` CTA (closes C-34, M-13, N-07). Harden: long German translation, emoji smoke-test, RTL.
- [ ] C.7 Rewrite `/about` founder bio to one of three canonical templates; move research-synthesis paragraph to a separate section (closes M-05). Critique before marking done.
- [ ] C.8 Replace `?ref=etfframework` footer attribution with `withUtm(...)` canonical UTM triple (`utm_source=etfframework`, `utm_medium=cross_brand`, `utm_campaign=footer`); rewrite cross-link copy to canonical line (closes M-12, M-16).

**Infrastructure fixes:**
- [ ] C.9 Remove `faqPageSchema(...)` call from `/faq/page.tsx` + FAQ component; retain FAQ content (closes C-06). Harden: confirm no other JSON-LD block references `FAQPage`.
- [ ] C.10 Migrate body font → General Sans via etf-core v1.1.1 `fonts` token (closes M-08); retire Inter. Typeset: verify hierarchy stays crisp at new stack.
- [ ] C.11 Ship full favicon set: apple-touch-icon, icon-512, `favicon.ico` (closes M-10 ETF portion).
- [ ] C.12 Implement `/api/og/[slug]` route for per-page OG images (closes C-31 ETF portion). Harden: 404 slug → graceful default OG; emoji in slug → URL-encode.

### 4.D — 6i site propagation (6identities.com)

Repo: `/Users/dangelor.palladinolckroomr/Code/ETFtestSite`. Runs in its own session. Main-session orchestration; Explore subagents permitted for parallel inventories.

**Execution method for Wave D** (correction → Playwright verify → next):
- **Open:** `/impeccable:distill` → `handoff` writes `ETFtestSite/TASKS.md`.
- **Baseline:** `/impeccable:audit` at HEAD → save to `ETFtestSite/audit-reports/pre-wave-d.md`. Start dev server on `:3000`. Dispatch Explore subagents in parallel for `/` homepage, `/professionals`, `/guide` inventories (read-only).
- **Register:** `/impeccable:adapt` — 6i editorial ~6/10. Re-read `trademark-placement.md` — 6i is where C-28 `<TM />` leak lives and where `The Six™` Level-2 term is on a Level-0 surface.
- **Inner loop:** correction subagents run one item at a time (parallel only across disjoint files). Each: edit → Playwright probe at `localhost:3000` → diff + probe output. Main session reconciles into §4 and flips `[x]` with probe citation. **Sequencing:** D.0 (bump) → D.11 + D.12 (TS types — must ship before any surface consumes `CoreCodeArchetype`) → content D.1–D.10 → infrastructure D.13–D.17.
- **Per-item probe shapes** (subagent MUST execute before returning):
  - D.0 (bump): etf-core version === 1.1.1; imports resolve.
  - D.1 (hero rewrite): H1 === canonical "It's 10 a.m. on a Tuesday…"; `The Six™` subhead absent; cross-viewport snapshot.
  - D.2 (`<TM />` bug): `browser_evaluate(() => document.body.innerText.match(/trademark(?!™)/g))` → null on every page that uses `<TM />`; grep every `<TM>` consumer; snapshot per consumer in `tests/ui/tm-*.spec.tsx`.
  - D.3 (proof block): word-count 51 in homepage Section 6.
  - D.4 (4-item list): `li` count inside "what this is not" === 4; baseline was 2.
  - D.5 (scope-of-practice reconciliation): same canonical text on Footer / disclosures / FAQ / cert terms — `browser_evaluate` collects all four and asserts string equality.
  - D.6 (Brewer citation): navigate `/guide`, assert canonical format with `&` + straight `'`.
  - D.7 (`/professionals` subhead): contains "systems failure"; does not contain "identity crisis".
  - D.8 (CTA alignment): certification CTA on `/professionals` points to etfframework.com with canonical UTM triple; redirect + UTM propagation probed via `browser_network_requests`.
  - D.9 (sentence case): H1 matches `/^[A-Z][^A-Z]*$/` pattern (first-word-only capitalization).
  - D.10 (® in footer): footer cross-link includes `®` glyph.
  - D.11 (TS rename): `grep -r 'Sovereign\|Guardian\|Rival\|Bonded\|Pioneer' src/ tests/` → zero matches outside a retirement comment; tests pass; build green.
  - D.12 (six-type TS): `import { IdentityType } from 'src/types'` resolves Compass/Mirage/Sentinel/Signal/Anchor/Catalyst.
  - D.13 (FAQPage removal): same probe shape as C.9 on both FAQ components.
  - D.14 (UTM on cross-links): Footer ETF link + `/careers` link both contain canonical triple; `?ref=etfframework` absent.
  - D.15 (`favicon.ico`): `/favicon.ico` HTTP 200.
  - D.16 (OG route): same shape as C.12.
  - D.17 (`/for-practitioners` redirect): `browser_navigate('/for-practitioners')` → final URL ends with `/professionals`; 307 or 308 status.
- **Harden** (per sub-batch): `/impeccable:harden` on types-batch (D.11, D.12), content-batch (D.1–D.10), infra-batch (D.13–D.17).
- **Optimize:** `/impeccable:optimize` after D.11 — dead-reference sweep, import consolidation.
- **Critique:** `/impeccable:critique` on D.1 + D.7.
- **Close:** `/impeccable:polish` + `/impeccable:impeccable`.

**Consumer bump prereq:**
- [ ] D.0 Bump `@dangelopalladino/etf-core` to `^1.1.1`; verify imports.

**Content fixes:**
- [ ] D.1 Replace homepage hero copy with canonical ("It's 10 a.m. on a Tuesday…"); replace `The Six™` subhead (Level-2 term on a Level-0 surface) (closes C-27). Critique required.
- [ ] D.2 Fix `<TM />` component rendering bug — literal "trademark" word leaks adjacent to ™ (closes C-28). Harden: exhaustive grep for every `<TM>` consumer; snapshot test per consumer.
- [ ] D.3 Install "Built by someone who went through it" proof block in homepage Section 6 (closes C-24).
- [ ] D.4 Restore 4-item "what this is not" list on homepage (currently 2-item) (closes M-06).
- [ ] D.5 Reconcile scope-of-practice paraphrase variants across Footer / disclosures / FAQ / cert terms → verbatim canonical block (closes C-21 6i portion).
- [ ] D.6 Fix "Brewer and Cornelius" citation format on `/guide` — Phase A.7 sanctioned it; update format to canonical (closes C-30). Typeset: straight apostrophe, canonical `&` short-form (closes N-04 + N-03).
- [ ] D.7 Rewrite `/professionals` subhead — restore canonical "systems failure" (currently "identity crisis"); align voice to canonical register (closes M-07).
- [ ] D.8 Align `/professionals` certification CTA with etfframework.com per A.6 (implementer-flow-moves-to-ETF) (closes M-14, M-15). Harden: verify redirect path, UTM propagation.
- [ ] D.9 `/professionals` H1 → sentence case (closes N-06).
- [ ] D.10 Add `®` to "6 Identities" cross-link text in footer (closes N-08).

**TypeScript types (Wave B.5 deferred here):**
- [ ] D.11 Rename `CoreCodeArchetype` in `src/types/index.ts`: Sovereign/Guardian/Rival/Bonded/Pioneer → Autonomous/Servant/Competitor/Connector/Creator per A.2 (closes C-16, C-17, C-18). Harden: grep every downstream consumer, tests, and fixtures. Optimize after.
- [ ] D.12 Confirm six-type TS types ship Compass/Mirage/Sentinel/Signal/Anchor/Catalyst per A.1 (closes C-13).

**Infrastructure fixes:**
- [ ] D.13 Remove `faqPageSchema(...)` calls from `/faq/page.tsx` + both FAQ components (closes C-05).
- [ ] D.14 Add `withUtm(...)` to outbound cross-site links in Footer (→ ETF + → `/careers`) (closes C-07, C-08).
- [ ] D.15 Add missing `favicon.ico` (declared but absent) (closes M-10 6i portion).
- [ ] D.16 Implement `/api/og/[slug]` route for per-page OG images (closes C-31 6i portion).
- [ ] D.17 Add redirect `/for-practitioners` → `/professionals` (closes C-29).

### 4.E — llms.txt rollout (both sites)

Gated on Waves C and D closing. Runs as a separate coordinated wave — do not merge into C or D sessions.

**Execution method for Wave E:**
- Open: `/impeccable:distill` on this entry. The minimum set is two committed files + one CI probe.
- Register: `/impeccable:adapt` — llms.txt is a governance surface; neither editorial nor institutional register applies. Facts only, canonical template verbatim.
- Implement: E.1 and E.2 in parallel sub-sessions (one per site repo) — they share no mutable state. E.3 after both land.
- Harden: `/impeccable:harden` is required — `curl -f` probe at deploy URL, check no stale `/for-practitioners` reference in 6i template, no `$19.99/mo` in ETF template, no "operating system for athlete transition" phrase in 6i copy.
- Critique: N/A (facts-only surface).
- Polish + Impeccable: close-phase only on E.3 CI integration.

- [ ] E.1 Commit `ETFtestSite/public/llms.txt` using canonical template — post-A.1 type names, post-A.11 `/professionals` URL, no "operating system for athlete transition" phrase (closes C-01 6i, C-03).
- [ ] E.2 Commit `etfframework/public/llms.txt` using canonical template — post-A.3 branded+clinical component names, post-A.5 $49/mo portal price, retains "operating system for athlete transition" phrase (closes C-01 ETF, C-02, C-04).
- [ ] E.3 Add nightly CI probe (`curl -f https://{domain}/llms.txt`) for both domains; failure posts to the alerting channel of record.

### 4.F — Public Content Reduction & IP Protection (both sites + CI)

**Full plan:** `/Users/dangelor.palladinolckroomr/.claude/plans/ultrathink-i-have-3-scalable-candy.md`  
**Status:** PLANNED — not started. Does NOT block Waves C / D / E. Run after C + D close, or in parallel if a separate session handles each repo.  
**Scope:** Copy reduction + IP boundary enforcement. No scoring, auth, Stripe, portal, or design-system changes.  
**Rule:** Public = what it does, who it helps, why it matters, next step. Gated = how it works.

#### Background

Both consumer sites publicly expose protected framework mechanics. Public pages answer "How does the whole system work?" when they should only answer "Is this for me, do I trust it, and what do I do next?" This wave reduces public copy, replaces framework-teaching language with outcome language, and adds CI-enforced content-guard infrastructure to prevent re-bloat.

#### Key decisions (locked, do not re-derive)

- **type-profiles.ts approach:** Add `publicSummary` field (~80 words, marketing-safe) to each type entry. Public type pages render `publicSummary`. All existing fields (hook, longHook, overview, archetypes, Way Forward, formation data) are untouched — they feed the results engine, scoring logic, PDFs, and paid reports.
- **Implementer commercial terms:** Remove exact numbers ($2k–$5k, 70/30) from public page. Keep business model concept (Tier 2 license exists, revenue share favors implementer). Exact economics move behind inquiry/application.
- **CI guard phasing:** Report-only first (no failures). Clean the violations. Then harden to hard-fail for unambiguous leaks.

#### Execution method

- **Open:** `/impeccable:distill` on this entry → write `TASKS.md` at active repo root.
- **Baseline:** `/impeccable:audit` at HEAD → save to `{repo}/audit-reports/pre-wave-f.md`.
- **Inner loop:** same correction → Playwright verify → next pattern as Waves C and D. Each item must pass its probe before advancing.
- **Repos:** etfframework first (Phase F.1), ETFtestSite second (Phase F.2), CI infrastructure last (Phase F.3).
- **Canonical compliance:** Wave F copy must respect Phase A canonical decisions (trademark placement, Core Code archetype names, six-type taxonomy). Re-read `trademark-placement.md` before any copy edit.
- **Hard constraints during F:** no scoring logic, no auth logic, no Stripe logic, no DB schema, no AntD replacement, no Tailwind color/typography, no route additions/removals, no disclaimer removal.

#### Per-item probe shapes

- F.0 (pre-flight): `grep -r 'Diagnose, Interpret, Guide' src/` → zero on public routes; build passes.
- F.etf.homepage: etfframework `/` renders 8 component names; EIGHT_COMPONENTS summaries contain no facilitation-procedure language; `browser_evaluate` `document.querySelector('meta[name=description]')` does not contain "eight components".
- F.etf.methodology.*: each sub-page (`/eight-components`, `/core-code`, `/90-day-cycle`) renders component names but no formula/phase-step/clinical-workflow detail; word count via `browser_evaluate(document.body.innerText.split(' ').length)` ≤ 400 per page.
- F.etf.value-and-impact: `browser_evaluate(document.body.innerText)` does not include `90837`, `90847`, `90853`, `Track A`, `Track B`, `ACT for`, `CBT for`.
- F.etf.certification: curriculum list renders ≤ 4 items (outcome statements only); scope-of-practice `[data-testid=cert-scope-of-practice]` still present.
- F.etf.implementer: page does not include `70`, `30`, `$2,000`, `$5,000`, `$500`, `$1,000` as rendered text; concept-level licensing language visible.
- F.6i.methodology: none of `DimensionsGrid`, `CoreCodeSection`, `CompoundCodeSection` render internal framework detail; no rendered text contains `6 × 5 × 8`, `CP-AU-XUA`, `MI-CN-ESA`, or any of the 8 dimension research-citation strings.
- F.6i.types.*: each type page renders `publicSummary` field (not `overview`); no Core Code archetype-per-type section visible; no Way Forward career/relationships/body/money subsections visible; original `type-profiles.ts` fields unchanged (grep confirms).
- F.6i.research: page body does not contain "eight-component model", "90-day cyclical architecture"; gated PDF CTA still present.
- F.seo.6i: homepage Quiz JSON-LD does not contain "Eight scored components mapped against six identity patterns".
- F.seo.etf: homepage meta description does not contain "Eight components, one cycled methodology".
- F.ci.guard: `content-guard.config.ts` exists in each repo; lint/typecheck/build pass; report-only mode confirmed (no hard failures yet from guard).

#### Phase F.1 — etfframework.com copy reductions

Repo: `/Users/dangelor.palladinolckroomr/Code/etfframework`. Dev server: `:3001`.

- [ ] F.1.1 Rewrite `EIGHT_COMPONENTS` summaries in `src/app/page.tsx` (lines 20–61) — outcome language, no operational definitions. Remove "Diagnose, Interpret, Guide" from DIG Method summary. Update meta description (line 16). Edit link text "Core Code interpretation system, and the DIG Method clinical workflow" → "the full methodology" (lines 186–192).
- [ ] F.1.2 Remove clinical integration section from `src/app/value-and-impact/page.tsx` (lines 110–140) — CPT codes, Track A/B labels, ACT/CBT mapping. Replace with: "ETF Certified Practitioners integrate the framework into their existing clinical or coaching practice. Clinical integration details are covered inside the certification curriculum."
- [ ] F.1.3 Simplify `curriculum` const in `src/app/certification/page.tsx` (lines 16–25) — 8-module list → 3–4 outcome statements. Preserve scope-of-practice disclaimer and `data-testid="cert-scope-of-practice"`.
- [ ] F.1.4 Compress `src/app/methodology/eight-components/page.tsx` — all descriptions → 10–15 word outcome phrases. Add closing line: "The full component curriculum is available inside certification."
- [ ] F.1.5 Simplify `src/app/methodology/core-code/page.tsx` — remove 5+3 formula and compound code mechanics. ~100-word outcome page with CTA to certification.
- [ ] F.1.6 Simplify `src/app/methodology/90-day-cycle/page.tsx` — remove phase-by-phase breakdown and habit-formation evidence mapping. Keep concept of 90-day cycle; gate details behind certification.
- [ ] F.1.7 Remove 8-systems enumeration from `src/app/our-approach/page.tsx`. Replace named-systems list with "the full range of documented transition challenges."
- [ ] F.1.8 Edit 2 Q&A entries in `src/app/faq/page.tsx` — remove "all eight systems" named list from differentiation answer; replace certification-include answer with outcome language.
- [ ] F.1.9 Remove exact commercial terms from `src/app/implementer/page.tsx` — replace $2k–$5k, 70/30, $500–$1k, and facilitator-training detail with qualified/gated language. Keep business model concept.
- [ ] F.1.10 Tighten `src/app/research/page.tsx` — compress executive summary; remove component-mapping language.

#### Phase F.2 — 6identities.com copy reductions

Repo: `/Users/dangelor.palladinolckroomr/Code/ETFtestSite`. Dev server: `:3000`.

- [ ] F.2.1 Edit SEO/JSON-LD in `src/app/page.tsx` (lines 45–68) — Quiz JSON-LD line 66: "Eight scored components mapped against six identity patterns" → "A self-reflection inventory for former athletes. Name the pattern, then take the next step." Remove "archetype and protocol products" from Organization description (line 48). Simplify feature card "Core Code Archetype" description (line 165 area) — remove "instruction set" language.
- [ ] F.2.2 Rewrite `src/components/methodology/DimensionsGrid.tsx` — replace 8-dimension list with teaser: "The assessment looks across the key areas that usually get disrupted after sport, then gives you a profile based on where the work is." (~30 lines replacing 73).
- [ ] F.2.3 Rewrite `src/components/methodology/CoreCodeSection.tsx` — replace 5-archetype definitions with teaser: "Your report also shows the deeper driver behind your pattern — the value system running underneath it." (~20 lines replacing 50).
- [ ] F.2.4 Remove or replace `src/components/methodology/CompoundCodeSection.tsx` — replace compound-code formula (6×5×8=240, CP-AU-XUA examples) with: "Your result connects multiple layers of your pattern into a single profile."
- [ ] F.2.5 Rewrite `src/components/methodology/AssessmentLayersSection.tsx` — remove "Assessment Architecture" framing and two-layer breakdown. Replace with outcome statement. (~20 lines replacing 71).
- [ ] F.2.6 Update `src/app/methodology/page.tsx` imports to match rewritten components. Minor tightening of `SystematicGapSection.tsx` — soften "Executable Transition Framework (ETF)" to keep credibility signal without full-name drilling.
- [ ] F.2.7 Add `publicSummary` field (~80 words, marketing-safe outcome language) to each of the 6 type entries in `src/lib/type-profiles.ts`. **Do not touch any existing field.** (F.2.8 depends on this.)
- [ ] F.2.8 Update `src/app/types/[slug]/page.tsx` — render `publicSummary` instead of `overview`/`hook`/`longHook`. Skip Core Code archetype-per-type section. Skip Way Forward (career/relationships/body/money) subsections. Add CTA: "Take the assessment to see your pattern." Verify results page still uses original full fields.
- [ ] F.2.9 Compress `src/app/research/page.tsx` — remove "eight-component model" + component list + "90-day cyclical architecture." Tighten executive summary to ~150 words. Keep gated PDF CTA.
- [ ] F.2.10 Minor edits: `src/components/about/MissionSection.tsx` (2 sentences), `src/app/premium/page.tsx` (1 edit: "instruction set" → "deeper driver"), `src/app/full-package/page.tsx` (2 edits: "cycled protocol" and "scores" language).

#### Phase F.3 — CI content-guard infrastructure (both repos)

- [ ] F.3.1 Create `ETFtestSite/content-guard.config.ts` — public routes, word budgets per route, restricted public terms (compound code, scoring logic, DIG Method, Block List per public, CPT codes, normalization formula, reverse scoring, protocol sequence, assessment weighting, compound-code, archetype pairing), allowed public terms, require-human-review terms. Report-only mode initially.
- [ ] F.3.2 Create `etfframework/content-guard.config.ts` — same structure. Public routes include `/`, `/methodology/*`, `/certification`, `/implementer`, `/our-approach`, `/value-and-impact`, `/research`, `/faq`. Gated routes include `/portal/*`, `/certification/guide`, `/implementer/guide`, `/admin/*`.
- [ ] F.3.3 Add `public-ip-guard` script to each repo's CI — scans public route source files + SEO metadata for restricted terms. Non-blocking (report-only) in first pass. Reference `OversharingCononicals.md` for rule categories.
- [ ] F.3.4 Add `public-copy-density-guard` script to each repo's CI — checks rendered-page word counts against `maxWordsByRoute` budget. Non-blocking first pass.
- [ ] F.3.5 After F.1 + F.2 violations are clean: promote unambiguous hard-fail rules (CPT codes on public pages, "Diagnose, Interpret, Guide" on public pages, compound code formula on public pages, budget exceeded by > 15%). Keep ambiguous terms (methodology, protocol, framework, dimensions) as warnings only.
- [ ] F.3.6 Add PR template checklist per `OversharingCononicals.md` §"PR template rule" to both repos' `.github/pull_request_template.md`.

---



Every row maps to a wave item. `Status` = `open` means still to fix; `CLOSED` means satisfied by a sealed wave.

| ID | Title | Site | Wave | Status |
|----|-------|------|------|--------|
| C-01 | llms.txt absent (live 404 + not in repo) | both | E.1 + E.2 | open |
| C-02 | llms.txt absent — ETF | ETF | E.2 | open |
| C-03 | llms.txt absent — 6i source | 6i | E.1 | open |
| C-04 | llms.txt absent — ETF source | ETF | E.2 | open |
| C-05 | FAQPage JSON-LD in active use — 6i | 6i | D.13 | open |
| C-06 | FAQPage JSON-LD in active use — ETF | ETF | C.9 | open |
| C-07 | 6i footer → ETF link missing UTM | 6i | D.14 | open |
| C-08 | 6i footer → ETF /careers missing UTM | 6i | D.14 | open |
| C-09 | No site-level UTM writer helper | both | — | **CLOSED** (B.2 — `withUtm` in v1.1.1) |
| C-10 | Analytics catalog missing `[site]_` prefix | shared/both | — | **CLOSED** (A.4) |
| C-11 | Missing `ecosystem_*_transition` events in etf-core | shared | — | **CLOSED** (B.1) |
| C-12 | Canonical six-type taxonomy not shipped | canonical | — | **CLOSED** (A.1) |
| C-13 | 6i ships undocumented six types | 6i | D.12 | open |
| C-14 | etf-core `books.ts` contradicts canonical | shared | — | **CLOSED** (B.6 + A.1) |
| C-15 | ETF `/our-network` Core Code adjacency | ETF | C.6 / C.1 | open (resolved via A.3 branded+clinical pattern) |
| C-16 | Five canonical Core Code archetypes absent | both | D.11 | open |
| C-17 | 6i Variant A Core Code (Sovereign-set) in TS | 6i | D.11 | open (rename to Autonomous-set) |
| C-18 | 6i Variant B Core Code in knowledgebase/methodology | 6i | D.11 | open (keep; retire Variant A) |
| C-19 | ETF methodology branded names not in canonical | ETF | — | **CLOSED** (A.3) |
| C-20 | Scope-of-practice absent from ETF methodology/cert/portal | ETF | C.1 | open |
| C-21 | Scope-of-practice paraphrase variants | both | C.1 + D.5 | open |
| C-22 | Schlossberg (1981) absent — ETF methodology | ETF | C.2 | open |
| C-23 | Matveyev (1977) + Bompa/Buzzichelli (2019) absent | ETF | C.3 | open |
| C-24 | "Built by someone who went through it" absent — 6i | 6i | D.3 | open |
| C-25 | "Built by someone who went through it" absent — ETF | ETF | C.4 | open |
| C-26 | 15-item "what this is not" absent — ETF methodology | ETF | C.5 | open |
| C-27 | 6i homepage hero matches "Incorrect" canonical example | 6i | D.1 | open |
| C-28 | "trademark" word leaking next to ™ in 6i hero | 6i | D.2 | open |
| C-29 | `/for-practitioners` returns 404 | 6i | D.17 | open (canonical updated via A.11; redirect still needed) |
| C-30 | "Brewer and Cornelius" citation variant on 6i `/guide` | 6i | D.6 | open (A.7 sanctioned; format fix) |
| C-31 | Per-page OG images absent | both | C.12 + D.16 | open |
| C-32 | etf-core `practitioner_portal` price vs canonical | shared | — | **CLOSED** (A.5) |
| C-33 | etf-core `faqPageSchema` factory enables banned schema | shared | — | **CLOSED** (B.3) |
| C-34 | ETF homepage hero drift + voice convergence | ETF | C.6 | open |

**Close-out accounting:** 9 of 30 closed by Waves A + B. 21 remain: 10 in C, 10 in D, 4 in E (C-01–C-04 shared between).

## 6. MAJOR findings (16)

| ID | Type | Details | Wave | Status |
|----|------|---------|------|--------|
| M-01 | Definition drift | `books.ts` "patterns" → "types" | — | **CLOSED** (B.6) |
| M-02 | Definition drift | etf-core `books.ts` unregistered ™ marks | §10 Deferred | deferred (USPTO) |
| M-03 | Citation drift | Brewer short-form varies | C.3 + D.6 | open (typeset to canonical `&`) |
| M-04 | Citation drift | ETF ships 7 citations beyond canonical's 3 | — | **CLOSED** (A.7) |
| M-05 | Copy drift | ETF `/about` founder bio | C.7 | open |
| M-06 | Copy drift | 6i "what this is not" 4→2 regression | D.4 | open |
| M-07 | Copy drift | 6i `/professionals` subhead swap | D.7 | open |
| M-08 | Infrastructure | Fonts split (6i General Sans, ETF Inter) | C.10 | open |
| M-09 | Infrastructure | AntD icons vs canonical Lucide | — | **CLOSED** (A.9) |
| M-10 | Infrastructure | Incomplete favicon sets | C.11 + D.15 | open |
| M-11 | Infrastructure | No shared brand-mark asset repo | §10 note | architectural — etf-core package model documented (Phase A bonus); no per-site action |
| M-12 | Infrastructure | ETF footer `?ref=etfframework` not canonical UTM | C.8 | open |
| M-13 | Voice | ETF hero ~5/10 vs canonical 2/10 | C.6 | open |
| M-14 | Voice | 6i `/professionals` CTA keeps cert on 6i | D.8 | open |
| M-15 | Infrastructure | etf-core `priceMap.ts` `implementer_cert` successUrl on 6i | D.8 | open (cross-site transition bundled with D.8) |
| M-16 | Copy drift | 6i footer cross-link copy paraphrased | D.14 / C.8 analog | open |

## 7. MINOR findings (8)

| ID | Resource | Details | Wave |
|----|----------|---------|------|
| N-01 | Font preload | next/font delegation vs explicit `<link rel="preload">` | C.10 + D-font |
| N-02 | Icon stroke | 6i `ShareCard.tsx:342` strokeWidth="2" vs 1.5 | D (icon polish) |
| N-03 | Terminology | "six transition patterns" in 6i book copy | D.6 (typeset) |
| N-04 | Citation typography | Typographic `'` in `Hercules'` vs straight | D.6 (typeset) |
| N-05 | Compound code | Canonical example `PF-AU-XUA` stale | — | **CLOSED** (A.12) |
| N-06 | Caps | 6i `/professionals` H1 title-case | D.9 |
| N-07 | Trademark | ETF hero omits `ETF™` | C.6 |
| N-08 | Trademark | ETF footer omits `®` on "6 Identities" cross-link | D.10 |

## 8. Canonical-expansion candidates — ALL RESOLVED (Wave A)

Twelve candidates from audit §6 absorbed by Phase A patch. Retained for traceability. **Do not reopen.**

- [x] Six-type taxonomy (A.1) · [x] Five Core Code archetypes (A.2) · [x] Eight-component branded names (A.3) · [x] Analytics shared namespace (A.4) · [x] Evidence base expansion (A.7) · [x] AntD iconography (A.9) · [x] `/for-practitioners` → `/professionals` (A.11) · [x] Compound-code example (A.12) · [x] `faqPageSchema` ban (A.8 + B.3) · [x] Brand-asset distribution via etf-core package (Phase A bonus) · [x] `<TM />` component contract (D.2 engineering scope) · [x] 6i footer legal disclaimer sanctioned site-specific (Phase A).

## 9. Human-decision items — ALL RESOLVED (Wave A)

Ten items from audit §7 decided in Phase A. See `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/2026-04-phase-a.md` §"The ten locked decisions." **Do not reopen.**

- [x] Six-type taxonomy (sites win) · [x] Core Code variant (Autonomous-set wins) · [x] ™ legitimacy → deferred (USPTO) · [x] Portal price $49 · [x] Implementer flow → ETF · [x] Brewer & Cornelius sanctioned · [x] FAQPage markup banned, content stays · [x] AntD canonical · [x] General Sans body font · [x] 6i footer legal disclaimer site-specific.

## 10. Deferred items (Phase A)

Acceptance-criteria-driven items from `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/2026-04-phase-a.md` §"Deferred items." None block C/D/E; ship as independent follow-ups.

- [ ] **Deferred.1 USPTO trademark check** — filing status of `The Build™ / Core Code™ / The Dashboard™ / The Block List™ / Moves™`. If unfiled/unfiled-pending, strip ™ until cleared. Also closes M-02.
- [ ] **Deferred.2 Live Stripe pricing verification** — Dashboard shows `practitioner_portal` at $49/mo, no coupon leakage, description matches canonical.
- [ ] **Deferred.3 General Sans license scope** — commercial license covers both root domains + any subdomains/apps; track renewal.
- [ ] **Deferred.4 Descriptor backfill** — promote Compass/Mirage/… and Autonomous/Servant/… descriptors from 6i repo into canonical, replacing "to be backfilled" placeholders.

## 11. Handoff & continuation contract

This section exists so `/clear`, cross-repo handoff, and the `handoff` skill work without drift.

### 11.1 Source of truth

`audit-reports/MASTER-SHARED-AUDIT-REPORT.md` in the etf-core repo is the only authoritative record of wave state. Not memory. Not TASKS.md. Not batch reports. Memory entries and TASKS.md files are ephemeral pointers **to** this file.

### 11.2 First read on resume

Read this file in this order:
1. **§3 Current state** — specifically the `Next exact action` bullet.
2. **§1.2 Compliance mandate** — refresh the precedence order.
3. **§4** entry for `nextWave` — distill scope.
4. **§2.1–§2.3** — confirm skill routing + batching rules still apply.
5. Only then open the target repo.

### 11.3 Recording conventions

- **Completed:** flip `[ ]` → `[x]` in §4, appending probe citation on the same line after `—`. Required forms:
  - *DOM items* — Playwright probe signature: `verified @ localhost:{port}{path}, viewports {list}, assertion `{quoted JS}` → pass, <commit SHA>`.
  - *Code-only items* — test / grep / build output + commit SHA: `verified via `npm test` → {N} passed, `grep -r 'Sovereign' src/` → 0, <commit SHA>`.
  - *Cross-site propagation / shared-package / analytics items* — PR URL + deploy URL + probe signature.
- **In-progress:** leave `[ ]`. If pausing mid-item, append a `Progress:` subline with the exact stopping point and the pending probe.
- **Blocked:** prepend item with `[BLOCKED: reason]` and add a row to §3 "Open blockers." Do not flip the box.
- **Probe failed:** do not flip. Append `Probe FAILED: <quoted output>` subline. Resolve by revert or iterate; retain the failure note even after resolution (append `Resolved:` subline).
- **Re-scope:** if an item turns out to be wrong, comment it out with `<!-- -->` preserving original; add replacement item below; reference the comment in a §3 footnote.

### 11.4 Next exact action

Always rewrite §3's `Next exact action` bullet at end-of-session to match the next operator-actionable step. Example format: *"Run `/impeccable:audit` in `/Users/…/etfframework`; capture output to `audit-reports/pre-wave-c.md`; then execute C.0 consumer bump."*

### 11.5 Pre-`/clear` refresh checklist

Run this checklist before `/clear` or operator handoff:
1. `/impeccable:polish` on this file — consistency and spacing.
2. Update §3 `Last updated`, `Next exact action`, and `Open blockers`.
3. Update the memory pointer at `~/.claude/projects/-Users-dangelor-palladinolckroomr-Code-etf-core/memory/project_audit0419_closure.md` with the current `nextWave` and any new blockers.
4. Update the MEMORY.md one-liner if the wave letter changed.
5. `handoff` skill writes `TASKS.md` at the *active repo* root (etfframework / ETFtestSite / etf-core, whichever is the current wave target).
6. `git status` clean for unintentional edits. Edits to MASTER itself stay in `audit-reports/` (already untracked; do not accidentally stage).

### 11.6 Cross-repo coordination record-keeping

For any change that touches two or more of {etf-core, etfframework, ETFtestSite}:
- Author the change in etf-core first (shared-package invariant) when it is a library API.
- Record the etf-core commit SHA in the consuming wave item (C.x or D.x).
- Do NOT flip the consuming item `[x]` until the consumer repo has committed the bump (or equivalent).
- If two consumer repos consume the same etf-core API, ship C first then D (or vice versa) — never simultaneously, to avoid double-resolution on shared analytics events.

### 11.7 Canonical compliance preservation between sessions

- Phase A decisions are immutable. If a new session disagrees, file in §10 Deferred.
- Before any copy edit, re-read the relevant canonical reference under `~/.claude/skills/etf-brand-shared/references/` and `~/.claude/skills/etf-brand-messaging/references/trademark-placement.md`. Do this in every session — memory of canonical is not a substitute for reading canonical.

### 11.8 Subagent output reconciliation

Correction subagents return a structured report per wave item: `{wave_item_id, files_changed, diff_summary, playwright_probe_output, probe_verdict}`. The main session:

1. Reads the structured output.
2. Confirms `probe_verdict === "pass"`. If fail, the item does not advance — main session decides revert vs iterate; probe failure is recorded per §11.3.
3. Spot-verifies one or two of the reported file changes via Read to confirm the diff matches the summary.
4. Writes the reconciled flip (`[x]` + probe citation per §11.3) into §4 via Edit.
5. Discards the subagent output — it is transient. The probe citation in §4 is the durable record.

Parallel correction subagents return independently; main session reconciles each in turn, not as a batch. If two subagents touched overlapping files, main session resolves the conflict before flipping either item.

If a subagent flags a canonical contradiction, the main session files it under §10 Deferred — never mutates sealed §4.A / §4.B / §8 / §9.

## 12. Pointers

- **Audit spec (v3):** `../audit0419/audit-shared-ecosystem-v3.md`
- **Audit execution plan:** `./EXECUTION-PLAN.md` (CLOSED)
- **Frozen batch evidence:** `./batch-[1-5]-shared-audit.md`
- **Canonical patches directory (authoritative home):**
  - absolute: `/Users/dangelor.palladinolckroomr/Code/etf-core/docs/canonical-patches/`
  - relative (from this file): `../docs/canonical-patches/`
  - current members: `2026-04-phase-a.md` (Phase A resolution)
  - naming convention: `YYYY-MM-phase-{letter}.md`; new patches only in this directory
- **Phase B shipped:** `../CHANGELOG.md` v1.1.0 + v1.1.1 entries
- **BrandCta fix provenance:** `../.claude/plans/archived/phase-b-followup-brandcta-fix.md`
- **Upstream verification that seeded BrandCta follow-up:** `/Users/dangelor.palladinolckroomr/Code/etfframework/audit-reports/branch-verification-64af44e-9cd1db3.md`
- **Canonical source of truth (post-Phase-A):**
  - `~/.claude/skills/etf-brand-shared/references/canonical-definitions.md`
  - `~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md`
  - `~/.claude/skills/etf-brand-shared/references/shared-assets.md`
  - `~/.claude/skills/etf-brand-shared/references/skill-orchestration.md`
  - `~/.claude/skills/etf-brand-shared/SKILL.md`
  - `~/.claude/skills/etf-brand-messaging/references/trademark-placement.md`
- **Token references:**
  - 6i: `~/.claude/skills/etf-brand-design/references/tokens-6identities.md`
  - ETF: `~/.claude/skills/etf-brand-design/references/tokens-etfframework.md`
- **Skill references (Impeccable plugin):** `/impeccable:distill` · `/impeccable:audit` · `/impeccable:adapt` · `/impeccable:harden` · `/impeccable:optimize` · `/impeccable:critique` · `/impeccable:layout` · `/impeccable:typeset` · `/impeccable:polish` · `/impeccable:impeccable`
- **Subagent operator reference:** `superpowers:dispatching-parallel-agents`, `superpowers:executing-plans`, `superpowers:verification-before-completion`

---

## Appendix A — Original audit framing (frozen 2026-04-18)

Retained for provenance. Live corrections state is §§1–12 above; this appendix is historical.

### A.1 Audit scope

- Content-integrity audit of the shared ecosystem against both consumer sites.
- Authoritative canonical: `~/.claude/skills/etf-brand-shared/references/*.md` + `etf-brand-messaging/references/*.md` (Batch 5).
- Target repos: etf-core (`@dangelopalladino/etf-core` v1.0.6 at audit time), ETFtestSite (6identities.com), etfframework (etfframework.com).
- Executed 2026-04-18 UTC.
- Non-destructive: no source files modified outside `audit-reports/`.

### A.2 Batch summary

| Batch | Scope | Findings | CRITICAL | MAJOR | MINOR | Other |
|---|---|---|---|---|---|---|
| 1 | Canonical definitions | 13 | 6 | 0 | 2 | 3 needs-human · 1 not-referenced · 1 pass |
| 2 | Ecosystem copy | 12 | 6 | 3 | 1 | 1 not-referenced · 1 pass |
| 3 | llms.txt integrity | 4 | 4 | 0 | 0 | 6 downstream-N/A |
| 4 | Shared assets + infrastructure (post-`/harden`) | 28 | 9 | 7 | 2 | 2 needs-human · 2 not-referenced · 1 N/A · 5 pass |
| 5 | Cross-site voice drift | 19 | 5 | 6 | 3 | 1 needs-human · 1 not-referenced · 3 pass |
| **Total (reconciled)** | — | **76** | **30** | **16** | **8** | **22** |

**`/harden` reconciliation note:** Batch 4 Section 3 originally graded the "ETF footer has no cross-link to 6i" finding CRITICAL. On `/harden` review, live-verification (Batch 5 §5) and full-file re-read of `etfframework/src/components/Footer.tsx` confirmed the cross-links exist at lines 152–160 and 166–175 (outside the initial 120-line read window). Correct severity: **MAJOR** (paraphrased copy + non-canonical `?ref=etfframework` attribution). Batch 4 report retains its pre-correction tally; §§5–6 above reflect the reconciled count.

### A.3 Original recommended propagation order

Audit §5 specified canonical → etf-core → sites (A → B → C → D → E). Preserved verbatim in §4 above. Rationale: sites import from etf-core; content changes to etf-core propagate on `npm install`. Site-first would drift back into etf-core on next re-extraction.

### A.4 `/impeccable` quality-check record (original audit)

- Non-destructive: only `etf-core/audit-reports/` modified at audit time.
- Traceable: every finding cites `path:line` or `URL + UTC timestamp`.
- Internally consistent: batch severity rollups reconcile with §§5–7 above.
- Uncertainty labelled: three items flagged "needs-live-check" (Person schema payload identity, Organization `sameAs`, photography license metadata).
- Scope preserved: audit outputs reports only; no auto-fixes. Recommendations separated from findings; human-decision items separated from fixable items.

**End of Master Corrections Plan.**
