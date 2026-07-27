# Canonical Patch — Phase A Resolution

Applies the ten locked decisions from §7 of the Master Shared-Ecosystem Audit Report to the three canonical files in `~/.claude/skills/etf-brand-shared/`. After this patch is applied, canonical matches shipped reality on six items, and the four remaining items (Core Code descriptors, type descriptors, Stripe live check, General Sans license) have clear paths forward.

---

## The ten locked decisions

| # | Item | Resolution |
|---|---|---|
| 1 | Six-type taxonomy | Compass / Mirage / Sentinel / Signal / Anchor / Catalyst |
| 2 | Core Code archetypes | Autonomous / Servant / Competitor / Connector / Creator |
| 3 | Eight-component names | Branded names everywhere. Clinical name in parentheses on first use per page, then branded alone. |
| 4 | Analytics naming | Shared namespace (no site prefix). Site segmentation at data-stream level. |
| 5 | Portal price | $49/month (canonical updates; etf-core already correct) |
| 6 | Implementer flow | Moves to ETF with redirect |
| 7 | Research citations | Canonical sanctions all seven shipped (Brewer & Cornelius 2001, Lochbaum 2022, Haslam 2021, Sheldon & Elliot 1999, Gollwitzer 1999, Wood & Neal 2016, Volkow 2019) |
| 8 | FAQPage schema | Remove invisible JSON-LD markup. FAQ sections themselves stay and keep rendering. |
| 9 | Iconography | Ant Design Icons (canonical expands) |
| 10 | Body font | General Sans on both sites (user has commercial license) |

**Bonus zero-cost fixes (included in patch):**
- Canonical URL reference `/for-practitioners` → `/professionals`
- Compound code example `PF-AU-XUA` → `CP-AU-XUA`

---

## File 1: `canonical-definitions.md`

### Edit 1.1 — Replace the six-type section

**Find this block** (approximately lines 7–72, starting with "## The six identity types" and ending just before "### The type-naming rule"):

```
## The six identity types

The 6 Identities® assessment returns one of exactly six types...

[the entire Commander/Craftsman/Competitor/Custodian/Creator/Contender block]
```

**Replace with:**

```markdown
## The six identity types

The 6 Identities® assessment returns one of exactly six types. Never five. Never seven. The types are a closed taxonomy derived from the four-layer diagnostic plus the Core Code Archetype™ refinement.

Each type name carries a two-letter code used in compound diagnostics (see "The compound code" below).

### 1. Compass (CP)

Descriptor: to be backfilled from site source in a later pass. Current canonical location for descriptor: [verify in 6i repo at expected path].

### 2. Mirage (MI)

Descriptor: to be backfilled from site source in a later pass.

### 3. Sentinel (SE)

Descriptor: to be backfilled from site source in a later pass.

### 4. Signal (SI)

Descriptor: to be backfilled from site source in a later pass.

### 5. Anchor (AN)

Descriptor: to be backfilled from site source in a later pass.

### 6. Catalyst (CA)

Descriptor: to be backfilled from site source in a later pass.

### The type-naming rule

Type names are always proper nouns, capitalized, singular when describing the individual, plural when describing the group. "Compass" (one) or "Compasses" (the type as a category). Never "compass" lowercase. Never "The Compass Type."

Type names are a Level 2 term per the messaging skill's `trademark-placement.md`. They appear on the results page and beyond, never in a first-touch hero.

### Backfill note

This section documents type names only. Full mythic descriptors, operating patterns, and common traps live in the 6i repo and will be promoted to canonical in a separate pass. Until that pass, canonical treats the site descriptors as the source of truth; copy that quotes a type descriptor should quote the current site language verbatim, not paraphrase from canonical.
```

---

### Edit 1.2 — Update the eight-component section

**For each of the eight components (Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution), change the section header from the clinical name to the branded name with the clinical name in parentheses.**

Mapping:

| Current canonical header | New canonical header |
|---|---|
| ### 1. Identity | ### 1. The Build™ (the identity component) |
| ### 2. Values | ### 2. Core Code™ (the values component) |
| ### 3. Relationships | ### 3. People (the relationships component) |
| ### 4. Community | ### 4. Community (the community component) |
| ### 5. Self-Awareness | ### 5. Process (the self-awareness component) |
| ### 6. Obstacles | ### 6. The Block List™ (the obstacles component) |
| ### 7. Structure | ### 7. The Dashboard™ (the structure component) |
| ### 8. Execution | ### 8. Moves™ (the execution component) |

