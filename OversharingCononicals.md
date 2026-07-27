Yes. You can treat this the same way you already treat clinical-risk language: make **public IP leakage** and **copy bloat** fail CI.

The key is not just banning words. You need rules for:

1. **what can be public**
2. **what must be gated**
3. **how much text is allowed**
4. **which files/routes the rule applies to**
5. **what exceptions are allowed**

## The main canonical rule to add

Add this to both project canonicals:

```md
## Public Content Boundary

Public-facing pages must explain the outcome, audience, value, and next step.

Public-facing pages must not explain the protected operating system, scoring logic, framework mechanics, practitioner protocol, assessment architecture, compound-code logic, or implementation workflow.

Rule:

Public = what it does, who it helps, why it matters, and what to do next.
Gated = how it works.

Any copy that teaches the internal method must be moved behind authentication, certification, portal access, paid report access, or internal documentation.
```

That becomes the parent rule.

## Add this to `6identities.com` canonical

```md
## 6 Identities Public Copy Canonical

6identities.com is the athlete-facing diagnostic and marketing site.

The public site should feel simple, direct, emotional, and low-friction. Its main goal is to get former athletes to take the assessment and feel that the product understands their transition.

Public pages may describe:

- the emotional problem after sport
- who the assessment is for
- the general value of getting a result
- broad research-informed credibility
- the six identity names with short preview descriptions
- what the user receives at a high level
- clear calls to action

Public pages must not describe:

- scoring logic
- assessment weighting
- internal dimensions
- compound-code mechanics
- practitioner annotations
- report generation logic
- professional workflow
- full methodology breakdowns
- full research architecture
- implementation protocols
- certification curriculum
- ETF delivery mechanics

Allowed public framing:

- “name the pattern”
- “see what to work on next”
- “understand what feels off after sport”
- “get a simple next-step profile”
- “built for the transition after sport”

Avoid public framing that teaches the mechanism:

- “this dimension measures…”
- “this code means…”
- “the system calculates…”
- “the framework maps…”
- “the protocol uses…”
- “practitioners interpret the score by…”

The public site should create recognition and action, not teach the system.
```

## Add this to `etfframework.com` canonical

```md
## ETF Public Copy Canonical

etfframework.com is the professional-facing institutional site.

The public site should communicate credibility, professional value, and the existence of a structured framework without exposing the protected framework mechanics.

Public pages may describe:

- who ETF is for
- the professional problem it solves
- the value of structured transition support
- certification at a high level
- portal access at a high level
- practitioner directory at a high level
- non-clinical positioning
- broad research-informed foundation
- broad implementation outcomes

Public pages must not describe:

- full protocol mechanics
- exact session workflow
- scoring formulas
- assessment architecture
- compound-code logic
- internal component definitions
- practitioner scripts
- implementation sequences
- curriculum contents in detail
- downloadable framework logic
- delivery tools in full

Allowed public framing:

- “structured athlete-transition framework”
- “shared language for transition work”
- “professional tools inside the portal”
- “certification gives access to the full protocol”
- “research-informed but non-clinical”

Avoid public framing that teaches the mechanism:

- “Step 1 does X, Step 2 does Y…”
- “The practitioner uses this component to…”
- “The framework contains these exact parts…”
- “The scoring model works by…”
- “The protocol maps the athlete through…”

Public ETF copy should sell professional trust and access, not reveal the operating system.
```

## Add this to `etf-core` canonical

```md
## Shared Core Content Boundary

etf-core may contain shared primitives, shared disclaimers, shared design tokens, shared UI components, shared commerce logic, shared analytics/SEO infrastructure, and shared brand-safe language.

etf-core must not become a public dumping ground for protected methodology.

Rules:

- Site-specific marketing copy stays in the app repo.
- Protected methodology stays gated or internal.
- Shared public copy must be broad, brand-safe, and non-mechanical.
- Shared disclaimers may live in core.
- Shared clinical-safety language may live in core.
- Shared public teaser language may live in core only if both apps use it.
- Assessment scoring logic may live in core, but public-facing descriptions of that logic must not be exposed through public components.
- If a component explains how the framework works, it must be treated as gated by default.
```

## CI/CD rule categories to add

Do not rely only on banned words. You need multiple checks.

