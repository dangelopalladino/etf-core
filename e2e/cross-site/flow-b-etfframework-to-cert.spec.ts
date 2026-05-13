import { test, expect } from '@playwright/test';

/**
 * Phase 11 §3 D8 — Flow B: etfframework → 6identities → back → certification.
 *
 * 1. Land on etfframework home
 * 2. Click assessment CTA → assert redirect to 6id /assessment
 * 3. Complete assessment → land on 6id /results
 * 4. Click cert CTA → navigate back to etfframework /certification
 * 5. Enroll for $99 → cert guide email arrives → in-app modules accessible
 */

const SIX_ID_URL = process.env.SIX_ID_URL || 'https://6identities.com';
const ETF_URL = process.env.ETFFRAMEWORK_URL || 'https://etfframework.com';

test('Flow B: etfframework → 6id assessment → back to etfframework cert', async ({ page, context }) => {
  await page.goto(ETF_URL);
  await expect(page).toHaveURL(/etfframework\.com/);

  // Locate the assessment CTA. etfframework links out to 6id (Phase 8 D6).
  // The production CTA uses target="_blank" + rel="noopener noreferrer" so the
  // handoff lands in a new tab; capture it via context.waitForEvent('page').
  const assessmentLink = page.getByRole('link', { name: /assessment|profile|6 identities/i }).first();

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    assessmentLink.click(),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await expect(popup).toHaveURL(/6identities\.com/);
  await expect(popup).toHaveURL(/\/assessment/);

  if (process.env.CROSS_SITE_FULL_FLOW !== '1') {
    test.info().annotations.push({ type: 'mode', description: 'navigation contract only — full enrollment flow not exercised' });
    return;
  }

  throw new Error('TODO: implement deterministic assessment answer harness + Stripe test-mode enrollment');
});
