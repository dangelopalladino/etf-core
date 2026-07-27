# Batch 2 — Ecosystem Copy Audit

**Canonical source:** `~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md`
**Sites audited:** `ETFtestSite` (6i), `etfframework` (ETF), and `etf-core` (shared library)
**Executed:** 2026-04-18 (static code scan; no network fetches)

Legend — *Consistency*: `pass` · `drift (MINOR)` · `drift (MAJOR)` · `contradiction (CRITICAL)` · `needs-human-review` · `not referenced`.

---

## Headline finding

The **scope-of-practice statement is entirely absent from both sites** (CRITICAL). Two of three canonical academic citations (**Schlossberg**, **Matveyev/Bompa**) are absent from ETF methodology surfaces where canonical requires them. The canonical **"built by someone who went through it" proof block** (51 words, must not be paraphrased) is absent from both sites. Founder bios on ETF do not match any of three approved lengths.

---

## Section 1 — Academic citations

Canonical declares three primary citations required on specific pages (`ecosystem-copy.md:40–92`).

### Citation 1 — Brewer, Van Raalte & Linder (1993)

#### Match: APA full citation on ETF research page

**Canonical location:** `ecosystem-copy.md:48`.
**Canonical definition:** `Brewer, B. W., Van Raalte, J. L., & Linder, D. E. (1993). Athletic identity: Hercules' muscles or Achilles heel? International Journal of Sport Psychology, 24(2), 237–254.` (italics on journal title).
**Found in:** `etfframework/src/app/research/page.tsx:37–41`.
**Site version:** `authorName: 'Brewer, B. W., Van Raalte, J. L., & Linder, D. E.'` + `headline: "Athletic identity: Hercules' muscles or Achilles heel?"` + `datePublished: '1993'` + `publisher: 'International Journal of Sport Psychology'`.
**Consistency:** **drift (MINOR)**.
**Severity justification:** Authors, title, year, publisher all verbatim. Typographic apostrophe `'` in `Hercules'` differs from canonical straight apostrophe `'`. Structured JSON-LD cannot express italics; journal title is expressed via `publisher` field instead of inline italicization — acceptable for schema.org schema. Volume/issue/pages (24(2), 237–254) absent from schema but schema does not require them.

#### Match: short reference in prose

**Canonical location:** `ecosystem-copy.md:52` — canonical short form: `Brewer, Van Raalte & Linder (1993)` (ampersand, no serial comma).
**Canonical definition:** exact short form with `&`.
**Found in (ETF):** `etfframework/src/app/research/page.tsx:124` — `<cite>Brewer, Van Raalte, and Linder (1993)</cite>`.
**Found in (ETF):** `etfframework/src/app/about/page.tsx:61` — `(Brewer, Van Raalte &amp; Linder, 1993; …)` — HTML-encoded ampersand renders as `&`, matches canonical form.
**Found in (ETF):** `etfframework/src/app/our-results/page.tsx:49` — `(Brewer, Van Raalte …)` (truncated in grep; requires inspection).
**Found in (ETF):** `etfframework/src/app/our-approach/page.tsx:57` — `(Brewer et …)` — paraphrase as `Brewer et al.`.
**Found in (6i):** `ETFtestSite/src/app/research/page.tsx:67` — `Since Brewer, Van Raalte, and Linder (1993) introduced the Athletic Identity…` (serial `, and`, no `&`).
**Site version:** inconsistent: `Brewer, Van Raalte, and Linder` (serial+and), `Brewer, Van Raalte & Linder` (canonical), and `Brewer et al.` appear across surfaces.
**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical declares citations are *verbatim-required* (`ecosystem-copy.md:246`). Short-form uses the ampersand `&` and no serial comma. Both sites deviate on at least one surface. The `&amp;`→`&` rendering on `/about` is compliant. `Brewer et al.` is APA-acceptable but not the canonical short form.

#### Match: wrong-citation variant "Brewer and Cornelius"

