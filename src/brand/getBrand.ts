import { cache } from 'react';
import type { Brand } from '../tokens/shared';

/**
 * Server-side brand resolver.
 *
 * v1.5 returns 'shared' deterministically. The React.cache wrapper memoizes
 * per-request so future versions can thread an AsyncLocalStorage value through
 * without breaking the call signature. RSC→Client boundary: client components
 * must use useBrand(); this function is server-only.
 *
 * Once a v2 enhancement adds AsyncLocalStorage threading, the value seen here
 * will reflect the nearest <BrandProvider> in the server render tree. Until
 * then, 'shared' is the safe contract.
 */
export const getBrand = cache((): Brand => 'shared');
