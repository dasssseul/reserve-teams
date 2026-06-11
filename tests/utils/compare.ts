import type { NormalizedNode, NormalizedColor } from '../../scripts/fetch-figma-metadata';
import type { DomMetric } from './dom-measure';
import { deltaE2000, formatRgba, isTransparent, parseCssColor, rgbaToLab } from './color';
import {
  resolveToken,
  resolveNumericToken,
  resolveTypographyToken,
  type NumericCategory,
} from './token-resolver';

export type DiffStatus = 'pass' | 'warn' | 'fail' | 'skip';
export type DiffChannel = 'strict' | 'warn-only';

export interface DiffItem {
  property: string;
  status: DiffStatus;
  channel: DiffChannel;
  figmaValue: string;
  domValue: string;
  delta?: number;
  note?: string;
}

interface ColorCompareOptions {
  channel?: DiffChannel;
  figmaToken?: string;
  domToken?: string;
}

const PX_TOLERANCE = 1;
const LETTER_SPACING_TOLERANCE = 0.1;
const DELTA_E_PASS = 2.0;
const DELTA_E_WARN = 5.0;

// ── 색상 비교 ─────────────────────────────────────────────────────────────────

function compareColor(
  property: string,
  figma: NormalizedColor | null,
  domStr: string,
  options: ColorCompareOptions = {}
): DiffItem {
  const channel = options.channel ?? 'strict';
  const figmaRgba = figma
    ? { r: figma.r, g: figma.g, b: figma.b, a: figma.a }
    : { r: 0, g: 0, b: 0, a: 0 };
  const domRgba = parseCssColor(domStr);

  const figmaTransparent = isTransparent(figmaRgba);
  const domTransparent = isTransparent(domRgba);

  if (figmaTransparent && domTransparent) {
    return {
      property,
      status: 'pass',
      channel,
      figmaValue: 'transparent',
      domValue: 'transparent',
    };
  }
  if (figmaTransparent !== domTransparent) {
    return {
      property,
      status: 'fail',
      channel,
      figmaValue: figmaTransparent ? 'transparent' : formatRgba(figmaRgba),
      domValue: domTransparent ? 'transparent' : formatRgba(domRgba),
      note: 'alpha 유무 불일치',
    };
  }

  // 1순위: 양쪽 토큰명이 모두 있으면 1:1 비교
  let figmaToken: string | undefined = options.figmaToken;
  let domToken: string | undefined = options.domToken;
  let figmaResolved = Boolean(figmaToken);
  let domResolved = Boolean(domToken);

  if (!figmaToken && !figmaTransparent) {
    const r = resolveTokenSafe({ r: figmaRgba.r, g: figmaRgba.g, b: figmaRgba.b }, property);
    if (r) figmaToken = r;
  }
  if (!domToken && !domTransparent) {
    const r = resolveTokenSafe({ r: domRgba.r, g: domRgba.g, b: domRgba.b }, property);
    if (r) domToken = r;
  }

  if (figmaToken && domToken) {
    const status: DiffStatus = figmaToken === domToken ? 'pass' : 'fail';
    const dE = deltaE2000(rgbaToLab(figmaRgba), rgbaToLab(domRgba));
    const notes: string[] = [];
    if (!figmaResolved) notes.push('figma 토큰: RGB 역매핑');
    if (!domResolved) notes.push('dom 토큰: RGB 역매핑');
    return {
      property,
      status,
      channel,
      figmaValue: figmaToken,
      domValue: domToken,
      delta: Number(dE.toFixed(2)),
      note: notes.length > 0 ? notes.join(', ') : undefined,
    };
  }

  // 2순위: 토큰명 확보 실패 → 기존 RGB ΔE 비교
  const dE = deltaE2000(rgbaToLab(figmaRgba), rgbaToLab(domRgba));
  const status: DiffStatus = dE < DELTA_E_PASS ? 'pass' : dE < DELTA_E_WARN ? 'warn' : 'fail';

  return {
    property,
    status,
    channel,
    figmaValue: formatRgba(figmaRgba),
    domValue: formatRgba(domRgba),
    delta: Number(dE.toFixed(2)),
  };
}

function resolveTokenSafe(rgb: { r: number; g: number; b: number }, property: string): string | null {
  try {
    return resolveToken(rgb, property).token;
  } catch {
    // token-index.json 이 없는 경우 등 — RGB fallback 으로 진행
    return null;
  }
}

// ── 수치 비교 ─────────────────────────────────────────────────────────────────

