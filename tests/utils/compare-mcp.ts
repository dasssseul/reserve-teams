import type { DomMetric } from './dom-measure';
import type { NormalizedNode } from '../../scripts/fetch-figma-metadata';

export interface McpNode {
  figmaId: string;
  variables: Record<string, string>;
}

export type McpDiffStatus = 'pass' | 'fail' | 'warn' | 'skip';
export type McpComparisonMode = 'token' | 'value';

export interface McpCandidate {
  token: string;
  cssVar: string;
  value: string;
}

export interface McpDiffItem {
  category: string;
  status: McpDiffStatus;
  mcpCandidates: McpCandidate[];
  domValue: string;
  /** className에서 추출한 DOM 토큰 (CSS 변수명). 토큰 비교 가능 시에만 채워짐 */
  domToken?: string;
  /** mcpCandidates 중 일치한 토큰의 키 */
  matchedToken?: string;
  comparisonMode: McpComparisonMode;
  note?: string;
  /** 비변수 px 비교 시 Figma 기준값 */
  figmaValue?: string;
  /** px 차이값 (비변수 비교 시) */
  delta?: number;
}

// ── MCP 토큰 키 → CSS 변수명 변환 ────────────────────────────────────────────
// dom-measure.ts의 extractTokens가 className에서 추출하는 변수명과 정합.
// 규칙:
//   "office/bg/..." → "--office-bg-..."
//   "sys/typo/..."  → "--sys-typo-..."
//   "bg/...", "text/...", "stroke/...", "icon/...", "spacing/...",
//   "radius/...", "border/...", "font/..." → "--sys-..." prefix 추가
const SYS_SHORT_PREFIXES = /^(bg|text|stroke|icon|spacing|radius|border|font|opacity|size)\//;

