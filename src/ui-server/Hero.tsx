import React from 'react';

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
 * Layout at 320px (base): single-column `<header>` with `flex flex-col gap-4`,
 * padding `py-10 px-4`. Title is `text-[28px]` leading-tight; eyebrow renders
 * above as `<p>` (NOT a heading — eyebrows are not headings); subtitle is
 * `text-[15px]` body color; CTAs render as a `Cluster`-style wrap row beneath
 * subtitle (`gap-3`); media slot renders below CTAs at base, `w-full` and
 * intrinsic-aspect-ratio (no fixed height).
 *
 * Scales up:
 *   - sm: `py-12 px-6 gap-5`, title `text-[32px]`
 *   - md: `py-16 px-8 gap-6`, title `text-[40px]`. If `split=true`, switches to
 *     a two-column grid (`md:grid-cols-2`) with media on the right.
 *   - lg: `py-20 px-10`, title `text-[52px]`.
 *
 * No fixed widths anywhere below md. Media slot is `w-full` and uses the
 * intrinsic aspect of whatever is inside (image dims, embed ratio, etc.).
 * Padding ramps up — never starts large and shrinks.
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
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 min-w-0">
      {eyebrow ? <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.1em] text-accent m-0">{eyebrow}</p> : null}
      <TitleTag className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[52px] font-bold leading-[1.1] tracking-[-0.02em] m-0 [overflow-wrap:anywhere]">
        {title}
      </TitleTag>
      {subtitle ? (
        <p className="text-[15px] md:text-[17px] lg:text-[18px] leading-[1.5] text-text-secondary m-0 max-w-prose">
          {subtitle}
        </p>
      ) : null}
      {(primary || secondary) ? (
        <div className="flex flex-wrap items-center gap-3 mt-1 md:mt-2">
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
      className={`w-full py-10 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-10 ${
        split ? 'md:grid md:grid-cols-2 md:gap-10 lg:gap-14 md:items-center' : 'flex flex-col gap-6 md:gap-8'
      } ${className}`.trim()}
    >
      {content}
      {mediaSlot}
    </header>
  );
}

export default Hero;
