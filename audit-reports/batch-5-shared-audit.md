# Batch 5 — Cross-Site Voice Drift Audit

**Canonical sources:**
- `~/.claude/skills/etf-brand-shared/SKILL.md` §"The hero copy canonical"
- `~/.claude/skills/etf-brand-messaging/references/trademark-placement.md` (strip test; term-by-term table; site-specific rules)
- `~/.claude/skills/etf-brand-shared/references/canonical-definitions.md` §"The For Practitioners gateway page"

**Sites audited:** `https://6identities.com/` + `/professionals` · `https://etfframework.com/` + `/methodology` · live footers on both domains.
**Executed:** 2026-04-18T (UTC; live WebFetch).

Legend — *Consistency*: `pass` · `drift (MINOR)` · `drift (MAJOR)` · `contradiction (CRITICAL)` · `needs-human-review` · `not referenced`.

---

## Headline finding

The **6i homepage hero matches the copy that `trademark-placement.md:84–88` explicitly labels "Incorrect"** — including an inappropriate Level-2 trademark (`The Six™`) in a Level-0 first-touch surface. The canonical hero copy (*"It's 10 a.m. on a Tuesday…"*) is entirely absent. The **ETF homepage hero drifts toward 6i's editorial register** (intensity ≈ 5/10 instead of target 2/10), partially collapsing the canonical voice asymmetry. The canonical `/for-practitioners` URL returns 404; the gateway page has been moved to `/professionals`, and its copy paraphrases canonical's required subhead (swapping *"systems failure"* for *"identity crisis"*).

---

## Section 1 — 6i homepage hero

#### Match: canonical 6i hero vs live site

**Canonical location:** `etf-brand-shared/SKILL.md` §"The hero copy canonical."
**Canonical definition:**
> **Headline:** *It's 10 a.m. on a Tuesday and you don't know what to do.*
> **Subhead:** *Ten minutes. One assessment. A read on which of the six types you're running, and a 90-day plan you can start tonight.*
> **CTA:** *Start the assessment →*
> **Microcopy:** *Free. 10 minutes. No credit card.*

**Found in:** `https://6identities.com/` (live fetch, 2026-04-18T).
**Site version:**
> **H1:** *You left the sport. The pattern didn't.*
> **Subhead:** *Find out which of The Six™ trademark you're running — and what to work on first.*
> **CTA:** *Start the assessment*
> **Microcopy:** *Free — under 10 minutes*

**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:**
- H1 is entirely different copy. Canonical's "10 a.m. on a Tuesday" anchors a specific post-career moment; site's "left the sport / pattern didn't" is a different thesis. Not paraphrase; different angle.
- Subhead drops canonical's explicit promise ("Ten minutes. One assessment. … a 90-day plan you can start tonight.") and substitutes "The Six™" trademark.
- CTA missing the trailing `→`.
- Microcopy missing "No credit card" — retention-relevant since canonical's first-touch reader wants certainty.

#### Match: `The Six™` trademark in subhead (Level-2 term in Level-0 surface)

**Canonical location:** `trademark-placement.md:50` ("The Six™ — Level 2 — Only appears after the reader has taken the assessment or read 'How it works.' Never in a first-touch hero.").
**Canonical definition:** strip test on hero subhead should remove any Level-2 term.
**Found in:** `https://6identities.com/` subhead. Canonical `trademark-placement.md:84–88` names this exact hero as an **Incorrect example**:
> **Incorrect (the current hero):**
> *You left the sport. The pattern didn't.*
> *Find out which of The Six™ you're running, and what to work on first.*

**Site version:** matches the incorrect example verbatim (plus the literal word "trademark" appears to leak through the WebFetch summary — see next finding).
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical documents this exact copy as a known wrong pattern. The site has not been updated. Strip test fails: *"Find out which of the six types you're running, and what to work on first."* (canonical-suggested replacement at line 156) is clearer without the trademark.

#### Match: rendered "trademark" word next to ™ mark