**Canonical location:** canonical sanctions only Brewer, Van Raalte & Linder (1993); it does not sanction other Brewer co-authors.
**Canonical definition:** — (a different paper is not approved).
**Found in:** `ETFtestSite/src/app/guide/GuideContent.tsx:125` — *"Research by Brewer and Cornelius found that athletes who strongly identify with their athletic role experience significantly more distress during career transition."*
**Site version:** cites Brewer & Cornelius (a real separate paper — 2001, AIMS norms) rather than Brewer/Van Raalte/Linder.
**Consistency:** **contradiction (CRITICAL)** → **canonical expansion candidate (Master item 6)**.
**Severity justification:** Canonical requires verbatim citations. Site is referencing a different, legitimate, but *unapproved* Brewer paper. Either (a) the site is wrong and must use the canonical Brewer citation, or (b) canonical must expand to permit the broader Brewer research corpus. Defer to human decision.

#### Match: extended citation set on both research pages

**Canonical location:** canonical lists 3 citations; these pages list 7.
**Canonical definition:** Brewer (1993); Schlossberg (1981); Matveyev (1977) + Bompa (2019).
**Found in:** `etfframework/src/app/research/page.tsx:42–74` and changelog evidence in `ETFtestSite/docs/plans/changelog.md:200`. Schema-array entries: Lochbaum 2022, Haslam 2021, Sheldon & Elliot 1999, Gollwitzer 1999, Wood & Neal 2016, Volkow 2019.
**Site version:** 1 of 3 canonical (Brewer) + 6 additional citations.
**Consistency:** **drift (MAJOR)** with canonical-expansion recommendation.
**Severity justification:** Sites have a substantially richer evidence base than canonical documents. This is likely canonical-expansion (Master item 6); sites are not wrong for citing legitimate peer-reviewed research, but canonical's single-source declaration is stale.

### Citation 2 — Schlossberg (1981)

#### Match: Schlossberg citation on ETF methodology page

**Canonical location:** `ecosystem-copy.md:64` — full APA citation; required on ETF Methodology page per line 74 (*"Where it appears: ETF Methodology page (required)"*).
**Canonical definition:** `Schlossberg, N. K. (1981). A model for analyzing human adaptation to transition. The Counseling Psychologist, 9(2), 2–18.`
**Found in:** grep for `Schlossberg` in `etfframework/src/**/*.{ts,tsx,md,mdx,txt}` returned **0 production-code matches**. Only skill references mention it.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical places this citation under "required" on the ETF methodology page. The ETF methodology page (`etfframework/src/app/methodology/page.tsx`) is an index with three subsection cards; none of its subpages (`eight-components`, `90-day-cycle`, `core-code`) reference Schlossberg. The citation is declared required and is absent.

### Citation 3 — Matveyev (1977); Bompa & Buzzichelli (2019)

#### Match: periodization citations on ETF methodology page

**Canonical location:** `ecosystem-copy.md:80–82` — required on ETF Methodology page (line 92) and anywhere the 90-day cycle is explained in depth.
**Canonical definition:** `Matveyev, L. P. (1977). Fundamentals of sports training. Progress Publishers.` and `Bompa, T. O., & Buzzichelli, C. A. (2019). Periodization: Theory and methodology of training (6th ed.). Human Kinetics.`
**Found in:** grep for `Matveyev|Bompa|Buzzichelli` in `etfframework/src/**/*.{ts,tsx,md,mdx,txt}` returned **0 production-code matches**. Only in skill references.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical explicitly says these are required on the ETF methodology page and anywhere 90-day cycle is explained in depth. The `etfframework/src/app/methodology/90-day-cycle/page.tsx` page exists but does not cite either Matveyev or Bompa per this scan. The 90-day cycle appears on multiple surfaces (`our-results`, `motion-app`, `our-network`, `about`) without periodization attribution.

---

## Section 2 — Scope of practice statement

Canonical declares a verbatim 3-sentence statement, placement-required above the fold on ETF methodology, certification landing, and practitioner portal landing pages (`ecosystem-copy.md:103–111`).

