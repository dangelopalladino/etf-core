import 'server-only';
import * as React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import type {
  Brand,
  SendApprovalEmailInput,
  SendApprovalEmailResult,
} from './types';
import { signApprovalToken } from './approval-token';
import { ApprovalEmail } from './email-template';

const DEFAULT_FROM_6ID = '6 Identities <support@mail.6identities.com>';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function defaultFrom(brand: Brand): string | null {
  if (brand === '6id') return DEFAULT_FROM_6ID;
  return null;
}

function buildActionUrl(
  baseUrl: string,
  token: string,
  action: 'approve' | 'revise' | 'reject'
): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return `${trimmed}/api/seo/${action}?token=${encodeURIComponent(token)}`;
}

function expiresInToHumanIso(expiresIn: string): string {
  const m = expiresIn.match(/^(\d+)\s*([smhdw])$/i);
  if (!m) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const mult: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 60 * 60_000,
    d: 24 * 60 * 60_000,
    w: 7 * 24 * 60 * 60_000,
  };
  return new Date(Date.now() + n * (mult[unit] ?? 0)).toISOString();
}

export async function sendApprovalEmail(
  input: SendApprovalEmailInput
): Promise<SendApprovalEmailResult> {
  const { to, brand, draft, draftId, baseUrl, expiresIn = '7d' } = input;

  const resend = getResend();
  if (!resend) {
    console.warn('[seo-approval] Resend not configured — skipping email');
    return { skipped: true };
  }
  if (!to) return { error: 'Missing recipient address' };

  const from = input.from ?? defaultFrom(brand);
  if (!from) {
    return { error: `No verified sender configured for brand "${brand}"; pass "from" explicitly` };
  }

  let approveToken: string;
  let reviseToken: string;
  let rejectToken: string;
  try {
    [approveToken, reviseToken, rejectToken] = await Promise.all([
      signApprovalToken({ draftId, brand, action: 'approve' }, { expiresIn }),
      signApprovalToken({ draftId, brand, action: 'revise' }, { expiresIn }),
      signApprovalToken({ draftId, brand, action: 'reject' }, { expiresIn }),
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Failed to sign approval tokens: ${msg}` };
  }

  const approveUrl = buildActionUrl(baseUrl, approveToken, 'approve');
  const reviseUrl = buildActionUrl(baseUrl, reviseToken, 'revise');
  const rejectUrl = buildActionUrl(baseUrl, rejectToken, 'reject');
  const expiresAt = expiresInToHumanIso(expiresIn);

  let html: string;
  try {
    html = await render(
      React.createElement(ApprovalEmail, {
        brand,
        draft,
        approveUrl,
        reviseUrl,
        rejectUrl,
        expiresAt,
      })
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Failed to render approval email: ${msg}` };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Review SEO draft: ${draft.title}`,
      html,
    });
    if (error) {
      const msg = typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);
      console.error('[seo-approval] Resend error:', error);
      return { error: msg };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[seo-approval] unexpected error:', msg);
    return { error: msg };
  }
}
