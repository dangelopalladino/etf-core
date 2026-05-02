import React from 'react';
import { HEADING_CLASSES } from '../tokens/shared';

/**
 * Server-safe typography for components where AntD Typography cannot be
 * imported (it requires 'use client'). Heading sizes consume HEADING_CLASSES
 * from `@dangelopalladino/etf-core/tokens/shared` directly — single source of
 * truth, fluid via clamp() since v1.7.x.
 */

interface ServerHeadingProps {
  level?: 1 | 2 | 3 | 4;
  weight?: 'bold' | 'semibold';
  children: React.ReactNode;
  className?: string;
}

const HEADING_LEVEL_MAP: Record<1 | 2 | 3 | 4, { classes: string; mb: string }> = {
  1: { classes: HEADING_CLASSES.h1, mb: 'mb-6' },
  2: { classes: HEADING_CLASSES.h2, mb: 'mb-6' },
  3: { classes: HEADING_CLASSES.h3, mb: 'mb-4' },
  4: { classes: HEADING_CLASSES.h4, mb: 'mb-3' },
};

export function ServerHeading({ level = 2, weight = 'bold', children, className = '' }: ServerHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const base = `font-serif ${weight === 'bold' ? 'font-bold' : 'font-semibold'} text-primary`;
  const { classes, mb } = HEADING_LEVEL_MAP[level];
  return <Tag className={`${base} ${classes} ${mb} ${className}`.trim()}>{children}</Tag>;
}

interface ServerTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span';
  variant?: 'body' | 'secondary' | 'muted' | 'eyebrow' | 'caption';
}

/**
 * Body / secondary / muted / eyebrow / caption text variants.
 *
 * `body` resolves to `text-base`, which after consumer paste of
 * `buildThemeBlock()` reads `--text-base = clamp(16px, ..., 18px)` from
 * `FLUID_TYPE_SCALE.base`. See README "Fluid type and spacing contract"
 * for the canonical paste block. Without paste, `text-base` falls back to
 * Tailwind's default 16px (no regression). Variant utility class strings
 * are intentionally unchanged in this repo — fluid behavior is delivered
 * via the consumer's `@theme` block, not by mutating these strings.
 */
export function ServerText({ children, className = '', as: Tag = 'p', variant = 'body' }: ServerTextProps) {
  const variants: Record<string, string> = {
    body: 'text-base leading-relaxed text-text-secondary',
    secondary: 'text-sm leading-relaxed text-text-secondary/70',
    muted: 'text-sm text-text-secondary/50',
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent',
    caption: 'text-xs leading-relaxed text-text-secondary/60',
  };
  return <Tag className={`${variants[variant]} ${className}`.trim()}>{children}</Tag>;
}
