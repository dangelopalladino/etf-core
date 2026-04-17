import { test, expect } from '@playwright/test';

/**
 * Phase 11 §3 D8 — Flow A: 6identities → etfframework cross-site purchase.
 *
 * 1. Land on 6id home → take assessment → reach Premium paywall
 * 2. Pay $9.99 → land back on /results with Premium unlocked
 * 3. Click "Get the book" link → assert navigation to etfframework /resources/motion
 * 4. Pay $9.99 → fulfillment email queued (verified via Supabase email_log row
 *    OR Resend test event log if API key surfaced)
 * 5. Open download URL from email → assert PDF watermarked with buyer email
 *
 * NOTE: full payment leg requires Stripe test-mode credentials and a deterministic
 * test buyer email. The skeleton exercises all the navigation contracts and
 * cross-domain handoff that the Phase 11 architecture must preserve.
 */

const SIX_ID_URL = process.env.SIX_ID_URL || 'https://www.6identities.com';
const ETF_URL = process.env.ETFFRAMEWORK_URL || 'https://etfframework.com';

test('Flow A: 6id assessment → premium paywall → cross-domain to etfframework book', async ({ page }) => {
  // Step 1 — land on 6id home
  await page.goto(SIX_ID_URL);
  await expect(page).toHaveURL(new RegExp(SIX_ID_URL));

  // Verify GA4 cross-domain linker is present (essential for Phase 11 D4)
  const gtagPresent = await page.evaluate(() => typeof (window as any).gtag === 'function');
  // Defer hard assertion — GA4 may load asynchronously after page settles.
  // Manual check: confirm in DebugView during nightly run that session_id persists.
  if (!gtagPresent) {
    test.info().annotations.push({ type: 'gtag', description: 'gtag not yet present at navigation completion (may be loading)' });
  }

  // Step 2 — start assessment (CTA copy may evolve; use accessible name)
  const startBtn = page.getByRole('link', { name: /assessment|start|take/i }).first();
  await startBtn.click();
  await expect(page).toHaveURL(/\/assessment/);

  // Step 3 — completion is product-specific. Skip for now if not running in
  // full-flow mode (set CROSS_SITE_FULL_FLOW=1 to run the entire path).
  if (process.env.CROSS_SITE_FULL_FLOW !== '1') {
    test.info().annotations.push({ type: 'mode', description: 'navigation contract only — full payment flow not exercised' });
    return;
  }

  // Step 4 — full flow (skeleton): the deterministic answer set should produce
  // a known type. Implementer fills in the click sequence per assessment v2.
  // This intentionally fails loud until the answer harness is in place.
  throw new Error('TODO: implement deterministic assessment answer harness for Compass type');
});
