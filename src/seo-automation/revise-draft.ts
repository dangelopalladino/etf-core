import 'server-only';
import type { ReviseDraftInput, SeoDraft } from './types';
import { SeoDraftError } from './types';
import { chat, resolveModel } from './groq-client';
import { buildRevisionPrompt } from './prompts/revision';
import { validateDraftShape, DRAFT_JSON_SCHEMA } from './validate';

export async function reviseDraft(input: ReviseDraftInput): Promise<SeoDraft> {
  if (!process.env.GROQ_API_KEY) {
    throw new SeoDraftError('GROQ_API_KEY is not set');
  }
  const { draft, critique } = input;
  const { system, user } = buildRevisionPrompt({ draft, critique });

  const minCitations = draft.brand === 'etf' ? Math.max(3, draft.citations.length) : 0;

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
    const obj = parsed as Record<string, unknown>;
    obj.model = model;
    obj.brand = draft.brand;
    obj.revisionOf = draft.slug;
    if (!obj.generatedAt) obj.generatedAt = new Date().toISOString();
  }

  return validateDraftShape(parsed, { brand: draft.brand, minCitations }, content);
}
