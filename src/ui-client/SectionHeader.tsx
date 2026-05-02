'use client';

import React from 'react';
import { Typography } from 'antd';
import { HEADING_CLASSES } from '../tokens/shared';

const { Title, Paragraph, Text } = Typography;

// AntD Title rendering needs `!`-prefixed (important) class strings to
// override AntD's own font-size cascade. forceTitle() prepends `!` to each
// space-separated class in HEADING_CLASSES so it composes cleanly with the
// other variant overrides.
const forceTitle = (cls: string) => cls.split(/\s+/).map(c => (c.startsWith('!') ? c : `!${c}`)).join(' ');

const VARIANT_CONFIG = {
  editorial: {
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent block mb-4',
    title: '',
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-lg leading-relaxed text-text-secondary max-w-[560px]',
    wrapper: 'mb-8',
  },
  // Hero / breakdown / compact title classes derive from HEADING_CLASSES (h1 / h2 / h3)
  // — fluid clamp() between mobile and desktop, single source of truth in tokens/shared.ts.
  // Replaces the prior `text-[Npx] md:text-[Mpx] lg:text-[Kpx]` breakpoint ladders.
  // Computed font-size at 320 / 1280px endpoints is unchanged; intermediate viewports
  // scale smoothly. Tracking values for hero collapse to a single -0.03em (matches
  // the prior lg: anchor); the prior small-viewport -0.02em is dropped intentionally.
  hero: {
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent block mb-4',
    title: forceTitle(HEADING_CLASSES.h1),
    titleForceLevel: 1 as (1 | 2 | 3 | null),
    subtitle: 'text-xl leading-relaxed text-text-secondary max-w-[640px]',
    wrapper: 'mb-10',
  },
  breakdown: {
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.12em] text-accent block mb-3',
    title: forceTitle(HEADING_CLASSES.h2),
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-base leading-relaxed text-text-secondary max-w-[560px]',
    wrapper: 'mb-6',
  },
  compact: {
    eyebrow: null,
    title: forceTitle(HEADING_CLASSES.h3),
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-sm leading-relaxed text-text-secondary max-w-[480px]',
    wrapper: 'mb-4',
  },
  /**
   * `manifesto` — oversized eyebrow + ultra-large title for landing/manifesto
   * surfaces. Title sizing is intentionally a custom `clamp(40, 7vw, 80)` —
   * 40px floor sits below `DISPLAY_CLASSES.md` (48 floor) so the variant
   * remains usable at very narrow widths without overflow. One per page max.
   *
   * Added in v1.6.0; literal preserved in v1.10.0 (deviates from
   * `DISPLAY_CLASSES.md` by design — do not auto-derive).
   */
  manifesto: {
    eyebrow: 'text-base font-semibold uppercase tracking-[0.14em] text-accent block mb-6',
    title: '!text-[clamp(40px,7vw,80px)] !tracking-[-0.04em] !leading-[1.02]',
    titleForceLevel: 1 as (1 | 2 | 3 | null),
    subtitle: 'text-xl leading-relaxed text-text-secondary max-w-[640px]',
    wrapper: 'mb-12',
  },
  /**
   * `display` — poster-style title with custom `clamp(48, 9vw, 96)` —
   * 48 floor / 9vw slope is intentionally larger than `DISPLAY_CLASSES.lg`
   * (56 floor / 8vw slope) for hero-only display moments. Eyebrow is
   * suppressed unless explicitly given.
   *
   * Added in v1.6.0; literal preserved in v1.10.0 (deviates from
   * `DISPLAY_CLASSES.lg` by design — do not auto-derive).
   */
  display: {
    eyebrow: 'text-base font-semibold uppercase tracking-[0.14em] text-accent block mb-6',
    title: '!text-[clamp(48px,9vw,96px)] !tracking-[-0.04em] !leading-[1.02]',
    titleForceLevel: 1 as (1 | 2 | 3 | null),
    subtitle: 'text-xl leading-relaxed text-text-secondary max-w-[640px]',
    wrapper: 'mb-12',
  },
} as const;

type SectionHeaderVariant = keyof typeof VARIANT_CONFIG;

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleLevel?: 1 | 2 | 3;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  variant?: SectionHeaderVariant;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleLevel = 2,
  subtitle,
  align = 'left',
  variant = 'editorial',
  actions,
  className = '',
  titleClassName = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const config = VARIANT_CONFIG[variant];
  const level = config.titleForceLevel ?? titleLevel;

  return (
    <div className={`${isCenter ? 'text-center' : ''} ${className}`.trim()}>
      {eyebrow && config.eyebrow && (
        <Text className={config.eyebrow}>{eyebrow}</Text>
      )}

      <Title
        level={level}
        className={`text-primary leading-snug mb-6 ${config.title} ${titleClassName}`.trim()}
      >
        {title}
      </Title>

      {subtitle && (
        <Paragraph
          className={`${config.subtitle} ${isCenter ? 'mx-auto' : ''} ${actions ? 'mb-8' : ''}`}
        >
          {subtitle}
        </Paragraph>
      )}

      {actions && (
        <div className={isCenter ? 'flex justify-center' : ''}>{actions}</div>
      )}
    </div>
  );
}
