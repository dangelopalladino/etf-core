import 'server-only';
import Groq from 'groq-sdk';

export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

export function getGroq(): Groq | null {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return new Groq({ apiKey: key });
}

export function resolveModel(modelOverride?: string): string {
  return modelOverride ?? process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL;
}

export interface ChatOptions {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  jsonSchema?: {
    name: string;
    schema: Record<string, unknown>;
    /**
     * Opt-in OpenAI-compatible strict mode. When true, every nested object in
     * `schema` must declare `additionalProperties: false`. The DRAFT_JSON_SCHEMA
     * keeps `additionalProperties: true` on `jsonLd` (JSON-LD permits arbitrary
     * `@`-prefixed keys), so callers should leave `strict` false unless their
     * schema is fully closed. Default: false.
     */
    strict?: boolean;
  };
}

export interface ChatResult {
  content: string;
  model: string;
}

export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const client = getGroq();
  if (!client) {
    throw new Error('GROQ_API_KEY is not set');
  }
  const model = resolveModel(opts.model);
  const response_format = opts.jsonSchema
    ? {
        type: 'json_schema' as const,
        json_schema: { ...opts.jsonSchema, strict: opts.jsonSchema.strict ?? false },
      }
    : undefined;

  const completion = await client.chat.completions.create({
    model,
    temperature: opts.temperature ?? 0.4,
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
    ...(response_format ? { response_format } : {}),
  });

  const content = completion.choices[0]?.message?.content ?? '';
  return { content, model: completion.model ?? model };
}