**Canonical location:** trademark marks render via `<abbr>` or component (site uses `<TM name="SixIdentities" />` component seen in `ETFtestSite/src/app/page.tsx:197`).
**Canonical definition:** the ™ superscript should render; the literal word "trademark" should never appear in visible hero text.
**Found in:** live WebFetch returned text *"Find out which of The Six™ trademark you're running"* — the word *"trademark"* appears adjacent to the ™ mark in the rendered output.
**Site version:** as above.
**Consistency:** **contradiction (CRITICAL)** — likely a rendering bug.
**Severity justification:** Either the `<TM />` component emits `<abbr title="trademark">` which WebFetch surfaces as adjacent text (suggesting screen-reader or tooltip text is leaking), or the visible hero literally contains the word. Either interpretation is a hero-copy defect visible to sighted readers, crawlers, or assistive technology.

#### Match: hero-copy audit test (strip the trademark, read what remains)

**Canonical location:** `trademark-placement.md:132–143`.
**Canonical definition:** strip the trademark; if the sentence still makes sense, the trademark was decorative. If it doesn't, the trademark was masking ambiguity.
**Found in:** site subhead stripped = *"Find out which of the six you're running — and what to work on first."*
**Site version:** stripped sentence is ambiguous ("six what?"). Canonical `trademark-placement.md:149–154` uses this exact ambiguity as the teaching example. Canonical repair: add *"six types"* in plain language.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical has already documented this as the failure mode. Repair is `"six types"` (plain-language, Level-0 acceptable).

---

## Section 2 — ETF homepage hero

#### Match: canonical ETF hero vs live site

**Canonical location:** `etf-brand-shared/SKILL.md` §"The hero copy canonical" (end of file).
**Canonical definition:**
> **Headline:** *Sports psychology treats athletes during competition. ETF™ treats them after.*
> **Subhead:** *A diagnostic, a framework, and a certified delivery layer. Built for therapists, coaches, and practitioners working with athletes after the career ends.*
> **CTA:** *Become ETF Certified — $99*
> **Secondary:** *Read the methodology*

**Found in:** `https://etfframework.com/` (live fetch, 2026-04-18T).
**Site version:**
> **H1:** *The operating system for athlete transition.*
> **Subhead:** *A credentialed protocol for practitioners working with former athletes — methodology you license, not philosophy you have to adopt.*
> **CTA:** *Start certification*
> **Secondary:** *Review the methodology*
> **Microcopy:** *A category, not a coaching style.*

**Consistency:** **drift (MAJOR)**.
**Severity justification:**
- H1 uses canonical's sanctioned ETF frame (*"operating system for athlete transition"* is ETF-only phrase — good trademark scoping). But canonical's specific juxtaposition-against-sports-psychology is gone.
- Subhead drops canonical's trichotomy (*"diagnostic, framework, certified delivery layer"*) and replaces with a license/methodology framing.
- CTA: *"Start certification"* (site) ≠ *"Become ETF Certified — $99"* (canonical). Canonical embeds the price in the CTA — a Level-0 trust signal. Site omits it.
- Secondary CTA *"Review the methodology"* (site) ≠ *"Read the methodology"* (canonical). MINOR synonym drift.
- Microcopy *"A category, not a coaching style."* is not in canonical. Additive editorial line.

#### Match: voice register — intensity rating

**Canonical location:** plan rubric + `voice-etfframework.md`.
**Canonical definition:** ETF target intensity **2/10 institutional/restrained**. Citations over claims. Evidence-based.
**Found in:** live ETF hero.
**Site version:**
- *"The operating system for athlete transition."* — declarative, short, assertive category claim. Reads editorial, not institutional.
- *"A credentialed protocol for practitioners… methodology you license, not philosophy you have to adopt."* — the *"philosophy you have to adopt"* half is editorial positioning against a strawman, not institutional restraint. Rhetorical punch.
- Estimated intensity: **~5/10**.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** ETF hero drifts +3 points above canonical target. The anti-coaching positioning ("not philosophy you have to adopt", "not a coaching style") is rhetorically confrontational — an editorial move appropriate on 6i's consumer side, less appropriate on ETF's institutional-trust register.

#### Match: swap test

**Canonical location:** plan rubric (Step 3) + `voice-etfframework.md` (voice asymmetry doctrine).
**Canonical definition:** *"Would swapping the two heros between sites feel correct on the other site? If yes → CRITICAL voice collapse."*
**Found in:** swap evaluation conducted on both heros.
**Site version:**
- **6i hero → ETF site:** *"You left the sport. The pattern didn't."* on ETF would feel too personal and emotive for a practitioner audience expecting a framework claim. **Does NOT swap cleanly.**
- **ETF hero → 6i site:** *"The operating system for athlete transition."* on 6i would feel abstract/corporate for the 2 a.m. post-career athlete reader, but *"A category, not a coaching style."* microcopy is editorial enough to feel 6i-native. **Partial swap** — ETF's editorial punch could migrate to 6i.

