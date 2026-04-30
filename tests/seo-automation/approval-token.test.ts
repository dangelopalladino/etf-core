import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  signApprovalToken,
  verifyApprovalToken,
} from '../../src/seo-automation/approval-token';
import { decodeJwt } from 'jose';

const SECRET = 'test-secret-do-not-use-in-prod';

describe('approval-token', () => {
  let originalSecret: string | undefined;

  beforeEach(() => {
    originalSecret = process.env.SEO_APPROVAL_SECRET;
    process.env.SEO_APPROVAL_SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.SEO_APPROVAL_SECRET;
    else process.env.SEO_APPROVAL_SECRET = originalSecret;
  });

  it('roundtrips claims (sign → verify) with auto-nonce', async () => {
    const token = await signApprovalToken({
      draftId: 'd1',
      brand: '6id',
      action: 'approve',
    });
    const result = await verifyApprovalToken(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.draftId).toBe('d1');
      expect(result.claims.brand).toBe('6id');
      expect(result.claims.action).toBe('approve');
      expect(result.claims.nonce).toMatch(/.+/);
    }
  });

  it('preserves a caller-supplied nonce', async () => {
    const token = await signApprovalToken({
      draftId: 'd2',
      brand: 'etf',
      action: 'revise',
      nonce: 'fixed-nonce',
    });
    const result = await verifyApprovalToken(token);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.claims.nonce).toBe('fixed-nonce');
  });

  it('returns invalid for a tampered token', async () => {
    const token = await signApprovalToken({
      draftId: 'd3',
      brand: '6id',
      action: 'reject',
    });
    const tampered = token.slice(0, -4) + 'AAAA';
    const result = await verifyApprovalToken(tampered);
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('returns expired for a past-exp token', async () => {
    const token = await signApprovalToken(
      { draftId: 'd4', brand: '6id', action: 'approve' },
      { expiresIn: '1s' }
    );
    await new Promise((r) => setTimeout(r, 1100));
    const result = await verifyApprovalToken(token);
    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('returns misconfigured when SEO_APPROVAL_SECRET is unset', async () => {
    delete process.env.SEO_APPROVAL_SECRET;
    const result = await verifyApprovalToken('does.not.matter');
    expect(result).toEqual({ ok: false, reason: 'misconfigured' });
  });

  it('clamps expiresIn to 30 days', async () => {
    const token = await signApprovalToken(
      { draftId: 'd5', brand: 'etf', action: 'approve' },
      { expiresIn: '90d' }
    );
    const claims = decodeJwt(token);
    const exp = claims.exp ?? 0;
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    expect(diff).toBeGreaterThan(30 * 24 * 60 * 60 - 60);
    expect(diff).toBeLessThanOrEqual(30 * 24 * 60 * 60);
  });
});
