import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  /** Container max-width: narrow (max-w-3xl), default (max-w-5xl), wide (max-w-6xl) */
  maxWidth?: 'narrow' | 'default' | 'wide';
  /** Vertical padding: compact (py-12 md:py-16), default (py-16 md:py-24), generous (py-24 md:py-32) */
  spacing?: 'compact' | 'default' | 'generous';
  /** Background treatment. surface-strong uses SURFACE_TOKENS.ground for visible contrast. */
  background?: 'none' | 'surface' | 'surface-strong' | 'primary';
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
} as const;

const SPACING_MAP = {
  compact: 'py-12 md:py-16',
  default: 'py-16 md:py-24',
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

export default function SectionWrapper({
  children,
  maxWidth = 'default',
  spacing = 'default',
  background = 'none',
  border = 'none',
  density,
  as: Tag = 'section',
  id,
  className = '',
}: SectionWrapperProps) {
  const outerClasses = [
    SPACING_MAP[spacing],
    BG_MAP[background],
    BORDER_MAP[border],
    'px-4 sm:px-6',
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