**Consistency:** **drift (MAJOR)** → partial voice collapse on ETF side.
**Severity justification:** Canonical rule is "if yes → CRITICAL voice collapse." This is not "yes" (bidirectional interchangeability); it's "partial yes" (one-directional migration). Downgrade to MAJOR rather than CRITICAL, but flag as trending toward collapse.

#### Match: `ETF™` placement (Level 0 on ETF site)

**Canonical location:** `trademark-placement.md:52, 115–121`.
**Canonical definition:** `ETF™` is Level-0 on the ETF site (the brand name IS the category claim). Canonical hero uses `ETF™`.
**Found in:** live ETF hero. Neither H1 nor subhead uses the `ETF™` mark — H1 is *"The operating system for athlete transition."* (no ETF mention at all).
**Site version:** no ETF™ mark in hero copy.
**Consistency:** **drift (MINOR)**.
**Severity justification:** Canonical encourages the mark in the hero; site omits it. Not a violation (the mark is allowed, not required), but it means the hero doesn't carry the category-claim marker canonical designs for.

---

## Section 3 — For Practitioners gateway page (6i)

#### Match: canonical `/for-practitioners` URL

**Canonical location:** `canonical-definitions.md:219–254` §"The For Practitioners gateway page"; `etf-brand-shared/SKILL.md` §"The 'For Practitioners' page on 6i."
**Canonical definition:** path `/for-practitioners`.
**Found in:** `https://6identities.com/for-practitioners` — **HTTP 404** (live fetch, 2026-04-18T).
**Site version:** page has been moved/renamed to `/professionals` (live footer links to `/professionals` with label *"For Practitioners"*).
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical path is dead. The content exists at `/professionals` but the rename was not documented in canonical. Either canonical needs to update the path, or a redirect from `/for-practitioners` → `/professionals` must ship.

#### Match: Section 1 hero — H1

**Canonical location:** `canonical-definitions.md:226`.
**Canonical definition:** *"The missing framework for athlete transition."* (sentence case).
**Found in:** `https://6identities.com/professionals` H1.
**Site version:** *"The Missing Framework for Athlete Transition"* (Title Case).
**Consistency:** **drift (MINOR)**.
**Severity justification:** Verbatim word match; only capitalization differs. Canonical's sentence-case is more editorial-consistent with 6i voice register; site's title-case is standard H1 convention. Low-severity stylistic drift.

#### Match: Section 1 hero — subhead

**Canonical location:** `canonical-definitions.md:227` — exact subhead.
**Canonical definition:**
> *Most practitioners working with athletes in transition use generic personality tools designed for corporate settings. Athletes aren't experiencing a career change; they're experiencing a systems failure. 6 Identities gives practitioners a framework built for this specific population, and a shared language with their clients from session one.*

**Found in:** live `/professionals` page.
**Site version:**
> *Most practitioners working with athletes in transition use generic personality tools designed for corporate settings. Athletes aren't experiencing a career change — they're experiencing an identity crisis. Different problem. Different tool. 6 Identities gives you a shared language with your clients and a structured framework from session one.*

**Consistency:** **drift (MAJOR)**.
**Severity justification:**
- Sentence 2 swaps canonical **"systems failure"** → site **"identity crisis"**. This is a load-bearing keyword: "systems failure" is canonical's signature framing for what career-end actually is (canonical-definitions.md, founder bio, press-kit boilerplate all use it). "Identity crisis" is a weaker, more commonplace framing.
- Sentence 2 adds *"Different problem. Different tool."* (rhetorical flourish not in canonical).
- Sentence 3 swaps canonical **"gives practitioners a framework built for this specific population"** → site **"gives you a shared language with your clients and a structured framework from session one"**. Changes from third-person institutional to second-person direct. 6i voice register permits "you" — this is voice-native and acceptable direction.

The aggregate paraphrase is more editorial than canonical's. Acceptable on 6i register BUT the **"systems failure" → "identity crisis"** swap changes the conceptual claim.

#### Match: Section 5 CTA — canonical says "Visit etfframework.com →"

