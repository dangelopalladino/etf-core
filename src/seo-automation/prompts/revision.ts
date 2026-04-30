import type { SeoDraft, DraftPromptParts } from '../types';

const SYSTEM_REVISION = `You are revising an existing SEO draft based on editor feedback.

Preserve the original brand voice and constraints. Apply the critique faithfully.
Do not weaken citations on ETF drafts. Output strictly conforms to the JSON schema; no commentary outside the JSON.`;

export function buildRevisionPrompt(opts: {
  draft: SeoDraft;
  critique: string;
}): DraftPromptParts {
  const { draft, critique } = opts;
  const brandVoice =
    draft.brand === 'etf'
      ? 'ETF voice: precise, evidence-led, third-person. Citations remain mandatory.'
      : '6id voice: warm, direct, second-person. Citations optional.';

  const user = `Brand: ${draft.brand}
${brandVoice}

Editor critique (apply faithfully):
"""
${critique}
"""

Original draft (JSON):
${JSON.stringify(draft, null, 2)}

Return a revised SeoDraft JSON matching the supplied schema, keeping the same brand and slug unless the critique explicitly requests a change. Update generatedAt to the current ISO timestamp.`;

  return { system: SYSTEM_REVISION, user };
}
