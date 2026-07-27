# Batch 1 — Canonical Definitions Audit

**Canonical source:** `~/.claude/skills/etf-brand-shared/references/canonical-definitions.md`
**Sites audited:** `ETFtestSite` (6i), `etfframework` (ETF), and `etf-core` (shared library)
**Executed:** 2026-04-18 (static code scan; no network fetches)

Legend — *Consistency*: `pass` · `drift (MINOR)` · `drift (MAJOR)` · `contradiction (CRITICAL)` · `needs-human-review` · `not referenced`.

---

## Headline finding

**Both sites ship entirely different taxonomies from what canonical declares**, yet the canonical's own compound-code example (`CP-AU-XUA`) is consistent with the site taxonomy, not canonical's own declared type names. This is a **systemic canonical failure**, not per-site drift. Recommended resolution in Master Report item 6 (expand/correct canonical to match what the sites ship), not site-side fix.

---

## Section 1 — The six identity type names

Canonical declares exactly six type names with mythic descriptors: **Commander, Craftsman, Competitor, Custodian, Creator, Contender** (canonical-definitions.md §"The six identity types", lines 7–66). Canonical rule (line 63): *"Type names are always proper nouns, capitalized. Never 'The Commander Type.'"*

#### Match: six canonical type names across both sites

**Canonical location:** `canonical-definitions.md` §"The six identity types", lines 13–59.
**Canonical definition:** `Commander` · `Craftsman` · `Competitor` · `Custodian` · `Creator` · `Contender`.
**Found in:** 6i — 3 files only (`CoreCodeSection.tsx`, `AuthorSection.tsx`, `knowledgebase-data.ts`); ETF — **0 files** (only matches were in skill canonical files themselves).
**Site version:** On the 3 matching 6i files, the names appear **not as type labels** but either as part of a DIFFERENT taxonomy layer (CoreCodeSection.tsx line 10: `The Competitor (CM)` as a Core Code archetype), or as generic English words (AuthorSection.tsx line 25: `Creator of the 6 Identities…`). None of these use the six names AS the six-type taxonomy.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical demands a closed, capitalized, verbatim taxonomy. Neither site ships that taxonomy at all. This is not paraphrase — the names are absent as type labels on every production surface.

#### Match: the six type names the 6i site actually ships

**Canonical location:** not in canonical-definitions.md (absent).
**Canonical definition:** — (canonical does not name these).
**Found in:** `ETFtestSite/src/types/index.ts:1–7` — declares `type IdentityType = 'Compass' | 'Mirage' | 'Sentinel' | 'Signal' | 'Anchor' | 'Catalyst'`. Reinforced in `ETFtestSite/src/lib/type-profiles.ts:28–` (`TYPE_PROFILES` with `slug: "compass"`, `name: "Compass"`, `typeCode: "CP"` and five more), and in `ETFtestSite/src/content/assessment/type-descriptions.ts:4` (`TYPE_DESCRIPTIONS: Record<IdentityType, …>`).
**Site version:** `Compass` · `Mirage` · `Sentinel` · `Signal` · `Anchor` · `Catalyst`.
**Consistency:** **contradiction (CRITICAL)** — cross-axis with above.
**Severity justification:** The site has a complete, load-bearing taxonomy (TypeScript union, 82 files across 6i referencing these names) that the canonical does not document. Canonical says the six are Commander/Craftsman/…; the site ships Compass/Mirage/… instead.

#### Match: canonical's own compound-code example

**Canonical location:** `canonical-definitions.md:201` (§"The compound code"): `CP-AU-XUA (Compass-Autonomous-elevated urgency, basic stability)`.
**Canonical definition:** Uses the prefix `CP` = `Compass`.
**Found in:** `ETFtestSite/src/types/index.ts:96–97` — `athleteCode: "PF-AU"` and `fullCode: "PF-AU-XUA"` comments; `ETFtestSite/src/lib/type-profiles.ts:32` — `typeCode: "CP"` for `slug: "compass"`.
**Site version:** `CP` maps to `Compass`, consistent with canonical's example.
**Consistency:** **needs-human-review** — canonical is internally self-contradictory. Its type-name section declares Commander/Craftsman/…; its compound-code section uses Compass/…
**Severity justification:** The canonical file has two incompatible claims about the six types. Site is consistent with one of the two canonical claims. Resolution requires a human to decide which claim is authoritative.

---

## Section 2 — The eight components

Canonical declares exactly eight components in this order: **Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution** (canonical-definitions.md §"The eight components", lines 69–137; ordering rule line 73).

#### Match: the eight components on the ETF methodology page

