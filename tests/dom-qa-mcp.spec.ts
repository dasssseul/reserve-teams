import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureAll, type DomMetric } from './utils/dom-measure';
import {
  compareMcp,
  printMcpFailures,
  summarizeMcp,
  type McpDiffItem,
  type McpNode,
} from './utils/compare-mcp';
import type { NormalizedNode } from '../scripts/fetch-figma-metadata';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MCP_PATH = resolve(__dirname, 'fixtures/figma-mcp-variables.json');
const METADATA_PATH = resolve(__dirname, 'fixtures/figma-metadata.json');
const REPORT_PATH = resolve(__dirname, 'dom-qa-mcp-report.json');

interface MetadataFile {
  _version: number;
  _generatedAt: string;
  _fileKey: string;
  data: Record<string, NormalizedNode>;
}

interface McpFile {
  _version: number;
  _generatedAt: string;
  _fileKey: string;
  _source: string;
  data: Record<string, McpNode>;
}

// dom-qa.spec.ts 와 동일한 PAGE_BY_PREFIX (긴 prefix 먼저)
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

test.describe('DOM vs Figma MCP 변수 비교', () => {
  test('전체 qa-id 일괄 비교', async ({ page }) => {
    if (!existsSync(MCP_PATH)) {
      throw new Error(
        `figma-mcp-variables.json이 없습니다. 먼저 Figma MCP로 수집하세요. (예상 경로: ${MCP_PATH})`
      );
    }

    const mcpFile = JSON.parse(readFileSync(MCP_PATH, 'utf8')) as McpFile;
    const qaIds = Object.keys(mcpFile.data);

    let metadataData: Record<string, NormalizedNode> | null = null;
    if (existsSync(METADATA_PATH)) {
      const metaFile = JSON.parse(readFileSync(METADATA_PATH, 'utf8')) as MetadataFile;
      metadataData = metaFile.data;
    } else {
      console.warn('[DOM-QA-MCP] figma-metadata.json 없음 — height/width/lineHeight/letterSpacing 비교 생략');
    }
    expect(qaIds.length, 'figma-mcp-variables.json에 노드가 없음').toBeGreaterThan(0);

    const groups: Record<string, string[]> = {};
    const unmapped: string[] = [];
    for (const id of qaIds) {
      const path = pathForQaId(id);
      if (path == null) {
        unmapped.push(id);
        continue;
      }
      (groups[path] ??= []).push(id);
    }

    if (unmapped.length > 0) {
      console.warn(
        `[DOM-QA-MCP] 매핑 안 된 qa-id ${unmapped.length}건: ${unmapped.slice(0, 10).join(', ')}${unmapped.length > 10 ? ' …' : ''}`
      );
    }

    const domMetrics: Record<string, DomMetric> = {};
    for (const [path, ids] of Object.entries(groups)) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      const partial = await measureAll(page, ids);
      Object.assign(domMetrics, partial);
    }

    const report: Record<string, McpDiffItem[]> = {};
    for (const qaId of qaIds) {
      report[qaId] = compareMcp(
        mcpFile.data[qaId],
        domMetrics[qaId],
        qaId.startsWith('modal-') ? undefined : metadataData?.[qaId],
      );
    }

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');

    const stats = summarizeMcp(report);
    console.log(
      `\n[DOM-QA-MCP] 노드 ${qaIds.length}개 · pages ${Object.keys(groups).length}개 · ` +
        `pass: ${stats.pass} · fail: ${stats.fail} · warn: ${stats.warn} · skip: ${stats.skip} · fail 노드: ${stats.failingNodes}`
    );

    printMcpFailures(report);
  });
});
