import type { SeoDraft, Brand, LintReport, LintWarning } from './types';
import { SeoDraftError } from './types';
import { ETF_KILL_LIST, SIXID_KILL_LIST, type KillListEntry } from './kill-list';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function validateDraftShape(
  raw: unknown,
  expected: { brand: Brand; minCitations: number },
  rawOutput?: string
): SeoDraft {
  const errs: string[] = [];

  if (!isObject(raw)) {
    throw new SeoDraftError('Draft is not an object', { rawOutput });
  }

  const r = raw as Record<string, unknown>;

  if (r.brand !== expected.brand) errs.push(`brand must be "${expected.brand}"`);
  if (typeof r.title !== 'string' || r.title.length === 0) errs.push('title missing');
  else if (r.title.length > 60) errs.push(`title > 60 chars (${r.title.length})`);

  if (typeof r.metaDescription !== 'string' || r.metaDescription.length === 0)
    errs.push('metaDescription missing');
  else if (r.metaDescription.length > 160)
    errs.push(`metaDescription > 160 chars (${r.metaDescription.length})`);

  if (typeof r.slug !== 'string' || !SLUG_RE.test(r.slug))
    errs.push('slug must be kebab-case ASCII');

  if (typeof r.bodyMarkdown !== 'string' || r.bodyMarkdown.length === 0)
    errs.push('bodyMarkdown missing');

  // jsonLd is no longer LLM-produced; the adapter overwrites it. Initialize
  // to {} when absent so downstream code has a stable shape.
  if (!isObject(r.jsonLd)) r.jsonLd = {};

  if (!Array.isArray(r.citations)) errs.push('citations must be an array');
  if (!Array.isArray(r.sources)) errs.push('sources must be an array');

  if (Array.isArray(r.citations) && r.citations.length < expected.minCitations) {
    errs.push(
      `citations.length (${r.citations.length}) < minCitations (${expected.minCitations})`
    );
  }

  if (Array.isArray(r.citations) && Array.isArray(r.sources)) {
    const sourceIds = new Set(
      r.sources
        .filter(isObject)
        .map((s) => (typeof s.id === 'string' ? s.id : ''))
        .filter(Boolean)
    );
    for (const c of r.citations) {
      if (!isObject(c)) {
        errs.push('citations[] must be objects');
        break;
      }
      if (typeof c.sourceId !== 'string' || !sourceIds.has(c.sourceId)) {
        errs.push(`citation.sourceId "${String(c.sourceId)}" has no matching source`);
      }
      if (typeof c.inlineMarker !== 'string') {
        errs.push('citation.inlineMarker must be a string');
      }
    }
  }

  if (typeof r.model !== 'string' || r.model.length === 0)
    errs.push('model missing');
  if (typeof r.generatedAt !== 'string' || r.generatedAt.length === 0)
    errs.push('generatedAt missing');

  if (errs.length > 0) {
    throw new SeoDraftError(`Draft validation failed: ${errs.join('; ')}`, {
      rawOutput,
      fieldErrors: errs,
    });
  }

  return r as unknown as SeoDraft;
}

/**
 * Strict shape used by `validateDraftShape`. Retained for input-shape sanity
 * and for any consumer that wants the closed-schema representation. NOT sent
 * to Gemini — Gemini rejects `additionalProperties: false`, `pattern`, and
 * `maxLength`. See `GEMINI_DRAFT_SCHEMA` for the LLM-facing variant.
 */
export const DRAFT_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'brand',
    'title',
    'metaDescription',
    'slug',
    'bodyMarkdown',
    'citations',
    'sources',
    'model',
    'generatedAt',
  ],
  properties: {
    brand: { type: 'string', enum: ['6id', 'etf'] },
    title: { type: 'string', maxLength: 60 },
    metaDescription: { type: 'string', maxLength: 160 },
    slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 60 },
    bodyMarkdown: { type: 'string' },
    citations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['sourceId', 'inlineMarker'],
        properties: {
          sourceId: { type: 'string' },
          inlineMarker: { type: 'string' },
          quote: { type: 'string' },
        },
      },
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'url', 'title', 'accessedAt'],
        properties: {
          id: { type: 'string' },
          url: { type: 'string' },
          title: { type: 'string' },
          publisher: { type: 'string' },
          publishedAt: { type: 'string' },
          accessedAt: { type: 'string' },
        },
      },
    },
    model: { type: 'string' },
    generatedAt: { type: 'string' },
    revisionOf: { type: 'string' },
  },
};

