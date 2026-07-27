# Shared Ecosystem Repo Audit Prompt (v3 — durable plan, resume-safe)

Paste this prompt into Claude Code from inside the etf-core (shared ecosystem) repo. This is the v3 audit spec.

**What changed in v3:**
- Durable `EXECUTION-PLAN.md` file that persists across sessions
- Plan file doubles as a checklist
- Resume-safe: rebuilds plan from on-disk batch reports if plan file missing
- Anti-loop rule
- No subagents (this audit is file-based comparison, not parallel page captures)

**Prerequisites:**
1. All three brand skills at `~/.claude/skills/etf-brand-{messaging,design,shared}/`.
2. Both site repos cloned locally.
3. Playwright MCP for `llms.txt` live fetch.
4. Working directory: `./audit-reports/`.

---

## The prompt to paste

```
I need you to run a full consistency audit of the shared ecosystem repo 
against both 6identities.com and etfframework.com. This is v3 — durable 
plan file, resume-safe.

## Anti-loop rule (read first)

This prompt is the SPEC, not the plan. State lives in 
./audit-reports/EXECUTION-PLAN.md. Never re-derive state from this spec. 
If the plan file exists, resume from it. If it doesn't, rebuild from 
on-disk batch reports.

## Skills to load

- etf-brand-shared (primary; this is its audit)
- etf-brand-messaging
- etf-brand-design

Read etf-brand-shared/references/skill-orchestration.md first.

## The scope

The shared repo is source of truth for:
- Canonical definitions (six types, eight components, three phases, 
  Core Code Archetype taxonomy)
- Ecosystem copy (founder bio, academic citations, scope of practice, 
  press kit, llms.txt templates, ecosystem lockup)
- Shared assets (fonts, icons, photography, brand marks)
- Infrastructure (schema markup, analytics events, UTM conventions)

If these drift between shared repo and sites, sites are wrong.

**EXCEPT:** if the site has shipped a better definition than canonical, 
flag it as canonical-expansion candidate. The shared repo evolves when 
sites prove out refinements.

## Paths to inspect

Shared repo: [CURRENT DIRECTORY]
6i repo: [REPLACE WITH PATH TO 6I REPO]
ETF repo: [REPLACE WITH PATH TO ETF REPO]

## Plan file bootstrap

### Step A: Check for existing plan file

Read ./audit-reports/EXECUTION-PLAN.md.

**If exists:** read fully. Resume from nextBatch. Skip to "Batch workflow."

**If missing:** proceed to Step B.

### Step B: Bootstrap from on-disk reports

1. List ./audit-reports/batch-*-shared-audit.md files.
2. Read each. Extract findings by batch, severity, and status.
3. Write ./audit-reports/EXECUTION-PLAN.md:

```markdown
# Shared Ecosystem Audit — Execution Plan

**Last updated:** [timestamp]
**Source of truth:** this file. Do not re-derive from the audit spec.

## 1. Current state

- **Last completed batch:** [N]
- **Next batch:** [N+1] — [batch name]
- **Open blockers:** [list or "none"]

## 2. Batches

### Batch 1 — Canonical definitions
- [ ] Six identity types (Compass/Mirage/Sentinel/Signal/Anchor/Catalyst) cross-checked
- [ ] Eight components (branded Motion order + clinical translations) cross-checked
- [ ] Three phases (Build/Consolidate/Integrate) cross-checked
- [ ] Core Code archetypes (Autonomous/Servant/Competitor/Connector/Creator) cross-checked
- [ ] Compound code format (CP-AU-XUA pattern) cross-checked
- [ ] Batch report saved
- [ ] Plan updated

### Batch 2 — Ecosystem copy
- [ ] Founder bio (3 lengths) cross-checked
- [ ] Academic citations (Brewer/Van Raalte/Linder 1993, Schlossberg 1981, Matveyev 1977, Bompa 2019, plus 7 sanctioned)
- [ ] Scope-of-practice statement verbatim match
- [ ] Press kit boilerplate
- [ ] "Built by someone who went through it" proof block
- [ ] Batch report saved
- [ ] Plan updated

