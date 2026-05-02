import React from 'react';
import { KICKER_CLASS } from '../tokens/shared';

export interface KickerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Kicker — sibling of Eyebrow with heavier weight; used for section
 * categorization above a Hero or major section break.
 *
 * @remarks
 * Type sizing comes from `KICKER_CLASS` (12px → 14px fluid clamp across
 * 375 → 1440). Rendered as `<p>`. No fixed dimensions; one-line by default,
 * wraps if the parent is narrow. Color is the brand primary (not accent —
 * Kicker is more declarative than Eyebrow).
 *
 * Migrated from inline `text-[12px] md:text-[14px]` ladder to the shared
 * fluid token in v1.11.0 (off-grid sweep).
 *
 * ARIA: same as Eyebrow — `<p>` so it never enters the heading outline.
 */
export function Kicker({ children, className = '', as: Tag = 'p' }: KickerProps) {
  return (
    <Tag
      className={`${KICKER_CLASS} text-text-primary ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export default Kicker;
