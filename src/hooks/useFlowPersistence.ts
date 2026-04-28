'use client';

import { useState, useEffect, useCallback } from 'react';

export function useFlowPersistence<T>(key: string) {
  const [savedState, setSavedState] = useState<T | null>(null);
  const [hasRestoredState, setHasRestoredState] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw) {
        setSavedState(JSON.parse(raw) as T);
        setHasRestoredState(true);
      }
    } catch {
      // sessionStorage unavailable or malformed JSON
    }
  }, [key]);

  const save = useCallback(
    (state: T) => {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(state));
      } catch {
        // sessionStorage unavailable — progress not persisted
      }
    },
    [key]
  );

  const clear = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setSavedState(null);
      setHasRestoredState(false);
    } catch {
      // ignore
    }
  }, [key]);

  return { savedState, save, clear, hasRestoredState };
}
