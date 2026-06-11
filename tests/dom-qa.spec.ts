import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureAll, type DomMetric } from './utils/dom-measure';
import {
  compareSpec,
  collectStrictFails,
  printConsoleTable,
  type DiffItem,
} from './utils/compare';
import type { NormalizedNode } from '../scripts/fetch-figma-metadata';

const __dirname = dirname(fileURLToPath(import.meta.url));
const METADATA_PATH = resolve(__dirname, 'fixtures/figma-metadata.json');
const REPORT_PATH = resolve(__dirname, 'dom-qa-report.json');

interface MetadataFile {
  _version: number;
  _generatedAt: string;
  _fileKey: string;
  data: Record<string, NormalizedNode>;
}

// qa-id 접두 → QA 페이지 경로 매핑.
// 더 긴 접두를 먼저 매칭하기 위해 길이 내림차순으로 정렬해서 사용.
const PAGE_BY_PREFIX: ReadonlyArray<{ prefix: string; path: string }> = [
  { prefix: 'btn-icon-', path: '/qa' },
  { prefix: 'btn-', path: '/qa' },
  { prefix: 'input-', path: '/qa/input' },
  { prefix: 'lnb-', path: '/qa/lnb' },
  { prefix: 'modal-', path: '/qa/modal' },
  { prefix: 'tt-', path: '/qa/timetable' },
  { prefix: 'tbl-', path: '/qa/table' },
];

function pathForQaId(qaId: string): string | null {
  for (const { prefix, path } of PAGE_BY_PREFIX) {
    if (qaId.startsWith(prefix)) return path;
  }
  return null;
}

test.describe('DOM vs Figma 수치 비교', () => {
  test('전체 qa-id 일괄 비교', async ({ page }) => {
    if (!existsSync(METADATA_PATH)) {
      throw new Error(
        `figma-metadata.json이 없습니다. 먼저 'FIGMA_TOKEN=xxx pnpm fetch:figma'를 실행하세요. (예상 경로: ${METADATA_PATH})`,
      );
    }

    const metadata = JSON.parse(readFileSync(METADATA_PATH, 'utf8')) as MetadataFile;
    const qaIds = Object.keys(metadata.data);
    expect(qaIds.length, 'figma-metadata.json에 노드가 없음').toBeGreaterThan(0);

    // qa-id 접두별로 그룹화 → 페이지 방문 횟수 최소화
    const groups: Record<string, string[]> = {};
    const unmapped: string[] = [];
    for (const id of qaIds) {
      const path = pathForQaId(id);
      if (path == null) {
        unmapped.push(id);
        continue;
      }
      groups[path] = groups[path] ?? [];
      groups[path].push(id);
    }

    if (unmapped.length > 0) {
      console.warn(
        `[DOM-QA] 매핑 안 된 qa-id ${unmapped.length}건 — PAGE_BY_PREFIX 추가 필요:\n  ${unmapped.slice(0, 10).join(', ')}${unmapped.length > 10 ? ' …' : ''}`,
      );
    }

    // 페이지별 measureAll → 결과 누적
    const domMetrics: Record<string, DomMetric> = {};
    for (const [path, ids] of Object.entries(groups)) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);

      const partial = await measureAll(page, ids);
      Object.assign(domMetrics, partial);
    }

    // 비교 보고서 생성
    const report: Record<string, DiffItem[]> = {};
    for (const qaId of qaIds) {
      report[qaId] = compareSpec(metadata.data[qaId], domMetrics[qaId]);
    }

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');

    // 콘솔 요약: 통계 + 이슈 있는 항목만 상세
    const stats = summarize(report);
    console.log(
      `\n[DOM-QA] 총 ${qaIds.length}개 · pages ${Object.keys(groups).length}개 방문 · strict pass: ${stats.strictPass} · warn-only: ${stats.warns} · strict fail: ${stats.strictFails} · skip: ${stats.skips}`,
    );
    printConsoleTable(report);

    const fails = collectStrictFails(report);
    if (fails.length > 0) {
      const lines = fails.map(
        ({ qaId, item }) =>
          `  - [${qaId}] ${item.property}: figma=${item.figmaValue} dom=${item.domValue}${item.delta !== undefined ? ` Δ=${item.delta}` : ''}${item.note ? ` (${item.note})` : ''}`,
      );
      expect
        .soft(fails, `strict 채널 fail ${fails.length}건:\n${lines.join('\n')}`)
        .toEqual([]);
    }

    expect(fails, 'strict 채널에서 실패한 항목이 존재').toHaveLength(0);
  });
});

function summarize(report: Record<string, DiffItem[]>) {
  let strictPass = 0;
  let strictFails = 0;
  let warns = 0;
  let skips = 0;
  for (const items of Object.values(report)) {
    for (const item of items) {
      if (item.status === 'skip') skips++;
      else if (item.status === 'warn') warns++;
      else if (item.status === 'fail' && item.channel === 'strict') strictFails++;
      else if (item.status === 'pass' && item.channel === 'strict') strictPass++;
    }
  }
  return { strictPass, strictFails, warns, skips };
}
