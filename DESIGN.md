# DESIGN

> **North Star:** The Athletic Periodical — editorial spine that holds two voices on one press. Players' Tribune long-form crossed with the Bloomberg Terminal manual. Disciplined typographic hierarchy, confident asymmetry, zero decoration. The 6 Identities side runs editorial and athlete-brand; the ETF Framework side runs institutional and white-paper. Both are printed from the same plates.

> **Scope:** This is the design contract for `@dangelopalladino/etf-core`, the shared design-token + UI primitive package consumed by `6identities.com` and `etfframework.com`. Every other `/impeccable` command reads this file on invocation. Variants, polishes, audits, and new features inherit this system without being told.

> **Format:** Six fixed sections in fixed order: Overview, Colors, Typography, Elevation, Components, Do's and Don'ts. Do not add Layout, Motion, Responsive, or Accessibility as top-level sections — fold philosophy into Overview and per-component behavior into Components.

---

## Overview

etf-core is the canonical typesetting plate for a dual-brand ecosystem. It must publish two registers — consumer-editorial (6id) and professional-institutional (etfframework) — from one set of token primitives without either side feeling like the other's leftovers.

**The non-negotiable asymmetry.** 6id is editorial, athlete-brand, electric-blue-anchored, navy-headed. etfframework is institutional, white-paper, forest-anchored, gold-CTA, serif-headed. The shared layer (`tokens/shared`) holds only what both inherit truthfully: the 4pt spacing scale, the fluid type clamp anchors (375→1440), the General Sans body font, the JetBrains Mono numerics, the Source Serif 4 display option, the WCAG control heights, the focus ring contract, and the email-safe palette.

**The package's three exports must read like three publications from one press.** `tokens/shared` is the typographer's manual. `tokens/6id` is the consumer issue. `tokens/etfframework` is the institutional edition. Components in `ui-server` and `ui-client` are the press itself — token-bound, polymorphic where it earns it, no decoration that the brand bible has not authorized.

**Discipline above novelty.** The package serves two production sites. New tokens require sister-token review across both bundles. New components require both 6id and etfframework theme verification. Visual additions that work in only one bundle do not ship.

**Fluid contract.** Body text and structural spacing are fluid via `clamp()` between 375px and 1440px viewports. Headings stay on the existing fluid scale. AntD component tokens stay numeric — never fluid — because AntD's runtime token system does not interpolate `calc()` reliably across all components.

**Motion discipline.** Hover transitions cap at 180ms. Page transitions: none. Scroll-linked animations: banned. Loading spinners: banned (use text — `"Scoring your assessment."`). The single permitted reveal sequence is the assessment results staggered bar reveal (400ms, 60ms stagger). Every animation respects `prefers-reduced-motion`.

**Accessibility floor.** WCAG AA minimum on every color pair, AAA on body text where achievable. 16px body minimum, 13px caption minimum. 44px touch target minimum. Visible 3px focus ring on every interactive element using the brand-appropriate accent at 25–30% opacity (`FOCUS_RING_TOKENS`).

**Dark mode.** Not currently active in either consumer site. 6id has a defined `DARK_MODE_COLORS` table reserved for future opt-in. The professional ETF practitioner portal is the only surface authorized to support a dark variant in the future.

---

## Colors

**Naming convention.** Tokens are namespaced by bundle: `SHARED_*`, `SIX_ID_*`, `ETF_*`. Identity colors are descriptive English, not slot numbers (`Deep Cobalt`, not `blue-800`). The descriptive name is the canonical reference; the hex is the implementation.

**Color space.** Hex is the source today. New tokens should be specified in OKLCH and serialized to hex for AntD consumption. Reduce chroma at extreme lightness; tint neutrals toward each bundle's brand hue (navy for 6id, forest for ETF, warm charcoal for shared).

**60-30-10 weight rule.** 60% surface (off-white per bundle), 30% structural (text + borders), 10% accent. Accents earn their power by rarity. The single accent application per headline ("one-word-accent") is enforced at the component layer.

### Shared tokens (`src/tokens/shared.ts`)

Used by AntD `baseThemeConfig` and any surface that must serve both brands without bias (email templates, PDF exports, ecosystem lockups).