### Batch 3 — llms.txt integrity
- [ ] Fetch https://6identities.com/llms.txt via Playwright
- [ ] Fetch https://etfframework.com/llms.txt via Playwright
- [ ] Key facts match canonical templates
- [ ] 6i does NOT use "operating system for athlete transition"
- [ ] ETF DOES use "operating system for athlete transition"
- [ ] Both link to the other domain
- [ ] Batch report saved
- [ ] Plan updated

### Batch 4 — Shared assets + infrastructure
- [ ] Brand mark SVGs at expected paths
- [ ] Both sites pull from shared asset repository
- [ ] Favicon + OG images exist for both sites
- [ ] Both sites use General Sans font
- [ ] Both sites use AntD icons (canonical locked in Phase A)
- [ ] Founder Person schema identical on both sites
- [ ] Organization schema references sibling site via sameAs
- [ ] Neither site uses HowTo or FAQPage JSON-LD (banned)
- [ ] Analytics events follow [surface]_[action] pattern (shared namespace per Phase A)
- [ ] Cross-site links carry UTM parameters via withUtm helper
- [ ] Batch report saved
- [ ] Plan updated

### Batch 5 — Cross-site voice drift
- [ ] Fetch 6i homepage hero via Playwright
- [ ] Fetch ETF homepage hero via Playwright
- [ ] Run strip test on both heroes
- [ ] 6i hero reads editorial (intensity 6/10)
- [ ] ETF hero reads institutional (intensity 2/10)
- [ ] Heroes would NOT read correctly swapped between sites
- [ ] Fetch + evaluate both footer cross-links
- [ ] Fetch + evaluate 6i /professionals page (cross-site exception)
- [ ] Fetch + evaluate ETF /methodology first screen
- [ ] Batch report saved
- [ ] Plan updated

## 3. CRITICAL findings

| ID | Title | Site affected | Status |
|----|-------|---------------|--------|

## 4. MAJOR findings

| ID | Type | Details | Status |
|----|------|---------|--------|

## 5. Canonical-expansion candidates

- [ ] Any site-proven refinements worth promoting to canonical

## 6. Human-decision items

- [ ] Any ambiguous drift where the right answer needs user input

## 7. Pointers

- Audit spec: ./audit-shared-ecosystem-v3.md
- Canonical files:
  - ~/.claude/skills/etf-brand-shared/references/canonical-definitions.md
  - ~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md
  - ~/.claude/skills/etf-brand-shared/references/shared-assets.md
  - ~/.claude/skills/etf-brand-shared/references/skill-orchestration.md
