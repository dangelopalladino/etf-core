import React from 'react';
import { describe, it, expect } from 'vitest';
import { render as rtlRender, screen } from '@testing-library/react';

void React;
import { ApprovalEmail } from '../../src/seo-automation/email-template';
import type { SeoDraft } from '../../src/seo-automation/types';

const draft: SeoDraft = {
  brand: '6id',
  title: 'Test draft title',
  metaDescription: 'Test description for the approval email render.',
  slug: 'test-draft',
  bodyMarkdown: '## body',
  jsonLd: {},
  citations: [],
  sources: [],
  model: 'm',
  generatedAt: '2026-04-30T00:00:00.000Z',
};

describe('<ApprovalEmail/> ARIA contract', () => {
  it('renders for 6id with all three CTAs and supplied URLs', () => {
    rtlRender(
      <ApprovalEmail
        brand="6id"
        draft={draft}
        approveUrl="https://6identities.com/api/seo/approve?token=A"
        reviseUrl="https://6identities.com/api/seo/revise?token=R"
        rejectUrl="https://6identities.com/api/seo/reject?token=X"
        expiresAt="2026-05-07T00:00:00.000Z"
      />
    );

    const approve = screen.getByRole('link', { name: /approve draft/i });
    const revise = screen.getByRole('link', { name: /request revision/i });
    const reject = screen.getByRole('link', { name: /reject draft/i });

    expect(approve.getAttribute('href')).toContain('approve?token=A');
    expect(revise.getAttribute('href')).toContain('revise?token=R');
    expect(reject.getAttribute('href')).toContain('reject?token=X');
  });

  it('renders for etf without throwing', () => {
    expect(() =>
      rtlRender(
        <ApprovalEmail
          brand="etf"
          draft={{ ...draft, brand: 'etf' }}
          approveUrl="https://etfframework.com/api/seo/approve?token=A"
          reviseUrl="https://etfframework.com/api/seo/revise?token=R"
          rejectUrl="https://etfframework.com/api/seo/reject?token=X"
          expiresAt="2026-05-07T00:00:00.000Z"
        />
      )
    ).not.toThrow();
  });
});
