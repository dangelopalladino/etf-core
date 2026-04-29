'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Brand } from '../tokens/shared';

const BrandContext = createContext<Brand>('shared');

export interface BrandProviderProps {
  brand: Brand;
  children: React.ReactNode;
}

/**
 * Wraps a subtree in a brand identity.
 *
 * @remarks
 * Layout: zero — this is a pure context provider, renders children unchanged.
 * Adoption is one line at the consumer-app root and is voluntary; without it
 * every v1.5 primitive resolves brand='shared' (safe default: BLUEPRINT_SHADOWS,
 * neutral focus ring, SHARED_MOTION timings, no serif).
 *
 * The RSC→Client boundary: this is a client component. Server components in
 * the same tree must use {@link getBrand} (server-side) — NOT useBrand. A
 * future v2 enhancement may thread brand through React's experimental
 * AsyncLocalStorage-based cache so getBrand() and useBrand() stay in sync
 * automatically. v1.5 returns 'shared' from getBrand() deterministically.
 */
export function BrandProvider({ brand, children }: BrandProviderProps) {
  const value = useMemo(() => brand, [brand]);
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/** Client hook — reads the nearest BrandProvider, falling back to 'shared'. */
export function useBrand(): Brand {
  return useContext(BrandContext);
}
