import 'server-only';
import type { ReviseDraftInput, SeoDraft } from './types';
import { SeoDraftError } from './types';
import { generateGeminiCompletion, resolveGeminiModel } from './gemini-client';
import { buildRevisionPrompt } from './prompts/revision';
import { validateDraftShape, GEMINI_DRAFT_SCHEMA } from './validate';

export async function reviseDraft(input: ReviseDraftInput): Promise<SeoDraft> {
  if (!process.env.GEMINI_API_KEY) {
    throw new SeoDraftError('GEMINI_API_KEY is not set');
  }
  const { draft, critique } = input;
  const { system, user } = buildRevisionPrompt({ draft, critique });

  const minCitations = draft.brand === 'etf' ? Math.max(3, draft.citations.length) : 0;

  const { content, model } = await generateGeminiCompletion({
    system,
    user,
    model: resolveGeminiModel(input.model),
    responseSchema: GEMINI_DRAFT_SCHEMA,
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
    obj.jsonLd = {};
  }

  return validateDraftShape(parsed, { brand: draft.brand, minCitations }, content);
}