#### Match: the canonical scope-of-practice statement on ETF surfaces

**Canonical location:** `ecosystem-copy.md:107`.
**Canonical definition:**
> ETF™ is a structured transition framework, not clinical mental health care. Practitioners work within the scope of their existing licensure or credential. ETF™ does not diagnose or treat mental illness and does not replace licensed clinical care where clinical care is indicated.

**Found in:** grep for `structured transition framework|clinical mental health care|licensure or credential|diagnose or treat mental illness` across both site repos — **0 production matches**. Only skill references contain the statement. `etfframework/src/app/certification/page.tsx` (certification landing) does not contain any of the four phrases. `etfframework/src/app/methodology/page.tsx` and subpages do not contain it.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical requires verbatim presence above the fold on certification and methodology pages. It is entirely absent. This is the most severe finding in Batch 2 because the scope statement is a legal/trust load-bearing disclosure — not a style choice.

#### Match: legal disclaimer variants in use instead

**Canonical location:** not canonical; site-defined variants.
**Canonical definition:** — (canonical does not sanction these variants; canonical says scope-of-practice "does not get paraphrased").
**Found in:**
- `ETFtestSite/src/components/Footer.tsx:148` — *"Legal Disclaimer: 6 Identities is a structured self-reflection and development system designed for pattern identification and personal development. It is not therapy, a medical diagnosis, or a psychological evaluation. All data is provided for educational and self-development purposes within the Executable Transition Framework methodology."*
- `ETFtestSite/src/app/disclosures/page.tsx:68` — similar.
- `ETFtestSite/src/app/professionals/certification/terms/CertificationTermsContent.tsx:27` — *"The ETF is not therapy, clinical treatment, or a substitute for professional mental health care."*
- `etfframework/src/app/faq/page.tsx:46` — *"No. ETF is a structured reconstruction system. It is not therapy, medical diagnosis, or psychological evaluation…"* (paraphrase).

**Site version:** each site ships its own paraphrase.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical rule is strict: *"Do not paraphrase. Do not soften."* Three distinct paraphrases exist across 4+ site files. The paraphrases also diverge from each other (internal inconsistency).

---

## Section 3 — Founder bio

Canonical defines exactly three approved lengths (`ecosystem-copy.md:7–29`): short (<50 words), medium (~100 words), long (~250 words). Rule: *"The bio appears with the first-person 'I' only on the 6i about page. Everywhere else it is third person."*

#### Match: founder bio on ETF about page

**Canonical location:** `ecosystem-copy.md:7–29` (three templates).
**Canonical definition:** see templates.
**Found in:** `etfframework/src/app/about/page.tsx:50–71` — three-paragraph bio totaling ~300 words.
**Site version:**
- Paragraph 1 (~85 words): *"D'Angelo Palladino is the author of the Executable Transition Framework and the 2026 Research Foundation document that maps its eight components to the peer-reviewed evidence base… he designed a sequenced, eight-component replacement system and validated each piece against the literature as it consolidated."*
- Paragraph 2 (~130 words): research synthesis across 8+ academic traditions (Brewer/Lochbaum/Haslam/Shen/Sheldon & Elliot/Gollwitzer/Wood & Neal/Volkow/Bloomfield/Festinger/Hall).
- Paragraph 3: Motion book series references.

**Consistency:** **drift (MAJOR)**.
**Severity justification:** Does not match short (<50), medium (~100), or long (~250) templates. Closest in length to long version but content is different: missing *"[sport] at the [level] level"* origin framing, missing *"founder of 6 Identities® and the Executable Transition Framework™"* lead, missing 78% NFL / 60% NBA statistics, missing *"Today, ETF™ is the operating system for athlete transition, delivered by ETF Certified Practitioners™"* closing framing. Uses author/academic framing instead of athlete-origin framing.

#### Match: founder name consistency

