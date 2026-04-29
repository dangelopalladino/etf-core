import { test } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIEWPORTS = [
  { name: '320', width: 320,  height: 800 },
  { name: '375', width: 375,  height: 812 },
  { name: '768', width: 768,  height: 1024 },
  { name: '1280', width: 1280, height: 900 },
] as const;

const PRIMITIVES = [
  'eyebrow',
  'kicker',
  'noticecard',
  'emptystate',
  'iconbadge',
  'stat',
  'stack',
  'hero',
  'card',
  'loadingstate',
  'skeletoncard',
  'lockedgate',
] as const;

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'screenshots');

test.beforeAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

for (const vp of VIEWPORTS) {
  test.describe(`viewport ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`full page @ ${vp.name}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts?.ready);
      await page.screenshot({
        path: path.join(OUT_DIR, `harness-${vp.name}.png`),
        fullPage: true,
      });
    });

    for (const id of PRIMITIVES) {
      test(`${id} @ ${vp.name}`, async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => document.fonts?.ready);
        const locator = page.locator(`section#${id}`);
        await locator.scrollIntoViewIfNeeded();
        await locator.screenshot({
          path: path.join(OUT_DIR, `${id}-${vp.name}.png`),
        });
      });
    }
  });
}
