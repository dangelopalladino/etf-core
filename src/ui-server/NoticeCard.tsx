import React from 'react';
import type { StateTone } from '../tokens/shared';
import { STATE_TONE_STYLES } from '../tokens/shared';

export interface NoticeCardProps {
  tone?: StateTone;
  title: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  elevation?: 'flat' | 'subtle';
  className?: string;
  /** Optional explicit id for aria-labelledby; auto-derived when omitted. */
  titleId?: string;
}

const ASSERTIVE: ReadonlyArray<StateTone> = ['urgent', 'caution'];

/**
 * NoticeCard — inline notification block with tone-derived semantics.
 *
 * @remarks
 * Layout at 320px (base): full-width block (`w-full`) with fluid padding
 * (`p-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)]`, 12 → 20px) and fluid icon-
 * to-content gap (`gap-[clamp(0.5rem,0.751vw+0.324rem,1rem)]`, 8 → 16px) that
 * scale smoothly between 375 → 1440 viewports. Border 1px solid; radius
 * `rounded-[8px]` (token md). No fixed height — body text wraps freely. Icon
 * (when provided) is decorative `w-6 h-6` (collapsed in v1.11.0 from a 5/6
 * 2-step ladder), exempt from the no-fixed-width rule.
 *
 * ARIA: tone determines semantics:
 *   - urgent | caution → role="alert" + aria-live="assertive"
 *   - info | success | neutral | locked | loading → role="status" + aria-live="polite"
 * Title rendered as `<h3>` and referenced via aria-labelledby on the region.
 */
export function NoticeCard({
  tone = 'info',
  title,
  children,
  icon,
  elevation = 'flat',
  className = '',
  titleId: titleIdProp,
}: NoticeCardProps) {
  const palette = STATE_TONE_STYLES[tone];
  const isAssertive = ASSERTIVE.includes(tone);
  const role = isAssertive ? 'alert' : 'status';
  const ariaLive = isAssertive ? 'assertive' : 'polite';
  // Stable, deterministic fallback id without useId (server-safe, no client hydration mismatch concern
  // because consumers can pass `titleId` explicitly when they need to reference it).
  const generatedId = React.useId();
  const titleId = titleIdProp ?? `notice-${generatedId}`;

  const elevationClass =
    elevation === 'subtle' ? 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]' : '';

  return (
    <section
      role={role}
      aria-live={ariaLive}
      aria-labelledby={titleId}
      className={`w-full p-[clamp(0.75rem,0.751vw+0.574rem,1.25rem)] rounded-[8px] border flex items-start gap-[clamp(0.5rem,0.751vw+0.324rem,1rem)] ${elevationClass} ${className}`.trim()}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.text,
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3
          id={titleId}
          className="text-sm md:text-base font-semibold leading-[1.3] m-0"
        >
          {title}
        </h3>
        {children ? (
          <div className="mt-2 text-xs md:text-sm leading-[1.5] break-words">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default NoticeCard;
