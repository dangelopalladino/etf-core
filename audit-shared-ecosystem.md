# Shared Ecosystem Repo Audit Prompt

Paste this prompt into Claude Code from inside the shared ecosystem project repo. This audit is different from the 6i and ETF audits: there is no site to screenshot. The shared repo holds canonical copy, shared assets, schema markup, analytics schemas, llms.txt files, and asset libraries. This audit checks those resources for internal consistency and for drift between what the shared repo says is canonical and what the two sites actually ship.

Prerequisites:

1. All three brand skills installed at `~/.claude/skills/etf-brand-messaging/`, `~/.claude/skills/etf-brand-design/`, `~/.claude/skills/etf-brand-shared/`.
2. Both site repos cloned locally and accessible. This audit compares what the shared repo says against what the sites actually render.
3. Playwright MCP optional but recommended for verifying llms.txt files are live at both domains.
4. A working directory for the audit report: `./audit-reports/` inside the shared repo.

---

## The prompt to paste

```
I need you to run a full consistency audit of the shared ecosystem 
repo against both 6identities.com and etfframework.com. Unlike the 
per-site audits, this is a content-integrity audit, not a visual one. 
Follow this workflow exactly.

## Skills to load

Load all three brand skills:
- etf-brand-shared (primary; this is its audit)
- etf-brand-messaging (voice checks)
- etf-brand-design (token consistency checks)

Read etf-brand-shared/references/skill-orchestration.md first. This 
audit lives in Pattern 5 (audit) of that file.

## The scope

The shared repo is the source of truth for:
- Canonical definitions (six types, eight components, four phases, 
  Core Code Archetype taxonomy)
- Ecosystem copy (founder bio, academic citations, scope of practice, 
  press kit, llms.txt templates, ecosystem lockup)
- Shared assets (fonts, icons, photography, brand marks)
- Infrastructure (schema markup, analytics events, UTM conventions, 
  asset repository structure)

If any of these drifts between what the shared repo declares and what 
the two sites actually ship, the sites are wrong and the shared repo 
is right, per the orchestration rule.

## Paths to inspect

Shared repo assumed location: [CURRENT DIRECTORY]
6i repo assumed location: [REPLACE WITH PATH TO 6I REPO]
ETF repo assumed location: [REPLACE WITH PATH TO ETF REPO]

If those paths differ, tell me and I will update them before you start.

## The audit batches

This audit runs in five batches by resource type, not by page.

### Batch 1: Canonical definitions

Read canonical-definitions.md from etf-brand-shared. Then search both 
site repos for every mention of:

- The six identity types by name (Commander, Craftsman, Competitor, 
  Custodian, Creator, Contender)
- The eight components by name (Identity, Values, Relationships, 
  Community, Self-Awareness, Obstacles, Structure, Execution)
- The four phases by name (baseline, build, peak, recover)
- The Core Code Archetype five categories (Driver, Anchor, Scout, 
  Guardian, Craftsman Code)
- The compound code format (e.g., CP-AU-XUA pattern)

For each mention found in either site repo, produce an audit entry:

---

#### Match: [term]
**Canonical location:** canonical-definitions.md, section [X]
**Canonical definition:** [quote the canonical]
**Found in:** [site repo file path and line number]
**Site version:** [quote the site's version]
**Consistency:** [pass / drift / contradiction]

If pass: move on.
If drift (similar but not verbatim): flag as MINOR with specific 
wording diff.
If contradiction (different definition, different order, wrong count): 
flag as CRITICAL with the specific conflict.

---

### Batch 2: Ecosystem copy

Read ecosystem-copy.md from etf-brand-shared. Search both site repos for:

- Founder bio text (short, medium, long versions)
- Academic citations (Brewer Van Raalte Linder 1993, Schlossberg 1981, 
  Matveyev 1977, Bompa & Buzzichelli 2019)
- Scope of practice statement (three sentences, exact wording)
- Press kit boilerplate language
- "Built by someone who went through it" proof block

For each match, audit for verbatim consistency. The scope-of-practice 
statement must match word-for-word; any deviation is CRITICAL.

The founder bio has three approved lengths. Flag any bio on either site 
that does not match one of the three as MAJOR.

Academic citations must match the APA format in ecosystem-copy.md 
exactly. Punctuation and italicization count.

Produce one audit entry per match using the same structure as Batch 1.

### Batch 3: llms.txt integrity

Fetch the live llms.txt files from both domains using Playwright:

- https://6identities.com/llms.txt
- https://etfframework.com/llms.txt

Compare each against the canonical template in ecosystem-copy.md.

For each file, audit:

- Key facts listed match the canonical (pricing, cycle length, 
  certification details, academic citations)
- 6i version does NOT use the phrase "operating system for athlete 
  transition" (reserved for ETF)
- ETF version DOES use the phrase "operating system for athlete 
  transition"
- Both files link to the other domain in the "Related" section
- Section URLs are complete and not stale
- Neither file has been edited with drift from the canonical

Flag any drift as MAJOR. Flag any missing file as CRITICAL.

### Batch 4: Shared assets and infrastructure

Read shared-assets.md from etf-brand-shared. Verify:

- Brand mark SVG files exist at expected paths in the shared asset 
  repository
- Both site repos pull brand marks from the shared repository (not 
  site-local copies)
- Favicon and OG image files exist for both sites at the expected 
  paths
- Both sites implement the same font-loading pattern
- Both sites use Lucide icons at 1.5px stroke weight (check the 
  component code)
- The Person schema for the founder is identical on both sites (fetch 
  live pages and compare JSON-LD)
- Organization schema on each site references the other via sameAs
- Neither site uses HowTo or FAQPage schema (banned)
- Analytics event names on both sites follow [site]_[surface]_[action] 
  pattern
- Cross-site links carry UTM parameters (check footer and For 
  Practitioners page on 6i, methodology page on ETF)

Produce an audit entry per infrastructure item.

### Batch 5: Cross-site voice drift

This batch does not compare to canonical; it compares the two sites 
against each other.

Using Playwright MCP, fetch the current hero copy from both sites:
- 6identities.com/ (homepage hero)
- etfframework.com/ (homepage hero)

For each hero, run the strip test from trademark-placement.md. Then 
evaluate:

- Does the 6i hero sound editorial and direct (intensity 6/10)?
- Does the ETF hero sound institutional and restrained (intensity 2/10)?
- If the two heros were swapped between sites, would either one feel 
  correct on the other site? (If yes, the voice asymmetry has 
  collapsed and both sites need rewriting.)

Also fetch and evaluate:
- Both footer cross-links (6i footer linking to ETF, and vice versa)
- The For Practitioners page on 6i (this is the exception page where 
  6i references ETF in 6i voice)
- The Methodology page first screen on ETF

For each surface, flag any place where the two sites' voices have 
drifted toward each other (MAJOR) or where a trademark is misplaced 
(CRITICAL).

### Step for each batch: Save the batch report

After each batch, save a report to:

./audit-reports/batch-[N]-shared-audit.md

Do not run cleanup between batches in this audit; there are no 
screenshots to delete. The reports are the deliverable.

### Final deliverable

./audit-reports/MASTER-SHARED-AUDIT-REPORT.md

Include:

1. Summary of all five batches
2. All CRITICAL issues ranked by site (which site needs to change)
3. All MAJOR issues ranked by type (definition drift, citation drift, 
   infrastructure drift, voice drift)
4. All MINOR issues grouped by resource type
5. Recommended propagation order: which canonical sources to update 
   first, then which sites to update from those canonicals
6. Any canonical definitions in etf-brand-shared that should be 
   EXPANDED or REFINED based on how the sites are actually using them 
   (sometimes the sites have discovered a needed distinction that 
   should become canonical)
7. Any place where the canonical and the sites have drifted so far 
   apart that the right answer is unclear; flag these for human 
   decision, not for auto-fix.

## Rules that apply across every batch

1. The shared repo is authoritative. When a site contradicts the 
   shared repo, the site is wrong.
2. EXCEPT: if the site has shipped a definition that is genuinely 
   better than the canonical, flag it and recommend updating the 
   canonical to match. The shared repo should evolve when the sites 
   prove out a refinement.
3. Verbatim matching is required for: scope of practice, academic 
   citations, trademark wording. Paraphrase-matching is acceptable 
   for: body copy describing the components, proof blocks, marketing 
   language.
4. If the two sites contradict each other (not the canonical, but each 
   other), flag as CRITICAL because the ecosystem is internally 
   inconsistent.
5. Never auto-fix. This audit produces the report. Fixes happen in 
   separate tasks, one per site.

Start with Batch 1. Confirm the three repo paths are correct, confirm 
you have file-read access to both site repos, and begin.
```