### 1. Public IP leakage check

This checks public routes/files for terms that reveal too much.

Example restricted terms:

```txt
compound code
compound-code
scoring logic
score weighting
assessment weighting
internal dimensions
dimension weighting
archetype pairing
Core Code
Block List
DIG Method
Diagnose Interpret Guide
protocol sequence
session workflow
implementation protocol
delivery protocol
practitioner annotation
professional annotation
report generation logic
normalization formula
reverse scoring
scoring formula
transition dimensions
identity dimensions
```

Some of these may be allowed in gated pages, internal docs, or certification pages. The point is not “never use the word.” The point is:

```md
These terms cannot appear in public marketing routes unless explicitly allowlisted.
```

### 2. Public page word budget check

This prevents the sites from slowly becoming essays again.

Example rules:

```md
Public page budgets:

- Hero section: max 55 words
- Section intro paragraph: max 45 words
- Standard paragraph: max 70 words
- Feature card body: max 35 words
- Homepage total visible marketing copy: max 900 words
- Methodology/public explainer page: max 1,200 words
- No public page should have more than 2 consecutive long-form paragraphs
- Any section over 150 words must be split, shortened, gated, or replaced with cards
```

This is probably the most important part. Without word budgets, the bloat will come back.

### 3. Route classification check

Create a route map like this:

```ts
export const PUBLIC_MARKETING_ROUTES = [
  "/",
  "/methodology",
  "/professionals",
  "/certification",
  "/about",
  "/research",
  "/pricing",
];

export const GATED_ROUTES = [
  "/portal",
  "/dashboard",
  "/results",
  "/certification/course",
  "/practitioner",
  "/admin",
];
```

Then CI applies stricter rules only to public marketing routes.

This matters because you do not want CI failing because protected methodology exists inside the portal. The system should fail when protected methodology leaks publicly.

### 4. Rendered-page copy check

Static file checks are not enough because copy may come from shared components, MDX, CMS-like files, constants, or `etf-core`.

So add a Playwright-based rendered text check:

```md
For each public route:
- load the rendered page
- extract visible body text
- fail if restricted public-IP terms appear
- fail if total visible text exceeds route budget
- fail if any paragraph exceeds max length
- fail if required disclaimer is missing where needed
- fail if public CTA is unclear or missing
```

This catches the actual user-facing page, not just the source file.

### 5. Source leak check

Also scan source files that feed public pages:

```md
Scan:
- app public routes
- marketing components
- public MDX/content files
- shared public components imported from etf-core
- SEO metadata
- JSON-LD descriptions
- route constants
```

Do not just check JSX text. SEO metadata can leak IP too.

### 6. PR template rule

Add this to the PR template:

```md
## Public Content Boundary Check

- [ ] This PR does not expose scoring logic, protocol mechanics, assessment architecture, compound-code logic, or protected practitioner workflow on public pages.
- [ ] Any detailed methodology added in this PR is gated, internal, or certification-only.
- [ ] Public copy explains outcomes and value, not internal mechanics.
- [ ] Public pages stay within copy budget.
- [ ] Required non-clinical disclaimers were preserved.
- [ ] No clinical, therapeutic, diagnostic, or treatment claims were added.
```

## The strongest CI pattern

Use a config file per repo.

Example:

```ts
// content-guard.config.ts

export default {
  publicRoutes: [
    "/",
    "/methodology",
    "/professionals",
    "/certification",
    "/about",
    "/research",
  ],

  gatedRoutes: [
    "/portal",
    "/dashboard",
    "/results",
    "/admin",
  ],

  maxWordsByRoute: {
    "/": 900,
    "/methodology": 1200,
    "/professionals": 1000,
    "/certification": 1100,
    "/about": 800,
    "/research": 900,
  },

  maxParagraphWords: 70,
  maxHeroWords: 55,
  maxCardWords: 35,

  restrictedPublicTerms: [
    "compound code",
    "scoring logic",
    "score weighting",
    "assessment weighting",
    "normalization formula",
    "reverse scoring",
    "archetype pairing",
    "protocol sequence",
    "delivery protocol",
    "practitioner annotation",
    "report generation logic",
    "DIG Method",
    "Block List",
  ],

  allowedPublicTerms: [
    "research-informed",
    "athlete transition",
    "identity transition",
    "assessment",
    "framework",
    "certification",
    "portal",
  ],

  requireHumanReviewTerms: [
    "Core Code",
    "transition dimensions",
    "methodology",
    "protocol",
    "diagnostic",
    "clinical",
    "therapeutic",
    "treatment",
  ],
};
```

