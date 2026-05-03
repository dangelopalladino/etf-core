import type { SeoDraft, DraftPromptParts } from '../types';

const SYSTEM_REVISION = `You are revising an existing SEO draft based on editor feedback.

Apply the critique faithfully. Preserve the original brand voice. Do not introduce banned vocabulary while fixing other issues. Do not weaken citations on ETF drafts.

Output JSON only. Conform to the supplied schema. Do not output a "jsonLd" field. No commentary outside the JSON.`;

const ETF_VOICE = `ETF voice: institutional, precise, restrained. Master's-level vocabulary. Third person. Average 18-word sentences (hard cap 35). Paragraphs ≤ 5 sentences. Required structure: clinical headline → APA citation with linked DOI → 3–4 paragraph clinical summary → "ETF Application" H2 → "Practitioner Note" H3. Citations remain mandatory. First-mention trademarks: "Executable Transition Framework™", then "ETF™"; "ETF Certified Practitioner™". Banned: journey, unlock, potential, empower, elevate, thrive, passionate, purpose-driven, change lives, turnkey, plug-and-play, world-class, paradigm-shifting, "trauma-informed" as a bare modifier, "evidence-based"/"neuroscience-backed" without an inline citation marker.`;

const SIXID_VOICE = `6id voice: grounded, direct, second-person, slightly intense (6/10). Reference voices: Players Tribune, Jocko at his quietest, Agassi in *Open*. Average 12-word sentences (hard cap 25). Fragments encouraged. Paragraphs ≤ 3 sentences. The phrase "athlete" or "former athlete" must appear in one of the first two paragraphs. Body must end with the exact line: Take the assessment. Trademarks: "6 Identities®" on first mention; "Core Code Archetype™" on first mention if archetypes are referenced. Banned: journey, unlock, potential, empower, elevate, thrive, authentic, transform, transcend, holistic, wellness, self-love, manifest, alignment, abundance, vibrant, synergy, unleash, harness, foster, best self, find your why, "let's dive in", "in today's world", "navigate the complexities", "whether you're X or Y", therapy-speak (meet you where you are, hold space, somatic, inner child, healing journey), manosphere (alpha, sigma, grind, dominate, built different). Never use "operating system" on this site.`;

export function buildRevisionPrompt(opts: {
  draft: SeoDraft;
  critique: string;
}): DraftPromptParts {
  const { draft, critique } = opts;
  const brandVoice = draft.brand === 'etf' ? ETF_VOICE : SIXID_VOICE;

  const user = `Brand: ${draft.brand}
${brandVoice}

Editor critique (apply faithfully):
"""
${critique}
"""

Original draft (JSON):
${JSON.stringify({ ...draft, jsonLd: undefined }, null, 2)}

Return a revised SeoDraft JSON matching the supplied schema. Keep the same brand and slug unless the critique explicitly requests a change. Update generatedAt to the current ISO timestamp. Do not output a "jsonLd" field.`;

  return { system: SYSTEM_REVISION, user };
}
