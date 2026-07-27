# Batch 3 — llms.txt Integrity Audit

**Canonical source:** `~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md` §"llms.txt canonical content" (lines 133–198).
**Target surfaces:** `https://6identities.com/llms.txt` · `https://etfframework.com/llms.txt` · in-repo sources on both sites.
**Executed:** 2026-04-18T (UTC — live fetches via WebFetch and `curl -sI`).

Legend — *Consistency*: `pass` · `drift (MINOR)` · `drift (MAJOR)` · `contradiction (CRITICAL)` · `needs-human-review` · `not referenced`.

---

## Headline finding

**Both `llms.txt` files are entirely absent.** 404 on live domains, no file in either repo, no Next.js route handler serving them. Per the audit plan's rule (*"Missing file = CRITICAL"*), both findings are CRITICAL.

---

## Section 1 — Live fetch results

### Fetch: `https://6identities.com/llms.txt`

**Method:** WebFetch (primary) + `curl -sI` (independent verification).
**Timestamp:** 2026-04-18T (audit session, UTC).
**Result:** `HTTP/2 404` (both methods agree).
**Headers:** `accept-ranges: bytes`, `access-control-allow-origin: *` — no `content-type: text/plain`; the 404 is the Vercel/Next.js default not-found response.
**Body:** none.

#### Match: 6i llms.txt file present on live domain

**Canonical location:** `ecosystem-copy.md:137–164` (full template).
**Canonical definition:** `# 6 Identities\n\nThe assessment and 90-day plan for former athletes. …` (~27 lines including pricing block, sections block, related block).
**Found in:** `https://6identities.com/llms.txt` — **not found** (404).
**Site version:** file does not exist.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical publishes the full file template and the llms.txt maintenance rule (line 196–198): *"Drift between the two llms.txt files will cause AI systems to give inconsistent answers about the ecosystem, which damages both brands."* Absence of the file is total drift — AI crawlers receive no ecosystem context at all.

### Fetch: `https://etfframework.com/llms.txt`

**Method:** WebFetch (primary) + `curl -sI` (independent verification).
**Timestamp:** 2026-04-18T (audit session, UTC).
**Result:** `HTTP/2 404` (both methods agree).
**Headers:** `accept-ranges: bytes`, `access-control-allow-origin: *`.
**Body:** none.

#### Match: ETF llms.txt file present on live domain

**Canonical location:** `ecosystem-copy.md:168–194` (full template).
**Canonical definition:** `# ETF: The Operating System for Athlete Transition\n\nThe Executable Transition Framework (ETF) is the operating system for athlete transition. …` (~28 lines including key facts, sections, related).
**Found in:** `https://etfframework.com/llms.txt` — **not found** (404).
**Site version:** file does not exist.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Same as 6i above. The ETF template is the only surface on which canonical sanctions the phrase *"operating system for athlete transition"* as a defining claim — absent from a file whose purpose is AI-crawler canonicalization.

---

## Section 2 — In-repo source verification

### Match: `ETFtestSite/public/llms.txt`

**Canonical location:** file should exist to deploy to `/llms.txt` under Next.js static-file serving.
**Canonical definition:** `ecosystem-copy.md:137–164` template.
**Found in:** Glob `public/llms.txt` → 0 matches. Extended Glob `**/llms*` → 0 matches in the entire 6i repo (no fallback route handler, no staging copy, no `src/app/llms.txt/route.ts` either).
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** File does not exist in source control. Live 404 is a deployment truth, not a CDN glitch.

### Match: `etfframework/public/llms.txt`

**Canonical location:** file should exist to deploy to `/llms.txt` under Next.js static-file serving.
**Canonical definition:** `ecosystem-copy.md:168–194` template.
**Found in:** Glob `public/llms.txt` → 0 matches. Extended Glob `**/llms*` → 0 matches in the entire ETF repo (no fallback route handler).
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Same as above. Not a deploy-time drift — the file was never committed.

---

## Section 3 — Canonical template checks that became N/A

The planned sub-checks for Batch 3 presumed the files existed. With both files absent, every sub-check collapses to "cannot be evaluated." Declaring them explicitly for `/harden` traceability:

| Sub-check | Target | Applicable? | Note |
|---|---|---|---|
| Canonical key facts match (pricing, cycle length, certification details, citations) | both llms.txt | **N/A** | file absent |
| 6i does NOT use phrase `"operating system for athlete transition"` | 6i llms.txt | **N/A** | file absent |
| ETF DOES use phrase `"operating system for athlete transition"` | ETF llms.txt | **N/A** | file absent |
| Both files link to the other domain in Related section | both llms.txt | **N/A** | files absent |
| Section URLs are complete and not stale | both llms.txt | **N/A** | files absent |
| In-repo source matches deployed version | both llms.txt | **N/A** — MAJOR escalated to CRITICAL | no in-repo source OR deployed copy |

Every N/A above is downstream of the two CRITICAL absences; they do not add independent findings.

---

## Section 4 — Cross-referenced canonical facts that should appear in the llms.txt files

Since both files are missing, these canonical facts are **not discoverable by AI crawlers**:

- **Pricing (consumer):** free assessment, $9.99 Core Code Archetype, $29.99 Full Package, Way Forward Guides range (canonical-definitions.md via SKILL.md).
- **Pricing (professional):** $99 one-time enrollment, $49/year recertification, $19.99/month portal access, $5.99 per extra assessment link.
  - Reminder per Batch 1 rubric: etf-core's `PRICE_MAP` ships practitioner_portal at $49.00/mo, not the canonical $19.99/mo (CRITICAL, tracked in Batch 4 / Master).
- **Academic grounding:** Brewer/Van Raalte/Linder 1993 (appears in both canonical templates), Schlossberg 1981 (ETF template only), Matveyev 1977/Bompa & Buzzichelli 2019 (ETF template only).
- **Eight components (canonical names):** Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution (ETF template only).
  - Reminder: site ships `The Build™, Core Code™, People, Community, The Dashboard™, The Block List™, Process, Moves™` — separately flagged CRITICAL in Batch 1.
- **Scope of practice statement.**
  - Reminder: absent from the live sites and the canonical llms.txt template — but canonical template for ETF llms.txt does include scope compressed (line 183): *"Scope: structured transition framework, not clinical mental health care. Practitioners work within the scope of their existing licensure or credential."*
- **Cross-links between domains:** 6i→ETF in Related section and ETF→6i in Related section are both absent from discoverability because the files do not exist.

---

## Section 5 — Severity rollup

| Severity | Count |
|---|---|
| CRITICAL (contradiction) | 4 |
| MAJOR | 0 |
| MINOR | 0 |
| needs-human-review | 0 |
| not referenced (explicit) | 0 |
| N/A (collapsed downstream of CRITICAL) | 6 |
| pass | 0 |
| **distinct findings** | **4** |

(Four distinct findings: each of two sites × live-missing and repo-missing. Downstream N/A sub-checks counted separately and do not inflate the tally.)

---

## Section 6 — Recommendations surfaced for Master Report

1. **Master item 2 (CRITICAL, 6i):** commit `ETFtestSite/public/llms.txt` using canonical template `ecosystem-copy.md:137–164`. Deploy. Verify `https://6identities.com/llms.txt` returns 200 with `text/plain`.
2. **Master item 2 (CRITICAL, ETF):** commit `etfframework/public/llms.txt` using canonical template `ecosystem-copy.md:168–194`. Deploy. Verify `https://etfframework.com/llms.txt` returns 200 with `text/plain`.
3. **Master item 5 (propagation order):** Batch 1/2 findings will rewrite canonical definitions and copy. The llms.txt files must be authored **after** that canonical resolution so the committed files reflect the final taxonomy and citation set. Do NOT ship the canonical template verbatim today — it encodes the Commander/Craftsman/… taxonomy that the sites do not use (see Batch 1 CRITICAL).
4. **Master item 2 (CRITICAL, both):** once files ship, add a CI check (simple `curl -f https://[domain]/llms.txt` in a nightly job) so regression silence cannot repeat this outcome.

End of Batch 3.