/**
 * Gemini-flavored schema. OpenAPI 3.0 subset — no `additionalProperties`,
 * no `pattern`, no `maxLength`. Length and slug-format checks happen in
 * `validateDraftShape` after the call returns.
 */
export const GEMINI_DRAFT_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: [
    'brand',
    'title',
    'metaDescription',
    'slug',
    'bodyMarkdown',
    'citations',
    'sources',
  ],
  properties: {
    brand: { type: 'string', enum: ['6id', 'etf'] },
    title: { type: 'string' },
    metaDescription: { type: 'string' },
    slug: { type: 'string' },
    bodyMarkdown: { type: 'string' },
    citations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['sourceId', 'inlineMarker'],
        properties: {
          sourceId: { type: 'string' },
          inlineMarker: { type: 'string' },
          quote: { type: 'string' },
        },
      },
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'url', 'title', 'accessedAt'],
        properties: {
          id: { type: 'string' },
          url: { type: 'string' },
          title: { type: 'string' },
          publisher: { type: 'string' },
          publishedAt: { type: 'string' },
          accessedAt: { type: 'string' },
        },
      },
    },
  },
};

// ===== Lint =====

const ETF_AVG_SENTENCE_TARGET = 18;
const ETF_HARD_SENTENCE_CAP = 35;
const ETF_PARAGRAPH_CAP = 5;
const SIXID_AVG_SENTENCE_TARGET = 12;
const SIXID_HARD_SENTENCE_CAP = 25;
const SIXID_PARAGRAPH_CAP = 3;

function stripForKillScan(body: string): string {
  let out = body;
  // Strip fenced code blocks.
  out = out.replace(/```[\s\S]*?```/g, '');
  // Strip blockquotes (entire blockquote lines).
  out = out.replace(/^\s*>.*$/gm, '');
  // Strip a "References"/"Citations" section to end of doc.
  out = out.replace(/(^|\n)#{1,3}\s*(References|Citations|Sources)\b[\s\S]*$/i, '');
  return out;
}

function splitParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    // Drop heading-only paragraphs from sentence/paragraph metrics.
    .filter((p) => !/^#{1,6}\s/.test(p));
}

function splitSentences(paragraph: string): string[] {
  const flat = paragraph.replace(/\s+/g, ' ').trim();
  if (!flat) return [];
  // Naive sentence splitter — good enough for prose lint, won't hand back
  // false positives on common abbreviations because we don't enforce
  // anything that depends on exact sentence count besides "is this single
  // sentence too long".
  return flat.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(\[])/);
}

