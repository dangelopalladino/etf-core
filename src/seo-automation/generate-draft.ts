import 'server-only';
import type { GenerateDraftInput, SeoDraft } from './types';
import { SeoDraftError } from './types';
import { chat, resolveModel } from './groq-client';
import { build6idDraftPrompt } from './prompts/6id-draft';
import { buildEtfDraftPrompt } from './prompts/etf-draft';
import { validateDraftShape, DRAFT_JSON_SCHEMA } from './validate';

function defaultMinCitations(brand: GenerateDraftInput['brand'], override?: number): number {
  if (typeof override === 'number') return Math.max(0, override);
  return brand === 'etf' ? 3 : 0;
}

export async function generateDraft(input: GenerateDraftInput): Promise<SeoDraft> {
  if (!process.env.GROQ_API_KEY) {
    throw new SeoDraftError('GROQ_API_KEY is not set');
  }
  const minCitations = defaultMinCitations(input.brand, input.minCitations);
  const effectiveInput: GenerateDraftInput = { ...input, minCitations };
  const { system, user } =
    input.brand === 'etf'
      ? buildEtfDraftPrompt(effectiveInput)
      : build6idDraftPrompt(effectiveInput);

  const { content, model } = await chat({
    system,
    user,
    model: resolveModel(input.model),
    jsonSchema: { name: 'seo_draft', schema: DRAFT_JSON_SCHEMA },
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new SeoDraftError('Model output was not valid JSON', { rawOutput: content });
  }

  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    (parsed as Record<string, unknown>).model = model;
    if (!(parsed as Record<string, unknown>).generatedAt) {
      (parsed as Record<string, unknown>).generatedAt = new Date().toISOString();
    }
  }

  return validateDraftShape(parsed, { brand: input.brand, minCitations }, content);
}