export function mcpKeyToCssVar(key: string): string {
  let normalized = key;
  if (SYS_SHORT_PREFIXES.test(key)) {
    normalized = 'sys/' + key;
  }
  return '--' + normalized.replace(/\//g, '-');
}

// ── 카테고리 prefix 매핑 ─────────────────────────────────────────────────────

const COLOR_PREFIXES = {
  background: [/^bg\//, /^office\/bg\//, /^hr\/bg\//],
  textColor: [/^text\//, /^office\/text\//],
  borderColor: [/^stroke\//, /^office\/stroke\//],
  iconColor: [/^icon\//, /^office\/icon\//],
} as const;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function rgbToHex(rgb: string): string | null {
  const m = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
  if (!m) return null;
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}

function pickByPrefixes(
  variables: Record<string, string>,
  prefixes: readonly RegExp[]
): McpCandidate[] {
  return Object.entries(variables)
    .filter(([key]) => prefixes.some((p) => p.test(key)))
    .map(([token, value]) => ({ token, cssVar: mcpKeyToCssVar(token), value }));
}

function pickByPrefix(variables: Record<string, string>, prefix: string): McpCandidate[] {
  return Object.entries(variables)
    .filter(([key]) => key.startsWith(prefix))
    .map(([token, value]) => ({ token, cssVar: mcpKeyToCssVar(token), value }));
}

function firstBorderRadiusPx(borderRadius: string): number {
  const first = borderRadius.trim().split(/\s+/)[0];
  return parseFloat(first) || 0;
}

// ── 비변수 px 비교 헬퍼 ───────────────────────────────────────────────────────

const PX_TOLERANCE = 1;
const LETTER_SPACING_TOLERANCE = 0.1;

function parseLineHeightPx(lineHeight: string, fontSize: number | null): number | null {
  if (!lineHeight || lineHeight === 'normal') return null;
  const px = parseFloat(lineHeight);
  if (!Number.isFinite(px)) return null;
  if (lineHeight.endsWith('px')) return px;
  if (fontSize != null) return px * fontSize;
  return px;
}

function parseLetterSpacingPx(letterSpacing: string): number | null {
  if (!letterSpacing || letterSpacing === 'normal') return 0;
  const px = parseFloat(letterSpacing);
  return Number.isFinite(px) ? px : null;
}

function compareHeight(figmaHeight: number, dom: DomMetric): McpDiffItem {
  const diff = dom.height - figmaHeight;
  const within = Math.abs(diff) <= PX_TOLERANCE;
  return {
    category: 'height',
    status: within ? 'pass' : 'fail',
    mcpCandidates: [],
    figmaValue: `${figmaHeight}px`,
    domValue: `${dom.height}px`,
    delta: Number(diff.toFixed(3)),
    comparisonMode: 'value',
  };
}

function compareWidth(
  figmaWidth: number,
  dom: DomMetric,
  figmaText: string | undefined,
  domText: string | undefined
): McpDiffItem {
  const isIconOnly = figmaText === undefined && domText === undefined;

  if (!isIconOnly) {
    if (figmaText === undefined || domText === undefined) {
      return {
        category: 'width',
        status: 'skip',
        mcpCandidates: [],
        figmaValue: `${figmaWidth}px`,
        domValue: `${dom.width}px`,
        comparisonMode: 'value',
        note: '텍스트 정보 없음 — width 비교 생략',
      };
    }
    if (figmaText !== domText) {
      return {
        category: 'width',
        status: 'skip',
        mcpCandidates: [],
        figmaValue: `${figmaWidth}px`,
        domValue: `${dom.width}px`,
        comparisonMode: 'value',
        note: `텍스트 불일치 (figma='${figmaText}' dom='${domText}') — width 비교 생략`,
      };
    }
  }

  const diff = dom.width - figmaWidth;
  const within = Math.abs(diff) <= PX_TOLERANCE;
  return {
    category: 'width',
    status: within ? 'pass' : 'fail',
    mcpCandidates: [],
    figmaValue: `${figmaWidth}px`,
    domValue: `${dom.width}px`,
    delta: Number(diff.toFixed(3)),
    comparisonMode: 'value',
  };
}

function compareLineHeight(figmaLineHeightPx: number | null, dom: DomMetric): McpDiffItem | null {
  if (figmaLineHeightPx == null) return null;
  const domPx = parseLineHeightPx(dom.lineHeight, dom.fontSize);
  if (domPx == null) {
    return {
      category: 'lineHeight',
      status: 'skip',
      mcpCandidates: [],
      figmaValue: `${figmaLineHeightPx}px`,
      domValue: dom.lineHeight || 'normal',
      comparisonMode: 'value',
      note: 'DOM lineHeight 파싱 불가 (normal)',
    };
  }
  const diff = domPx - figmaLineHeightPx;
  return {
    category: 'lineHeight',
    status: diff === 0 ? 'pass' : 'warn',
    mcpCandidates: [],
    figmaValue: `${figmaLineHeightPx}px`,
    domValue: `${domPx}px`,
    delta: Number(diff.toFixed(3)),
    comparisonMode: 'value',
    note: diff !== 0 ? 'warn-only' : undefined,
  };
}

function compareLetterSpacing(figmaLetterSpacing: number | null, dom: DomMetric): McpDiffItem | null {
  const figmaVal = figmaLetterSpacing ?? 0;
  const domPx = parseLetterSpacingPx(dom.letterSpacing);
  if (domPx == null) return null;
  const diff = domPx - figmaVal;
  const within = Math.abs(diff) <= LETTER_SPACING_TOLERANCE;
  return {
    category: 'letterSpacing',
    status: within ? 'pass' : 'warn',
    mcpCandidates: [],
    figmaValue: `${figmaVal}px`,
    domValue: `${domPx}px`,
    delta: Number(diff.toFixed(3)),
    comparisonMode: 'value',
    note: !within ? 'warn-only' : undefined,
  };
}

// ── 비교 로직 ────────────────────────────────────────────────────────────────

/** 토큰 우선 비교, 없으면 값(hex) fallback */
function compareColorCategory(
  category: keyof typeof COLOR_PREFIXES,
  variables: Record<string, string>,
  domValue: string,
  domToken: string | undefined
): McpDiffItem {
  const candidates = pickByPrefixes(variables, COLOR_PREFIXES[category]);
  const domHex = rgbToHex(domValue);

  if (candidates.length === 0) {
    return {
      category,
      status: 'skip',
      mcpCandidates: [],
      domValue: domToken ?? domHex ?? domValue,
      domToken,
      comparisonMode: domToken ? 'token' : 'value',
      note: 'MCP에 해당 카테고리 토큰 없음',
    };
  }

  // 1순위: DOM에 className 기반 CSS 변수가 있으면 토큰명 매칭
  if (domToken) {
    const matched = candidates.find((c) => c.cssVar === domToken);
    return {
      category,
      status: matched ? 'pass' : 'fail',
      mcpCandidates: candidates,
      domValue: domHex ?? domValue,
      domToken,
      matchedToken: matched?.token,
      comparisonMode: 'token',
    };
  }

  // 2순위: hex 값 매칭
  if (!domHex) {
    return {
      category,
      status: 'skip',
      mcpCandidates: candidates,
      domValue,
      comparisonMode: 'value',
      note: 'DOM 값 파싱 불가 (transparent/none 가능성)',
    };
  }
  const matched = candidates.find((c) => c.value.toLowerCase() === domHex.toLowerCase());
  return {
    category,
    status: matched ? 'pass' : 'fail',
    mcpCandidates: candidates,
    domValue: domHex,
    matchedToken: matched?.token,
    comparisonMode: 'value',
    note: 'DOM에 토큰 정보 없음 (hex 값 비교)',
  };
}

function compareSpacing(variables: Record<string, string>, dom: DomMetric): McpDiffItem[] {
  const candidates = pickByPrefix(variables, 'spacing/');
  if (candidates.length === 0) return [];

  const sides: Array<{
    side: 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
    px: number;
  }> = [
    { side: 'paddingTop', px: dom.padding.top },
    { side: 'paddingRight', px: dom.padding.right },
    { side: 'paddingBottom', px: dom.padding.bottom },
    { side: 'paddingLeft', px: dom.padding.left },
  ];

  return sides.map(({ side, px }) => {
    const domToken = dom.numericTokens?.[side];

    // 토큰 비교 우선
    if (domToken) {
      const matched = candidates.find((c) => c.cssVar === domToken);
      return {
        category: side,
        status: matched ? 'pass' : 'fail',
        mcpCandidates: candidates,
        domValue: `${px}px`,
        domToken,
        matchedToken: matched?.token,
        comparisonMode: 'token',
      } satisfies McpDiffItem;
    }

    // 값 비교 fallback
    if (px === 0) {
      return {
        category: side,
        status: 'skip',
        mcpCandidates: candidates,
        domValue: '0px',
        comparisonMode: 'value',
        note: 'DOM padding 0 · 토큰 없음 (비교 생략)',
      } satisfies McpDiffItem;
    }
    const matched = candidates.find((c) => parseFloat(c.value) === px);
    return {
      category: side,
      status: matched ? 'pass' : 'fail',
      mcpCandidates: candidates,
      domValue: `${px}px`,
      matchedToken: matched?.token,
      comparisonMode: 'value',
      note: 'DOM에 토큰 정보 없음 (px 값 비교)',
    } satisfies McpDiffItem;
  });
}

function compareRadius(variables: Record<string, string>, dom: DomMetric): McpDiffItem | null {
  const candidates = pickByPrefix(variables, 'radius/');
  if (candidates.length === 0) return null;

  const domToken = dom.numericTokens?.cornerRadius;
  const domPx = firstBorderRadiusPx(dom.borderRadius);

  if (domToken) {
    const matched = candidates.find((c) => c.cssVar === domToken);
    return {
      category: 'cornerRadius',
      status: matched ? 'pass' : 'fail',
      mcpCandidates: candidates,
      domValue: `${domPx}px`,
      domToken,
      matchedToken: matched?.token,
      comparisonMode: 'token',
    };
  }

  const matched = candidates.find((c) => parseFloat(c.value) === domPx);
  return {
    category: 'cornerRadius',
    status: matched ? 'pass' : 'fail',
    mcpCandidates: candidates,
    domValue: `${domPx}px`,
    matchedToken: matched?.token,
    comparisonMode: 'value',
    note: 'DOM에 토큰 정보 없음 (px 값 비교)',
  };
}

function compareBorderWidth(variables: Record<string, string>, dom: DomMetric): McpDiffItem | null {
  const candidates = pickByPrefix(variables, 'border/width/');
  if (candidates.length === 0) return null;

  // DOM borderWidth 토큰명은 --global-border-width-N (sys-tokens가 alias) → 토큰명이 달라 값 비교만
  const matched = candidates.find((c) => parseFloat(c.value) === dom.borderTopWidth);
  return {
    category: 'borderWidth',
    status: matched
      ? 'pass'
      : dom.borderTopWidth === 0
        ? 'skip'
        : 'fail',
    mcpCandidates: candidates,
    domValue: `${dom.borderTopWidth}px`,
    domToken: dom.numericTokens?.borderWidth,
    matchedToken: matched?.token,
    comparisonMode: 'value',
    note:
      dom.borderTopWidth === 0
        ? 'DOM 테두리 없음'
        : 'border 토큰명 체계 불일치(sys vs global) → 값 비교',
  };
}

function compareTypography(variables: Record<string, string>, dom: DomMetric): McpDiffItem[] {
  const items: McpDiffItem[] = [];

  // 1. typography composite — sys/typo/*
  const composites = pickByPrefix(variables, 'sys/typo/');
  if (composites.length > 0) {
    if (dom.typographyToken) {
      const matched = composites.find((c) => c.cssVar === dom.typographyToken);
      items.push({
        category: 'typography',
        status: matched ? 'pass' : 'fail',
        mcpCandidates: composites,
        domValue: dom.typographyToken,
        domToken: dom.typographyToken,
        matchedToken: matched?.token,
        comparisonMode: 'token',
      });
    } else {
      items.push({
        category: 'typography',
        status: 'skip',
        mcpCandidates: composites,
        domValue: '(typography utility class 없음)',
        comparisonMode: 'token',
        note: 'DOM className에 typography utility 없음',
      });
    }
  }

  // 2. fontSize — 값 비교
  const fontSizes = pickByPrefix(variables, 'font/size/');
  if (fontSizes.length > 0 && dom.fontSize != null) {
    const matched = fontSizes.find((c) => parseFloat(c.value) === dom.fontSize);
    items.push({
      category: 'fontSize',
      status: matched ? 'pass' : 'fail',
      mcpCandidates: fontSizes,
      domValue: `${dom.fontSize}px`,
      matchedToken: matched?.token,
      comparisonMode: 'value',
    });
  }

  // 3. fontWeight — 값 비교
  const fontWeights = pickByPrefix(variables, 'font/weight/');
  if (fontWeights.length > 0 && dom.fontWeight != null) {
    const matched = fontWeights.find((c) => parseFloat(c.value) === dom.fontWeight);
    items.push({
      category: 'fontWeight',
      status: matched ? 'pass' : 'fail',
      mcpCandidates: fontWeights,
      domValue: String(dom.fontWeight),
      matchedToken: matched?.token,
      comparisonMode: 'value',
    });
  }

  return items;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

export function compareMcp(mcp: McpNode, dom: DomMetric, figma?: NormalizedNode): McpDiffItem[] {
  if (!dom.found) {
    return [
      {
        category: '__missing__',
        status: 'fail',
        mcpCandidates: [],
        domValue: '(요소 없음)',
        comparisonMode: 'value',
        note: `data-qa-id 미발견 (figmaId=${mcp.figmaId})`,
      },
    ];
  }

  const items: McpDiffItem[] = [];

  items.push(
    compareColorCategory('background', mcp.variables, dom.backgroundColor, dom.tokens?.background)
  );
  items.push(compareColorCategory('textColor', mcp.variables, dom.color, dom.tokens?.textColor));
  items.push(
    compareColorCategory('borderColor', mcp.variables, dom.borderTopColor, dom.tokens?.borderColor)
  );
  items.push(compareColorCategory('iconColor', mcp.variables, dom.color, dom.tokens?.iconColor));

  const borderItem = compareBorderWidth(mcp.variables, dom);
  if (borderItem) items.push(borderItem);

  const radiusItem = compareRadius(mcp.variables, dom);
  if (radiusItem) items.push(radiusItem);

  items.push(...compareSpacing(mcp.variables, dom));
  items.push(...compareTypography(mcp.variables, dom));

  if (figma) {
    items.push(compareHeight(figma.height, dom));
    items.push(compareWidth(figma.width, dom, figma.text, dom.text));

    const lhItem = compareLineHeight(figma.typography.lineHeightPx, dom);
    if (lhItem) items.push(lhItem);

    const lsItem = compareLetterSpacing(figma.typography.letterSpacing, dom);
    if (lsItem) items.push(lsItem);
  }

  return items;
}

// ── 리포트 헬퍼 ───────────────────────────────────────────────────────────────

export function summarizeMcp(report: Record<string, McpDiffItem[]>): {
  pass: number;
  fail: number;
  warn: number;
  skip: number;
  total: number;
  failingNodes: number;
} {
  let pass = 0;
  let fail = 0;
  let warn = 0;
  let skip = 0;
  let failingNodes = 0;
  for (const items of Object.values(report)) {
    let nodeHasFail = false;
    for (const item of items) {
      if (item.status === 'pass') pass++;
      else if (item.status === 'fail') { fail++; nodeHasFail = true; }
      else if (item.status === 'warn') warn++;
      else skip++;
    }
    if (nodeHasFail) failingNodes++;
  }
  return { pass, fail, warn, skip, total: pass + fail + warn + skip, failingNodes };
}

export function printMcpFailures(report: Record<string, McpDiffItem[]>): void {
  for (const [qaId, items] of Object.entries(report)) {
    const issues = items.filter((i) => i.status === 'fail' || i.status === 'warn');
    if (issues.length === 0) continue;
    console.log(`\n${qaId}`);
    for (const item of issues) {
      const marker = item.status === 'fail' ? '❌' : '⚠️ ';
      if (item.mcpCandidates.length > 0) {
        const mcpStr = item.mcpCandidates.map((c) => `${c.token} (${c.cssVar})`).join(', ');
        const domStr = item.domToken ? `${item.domToken} [${item.domValue}]` : item.domValue;
        console.log(`  ${marker} ${item.category.padEnd(16)} [${item.comparisonMode}] dom=${domStr}`);
        console.log(`     mcp: ${mcpStr}`);
      } else {
        const deltaStr = item.delta !== undefined ? ` Δ=${item.delta}` : '';
        console.log(
          `  ${marker} ${item.category.padEnd(16)} [${item.comparisonMode}] figma=${item.figmaValue ?? '?'} dom=${item.domValue}${deltaStr}`
        );
      }
      if (item.note) console.log(`     note: ${item.note}`);
    }
  }
}
