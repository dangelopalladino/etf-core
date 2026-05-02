import 'server-only';
import { Resend } from 'resend';
import {
  BOOKS,
  BOOK_PRODUCT_NAMES,
  type BookContent,
} from '../../content/books';
import { resolveBookDownloads } from '../downloads';
import { EMAIL_SAFE_TOKENS, fonts } from '../../tokens/shared';

type BookProductKey = BookContent['productKey'];

const FROM = '6 Identities <support@mail.6identities.com>';
const BRAND_TEAL = EMAIL_SAFE_TOKENS.brandPrimary;
const BRAND_BG = EMAIL_SAFE_TOKENS.surface;
const BRAND_TEXT = EMAIL_SAFE_TOKENS.text;
const BRAND_MUTED = EMAIL_SAFE_TOKENS.textMuted;
const BRAND_BORDER = EMAIL_SAFE_TOKENS.border;
const BRAND_WHITE = EMAIL_SAFE_TOKENS.white;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function renderHtml(opts: {
  productKey: BookProductKey;
  orderName: string;
  downloads: Array<{ title: string; url: string; expiresAt: string }>;
}): string {
  const { orderName, downloads } = opts;
  const downloadBlocks = downloads
    .map(
      (d) => `
        <div style="margin: 20px 0; padding: 20px; background: ${BRAND_WHITE}; border: 1px solid ${BRAND_BORDER}; border-radius: 12px;">
          <div style="font-family: ${fonts.serif}; font-size: 20px; font-weight: 700; color: ${BRAND_TEXT}; margin-bottom: 12px;">${d.title}</div>
          <a href="${d.url}" style="display: inline-block; padding: 12px 28px; background: ${BRAND_TEAL}; color: ${BRAND_WHITE}; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 15px;">Download PDF</a>
          <div style="font-size: 13px; color: ${BRAND_MUTED}; margin-top: 12px;">Link expires in 24 hours. Save your file locally once downloaded.</div>
        </div>
      `
    )
    .join('');

  return `
    <div style="font-family: ${fonts.body}; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; padding: 40px 24px; background: ${BRAND_BG};">
      <h1 style="font-family: ${fonts.serif}; font-size: 26px; font-weight: 700; color: ${BRAND_TEAL}; margin: 0 0 8px;">Your ${orderName} is ready.</h1>
      <div style="font-size: 15px; color: ${BRAND_MUTED}; line-height: 1.6; margin-bottom: 24px;">
        Thanks for your purchase. Your download link${downloads.length > 1 ? 's are' : ' is'} below. You can also access ${downloads.length > 1 ? 'them' : 'it'} from your purchase confirmation page.
      </div>
      ${downloadBlocks}
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid ${BRAND_BORDER}; font-size: 13px; color: ${BRAND_MUTED}; line-height: 1.6;">
        Questions? Reply to this email and we'll help.
      </div>
      <div style="margin-top: 32px; font-size: 12px; color: ${BRAND_MUTED}; text-align: center;">
        &copy; ${new Date().getFullYear()} 6 Identities. Built for life after sport.
      </div>
    </div>
  `;
}

export async function sendBookFulfillmentEmail(opts: {
  email: string;
  productKey: BookProductKey;
}): Promise<{ success?: boolean; skipped?: boolean; error?: string }> {
  const { email, productKey } = opts;

  const resend = getResend();
  if (!resend) {
    console.warn('[book-fulfillment] Resend not configured — skipping email');
    return { skipped: true };
  }
  if (!email) {
    return { error: 'Missing email address' };
  }

  const book = Object.values(BOOKS).find((b) => b.productKey === productKey);
  if (!book) {
    return { error: `Unknown productKey: ${productKey}` };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  const downloads = await resolveBookDownloads(productKey, email, origin);
  if (downloads.length === 0) {
    console.error(`[book-fulfillment] No downloads resolved for ${productKey}`);
    return { error: 'Failed to resolve download URLs' };
  }

  const orderName = BOOK_PRODUCT_NAMES[productKey] ?? book.title;
  const subject = `Your ${book.title} download${downloads.length > 1 ? 's are' : ' is'} ready`;
  const html = renderHtml({ productKey, orderName, downloads });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
    });
    if (error) {
      console.error('[book-fulfillment] Resend error:', error);
      return { error: String(error) };
    }
    console.log('[book-fulfillment] sent', { id: data?.id, to: email, productKey });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[book-fulfillment] unexpected error:', message);
    return { error: message };
  }
}