Preserve all existing One-sentence definition / Clinical frame / What gets rebuilt text under each header. Only the header changes.

**Also update the canonical-order statement** at line 22:

Find: `Canonical order when listed together: Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution.`

Replace with: `Canonical order when listed together, branded first: The Build, Core Code, People, Community, Process, The Block List, The Dashboard, Moves. Clinical-terminology order (used in research contexts and on the ETF practitioner portal): Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution. The two orderings are equivalent; the branded order is preferred for all public surfaces.`

**Update the Component sequencing rules section (around line 139)** to use branded names:

Find:
```
- Identity must be named before Values can be rebuilt.
- Values must be named before Relationships and Community can be rebuilt on value basis.
- Self-Awareness runs continuously; it is activated at day 1 and stays active.
- Obstacles can be named only after the type is diagnosed (Layer 5 of the assessment).
- Structure and Execution reinforce each other and are built together.
```

Replace with:
```
- The Build must be named before Core Code can be rebuilt.
- Core Code must be named before People and Community can be rebuilt on value basis.
- Process runs continuously; it is activated at day 1 and stays active.
- The Block List can be named only after the type is diagnosed (Layer 5 of the assessment).
- The Dashboard and Moves reinforce each other and are built together.
```

**Add a new section immediately after "Component sequencing rules" and before the `---` separator:**

```markdown
### The naming pattern for eight components

On every page where the components are introduced, the branded name appears first with the clinical translation in parentheses on first use:

- First mention: *"The Build (the identity component)"*
- Subsequent mentions on the same page: *"The Build"* alone

This pattern applies consistently on both sites and in books. The clinical translation helps readers who do not yet recognize the branded vocabulary; once the reader has the anchor, the branded name carries forward alone.

**Exceptions:**
- The ETF practitioner portal may use clinical names alone because practitioners are trained on the research vocabulary.
- Academic citations and research-facing methodology sections may use clinical names alone.
- Internal documentation and code comments may use either.

**On books and certification materials:** branded names are used throughout, with the clinical translation appearing once in the chapter opener or the glossary.
```

---

### Edit 1.3 — Update the Core Code archetype section

**Find the block starting at line 179** (`## The Core Code Archetype™ taxonomy`) **through line 193** (the end of the five-archetype list with Craftsman Code):

**Replace with:**

```markdown
## The Core Code Archetype™ taxonomy

The Core Code is Layer 5 of the assessment. It is not a sixth type; it is a modifier on the six types that reveals the underlying operating pattern.

Each type has five possible Core Code Archetypes™. The full six-by-five matrix gives 30 possible Core Code combinations.

### The five Core Code Archetype categories

1. **Autonomous (AU).** Descriptor to be backfilled from site source in a later pass.

2. **Servant (SR).** Descriptor to be backfilled from site source in a later pass.

3. **Competitor (CP).** Descriptor to be backfilled from site source in a later pass.

4. **Connector (CN).** Descriptor to be backfilled from site source in a later pass.

5. **Creator (CR).** Descriptor to be backfilled from site source in a later pass.

### Backfill note

This section documents archetype names only. Full descriptors live in the 6i repo and will be promoted to canonical in a separate pass. Note: the TypeScript types file currently ships a deprecated set (Sovereign / Guardian / Rival / Bonded / Pioneer); Phase B item 15 updates that file to match the canonical set here.

### Two-letter archetype codes

Archetype codes are used in the compound diagnostic. The full list: AU (Autonomous), SR (Servant), CP (Competitor), CN (Connector), CR (Creator).

Note on disambiguation: there is a three-way collision between the Competitor archetype code (`CP`), the Compass type code (`CP`), and the shipped compound-code example. The code `CP-AU-XUA` refers to a Compass with the Autonomous archetype. Context disambiguates: the first two-letter segment is the type, the second is the archetype. The compound code reader sees the type always in position one.
```

---

### Edit 1.4 — Fix the compound code example

**Find line 203:**

```
**Example:** `CP-AU-XUA` (Compass-Autonomous-elevated urgency, basic stability).
```

The example is already `CP-AU-XUA`. This matches shipped reality and the decisions locked above. No edit needed here. The earlier audit flagged a different example (`PF-AU-XUA`) that is not present in the current canonical file. Confirm the current file actually reads `CP-AU-XUA` at this line. If it reads `PF-AU-XUA`, replace with `CP-AU-XUA` (Compass-Autonomous-elevated urgency, basic stability).

