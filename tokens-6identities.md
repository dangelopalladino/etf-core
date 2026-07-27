# Design Tokens: 6identities.com

The complete visual token set for the consumer-facing site. Load this whenever you are building or auditing any 6i page, component, email, or Figma file.

The site runs a **navy + off-white + electric blue** design system. The palette is cool, structured, and data-forward — built for athletes reviewing results, identity scores, and psychological profiling data. The dominant surface is a soft off-white (`#F7F8FA`). The primary interactive color is electric blue (`#1877F2`). Deep navy (`#0D1B3E`) anchors headings, hero sections, and the result-reveal experience. The 6 identity type colors are saturated and used exclusively inside the type system.

This file is the authoritative token spec for 6identities.com. If a CSS file, Tailwind config, or component disagrees with this file, the other resource is stale and this file wins.

Source of truth CSS: `ETFtestSite/docs/6identities Design System/colors_and_type.css`  
Source of truth token package: `@dangelopalladino/etf-core/tokens/6id`

---

## Color Tokens

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `bgPage` | `#F7F8FA` | Default page background — soft off-white |
| `bgSurface` | `#FFFFFF` | Cards, floating surfaces, modals |
| `bgNavy` | `#0D1B3E` | Full-bleed hero, result reveal |
| `bgNavySoft` | `#142554` | Navy elevation +1 (rare) |

```css
--bg-page:      #F7F8FA;
--bg-surface:   #FFFFFF;
--bg-navy:      #0D1B3E;
--bg-navy-soft: #142554;
```

### Foreground / Text

| Token | Hex | Use |
|---|---|---|
| `fgPrimary` | `#0D1B3E` | Headings, strong emphasis — navy |
| `fgBody` | `#1E1E2E` | Body text — near-black, grounded |
| `fgMuted` | `#6B7280` | Metadata, labels, captions |
| `fgFaint` | `#9CA3AF` | Placeholder, disabled |
| `fgOnNavy` | `#FFFFFF` | Text on navy surfaces |
| `fgOnNavyMuted` | `rgba(255,255,255,0.72)` | Secondary text on navy |
| `fgOnNavyFaint` | `rgba(255,255,255,0.48)` | Tertiary text on navy |

```css
--fg-primary:     #0D1B3E;
--fg-body:        #1E1E2E;
--fg-muted:       #6B7280;
--fg-faint:       #9CA3AF;
--fg-on-navy:     #FFFFFF;
--fg-on-navy-mut: rgba(255, 255, 255, 0.72);
--fg-on-navy-faint: rgba(255, 255, 255, 0.48);
```

### Interactive — Electric Blue

Electric blue is the **single** action color. Every button, every link, every focus ring.

| Token | Hex | Use |
|---|---|---|
| `action` | `#1877F2` | Primary CTA — buttons, links, focus rings |
| `actionHover` | `#1466D4` | Hover state |
| `actionPress` | `#1158B8` | Pressed/active state |
| `actionAlt` | `#0EA5E9` | Alternate CTA — teal variant |
| `actionAltHover` | `#0B8FCC` | Alt hover |

```css
--action:         #1877F2;
--action-hover:   #1466D4;
--action-press:   #1158B8;
--action-alt:     #0EA5E9;
--action-alt-hover: #0B8FCC;
```

### Status / Semantic

```css
--danger:        #DC2626;
--danger-hover:  #B91C1C;
--success:       #059669;
--success-hover: #047857;
--warning:       #B45309;
```

### Borders

Expressed as rgba values; composited hex equivalents shown for AntD (cannot evaluate rgba).

| Name | rgba | Hex (composited on white) | Use |
|---|---|---|---|
| Hairline | `rgba(13,27,62,0.08)` | `#ECEDF0` | Subtle borders, card edges |
| Soft | `rgba(13,27,62,0.12)` | `#E2E4E8` | Moderate separation |
| Strong | `rgba(13,27,62,0.16)` | `#D8DBE0` | Input borders, strong dividers |
| On navy | `rgba(255,255,255,0.12)` | — | Borders on dark surfaces |

