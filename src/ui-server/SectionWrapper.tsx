import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  /**
   * Container max-width.
   * - `narrow` — `max-w-3xl`
   * - `default` — `max-w-5xl`
   * - `wide` — `max-w-6xl`
   * - `full` — `max-w-none`, no horizontal padding on the outer container.
   *   Children must self-constrain. Added in v1.6.0.
   */
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  /**
   * Vertical padding. Fluid via `clamp()` — scales smoothly between mobile
   * and desktop instead of stepping at the `md:` breakpoint.
   * - `tight`    — `clamp(1.5rem, 4vw, 3rem)`   (24 → 48px)
   * - `compact`  — `clamp(2rem,   5vw, 4rem)`   (32 → 64px)
   * - `default`  — `clamp(3rem,   7vw, 6rem)`   (48 → 96px)
   * - `spacious` — `clamp(4rem,   9vw, 7rem)`   (64 → 112px)
   * - `generous` — `clamp(5rem,  10vw, 8rem)`   (80 → 128px)
   *
   * Mobile baselines reduced from the v1.6.x breakpoint-ladder values as
   * part of the mobile-sizing remediation; desktop maxima preserved.
   */
  spacing?: 'tight' | 'compact' | 'default' | 'spacious' | 'generous';
  /** Background treatment. surface-strong uses SURFACE_TOKENS.ground for visible contrast. */
  background?: 'none' | 'surface' | 'surface-strong' | 'primary';
  /**
   * Optional warm tone surface. Applies a soft warm-surface fill, falling back
   * to the standard `surface` token when `--color-surface-warm` isn't defined
   * (etfframework currently). When both `background` and `tone` are passed,
   * `tone` wins for the bg layer.
   *
   * Added in v1.6.0.
   */
  tone?: 'warm';
  /** Border treatment */
  border?: 'none' | 'top' | 'bottom' | 'both';
  /** Vertical rhythm between direct children */
  density?: 'airy' | 'default' | 'dense';
  /**
   * Horizontal padding on the outer container.
   * - `fluid`  — `clamp(20px, 5.634vw - 0.071rem, 80px)` (matches `FLUID_SPACING_SCALE.sectionPx`).
   *              Default. Scales smoothly between mobile and desktop instead of stepping at `sm:`.
   * - `static` — legacy `px-4 sm:px-6` (escape hatch for tight layouts).
   * - `none`   — `px-0`. Use with `maxWidth='full'` for edge-to-edge surfaces; children must self-constrain.
   *
   * `maxWidth='full'` forces `none` regardless of this prop.
   *
   * Added in v1.10.0.
   */
  paddingX?: 'fluid' | 'static' | 'none';
  /** HTML element tag */
  as?: 'section' | 'div' | 'main' | 'article';
  /** Optional anchor ID */
  id?: string;
  /** Additional Tailwind layout classes */
  className?: string;
}

const MAX_WIDTH_MAP = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
  full: 'max-w-none',
} as const;

// Fluid section padding via clamp(). Mobile minima are intentionally lower
// than the prior breakpoint-ladder values (24/32/48/64/80 vs. 32/48/64/80/96)
// so 320–768px viewports breathe; desktop maxima match the prior `md:` values.
const SPACING_MAP = {
  tight:    'py-[clamp(1.5rem,4vw,3rem)]',
  compact:  'py-[clamp(2rem,5vw,4rem)]',
  default:  'py-[clamp(3rem,7vw,6rem)]',
  spacious: 'py-[clamp(4rem,9vw,7rem)]',
  generous: 'py-[clamp(5rem,10vw,8rem)]',
} as const;

const BG_MAP = {
  none: '',
  surface: 'bg-surface',
  'surface-strong': 'bg-surface-ground',
  primary: 'bg-primary',
} as const;

const BORDER_MAP = {
  none: '',
  top: 'border-t border-border',
  bottom: 'border-b border-border',
  both: 'border-y border-border',
} as const;

const DENSITY_MAP = {
  airy: '[&>*+*]:mt-16 md:[&>*+*]:mt-20',
  default: '[&>*+*]:mt-10 md:[&>*+*]:mt-12',
  dense: '[&>*+*]:mt-6 md:[&>*+*]:mt-8',
} as const;

// Tailwind arbitrary value: warm surface with safe fallback to existing
// surface token, so etfframework (which may not declare --color-surface-warm)
// still renders correctly.
const TONE_MAP = {
  warm: 'bg-[var(--color-surface-warm,var(--color-surface))]',
} as const;

// Horizontal padding map. `fluid` literal matches FLUID_SPACING_SCALE.sectionPx
// in src/tokens/shared.ts — kept inline so the wrapper works without consumer
// having pasted the @theme block. Update both sites if the spec changes.
const PADDING_X_MAP = {
  fluid:  'px-[clamp(1.25rem,5.634vw-0.071rem,5rem)]',
  static: 'px-4 sm:px-6',
  none:   '',
} as const;

export default function SectionWrapper({
  children,
  maxWidth = 'default',
  spacing = 'default',
  background = 'none',
  tone,
  border = 'none',
  density,
  paddingX = 'fluid',
  as: Tag = 'section',
  id,
  className = '',
}: SectionWrapperProps) {
  // tone wins over background for the bg layer when both are present.
  const bgClass = tone ? TONE_MAP[tone] : BG_MAP[background];

  // maxWidth='full' is edge-to-edge: drop outer horizontal padding regardless
  // of paddingX so children can self-constrain.
  const horizontalPadding = maxWidth === 'full' ? '' : PADDING_X_MAP[paddingX];

  const outerClasses = [
    SPACING_MAP[spacing],
    bgClass,
    BORDER_MAP[border],
    horizontalPadding,
  ].filter(Boolean).join(' ');

  const innerClasses = [
    MAX_WIDTH_MAP[maxWidth],
    'mx-auto',
    density ? DENSITY_MAP[density] : '',
  ].filter(Boolean).join(' ');

  return (
    <Tag id={id} className={`${outerClasses} ${className}`.trim()}>
      <div className={innerClasses}>
        {children}
      </div>
    </Tag>
  );
}