function compareNumeric(
  property: string,
  figma: number,
  dom: number,
  options: {
    tolerance: number;
    channel: DiffChannel;
    unit?: string;
    figmaToken?: string;
    domToken?: string;
    category?: NumericCategory;
  }
): DiffItem {
  const unit = options.unit ?? 'px';
  const diff = dom - figma;
  const within = Math.abs(diff) <= options.tolerance;

  // 1순위: 양쪽 토큰 모두 있으면 토큰명 비교
  let figmaToken = options.figmaToken;
  let domToken = options.domToken;

  // 2순위: category 힌트 있으면 px → 토큰 역매핑 시도
  if (options.category) {
    if (!figmaToken) {
      const t = resolveNumericTokenSafe(figma, options.category);
      if (t) figmaToken = t;
    }
    if (!domToken) {
      const t = resolveNumericTokenSafe(dom, options.category);
      if (t) domToken = t;
    }
  }

  if (figmaToken && domToken) {
    const status: DiffStatus = figmaToken === domToken
      ? 'pass'
      : options.channel === 'warn-only' ? 'warn' : 'fail';
    return {
      property,
      status,
      channel: options.channel,
      figmaValue: figmaToken,
      domValue: domToken,
      delta: Number(diff.toFixed(3)),
    };
  }

  // 3순위: 기존 px 비교
  const status: DiffStatus = within ? 'pass' : options.channel === 'warn-only' ? 'warn' : 'fail';
  return {
    property,
    status,
    channel: options.channel,
    figmaValue: `${figma}${unit}`,
    domValue: `${dom}${unit}`,
    delta: Number(diff.toFixed(3)),
  };
}

function resolveNumericTokenSafe(px: number, category: NumericCategory): string | null {
  try {
    return resolveNumericToken(px, category);
  } catch {
    return null;
  }
}

function resolveTypographyTokenSafe(triple: {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}): string | null {
  try {
    return resolveTypographyToken(triple);
  } catch {
    return null;
  }
}

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function isIconOnly(figma: NormalizedNode): boolean {
  return figma.textColor === null;
}

function firstBorderRadiusPx(borderRadius: string): number {
  const first = borderRadius.trim().split(/\s+/)[0];
  return parseFloat(first) || 0;
}

function parseLineHeightPx(lineHeight: string, fontSize: number | null): number | null {
  if (!lineHeight || lineHeight === 'normal') return null;
  const px = parseFloat(lineHeight);
  if (!Number.isFinite(px)) return null;
  // 'normal'이 아니지만 단위 없는 multiplier는 fontSize × multiplier
  if (lineHeight.endsWith('px')) return px;
  if (fontSize != null && !lineHeight.endsWith('px')) return px * fontSize;
  return px;
}