```css
--border-hairline: rgba(13, 27, 62, 0.08);
--border-soft:     rgba(13, 27, 62, 0.12);
--border-strong:   rgba(13, 27, 62, 0.16);
--border-on-navy:  rgba(255, 255, 255, 0.12);
```

AntD color tokens:
- `colorBorder` → `#D8DBE0` (strong — form inputs)
- `colorBorderSecondary` → `#ECEDF0` (hairline — card edges)

---

## The 6 Identity Type Colors

Used **only** inside the type system (cards, badges, result screens, score displays). Never in nav, body text, buttons, or chrome.

| Identity | Token | Color | Hex |
|---|---|---|---|
| 01 Signal | `signal` | Deep cobalt — direction | `#1B4FD8` |
| 02 Compass | `compass` | Burnt amber — drive | `#D97706` |
| 03 Sentinel | `sentinel` | Forest teal — resilience | `#0F766E` |
| 04 Anchor | `anchor` | Slate violet — introspection | `#6D28D9` |
| 05 Momentum | `momentum` | Warm gold — achievement | `#B45309` |
| 06 Catalyst | `catalyst` | Vivid emerald — growth | `#059669` |

```css
--type-signal:   #1B4FD8;
--type-compass:  #D97706;
--type-sentinel: #0F766E;
--type-anchor:   #6D28D9;
--type-momentum: #B45309;
--type-catalyst: #059669;
```

### Identity Washes — result-screen backdrops only

6% tint of each type color over white. Used exclusively as result-screen section backgrounds.

| Identity | Wash |
|---|---|
| signal | `#F2F5FE` |
| compass | `#FDF6EE` |
| sentinel | `#EEF6F5` |
| anchor | `#F4F0FC` |
| momentum | `#FCF5EB` |
| catalyst | `#EDF7F2` |

```css
--type-signal-wash:   #F2F5FE;
--type-compass-wash:  #FDF6EE;
--type-sentinel-wash: #EEF6F5;
--type-anchor-wash:   #F4F0FC;
--type-momentum-wash: #FCF5EB;
--type-catalyst-wash: #EDF7F2;
```

---

## Typography

### Font Stack

**Body/UI: General Sans** (variable woff2, weight 200–700) — loaded locally. No CDN fallback needed; the site ships the woff2 files.  
**Data/scores/eyebrows: JetBrains Mono** — loaded via Google Fonts CDN.  
**No serif font.** 6identities is all-sans.

```css
--font-sans:    "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-display: "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

### Type Scale

Based on a 1.25 major-third on a 16px base.

| Role | Size | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| Display | 80px | 1.05 | 600 | -0.02em | Result hero, big editorial |
| H1 | 52px | 1.05 | 600 | -0.02em | Page titles |
| H2 | 40px | 1.2 | 600 | -0.01em | Section headers |
| H3 | 32px | 1.2 | 600 | -0.01em | Subsection headers |
| H4 | 24px | 1.2 | 600 | — | Card titles |
| Lead | 18px | 1.6 | 400 | — | Lead paragraphs |
| Body | 16px | 1.6 | 400 | — | Default paragraph text |
| Small | 14px | 1.45 | 400 | — | Metadata, secondary copy |
| Eyebrow | 12px | 1.4 | 500 | 0.12em | ALL-CAPS mono labels — use JetBrains Mono |
| Data | 32px | 1.2 | 500 | -0.01em | Scores, percentiles — use JetBrains Mono |

```css
--fs-xs:   12px;  /* eyebrows, mono labels */
--fs-sm:   14px;  /* meta, secondary copy */
--fs-base: 16px;  /* body */
--fs-md:   18px;  /* lead body */
--fs-lg:   20px;
--fs-xl:   24px;
--fs-2xl:  32px;
--fs-3xl:  40px;
--fs-4xl:  52px;
--fs-5xl:  64px;
--fs-6xl:  80px;  /* result hero */