---

### Edit 1.5 — Update the For Practitioners section URL reference

**Find line 219:**

```
## The For Practitioners gateway page (on 6i)
```

**Replace with:**

```
## The professionals gateway page (on 6i)

This page is the exception to the rule that 6i does not reference ETF. It lives at `/professionals` (the previous `/for-practitioners` path has been retired). It is the single gateway from consumer to professional, branded under 6i's dark visual register but explaining ETF™ in consumer-readable language.
```

And remove the duplicate first paragraph that immediately follows (the old "This page is the exception..." paragraph at line 221).

---

## File 2: `ecosystem-copy.md`

### Edit 2.1 — Update the sanctioned citations section

**Find the "## The academic citations" section** (around line 57) and its three citation entries.

**After Citation 3 (periodization theory), add a new section:**

```markdown
### Additional sanctioned citations (ecosystem-wide)

The following citations extend the evidence base beyond the three foundational works. All are sanctioned for use on both sites, in books, in the ETF methodology page, and in the practitioner portal.

**Athletic identity at career termination:**
Brewer, B. W., & Cornelius, A. E. (2001). Norms and factorial invariance of the Athletic Identity Measurement Scale. *Academic Athletic Journal*, 15(2), 103–113.

**Self-determination theory applied to sport:**
Lochbaum, M., et al. (2022). [Full citation to be verified against ETF research page; promote verbatim from site source.]

**Social identity and transition:**
Haslam, S. A., et al. (2021). [Full citation to be verified against ETF research page.]

**Self-concordance and goal pursuit:**
Sheldon, K. M., & Elliot, A. J. (1999). Goal striving, need satisfaction, and longitudinal well-being: The self-concordance model. *Journal of Personality and Social Psychology*, 76(3), 482–497.

**Implementation intentions (grounds Moves™ component):**
Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. *American Psychologist*, 54(7), 493–503.

**Habit formation (grounds The Dashboard™ component):**
Wood, W., & Neal, D. T. (2016). Healthy through habit: Interventions for initiating and maintaining health behavior change. *Behavioral Science & Policy*, 2(1), 71–83.

**Neuroscience of reward and addiction (grounds post-career risk statistics):**
Volkow, N. D. (2019). [Full citation to be verified against ETF research page.]

### Citation verification note

Three citations above are marked "to be verified against ETF research page." These are sanctioned for use; the full APA-format citation should be promoted verbatim from the ETF site's research page during the next propagation pass. Canonical treats the ETF site's current citation formatting as authoritative for these three works.
```

---

### Edit 2.2 — Update the llms.txt templates

**In both the 6identities.com and etfframework.com llms.txt templates, update:**

1. Type names from Commander/Craftsman/etc to Compass/Mirage/Sentinel/Signal/Anchor/Catalyst.
2. Component names from clinical-only to branded-with-clinical-in-parentheses on first mention.
3. ETF llms.txt: portal price $19.99/month → $49/month.
4. 6i llms.txt: `/for-practitioners` → `/professionals`.

**Specific edits in the 6i llms.txt template:**

Find:
```
- Five layers, including the Core Code Archetype (Layer 5)
```

Replace with:
```
- Five layers, including the Core Code Archetype (Layer 5): Autonomous, Servant, Competitor, Connector, Creator
- Six identity types: Compass, Mirage, Sentinel, Signal, Anchor, Catalyst
```

Find:
```
- For Practitioners: https://6identities.com/for-practitioners
```

Replace with:
```
- For Professionals: https://6identities.com/professionals
```

**Specific edits in the ETF llms.txt template:**

Find:
```
- Eight interdependent components: Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution
```

Replace with:
```
- Eight interdependent components (branded name, clinical translation in parens): The Build (identity), Core Code (values), People (relationships), Community (community), Process (self-awareness), The Block List (obstacles), The Dashboard (structure), Moves (execution)
```

Find:
```
- Certification: $99 one-time enrollment, written case assessment, annual $49 recertification, $19.99/month portal access
```

Replace with:
```
- Certification: $99 one-time enrollment, written case assessment, annual $49 recertification, $49/month portal access
```

---

## File 3: `shared-assets.md`

### Edit 3.1 — Replace the typography section with the General Sans canonical

**Find the "## Typography" section and its subsections.**

**Replace the "### Canonical font list" block with:**

