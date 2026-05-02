import React from 'react';
import { HERO_CLASSES } from '../tokens/shared';

export interface HeroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  /** Media slot — image, video, illustration. Consumer is responsible for alt/aria-hidden. */
  media?: React.ReactNode;
  /** When true, renders a side-by-side grid at md:+. Default: stacked at all widths. */
  split?: boolean;
  /** Heading level for the title. Default 1 (use 2 for nested heroes). */
  level?: 1 | 2;
  className?: string;
}

/**
 * Hero — top-of-section composition primitive.
 *
 * @remarks
 * Layout at 320px (base): single-column `<header>` with fluid padding
 * (`py-[clamp(2.5rem,6vw,5rem)] px-[clamp(1rem,3vw,2.5rem)]`) and fluid
 * vertical gaps (`gap-[clamp(1.5rem,0.751vw+1.324rem,2rem)]` outer,
 * `gap-[clamp(1rem,0.751vw+0.824rem,1.5rem)]` inner). Type comes from
 * `HERO_CLASSES` (title, subtitle, eyebrow) — fluid clamp() between 375
 * → 1440 viewports. Media slot is `w-full` with intrinsic aspect ratio.
 *
 * `split=true`: at md+, switches to a two-column grid
 * (`md:grid-cols-2 md:gap-[clamp(2.5rem,1.502vw+2.148rem,3.5rem)]`) with
 * media on the right.
 *
 * No fixed widths below md. Padding scales smoothly (no breakpoint steps)
 * — never starts large and shrinks.
 *
 * ARIA: outer `<header>`. Title is `<h1>` by default (or `<h2>` if level=2).
 * Eyebrow is `<p>` to keep it out of the heading outline. CTA group has no
 * implicit landmark — consumers wrap CTAs in their own button/link
 * components which carry their own ARIA.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  media,
  split = false,
  level = 1,
  className = '',
}: HeroProps) {
  const TitleTag = (level === 1 ? 'h1' : 'h2') as 'h1' | 'h2';

  const content = (
    <div className="flex flex-col gap-[clamp(1rem,0.751vw+0.824rem,1.5rem)] min-w-0">
      {eyebrow ? <p className={`${HERO_CLASSES.eyebrow} text-accent m-0`}>{eyebrow}</p> : null}
      <TitleTag className={`${HERO_CLASSES.title} font-bold m-0 [overflow-wrap:anywhere]`}>
        {title}
      </TitleTag>
      {subtitle ? (
        <p className={`${HERO_CLASSES.subtitle} text-text-secondary m-0 max-w-prose`}>
          {subtitle}
        </p>
      ) : null}
      {(primary || secondary) ? (
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {primary}
          {secondary}
        </div>
      ) : null}
    </div>
  );

  const mediaSlot = media ? (
    <div className="w-full min-w-0">{media}</div>
  ) : null;

  return (
    <header
      className={`w-full py-[clamp(2.5rem,6vw,5rem)] px-[clamp(1rem,3vw,2.5rem)] ${
        split ? 'md:grid md:grid-cols-2 md:gap-[clamp(2.5rem,1.502vw+2.148rem,3.5rem)] md:items-center' : 'flex flex-col gap-[clamp(1.5rem,0.751vw+1.324rem,2rem)]'
      } ${className}`.trim()}
    >
      {content}
      {mediaSlot}
    </header>
  );
}

export default Hero;
