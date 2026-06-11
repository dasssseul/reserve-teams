import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type TokenCategory = 'bg' | 'text' | 'stroke' | 'icon' | 'overlay' | 'palette';
export type NumericCategory = 'spacing' | 'radius' | 'borderWidth';

export interface TokenIndexValue {
  tokens: string[];
  byCategory: Partial<Record<TokenCategory, string[]>>;
}

export interface TokenIndex {
  _schema: number;
  _generatedAt: string;
  _source: string;
  byHex: Record<string, TokenIndexValue>;
  byPx?: Record<NumericCategory, Record<string, string>>;
  byTypo?: Record<string, string>;
}

let cached: TokenIndex | null = null;

function defaultIndexPath(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return resolve(__dirname, '../fixtures/token-index.json');
}

export function loadTokenIndex(path: string = defaultIndexPath()): TokenIndex {
  if (cached) return cached;
  if (!existsSync(path)) {
    throw new Error(
      `token-index.json 이 없습니다 (${path}). 먼저 pnpm build:token-index 를 실행하세요.`
    );
  }
  cached = JSON.parse(readFileSync(path, 'utf8')) as TokenIndex;
  return cached;
}

/** 테스트/디버그용 캐시 리셋 */
export function _resetTokenIndexCache(): void {
  cached = null;
}

const PROPERTY_TO_CATEGORY: Record<string, TokenCategory> = {
  background: 'bg',
  backgroundColor: 'bg',
  textColor: 'text',
  color: 'text',
  iconColor: 'icon',
  borderColor: 'stroke',
  borderTopColor: 'stroke',
  outlineColor: 'stroke',
};

export function propertyToCategory(property: string): TokenCategory | null {
  return PROPERTY_TO_CATEGORY[property] ?? null;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * RGB → 토큰명 역매핑. property 카테고리가 있으면 같은 카테고리 토큰만,
 * 없으면 전체 매칭의 첫 토큰을 반환.
 *
 * 반환값:
 *   { token: string, alternatives: string[] }
 *   - token: 가장 적합한 단일 토큰명 (없으면 null)
 *   - alternatives: 같은 카테고리 내 다른 후보들 (디버그/note용)
 */
export function resolveToken(
  rgb: Rgb,
  property: string,
  index: TokenIndex = loadTokenIndex()
): { token: string | null; alternatives: string[] } {
  const hex = rgbToHex(rgb);
  const entry = index.byHex[hex];
  if (!entry) return { token: null, alternatives: [] };

  const category = propertyToCategory(property);
  if (category) {
    const candidates = entry.byCategory[category] ?? [];
    if (candidates.length > 0) {
      return {
        token: candidates[0],
        alternatives: candidates.slice(1),
      };
    }
    return { token: null, alternatives: [] };
  }

  // 카테고리 미지정: 우선순위 정렬된 전체 목록의 첫 항목
  return {
    token: entry.tokens[0] ?? null,
    alternatives: entry.tokens.slice(1),
  };
}

/** 토큰명으로 hex 색상값을 역조회 (UI에서 swatch 표시 시 사용) */
export function tokenToHex(token: string, index: TokenIndex = loadTokenIndex()): string | null {
  for (const [hex, value] of Object.entries(index.byHex)) {
    if (value.tokens.includes(token)) return hex;
  }
  return null;
}

/**
 * px 값 → 수치 토큰명 역매핑.
 * 같은 카테고리 안에선 px 값이 unique 하므로 모호성 없음.
 */
export function resolveNumericToken(
  px: number,
  category: NumericCategory,
  index: TokenIndex = loadTokenIndex()
): string | null {
  const map = index.byPx?.[category];
  if (!map) return null;
  // 소수점 1자리 이내 반올림으로 매칭 (DOM rect는 소수점 가능)
  const rounded = Math.round(px);
  if (Math.abs(px - rounded) > 0.5) return null;
  return map[String(rounded)] ?? null;
}

/**
 * (fontSize, fontWeight, lineHeight) 트리플 → typography 토큰명.
 * 정수 px로 반올림 후 매칭. 매칭 안 되면 null.
 */
export function resolveTypographyToken(
  triple: { fontSize: number; fontWeight: number; lineHeight: number },
  index: TokenIndex = loadTokenIndex()
): string | null {
  const map = index.byTypo;
  if (!map) return null;
  const key = `${Math.round(triple.fontSize)}|${Math.round(triple.fontWeight)}|${Math.round(triple.lineHeight)}`;
  return map[key] ?? null;
}
