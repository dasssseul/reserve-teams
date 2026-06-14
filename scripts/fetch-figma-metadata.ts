import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILE_KEY, FIGMA_QA_MAP, LIBRARY_FILE_KEYS } from '../tests/figma-qa-map';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../tests/fixtures/figma-metadata.json');
const CHUNK_SIZE = 50;
const SCHEMA_VERSION = 2;

const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) {
  console.error('[fetch:figma] FIGMA_TOKEN 환경변수가 설정되지 않았습니다.');
  console.error('  Personal Access Token 발급: https://www.figma.com/developers/api#access-tokens');
  console.error('  실행 예시: FIGMA_TOKEN=figd_xxxx pnpm fetch:figma');
  process.exit(1);
}

// ── Figma raw 타입 (필요 필드만) ───────────────────────────────────────────────

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaVariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string; // 'VariableID:xxx'
}

interface FigmaPaint {
  type: string;
  visible?: boolean;
  opacity?: number;
  color?: RgbaColor;
  boundVariables?: {
    color?: FigmaVariableAlias;
  };
}

interface FigmaTypeStyle {
  fontSize?: number;
  fontWeight?: number;
  lineHeightPx?: number;
  letterSpacing?: number;
}

interface FigmaNode {
  id: string;
  name?: string;
  type: string;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  style?: FigmaTypeStyle;
  children?: FigmaNode[];
  characters?: string; // TEXT 노드의 텍스트 내용
}

// ── 정규화 타입 (캐시에 저장) ─────────────────────────────────────────────────

export interface NormalizedColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

export interface NormalizedTokens {
  background?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
}

export interface NormalizedNode {
  qaId: string;
  figmaId: string;
  width: number;
  height: number;
  background: NormalizedColor | null;
  borderColor: NormalizedColor | null;
  borderWidth: number;
  cornerRadius: number;
  padding: { top: number; right: number; bottom: number; left: number } | null;
  textColor: NormalizedColor | null;
  iconColor: NormalizedColor | null;
  typography: {
    fontSize: number | null;
    fontWeight: number | null;
    lineHeightPx: number | null;
    letterSpacing: number | null;
  };
  hasPaddingMeta: boolean;
  /** Figma boundVariables → CSS 변수명 (--office-bg-brand-strong-default 형태). 매칭 안 되면 필드 없음 */
  tokens?: NormalizedTokens;
  /** 최상위 TEXT 자식 노드의 characters. 텍스트 없는 컴포넌트(icon-only 등)는 undefined */
  text?: string;
}

// ── 정규화 로직 (계획서 §1, §2, §4) ───────────────────────────────────────────

function pickSolidPaint(paints: FigmaPaint[] | undefined): FigmaPaint | null {
  if (!paints || paints.length === 0) return null;
  return paints.find((p) => p.type === 'SOLID' && p.visible !== false && p.color) ?? null;
}

function normalizePaint(paints: FigmaPaint[] | undefined): NormalizedColor | null {
  const solid = pickSolidPaint(paints);
  if (!solid || !solid.color) return null;
  const opacity = solid.opacity ?? 1;
  const a = solid.color.a * opacity;
  return {
    r: Math.round(solid.color.r * 255),
    g: Math.round(solid.color.g * 255),
    b: Math.round(solid.color.b * 255),
    a,
  };
}

function paintVariableId(paints: FigmaPaint[] | undefined): string | null {
  const solid = pickSolidPaint(paints);
  return solid?.boundVariables?.color?.id ?? null;
}

function pickCornerRadius(node: FigmaNode): number {
  if (typeof node.cornerRadius === 'number') return node.cornerRadius;
  if (node.rectangleCornerRadii) return node.rectangleCornerRadii[0];
  return 0;
}

function findFirst(node: FigmaNode, predicate: (n: FigmaNode) => boolean): FigmaNode | null {
  if (predicate(node)) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const hit = findFirst(child, predicate);
    if (hit) return hit;
  }
  return null;
}

function extractTextColor(node: FigmaNode): NormalizedColor | null {
  const textNode = findFirst(node, (n) => n.type === 'TEXT');
  if (!textNode) return null;
  return normalizePaint(textNode.fills);
}

