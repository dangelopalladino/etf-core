import 'server-only';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const FROM = 'ETF Framework <support@mail.6identities.com>';
const BRAND_TEAL = '#2D7A7B';
const BRAND_BG = '#F5EFE6';
const BRAND_TEXT = '#3A3632';
const BRAND_MUTED = '#6B6560';

const GUIDE_BUCKET = 'certification';
const GUIDE_PATH = 'etf-certification-guide.pdf';
const SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function issueSignedUrl(): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    console.error('[cert-guide] Supabase service credentials missing');
    return null;
  }
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.storage
    .from(GUIDE_BUCKET)
    .createSignedUrl(GUIDE_PATH, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) {
    console.error('[cert-guide] createSignedUrl failed:', error?.message || 'no url');
    return null;
  }
  return data.signedUrl;
}

function renderHtml(opts: { downloadUrl: string; portalUrl: string }): string {
  const { downloadUrl, portalUrl } = opts;
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; color: ${BRAND_TEXT}; max-width: 600px; margin: 0 auto; padding: 40px 24px; background: ${BRAND_BG};">
      <h1 style="font-family: 'Georgia', serif; font-size: 26px; font-weight: 700; color: ${BRAND_TEAL}; margin: 0 0 8px;">Welcome to the implementer cohort.</h1>
      <div style="font-size: 15px; color: ${BRAND_MUTED}; line-height: 1.6; margin-bottom: 24px;">
        Your enrollment is confirmed. Start with the ETF Certification Guide — it frames the 8-component model, the 90-day cycle, and how the framework pieces together before you step into Module 1.
      </div>
      <div style="margin: 20px 0; padding: 20px; background: #FFFFFF; border: 1px solid #E5DDD4; border-radius: 12px;">
        <div style="font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; color: ${BRAND_TEXT}; margin-bottom: 12px;">ETF Certification Guide</div>
        <a href="${downloadUrl}" style="display: inline-block; padding: 12px 28px; background: ${BRAND_TEAL}; color: #FFFFFF; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 15px;">Download PDF</a>
        <div style="font-size: 13px; color: ${BRAND_MUTED}; margin-top: 12px;">Link expires in 24 hours. Save your file locally — you can also re-download anytime from the member portal.</div>
      </div>
      <div style="margin-top: 28px; padding: 20px; background: #FFFFFF; border: 1px solid #E5DDD4; border-radius: 12px;">
        <div style="font-family: 'Georgia', serif; font-size: 17px; font-weight: 700; color: ${BRAND_TEXT}; margin-bottom: 8px;">Next steps</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: ${BRAND_MUTED}; line-height: 1.7;">
          <li>Read the Guide cover-to-cover before Module 1 (about 45 minutes).</li>
          <li>Log into the member portal to begin the training modules.</li>
          <li>Once you complete all modules and the assessment, your credential is generated automatically.</li>
        </ul>
        <div style="margin-top: 16px;">
          <a href="${portalUrl}" style="display: inline-block; padding: 10px 24px; background: transparent; color: ${BRAND_TEAL}; text-decoration: none; border: 1px solid ${BRAND_TEAL}; border-radius: 999px; font-weight: 600; font-size: 14px;">Open the member portal</a>
        </div>
      </div>
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5DDD4; font-size: 13px; color: ${BRAND_MUTED}; line-height: 1.6;">
        Questions? Reply to this email.
      </div>
      <div style="margin-top: 32px; font-size: 12px; color: ${BRAND_MUTED}; text-align: center;">
        &copy; ${new Date().getFullYear()} ETF Framework.
      </div>
    </div>
  `;
}

export async function sendCertificationGuideEmail(opts: {
  email: string;
  userId?: string | null;
  sessionId?: string | null;
}): Promise<{ success?: boolean; skipped?: boolean; error?: string }> {
  const { email } = opts;

  const resend = getResend();
  if (!resend) {
    console.warn('[cert-guide] Resend not configured — skipping email');
    return { skipped: true };
  }
  if (!email) {
    return { error: 'Missing email address' };
  }

  const downloadUrl = await issueSignedUrl();
  if (!downloadUrl) {
    return { error: 'Failed to issue signed URL for certification guide' };
  }

  const etfUrl = process.env.NEXT_PUBLIC_ETF_FRAMEWORK_URL || 'https://etfframework.com';
  const portalUrl = `${etfUrl.replace(/\/+$/, '')}/portal/dashboard`;

  const html = renderHtml({ downloadUrl, portalUrl });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Your ETF Certification Guide (welcome to the cohort)',
      html,
    });
    if (error) {
      console.error('[cert-guide] Resend error:', error);
      return { error: String(error) };
    }
    console.log('[cert-guide] sent', { id: data?.id, to: email });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cert-guide] unexpected error:', message);
    return { error: message };
  }
}
