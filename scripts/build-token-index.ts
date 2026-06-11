import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../tests/fixtures/token-index.json');
const SCHEMA_VERSION = 2;

const require = createRequire(import.meta.url);
const TOKENS_CSS_PATH = resolve(
  require.resolve('@gabia-inc/hiworks-ui-components/package.json'),
  '../tokens/tokens.css'
);
const TYPOGRAPHY_JSON_PATH = resolve(__dirname, '../tokens/typography_sys.json');
const GLOBAL_TOKENS_PATH = resolve(__dirname, '../tokens/global-tokens.json');

// 색상 카테고리 — property 컨텍스트로 필터링할 때 사용
type Category = 'bg' | 'text' | 'stroke' | 'icon' | 'overlay' | 'palette';

interface TokenEntry {
  name: string;        // '--office-bg-brand-strong-default'
  layer: 'office' | 'hr' | 'sys' | 'global';
  category: Category;
  raw: string;         // 원본 CSS 값
}

interface IndexValue {
  /** 매칭된 모든 토큰 (정렬: service > sys > global, 그리고 default > active > disabled > 기타) */
  tokens: string[];
  /** 카테고리별로 묶은 토큰 목록 */
  byCategory: Partial<Record<Category, string[]>>;
}

/** 수치 토큰 카테고리 */
type NumericCategory = 'spacing' | 'radius' | 'borderWidth';

interface NumericIndex {
  /** key: px 값 문자열 (예: "20"), value: 토큰명 (예: "--sys-spacing-xl") */
  spacing: Record<string, string>;
  radius: Record<string, string>;
  borderWidth: Record<string, string>;
}

interface TokenIndex {
  _schema: number;
  _generatedAt: string;
  _source: string;
  byHex: Record<string, IndexValue>;
  byPx: NumericIndex;
  /** key: "fontSize|fontWeight|lineHeight" (예: "14|400|21"), value: typo 토큰명 (예: "--sys-typo-body-md-regular") */
  byTypo: Record<string, string>;
}