function extractIconColor(node: FigmaNode): NormalizedColor | null {
  // VECTOR 우선, 없으면 INSTANCE/COMPONENT 내부 vector-like 노드의 첫 SOLID fill
  const vector = findFirst(node, (n) => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
  if (vector) {
    const color = normalizePaint(vector.fills);
    if (color) return color;
  }
  // fallback: 자식 중 fills가 있는 첫 노드
  const fillsHolder = findFirst(node, (n) => n.id !== node.id && Boolean(normalizePaint(n.fills)));
  return fillsHolder ? normalizePaint(fillsHolder.fills) : null;
}

function extractTypography(node: FigmaNode): NormalizedNode['typography'] {
  const textNode = findFirst(node, (n) => n.type === 'TEXT');
  const style = textNode?.style;
  return {
    fontSize: style?.fontSize ?? null,
    fontWeight: style?.fontWeight ?? null,
    lineHeightPx: style?.lineHeightPx ?? null,
    letterSpacing: style?.letterSpacing ?? null,
  };
}

function extractText(node: FigmaNode): string | undefined {
  const textNode = findFirst(node, (n) => n.type === 'TEXT' && Boolean(n.characters));
  return textNode?.characters ?? undefined;
}

function collectVariableIds(node: FigmaNode, into: Set<string>): void {
  const fillId = paintVariableId(node.fills);
  if (fillId) into.add(fillId);
  const strokeId = paintVariableId(node.strokes);
  if (strokeId) into.add(strokeId);
  if (node.children) {
    for (const child of node.children) collectVariableIds(child, into);
  }
}

function extractTokens(node: FigmaNode, varNames: Map<string, string>): NormalizedTokens | undefined {
  const out: NormalizedTokens = {};

  const bgId = paintVariableId(node.fills);
  if (bgId && varNames.has(bgId)) out.background = varNames.get(bgId)!;

  const strokeId = paintVariableId(node.strokes);
  if (strokeId && varNames.has(strokeId)) out.borderColor = varNames.get(strokeId)!;

  const textNode = findFirst(node, (n) => n.type === 'TEXT');
  if (textNode) {
    const textId = paintVariableId(textNode.fills);
    if (textId && varNames.has(textId)) out.textColor = varNames.get(textId)!;
  }

  // 아이콘 색상: VECTOR 노드의 fill에 bind된 variable. 없으면 부모 색상이 currentColor로 전파되는 케이스
  const vector = findFirst(node, (n) => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
  if (vector) {
    const iconId = paintVariableId(vector.fills);
    if (iconId && varNames.has(iconId)) out.iconColor = varNames.get(iconId)!;
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

function normalizeNode(
  qaId: string,
  figmaId: string,
  node: FigmaNode,
  varNames: Map<string, string>
): NormalizedNode {
  const bbox = node.absoluteBoundingBox;
  const hasPaddingMeta =
    typeof node.paddingLeft === 'number' ||
    typeof node.paddingRight === 'number' ||
    typeof node.paddingTop === 'number' ||
    typeof node.paddingBottom === 'number';

  const isText = node.type === 'TEXT' || Boolean(findFirst(node, (n) => n.type === 'TEXT'));

  return {
    qaId,
    figmaId,
    width: bbox?.width ?? 0,
    height: bbox?.height ?? 0,
    background: normalizePaint(node.fills),
    borderColor: normalizePaint(node.strokes),
    borderWidth: node.strokeWeight ?? 0,
    cornerRadius: pickCornerRadius(node),
    padding: hasPaddingMeta
      ? {
          top: node.paddingTop ?? 0,
          right: node.paddingRight ?? 0,
          bottom: node.paddingBottom ?? 0,
          left: node.paddingLeft ?? 0,
        }
      : null,
    textColor: isText ? extractTextColor(node) : null,
    iconColor: extractIconColor(node),
    typography: extractTypography(node),
    hasPaddingMeta,
    tokens: extractTokens(node, varNames),
    text: extractText(node),
  };
}

// ── Figma API ─────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNode } | null>;
}

async function fetchNodes(ids: string[]): Promise<Record<string, FigmaNode>> {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${ids.join(',')}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN! } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Figma API ${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as FigmaNodesResponse;
  const out: Record<string, FigmaNode> = {};
  for (const [id, entry] of Object.entries(json.nodes)) {
    if (entry?.document) out[id] = entry.document;
  }
  return out;
}

// ── variables/local: Figma 파일에 등록된 variable ID → 이름 매핑 ────────────────

interface FigmaVariablesLocalResponse {
  meta?: {
    variables?: Record<string, { id: string; name: string; resolvedType: string }>;
  };
}

/**
 * Figma variable 이름을 CSS 변수명으로 변환.
 * 변환 규칙(Figma DS v3 컨벤션):
 *   "service/office/bg/brand/strong/default" → "--office-bg-brand-strong-default"
 *   "sys/text/neutral/inverse/default"       → "--sys-text-neutral-inverse-default"
 *   "office/bg/brand/strong/default"         → "--office-bg-brand-strong-default" (앞단 service 생략)
 *   "Office / Bg / Brand / Strong / Default" → "--office-bg-brand-strong-default" (공백/대문자 허용)
 */
export function figmaVarNameToCssVar(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/^service\//, '');
  const dashed = cleaned.replace(/\//g, '-');
  return `--${dashed}`;
}

async function fetchVariableNamesFor(fileKey: string): Promise<Map<string, string>> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN! } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 403) {
      console.warn(
        `[fetch:figma] [${fileKey}] variables/local API 권한 없음 (403). Enterprise 플랜이 필요합니다.`
      );
    } else {
      console.warn(
        `[fetch:figma] [${fileKey}] variables/local 호출 실패 ${res.status} ${res.statusText}: ${body.slice(0, 200)}`
      );
    }
    return new Map();
  }
  const json = (await res.json()) as FigmaVariablesLocalResponse;
  const map = new Map<string, string>();
  const variables = json.meta?.variables ?? {};
  for (const [id, v] of Object.entries(variables)) {
    map.set(id, figmaVarNameToCssVar(v.name));
  }
  return map;
}