| Role | Name | Hex | Notes |
|---|---|---|---|
| Brand fallback | Brand Teal | `#2D7A7B` | AntD `colorPrimary` default; both brands override |
| CTA fallback | Warm Terracotta | `#C27B5C` | AntD `colorLink` default; both brands override |
| Decorative gold | Brand Gold | `#C9A96E` | Badges, certifications only |
| Surface ground | `SURFACE_TOKENS.ground` | `#EDE6DA` | Page-base shared neutral |
| Surface default | `SURFACE_TOKENS.default` | `#F5EFE6` | Default content surface |
| Surface raised | `SURFACE_TOKENS.raised` | `#FAF5EE` | Card surface |
| Surface elevated | `SURFACE_TOKENS.elevated` | `#FFFFFF` | Modal / overlay surface |
| Border subtle | `BORDER_TOKENS.subtle` | `#F0E8DF` | Hairline dividers |
| Border default | `BORDER_TOKENS.default` | `#E5DDD4` | Card borders |
| Border emphasis | `BORDER_TOKENS.emphasis` | `#D4CBC0` | Active / focused container |
| Text primary | `BRAND.foreground` | `#3A3632` | Body |
| Text secondary | `BRAND.textSecondary` | `#6B6560` | Metadata |
| Text muted | `BRAND.textMuted` | `#A8A29E` | Disabled / placeholder |

**Status palette** (`STATUS_STYLES`, all five tones; bg / border / text triples used by `NoticeCard` and tone-aware components):

| Tone | Bg | Border | Text |
|---|---|---|---|
| urgent | `#FDF2F0` | `#E8C4BE` | `#B83A2A` |
| caution | `#FDF8EE` | `#E8D9B8` | `#9A7B3C` |
| info | `#F0F7F7` | `#B8D8D8` | `#1F6060` |
| success | `#F2F8F4` | `#B8D8C0` | `#2D7A42` |
| neutral | `#F5F2EE` | `#DDD6CC` | `#6B6560` |

**Score colors** (`SCORE_COLORS`, used by `ScoreBar`):

| Range | Name | Hex |
|---|---|---|
| 0–10 | Urgent Red | `#E74C3C` |
| 11–17 | Developing Terracotta | `#C27B5C` |
| 18–25 | Strong Sage | `#4BA86A` |

**Email-safe** (`EMAIL_SAFE_TOKENS`, Satori / react-pdf safe — never replace these without verifying email render):
`#2D7A7B` brand, `#C27B5C` accent, `#F5EFE6` surface, `#FAF5EE` surface raised, `#E5DDD4` border, `#3A3632` text, `#A8A29E` text muted, `#FFFFFF`, `#000000`.

### 6id bundle (`src/tokens/6id.ts`)

Navy + soft off-white + Electric Cobalt. Cool, structured, data-forward. Consumed by 6identities.com.

**Surfaces and chrome:**

| Role | Token | Hex | Descriptive name |
|---|---|---|---|
| Page bg | `bgPage` | `#F7F8FA` | Soft Off-White |
| Card surface | `bgSurface` | `#FFFFFF` | Pure Surface |
| Hero bg | `bgNavy` | `#0D1B3E` | Deep Navy Anchor |
| Navy +1 | `bgNavySoft` | `#142554` | Navy Soft |
| Heading text | `fgPrimary` | `#0D1B3E` | Deep Navy Anchor |
| Body text | `fgBody` | `#1E1E2E` | Near Black |
| Metadata | `fgMuted` | `#6B7280` | Slate Muted |
| Disabled | `fgFaint` | `#9CA3AF` | Faint Slate |
| Border hairline | `borderHairline` | `#ECEDF0` | Navy 8% on White |
| Border soft | `borderSoft` | `#E2E4E8` | Navy 12% on White |
| Border strong | `borderStrong` | `#D8DBE0` | Navy 16% on White |

**Interactive — single primary action color:**

| Role | Token | Hex | Descriptive name |
|---|---|---|---|
| Primary CTA | `action` | `#1877F2` | **Electric Cobalt** |
| Hover | `actionHover` | `#1466D4` | Electric Cobalt Hover |
| Press | `actionPress` | `#1158B8` | Electric Cobalt Press |
| Alternate | `actionAlt` | `#0EA5E9` | Bright Teal Alt |