const TOKEN_DECL_RE = /^\s*(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/;

function parseTokens(css: string): TokenEntry[] {
  const out: TokenEntry[] = [];
  for (const line of css.split('\n')) {
    const m = TOKEN_DECL_RE.exec(line);
    if (!m) continue;
    const name = m[1];
    const raw = m[2].trim();
    const layer = pickLayer(name);
    const category = pickCategory(name);
    if (!category) continue; // 색상 토큰이 아닌 값 (radius, spacing, shadow, size 등)은 인덱싱 안 함
    out.push({ name, layer, category, raw });
  }
  return out;
}

function pickLayer(name: string): TokenEntry['layer'] {
  if (name.startsWith('--office-')) return 'office';
  if (name.startsWith('--hr-')) return 'hr';
  if (name.startsWith('--sys-')) return 'sys';
  return 'global';
}

function pickCategory(name: string): Category | null {
  // 서비스/sys 레이어의 색상 토큰
  // 예: --office-bg-brand-strong-default → bg
  //     --sys-text-neutral-normal-default → text
  const m = name.match(/^--(?:office|hr|sys)-(bg|text|stroke|icon|overlay)-/);
  if (m) return m[1] as Category;

  // global palette: --global-color-*
  if (name.startsWith('--global-color-')) return 'palette';

  return null;
}

/** CSS 색상값을 #rrggbb 형태로 정규화. 알 수 없는 형식이면 null. */
function normalizeColor(raw: string): string | null {
  const v = raw.trim().toLowerCase();

  // #rgb / #rrggbb / #rrggbbaa
  if (v.startsWith('#')) {
    const hex = v.slice(1);
    if (/^[0-9a-f]{3}$/.test(hex)) {
      const [r, g, b] = hex.split('');
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    if (/^[0-9a-f]{6}$/.test(hex)) return `#${hex}`;
    if (/^[0-9a-f]{8}$/.test(hex)) return `#${hex.slice(0, 6)}`; // alpha 무시
    return null;
  }

  // rgb(R G B [/ A]) / rgb(R, G, B) / rgba(...) — alpha는 무시
  const rgbMatch = v.match(/^rgba?\(\s*([\d.%]+)[\s,]+([\d.%]+)[\s,]+([\d.%]+)(?:[\s,/]+[\d.%]+)?\s*\)$/);
  if (rgbMatch) {
    const r = parseChannel(rgbMatch[1]);
    const g = parseChannel(rgbMatch[2]);
    const b = parseChannel(rgbMatch[3]);
    if (r == null || g == null || b == null) return null;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return null;
}

function parseChannel(s: string): number | null {
  if (s.endsWith('%')) {
    const n = parseFloat(s);
    if (!Number.isFinite(n)) return null;
    return Math.round((n / 100) * 255);
  }
  const n = parseFloat(s);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

// 정렬: service(office/hr) > sys > global, 같은 레이어에선 default > active > disabled > 기타
function compareTokens(a: TokenEntry, b: TokenEntry): number {
  const layerOrder: Record<TokenEntry['layer'], number> = {
    office: 0,
    hr: 0,
    sys: 1,
    global: 2,
  };
  const stateRank = (n: string): number => {
    if (n.endsWith('-default')) return 0;
    if (n.endsWith('-active')) return 1;
    if (n.endsWith('-disabled')) return 2;
    return 3;
  };
  return layerOrder[a.layer] - layerOrder[b.layer] || stateRank(a.name) - stateRank(b.name);
}

function buildIndex(entries: TokenEntry[]): Record<string, IndexValue> {
  const map = new Map<string, TokenEntry[]>();
  for (const entry of entries) {
    const hex = normalizeColor(entry.raw);
    if (!hex) continue;
    const list = map.get(hex) ?? [];
    list.push(entry);
    map.set(hex, list);
  }

  const out: Record<string, IndexValue> = {};
  for (const [hex, list] of map.entries()) {
    const sorted = [...list].sort(compareTokens);
    const byCategory: Partial<Record<Category, string[]>> = {};
    for (const entry of sorted) {
      const arr = byCategory[entry.category] ?? [];
      arr.push(entry.name);
      byCategory[entry.category] = arr;
    }
    out[hex] = {
      tokens: sorted.map((e) => e.name),
      byCategory,
    };
  }
  return out;
}

// ── 수치 토큰 인덱싱 (spacing/radius/borderWidth) ─────────────────────────────

function parsePxValue(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '0px' || trimmed === '0') return 0;
  const m = trimmed.match(/^([\d.]+)px$/);
  return m ? parseFloat(m[1]) : null;
}

function buildNumericIndex(css: string): NumericIndex {
  const out: NumericIndex = { spacing: {}, radius: {}, borderWidth: {} };
  for (const line of css.split('\n')) {
    const m = TOKEN_DECL_RE.exec(line);
    if (!m) continue;
    const name = m[1];
    const raw = m[2].trim();
    let category: NumericCategory | null = null;
    if (/^--sys-spacing-/.test(name)) category = 'spacing';
    else if (/^--sys-radius-/.test(name)) category = 'radius';
    else if (/^--global-border-width-/.test(name)) category = 'borderWidth';
    if (!category) continue;

    const px = parsePxValue(raw);
    if (px == null) continue;
    const key = String(px);
    // 같은 px에 여러 토큰이 있을 수 있으나 사실상 unique (전수 확인). 첫 항목 유지.
    if (!(key in out[category])) {
      out[category][key] = name;
    }
  }
  return out;
}

// ── Typography 토큰 인덱싱 (typography_sys.json) ──────────────────────────────

interface GlobalFontTokens {
  size: Record<string, number>;
  weight: Record<string, number>;
}

function loadGlobalFontTokens(): GlobalFontTokens {
  const json = JSON.parse(readFileSync(GLOBAL_TOKENS_PATH, 'utf8')) as Record<string, unknown>;
  const global = json.global as Record<string, unknown>;
  const font = global.font as Record<string, Record<string, { $value: number | string }>>;
  const size: Record<string, number> = {};
  for (const [k, v] of Object.entries(font.size)) {
    size[k] = typeof v.$value === 'number' ? v.$value : parseFloat(String(v.$value));
  }
  const weight: Record<string, number> = {};
  for (const [k, v] of Object.entries(font.weight)) {
    weight[k] = typeof v.$value === 'number' ? v.$value : parseFloat(String(v.$value));
  }
  return { size, weight };
}

/** "{global.font.size.14}" → 14 */
function resolveAlias(value: string | number, tokens: GlobalFontTokens): number | null {
  if (typeof value === 'number') return value;
  const m = value.match(/^\{global\.font\.(size|weight)\.([^}]+)\}$/);
  if (m) {
    const group = m[1] === 'size' ? tokens.size : tokens.weight;
    const resolved = group[m[2]];
    return typeof resolved === 'number' ? resolved : null;
  }
  // raw 'XXpx' or 'XX%' or 'XX'
  if (value.endsWith('px')) return parseFloat(value);
  if (value.endsWith('%')) return parseFloat(value); // 백분율 그대로 (letterSpacing용)
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

interface TypoLeaf {
  $type: string;
  $value: {
    fontFamily: string;
    fontSize: string | number;
    fontWeight: string | number;
    lineHeight: string;
    letterSpacing: string;
  };
}

function buildTypoIndex(globalFonts: GlobalFontTokens): Record<string, string> {
  const json = JSON.parse(readFileSync(TYPOGRAPHY_JSON_PATH, 'utf8')) as Record<string, unknown>;
  const typoRoot = (json.sys as Record<string, unknown>).typo as Record<
    string,
    Record<string, Record<string, TypoLeaf>>
  >;

  const out: Record<string, string> = {};
  for (const [role, sizes] of Object.entries(typoRoot)) {
    for (const [size, weights] of Object.entries(sizes)) {
      for (const [weight, leaf] of Object.entries(weights)) {
        if (leaf.$type !== 'typography') continue;
        const fontSize = resolveAlias(leaf.$value.fontSize, globalFonts);
        const fontWeight = resolveAlias(leaf.$value.fontWeight, globalFonts);
        const lineHeight = resolveAlias(leaf.$value.lineHeight, globalFonts);
        if (fontSize == null || fontWeight == null || lineHeight == null) continue;
        const key = `${Math.round(fontSize)}|${Math.round(fontWeight)}|${Math.round(lineHeight)}`;
        const tokenName = `--sys-typo-${role}-${size}-${weight}`;
        if (out[key] && out[key] !== tokenName) {
          console.warn(
            `[build:token-index] typo 키 충돌 ${key}: ${out[key]} vs ${tokenName} (먼저 등록된 것 유지)`
          );
          continue;
        }
        out[key] = tokenName;
      }
    }
  }
  return out;
}

function main() {
  if (!existsSync(TOKENS_CSS_PATH)) {
    console.error(`[build:token-index] tokens.css 를 찾을 수 없습니다: ${TOKENS_CSS_PATH}`);
    process.exit(1);
  }
  if (!existsSync(TYPOGRAPHY_JSON_PATH)) {
    console.error(`[build:token-index] typography_sys.json 를 찾을 수 없습니다: ${TYPOGRAPHY_JSON_PATH}`);
    process.exit(1);
  }

  const css = readFileSync(TOKENS_CSS_PATH, 'utf8');
  const entries = parseTokens(css);
  console.log(`[build:token-index] ${entries.length}개 색상 토큰 발견`);

  const byHex = buildIndex(entries);
  console.log(`[build:token-index] ${Object.keys(byHex).length}개 고유 색상 → 토큰 매핑 생성`);

  const byPx = buildNumericIndex(css);
  console.log(
    `[build:token-index] 수치 토큰: spacing ${Object.keys(byPx.spacing).length}개, radius ${Object.keys(byPx.radius).length}개, borderWidth ${Object.keys(byPx.borderWidth).length}개`
  );

  const globalFonts = loadGlobalFontTokens();
  const byTypo = buildTypoIndex(globalFonts);
  console.log(`[build:token-index] typography 토큰 ${Object.keys(byTypo).length}개 (트리플 인덱스)`);

  const outDir = dirname(OUTPUT_PATH);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const payload: TokenIndex = {
    _schema: SCHEMA_VERSION,
    _generatedAt: new Date().toISOString(),
    _source: TOKENS_CSS_PATH.replace(resolve(__dirname, '..'), '<project>'),
    byHex,
    byPx,
    byTypo,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[build:token-index] 완료 → ${OUTPUT_PATH}`);
}

main();