**Canonical location:** `canonical-definitions.md:247`.
**Canonical definition:** Section 5 CTA *"Visit etfframework.com → for full certification details."* — certification details are ETF's responsibility.
**Found in:** live `/professionals` page CTAs include *"Start certification"* pointing to `/professionals/certification` (6i-internal URL).
**Site version:** certification flow stays on 6i.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical says the gateway page should send practitioners to etfframework.com for certification; 6i keeps the flow on its own domain. This is consistent with the Batch 4 Stripe `successUrl` routing finding (implementer_cert success URL is 6i-hosted). Architectural transition acknowledged in `etf-core/src/commerce/priceMap.ts:65–67` TODO comment.

#### Match: Compound code preview on gateway page (Level 2 content)

**Canonical location:** `canonical-definitions.md:236–238` §"Section 3 — The Professional View preview" — compound code card belongs here.
**Canonical definition:** `CP-AU-XUA` format displayed as preview component.
**Found in:** live `/professionals` page — *"Detailed compound code Full 3-layer assessment (CP-AU-XUA) with detailed scoring."*
**Site version:** CP-AU-XUA compound code shown.
**Consistency:** **pass**.
**Severity justification:** Canonical places compound code at Level 2 (not in first-touch hero). The gateway page is Level 1-to-2 territory — compound code appears in Section 1 body copy which is Level 1, slightly early per placement table (Level 2) but the reader has just read the H1+subhead, which is close enough. Acceptable.

#### Match: canonical requires 6i voice register on this page (including trademarks)

**Canonical location:** `canonical-definitions.md:252–256`.
**Canonical definition:** 6i voice (Germanic, 25-word cap, intensity 6/10); trademarks `ETF™`, `ETF Certified Practitioner™`, `Executable Transition Framework™` are earned on this page.
**Found in:** WebFetch confirms `ETF™` present. Voice reads direct, editorial — consistent with 6/10 6i register.
**Site version:** matches canonical voice spec.
**Consistency:** **pass**.

---

## Section 4 — ETF methodology page (first screen)

#### Match: methodology page H1 + subhead

**Canonical location:** `canonical-definitions.md:73` (eight components list) + `page-blueprints.md` (methodology page blueprint — not re-read; relying on rubric).
**Canonical definition:** canonical eight components by name (Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution). Page must include scope-of-practice (from Batch 2), Schlossberg + Matveyev/Bompa citations (from Batch 2).
**Found in:** `https://etfframework.com/methodology` live fetch.
**Site version:**
> **H1:** *The Executable Transition Framework, explained.*
> **Subhead:** *Three deep dives into the methodology: the eight components that make up the framework, the 90-day cyclical architecture that delivers them, and Core Code™ — the proprietary values-clarification tool at the center of the system.*
> **8 Components preview card:** *The eight pillars that structure identity reconstruction: The Build™, Core Code™, People, Community, The Dashboard™, The Block List™, Process, and Moves™.*

**Consistency:** **contradiction (CRITICAL)** (via Batch 1 taxonomy drift — already flagged).
**Severity justification:** This page surfaces the eight components with the non-canonical names (`The Build™`, `Core Code™`, `People`, `The Dashboard™`, `The Block List™`, `Moves™`). Batch 1 already marked this CRITICAL. No new finding; cross-reference only. No addition to Batch 5 severity tally.

#### Match: voice register on methodology page

**Canonical location:** `voice-etfframework.md` — institutional, restrained, 2/10 intensity.
**Canonical definition:** restrained, expert, third-person, citation-present.
**Found in:** live methodology page first screen.
**Site version:** *"The Executable Transition Framework, explained."* — title case, short, declarative. *"Three deep dives into the methodology…"* — sober. No first-person. No rhetorical confrontation. Reads close to canonical 2–3/10 institutional.
**Consistency:** **pass** (for this page specifically).
**Severity justification:** The methodology page voice is correctly restrained. The drift is concentrated in the homepage hero; downstream pages are on-register.

---

## Section 5 — Footers on both domains

#### Match: 6i footer cross-link to ETF

