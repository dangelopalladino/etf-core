import React from 'react';
import type { StateTone } from '../tokens/shared';
import { STATE_TONE_STYLES } from '../tokens/shared';

export interface IconBadgeProps {
  icon: React.ReactNode;
  tone?: StateTone;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. Provide ⇒ role=img + aria-label; omit ⇒ aria-hidden (decorative). */
  label?: string;
  className?: string;
}

/**
 * IconBadge — circular icon-in-tinted-circle primitive used by Stat tiles,
 * notice card icons, and feature cards.
 *
 * @remarks
 * Layout at 320px (base): the badge itself is decorative-fixed-size — the
 * three sizes (`sm` 28px, `md` 36px, `lg` 44px) are exempt from the
 * no-fixed-width-below-768px rule because IconBadge is itself a decorative
 * element, not a content container. It centers the icon (`flex items-center
 * justify-center`), borders the circle 1px, and tints background/text via
 * STATE_TONE_STYLES. The icon SVG slot inherits `width: 60%` so it scales
 * with the box. No responsive jump in size — sizes are intentional fixed
 * tokens; consumers pick `sm | md | lg` per layout.
 *
 * Documented decorative-px exemptions: 28 / 36 / 44 — all multiples of 4 from
 * SHARED_SPACING_SCALE.
 *
 * ARIA: providing `label` ⇒ outer span gets `role="img"` + `aria-label={label}`,
 * inner SVG slot gets `aria-hidden="true"`. Omitting `label` ⇒ the entire
 * span is `aria-hidden="true"` and considered decorative. No silent guess.
 */
const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 28, md: 36, lg: 44 };

export function IconBadge({
  icon,
  tone = 'neutral',
  size = 'md',
  label,
  className = '',
}: IconBadgeProps) {
  const palette = STATE_TONE_STYLES[tone];
  const px = SIZE_PX[size];
  const ariaProps = label
    ? ({ role: 'img' as const, 'aria-label': label })
    : ({ 'aria-hidden': true as const });

  return (
    <span
      {...ariaProps}
      className={`inline-flex items-center justify-center rounded-full border ${className}`.trim()}
      style={{
        width: px,
        height: px,
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.text,
      }}
    >
      <span aria-hidden="true" className="inline-flex items-center justify-center" style={{ width: '60%', height: '60%' }}>
        {icon}
      </span>
    </span>
  );
}

export default IconBadge;
