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
   * Vertical padding.
   * - `tight` — `py-8 md:py-12` (Added in v1.6.0)
   * - `compact` — `py-12 md:py-16`
   * - `default` — `py-16 md:py-24`
   * - `spacious` — `py-20 md:py-28` (Added in v1.6.0)
   * - `generous` — `py-24 md:py-32`
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

const SPACING_MAP = {
  tight: 'py-8 md:py-12',
  compact: 'py-12 md:py-16',
  default: 'py-16 md:py-24',
  spacious: 'py-20 md:py-28',
  generous: 'py-24 md:py-32',
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

export default function SectionWrapper({
  children,
  maxWidth = 'default',
  spacing = 'default',
  background = 'none',
  tone,
  border = 'none',
  density,
  as: Tag = 'section',
  id,
  className = '',
}: SectionWrapperProps) {
  // tone wins over background for the bg layer when both are present.
  const bgClass = tone ? TONE_MAP[tone] : BG_MAP[background];

  // maxWidth='full' is edge-to-edge: drop outer horizontal padding so children
  // can self-constrain.
  const horizontalPadding = maxWidth === 'full' ? '' : 'px-4 sm:px-6';

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
