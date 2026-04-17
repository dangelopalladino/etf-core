import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { issueDownloadToken, verifyDownloadToken } from '../../src/commerce/download-tokens';

const ORIGINAL_SECRET = process.env.DOWNLOAD_TOKEN_SECRET;

beforeAll(() => {
  process.env.DOWNLOAD_TOKEN_SECRET = 'test-secret-32-chars-long-padding!';
});

afterAll(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.DOWNLOAD_TOKEN_SECRET;
  else process.env.DOWNLOAD_TOKEN_SECRET = ORIGINAL_SECRET;
});

describe('download-tokens', () => {
  it('issues a token that verifies back to the same claims', async () => {
    const token = await issueDownloadToken({ email: 'a@b.c', productKey: 'book_motion' });
    expect(typeof token).toBe('string');
    const result = await verifyDownloadToken(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.email).toBe('a@b.c');
      expect(result.claims.productKey).toBe('book_motion');
    }
  });

  it('rejects garbage tokens as invalid', async () => {
    const result = await verifyDownloadToken('not-a-jwt');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('invalid');
  });

  it('returns misconfigured when secret is unset', async () => {
    const saved = process.env.DOWNLOAD_TOKEN_SECRET;
    delete process.env.DOWNLOAD_TOKEN_SECRET;
    const result = await verifyDownloadToken('anything');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('misconfigured');
    process.env.DOWNLOAD_TOKEN_SECRET = saved;
  });
});
