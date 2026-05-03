/**
 * Server-only SEO automation: brand-aware draft generation, revision,
 * lint enforcement, and approval-email dispatch with HMAC-signed action tokens.
 *
 * Consume from API routes, cron handlers, or server actions only.
 * Required env: GEMINI_API_KEY, SEO_APPROVAL_SECRET. Optional:
 * RESEND_API_KEY, GEMINI_MODEL.
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
  LintCategory,
  LintWarning,
  LintReport,
} from './types';

export { SeoDraftError } from './types';
export { generateDraft } from './generate-draft';
export { reviseDraft } from './revise-draft';
export { signApprovalToken, verifyApprovalToken } from './approval-token';
export { sendApprovalEmail } from './send-approval-email';
export {
  DEFAULT_GEMINI_MODEL,
  resolveGeminiModel,
  generateGeminiCompletion,
} from './gemini-client';
export { build6idDraftPrompt } from './prompts/6id-draft';
export { buildEtfDraftPrompt } from './prompts/etf-draft';
export { buildRevisionPrompt } from './prompts/revision';
export { lintDraft, DRAFT_JSON_SCHEMA, GEMINI_DRAFT_SCHEMA } from './validate';
export { ETF_KILL_LIST, SIXID_KILL_LIST, type KillListEntry } from './kill-list';
