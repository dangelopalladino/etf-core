'use client';

import React, { useCallback, useEffect, useId, useRef } from 'react';
import { HEADING_CLASSES, BLUEPRINT_SHADOWS } from '../tokens/shared';

export interface LockedGateProps {
  children: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  unlockAction?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * LockedGate — replaces gated content with a dialog-style panel.
 *
 * @remarks
 * Layout at 320px (base): full-width relative container; the gate panel is
 * absolutely positioned over the (now `inert`) children and centered with
 * `flex items-center justify-center`. Panel itself is `w-full max-w-[320px]
 * p-5` with `rounded-[12px]` and a subtle shadow. No fixed widths: the
 * panel grows to fill narrow viewports and caps at `max-w-[420px]` at md:
 * and `max-w-[480px]` at lg:. Padding ramps `p-5 → md:p-6 → lg:p-8`.
 *
 * Anti-pattern enforcement: the gate does NOT visually blur the children —
 * blur-tease is a known dark pattern. Children are rendered with `inert`
 * (modern browsers) + `aria-hidden="true"` (fallback) so AT skips them.
 *
 * ARIA: panel is `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
 * on the title. Focus moves to the first focusable element in the panel on
 * mount (or to the panel itself if none exists). Tab cycles within the panel
 * (focus trap). Esc closes the gate when `dismissible`. On unmount, focus
 * returns to the previously-focused element.
 */
export function LockedGate({
  children,
  title,
  body,
  unlockAction,
  dismissible = false,
  onDismiss,
  className = '',
}: LockedGateProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const focusFirstInPanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusables.length > 0) focusables[0].focus();
    else panel.focus();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    }
    focusFirstInPanel();
    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [focusFirstInPanel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && dismissible) {
        e.stopPropagation();
        onDismiss?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [dismissible, onDismiss]
  );

  return (
    <div className={`relative w-full ${className}`.trim()}>
      {/* Inert wrapper around gated children. `inert` is supported in modern
          browsers; aria-hidden + tabindex=-1 covers older. */}
      <div
        // React 19 supports `inert` as a boolean prop → renders the inert HTML
        // attribute when truthy. aria-hidden is the AT fallback for older UAs.
        inert={true}
        aria-hidden="true"
        className="pointer-events-none select-none"
      >
        {children}
      </div>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div
          className="w-full max-w-[320px] md:max-w-[420px] lg:max-w-[480px] p-5 md:p-6 lg:p-8 rounded-[12px] bg-white border border-border flex flex-col gap-3 md:gap-4"
          style={{ boxShadow: BLUEPRINT_SHADOWS.overlay }}
        >
          <h2 id={titleId} className={`${HEADING_CLASSES.h4} font-semibold m-0`}>
            {title}
          </h2>
          {body ? (
            <div className="text-sm leading-[1.5] text-text-secondary">
              {body}
            </div>
          ) : null}
          {unlockAction ? <div className="mt-1">{unlockAction}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default LockedGate;
