import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SeoDraft } from '../../src/seo-automation/types';

const sendMock = vi.fn();
vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: (...a: unknown[]) => sendMock(...a) };
  },
}));

const renderMock = vi.fn();
vi.mock('@react-email/render', () => ({
  render: (...a: unknown[]) => renderMock(...a),
}));

import { sendApprovalEmail } from '../../src/seo-automation/send-approval-email';

const draft: SeoDraft = {
  brand: '6id',
  title: 'Approval test',
  metaDescription: 'meta',
  slug: 'approval-test',
  bodyMarkdown: '## body',
  jsonLd: {},
  citations: [],
  sources: [],
  model: 'm',
  generatedAt: '2026-04-30T00:00:00.000Z',
};

describe('sendApprovalEmail', () => {
  let origResend: string | undefined;
  let origSecret: string | undefined;

  beforeEach(() => {
    origResend = process.env.RESEND_API_KEY;
    origSecret = process.env.SEO_APPROVAL_SECRET;
    process.env.RESEND_API_KEY = 'test-resend-key';
    process.env.SEO_APPROVAL_SECRET = 'test-secret';
    sendMock.mockReset();
    renderMock.mockReset();
    renderMock.mockResolvedValue('<html>rendered</html>');
  });

  afterEach(() => {
    if (origResend === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = origResend;
    if (origSecret === undefined) delete process.env.SEO_APPROVAL_SECRET;
    else process.env.SEO_APPROVAL_SECRET = origSecret;
  });

  it('sends with rendered HTML and a brand-correct from on happy path', async () => {
    sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null });

    const out = await sendApprovalEmail({
      to: 'editor@example.com',
      brand: '6id',
      draft,
      draftId: 'draft-123',
      baseUrl: 'https://6identities.com',
    });

    expect(out).toEqual({ success: true, id: 'msg_1' });
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const sendArgs = sendMock.mock.calls[0][0] as {
      from: string;
      to: string;
      subject: string;
      html: string;
    };
    expect(sendArgs.to).toBe('editor@example.com');
    expect(sendArgs.from).toMatch(/6 Identities/);
    expect(sendArgs.html).toBe('<html>rendered</html>');
    expect(sendArgs.subject).toContain(draft.title);
  });

  it('returns skipped when RESEND_API_KEY is not set', async () => {
    delete process.env.RESEND_API_KEY;
    const out = await sendApprovalEmail({
      to: 'x@example.com',
      brand: '6id',
      draft,
      draftId: 'd',
      baseUrl: 'https://6identities.com',
    });
    expect(out).toEqual({ skipped: true });
    expect(renderMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns error when render throws and never sends', async () => {
    renderMock.mockRejectedValueOnce(new Error('render boom'));
    const out = await sendApprovalEmail({
      to: 'x@example.com',
      brand: '6id',
      draft,
      draftId: 'd',
      baseUrl: 'https://6identities.com',
    });
    expect(out).toMatchObject({ error: expect.stringMatching(/render boom/) });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('requires explicit from for ETF brand (no default sender)', async () => {
    const out = await sendApprovalEmail({
      to: 'x@example.com',
      brand: 'etf',
      draft: { ...draft, brand: 'etf' },
      draftId: 'd',
      baseUrl: 'https://etfframework.com',
    });
    expect(out).toMatchObject({ error: expect.stringMatching(/etf/i) });
  });

  it('passes through Resend error messages', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { name: 'send_failed', message: 'rate limited' },
    });
    const out = await sendApprovalEmail({
      to: 'x@example.com',
      brand: '6id',
      draft,
      draftId: 'd',
      baseUrl: 'https://6identities.com',
    });
    expect(out).toMatchObject({ error: 'rate limited' });
  });
});
