'use client';

import React from 'react';

export interface SkeletonCardProps {
  lines?: number;
  withMedia?: boolean;
  /** Aspect ratio for the media slot, e.g. "16/9" | "4/3" | "1/1". Default "16/9". */
  mediaAspect?: string;
  className?: string;
}

/**
 * SkeletonCard — placeholder card for loading states.
 *
 * @remarks
 * Layout at 320px (base): `w-full p-3 rounded-[8px] border` block. Media slot
 * (when `withMedia`) is `w-full` with `aspect-ratio` driven by the
 * `mediaAspect` prop — NEVER a fixed pixel height. Text rows are stacked
 * `space-y-2`, each row a tinted rectangle `h-3` (decorative fixed-height
 * exempt: skeleton lines are decorative tints, not content containers).
 * Scales to `p-4 space-y-3` at `md:` (768px) — padding ramps up.
 *
 * ARIA: the entire skeleton is `aria-hidden="true"` — it is purely decorative,
 * a placeholder for incoming content. The parent component is responsible for
 * the live-region announcement (typically by composing with `<LoadingState>`
 * adjacent so AT users get an accurate status update).
 *
 * Reduced motion: shimmer animation is keyed off the parent class
 * `motion-safe:animate-pulse` — when `prefers-reduced-motion: reduce` is set,
 * the tint is static. Tailwind's `motion-safe:` variant handles this.
 */
export function SkeletonCard({
  lines = 3,
  withMedia = false,
  mediaAspect = '16/9',
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full p-4 rounded-[8px] border border-border bg-surface-raised ${className}`.trim()}
    >
      {withMedia ? (
        <div
          className="w-full rounded-[6px] bg-surface-ground motion-safe:animate-pulse mb-4"
          style={{ aspectRatio: mediaAspect }}
        />
      ) : null}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-[4px] bg-surface-ground motion-safe:animate-pulse"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
