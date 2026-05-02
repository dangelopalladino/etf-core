import React from 'react';
import { HERO_CLASSES } from '../tokens/shared';

export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Eyebrow — small, uppercase, tracked label that sits above a heading.
 *
 * @remarks
 * Type sizing comes from `HERO_CLASSES.eyebrow` (11px → 12px fluid clamp
 * across 375 → 1440). Rendered as `<p>` so it never participates in the
 * heading outline. No fixed width or height; flows inline-block with parent.
 * Padding contributed by parent only; eyebrow itself ships zero margin so
 * consumers control rhythm.
 *
 * Migrated from inline `text-[11px] md:text-[12px]` ladder to the shared
 * fluid token in v1.11.0 (off-grid sweep).
 *
 * ARIA: a `<p>` (default) keeps eyebrows out of the heading hierarchy — they
 * are not headings, even though they look like one. If the consumer needs
 * inline placement, `as="span"` is allowed.
 */
export function Eyebrow({ children, className = '', as: Tag = 'p' }: EyebrowProps) {
  return (
    <Tag
      className={`${HERO_CLASSES.eyebrow} text-accent ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export default Eyebrow;