- 6i tokens: ~/.claude/skills/etf-brand-design/references/tokens-6identities.md
- ETF tokens: ~/.claude/skills/etf-brand-design/references/tokens-etfframework.md
```

4. Pause. Tell user you rebuilt the plan from [N] existing batch reports. 
   Ask for verification before proceeding.

## Workflow per batch

### Batch 1: Canonical definitions

Read canonical-definitions.md. Search both site repos for every mention of:

- Six identity types (Compass, Mirage, Sentinel, Signal, Anchor, Catalyst)
- Eight components (branded: The Build, Core Code, People, Community, 
  The Dashboard, The Block List, Process, Moves; clinical: Identity, 
  Values, Relationships, Community, Self-Awareness, Obstacles, Structure, 
  Execution)
- Three phases (Build, Consolidate, Integrate)
- Five Core Code archetypes (Autonomous, Servant, Competitor, Connector, Creator)
- Compound code format (CP-AU-XUA pattern)

For each mention produce an audit entry:

---

#### Match: [term]
**Canonical location:** canonical-definitions.md, section [X]
**Canonical definition:** [quote verbatim]
**Found in:** [site repo file path and line number]
**Site version:** [quote verbatim]
**Consistency:** [pass / drift / contradiction]

If pass: move on.
If drift: MINOR with wording diff.
If contradiction: CRITICAL with specific conflict.

---

### Batch 2: Ecosystem copy

Read ecosystem-copy.md. Search both site repos for:
- Founder bio (short/medium/long)
- Academic citations (three foundational + seven sanctioned per Phase A)
- Scope-of-practice statement (verbatim match required)
- Press-kit boilerplate
- "Built by someone who went through it" proof block

Same audit entry structure as Batch 1.

Scope-of-practice deviation = CRITICAL.
Founder bio not matching one of three approved lengths = MAJOR.
Citation formatting deviation = MAJOR.

### Batch 3: llms.txt integrity

Use Playwright MCP to fetch:
- https://6identities.com/llms.txt
- https://etfframework.com/llms.txt

Compare each against canonical templates in ecosystem-copy.md.

Audit:
- Key facts match canonical (pricing, cycle length, certification details, citations)
- 6i does NOT use "operating system for athlete transition"
- ETF DOES use "operating system for athlete transition"
- Both link to the other domain
- Section URLs not stale

Missing file = CRITICAL. Drift = MAJOR.

### Batch 4: Shared assets + infrastructure

Read shared-assets.md. Verify:
- Brand mark SVGs at expected paths
- Sites pull from shared asset repository
- Favicons + OG images exist both sites
- Both sites use General Sans
- Both sites use AntD icons (Phase A locked this — Lucide retired)
- Founder Person schema identical on both sites (fetch live and compare JSON-LD)
- Organization schema references sameAs correctly
- No HowTo or FAQPage JSON-LD markup on either site
- Analytics events follow [surface]_[action] shared namespace (Phase A)
- Cross-site links use withUtm helper pattern

One audit entry per infrastructure item.

### Batch 5: Cross-site voice drift

Use Playwright to fetch:
- 6identities.com/ homepage hero
- etfframework.com/ homepage hero

Run strip test (from trademark-placement.md) on each.

Evaluate:
- 6i hero reads editorial, direct (intensity 6/10)?
- ETF hero reads institutional, restrained (intensity 2/10)?
- Would heroes swap incorrectly between sites? If yes, voice asymmetry 
  collapsed = CRITICAL.

Also fetch + evaluate:
- Both footer cross-links
- 6i /professionals (exception page, 6i voice about ETF)
- ETF /methodology first screen

Voice drift between sites = MAJOR. Misplaced trademark = CRITICAL.

## Save + update after each batch

1. Save report to ./audit-reports/batch-[N]-shared-audit.md
2. Update ./audit-reports/EXECUTION-PLAN.md: check off items, update §1, 
   add findings to §3/§4/§5/§6.
3. Pause. Tell user top findings. Wait for go-ahead.

No cleanup step needed — no screenshots, reports are the deliverable.

## Final deliverable

./audit-reports/MASTER-SHARED-AUDIT-REPORT.md:
1. Summary of all five batches
2. All CRITICALs ranked by site (which site needs change)
3. All MAJORs ranked by type
4. All MINORs grouped by resource type
5. Recommended propagation order
6. Canonical-expansion candidates
7. Human-decision items (ambiguous drift)

## Global rules

1. Shared repo is authoritative — when a site contradicts, site is wrong.
2. EXCEPT: site-proven refinements = canonical-expansion candidates.
3. Verbatim match required: scope of practice, academic citations, trademarks.
4. Paraphrase-match acceptable: body copy, proof blocks, marketing language.
5. Sites contradicting each other = CRITICAL (ecosystem inconsistency).
6. Never auto-fix. Audit produces report only.
7. Anti-loop: state lives in EXECUTION-PLAN.md, not this spec.

## Start

1. Check for EXECUTION-PLAN.md.
2. If exists, resume from nextBatch.
3. If missing, bootstrap from on-disk reports, pause for user.
4. Confirm the three repo paths at top of spec.
5. Confirm /mcp shows Playwright (for Batches 3 and 5).
6. Begin at nextBatch.
```
