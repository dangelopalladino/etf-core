import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { BOOKS, type BookContent } from '../content/books';
import { issueDownloadToken } from './download-tokens';

/**
 * Shared digital-product delivery.
 *
 * Token URLs (`/api/downloads/[productKey]`) replace raw Supabase signed URLs
 * for book SKUs so we can per-buyer watermark and re-verify entitlement on
 * every download. Tokens expire in 24h and are re-checked against `purchases`.
 *
 * Research and certification-guide PDFs use signed URLs directly because they
 * are email-gated, not purchase-entitled.
 */

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24;

export type BookProductKey = BookContent['productKey'];

export interface SignedDownload {
  url: string;
  expiresAt: string;
}

export interface BookDownload extends SignedDownload {
  title: string;
  productKey: BookProductKey;
}

function resolveOrigin(explicit?: string): string {
  if (explicit && explicit.length > 0) return explicit.replace(/\/$/, '');
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.length > 0) return env.replace(/\/$/, '');
  return 'http://localhost:3000';
}

function tokenExpiryIso(): string {
  return new Date(Date.now() + DEFAULT_EXPIRY_SECONDS * 1000).toISOString();
}

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function createBookDownloadUrl(
  productKey: BookProductKey,
  email: string,
  origin?: string
): Promise<SignedDownload | null> {
  if (!email) {
    console.error('[downloads] createBookDownloadUrl requires a buyer email');
    return null;
  }
  if (productKey === 'book_family_bundle') {
    console.error('[downloads] Family Bundle has no direct download — expand into UTC + FP');
    return null;
  }

  let token: string;
  try {
    token = await issueDownloadToken({
      email: email.toLowerCase().trim(),
      productKey,
    });
  } catch (err) {
    console.error('[downloads] failed to issue download token:', err);
    return null;
  }

  const base = resolveOrigin(origin);
  return {
    url: `${base}/api/downloads/${productKey}?token=${encodeURIComponent(token)}`,
    expiresAt: tokenExpiryIso(),
  };
}

export async function createBookSignedUrl(
  productKey: BookProductKey
): Promise<SignedDownload | null> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('[downloads] supabaseAdmin unavailable — cannot sign URL');
    return null;
  }

  const book = Object.values(BOOKS).find((b) => b.productKey === productKey);
  if (!book) {
    console.error(`[downloads] No book found for productKey=${productKey}`);
    return null;
  }

  if (book.slug === 'family-bundle') {
    console.error('[downloads] family-bundle has no single PDF — call once per bundled product');
    return null;
  }

  const { data, error } = await supabaseAdmin
    .storage
    .from('books')
    .createSignedUrl(book.pdfPath, DEFAULT_EXPIRY_SECONDS, { download: true });

  if (error || !data?.signedUrl) {
    console.error('[downloads] signed URL failed:', error, 'path:', book.pdfPath);
    return null;
  }

  return {
    url: data.signedUrl,
    expiresAt: tokenExpiryIso(),
  };
}

export async function resolveBookDownloads(
  productKey: BookProductKey,
  email: string,
  origin?: string
): Promise<BookDownload[]> {
  const book = Object.values(BOOKS).find((b) => b.productKey === productKey);
  if (!book) return [];

  const resolveOne = async (
    pk: BookProductKey,
    title: string
  ): Promise<BookDownload | null> => {
    const tokenUrl = await createBookDownloadUrl(pk, email, origin);
    if (tokenUrl) return { title, productKey: pk, ...tokenUrl };
    const signed = await createBookSignedUrl(pk);
    if (!signed) return null;
    return { title, productKey: pk, ...signed };
  };

  if (book.slug === 'family-bundle') {
    const grants = book.bundledProductKeys ?? [];
    const results = await Promise.all(
      grants.map(async (pk) => {
        const bundled = Object.values(BOOKS).find((b) => b.productKey === pk);
        if (!bundled) return null;
        return resolveOne(pk, bundled.title);
      })
    );
    return results.filter((r): r is BookDownload => r !== null);
  }

  const one = await resolveOne(productKey, book.title);
  return one ? [one] : [];
}

export async function hasBookEntitlement(
  email: string,
  productKey: BookProductKey
): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin || !email) return false;

  const { data, error } = await supabaseAdmin
    .from('purchases')
    .select('product')
    .eq('email', email.toLowerCase().trim());

  if (error || !data) return false;

  const owned = data.map((p: { product: string }) => p.product);

  if (owned.includes(productKey)) return true;

  if (owned.includes('book_family_bundle')) {
    if (
      productKey === 'book_understanding_the_crash' ||
      productKey === 'book_family_playbook'
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Certification Guide — gated by `purchases.product = 'implementer_cert'`.
 * Bucket: `certification`. Object: `etf-certification-guide.pdf`.
 */
export async function createCertificationGuideSignedUrl(): Promise<SignedDownload | null> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .storage
    .from('certification')
    .createSignedUrl('etf-certification-guide.pdf', DEFAULT_EXPIRY_SECONDS, {
      download: true,
    });

  if (error || !data?.signedUrl) {
    console.error('[downloads] certification guide signed URL failed:', error);
    return null;
  }

  return {
    url: data.signedUrl,
    expiresAt: tokenExpiryIso(),
  };
}

export async function createResearchSignedUrl(): Promise<SignedDownload | null> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .storage
    .from('research')
    .createSignedUrl('etf-research-foundation.pdf', DEFAULT_EXPIRY_SECONDS, {
      download: true,
    });

  if (error || !data?.signedUrl) {
    console.error('[downloads] research signed URL failed:', error);
    return null;
  }

  return {
    url: data.signedUrl,
    expiresAt: tokenExpiryIso(),
  };
}
