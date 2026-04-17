/**
 * Short-lived JWTs gating `/api/downloads/[productKey]` (Phase 4).
 *
 * Both sibling sites use the same `DOWNLOAD_TOKEN_SECRET`, so a token minted
 * on either domain validates on the other. Entitlement is always re-verified
 * against `purchases` after token verification — the token alone never grants
 * access.
 */
import 'server-only';
import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';

const ISSUER = '6identities';
const AUDIENCE = 'book-downloads';
const EXPIRATION = '24h';

export interface DownloadTokenClaims {
  email: string;
  productKey: string;
}

export type TokenVerificationResult =
  | { ok: true; claims: DownloadTokenClaims }
  | { ok: false; reason: 'expired' | 'invalid' | 'misconfigured' };

function secret(): Uint8Array {
  const raw = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!raw) {
    throw new Error('DOWNLOAD_TOKEN_SECRET is not set');
  }
  return new TextEncoder().encode(raw);
}

export async function issueDownloadToken(
  claims: DownloadTokenClaims
): Promise<string> {
  return new SignJWT({ email: claims.email, productKey: claims.productKey })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(EXPIRATION)
    .sign(secret());
}

export async function verifyDownloadToken(
  token: string
): Promise<TokenVerificationResult> {
  let key: Uint8Array;
  try {
    key = secret();
  } catch {
    return { ok: false, reason: 'misconfigured' };
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const email = typeof payload.email === 'string' ? payload.email : '';
    const productKey =
      typeof payload.productKey === 'string' ? payload.productKey : '';
    if (!email || !productKey) {
      return { ok: false, reason: 'invalid' };
    }
    return { ok: true, claims: { email, productKey } };
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
