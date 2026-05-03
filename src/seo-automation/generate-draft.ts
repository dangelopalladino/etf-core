import 'server-only';
import type { GenerateDraftInput, SeoDraft } from './types';
import { SeoDraftError } from './types';
import { generateGeminiCompletion, resolveGeminiModel } from './gemini-client';
import { build6idDraftPrompt } from './prompts/6id-draft';
import { buildEtfDraftPrompt } from './prompts/etf-draft';
import { validateDraftShape, GEMINI_DRAFT_SCHEMA } from './validate';

function defaultMinCitations(brand: GenerateDraftInput['brand'], override?: number): number {
  if (typeof override === 'number') return Math.max(0, override);
  return brand === 'etf' ? 3 : 0;
}

export async function generateDraft(input: GenerateDraftInput): Promise<SeoDraft> {
  if (!process.env.GEMINI_API_KEY) {
    throw new SeoDraftError('GEMINI_API_KEY is not set');
  }
  const minCitations = defaultMinCitations(input.brand, input.minCitations);
  const effectiveInput: GenerateDraftInput = { ...input, minCitations };
  const { system, user } =
    input.brand === 'etf'
      ? buildEtfDraftPrompt(effectiveInput)
      : build6idDraftPrompt(effectiveInput);

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
    if (!obj.generatedAt) obj.generatedAt = new Date().toISOString();
    // jsonLd is no longer LLM-produced. Initialize to {} so the SeoDraft
    // shape is satisfied; the brand adapter overwrites this deterministically
    // before persistence.
    obj.jsonLd = {};
  }

  return validateDraftShape(parsed, { brand: input.brand, minCitations }, content);
}