--lh-tight:   1.05;
--lh-snug:    1.2;
--lh-normal:  1.45;
--lh-relaxed: 1.6;
```

### Typography Rules

- **General Sans for all UI and body text.** JetBrains Mono for eyebrows (ALL-CAPS), data values, scores, and compound codes only.
- **Weights: 400 and 600 primarily; 500 for mono/eyebrow.** No 300, no 700 in standard usage.
- **Headings are navy (`#0D1B3E`).** Body is near-black (`#1E1E2E`).
- **Tight tracking on large type** (-0.02em display/h1, -0.01em h2/h3). Zero tracking for body.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) on all score displays, data tables, percentile columns.

---

## Spacing

4px base scale.

```css
--sp-1:   4px;
--sp-2:   8px;
--sp-3:   12px;
--sp-4:   16px;
--sp-5:   20px;
--sp-6:   24px;
--sp-8:   32px;
--sp-10:  40px;
--sp-12:  48px;
--sp-16:  64px;
--sp-20:  80px;
--sp-24:  96px;
--sp-32:  128px;
```

Use only these values. No 10px, 14px, 30px, or other off-scale values.

---

## Radii

Conservative — never pill on interactive elements, never sharp.

| Token | Value | Use |
|---|---|---|
| `sm` | 6px | Tags, chips, inline badges |
| `md` | 10px | Buttons, inputs |
| `lg` | 14px | Cards |
| `xl` | 20px | Modals, hero panels |
| `pill` | 999px | Avatars, status dots, progress pills |

```css
--r-sm:   6px;
--r-md:   10px;
--r-lg:   14px;
--r-xl:   20px;
--r-pill: 999px;
```

---

## Shadows

Cool/navy-tinted elevation system. Five steps plus focus ring.

```css
--shadow-xs: 0 1px 2px rgba(13, 27, 62, 0.06);
--shadow-sm: 0 2px 4px rgba(13, 27, 62, 0.06), 0 1px 2px rgba(13, 27, 62, 0.04);
--shadow-md: 0 6px 16px rgba(13, 27, 62, 0.08), 0 2px 4px rgba(13, 27, 62, 0.04);
--shadow-lg: 0 16px 32px rgba(13, 27, 62, 0.10), 0 4px 8px rgba(13, 27, 62, 0.04);
--shadow-xl: 0 28px 56px rgba(13, 27, 62, 0.14), 0 8px 16px rgba(13, 27, 62, 0.06);

/* Focus ring — offset ring pattern */
--ring-focus: 0 0 0 2px #F7F8FA, 0 0 0 4px #1877F2;
```

No warm-cast shadows. All navy-rgba. Shadows are subtle — they imply depth without glowing.

---

## Motion

```css
--ease-out:   cubic-bezier(0.2, 0, 0, 1);   /* fast-out, primary */
--ease-std:   cubic-bezier(0.4, 0, 0.2, 1); /* standard material-like */
--dur-fast:   150ms;   /* hover states, focus rings */
--dur-base:   200ms;   /* state changes, accordion */
--dur-slow:   350ms;   /* page transitions */
--dur-reveal: 600ms;   /* result reveal sequence, identity type animation */
```

**Rules:**
- Hover transitions: 150ms on color/border only. No scale, no transform on hover.
- Focus transitions: 150ms on ring appearance.
- Result reveal: 600ms with `ease-out`. The identity type name animates in as the hero moment.
- No bounce, no spring, no elastic, no parallax, no scroll-jacking.

---

## Layout

```css
--content-marketing: 1200px;   /* marketing pages */
--content-app:       1040px;   /* app surfaces */
--content-reading:    640px;   /* assessment / reading column */
```

---

## AntD Theme Config Mapping

Token file: `@dangelopalladino/etf-core/tokens/6id` → `themeConfig`