**Canonical location:** canonical uses placeholder `[Founder's name]`; sites fill as `D'Angelo Palladino`.
**Canonical definition:** placeholder; any name is valid as long as consistent.
**Found in:** `etf-core/src/content/books.ts` (author), `ETFtestSite/src/components/seo/AuthorSection.tsx`, `etfframework/src/components/seo/AuthorSection.tsx`, `etfframework/src/app/research/page.tsx:32`, `etfframework/src/app/about/page.tsx:51`.
**Site version:** `D'Angelo Palladino` (typographic apostrophe `'`) on all surfaces.
**Consistency:** **pass**.
**Severity justification:** Name resolves consistently across ecosystem; typographic apostrophe is consistent within the name.

---

## Section 4 — "Built by someone who went through it" proof block

Canonical declares a verbatim 51-word, 3-sentence paragraph placed in 6i homepage Section 6 (Proof) and ETF methodology page founder section (`ecosystem-copy.md:234–240`). Rule: *"Does not change between sites. Does not get paraphrased."*

#### Match: verbatim proof block

**Canonical location:** `ecosystem-copy.md:238`.
**Canonical definition:**
> Built by a former competitive athlete who went through post-career systems failure and built the framework he could not find. Grounded in the published literature on athletic identity foreclosure (Brewer, Van Raalte & Linder, 1993), career termination distress, and periodization theory. Written by someone who lived through it, not someone who read about it.

**Found in:** grep for `went through post-career` across both site repos — **0 matches**. Only in skill references and staging.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical explicitly says this block does not change between sites and does not get paraphrased. Both sites omit it. Per canonical rule (line 240), this absence is a drift event.

---

## Section 5 — "What this is not" block

Canonical declares a 15-item full list for ETF methodology and a 4-item short version for 6i homepage Section 5 (`ecosystem-copy.md:203–230`).

#### Match: 4-item short version on 6i homepage

**Canonical location:** `ecosystem-copy.md:226`.
**Canonical definition:**
> Not therapy. Not coaching. Not a pep talk. Not a personality test that names you and leaves you there.

**Found in:** `ETFtestSite/src/app/page.tsx:197–199`.
**Site version:**
> Not therapy. Not coaching. <TM name="SixIdentities" /> is a diagnostic — name the pattern first, then correct it.

**Consistency:** **drift (MAJOR)**.
**Severity justification:** Canonical form is four *"Not X"* phrases. Site ships only two (*Not therapy. Not coaching.*) and replaces the third and fourth with a positive assertion about what 6 Identities IS. Strip test favors canonical's 4-item form — removes 50% of the rhetorical weight. Canonical designates exact placement *"on the 6i homepage in Section 5"* (line 228); the placement is correct but the content is halved.

#### Match: 15-item full list on ETF methodology page

**Canonical location:** `ecosystem-copy.md:208–222`.
**Canonical definition:** 15 items including *"Not therapy. Not coaching. Not sports psychology…"* through *"Not an ICF-style coaching certification body."*
**Found in:** `etfframework/src/app/methodology/page.tsx` and subpages — **no such list present**.
**Site version:** not referenced.
**Consistency:** **contradiction (CRITICAL)**.
**Severity justification:** Canonical places this list on the ETF methodology page. The page is an index with three subpages; none contain the anti-positioning list.

---

## Section 6 — Press-kit boilerplate

Canonical declares short and extended boilerplate (`ecosystem-copy.md:115–129`).

#### Match: press kit boilerplate text

**Canonical location:** `ecosystem-copy.md:121, 125–129`.
**Canonical definition:** short (1 paragraph) and extended (3 paragraph) templates with specific wording (e.g., *"operating system for athlete transition"*, *"first diagnostic-and-framework system built specifically for athletic career transition"*).
**Found in:** grep did not surface dedicated press-kit pages on either site. Search term `press-kit` and signature phrases did not return matches within `/src/app/**`.
**Site version:** not referenced (no press-kit page exists).
**Consistency:** **not referenced**.
**Severity justification:** Canonical does not explicitly require a press-kit page; it provides boilerplate "for use in press releases, media inquiries." If no press-kit page is shipped, this is gap-by-omission — flagged but not severity-bearing.

