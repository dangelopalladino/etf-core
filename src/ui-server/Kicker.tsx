import React from 'react';

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
 * Layout at 320px (base): `text-[12px]` with `font-bold` and `tracking-[0.08em]`,
 * rendered as `<p>`. No fixed dimensions; one-line by default, wraps if the
 * parent is narrow. Scales to `text-[14px]` at `md:`. Color is the brand
 * primary (not accent — Kicker is more declarative than Eyebrow).
 *
 * ARIA: same as Eyebrow — `<p>` so it never enters the heading outline.
 */
export function Kicker({ children, className = '', as: Tag = 'p' }: KickerProps) {
  return (
    <Tag
      className={`text-[12px] md:text-[14px] font-bold uppercase tracking-[0.08em] text-text-primary ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export default Kicker;