**Identity type palette** (`IDENTITY_COLORS`). Used **only** inside the type system — type cards, badges, result-screen reveals. Never in nav, body, buttons, or chrome.

| Identity | Token | Hex | Descriptive name |
|---|---|---|---|
| 01 Signal | `signal` | `#1B4FD8` | **Deep Cobalt** |
| 02 Compass | `compass` | `#D97706` | **Burnt Amber** |
| 03 Sentinel | `sentinel` | `#0F766E` | **Forest Teal** |
| 04 Anchor | `anchor` | `#6D28D9` | **Slate Violet** |
| 05 Momentum | `momentum` | `#B45309` | **Warm Gold** |
| 06 Catalyst | `catalyst` | `#059669` | **Vivid Emerald** |

**Identity washes** (`IDENTITY_WASHES`, 6% type tint over white). Result-screen backdrops only.

`signal #F2F5FE` · `compass #FDF6EE` · `sentinel #EEF6F5` · `anchor #F4F0FC` · `momentum #FCF5EB` · `catalyst #EDF7F2`

**Status (6id):** `danger #DC2626` / `success #059669` / `warning #B45309`.

### etfframework bundle (`src/tokens/etfframework.ts`)

Forest + warm-white + Aged Brass. Institutional, restrained, serif-forward. Consumed by etfframework.com.

| Role | Token | Hex | Descriptive name |
|---|---|---|---|
| Brand primary | `forest` | `#1A3D2B` | **Deep Forest** |
| Hover | `forestMid` | `#2D6A4F` | Forest Mid |
| Heading on warm white | `forestDeep` | `#0F2A1D` | Deepest Forest |
| Page bg | `warmWhite` | `#FAFAF8` | Warm White |
| Card surface | `white` | `#FFFFFF` | Pure Surface |
| Alt-band bg | `stone` | `#F2F1ED` | Stone Band |
| Body text | `charcoal` | `#1C1C1E` | Charcoal |
| Secondary text | `gray` | `#6B7280` | Slate |
| Disabled | `grayLight` | `#9CA3AF` | Faint Slate |
| Primary CTA | `gold` | `#B07B2A` | **Aged Brass** |
| CTA hover | `goldHover` | `#8E6321` | Aged Brass Hover |
| Decorative gold | `goldSoft` | `#D4A859` | Soft Brass |
| Success | `emerald` | `#059669` | Emerald |
| Success bg | `emeraldSoft` | `#D1FAE5` | Emerald Wash |
| Destructive | `red` | `#B91C1C` | Deep Red |
| Destructive bg | `redSoft` | `#FEE2E2` | Red Wash |
| Warning | `amber` | `#D97706` | Burnt Amber |
| Footer / cross-link | `navy` | `#0D1B3E` | Ecosystem Navy |
| Navy mid | `navyMid` | `#1E2D5C` | Ecosystem Navy Mid |
| Border default | `border` | `#E5E7EB` | Hairline |
| Border emphasis | `borderStrong` | `#D1D5DB` | Hairline Strong |
| Border on dark | `borderOnDark` | `rgba(255,255,255,0.12)` | White Veil 12% |

### Focus rings (`FOCUS_RING_TOKENS`)

Brand-tinted, 3px width on 6id and etfframework, 2px on shared.

| Bundle | Color | Width | Offset | Shadow |
|---|---|---|---|---|
| etfframework | `#B07B2A` (Aged Brass) | 3 | 2 | `0 0 0 3px rgba(176,123,42,0.25)` |
| 6id | `#1877F2` (Electric Cobalt) | 3 | 2 | `0 0 0 3px rgba(24,119,242,0.30)` |
| shared | `#3A3632` (Brand Foreground) | 2 | 2 | `0 0 0 2px rgba(58,54,50,0.35)` |

### Brand-bible reconciliation (read before adding new color tokens)

