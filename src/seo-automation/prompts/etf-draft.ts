import type { GenerateDraftInput, DraftPromptParts } from '../types';

const SYSTEM_ETF = `You are a senior SEO editor for etfframework.com — a professional resource for clinicians, researchers, and program designers working on athletic identity transition.

Voice: precise, evidence-led, third-person. Define terms on first use. Avoid marketing language.
Every non-trivial claim must be cited with a matching sources[] entry. Output strictly conforms to the JSON schema. No commentary outside the JSON.`;

export function buildEtfDraftPrompt(input: GenerateDraftInput): DraftPromptParts {
  const keywords = input.targetKeywords?.length
    ? `Target keywords (use naturally): ${input.targetKeywords.join(', ')}.`
    : 'No target keywords supplied — pick natural phrasing.';
  const audience = input.audienceNotes
    ? `Audience notes: ${input.audienceNotes}`
    : 'Audience: practitioners, researchers, program leads in sport psychology and transition.';
  const min = input.minCitations ?? 3;

  const user = `Topic: ${input.topic}

${keywords}

${audience}

Citation requirement: include at least ${min} citation(s) with matching sources[] entries. Each source must have a URL and a publisher.

Constraints:
- title: ≤ 60 characters, descriptive, no clickbait.
- metaDescription: ≤ 160 characters, factual.
- slug: kebab-case, ASCII only, no leading/trailing dash, ≤ 60 chars.
- bodyMarkdown: Markdown only. H2/H3 sections. No H1.
- jsonLd: schema.org ScholarlyArticle shape preferred (@context, @type, headline, description).
- citations[].inlineMarker like "[1]"; sources[].id matches citations[].sourceId.
- Set generatedAt to the current ISO timestamp.

Return JSON matching the supplied schema. Brand must be "etf".`;

  return { system: SYSTEM_ETF, user };
}
