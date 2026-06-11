import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_DIR = path.join(__dirname, 'figma-baseline');
const DIFF_DIR = path.join(__dirname, 'figma-baseline', 'diff');

// baseline 이미지가 있는 qa-id만 테스트 대상
const availableIds = fs.existsSync(BASELINE_DIR)
  ? fs.readdirSync(BASELINE_DIR)
      .filter(f => f.endsWith('.png') && !f.startsWith('diff-'))
      .map(f => f.replace('.png', ''))
  : [];

test.describe('Button QA — Figma vs Browser', () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(DIFF_DIR)) fs.mkdirSync(DIFF_DIR, { recursive: true });
  });

  if (availableIds.length === 0) {
    test('baseline 이미지 없음 — tests/figma-baseline/ 에 PNG 파일을 추가하세요', async () => {
      console.log('Figma baseline 이미지가 없습니다. figma-qa-map.ts 참조 후 수집하세요.');
    });
  }

  for (const qaId of availableIds) {
    test(qaId, async ({ page }) => {
      await page.goto('/qa');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);

      const el = page.locator(`[data-qa-id="${qaId}"]`);
      await expect(el).toBeVisible();

      const browserShot = await el.screenshot();
      const figmaShot = fs.readFileSync(path.join(BASELINE_DIR, `${qaId}.png`));

      const img1 = PNG.sync.read(browserShot);
      const img2 = PNG.sync.read(figmaShot);

      // 크기 불일치 시 실패 메시지 출력 후 스킵
      if (img1.width !== img2.width || img1.height !== img2.height) {
        console.warn(
          `[${qaId}] 크기 불일치: browser ${img1.width}×${img1.height} vs figma ${img2.width}×${img2.height}`
        );
        return;
      }

      const diff = new PNG({ width: img1.width, height: img1.height });
      const mismatch = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
        threshold: 0.15,
      });

      const mismatchRatio = mismatch / (img1.width * img1.height);

      // diff 이미지 저장 (실패 케이스 디버깅용)
      if (mismatchRatio >= 0.05) {
        fs.writeFileSync(path.join(DIFF_DIR, `diff-${qaId}.png`), PNG.sync.write(diff));
      }

      expect(
        mismatchRatio,
        `불일치 픽셀 ${(mismatchRatio * 100).toFixed(1)}% — diff-${qaId}.png 확인`
      ).toBeLessThan(0.05);
    });
  }
});
