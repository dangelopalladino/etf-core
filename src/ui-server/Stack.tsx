import React from 'react';
import type { SpaceKey } from '../tokens/shared';
import { space } from '../tokens/shared';

type AsTag = 'div' | 'ul' | 'ol' | 'section' | 'article' | 'nav' | 'header' | 'footer';

export interface StackProps {
  children: React.ReactNode;
  /** Vertical gap, in SHARED_SPACING_SCALE keys. */
  gap?: SpaceKey;
  /** Optional larger gap activated at `md:` (768px+). Mobile-first ramp-up. */
  gapMd?: SpaceKey;
  align?: 'start' | 'center' | 'end' | 'stretch';
  as?: AsTag;
  className?: string;
}

export interface ClusterProps {
  children: React.ReactNode;
  /** Gap (both axes), in SHARED_SPACING_SCALE keys. */
  gap?: SpaceKey;
  gapMd?: SpaceKey;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  as?: AsTag;
  className?: string;
}

/**
 * Stack — vertical layout primitive. Children flow column-wise with a
 * token-bound gap.
 *
 * @remarks
 * Layout at 320px (base): `flex flex-col`, `gap` resolves to `space(gap)` px
 * (default `gap=4` = 16px). Width is 100% of container — no fixed widths.
 * No fixed heights; children grow naturally. If `gapMd` is provided, gap
 * ramps up at the `md:` breakpoint (768px) — never down. align defaults to
 * 'stretch' so children fill the cross-axis at narrow widths.
 *
 * ARIA: default `<div>` carries no implicit semantics. Pass `as="ul"` (or
 * "ol") when the stack is a list of like items; consumer is responsible for
 * wrapping each child in `<li>`.
 */
const ALIGN_MAP: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const JUSTIFY_MAP: Record<NonNullable<ClusterProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export function Stack({
  children,
  gap = 4,
  gapMd,
  align = 'stretch',
  as: Tag = 'div',
  className = '',
}: StackProps) {
  const gapPx = space(gap);
  const style: React.CSSProperties = { gap: gapPx };
  // Inline media query is not supported in style; ramp up via Tailwind
  // arbitrary class (`md:[gap:Npx]`) so SSR + Tailwind JIT both see it.
  const gapMdClass = gapMd != null ? `md:[gap:${space(gapMd)}px]` : '';
  return (
    <Tag
      className={`flex flex-col w-full ${ALIGN_MAP[align]} ${gapMdClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/**
 * Cluster — wrapping horizontal layout primitive.
 *
 * @remarks
 * Layout at 320px (base): `flex flex-wrap`, `gap` resolves to `space(gap)` px.
 * `align` defaults to 'center' so mixed-height children align on baseline.
 * Wraps onto multiple rows on narrow screens — no horizontal scrolling, no
 * fixed widths. `gapMd` ramps gap up at md:. justify defaults to 'start'.
 */
export function Cluster({
  children,
  gap = 3,
  gapMd,
  align = 'center',
  justify = 'start',
  as: Tag = 'div',
  className = '',
}: ClusterProps) {
  const gapPx = space(gap);
  const style: React.CSSProperties = { gap: gapPx };
  const gapMdClass = gapMd != null ? `md:[gap:${space(gapMd)}px]` : '';
  return (
    <Tag
      className={`flex flex-wrap w-full ${ALIGN_MAP[align]} ${JUSTIFY_MAP[justify]} ${gapMdClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

export default Stack;
