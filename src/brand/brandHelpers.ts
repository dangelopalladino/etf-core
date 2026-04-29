import {
  type Brand,
  type RadiusKey,
  type MotionDuration,
  BLUEPRINT_SHADOWS,
  SHARED_RADIUS_SCALE,
  SHARED_MOTION,
  FOCUS_RING_TOKENS,
  focusRing,
} from '../tokens/shared';

/**
 * Brand-aware shadow accessor. All three brands resolve to BLUEPRINT_SHADOWS
 * (3-token cap per DESIGN.md §5.3). Site-specific shadow scales remain
 * exported for legacy use, but new primitives must read through here.
 */
export function brandShadows(_brand: Brand = 'shared'): typeof BLUEPRINT_SHADOWS {
  return BLUEPRINT_SHADOWS;
}

/**
 * Brand-aware radius. ETF caps at lg=10 (square-ish institutional register);
 * 6id allows xl=20 (consumer-friendly). 'shared' returns the SHARED_RADIUS_SCALE.
 *
 * Mobile-first note: radius is identical across breakpoints. Don't shrink
 * radius at small viewports — that's a slop signal.
 */
export function brandRadius(brand: Brand, name: RadiusKey): number {
  if (brand === 'etf' && (name === 'xl')) return 10;
  return SHARED_RADIUS_SCALE[name];
}

/**
 * Brand-aware motion duration. ETF favors 180/120/280 (deliberate); 6id favors
 * 200/150/350 (snappy with weight). 'shared' returns SHARED_MOTION.
 *
 * Values inlined to avoid circular import with site token modules.
 */
export function brandMotion(brand: Brand, key: MotionDuration): number {
  if (brand === 'etf') {
    const ETF_MAP: Record<MotionDuration, number> = { fast: 120, base: 180, slow: 280, reveal: 600 };
    return ETF_MAP[key];
  }
  if (brand === '6id') {
    const SIX_ID_MAP: Record<MotionDuration, number> = { fast: 150, base: 200, slow: 350, reveal: 600 };
    return SIX_ID_MAP[key];
  }
  return SHARED_MOTION[key];
}

/** Brand-aware focus ring shadow. */
export function brandFocusRing(brand: Brand = 'shared'): string {
  return focusRing(brand);
}

export { FOCUS_RING_TOKENS };