| AntD token | Value | Notes |
|---|---|---|
| `colorPrimary` | `#1877F2` | Electric blue — all interactive elements |
| `colorLink` | `#1877F2` | Links use action color |
| `colorInfo` | `#1877F2` | Info notices match action |
| `colorSuccess` | `#059669` | |
| `colorWarning` | `#B45309` | |
| `colorError` | `#DC2626` | |
| `colorBgBase` | `#F7F8FA` | Page background |
| `colorBgContainer` | `#FFFFFF` | Cards / surfaces |
| `colorBgLayout` | `#F7F8FA` | Layout background |
| `colorTextBase` | `#1E1E2E` | Body text — fgBody |
| `colorTextSecondary` | `#6B7280` | |
| `colorBorder` | `#D8DBE0` | Strong — form inputs |
| `colorBorderSecondary` | `#ECEDF0` | Hairline — card edges |
| `borderRadius` | 10 | Buttons, inputs |
| `borderRadiusLG` | 14 | Cards |
| `borderRadiusSM` | 6 | Tags, chips |
| `controlHeight` | 44 | |
| `controlHeightLG` | 52 | |
| `controlHeightSM` | 32 | |
| `fontSize` | 16 | |
| `lineHeight` | 1.6 | |

**Important:** ETFtestSite applies site-level overrides on top of etf-core (see `src/lib/antd-theme.ts`). Those overrides (`colorTextBase: #0D1B3E`, `colorBgLayout: #F0F2F5`, `controlHeightLG: 44`) are intentional site-level design decisions and do not override the canonical token values here.

---

## Component Specs

### Buttons

```css
/* Primary */
height: 44px;
padding: 0 24px;
background: #1877F2;   /* action */
color: #FFFFFF;
border-radius: 10px;   /* --r-md */
font-weight: 600;
font-size: 16px;

/* Hover */
background: #1466D4;   /* action-hover */

/* Secondary / outline */
background: transparent;
border: 1px solid #D8DBE0;
color: #0D1B3E;
border-radius: 10px;
```

Focus ring uses `--ring-focus` pattern (2px offset, 4px action-color).

### Cards

```css
background: #FFFFFF;
border: 1px solid #ECEDF0;   /* border-hairline */
border-radius: 14px;          /* --r-lg */
padding: 24px;
box-shadow: var(--shadow-sm);
```

On hover: shadow upgrades to `--shadow-md`. No scale, no color shift.

### Form Inputs

```css
height: 44px;
padding: 0 16px;
background: #FFFFFF;
border: 1px solid #D8DBE0;   /* border-strong */
border-radius: 10px;          /* --r-md */
font-size: 16px;
color: #1E1E2E;

/* Focus */
border-color: #1877F2;
box-shadow: 0 0 0 2px #F7F8FA, 0 0 0 4px #1877F2;
```

---

## Audit Checklist

Run before shipping any 6i page or component:

- [ ] Page background is `#F7F8FA` (bgPage)?
- [ ] Cards use `#FFFFFF` surface?
- [ ] Body text is `#1E1E2E` (fgBody)?
- [ ] Headings are `#0D1B3E` (fgPrimary/navy)?
- [ ] All action elements (buttons, links, focus rings) use `#1877F2` (action)?
- [ ] Button radius is 10px?
- [ ] Card radius is 14px?
- [ ] Focus ring uses offset pattern (`0 0 0 2px bgPage, 0 0 0 4px action`)?
- [ ] Identity type colors only appear in result/type system screens, not in chrome?
- [ ] Identity wash colors only appear as result-screen section backgrounds?
- [ ] JetBrains Mono used for eyebrow labels and data/score values?
- [ ] General Sans for all body and heading text?
- [ ] Shadows are navy-cast only (no warm-brown rgba)?
- [ ] No gradients?
- [ ] No warm-cream surfaces (`#FFFDF7`, `#FAF5EE`, etc.) — those are etfframework tokens?
- [ ] No slate/muted-teal as action color (`#475c6c`) — that is the v1 palette, retired?
