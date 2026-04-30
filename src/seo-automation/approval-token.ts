/**
 * Short-lived JWTs gating SEO draft approve/revise/reject links emailed to
 * editors. Mirrors the HMAC pattern from `commerce/download-tokens.ts`.
 *
 * Replay protection (refusing a second `approve` for the same draftId) is
 * the caller's responsibility — this module never persists tokens.
 */
import 'server-only';
import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import type {
  ApprovalTokenClaims,
  ApprovalTokenResult,
  SignApprovalTokenOptions,
} from './types';

const ISSUER = 'etf-core';
const AUDIENCE = 'seo-approval';
const DEFAULT_EXPIRES_IN = '7d';
const MAX_EXPIRES_SECONDS = 30 * 24 * 60 * 60;

function secret(): Uint8Array {
  const raw = process.env.SEO_APPROVAL_SECRET;
  if (!raw) {
    throw new Error('SEO_APPROVAL_SECRET is not set');
  }
  return new TextEncoder().encode(raw);
}

const UNIT_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
  w: 7 * 24 * 60 * 60,
};

function parseDurationToSeconds(input: string): number | null {
  const m = input.trim().match(/^(\d+)\s*([smhdw])$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const mult = UNIT_SECONDS[unit];
  if (!mult || !Number.isFinite(n)) return null;
  return n * mult;
}

function clampExpiresIn(expiresIn: string): number {
  const seconds = parseDurationToSeconds(expiresIn);
  if (seconds === null) {
    return parseDurationToSeconds(DEFAULT_EXPIRES_IN) ?? MAX_EXPIRES_SECONDS;
  }
  return Math.min(Math.max(seconds, 1), MAX_EXPIRES_SECONDS);
}

function randomNonce(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function signApprovalToken(
  claims: Omit<ApprovalTokenClaims, 'nonce'> & { nonce?: string },
  opts: SignApprovalTokenOptions = {}
): Promise<string> {
  const nonce = claims.nonce ?? randomNonce();
  const expiresInSec = clampExpiresIn(opts.expiresIn ?? DEFAULT_EXPIRES_IN);
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;

  return new SignJWT({
    draftId: claims.draftId,
    brand: claims.brand,
    action: claims.action,
    nonce,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(exp)
    .sign(secret());
}

export async function verifyApprovalToken(
  token: string
): Promise<ApprovalTokenResult> {
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
    const draftId = typeof payload.draftId === 'string' ? payload.draftId : '';
    const brand =
      payload.brand === '6id' || payload.brand === 'etf' ? payload.brand : null;
    const action =
      payload.action === 'approve' ||
      payload.action === 'reject' ||
      payload.action === 'revise'
        ? payload.action
        : null;
    const nonce = typeof payload.nonce === 'string' ? payload.nonce : '';
    if (!draftId || !brand || !action || !nonce) {
      return { ok: false, reason: 'invalid' };
    }
    return { ok: true, claims: { draftId, brand, action, nonce } };
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
