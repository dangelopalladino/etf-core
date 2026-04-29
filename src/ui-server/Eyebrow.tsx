import React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Eyebrow — small, uppercase, tracked label that sits above a heading.
 *
 * @remarks
 * Layout at 320px (base): `text-[11px]` with `tracking-[0.1em]` and
 * `uppercase`, rendered as a `<p>` so it never participates in heading
 * outline. No fixed width or height; flows inline-block with parent. Scales
 * up to `text-[12px]` at `md:` (768px). Padding contributed by parent only;
 * eyebrow itself ships zero margin so consumers control rhythm.
 *
 * ARIA: a `<p>` (default) keeps eyebrows out of the heading hierarchy — they
 * are not headings, even though they look like one. If the consumer needs
 * inline placement, `as="span"` is allowed.
 */
export function Eyebrow({ children, className = '', as: Tag = 'p' }: EyebrowProps) {
  return (
    <Tag
      className={`text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.1em] text-accent ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export default Eyebrow;