function wordCount(s: string): number {
  return (s.match(/\b\w[\w'-]*\b/g) || []).length;
}

function applyKillList(
  text: string,
  list: KillListEntry[]
): LintWarning[] {
  const warnings: LintWarning[] = [];
  for (const entry of list) {
    if (entry.kind === 'phrase') {
      const re = new RegExp(
        `\\b${entry.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        'i'
      );
      const m = text.match(re);
      if (m) {
        warnings.push({
          category: 'kill_list',
          message: `Banned phrase: "${entry.value}"`,
          evidence: extractContext(text, m.index ?? 0, m[0].length),
        });
      }
    } else {
      const m = text.match(entry.value);
      if (m) {
        warnings.push({
          category: 'kill_list',
          message: `Banned pattern: ${entry.label}`,
          evidence: extractContext(text, m.index ?? 0, m[0].length),
        });
      }
    }
  }
  return warnings;
}

function extractContext(text: string, idx: number, len: number): string {
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + len + 40);
  return `…${text.slice(start, end).replace(/\s+/g, ' ').trim()}…`;
}

function lintProseShape(
  body: string,
  hardCap: number,
  paragraphCap: number,
  brandLabel: string
): LintWarning[] {
  const warnings: LintWarning[] = [];
  const paragraphs = splitParagraphs(body);

  for (const para of paragraphs) {
    const sentences = splitSentences(para);
    if (sentences.length > paragraphCap) {
      warnings.push({
        category: 'paragraph_too_long',
        message: `${brandLabel} paragraph cap is ${paragraphCap} sentences; got ${sentences.length}`,
        evidence: para.slice(0, 200),
      });
    }
    for (const s of sentences) {
      const wc = wordCount(s);
      if (wc > hardCap) {
        warnings.push({
          category: 'sentence_too_long',
          message: `Sentence > ${hardCap} words (${wc})`,
          evidence: s.slice(0, 200),
        });
      }
    }
  }
  return warnings;
}

function firstNParagraphs(body: string, n: number): string {
  const paras = splitParagraphs(body);
  return paras.slice(0, n).join('\n\n');
}

const APA_CITATION_RE =
  /\([A-Z][a-zA-ZÀ-ſ\-']+(?:,?\s+(?:&|and)?\s*[A-Z][a-zA-ZÀ-ſ\-']+)*,?\s*(?:19|20)\d{2}[a-z]?\)/;

const DOI_LINK_RE = /\[[^\]]*doi[^\]]*\]\(https?:\/\/(?:dx\.)?doi\.org\/[^)\s]+\)/i;

export function lintDraft(brand: Brand, body: string): LintReport {
  const warnings: LintWarning[] = [];
  const scanText = stripForKillScan(body);

  // Kill-list (prose only)
  const list = brand === 'etf' ? ETF_KILL_LIST : SIXID_KILL_LIST;
  warnings.push(...applyKillList(scanText, list));

  // Prose shape
  if (brand === 'etf') {
    warnings.push(
      ...lintProseShape(scanText, ETF_HARD_SENTENCE_CAP, ETF_PARAGRAPH_CAP, 'ETF')
    );
    void ETF_AVG_SENTENCE_TARGET;
  } else {
    warnings.push(
      ...lintProseShape(
        scanText,
        SIXID_HARD_SENTENCE_CAP,
        SIXID_PARAGRAPH_CAP,
        '6id'
      )
    );
    void SIXID_AVG_SENTENCE_TARGET;
  }

  // Brand-specific structural checks
  if (brand === 'etf') {
    if (!/^##\s+ETF Application\b/m.test(body)) {
      warnings.push({
        category: 'missing_section',
        message: 'Missing required H2 "ETF Application"',
      });
    }
    if (!/^###\s+Practitioner Note\b/m.test(body)) {
      warnings.push({
        category: 'missing_section',
        message: 'Missing required H3 "Practitioner Note"',
      });
    }
    if (!APA_CITATION_RE.test(body)) {
      warnings.push({
        category: 'missing_citation',
        message: 'No APA-format inline citation detected (e.g., "(Smith, 2024)")',
      });
    }
    if (!DOI_LINK_RE.test(body) && !/https?:\/\/(?:dx\.)?doi\.org\//.test(body)) {
      warnings.push({
        category: 'missing_citation',
        message: 'No DOI link detected — APA citation must include a linked DOI',
      });
    }
    if (!/Executable Transition Framework™/.test(body) && !/\bETF™/.test(body)) {
      warnings.push({
        category: 'missing_trademark',
        message:
          'Missing trademark: "Executable Transition Framework™" (first mention) or "ETF™" (subsequent)',
      });
    }
  } else {
    // 6id: must end with exact CTA "Take the assessment"
    const trimmed = body.trim();
    const lastLine = trimmed.split(/\n+/).pop()?.trim() ?? '';
    if (lastLine !== 'Take the assessment') {
      warnings.push({
        category: 'missing_section',
        message:
          'Body must end with the exact line "Take the assessment" (no other CTA permitted)',
        evidence: lastLine.slice(0, 200),
      });
    }
    // Athlete-identity hook in first 2 paragraphs
    const hookText = firstNParagraphs(body, 2);
    if (!/\b(?:former\s+)?athlete[s]?\b/i.test(hookText)) {
      warnings.push({
        category: 'missing_athlete_link',
        message:
          'The phrase "athlete" or "former athlete" must appear in one of the first two paragraphs',
      });
    }
    if (!/6\s*Identities®/.test(body)) {
      warnings.push({
        category: 'missing_trademark',
        message: 'Missing first-mention trademark "6 Identities®"',
      });
    }
  }

  return { warnings };
}