**Canonical location:** `etf-brand-shared/SKILL.md` §"From 6identities.com to etfframework.com" — line: *"Are you a therapist, coach, or practitioner working with athletes? Visit etfframework.com."*
**Canonical definition:** that exact copy + UTM `?utm_source=6identities&utm_medium=cross_brand&utm_campaign=footer`.
**Found in:** live 6i footer does NOT surface a "Built on the Executable Transition Framework (ETF™) →" line in WebFetch output; source `Footer.tsx:89–107` shows the link is conditionally rendered on `process.env.NEXT_PUBLIC_ETF_FRAMEWORK_URL`. Footer has a `/careers` link pointing to `https://etfframework.com/careers` (confirmed live).
**Site version:** cross-link copy paraphrased; UTM absent.
**Consistency:** **drift (MAJOR)** for copy, **contradiction (CRITICAL)** for UTM absence (already flagged in Batch 4 — cross-reference).
**Severity justification:** see Batch 4 Section 3. No new severity-bearing finding.

#### Match: ETF footer cross-link to 6i

**Canonical location:** `etf-brand-shared/SKILL.md` §"From etfframework.com to 6identities.com" — line: *"The consumer-facing diagnostic assessment is hosted at 6identities.com."*
**Canonical definition:** that exact copy + UTM `?utm_source=etfframework&utm_medium=cross_brand&utm_campaign=footer`.
**Found in:** live ETF footer (confirmed) has *two* cross-links:
- *"Part of the 6 Identities network ↗"* → `https://6identities.com` (no UTM).
- *"Take the 6 Identities assessment →"* → `https://6identities.com/assessment?ref=etfframework` (non-canonical `ref=` parameter).

Source: `etfframework/src/components/Footer.tsx:152–160, 166–175`.
**Site version:** cross-link exists (contrary to Batch 4 Section 3 false-positive), but:
- Copy does not match canonical line.
- UTM schema uses custom `?ref=etfframework` instead of canonical UTM triple.

**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical cross-link line is paraphrased; UTM schema drifts from canonical `utm_source/utm_medium/utm_campaign`. The presence of the link is correct (canonical says this footer must carry a cross-link).

> **Correction to Batch 4 Section 3 finding "ETF footer has no cross-link":** the link exists at `Footer.tsx:152–160` and `166–175`, past the line range I originally read. Batch 4's CRITICAL grade on that item should be demoted to MAJOR (copy paraphrase + non-canonical UTM schema). See `/harden` notes in Master Report.

#### Match: ETF footer trademark placement

**Canonical location:** `trademark-placement.md:67–68` (site-specific rules) + Level-1 allowance.
**Canonical definition:** `6 Identities®` and `ETF™` can both appear on ETF footer.
**Found in:** live ETF footer uses *"6 Identities network"* (no `®` mark in the link text).
**Site version:** no trademark mark.
**Consistency:** **drift (MINOR)**.
**Severity justification:** Canonical treats `6 Identities®` as a Level-0/1 term that can appear anywhere; the `®` mark is absent from the ETF footer cross-link. Low-impact stylistic drift.

---

## Section 6 — Copyright + legal text on both footers

#### Match: 6i footer legal disclaimer

**Canonical location:** Batch 2 Section 2 flagged paraphrase drift on scope-of-practice; 6i footer's *"6 Identities is a structured self-reflection and development system…"* is a 6i-specific legal disclaimer, not the canonical scope-of-practice statement.
**Canonical definition:** separate in scope — canonical scope-of-practice is required on ETF methodology/certification/portal; 6i footer disclaimer is a different site-level risk mitigation.
**Found in:** live 6i footer.
**Site version:** 6i-specific disclaimer; canonical does not explicitly require this block but also does not sanction a specific form.
**Consistency:** **needs-human-review**.
**Severity justification:** Canonical is silent on whether 6i needs its own footer disclaimer in addition to the ETF-scope-of-practice mandate. Leave as-is; flag for canonical to address in Master item 6.

#### Match: ETF footer disclaimer

**Canonical location:** canonical does not require a footer disclaimer on ETF (canonical places scope-of-practice on methodology/certification pages).
**Canonical definition:** — (silent).
**Found in:** ETF footer contains only copyright + privacy/terms links + ecosystem attribution. No disclaimer block visible.
**Site version:** minimal footer legal.
**Consistency:** **not referenced**.
**Severity justification:** Canonical doesn't require this; Batch 2's CRITICAL absence-of-scope-of-practice applies to methodology/certification pages, not footer.

---

## Section 7 — Severity rollup

| Severity | Count |
|---|---|
| CRITICAL (contradiction) | 5 |
| MAJOR (drift of required form) | 6 |
| MINOR (paraphrase/low-impact drift) | 3 |
| needs-human-review | 1 |
| not referenced (explicit) | 1 |
| pass | 3 |
| **total findings (new)** | **19** |

