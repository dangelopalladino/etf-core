import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { faqPageSchema } from '../../src/seo/json-ld';

const FAQ_INPUT = [
  { question: 'What is ETF?', answer: 'Executable Transition Framework.' },
  { question: 'Who is it for?', answer: 'Former athletes.' },
];

describe('seo/faqPageSchema (deprecated)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  const originalNodeEnv = process.env.NODE_ENV;
  const hadWindow = 'window' in globalThis;
  const originalWindow = (globalThis as { window?: unknown }).window;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
    if (hadWindow) {
      (globalThis as { window?: unknown }).window = originalWindow;
    } else {
      delete (globalThis as { window?: unknown }).window;
    }
  });

  it('returns a valid FAQPage JSON-LD payload', () => {
    const out = faqPageSchema(FAQ_INPUT);
    expect(out['@context']).toBe('https://schema.org');
    expect(out['@type']).toBe('FAQPage');
    expect(out.mainEntity).toHaveLength(2);
    expect(out.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'What is ETF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Executable Transition Framework.' },
    });
  });

  it('emits a deprecation warning in client-side dev', () => {
    (globalThis as { window?: unknown }).window = {};
    process.env.NODE_ENV = 'development';

    faqPageSchema(FAQ_INPUT);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toMatch(/faqPageSchema\(\) is deprecated/);
  });

  it('is silent in production client builds', () => {
    (globalThis as { window?: unknown }).window = {};
    process.env.NODE_ENV = 'production';

    faqPageSchema(FAQ_INPUT);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('is silent on the server (no window)', () => {
    delete (globalThis as { window?: unknown }).window;
    process.env.NODE_ENV = 'development';

    faqPageSchema(FAQ_INPUT);

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
