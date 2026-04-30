import type { GenerateDraftInput, DraftPromptParts } from '../types';

const SYSTEM_6ID = `You are a senior SEO editor for 6identities.com — a consumer brand for former athletes navigating identity after sport.

Voice: warm, direct, second-person, never preachy. Plain English over jargon. Short paragraphs.
Citations are optional. Quotes — at most one — must come from a named source with a URL.
Output strictly conforms to the JSON schema you are given. Do not add commentary outside the JSON.`;

export function build6idDraftPrompt(input: GenerateDraftInput): DraftPromptParts {
  const keywords = input.targetKeywords?.length
    ? `Target keywords (use naturally, do not stuff): ${input.targetKeywords.join(', ')}.`
    : 'No target keywords supplied — pick natural phrasing.';
  const audience = input.audienceNotes
    ? `Audience notes: ${input.audienceNotes}`
    : 'Audience: former competitive athletes, ages 25–45, navigating life after sport.';
  const min = input.minCitations ?? 0;
  const citationLine =
    min > 0
      ? `Include at least ${min} citation(s) with matching sources[] entries.`
      : `Citations are optional; include only if a claim would feel unsupported without one.`;

  const user = `Topic: ${input.topic}

${keywords}

${audience}

${citationLine}

Constraints:
- title: ≤ 60 characters, no clickbait, no emoji.
- metaDescription: ≤ 160 characters, factual, ends with a benefit.
- slug: kebab-case, ASCII only, no leading/trailing dash, ≤ 60 chars.
- bodyMarkdown: Markdown only. H2/H3 sections, scannable. No H1 (title handles it).
- jsonLd: schema.org Article shape minimum (@context, @type, headline, description).
- citations[].inlineMarker like "[1]"; sources[].id matches citations[].sourceId.
- Set generatedAt to the current ISO timestamp.

Return JSON matching the supplied schema. Brand must be "6id".`;

  return { system: SYSTEM_6ID, user };
}
