import 'server-only';
import { createClient } from '@supabase/supabase-js';

export type ApprovedTestimonial = {
  id: string;
  quote_surprise: string | null;
  quote_recommend: string | null;
  author_display_name: string | null;
  author_role: string | null;
  created_at: string;
  approved_at: string | null;
};

export type TestimonialAudience = 'athlete' | 'practitioner';

export async function getApprovedTestimonials(
  audience: TestimonialAudience,
  limit = 12,
): Promise<ApprovedTestimonial[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return [];

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin
    .from('soft_launch_testimonials')
    .select(
      'id, quote_surprise, quote_recommend, author_display_name, author_role, created_at, approved_at',
    )
    .eq('approved', true)
    .eq('consent_marketing', true)
    .eq('author_role', audience)
    .order('approved_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[testimonials] fetch failed:', error.message);
    return [];
  }

  return data ?? [];
}
