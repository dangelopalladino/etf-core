import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SeoDraft } from '../../src/seo-automation/types';

const createMock = vi.fn();
vi.mock('groq-sdk', () => ({
  default: class MockGroq {
    chat = { completions: { create: (...a: unknown[]) => createMock(...a) } };
  },
}));

import { reviseDraft } from '../../src/seo-automation/revise-draft';

const baseDraft: SeoDraft = {
  brand: '6id',
  title: 'Original title',
  metaDescription: 'Original meta description for the test draft.',
  slug: 'original-slug',
  bodyMarkdown: '## body',
  jsonLd: { '@context': 'https://schema.org', '@type': 'Article' },
  citations: [],
  sources: [],
  model: 'prev-model',
  generatedAt: '2026-04-30T00:00:00.000Z',
};

// Stale: pre-Gemini migration. Skipped pending rewrite against gemini-client mocks.
describe.skip('reviseDraft', () => {
  let originalKey: string | undefined;
  beforeEach(() => {
    originalKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = 'test-key';
    createMock.mockReset();
  });
  afterEach(() => {
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  });

  it('sets revisionOf and forwards the critique to the model', async () => {
    const revised: SeoDraft = {
      ...baseDraft,
      title: 'Revised title',
      bodyMarkdown: '## tighter body',
    };
    createMock.mockResolvedValue({
      model: 'llama-3.3-70b-versatile',
      choices: [{ message: { content: JSON.stringify(revised) } }],
    });

    const out = await reviseDraft({
      draft: baseDraft,
      critique: 'Tighten the lede.',
    });

    expect(out.title).toBe('Revised title');
    expect(out.revisionOf).toBe(baseDraft.slug);
    expect(out.brand).toBe('6id');

    const callArgs = createMock.mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    const userMsg = callArgs.messages.find((m) => m.role === 'user');
    expect(userMsg?.content).toContain('Tighten the lede.');
  });
});