**Canonical location:** `canonical-definitions.md:73`.
**Canonical definition:** `Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution`.
**Found in:** `etfframework/src/app/methodology/eight-components/page.tsx:15–56`.
**Site version:** `The Build™` · `Core Code™` · `People` · `Community` · `The Dashboard™` · `The Block List™` · `Process` · `Moves™`. Page metadata (line 11) describes these as *"the eight components of the Executable Transition Framework."*
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Count matches (8). Only `Community` matches verbatim. The other seven are re-named with trademark suffixes. Canonical rule (line 71): *"every component appears on every athlete's rebuild."* Canonical does not document these alternative names. Either (a) the site's marketing names are canonically valid and canonical must document them, or (b) the site is drifting. The page claims to enumerate "the eight components" but uses unapproved names.

#### Match: eight-component names referenced elsewhere on ETF

**Canonical location:** `canonical-definitions.md:73`.
**Canonical definition:** as above.
**Found in:** `etfframework/src/app/our-network/page.tsx:37`.
**Site version:** *"eight components, the Core Code™, the six identities, and the 90-day implementation cycle"* — `Core Code™` treated as a distinct element alongside the eight components.
**Consistency:** **contradiction (CRITICAL)** — internal to ETF.
**Severity justification:** The methodology page has `Core Code™` as one of the eight components; the our-network page positions it as a ninth element adjacent to the eight. Internal contradiction within the ETF site regardless of canonical.

#### Match: books.ts component references (etf-core)

**Canonical location:** `canonical-definitions.md:73`.
**Canonical definition:** as above.
**Found in:** `etf-core/src/content/books.ts:53` (Motion description), `books.ts:54` (Motion description — "eight components that rebuild identity, relationships, community, daily structure, and execution").
**Site version:** lowercased list: *"identity, relationships, community, daily structure, and execution"*; Motion TOC (`books.ts:56–72`) uses `The Build™`, `Core Code™`, `People`, `Community`, `The Dashboard™`, `The Block List™`, `Process`, `Moves™`.
**Consistency:** **contradiction (CRITICAL)** — agrees with ETF methodology page, disagrees with canonical.
**Severity justification:** Shared library content mirrors the site taxonomy, not the canonical. This propagates the drift to every downstream consumer.

---

## Section 3 — The four phases

Canonical declares four phases in this order: **baseline, build, peak, recover** (canonical-definitions.md §"The four phases", lines 153–175). Naming rule (line 175): *"Phases are always lowercase when referenced in running prose … capitalized when used as a section header … always in the canonical order. Never substituted with synonyms."*

#### Match: four phases as a named sequence

**Canonical location:** `canonical-definitions.md:153–175`.
**Canonical definition:** `baseline` → `build` → `peak` → `recover` per 90-day cycle.
**Found in:** searched `ETFtestSite/**/*.{ts,tsx,md,mdx,txt}` and `etfframework/**/*.{ts,tsx,md,mdx,txt}` for the regex `(baseline.*build.*peak.*recover|build.*peak.*recover)` — **0 site matches**. Only matches are in the skill reference files and `skills-update/` staging area, not in either production codebase.
**Site version:** not referenced.
**Consistency:** **not referenced** (explicit).
**Severity justification:** Both sites reference "90-day cycle" prominently (e.g., `etfframework/src/app/our-results/page.tsx:58,81,85`; `etfframework/src/lib/seo/breadcrumbs.ts:15`; `etfframework/src/app/motion-app/page.tsx:25`) but neither names the four-phase periodization structure canonical defines. This is a coverage gap, not a contradiction. Sites may assume practitioner-only exposure, but canonical presents phases as part of the methodology surface. Needs-human-review on whether to surface them.

---

## Section 4 — The Core Code Archetype categories

Canonical declares five Core Code Archetypes: **Driver, Anchor, Scout, Guardian, Craftsman Code** (canonical-definitions.md §"The five Core Code Archetype categories", lines 185–191). Canonical note (line 193) warns about the Craftsman/Craftsman Code naming collision.

#### Match: `Driver` and `Scout` (canonical Core Code names)

**Canonical location:** `canonical-definitions.md:187, 189`.
**Canonical definition:** `Driver` (code of restlessness); `Scout` (code of curiosity).
**Found in:** `ETFtestSite/**/*.{ts,tsx,md,mdx}` — **0 files**.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical declares 5 named archetypes; site ships a completely different 5. Like the six types, this is a systemic taxonomy contradiction.

#### Match: `Craftsman Code` (canonical Core Code name)

**Canonical location:** `canonical-definitions.md:191`.
**Canonical definition:** `The Craftsman Code. Wants precision and mastery. The code of perfection.`
**Found in:** Grep across all of `/Users/dangelor.palladinolckroomr/Code` returns only canonical-definitions.md itself and `skills-update/` staging. **0 production site files**.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Also absent from both sites.

#### Match: five Core Code Archetypes the 6i site actually ships (Variant A)

