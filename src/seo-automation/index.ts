/**
 * Server-only SEO automation: brand-aware draft generation, revision,
 * and approval-email dispatch with HMAC-signed action tokens.
 *
 * Consume from API routes, cron handlers, or server actions only.
 * Required env: GROQ_API_KEY, SEO_APPROVAL_SECRET. Optional: RESEND_API_KEY,
 * GROQ_MODEL.
 */
export type {
  Brand,
  Citation,
  SourceMeta,
  SeoDraft,
  GenerateDraftInput,
  ReviseDraftInput,
  ApprovalTokenClaims,
  ApprovalTokenResult,
  SignApprovalTokenOptions,
  SendApprovalEmailInput,
  SendApprovalEmailResult,
  DraftPromptParts,
} from './types';

export { SeoDraftError } from './types';
export { generateDraft } from './generate-draft';
export { reviseDraft } from './revise-draft';
export { signApprovalToken, verifyApprovalToken } from './approval-token';
export { sendApprovalEmail } from './send-approval-email';
export { DEFAULT_GROQ_MODEL } from './groq-client';
export { build6idDraftPrompt } from './prompts/6id-draft';
export { buildEtfDraftPrompt } from './prompts/etf-draft';
export { buildRevisionPrompt } from './prompts/revision';