---

## Section 7 — Coverage declaration

| Canonical resource | Expected placement | Present? | Severity |
|---|---|---|---|
| Brewer/VR&L (1993) APA full on ETF research | ETF research page | yes (with typographic apostrophe) | MINOR |
| Brewer/VR&L (1993) short reference | both sites | yes, but form varies (`&` / `, and` / `et al.`) | MAJOR |
| Brewer non-canonical variant (Brewer & Cornelius) | — | on 6i guide page | CRITICAL → canonical-expansion |
| Schlossberg (1981) | ETF methodology | **absent** | CRITICAL |
| Matveyev (1977) + Bompa (2019) | ETF methodology + 90-day-cycle | **absent** | CRITICAL |
| Scope of practice (verbatim, 3 sentences) | ETF methodology, certification, portal | **absent**; paraphrase variants in use instead | CRITICAL |
| Founder bio (1 of 3 approved lengths) | ETF about | present but matches none | MAJOR |
| Founder name (`D'Angelo Palladino`) | all founder surfaces | yes, consistent | pass |
| "Built by someone who went through it" proof block | 6i homepage + ETF methodology | **absent** on both | CRITICAL |
| 4-item "what this is not" | 6i homepage Section 5 | halved to 2 items + positive assertion | MAJOR |
| 15-item "what this is not" | ETF methodology | **absent** | CRITICAL |
| Press-kit boilerplate | — | not referenced; no press page | not referenced |

---

## Section 8 — Severity rollup

| Severity | Count |
|---|---|
| CRITICAL (contradiction) | 6 |
| MAJOR (drift of required form) | 3 |
| MINOR (paraphrase drift) | 1 |
| needs-human-review | 0 |
| not referenced (explicit) | 1 |
| pass | 1 |
| **total findings** | **12** |

---

## Section 9 — Recommendations surfaced for Master Report

1. **Master item 2 (CRITICAL, ETF):** install the canonical scope-of-practice statement verbatim, above the fold, on ETF methodology, certification, and practitioner-portal landing pages.
2. **Master item 2 (CRITICAL, ETF):** add Schlossberg (1981) and Matveyev/Bompa (1977/2019) citations to the ETF methodology page and 90-day-cycle subpage.
3. **Master item 2 (CRITICAL, both sites):** install the canonical 51-word "built by someone who went through it" proof block on 6i homepage Section 6 and ETF methodology founder section.
4. **Master item 2 (CRITICAL, ETF):** install the 15-item "what this is not" list on ETF methodology page.
5. **Master item 3 (MAJOR, 6i):** expand 6i homepage Section 5 from 2 items to canonical's 4 items, remove the positive-assertion sentence that replaces items 3 and 4.
6. **Master item 3 (MAJOR, ETF):** rewrite founder bio on `/about` page to match one of the three canonical templates (likely long version). Preserve the research-synthesis paragraph but move it out of the bio slot into a separate "Research foundation" section.
7. **Master item 3 (MAJOR, both sites):** normalize Brewer short-form citation to canonical `Brewer, Van Raalte & Linder (1993)` — ampersand, no serial comma. Remove `Brewer et al.` and `Brewer, Van Raalte, and Linder` variants.
8. **Master item 6 (canonical expansion):** canonical should admit the 6-citation extended evidence base shipped on both sites (Lochbaum 2022, Haslam 2021, Sheldon & Elliot 1999, Gollwitzer 1999, Wood & Neal 2016, Volkow 2019). Sites have ranged beyond canonical; canonical should either authorize or require pruning.
9. **Master item 6 (canonical expansion):** resolve Brewer & Cornelius (2001) as either sanctioned (and cite it in canonical) or remove from 6i guide page.
10. **Master item 2 (CRITICAL, both sites):** align site paraphrase-variant legal disclaimers with canonical scope-of-practice. The current disclaimers (Footer, disclosures page, FAQ, certification terms) all paraphrase where canonical forbids paraphrase.

End of Batch 2.
