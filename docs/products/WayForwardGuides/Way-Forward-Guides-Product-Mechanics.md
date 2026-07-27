# Way Forward Guides™ — Product Mechanics

This document explains what the Way Forward Guides™ are as a product, how they fit into the 6 Identities® funnel, and what the implementation needs to support. They are not PDF downloads. The distinction matters for both the technical build and the user experience.

---

## What they are

The Way Forward Guides™ are gated long-form content modules unlocked by purchase inside the 6 Identities® results flow. The user completes the assessment, receives their identity type, and is then presented with the four guides as the next layer of paid value — deeper, actionable, identity-aware content that extends the assessment experience rather than ending it.

Each guide is approximately 2,000–2,500 words organized into six sections. The content is written in second person, directly addressing the athlete. Each section ends with a specific action — a question to answer in writing, an exercise to complete, or a Move™ to set. This is not passive reading material. It is a structured work session.

---

## Where they live in the funnel

```
Free assessment result
    → $9.99 Premium Results (full identity profile)
        → $29.99 Full Package (roadmap + Way Forward recommendations)
            → $2.99 per guide / $7.99 four-guide bundle ← guides live here
```

The guides are presented immediately after the Full Package purchase as the natural continuation. The framing is not "would you like to buy more content." It is "your roadmap identified these four areas — here is the deeper work for each one."

Each guide also functions as a standalone purchase for users who bought Premium Results but not the Full Package. The entry CTA in that case is: *Get the [topic] Guide — $2.99.*

---

## How they are delivered

The guides render as web content inside the authenticated user's results dashboard — not as file downloads. This is a deliberate product decision with three reasons behind it:

**1. Continuity.** A downloaded PDF exits the product. The user is gone. Web-rendered content keeps the user inside the 6 Identities® experience, increases time on site, and surfaces the next CTA (practitioner directory, ETF™ certification) at the natural conclusion of each guide.

**2. Completion tracking.** Web rendering allows the product to track whether the user has read the guide, completed the exercises, and returned. This data informs the follow-up email sequence and the practitioner referral trigger. A downloaded PDF produces none of this.

**3. Upsell surface.** The final section of each guide ends with a cross-sell — either to the next guide in the bundle or to etfframework.com for the full ETF™ system. Web rendering makes these CTAs live links. A PDF makes them dead text.

---

## What each guide contains

Every guide follows the same structure:

- **Cover block:** Brand mark, guide title, subtitle, one-sentence framing.
- **Opening (no header):** Three short paragraphs. Names the problem the guide addresses. No therapy-speak, no motivational framing.
- **Six numbered sections:** Each section has a clear heading, 200–400 words of content, and at least one action — a question to answer in writing, an exercise to complete, or a Move™ to set.
- **Callout blocks:** Two to three pull-quotes per guide, formatted visually distinct from body copy. These are the highest-density insight lines — the sentences a user will screenshot and share.
- **Closing cross-sell:** One paragraph. Introduces the next guide in the bundle or the ETF™ system. No hard sell language.
- **Brand footer:** 6identities.com

---

## The four guides and their scope

| File | Button label | Core topic |
|---|---|---|
| `Way-Forward-Guide-Career.md` | Career | Core Code™ career filter, transferable assets, 90-day Career Move™ |
| `Way-Forward-Guide-Relationships.md` | Relationships | Foundation Holders, Build Supporters, Anchor, People Audit, CEO standard |
| `Way-Forward-Guide-Body.md` | Body | Daily Operating System™, dopamine replacement, body relationship protocol |
| `Way-Forward-Guide-Money.md` | Money | Income floor, financial blocks, fastest path to stability, Core Code™ income filter |

Each guide is identity-type aware in its framing but not identity-type gated — any user can purchase any guide regardless of their 6 Identities® result. The Career Guide, for example, includes a section that maps each Core Code™ Archetype to specific career directions. A Compass and a Catalyst will both find it useful, just in different ways.

---

## Exercises and interactivity

Each guide contains written exercises — questions the user is meant to answer in writing before moving to the next section. The current content delivers these as inline prompts. A future implementation can surface these as interactive input fields inside the dashboard with the user's responses saved to their profile. This would:

- Increase completion rates (friction of switching to paper is removed)
- Generate practitioner-ready data if the user later connects with an ETF™ Certified Practitioner
- Power a progress indicator on the user's dashboard showing which guides are complete and which exercises are filled in

This is not required for v1. The content supports both implementations — static prompts and interactive fields — without changes to the guide copy.

---

## Email integration

Each guide purchase should trigger a three-email sequence:

1. **Immediate:** Confirmation + link to the guide in the dashboard. Subject line: *Your [topic] Guide is ready.*
2. **Day 3:** Check-in. "Did you get to the exercise in Section 4?" One specific question referencing the guide content. No CTA beyond returning to the guide.
3. **Day 7:** Cross-sell. If the user bought one guide, surface the bundle. If they bought the bundle, surface the ETF™ practitioner directory. One CTA only.

---

## What the implementation needs to support

- Authenticated content gating: guide content is visible only after purchase
- Per-guide and bundle purchase flows at $2.99 / $7.99
- Web rendering of markdown content with callout block styling
- Analytics event on guide open, section scroll-completion, and guide completion
- Cross-sell CTA rendering at the end of each guide
- Bundle upsell surface for users who bought a single guide