The key distinction:

* `restrictedPublicTerms` = fail CI on public routes
* `requireHumanReviewTerms` = warn or require approval
* `allowedPublicTerms` = safe broad language

## What should fail CI immediately

These should be hard failures on public pages:

```md
- Public page explains scoring logic.
- Public page explains formula/weighting/normalization/reverse scoring.
- Public page explains compound-code mechanics.
- Public page lists full internal protocol steps.
- Public page includes practitioner scripts or delivery instructions.
- Public page includes certification curriculum details beyond a high-level outline.
- Public page exceeds copy budget by more than 15%.
- Public page removes required non-clinical disclaimers.
- Public page adds clinical/therapeutic/diagnostic claims.
```

## What should be warnings instead of failures

These should not always fail because context matters:

```md
- “methodology”
- “framework”
- “protocol”
- “research”
- “diagnostic”
- “identity”
- “dimensions”
- “certification”
- “practitioner”
```

Those words can be fine, but they should trigger review when they appear too often or appear near mechanical language.

Example warning pattern:

```md
If “protocol” appears more than 3 times on a public page, warn.
If “methodology” appears more than 4 times on a public page, warn.
If “diagnostic” appears near “clinical,” “treatment,” or “therapy,” fail.
If “scoring” appears on a public page, fail unless allowlisted.
```

## Add “copy density” rules too

This catches the overwhelming feeling.

```md
## Public Copy Density Rules

Public marketing pages must not feel like documentation.

Rules:

- No public section should contain more than 2 paragraphs.
- No public paragraph should exceed 70 words.
- No public page should explain more than one primary idea per section.
- Feature cards should use short outcome-driven copy, not definitions.
- Public pages should prefer teaser language over instructional language.
- If a section requires multiple definitions to understand, it belongs behind a gate.
- If a section teaches a practitioner how to use ETF, it belongs behind a gate.
- If a section explains the internal assessment system, it belongs behind a gate.
```

## Add “blurred specificity” as a canonical writing rule

```md
## Blurred Specificity Rule

Public copy should be specific enough to feel credible but not specific enough to teach the protected system.

Use this pattern:

Say:
- what the user gets
- what problem it helps with
- what kind of support it creates
- what the next step is

Do not say:
- exactly how the system calculates
- exactly how the practitioner interprets
- exactly how the framework sequences the work
- exactly how the internal model is structured

Examples:

Allowed:
“Your report shows where the transition is getting stuck and what to focus on first.”

Not allowed:
“The report maps eight transition dimensions and generates a compound code based on weighted archetype pairings.”

Allowed:
“Certified practitioners get a structured workflow inside the ETF portal.”

Not allowed:
“The DIG Method uses Diagnose, Interpret, and Guide steps to move the athlete through the Block List and 90-day Move cycle.”
```

## Best way to implement this safely

I would tell Claude to add this in phases:

```md
Phase 1: Add canonical rules only.
Phase 2: Add content-guard config files.
Phase 3: Add non-blocking warnings in CI.
Phase 4: Run against current sites and generate report.
Phase 5: Fix obvious violations.
Phase 6: Turn high-confidence checks into hard failures.
Phase 7: Keep ambiguous terms as warnings/manual review.
```

Do not make every rule a hard fail immediately. That will become annoying fast. Start with report-only mode, fix the obvious issues, then make the clean rules mandatory.

## The best CI setup

Use three checks:

```md
1. clinical-claims-guard
Already exists or partially exists.

2. public-ip-guard
Fails if public pages expose protected framework mechanics.

3. public-copy-density-guard
Fails if public pages become too long, too paragraph-heavy, or too documentation-like.
```

That gives you protection from:

* legal/clinical risk
* IP leakage
* wordy public pages

## The most important thing to add

This one sentence should go in every repo canonical:

```md
If a public page starts explaining how the framework works instead of why it matters, the content belongs behind a gate.
```