**Canonical location:** not in canonical.
**Canonical definition:** —
**Found in:** `ETFtestSite/src/types/index.ts:42–43` — `CoreCodeType = 'Sovereign' | 'Guardian' | 'Rival' | 'Bonded' | 'Pioneer'` with codes `'SO' | 'GU' | 'RI' | 'BO' | 'PI'`. Reinforced in `ETFtestSite/src/content/assessment/archetype-descriptions.ts:7,13,19,25,31` (named entries `Sovereign`, `Guardian`, `Rival`, `Bonded`, `Pioneer`) and in the compound-code archetype keys at `type-profiles.ts:89–94` (`SO`, `GU`, `RI`, `BO`, `PI`).
**Site version:** `Sovereign` · `Guardian` · `Rival` · `Bonded` · `Pioneer`.
**Consistency:** **contradiction (CRITICAL)** vs. canonical; overlap: `Guardian` appears in both canonical and site.
**Severity justification:** Complete, load-bearing taxonomy in site TypeScript not documented in canonical.

#### Match: five Core Code Archetypes the 6i site ALSO ships (Variant B — internal inconsistency)

**Canonical location:** not in canonical.
**Canonical definition:** —
**Found in:** `ETFtestSite/src/lib/knowledgebase-data.ts:80` — *"There are 5 archetypes: Autonomous (AU), Servant (SV), Competitor (CM), Connector (CN), and Creator (CR)."* Reinforced in `ETFtestSite/src/components/methodology/CoreCodeSection.tsx:10–12` with cards for `The Competitor (CM)`, `The Creator (CR)`, plus Autonomous/Servant/Connector.
**Site version:** `Autonomous` · `Servant` · `Competitor` · `Connector` · `Creator` (codes AU, SV, CM, CN, CR).
**Consistency:** **contradiction (CRITICAL)** — with **both** canonical AND with Variant A above.
**Severity justification:** Same site, two incompatible Core Code taxonomies. `types/index.ts` uses `SO/GU/RI/BO/PI`; `methodology/CoreCodeSection.tsx` and `knowledgebase-data.ts` use `AU/SV/CM/CN/CR`. Canonical's own compound-code example `CP-AU-XUA` uses the **Variant B** code `AU` = `Autonomous`. So canonical example agrees with one internal variant and disagrees with the other.

---

## Section 5 — The compound code format

Canonical declares format `[Pattern]-[Archetype]-[XUA notation]`, example `CP-AU-XUA` (canonical-definitions.md:197–205).

#### Match: compound code structure

**Canonical location:** `canonical-definitions.md:197–205`.
**Canonical definition:** format `AA-BB-CCC`; example `CP-AU-XUA`.
**Found in:** `ETFtestSite/src/types/index.ts:96–97` — `athleteCode: string;  // e.g., "PF-AU"` and `fullCode: string;     // e.g., "PF-AU-XUA"`.
**Site version:** format matches (two-letter, two-letter, three-letter sections, hyphenated).
**Consistency:** **pass** (structural).
**Severity justification:** Format is canonical-compliant. Example in comment (`PF-AU-XUA`) uses Pattern code `PF` which does not appear in canonical's six example codes (CP/MI/SE/SI/AN/CA inferred from site `typeCode`s). `PF` may be an additional type or a stale example — flag as **MINOR**.

#### Match: surface restriction (Level 2+)

**Canonical location:** `canonical-definitions.md:207–215`. Canonical rule: *"The compound code appears only at Level 2 and above … Never on an ad. Never on a homepage hero. Never in a social post targeting cold traffic."*
**Found in:** compound-code-format regex `\b[A-Z]{2}-[A-Z]{2}-[A-Z]{3}\b` — searching `/Users/dangelor.palladinolckroomr/Code` in `*.{ts,tsx,md,mdx,json,txt,html}`, 0 matches outside canonical reference files and site comments.
**Site version:** no production surface surfaces compound codes in marketing copy.
**Consistency:** **pass**.
**Severity justification:** No violations detected on first-touch surfaces.

---

## Section 6 — etf-core constants audited

#### Match: `etf-core/src/tokens/6id.ts` `IDENTITY_COLORS` keys

**Canonical location:** canonical does not name the six Pattern keys; only the six Type names (Commander et al.).
**Canonical definition:** — (gap).
**Found in:** `etf-core/src/tokens/6id.ts:16–23`.
**Site version:** keys `compass`, `mirage`, `sentinel`, `signal`, `anchor`, `catalyst`; values are hex codes described as "pottery glaze palette."
**Consistency:** **needs-human-review** → **canonical gap (Master item 6 candidate)**.
**Severity justification:** The keys match the 6i site's shipped type taxonomy exactly, which is consistent across the ecosystem. But canonical does not document these names. If canonical is updated to reflect site taxonomy, this entry becomes a `pass`.

#### Match: `etf-core/src/content/books.ts` — "six transition patterns"