---

## Why this audit is different

**No screenshots.** The shared repo does not render a site. Its deliverables are text files, schemas, and asset lists. The audit runs on content integrity, not visual fidelity. That's why there's no cleanup step between batches.

**Cross-repo comparison.** This is the only audit that compares two repos against a third. Claude needs file-read access to all three repos. If the ETF or 6i repo lives somewhere Claude Code cannot reach from the shared repo directory, update the paths in the prompt before pasting.

**The expansion-candidate flag.** The shared repo should evolve. Sometimes a site discovers a useful distinction (a subcategory, a specific case, a new example) that the canonical definition hasn't captured yet. The final deliverable explicitly asks Claude to surface those candidates so you can decide whether to promote them to canonical status. This prevents the shared repo from becoming stale relative to the product.

**Human-decision items.** When the canonical and the sites have drifted so far apart that the "right" answer is genuinely unclear, Claude flags it for you, not for auto-fix. Examples: the sites ship a type name differently than the canonical, or the eight components appear in different orders in different places and it's not obvious which version is current.

---

## Running the three audits together

If you want to audit the entire ecosystem in one pass, run them in this order:

1. **Shared repo audit first** (this prompt). This tells you the source of truth and flags where sites drift from it.
2. **6i audit second** (the audit-6identities.md prompt). Armed with the canonical truths from audit 1, this audit can flag both design drift and canonical drift with full context.
3. **ETF audit third** (the audit-etfframework.md prompt). Same advantage; also catches any ecosystem-level drift where ETF has moved away from the shared canonicals.

Running them in this order means each subsequent audit references the previous one's findings. If you run them out of order, you end up with site audits that flag problems the shared audit would have already caught, and you waste cycles.

Budget: roughly 30 to 45 minutes for the shared audit depending on how many cross-repo comparisons Claude has to make. Longer if the repos are large or if you have a lot of pages with canonical references.
