import 'server-only';
import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

export function resolveGeminiModel(modelOverride?: string): string {
  return modelOverride ?? process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
}

export interface GeminiChatOptions {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  /**
   * Gemini-flavored JSON schema (OpenAPI 3.0 subset). Do NOT include
   * `additionalProperties`, `pattern`, or `maxLength` — Gemini rejects them.
   * Strict shape and length enforcement live in `validate.ts`.
   */
  responseSchema?: Record<string, unknown>;
}

export interface GeminiChatResult {
  content: string;
  model: string;
}

let inflight: Promise<unknown> = Promise.resolve();

/**
 * Serialize Gemini calls within this process. Free-tier Flash is 2 RPM,
 * and ETF/6id pipelines are weekly + ad-hoc — a single in-process semaphore
 * is sufficient to prevent racing the cron and a "Run Now" click.
 */
async function withInflightLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = inflight.then(fn, fn);
  inflight = next.catch(() => undefined);
  return next;
}

export async function generateGeminiCompletion(
  opts: GeminiChatOptions
): Promise<GeminiChatResult> {
  const client = getGemini();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const model = resolveGeminiModel(opts.model);

  return withInflightLock(async () => {
    const response: GenerateContentResponse = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: opts.user }] }],
      config: {
        systemInstruction: opts.system,
        temperature: opts.temperature ?? 0.4,
        responseMimeType: 'application/json',
        ...(opts.responseSchema ? { responseSchema: opts.responseSchema } : {}),
      },
    });

    const content = response.text ?? '';
    return { content, model };
  });
}
