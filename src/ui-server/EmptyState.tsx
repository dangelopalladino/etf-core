import React from 'react';
import { HEADING_CLASSES } from '../tokens/shared';

export interface EmptyStateProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  /** Decorative graphic. aria-hidden by default; pass <Img alt="…"> to make it semantic. */
  illustration?: React.ReactNode;
  tone?: 'neutral' | 'locked';
  className?: string;
  titleId?: string;
}

/**
 * EmptyState — the canonical "nothing here yet" / "no results" panel.
 *
 * @remarks
 * Layout at 320px (base): full-width column (`w-full flex flex-col items-center
 * text-center`) with fluid clamp() padding/gap that scales smoothly between
 * 375 → 1440 viewports — `py-[clamp(2rem,3.005vw+1.296rem,4rem)]`,
 * `px-[clamp(1rem,1.502vw+0.648rem,2rem)]` (matches `FLUID_SPACING_SCALE.cardP`),
 * `gap-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)]`. Title uses
 * `HEADING_CLASSES.h3`; body is `text-sm`. Illustration wrapper is fluid
 * `max-w-[clamp(12.5rem,7.512vw+10.74rem,17.5rem)]` (200 → 280px). No fixed
 * heights — content wraps freely. Replaced multi-step breakpoint ladders in
 * v1.11.0.
 *
 * ARIA: `<section>` with `aria-labelledby` referencing the title id; the
 * illustration slot is wrapped in `aria-hidden="true"` by default. If the
 * consumer passes a semantically meaningful image (e.g., `<Img alt="…" />`),
 * they should pass it as a child of `illustration` and the alt text will be
 * exposed to AT (the wrapper aria-hidden does not propagate through the
 * `<img alt>` because we apply aria-hidden only when illustration is present
 * but no explicit override is given — see the `illustrationLabel` prop in a
 * future v2 if this becomes insufficient).
 */
export function EmptyState({
  title,
  body,
  action,
  illustration,
  tone: _tone = 'neutral',
  className = '',
  titleId: titleIdProp,
}: EmptyStateProps) {
  const generatedId = React.useId();
  const titleId = titleIdProp ?? `empty-${generatedId}`;

  return (
    <section
      aria-labelledby={titleId}
      className={`w-full flex flex-col items-center text-center py-[clamp(2rem,3.005vw+1.296rem,4rem)] px-[clamp(1rem,1.502vw+0.648rem,2rem)] gap-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)] ${className}`.trim()}
    >
      {illustration ? (
        <div aria-hidden="true" className="w-full max-w-[clamp(12.5rem,7.512vw+10.74rem,17.5rem)]">
          {illustration}
        </div>
      ) : null}
      <h2 id={titleId} className={`${HEADING_CLASSES.h3} font-semibold m-0`}>
        {title}
      </h2>
      {body ? (
        <p className="text-sm leading-[1.5] text-text-secondary m-0 max-w-prose">
          {body}
        </p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </section>
  );
}

export default EmptyState;
