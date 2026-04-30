import type { SeoDraft, Brand } from './types';
import { SeoDraftError } from './types';

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

  if (!isObject(r.jsonLd)) errs.push('jsonLd must be an object');

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

export const DRAFT_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'brand',
    'title',
    'metaDescription',
    'slug',
    'bodyMarkdown',
    'jsonLd',
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
    jsonLd: { type: 'object', additionalProperties: true },
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
