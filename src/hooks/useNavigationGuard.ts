'use client';

import { useEffect, useCallback } from 'react';
import { Modal } from 'antd';

const DEFAULT_MESSAGE = "Are you sure you want to leave? Your progress will be lost.";

export interface NavigationGuardConfig {
  when: boolean;
  message?: string;
}

/**
 * Guards against accidental navigation while `when` is true.
 *
 * Attaches a `beforeunload` listener (tab close / hard refresh / external navigation).
 * Returns `confirmNavigation` for programmatic use.
 *
 * NOTE — SPA link clicks (Next.js App Router): `beforeunload` does NOT fire for in-app
 * `<Link>` navigation. Use `confirmNavigation` with the `onNavigate` prop instead:
 *
 * ```tsx
 * const { confirmNavigation } = useNavigationGuard({ when: isDirty });
 *
 * <Link
 *   href="/home"
 *   onNavigate={(e) => {
 *     if (isDirty) {
 *       e.preventDefault();
 *       confirmNavigation(() => router.push('/home'));
 *     }
 *   }}
 * >Home</Link>
 * ```
 */
export function useNavigationGuard({ when, message = DEFAULT_MESSAGE }: NavigationGuardConfig) {
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);

  const confirmNavigation = useCallback(
    (onConfirm: () => void, customMessage?: string) => {
      if (!when) {
        onConfirm();
        return;
      }
      Modal.confirm({
        title: 'Leave this page?',
        content: customMessage ?? message,
        okText: 'Leave',
        cancelText: 'Stay',
        okType: 'danger',
        onOk: onConfirm,
      });
    },
    [when, message]
  );

  return { confirmNavigation };
}