**Canonical location:** `canonical-definitions.md:9` — *"The 6 Identities® assessment returns one of exactly six types."*
**Canonical definition:** canonical uses the word *types*, not *patterns*, for the top-level taxonomy.
**Found in:** `etf-core/src/content/books.ts:54` (Motion description): *"The 6 Identities tells you exactly which of six transition patterns you are currently operating in."* Similar: `books.ts:130` (Family Playbook): *"Organized by the six 6 Identities patterns, by age group, by level of play."*
**Site version:** uses `transition patterns` / `patterns` instead of `types`.
**Consistency:** **drift (MINOR)**.
**Severity justification:** This is paraphrase-allowed body copy (book description). However, given the canonical's insistence on closed taxonomy language, the wording `patterns` is a near-miss — the site's `typeCode` prefix (`CP`, `MI`, etc.) suggests the sites internally treat these as patterns. Canonical should be evaluated for whether "types" and "patterns" are synonymous or distinct (Master item 6).

#### Match: `etf-core/src/content/books.ts` Motion TOC — proprietary marks

**Canonical location:** canonical does not register `The Build™`, `Core Code™`, `The Dashboard™`, `The Block List™`, `Moves™`, `The Foundation™` as trademarked terms or as approved component names.
**Canonical definition:** — (gap).
**Found in:** `etf-core/src/content/books.ts:62–70` (chapter titles) and `books.ts:74` (excerpt uses `The Foundation™`).
**Site version:** multiple ™ marks applied to internal concept names.
**Consistency:** **needs-human-review**.
**Severity justification:** Either the marks are legitimate trademarks the brand owns (canonical gap) or they are overclaiming (CRITICAL if canonical is authoritative). Cannot be resolved without human confirmation.

---

## Section 7 — Coverage declaration (/harden precursor)

| Canonical term | Sought | Result |
|---|---|---|
| Six type names — `Commander, Craftsman, Competitor, Custodian, Creator, Contender` | grep all repos | declared `contradiction (CRITICAL)` |
| Six type names — 6i-shipped `Compass, Mirage, Sentinel, Signal, Anchor, Catalyst` | declared canonical gap | surfaced as canonical-expansion candidate |
| Eight components (canonical) | grep etf methodology page and shared libs | `contradiction (CRITICAL)` |
| Four phases (sequence) | grep `baseline.*build.*peak.*recover` | `not referenced` on either site |
| Five Core Code archetypes (canonical) — Driver/Anchor/Scout/Guardian/Craftsman Code | grep all repos | `contradiction (CRITICAL)` |
| Five Core Code archetypes (6i Variant A) — Sovereign/Guardian/Rival/Bonded/Pioneer | found | canonical gap; also internally contradicts Variant B |
| Five Core Code archetypes (6i Variant B) — Autonomous/Servant/Competitor/Connector/Creator | found | canonical's compound-code example agrees with this variant |
| Compound code format | regex | structural `pass`; stale example code `PF` flagged as MINOR |

---

## Section 8 — Severity rollup

| Severity | Count |
|---|---|
| CRITICAL (contradiction) | 6 |
| MAJOR (drift of required form) | 0 |
| MINOR (paraphrase drift) | 2 |
| needs-human-review | 3 |
| not referenced (explicit) | 1 |
| pass | 1 |
| **total findings** | **13** |

---

## Section 9 — Recommendations surfaced for Master Report

1. **Master item 6 (canonical expansion priority):** update `canonical-definitions.md` to reflect the shipped taxonomy (Compass/Mirage/Sentinel/Signal/Anchor/Catalyst as the six types; Autonomous/Servant/Competitor/Connector/Creator OR Sovereign/Guardian/Rival/Bonded/Pioneer as the five Core Code archetypes — pending resolution of the 6i-internal Core Code conflict). The canonical's own compound-code example agrees with site taxonomy, proving canonical's type-name section is the stale layer.
2. **Master item 7 (human decision):** which Core Code variant wins in 6i — `Sovereign/Guardian/Rival/Bonded/Pioneer` (TypeScript) or `Autonomous/Servant/Competitor/Connector/Creator` (knowledgebase, methodology page, and canonical compound-code example)?
3. **Master item 7 (human decision):** are the trademark-marked component names (`The Build™`, `Core Code™`, `The Dashboard™`, etc.) legitimate brand marks or overclaiming? Resolution determines whether canonical gets expanded or sites get rewritten.
4. **Master item 6 (canonical expansion):** document or remove the `PF` pattern code in canonical's compound-code example; the site ships `CP/MI/SE/SI/AN/CA`.
5. **Master item 5 (propagation):** if canonical is correct, 82 6i files plus every downstream ETF reference need rewriting — this is a massive-scope change the audit flags but does not recommend executing without explicit human approval.

End of Batch 1.
