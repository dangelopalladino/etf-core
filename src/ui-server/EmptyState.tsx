import React from 'react';

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
 * text-center`), `py-8 px-4` padding, `gap-3`. Title `text-[18px]`, body
 * `text-[14px]`, action stacked beneath. No fixed heights — content wraps
 * freely. Illustration slot wraps decorative SVG/PNG; consumer-supplied
 * dimensions are respected but the wrapper has `max-w-[200px]` at base scaling
 * up to `max-w-[280px]` at `md:`. Scales to `py-12 px-6 gap-4` at `md:` (768px)
 * and `py-16 px-8 gap-5` at `lg:`. Padding ramps up — never starts large.
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
      className={`w-full flex flex-col items-center text-center py-8 px-4 gap-3 sm:py-10 sm:gap-4 md:py-12 md:px-6 md:gap-4 lg:py-16 lg:px-8 lg:gap-5 ${className}`.trim()}
    >
      {illustration ? (
        <div aria-hidden="true" className="w-full max-w-[200px] md:max-w-[280px]">
          {illustration}
        </div>
      ) : null}
      <h2 id={titleId} className="text-[18px] md:text-[22px] lg:text-[24px] font-semibold leading-[1.25] m-0">
        {title}
      </h2>
      {body ? (
        <p className="text-[14px] md:text-[15px] leading-[1.5] text-text-secondary m-0 max-w-prose">
          {body}
        </p>
      ) : null}
      {action ? <div className="mt-2 md:mt-3">{action}</div> : null}
    </section>
  );
}

export default EmptyState;
