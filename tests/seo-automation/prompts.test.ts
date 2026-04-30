import { describe, it, expect } from 'vitest';
import { build6idDraftPrompt } from '../../src/seo-automation/prompts/6id-draft';
import { buildEtfDraftPrompt } from '../../src/seo-automation/prompts/etf-draft';
import { buildRevisionPrompt } from '../../src/seo-automation/prompts/revision';
import type { SeoDraft } from '../../src/seo-automation/types';

describe('prompts', () => {
  it('build6idDraftPrompt is stable for fixed input (snapshot)', () => {
    const out = build6idDraftPrompt({
      brand: '6id',
      topic: 'starting again after retiring from college soccer',
      targetKeywords: ['athlete identity', 'after sport'],
    });
    expect(out).toMatchSnapshot();
  });

  it('buildEtfDraftPrompt requires citations and is stable (snapshot)', () => {
    const out = buildEtfDraftPrompt({
      brand: 'etf',
      topic: 'measuring athletic identity in transition',
      targetKeywords: ['athletic identity measurement'],
    });
    expect(out.user).toMatch(/at least 3 citation/i);
    expect(out).toMatchSnapshot();
  });

  it('6id prompt does not mandate citations by default', () => {
    const out = build6idDraftPrompt({ brand: '6id', topic: 'foo' });
    expect(out.user).toMatch(/citations are optional/i);
  });

  it('ETF prompt honors a higher minCitations override', () => {
    const out = buildEtfDraftPrompt({
      brand: 'etf',
      topic: 'foo',
      minCitations: 7,
    });
    expect(out.user).toMatch(/at least 7 citation/i);
  });

  it('buildRevisionPrompt injects critique verbatim and preserves brand voice', () => {
    const draft: SeoDraft = {
      brand: 'etf',
      title: 'A test',
      metaDescription: 'meta',
      slug: 'a-test',
      bodyMarkdown: '# body',
      jsonLd: {},
      citations: [],
      sources: [],
      model: 'm',
      generatedAt: '2026-04-30T00:00:00.000Z',
    };
    const critique = 'Tighten the lede; cite Brewer 1993.';
    const out = buildRevisionPrompt({ draft, critique });
    expect(out.user).toContain(critique);
    expect(out.system).toMatch(/preserve.*brand voice/i);
  });
});