/**
 * 컴포넌트 파일 + 라이브러리 파일의 variable 정의를 모두 수집해서 머지.
 * ID 충돌 시 먼저 등록된 쪽이 이김 (컴포넌트 파일 → 라이브러리 순).
 */
async function fetchVariableNames(): Promise<Map<string, string>> {
  const allKeys = [FILE_KEY, ...LIBRARY_FILE_KEYS];
  console.log(`[fetch:figma] variable 정의 수집 (${allKeys.length}개 파일):`);
  const merged = new Map<string, string>();
  for (const key of allKeys) {
    const partial = await fetchVariableNamesFor(key);
    console.log(`  └ ${key}: ${partial.size}개`);
    for (const [id, name] of partial) {
      if (!merged.has(id)) merged.set(id, name);
    }
  }
  if (merged.size === 0) {
    console.warn(`[fetch:figma] 수집된 variable 0개 → 토큰명 매칭 생략, RGB fallback 사용.`);
  } else {
    console.log(`[fetch:figma] 머지 후 총 ${merged.size}개`);
  }
  return merged;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const allEntries = Object.entries(FIGMA_QA_MAP);
  const todoEntries = allEntries.filter(([, figmaId]) => !figmaId);
  const entries = allEntries.filter(([, figmaId]) => Boolean(figmaId));

  if (todoEntries.length > 0) {
    console.warn(
      `[fetch:figma] figmaId 미확정 ${todoEntries.length}건 skip (TODO 항목): ${todoEntries.map(([q]) => q).join(', ')}`
    );
  }
  console.log(`[fetch:figma] ${entries.length}개 노드 수집 시작 (chunk size ${CHUNK_SIZE})`);

  // 1차: variable ID → 이름 매핑 (Enterprise 권한 없으면 비어있는 Map)
  const varNames = await fetchVariableNames();

  const chunks = chunk(entries, CHUNK_SIZE);
  const data: Record<string, NormalizedNode> = {};
  const missing: string[] = [];
  const noPadding: string[] = [];
  const allRawNodes: Array<{ qaId: string; figmaId: string; node: FigmaNode }> = [];

  for (let i = 0; i < chunks.length; i++) {
    const ids = chunks[i].map(([, figmaId]) => figmaId);
    console.log(`  [${i + 1}/${chunks.length}] ${ids.length}개 요청`);
    const nodeMap = await fetchNodes(ids);

    for (const [qaId, figmaId] of chunks[i]) {
      const node = nodeMap[figmaId];
      if (!node) {
        missing.push(`${qaId} (${figmaId})`);
        continue;
      }
      allRawNodes.push({ qaId, figmaId, node });
    }
  }

  // 2차: 모든 노드의 boundVariables에서 ID 수집 (variables/local 응답에 없는 ID 있으면 추가 조회)
  const usedVarIds = new Set<string>();
  for (const { node } of allRawNodes) collectVariableIds(node, usedVarIds);
  const unknownIds = Array.from(usedVarIds).filter((id) => !varNames.has(id));
  if (unknownIds.length > 0 && varNames.size > 0) {
    console.warn(
      `[fetch:figma] variable ID 매칭 실패 ${unknownIds.length}건 — LIBRARY_FILE_KEYS에 누락된 라이브러리가 있을 수 있습니다.`
    );
    console.warn(`  샘플 ID(최대 5개): ${unknownIds.slice(0, 5).join(', ')}`);
  } else if (varNames.size > 0) {
    console.log(`[fetch:figma] 모든 variable ID 매칭 성공 ✓`);
  }

  for (const { qaId, figmaId, node } of allRawNodes) {
    const normalized = normalizeNode(qaId, figmaId, node, varNames);
    if (!normalized.hasPaddingMeta) noPadding.push(qaId);
    data[qaId] = normalized;
  }

  if (missing.length > 0) {
    console.warn(`[fetch:figma] 응답 누락 ${missing.length}건: ${missing.join(', ')}`);
  }
  if (noPadding.length > 0) {
    console.warn(
      `[fetch:figma] auto-layout padding 메타 없는 노드 ${noPadding.length}건 (padding 비교 skip 예정): ${noPadding.slice(0, 5).join(', ')}${noPadding.length > 5 ? '...' : ''}`
    );
  }

  const outDir = dirname(OUTPUT_PATH);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const payload = {
    _version: SCHEMA_VERSION,
    _generatedAt: new Date().toISOString(),
    _fileKey: FILE_KEY,
    data,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[fetch:figma] 완료 → ${OUTPUT_PATH} (${Object.keys(data).length}개)`);
}

main().catch((err) => {
  console.error('[fetch:figma] 실패:', err);
  process.exit(1);
});