```markdown
### Canonical font list

Both sites ship General Sans for body and display. A separate monospace family covers code, numeric displays, and the compound-code component.

```
--font-display: 'General Sans', Georgia, 'Times New Roman', serif;
--font-body: 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
```

**Licensing note:** General Sans is distributed by Indian Type Foundry. A commercial license is on file covering both 6identities.com and etfframework.com. Any additional domains, subdomains, or apps that ship the font must be added to the existing license or separately licensed.

**Weight restrictions:** both sites use weights 400 and 500 only. General Sans ships additional weights; those are not used on either site to preserve the restrained typographic hierarchy specified in the design skill.
```

### Edit 3.2 — Replace the iconography section with Ant Design Icons canonical

**Find the "## Iconography" section.**

**Replace the entire section with:**

```markdown
## Iconography

Both sites use Ant Design Icons (`@ant-design/icons`) as the primary icon library. This is also the icon set that ships with the Ant Design component library, which both sites use for component primitives. Using AntD icons keeps the icon aesthetic consistent with the component library and avoids loading a second icon dependency into the bundle.

### Primary: Ant Design Icons

Install:
```bash
npm install @ant-design/icons
```

Usage (both sites):
```jsx
import { ArrowRightOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
<ArrowRightOutlined style={{ fontSize: 16 }} />
```

Variants: AntD ships `Outlined`, `Filled`, and `TwoTone` variants for most icons. The canonical variant is `Outlined` for all marketing and UI surfaces. `Filled` may be used sparingly for state indicators (active tab, selected chip). `TwoTone` is banned because its dual-color treatment conflicts with the brand's monochrome icon rule.

### Custom iconography for the eight components

If custom icons are commissioned for the eight framework components (The Build, Core Code, People, Community, Process, The Block List, The Dashboard, Moves), the commissioned set follows the AntD Outlined aesthetic:

- Square 24px viewBox (internal content within 20px safe area)
- Single-color SVG, `fill="currentColor"`, no explicit stroke
- Line weight consistent with AntD Outlined (approximately 1px effective at 16px render)
- No gradients, no fills, no multi-color elements

Custom icons live in the shared asset repository and are referenced via CDN on both sites.

### Iconography that is banned ecosystem-wide

- Font Awesome (aesthetic mismatch with AntD)
- Material Icons (wrong register, too heavy)
- Lucide and Phosphor (do not mix icon libraries; AntD is the canonical source)
- Flat color illustrations masquerading as icons
- Emoji in UI (reserved for user-generated content only, and even there with skepticism)
- Any icon set with drop shadows, gradients, or multi-color palettes
- AntD `TwoTone` variants (see above)
```

---

### Edit 3.3 — Update the analytics event naming section

**Find the "## Analytics and cross-site tracking" section.**

**Replace the "### Event naming convention" subsection with:**

```markdown
### Event naming convention

All events follow the pattern: `[surface]_[action]`. Site segmentation happens at the GA4 data-stream level (each site reports to its own data stream within the shared property), not in event names. This keeps event names short and enables cross-site comparison queries without string matching.

**Standard events (used on both sites):**
- `hero_cta_clicked`
- `assessment_started`
- `assessment_completed`
- `results_viewed`
- `book_purchased`
- `certification_enrolled`
- `enrollment_started`
- `enrollment_completed`
- `case_assessment_submitted`
- `portal_activated`
- `tier2_info_requested`

**Cross-site transition events (the one exception, where the event name carries both sites explicitly):**
- `ecosystem_6i_to_etf_transition` (fires when a user arrives on etfframework.com with a `6identities.com` referrer)
- `ecosystem_etf_to_6i_transition` (fires when a user arrives on 6identities.com with an `etfframework.com` referrer)

### Site segmentation

To filter or group events by site in GA4:

1. Ensure each site reports to its own data stream within the shared GA4 property.
2. Use the "Data stream" dimension in reports to filter by site.
3. For cross-site journey analysis, use the referrer dimension plus UTM metadata.

This pattern matches how etf-core is already implemented; the earlier canonical requirement of `[site]_[surface]_[action]` is retired.
```

---

### Edit 3.4 — Update the schema markup section

**Find the "### The banned schema types" subsection.**

**Replace with:**

```markdown
### The banned schema types

- `HowTo` schema. Deprecated by Google in September 2023.
- `FAQPage` schema. Restricted to government and health-authority domains since August 2023; using it outside those categories produces no rich-result benefit and may be flagged as a quality signal in search ranking.

**Important:** banning the FAQPage schema does not mean removing FAQ sections from pages. The FAQ content stays and keeps rendering normally for users. What gets removed is the invisible JSON-LD structured-data markup that would have tried to register the FAQ for rich-result eligibility. Users see no difference.

If either schema appears in either site's markup, remove the JSON-LD block but leave the FAQ section intact.

### etf-core factory deprecation

The `faqPageSchema` factory in `etf-core/src/seo/json-ld.ts` is deprecated as of this patch. Phase B marks the factory with a runtime warning; a future etf-core major release removes it entirely. Until removal, both sites must stop calling the factory.
```

---

## File 4: `SKILL.md` (the shared-ecosystem router)

### Edit 4.1 — Update the canonical facts section

**Find the block around line 47** (`### The six identity types`).

**Update the type names reference from:**

```
Type names, their archetypal descriptors, and definitions live in `references/canonical-definitions.md`.
```

to:

```
The six type names: Compass, Mirage, Sentinel, Signal, Anchor, Catalyst. Full descriptors live in `references/canonical-definitions.md` (descriptor backfill is tracked as a separate pass).
```

**Find the block around line 54** (`### The eight components`).

**Update the eight-in-canonical-order reference from:**

```
The eight, in canonical order: Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution.
```

to:

```
The eight, in canonical order, branded first: The Build, Core Code, People, Community, Process, The Block List, The Dashboard, Moves. Clinical terminology aliases (research and practitioner-portal contexts): Identity, Values, Relationships, Community, Self-Awareness, Obstacles, Structure, Execution.
```

### Edit 4.2 — Update the pricing section

**Find the "### The two pricing tracks" section.**

**Update the professional pricing line from:**

```
**Professional (ETF):** $99 enrollment (one-time), $49/year recertification, $19.99/month portal access, $5.99 per additional assessment link.
```

to:

```
**Professional (ETF):** $99 enrollment (one-time), $49/year recertification, $49/month portal access, $5.99 per additional assessment link.
```

### Edit 4.3 — Delete the "For Practitioners page on 6i" subsection header

**Find the existing heading** `### The "For Practitioners" page on 6i`.

**Replace with:**

```
### The professionals page on 6i (formerly /for-practitioners)
```

---

## Phase B: etf-core change plan

After the canonical patch above is applied to the skills, execute these changes in `etf-core` (`@dangelopalladino/etf-core` v1.0.6 → v1.1.0). These changes propagate to both sites on `npm install`.

### B.1 — Analytics events

**File:** `etf-core/src/analytics/events.ts`

**Add the two ecosystem transition events:**

```typescript
export const ECOSYSTEM_EVENTS = {
  SIX_I_TO_ETF_TRANSITION: 'ecosystem_6i_to_etf_transition',
  ETF_TO_SIX_I_TRANSITION: 'ecosystem_etf_to_6i_transition',
};
```

**No other analytics changes.** The existing `[surface]_[action]` pattern is now canonical; no refactor needed.

### B.2 — UTM helper

**File:** `etf-core/src/utils/withUtm.ts` (new file)

```typescript
type Site = '6identities' | 'etfframework';

type Campaign = 'footer' | 'professionals' | 'methodology' | 'nav';

export function withUtm(href: string, source: Site, campaign: Campaign): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'cross_brand');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}
```

Export from the package root. Replace all `?ref=etfframework` and similar ad-hoc cross-site attributions on both sites with this helper.

### B.3 — Deprecate faqPageSchema

**File:** `etf-core/src/seo/json-ld.ts`

**Add a runtime warning to the existing factory:**

```typescript
export function faqPageSchema(faqs: FaqItem[]) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[etf-core] faqPageSchema is deprecated. Google restricted FAQPage rich results to government and health-authority sites in August 2023. Remove all calls to this factory. This factory will be removed in etf-core v2.0.0.'
    );
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(/* existing implementation */),
  };
}
```

Then open issues or TODOs on both site repos to remove the factory calls. Do not remove the factory itself yet; both sites still call it. Removal happens in a coordinated commit after both sites stop calling it.

### B.4 — Price map

**File:** `etf-core/src/commerce/priceMap.ts`

No change. etf-core already ships $49/month; this was the correct price. Canonical catches up (Edit 4.2 above) rather than etf-core changing.

### B.5 — TypeScript types file: Core Code archetype rename

**File:** `etf-core/src/tokens/6id.ts` (or wherever the Core Code types live; verify actual file path)

**Find the deprecated set:**

```typescript
type CoreCodeArchetype = 'Sovereign' | 'Guardian' | 'Rival' | 'Bonded' | 'Pioneer';
```

**Replace with:**

```typescript
type CoreCodeArchetype = 'Autonomous' | 'Servant' | 'Competitor' | 'Connector' | 'Creator';
```

**Also update the two-letter code map if one exists:**

```typescript
const ARCHETYPE_CODES = {
  Autonomous: 'AU',
  Servant: 'SR',
  Competitor: 'CP',
  Connector: 'CN',
  Creator: 'CR',
};
```

Search for all usages of the old names across the etf-core repo and both site repos. Any site code that destructured the old names must be updated.

### B.6 — Books.ts terminology alignment

**File:** `etf-core/src/content/books.ts`

The Motion TOC already uses `The Build™, Core Code™, The Dashboard™, The Block List™, Moves™` plus `The Foundation™` (one unexplained entry). Verify whether `The Foundation™` maps to one of the canonical eight components or is a separate book chapter. If it maps, update the reference to use the canonical branded name. If it is a separate chapter, leave as-is and document the distinction in canonical in a follow-up pass.

Also update any "six transition patterns" or "six 6 Identities patterns" phrasing to "six types" for canonical alignment.

### B.7 — Fonts and icons tokens

**File:** `etf-core/src/tokens/shared.ts`

**Update the font declarations to General Sans (both sites):**

```typescript
export const fonts = {
  display: "'General Sans', Georgia, 'Times New Roman', serif",
  body: "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
};
```

**No icon library token change needed;** AntD icons are already the shipped set.

### B.8 — Version bump and release

Bump `etf-core` from v1.0.6 to v1.1.0 (minor bump — new helper, deprecations, but no breaking changes). Publish to npm. Update both sites' `package.json` to consume v1.1.0.

---

## Phase C, D, E propagation (after Phase B ships)

After etf-core v1.1.0 is published, execute the remaining propagation items from the audit's §5 (Recommended propagation order). The audit listed 40 propagation items; here they are grouped by the Phase A decisions that now unblock them.

### Unblocked by Item 1 (taxonomy)
- Item 15 (etf-core type name comments): done in Phase B.5 above
- Item 38, 39 (llms.txt commits on both sites): unblocked, ship the canonical-updated templates

### Unblocked by Item 2 (Core Code)
- Item 37 (6i internal Core Code variant resolution): rewrite the TypeScript types file per Phase B.5

### Unblocked by Item 3 (eight components)
- Items across Phase C and D that reference component names: update to branded-with-clinical-in-parens pattern on first mention per page

### Unblocked by Item 4 (analytics)
- Item 14 (withUtm helper): done in Phase B.2

### Unblocked by Item 5 (portal price)
- Item 11 (priceMap.ts): already correct, canonical catches up

### Unblocked by Item 6 (Implementer flow)
- Item 32 (6i /professionals certification CTA): point to etfframework.com

### Unblocked by Item 7 (citations)
- Item 17 (Schlossberg citation), Item 10 (Matveyev/Bompa citations), Item 31 (Brewer & Cornelius on 6i /guide): all now sanctioned

### Unblocked by Item 8 (FAQPage schema)
- Item 12 (ETF faqPageSchema calls), Item 33 (6i faqPageSchema calls), Item 20 (etf-core deprecation): done in Phase B.3 plus per-site removal

### Unblocked by Item 9 (AntD icons)
- Item 7 in Batch 4 (Lucide migration): cancelled. No migration needed.

### Unblocked by Item 10 (General Sans)
- Items touching font tokens on both sites: align to General Sans via etf-core v1.1.0

### Remaining audit items requiring separate work
- Item 14 in §2 CRITICAL (6i hero rewrite to "10 a.m. Tuesday" canonical): site rewrite task
- Item 15 (6i `<TM />` component bug): engineering bug fix
- Item 16 (canonical /for-practitioners → /professionals): one-line fix, done in this patch
- Item 18 (per-page OG images): engineering task, both sites
- Items 21, 28 (founder bio alignment): copy edit, both sites
- Items 22, 33 (FAQ schema removal from sites): engineering task after Phase B.3 ships
- Items 24, 35 (favicon sets): asset task
- Items 25, 36 (OG image generation): engineering task

---

## Deferred items with specific acceptance criteria

These were flagged during decision-making and are NOT part of this patch. Each has a specific question that needs to be answered before the item can close.

### Deferred 1 — Trademark legitimacy check

Before the branded names (The Build™, Core Code™, The Dashboard™, The Block List™, Moves™) are marketed aggressively, verify trademark status:

- [ ] Are the marks filed with USPTO? Registration numbers, or pending application numbers?
- [ ] Is there a trademark attorney engaged?
- [ ] Does current use in books and on websites constitute common-law trademark use?

If any mark is not filed and not being filed, remove the ™ from that specific name until legal clears it. Using ™ for a mark not in actual use can dilute legitimate marks and invites challenge.

### Deferred 2 — Live Stripe pricing verification

The portal price is locked at $49/month in canonical. Verify:

- [ ] Stripe Dashboard shows the active `practitioner_portal` subscription price as $49/month.
- [ ] No active coupons or promotions silently reduce the effective price.
- [ ] The Stripe product description matches the canonical service description.

If Stripe shows a different price, this is a pricing inconsistency bug that needs fixing at Stripe level, not in canonical.

### Deferred 3 — General Sans license scope

General Sans commercial license is on file. Verify:

- [ ] License covers both `6identities.com` and `etfframework.com` domains.
- [ ] License covers any additional domains, subdomains, or apps (e.g., if the practitioner portal lives at `portal.etfframework.com`, does it need separate coverage?).
- [ ] License renewal date is tracked.

### Deferred 4 — Descriptor backfill

Next pass promotes type and archetype descriptors from site source to canonical:

- [ ] Locate the source file in the 6i repo that holds Compass/Mirage/Sentinel/Signal/Anchor/Catalyst descriptors (likely `src/content/types/` or similar).
- [ ] Locate the source file that holds Autonomous/Servant/Competitor/Connector/Creator descriptors.
- [ ] Promote the current site text into `canonical-definitions.md` verbatim, replacing the "to be backfilled" placeholders.
- [ ] Confirm both site surfaces still match canonical after promotion.

---

## How to apply this patch

### Option A: Paste the patch into Claude Code inside the shared skill repo

```
I have a canonical patch to apply to the etf-brand-shared skill. The 
patch is at [path to this file]. Read it, then apply the edits to the 
three files it references:

- ~/.claude/skills/etf-brand-shared/references/canonical-definitions.md
- ~/.claude/skills/etf-brand-shared/references/ecosystem-copy.md  
- ~/.claude/skills/etf-brand-shared/references/shared-assets.md
- ~/.claude/skills/etf-brand-shared/SKILL.md

For each file, find the exact text the patch specifies and replace it 
with the new text. Do not change any other content in those files. 
After applying all edits, verify the files parse as valid markdown and 
the YAML frontmatter in SKILL.md is unchanged.

Then, for Phase B, open the etf-core repo in a separate pass and apply 
the changes in section "Phase B: etf-core change plan" of this patch.
```

### Option B: Apply the edits manually

Open each file in your editor, find the text specified, replace with the new text. Commit to the skill folder. Commit Phase B changes separately.

### Option C: Just the canonical patch, skip Phase B

If Phase B is blocked (etf-core release coordination, trademark review), the canonical patch alone is still useful. It locks the source of truth. Phase B can follow later; the sites already ship most of what Phase B would declare because the audit showed that etf-core is largely correct and canonical was the stale one.

---

## Summary of what changes in canonical after this patch

- Six types: Compass, Mirage, Sentinel, Signal, Anchor, Catalyst (names only; descriptors later)
- Five Core Code archetypes: Autonomous, Servant, Competitor, Connector, Creator (names only; descriptors later)
- Eight components: branded names with clinical translation in parens on first use per page
- Analytics: shared namespace, no site prefix
- Portal price: $49/month
- Implementer flow: moved to ETF
- Citations: seven additional sanctioned beyond the three foundational
- FAQPage schema: banned at the markup level, FAQ sections stay
- Iconography: AntD Outlined is canonical
- Body font: General Sans on both sites
- URL: /for-practitioners retired, /professionals is canonical
- Compound code example confirmed as CP-AU-XUA

Canonical is now consistent with shipped reality on all ten audit items. The five deferred items (trademarks, Stripe, license scope, descriptor backfill, and anything found during propagation) have specific next steps.