`etf-brand-design` skill specifies a single shared accent at `#2D5BFF` and 6id signal yellow at `#F5C518`. The implemented tokens diverged: 6id action is `#1877F2` (Electric Cobalt), no signal yellow is exported. The implemented values are canonical for code consumption today; the divergence is tracked. Do not introduce `#2D5BFF` or `#F5C518` ad-hoc — propose a token migration first.

---

## Typography

**Font stack** (`src/tokens/shared.ts → fonts`). One commercial display family does the work for both brands; the etfframework bundle layers a serif on headings.

| Role | Stack | Use |
|---|---|---|
| Body / UI | `'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All body, all UI on both brands |
| Display | `'General Sans', Georgia, 'Times New Roman', serif` | 6id headings (sans display) |
| Serif | `'Source Serif 4', Georgia, serif` | etfframework headings (serif display) |
| Mono | `'JetBrains Mono', Menlo, Monaco, Consolas, monospace` | Code, data values, eyebrows on 6id |

Both weights 400 and 600 only. 500 is permitted on 6id mono labels and stat values. Weights above 700 do not ship.

**Fluid type scale** (`FLUID_TYPE_SCALE`, 375→1440 viewport, exposed as Tailwind v4 `--text-*` custom properties via `buildThemeBlock()`):

| Token | clamp() | Px range |
|---|---|---|
| `--text-xs` | `clamp(0.75rem, 0.094vw + 0.728rem, 0.8125rem)` | 12 → 13 |
| `--text-sm` | `clamp(0.875rem, 0.188vw + 0.831rem, 1rem)` | 14 → 16 |
| `--text-base` | `clamp(1rem, 0.188vw + 0.956rem, 1.125rem)` | 16 → 18 |
| `--text-lg` | `clamp(1.125rem, 0.563vw + 0.993rem, 1.5rem)` | 18 → 24 |
| `--text-xl` | `clamp(1.5rem, 1.127vw + 1.236rem, 2.25rem)` | 24 → 36 |
| `--text-2xl` | `clamp(2rem, 1.878vw + 1.560rem, 3.25rem)` | 32 → 52 |

**Heading classes** (`HEADING_CLASSES`, fluid):

| Level | Class | Px range | Tracking | Line height |
|---|---|---|---|---|
| h1 | `text-[clamp(1.875rem,1.2rem+2.4vw,2.75rem)]` | 30 → 44 | -0.03em | 1.15 |
| h2 | `text-[clamp(1.5rem,1.1rem+1.4vw,1.875rem)]` | 24 → 30 | — | 1.20 |
| h3 | `text-[clamp(1.25rem,1rem+0.85vw,1.5rem)]` | 20 → 24 | — | 1.25 |
| h4 | `text-[clamp(1rem,0.85rem+0.55vw,1.25rem)]` | 16 → 20 | — | 1.30 |
| h5 | `text-[clamp(0.875rem,0.8rem+0.25vw,1rem)]` | 14 → 16 | — | 1.40 |

**Display classes** (`DISPLAY_CLASSES`, hero / poster scale):

| Token | Class | Px range | Tracking | Line height |
|---|---|---|---|---|
| display sm | `text-[clamp(40px,6vw,64px)]` | 40 → 64 | -0.04em | 1.02 |
| display md | `text-[clamp(48px,7vw,80px)]` | 48 → 80 | -0.04em | 1.02 |
| display lg | `text-[clamp(56px,8vw,96px)]` | 56 → 96 | -0.04em | 1.02 |

**Hero classes** (`HERO_CLASSES`):

- `title`: `text-[clamp(1.75rem,1.2rem+2.5vw,3.25rem)]`, tracking `-0.02em`, line-height 1.1 (28→52px)
- `subtitle`: `text-[clamp(0.9375rem,0.875rem+0.25vw,1.125rem)]`, line-height 1.5 (15→18px)
- `eyebrow`: `text-[clamp(0.6875rem,0.65rem+0.1vw,0.75rem)]`, semibold, uppercase, tracking `0.1em` (11→12px)

**Off-grid classes** (v1.11.0+):

- `KICKER_CLASS`: `text-[clamp(0.75rem,0.188vw+0.706rem,0.875rem)]`, bold, uppercase, tracking `0.08em` (12→14px)
- `STAT_NUMBER_CLASS`: `text-[clamp(2rem,1.502vw+1.648rem,3rem)]`, bold, line-height 1.1, tabular-nums (32→48px)

**Per-bundle scales.**

`SIX_ID_TYPE_SCALE` runs a 1.25 major-third on a 16px base, sans display, with a JetBrains Mono `eyebrow` (12px / 0.12em tracking / weight 500 / uppercase) and a JetBrains Mono `data` slot (32px / weight 500) for scores and percentiles. `display` 80px / line-height 1.05 / weight 600 / tracking -0.02em is reserved for the result-reveal hero only.

`ETF_TYPE_SCALE` runs a serif display ramp: `display` 64px through `h4` 20px in Source Serif 4, weight 600, line-height 1.1–1.25, negative tracking. Body and UI stay in General Sans at 16px / line-height 1.65. Eyebrow is 12px sans / weight 600 / tracking 0.14em / uppercase.

**Headline discipline (both bundles).** Exactly one word per headline takes the accent color. The rest sits in primary text. On 6id marketing pages, accent = Electric Cobalt. On 6id results / payoff moments, accent = the relevant identity color. On etfframework, accent = Electric Cobalt for the structural anchor or Aged Brass for CTAs — never both in the same headline. Two accent words is wrong; zero is generic; exactly one carries the weight.

**Line length.** Body wraps capped at 65–75ch. The reading column on 6id (`SIX_ID_WIDTHS.reading`) is 640px. Marketing column 1200px (6id) / 1200px (etf). App column 1040px (6id).

---

## Elevation

**Philosophy:** Hairline borders default. Navy-tinted shadow at the overlay tier only. No shadow on Cards. Elevation belongs to overlays (Modal, Popover, Drawer); content surfaces are flat.

**The three elevation tiers, in canonical order:**

1. **Surface (z=0).** Flat fill, no shadow. Surface tokens per bundle. The overwhelming majority of the page.
2. **Container (z=1).** Hairline border (0.5–1px) using the bundle's `borderHairline` / `borderSoft` / `border` token. No shadow. This is where Card lives.
3. **Overlay (z=2).** Navy-tinted shadow (`SIX_ID_SHADOWS.md` for 6id, `ETF_SHADOWS.md` for etfframework, `BLUEPRINT_SHADOWS.overlay` for shared). Modal, Popover, Drawer, Dropdown, Tooltip only.

**Shadow tokens (canonical):**

`BLUEPRINT_SHADOWS` (shared, 3-token cap, the only shadow vocabulary the contract guarantees long-term):

| Token | Value |
|---|---|
| `none` | `none` |
| `subtle` | `0 1px 3px rgba(0,0,0,0.04)` |
| `overlay` | `0 8px 24px rgba(58,54,50,0.12)` |

`SIX_ID_SHADOWS` (5-step navy-tinted ramp, AntD-consumed):

`xs 0 1px 2px rgba(13,27,62,0.06)` · `sm 0 2px 4px / 1px 2px rgba(13,27,62,0.06/0.04)` · `md 0 6px 16px / 2px 4px rgba(13,27,62,0.08/0.04)` · `lg 0 16px 32px / 4px 8px rgba(13,27,62,0.10/0.04)` · `xl 0 28px 56px / 8px 16px rgba(13,27,62,0.14/0.06)`

`ETF_SHADOWS` (3-step navy-tinted ramp + focus):

`sm 0 1px 2px rgba(13,27,62,0.06)` · `md 0 4px 12px rgba(13,27,62,0.08)` · `lg 0 16px 40px rgba(13,27,62,0.12)` · `focus 0 0 0 3px rgba(176,123,42,0.25)`

**Application rules.**

- AntD `boxShadow` on Cards: `none`. AntD ships shadow on Cards by default; both bundles override to `BLUEPRINT_SHADOWS.subtle` at most. Prefer hairline border + ground tint.
- AntD `boxShadowSecondary` on Modals / Popovers: `BLUEPRINT_SHADOWS.overlay` (shared), `SIX_ID_SHADOWS.md` (6id), `ETF_SHADOWS.md` (etf).
- AntD `boxShadowTertiary`: `none`. Reserved.
- Hover elevation: never. Hover is color or border, not shadow.
- Focus elevation: `FOCUS_RING_TOKENS` only — that ring is the entire focus expression.

**`SHADOW_TOKENS` legacy.** The original 5-step warm-tinted shadow ramp (xs / sm / md / lg / xl using `rgba(58,54,50,*)`) is retained for v1.x binary compatibility but deprecated. Do not consume in new code. Migrate to `BLUEPRINT_SHADOWS` or the bundle-specific ramp.

---

## Components

**Sizing baseline (`CONTROL_HEIGHT_TOKENS`):** sm 32, md 40, lg 48, touch 44 (WCAG floor). Bundles override — 6id default 44, lg 52; etfframework default 48, lg 56, sm 36. New components use `touch 44` minimum on mobile interactive surfaces.

**Radius scale (`SHARED_RADIUS_SCALE`, 4px base, capped at 20):** `none 0 / sm 4 / md 8 / lg 12 / xl 20`. Bundle radii: 6id (sm 6, md 10, lg 14, xl 20, pill 999); etfframework (sm 4, md 6, lg 10, pill 999 — pill is for badges only, never buttons).

**Spacing scale (`SHARED_SPACING_SCALE`, 4px base):** 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120. Use semantic step keys (`gap-4` = 16px), not pixel-named. Use `gap` for sibling spacing, not margins.

**Fluid spacing (`FLUID_SPACING_SCALE`, exposed as `--spacing-*` custom properties):** sectionPy 48→96, sectionPx 20→80, cardP 16→32, gapMd 16→32, gapSection 48→96. Container clamp `min(100% - 2rem, 72rem)` (max 1152px).

### Server primitives (`src/ui-server/`, no `'use client'`)

**Card** (`Card.tsx`). Polymorphic surface container. Props: `padding` (SpaceKey, default 16px), `paddingMd` / `paddingLg` (responsive ramp), `radius` (RadiusKey, default `md` = 8px), `tone` (`'default' | 'raised' | 'ground'`), `border` (default true), `as` (`'div' | 'article' | 'section' | 'aside' | 'li'`). Background from `SURFACE_TOKENS`, border from `BORDER_TOKENS.default`, no shadow. Padding mobile-first ramp — never starts large and shrinks. Radius locked to bundle scale: 6id resolves `lg` to 14px, etfframework to 10px.

**ServerHeading** + **ServerText** (`ServerTypography.tsx`). Server-safe typography. `ServerHeading` levels 1–4, weights `bold | semibold`, consumes `HEADING_CLASSES`. `ServerText` variants `body | secondary | muted | eyebrow | caption` map to fluid Tailwind utilities; `eyebrow` uses accent color, uppercase, tracking 0.1em.

**Hero** (`Hero.tsx`). Eyebrow + title + subtitle + primary/secondary CTA slots + optional media. `split` boolean toggles two-column at md+. Padding fluid via `clamp()`, gaps fluid. Title is `<h1>` or `<h2>` per `level`. Eyebrow renders as `<p>` with accent color (not in heading outline).

**NoticeCard** (`NoticeCard.tsx`). Inline notification. Tone `urgent | caution → role="alert" + aria-live="assertive"`. Tone `info | success | neutral | locked | loading → role="status" + aria-live="polite"`. Padding fluid 12→20px. Radius 8px. Tone color from `STATUS_STYLES` inline. Title is `<h3>`. **No left-stripe border** — the contract uses tinted background + hairline border + leading icon.

**Stat** + **StatValue** + **StatLabel** (`Stat.tsx`). Vertical composition. `StatValue` uses `STAT_NUMBER_CLASS` (32→48px, tabular-nums). `StatLabel` uses `KICKER_CLASS`. No fixed width.

**Stack** + **Cluster** (`Stack.tsx`). Vertical / horizontal flex layout. Configurable `gap` from spacing scale. Use these instead of margin-based spacing.

**SectionWrapper** (`SectionWrapper.tsx`). Page-section container. Applies `FLUID_SPACING_SCALE.sectionPx` and `sectionPy` via inline style so it works without consumer Tailwind paste.

**IconBadge**, **Eyebrow**, **Kicker**, **EmptyState**. Tone-aware label / state primitives. EmptyState teaches the interface — do not ship an empty state that only says "nothing here."

### Client primitives (`src/ui-client/`, all require `'use client'`)

**BrandCta** (`BrandCta.tsx`). Primary CTA wrapper. Two `weight` modes: `standard` (filled rounded button) and `editorial` (inline text link with arrow, no chrome). Sizes: `middle` 44px / `large` 52px. Primary uses bundle's action color; secondary is text-link style. ArrowRightOutlined suffix on primary. Router.push for client-side navigation.

**Note on radius drift:** The current AntD overrides for `Button` ship `borderRadius: 9999` (pill) under shared, 10px under 6id, 6px under etfframework. The brand bible specifies 4px sharp on both. The 6id 10px and etf 6px are honored as the production truth. The shared 9999px pill is treated as an overrideable default — do not introduce new pill buttons in app code; rely on the bundle override.

**CtaSection**. Container for multi-CTA layouts (stacked, inline, responsive).

**SectionHeader**. Eyebrow + heading + subtitle composite. Fluid heading classes. Use this instead of bare `ServerHeading` when an eyebrow or subtitle is present.

**StatusBadge** (`StatusBadge.tsx`). Status pill / subtle / text-only. Variants: `pill` (bordered with status background tint), `subtle` (colored text label, no chrome), `text-only` (bare colored label). Sizes sm / md. Optional dot indicator. Uses `theme.useToken()` for AntD color resolution at runtime.

**ScoreBar** (`ScoreBar.tsx`). Horizontal progress bar. Color via `getScoreColor(score)` against `SCORE_COLORS`. The result-reveal stagger (60ms between bars, 400ms each) is the single permitted reveal animation in the system.

**MetricPanel**. Stat container with icon, label, value tiers.

**SkeletonCard**. Shimmer placeholder. Matches Card dimensions exactly.

**LockedGate**. Overlay for gated content. Icon + heading + message + optional CTA.

**LoadingState**. Section / page loading. Text-first ("Scoring your assessment."), no spinner.

### AntD theme overrides (per bundle, components panel)

| Component | Shared | 6id | etfframework |
|---|---|---|---|
| Button | radius 9999, h 44, lg 52, paddingX 28, w 600, no shadow | radius 10, h 44, lg 52, paddingX 24, w 600, no shadow | radius 6, h 48, lg 56, paddingX 22, w 600, sm shadow |
| Card | radius 12, padding 32 | radius 14, padding 24 | radius 10, padding 32 |
| Input | radius 8, h 44, paddingX 16 | radius 10, h 44, paddingX 16 | radius 6, h 48, paddingX 14 |
| Modal | radius 12 | radius 20 | radius 10 |
| Menu | itemRadius 8 | itemRadius 6 | itemRadius 4 |
| Tabs | — | inkBar Electric Cobalt | inkBar Aged Brass |
| Progress | — | default Electric Cobalt | default Aged Brass |
| Form | itemMarginBottom 20 | 20 | 20 |

### Motion vocabulary

**Restrained.** 120–180ms hover transitions. 200–280ms state changes. 600ms reveals reserved for earned moments only (assessment results, post-purchase confirmation). `cubic-bezier(0.22, 1, 0.36, 1)` for `MOTION_TOKENS_IMPECCABLE.ease`; `cubic-bezier(0.2, 0, 0, 1)` for bundle ease. Allowlisted keyframes: `fadeSlide`, `textRise`, `fadeUp` (ESLint-enforced).

Animate `transform` and `opacity` only. Never animate `width`, `height`, `padding`, `margin`. For collapse, use `grid-template-rows`. No bounce, no elastic, no spring.

---

## Do's and Don'ts

### DO

- **DO** mark trademarks on first use per page (`6 Identities®`, `ETF™`, `Core Code Archetype™`, `Motion™`, `Way Forward Guide™`). Subsequent occurrences in the same page render unmarked.
- **DO** apply exactly one accent-color word per headline. Two is dilution; zero is generic.
- **DO** specify color in OKLCH for new tokens, with hex serialized for AntD consumption. Reduce chroma at extreme lightness.
- **DO** tint neutrals toward the bundle's brand hue (navy for 6id, forest for etfframework, warm charcoal for shared).
- **DO** use semantic spacing keys (`gap-4`, `--space-md`), not pixel-named.
- **DO** use `gap` for sibling spacing, not margin. Use Stack / Cluster primitives over ad-hoc flex.
- **DO** keep body text within 65–75ch line length. Use the bundle reading width tokens.
- **DO** use container queries (`@container`) for component-level responsiveness; viewport queries for page layout only.
- **DO** wrap motion in `prefers-reduced-motion` media queries; the site must work with zero animation.
- **DO** verify focus rings render in the bundle-appropriate color with 3px width and visible offset.
- **DO** check both 6id and etfframework theme renders when adding or modifying any AntD-consumed token.
- **DO** ship text-based loading copy ("Scoring your assessment.") instead of spinners.
- **DO** use the staggered ScoreBar reveal (400ms / 60ms stagger) only on the assessment result page; nowhere else.
- **DO** keep Cards flat — hairline border + tone tint.
- **DO** treat the brand bible (`etf-brand-design`, `etf-brand-messaging`, `etf-brand-shared` skills) as canonical when token implementation conflicts; propose a token migration before introducing ad-hoc values.
- **DO** keep AntD component tokens numeric. Fluid `clamp()` is for foundation tokens only.

### DON'T

- **DON'T** ship a left-stripe or right-stripe border greater than 1px as an accent on Cards, NoticeCards, list items, or alerts. Use tinted background + hairline border + leading icon. NoticeCard already follows this contract — do not regress.
- **DON'T** apply `background-clip: text` with any gradient. Solid color text only. For emphasis, use weight or size, not gradient fill.
- **DON'T** ship pill buttons (`borderRadius: 9999`) in new component code. The shared default exists for backward compatibility; rely on bundle overrides (10px on 6id, 6px on etfframework).
- **DON'T** add drop shadow to Cards, hero panels, eyebrows, or any content surface. Shadow is reserved for the overlay tier (Modal, Popover, Drawer).
- **DON'T** ship gradients (linear, radial, mesh, conic) on any surface. Every surface is a flat fill.
- **DON'T** ship glassmorphism. No backdrop-filter blur, no glass cards, no glow borders used decoratively.
- **DON'T** use sparklines as decoration. Charts encode data; if a chart conveys nothing, remove it.
- **DON'T** use the AI palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark backgrounds.
- **DON'T** ship pure `#000` or `#FFF`. Always tint toward the bundle hue.
- **DON'T** introduce `#2D5BFF` or `#F5C518` ad-hoc. The brand bible specifies them; the implemented tokens use `#1877F2` (6id action). Propose a token migration if alignment is needed.
- **DON'T** use rainbow categorical palettes in data viz. Score color encoding is grayscale + one bundle accent at varying opacities (100%, 70%, 40%, 20%). The 5-tone `IDENTITY_COLORS` is the only categorical palette permitted, and it lives inside the type system only.
- **DON'T** apply red-for-bad / green-for-good moral coloring on scores. A score is a measurement, not a judgment.
- **DON'T** use `@ant-design/icons` TwoTone variants. Outlined only. Lucide, Phosphor, Font Awesome, Material Icons are banned across both brands.
- **DON'T** ship the phrase "operating system" on 6id surfaces. ETF only.
- **DON'T** ship therapy-speak on 6id ("hold space", "heal", "your healing journey"). Don't ship clinical jargon on 6id ("ego-dystonic", "somatic experiencing").
- **DON'T** ship loading spinners. Use text.
- **DON'T** ship scroll-linked animations. They read as 2019 brand sites.
- **DON'T** ship hover transitions longer than 180ms. Hover is fast or it's wrong.
- **DON'T** ship illustrations of brains-with-hearts, abstract geometric metaphors, or hand-drawn sketches. Iconography is functional only — nav, status, form affordances.
- **DON'T** ship stock photography on either brand. Ever.
- **DON'T** add a Layout, Motion, Responsive, or Accessibility top-level section to this file. Six sections only, fixed names, fixed order.
- **DON'T** rewrite this file silently. Re-running `/impeccable document` confirms before overwriting; respect that.