function parseLetterSpacingPx(letterSpacing: string): number | null {
  if (!letterSpacing || letterSpacing === 'normal') return 0;
  const px = parseFloat(letterSpacing);
  return Number.isFinite(px) ? px : null;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

export function compareSpec(figma: NormalizedNode, dom: DomMetric): DiffItem[] {
  if (!dom.found) {
    return [
      {
        property: '__missing__',
        status: 'fail',
        channel: 'strict',
        figmaValue: `${figma.figmaId}`,
        domValue: '(요소 없음)',
        note: `[data-qa-id="${figma.qaId}"] 미발견`,
      },
    ];
  }

  const items: DiffItem[] = [];
  const iconOnly = isIconOnly(figma);
  const isModalSurface = figma.qaId.startsWith('modal-');

  // 1. 높이 — strict ±1px (Modal은 Hug Contents라 콘텐츠에 따라 가변 → skip)
  if (isModalSurface) {
    items.push({
      property: 'height',
      status: 'skip',
      channel: 'strict',
      figmaValue: `${figma.height}px`,
      domValue: `${dom.height}px`,
      note: 'Modal Surface: Hug Contents — 본문 콘텐츠 부피에 따라 가변',
    });
  } else {
    items.push(
      compareNumeric('height', figma.height, dom.height, {
        tolerance: PX_TOLERANCE,
        channel: 'strict',
      })
    );
  }

  // 2. 너비 — IconOnly strict, Button warn-only
  items.push(
    compareNumeric('width', figma.width, dom.width, {
      tolerance: PX_TOLERANCE,
      channel: iconOnly ? 'strict' : 'warn-only',
    })
  );

  // 3. 배경색 — strict ΔE<2
  items.push(
    compareColor('background', figma.background, dom.backgroundColor, {
      figmaToken: figma.tokens?.background,
      domToken: dom.tokens?.background,
    })
  );

  // 4. 텍스트/아이콘 색
  if (iconOnly) {
    // IconOnly: button.color가 아이콘 currentColor의 진실
    items.push(
      compareColor('iconColor', figma.iconColor, dom.color, {
        figmaToken: figma.tokens?.iconColor,
        domToken: dom.tokens?.iconColor,
      })
    );
  } else {
    items.push(
      compareColor('textColor', figma.textColor, dom.color, {
        figmaToken: figma.tokens?.textColor,
        domToken: dom.tokens?.textColor,
      })
    );
  }

  // 5. 테두리 — 조건부
  const figmaHasBorder = figma.borderWidth > 0 && figma.borderColor !== null;
  const domHasBorder = dom.borderTopWidth > 0;
  if (!figmaHasBorder && !domHasBorder) {
    items.push({
      property: 'border',
      status: 'skip',
      channel: 'strict',
      figmaValue: 'none',
      domValue: 'none',
      note: '양쪽 모두 테두리 없음',
    });
  } else if (figmaHasBorder !== domHasBorder) {
    items.push({
      property: 'border',
      status: 'fail',
      channel: 'strict',
      figmaValue: figmaHasBorder ? `${figma.borderWidth}px` : 'none',
      domValue: domHasBorder ? `${dom.borderTopWidth}px` : 'none',
      note: '테두리 유무 불일치',
    });
  } else {
    items.push(
      compareNumeric('borderWidth', figma.borderWidth, dom.borderTopWidth, {
        tolerance: 0,
        channel: 'strict',
        domToken: dom.numericTokens?.borderWidth,
        category: 'borderWidth',
      })
    );
    items.push(
      compareColor('borderColor', figma.borderColor, dom.borderTopColor, {
        figmaToken: figma.tokens?.borderColor,
        domToken: dom.tokens?.borderColor,
      })
    );
  }

  // 6. 모서리 둥글기 — strict exact
  items.push(
    compareNumeric('cornerRadius', figma.cornerRadius, firstBorderRadiusPx(dom.borderRadius), {
      tolerance: 0,
      channel: 'strict',
      domToken: dom.numericTokens?.cornerRadius,
      category: 'radius',
    })
  );

  // 7. padding — 조건부 strict exact (4방향 모두)
  if (figma.padding === null) {
    items.push({
      property: 'padding',
      status: 'skip',
      channel: 'strict',
      figmaValue: 'n/a',
      domValue: `${dom.padding.top}/${dom.padding.right}/${dom.padding.bottom}/${dom.padding.left}`,
      note: 'Figma auto-layout padding 메타 없음',
    });
  } else {
    items.push(
      compareNumeric('paddingTop', figma.padding.top, dom.padding.top, {
        tolerance: 0,
        channel: 'strict',
        domToken: dom.numericTokens?.paddingTop,
        category: 'spacing',
      })
    );
    items.push(
      compareNumeric('paddingRight', figma.padding.right, dom.padding.right, {
        tolerance: 0,
        channel: 'strict',
        domToken: dom.numericTokens?.paddingRight,
        category: 'spacing',
      })
    );
    items.push(
      compareNumeric('paddingBottom', figma.padding.bottom, dom.padding.bottom, {
        tolerance: 0,
        channel: 'strict',
        domToken: dom.numericTokens?.paddingBottom,
        category: 'spacing',
      })
    );
    items.push(
      compareNumeric('paddingLeft', figma.padding.left, dom.padding.left, {
        tolerance: 0,
        channel: 'strict',
        domToken: dom.numericTokens?.paddingLeft,
        category: 'spacing',
      })
    );
  }

  // 8. Typography — Button(label 있음)만, IconOnly는 skip
  if (iconOnly) {
    items.push({
      property: 'typography',
      status: 'skip',
      channel: 'strict',
      figmaValue: 'n/a',
      domValue: 'n/a',
      note: 'IconOnly: 텍스트 없음',
    });
  } else {
    items.push(...compareTypography(figma, dom));
  }

  return items;
}

/**
 * Typography 비교:
 *  - 양쪽 모두 typo 토큰 매칭 시 → 단일 'typography' 행 (raw 값은 note에 부연)
 *  - 매칭 실패 시 → 기존 4개 행 (fontSize/fontWeight/lineHeight/letterSpacing)
 */
function compareTypography(figma: NormalizedNode, dom: DomMetric): DiffItem[] {
  const typo = figma.typography;
  const domLineHeightPx = parseLineHeightPx(dom.lineHeight, dom.fontSize);

  // typo 토큰 매칭 시도
  const figmaToken =
    typo.fontSize != null && typo.fontWeight != null && typo.lineHeightPx != null
      ? resolveTypographyTokenSafe({
          fontSize: typo.fontSize,
          fontWeight: typo.fontWeight,
          lineHeight: typo.lineHeightPx,
        })
      : null;
  const domToken =
    dom.typographyToken ??
    (dom.fontSize != null && dom.fontWeight != null && domLineHeightPx != null
      ? resolveTypographyTokenSafe({
          fontSize: dom.fontSize,
          fontWeight: dom.fontWeight,
          lineHeight: domLineHeightPx,
        })
      : null);

  if (figmaToken && domToken) {
    const same = figmaToken === domToken;
    const note =
      `fontSize=${typo.fontSize ?? '?'}/${dom.fontSize ?? '?'} ` +
      `fontWeight=${typo.fontWeight ?? '?'}/${dom.fontWeight ?? '?'} ` +
      `lineHeight=${typo.lineHeightPx ?? '?'}px/${domLineHeightPx ?? '?'}px`;
    return [
      {
        property: 'typography',
        status: same ? 'pass' : 'fail',
        channel: 'strict',
        figmaValue: figmaToken,
        domValue: domToken,
        note,
      },
    ];
  }

  // fallback: 기존 4행 비교
  const items: DiffItem[] = [];

  if (typo.fontSize != null && dom.fontSize != null) {
    items.push(
      compareNumeric('fontSize', typo.fontSize, dom.fontSize, {
        tolerance: 0,
        channel: 'strict',
      })
    );
  }

  if (typo.fontWeight != null && dom.fontWeight != null) {
    items.push(
      compareNumeric('fontWeight', typo.fontWeight, dom.fontWeight, {
        tolerance: 0,
        channel: 'strict',
        unit: '',
      })
    );
  }

  if (typo.lineHeightPx != null && domLineHeightPx != null) {
    items.push(
      compareNumeric('lineHeight', typo.lineHeightPx, domLineHeightPx, {
        tolerance: 0,
        channel: 'warn-only',
      })
    );
  } else {
    items.push({
      property: 'lineHeight',
      status: 'skip',
      channel: 'strict',
      figmaValue: typo.lineHeightPx != null ? `${typo.lineHeightPx}px` : 'n/a',
      domValue: dom.lineHeight || 'n/a',
      note: 'lineHeight 비교 불가 (normal 또는 미정의)',
    });
  }

  const domLetterSpacingPx = parseLetterSpacingPx(dom.letterSpacing);
  const figmaLetterSpacing = typo.letterSpacing ?? 0;
  if (domLetterSpacingPx != null) {
    items.push(
      compareNumeric('letterSpacing', figmaLetterSpacing, domLetterSpacingPx, {
        tolerance: LETTER_SPACING_TOLERANCE,
        channel: 'warn-only',
      })
    );
  }

  return items;
}

// ── 리포트 헬퍼 ───────────────────────────────────────────────────────────────

export function collectStrictFails(report: Record<string, DiffItem[]>): Array<{
  qaId: string;
  item: DiffItem;
}> {
  const fails: Array<{ qaId: string; item: DiffItem }> = [];
  for (const [qaId, items] of Object.entries(report)) {
    for (const item of items) {
      if (item.channel === 'strict' && item.status === 'fail') {
        fails.push({ qaId, item });
      }
    }
  }
  return fails;
}

export function formatItem(item: DiffItem): string {
  const marker =
    item.status === 'pass'
      ? '✅'
      : item.status === 'warn'
        ? '⚠️ '
        : item.status === 'fail'
          ? '❌'
          : '⏭ ';
  const channel = item.channel === 'warn-only' ? ' [warn-only]' : '';
  const delta =
    item.delta !== undefined
      ? item.property.toLowerCase().includes('color')
        ? ` ΔE=${item.delta}`
        : ` (Δ=${item.delta})`
      : '';
  const note = item.note ? ` · ${item.note}` : '';
  return `  ${marker} ${item.property.padEnd(14)} ${item.figmaValue} vs ${item.domValue}${delta}${channel}${note}`;
}

export function printConsoleTable(report: Record<string, DiffItem[]>): void {
  for (const [qaId, items] of Object.entries(report)) {
    const hasIssue = items.some((i) => i.status === 'fail' || i.status === 'warn');
    if (!hasIssue) continue; // 모두 pass인 항목은 콘솔에 출력 생략
    console.log(`\n${qaId}`);
    for (const item of items) {
      if (item.status === 'pass' || item.status === 'skip') continue;
      console.log(formatItem(item));
    }
  }
}
