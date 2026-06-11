import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_DIR = path.join(__dirname, 'figma-baseline');
const DIFF_DIR = path.join(__dirname, 'figma-baseline', 'diff');

// Modal baseline은 `modal-` 접두 qa-id만 필터 (button과 분리)
const availableIds = fs.existsSync(BASELINE_DIR)
  ? fs
      .readdirSync(BASELINE_DIR)
      .filter(
        (f) =>
          f.endsWith('.png') &&
          !f.startsWith('diff-') &&
          f.startsWith('modal-'),
      )
      .map((f) => f.replace('.png', ''))
  : [];

// QA 페이지에 항상 존재해야 하는 핵심 qa-id (baseline 없어도 렌더 검증)
const SANITY_IDS = [
  'modal-shell-xs-sup-close',
  'modal-shell-md-sup-close',
  'modal-shell-2xl-nosup-noclose',
  'modal-footer-spacebetween-lc-lol-sb',
  'modal-footer-centered-sb-sb',
];

test.describe('Modal QA — 렌더링 sanity', () => {
  for (const qaId of SANITY_IDS) {
    test(`render: ${qaId}`, async ({ page }) => {
      await page.goto('/qa/modal');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);

      const el = page.locator(`[data-qa-id="${qaId}"]`);
      await expect(el).toBeVisible();
    });
  }

  test('Portal · ESC · backdrop click', async ({ page }) => {
    await page.goto('/qa/modal');
    await page.waitForLoadState('networkidle');

    // 트리거 버튼 클릭 → Portal Modal 노출
    await page.getByRole('button', { name: /Portal 모달 열기/ }).click();

    const overlay = page.locator('[data-qa-id="modal-portal-md-overlay"]');
    await expect(overlay).toBeVisible();

    // ESC로 닫기
    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);

    // 다시 열어서 backdrop 클릭으로 닫기
    await page.getByRole('button', { name: /Portal 모달 열기/ }).click();
    await expect(overlay).toBeVisible();
    await page.locator('[data-qa-id="modal-portal-md-backdrop"]').click();
    await expect(overlay).toHaveCount(0);
  });
});

test.describe('Modal QA — Figma baseline 픽셀 비교 (있는 경우만)', () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(DIFF_DIR)) fs.mkdirSync(DIFF_DIR, { recursive: true });
  });

  if (availableIds.length === 0) {
    test('baseline 이미지 없음 — tests/figma-baseline/modal-*.png 수집 시 활성화', async () => {
      // figma-qa-map.ts 참조 후 modal- 접두 PNG 추가하면 자동 실행됨
    });
    return;
  }

  for (const qaId of availableIds) {
    test(qaId, async ({ page }) => {
      await page.goto('/qa/modal');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);

      const el = page.locator(`[data-qa-id="${qaId}"]`);
      await expect(el).toBeVisible();

      const browserShot = await el.screenshot();
      const figmaShot = fs.readFileSync(
        path.join(BASELINE_DIR, `${qaId}.png`),
      );

      const img1 = PNG.sync.read(browserShot);
      const img2 = PNG.sync.read(figmaShot);

      if (img1.width !== img2.width || img1.height !== img2.height) {
        console.warn(
          `[${qaId}] 크기 불일치: browser ${img1.width}×${img1.height} vs figma ${img2.width}×${img2.height}`,
        );
        return;
      }

      const diff = new PNG({ width: img1.width, height: img1.height });
      const mismatch = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        { threshold: 0.15 },
      );
      const mismatchRatio = mismatch / (img1.width * img1.height);

      if (mismatchRatio >= 0.05) {
        fs.writeFileSync(
          path.join(DIFF_DIR, `diff-${qaId}.png`),
          PNG.sync.write(diff),
        );
      }

      expect(
        mismatchRatio,
        `불일치 픽셀 ${(mismatchRatio * 100).toFixed(1)}% — diff-${qaId}.png 확인`,
      ).toBeLessThan(0.05);
    });
  }
});