(Cross-references to Batch 1 taxonomy drift and Batch 4 UTM/FAQ findings are NOT double-counted.)

---

## Section 8 — `/impeccable` rigor check (Batch 5 additional rule)

Canonical rule for Batch 5: voice separation must be unmistakable; strip test applied rigorously; swap test answered with high confidence.

**Strip test — 6i hero:** *"Find out which of the six you're running — and what to work on first."* Ambiguous (six what?). Fails strip test. Canonical-documented failure (trademark-placement.md line 149). **High confidence: FAIL.**

**Strip test — ETF hero:** *"The operating system for athlete transition."* (no trademark to strip from H1.) *"A credentialed protocol for practitioners working with former athletes — methodology you license, not philosophy you have to adopt."* (no trademarks in subhead either.) No strip needed. **Passes trivially, but — voice drift remains.**

**Swap test:** 6i → ETF = fails (wrong register for practitioners). ETF → 6i = partial pass (ETF's editorial punch could migrate). **High confidence: voice asymmetry is partially collapsed on ETF side.**

**Uncertainty flags:** none — all findings are evidenced from verbatim fetch output. No guess-flagging required.

---

## Section 9 — Recommendations surfaced for Master Report

### CRITICAL

1. **Master item 2 (CRITICAL, 6i homepage):** replace the live hero copy with canonical. Canonical H1 *"It's 10 a.m. on a Tuesday and you don't know what to do."* and canonical subhead/CTA/microcopy as declared in `etf-brand-shared/SKILL.md`. Remove the `The Six™` trademark from the subhead (Level-2 term in Level-0 surface).
2. **Master item 2 (CRITICAL, 6i):** investigate why the live hero renders the literal word *"trademark"* adjacent to the ™ mark. Inspect the `<TM name="SixIdentities" />` component (`ETFtestSite/src/components/...`) — likely an `<abbr>` or `aria-label` bug.
3. **Master item 2 (CRITICAL, 6i):** add a redirect from `/for-practitioners` → `/professionals` OR update canonical to reflect the `/professionals` path. The canonical URL is live-404.

### MAJOR

4. **Master item 3 (MAJOR, ETF homepage):** rewrite the ETF hero to match canonical *"Sports psychology treats athletes during competition. ETF™ treats them after."* The current hero omits the category-juxtaposition and the CTA price. Restore `ETF™` mark and the `Become ETF Certified — $99` CTA.
5. **Master item 3 (MAJOR, ETF):** lower ETF homepage voice intensity from ~5/10 back to canonical 2/10. Strip anti-coaching rhetorical moves (*"methodology you license, not philosophy you have to adopt"*, *"A category, not a coaching style."*). Replace with institutional restraint.
6. **Master item 3 (MAJOR, 6i /professionals):** restore the canonical "systems failure" keyword in the subhead (currently swapped with "identity crisis"). Canonical's framing is load-bearing — the whole canonical copy stack references systems failure.
7. **Master item 3 (MAJOR, 6i /professionals):** the Section 5 certification CTA should link to etfframework.com (canonical) or canonical must accept the 6i-hosted transition. Flag for architectural decision (ties to `priceMap.ts:65–67` TODO).
8. **Master item 3 (MAJOR, ETF footer):** rewrite cross-link copy to canonical line *"The consumer-facing diagnostic assessment is hosted at 6identities.com."* Replace the `?ref=etfframework` attribution with canonical UTM triple.

### MINOR

9. **Master item 4 (MINOR, 6i /professionals):** consider sentence-case H1 *"The missing framework for athlete transition."* per canonical — or accept title-case as a 6i-voice-consistent variant.
10. **Master item 4 (MINOR, ETF homepage):** restore `ETF™` mark in the subhead (current hero omits the mark entirely from hero copy).
11. **Master item 4 (MINOR, ETF footer):** add `®` mark to the *"6 Identities"* cross-link text.

### Canonical expansion

12. **Master item 6 (canonical):** canonical URL `/for-practitioners` is stale; update to `/professionals` if the rename is intentional.
13. **Master item 6 (canonical):** canonical should state whether the 6i footer needs its own legal disclaimer block (currently in-place but not canonically-specified).

End of Batch 5.
