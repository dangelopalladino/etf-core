'use client';

import React from 'react';

export interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_PX: Record<NonNullable<LoadingStateProps['size']>, number> = { sm: 16, md: 24, lg: 32 };

/**
 * LoadingState — spinner + accessible live region.
 *
 * @remarks
 * Layout at 320px (base): `inline-flex items-center gap-2`, sized by intrinsic
 * SVG (decorative-fixed-px exempt: 16/24/32 — the SVG is decorative, not a
 * content container). Label text rendered visibly to the right of the spinner
 * (`text-[13px] md:text-[14px]`). No fixed wrapper width or height — the
 * wrapper grows to whatever content it carries. No padding ramp needed
 * (LoadingState is in-line with siblings; the parent decides padding).
 *
 * ARIA: outer wrapper carries `role="status"` + `aria-live="polite"` +
 * `aria-busy="true"`. Visible label is `<span>`; if `label` is empty string,
 * a visually-hidden announcement is still emitted via `<span className="sr-only">Loading</span>`.
 * Spinner SVG is `aria-hidden="true"`.
 *
 * Reduced motion: when `prefers-reduced-motion: reduce` is set, the SVG
 * stops spinning (animation removed) and renders as a static disc. The CSS
 * `motion-reduce:animate-none` class handles this without JS detection.
 */
export function LoadingState({
  label = 'Loading',
  size = 'md',
  className = '',
}: LoadingStateProps) {
  const px = SIZE_PX[size];
  const visibleLabel = label.length > 0 ? label : undefined;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center gap-2 ${className}`.trim()}
    >
      <svg
        aria-hidden="true"
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin motion-reduce:animate-none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {visibleLabel ? (
        <span className="text-xs md:text-sm leading-[1.4]">{visibleLabel}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </span>
  );
}

export default LoadingState;
