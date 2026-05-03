/**
 * Shared types for the seo-automation module.
 *
 * Server-only consumers: API routes, cron handlers, server actions.
 * Never import from a `'use client'` file — this surface depends on
 * `@google/genai`, `groq-sdk`, `jose`, and (optionally) `@react-email/*`
 * + `resend`.
 */

export type Brand = '6id' | 'etf';

export interface Citation {
  sourceId: string;
  inlineMarker: string;
  quote?: string;
}

export interface SourceMeta {
  id: string;
  url: string;
  title: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt: string;
}

export interface SeoDraft {
  brand: Brand;
  title: string;
  metaDescription: string;
  slug: string;
  bodyMarkdown: string;
  /**
   * Adapter-built schema.org JSON-LD. The LLM no longer produces this —
   * `generate-draft` initializes it to `{}` and the brand adapter
   * (`enrichJsonLd` for ETF, `enrich6idJsonLd` for 6id) overwrites it
   * with a deterministic shape before persistence.
   */
  jsonLd: Record<string, unknown>;
  citations: Citation[];
  sources: SourceMeta[];
  model: string;
  generatedAt: string;
  revisionOf?: string;
}

export interface GenerateDraftInput {
  brand: Brand;
  topic: string;
  targetKeywords?: string[];
  audienceNotes?: string;
  /** Optional inline-formatted evidence string injected into the user prompt. */
  evidence?: string;
  minCitations?: number;
  model?: string;
}

export interface ReviseDraftInput {
  draft: SeoDraft;
  critique: string;
  model?: string;
}

export interface ApprovalTokenClaims {
  draftId: string;
  brand: Brand;
  action: 'approve' | 'reject' | 'revise';
  nonce: string;
}

export type ApprovalTokenResult =
  | { ok: true; claims: ApprovalTokenClaims }
  | { ok: false; reason: 'expired' | 'invalid' | 'misconfigured' };

export interface SignApprovalTokenOptions {
  expiresIn?: string;
}

export interface SendApprovalEmailInput {
  to: string;
  brand: Brand;
  draft: SeoDraft;
  draftId: string;
  baseUrl: string;
  from?: string;
  expiresIn?: string;
}

export type SendApprovalEmailResult =
  | { success: true; id?: string }
  | { skipped: true }
  | { error: string };

export interface DraftPromptParts {
  system: string;
  user: string;
}

export type LintCategory =
  | 'kill_list'
  | 'sentence_too_long'
  | 'paragraph_too_long'
  | 'missing_section'
  | 'missing_citation'
  | 'missing_trademark'
  | 'missing_athlete_link';

export interface LintWarning {
  category: LintCategory;
  message: string;
  evidence?: string;
}

export interface LintReport {
  warnings: LintWarning[];
}

export class SeoDraftError extends Error {
  readonly rawOutput?: string;
  readonly fieldErrors?: string[];
  constructor(
    message: string,
    opts?: { rawOutput?: string; fieldErrors?: string[] }
  ) {
    super(message);
    this.name = 'SeoDraftError';
    this.rawOutput = opts?.rawOutput;
    this.fieldErrors = opts?.fieldErrors;
  }
}
