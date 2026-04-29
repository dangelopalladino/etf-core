import React from 'react';
import type { RadiusKey, SpaceKey } from '../tokens/shared';
import { radius, space } from '../tokens/shared';

type AsTag = 'div' | 'article' | 'section' | 'aside' | 'li';

export interface CardProps {
  children: React.ReactNode;
  /** Padding key (SHARED_SPACING_SCALE). Mobile-first ramp via `paddingMd`/`paddingLg`. */
  padding?: SpaceKey;
  paddingMd?: SpaceKey;
  paddingLg?: SpaceKey;
  /** Radius key. ETF brand caps at `lg`; 6id and shared allow `xl`. */
  radius?: RadiusKey;
  /** Tone tint surface — 'default' | 'raised' | 'ground'. */
  tone?: 'default' | 'raised' | 'ground';
  border?: boolean;
  as?: AsTag;
  className?: string;
}

const TONE_BG: Record<NonNullable<CardProps['tone']>, string> = {
  default: '#F5EFE6',
  raised:  '#FAF5EE',
  ground:  '#EDE6DA',
};

/**
 * Card — token-bound surface container.
 *
 * @remarks
 * Layout at 320px (base): `w-full` block, padding `space(padding)` px (default
 * `padding=4` = 16px), radius via `radius(radius)` (default `md` = 8px), 1px
 * border by default. No fixed dimensions — height is content-driven; width
 * fills the parent. Padding ramps up at md/lg via `paddingMd`/`paddingLg`
 * props (defaults: 24/32 px). Padding never starts large and shrinks.
 *
 * ARIA: defaults to `<div>` with no implicit semantic. Polymorphic `as`
 * permits `<article>` or `<section>` when the content represents a standalone
 * entity. Consumer chooses; Card does not inject a `role`.
 */
export function Card({
  children,
  padding = 4,
  paddingMd,
  paddingLg,
  radius: radiusKey = 'md',
  tone = 'default',
  border = true,
  as: Tag = 'div',
  className = '',
}: CardProps) {
  const px = space(padding);
  const radiusPx = radius(radiusKey);
  const mdPxClass = paddingMd != null ? `md:[padding:${space(paddingMd)}px]` : 'md:[padding:24px]';
  const lgPxClass = paddingLg != null ? `lg:[padding:${space(paddingLg)}px]` : '';

  return (
    <Tag
      className={`w-full ${border ? 'border' : ''} ${mdPxClass} ${lgPxClass} ${className}`.trim()}
      style={{
        padding: px,
        borderRadius: radiusPx,
        backgroundColor: TONE_BG[tone],
        borderColor: border ? '#E5DDD4' : undefined,
      }}
    >
      {children}
    </Tag>
  );
}

export default Card;
