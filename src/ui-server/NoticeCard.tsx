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
 * Layout at 320px (base): full-width block (`w-full`), `p-3` padding, `gap-2`
 * between icon and content, vertical text stack. Border `1px` solid; radius
 * `rounded-[8px]` (token md). No fixed height — body text wraps freely.
 * Scales to `p-4 gap-3` at `sm:` (640px) and `p-5 gap-4` at `md:` (768px).
 * Icon (when provided) is decorative `w-5 h-5` at base, `md:w-6 md:h-6`,
 * which is exempt from the no-fixed-width rule (decorative icon, not a
 * content container).
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
      className={`w-full p-3 sm:p-4 md:p-5 rounded-[8px] border flex items-start gap-2 sm:gap-3 md:gap-4 ${elevationClass} ${className}`.trim()}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.text,
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 inline-flex items-center justify-center"
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
