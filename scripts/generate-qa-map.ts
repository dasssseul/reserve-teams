/**
 * Figma Component Set variant를 파싱해 qa-id → node-id 매핑을 자동 생성합니다.
 * 출력: tests/figma-qa-map.auto.ts
 *
 * 실행: pnpm generate:qa-map
 * 필요 환경변수: FIGMA_TOKEN (Personal Access Token)
 */

import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILE_KEY } from '../tests/figma-qa-map';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../tests/figma-qa-map.auto.ts');

const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) {
  console.error(
    '[generate:qa-map] FIGMA_TOKEN 환경변수가 설정되지 않았습니다.',
  );
  process.exit(1);
}

// ── 타입 ──────────────────────────────────────────────────────────────────────

interface FigmaChild {
  id: string;
  name: string;
  type: string;
}

interface FigmaNodesResponse {
  nodes: Record<string, { document: { children?: FigmaChild[] } } | null>;
}

// qaId가 string일 수도, string[]일 수도 있음 (SectionHeader의 expanded/collapsed)
type QaIdResult = string | string[] | null;

interface ComponentSetConfig {
  /** 출력 파일 섹션 주석 */
  comment: string;
  /** Figma Component Set node-id */
  nodeId: string;
  /** 포함할 variant 조건 */
  filter: (props: Record<string, string>) => boolean;
  /**
   * Figma variant props → qaId 변환.
   * null 반환 시 건너뜀.
   * string[] 반환 시 동일 node-id에 여러 qaId 매핑 (SectionHeader expanded/collapsed 등).
   */
  toQaId: (props: Record<string, string>) => QaIdResult;
}

// ── 변환 규칙 정의 ─────────────────────────────────────────────────────────────

const COMPONENT_SETS: ComponentSetConfig[] = [
  // ── Button (Office) ─────────────────────────────────────────────────────────
  // Figma variant: Role=Brand, Style=Solid, Size=xs, Availability=Enabled, Interaction=Rest, Icon Position=none
  // qaId: btn-{role}-{style}-{size}[-disabled]
  {
    comment: 'Button (Office)',
    nodeId: '205:2273',
    filter: (p) => p['Interaction'] === 'Rest' && p['Icon Position'] === 'none',
    toQaId: (p) => {
      const role = p['Role']?.toLowerCase();
      const style = p['Style']?.toLowerCase();
      const size = p['Size']?.toLowerCase();
      if (!role || !style || !size) return null;
      const disabled = p['Availability'] === 'Disabled' ? '-disabled' : '';
      return `btn-${role}-${style}-${size}${disabled}`;
    },
  },

  // ── ButtonIconOnly (Office) ──────────────────────────────────────────────────
  // Figma variant: Role=Brand, Style=Solid, Size=xs, Availability=Enabled, Interaction=Rest
  // qaId: btn-icon-{role}-{style}-{size}[-disabled]
  {
    comment: 'ButtonIconOnly (Office)',
    nodeId: '232:1354',
    filter: (p) => p['Interaction'] === 'Rest',
    toQaId: (p) => {
      const role = p['Role']?.toLowerCase();
      const style = p['Style']?.toLowerCase();
      const size = p['Size']?.toLowerCase();
      if (!role || !style || !size) return null;
      const disabled = p['Availability'] === 'Disabled' ? '-disabled' : '';
      return `btn-icon-${role}-${style}-${size}${disabled}`;
    },
  },

  // ── TextInput (Office) ───────────────────────────────────────────────────────
  // Figma variant: Size=sm, Alignment=Left, Availability=Enabled, Interaction=Rest, Validation=None, Style=Boxed
  // qaId: input-{size}-{availability}-{validation}
  // Validation=Warning은 Figma에 미존재 → null 반환으로 건너뜀
  {
    comment: 'TextInput (Office)',
    nodeId: '216:4816',
    filter: (p) =>
      p['Interaction'] === 'Rest' &&
      p['Style'] === 'Boxed' &&
      p['Alignment'] === 'Left',
    toQaId: (p) => {
      const size = p['Size']?.toLowerCase();
      const availMap: Record<string, string> = {
        Enabled: 'enabled',
        Disabled: 'disabled',
        ReadOnly: 'readonly',
      };
      const validMap: Record<string, string> = {
        None: 'none',
        Error: 'error',
        Success: 'success',
        // Warning 의도적 미지원 — Figma에 variant 없음 (디자이너 추가 요청 대상)
      };
      const avail = availMap[p['Availability']];
      const valid = validMap[p['Validation']];
      if (!size || !avail || !valid) return null;
      return `input-${size}-${avail}-${valid}`;
    },
  },

  // ── LNB · NavItem ────────────────────────────────────────────────────────────
  // Figma variant: Level=1, Availability=Enabled, Interaction=Rest, Selected=False, DND State=None
  // qaId: lnb-nav-l{level}-{stateLabel}
  // stateLabel 우선순위 (NavItem.tsx:127): dragging > dragover > disabled > selected > rest
  {
    comment: 'LNB · NavItem',
    nodeId: '338:1126',
    filter: (p) => p['Interaction'] === 'Rest',
    toQaId: (p) => {
      const levelMatch = p['Level']?.match(/\d+/);
      if (!levelMatch) return null;
      const level = levelMatch[0];
      const dnd = p['DND State'];
      const avail = p['Availability'];
      const selected = p['Selected'];

      let stateLabel: string;
      if (dnd === 'Dragging') stateLabel = 'dragging';
      else if (dnd === 'DragOver') stateLabel = 'dragover';
      else if (avail === 'Disabled') stateLabel = 'disabled';
      else if (selected === 'True') stateLabel = 'selected';
      else stateLabel = 'rest';

      return `lnb-nav-l${level}-${stateLabel}`;
    },
  },

  // ── LNB · SectionHeader ──────────────────────────────────────────────────────
  // Figma variant: Level=1, Availability=Enabled, Interaction=Rest, DND State=None
  // qaId: lnb-section-l{level}-{stateLabel}
  // expanded/collapsed는 동일 base variant(chevron 회전만 다름) → 동일 node-id에 두 qaId 매핑
  // stateLabel: dragging > dragover > disabled > expanded (rest)
  {
    comment: 'LNB · SectionHeader',
    nodeId: '338:2489',
    filter: (p) => p['Interaction'] === 'Rest',
    toQaId: (p) => {
      const levelMatch = p['Level']?.match(/\d+/);
      if (!levelMatch) return null;
      const level = levelMatch[0];
      const dnd = p['DND State'];
      const avail = p['Availability'];

      if (dnd === 'Dragging') return `lnb-section-l${level}-dragging`;
      if (dnd === 'DragOver') return `lnb-section-l${level}-dragover`;
      if (avail === 'Disabled') return `lnb-section-l${level}-disabled`;
      // Enabled · Rest · DND=None → expanded + collapsed (동일 node-id 두 가지 qaId)
      return [
        `lnb-section-l${level}-expanded`,
        `lnb-section-l${level}-collapsed`,
      ];
    },
  },

  // ── LNB · ActionButton ───────────────────────────────────────────────────────
  // Figma variant: Availability=Enabled/Disabled, Interaction=Rest
  // qaId: lnb-action-rest[-disabled]
  {
    comment: 'LNB · ActionButton',
    nodeId: '363:721',
    filter: (p) => p['Interaction'] === 'Rest',
    toQaId: (p) => {
      if (p['Availability'] === 'Disabled') return 'lnb-action-rest-disabled';
      return 'lnb-action-rest';
    },
  },
];

// ── Figma API ──────────────────────────────────────────────────────────────────

async function fetchComponentSetChildren(
  nodeIds: string[],
): Promise<Record<string, FigmaChild[]>> {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${nodeIds.join(',')}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN! } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Figma API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as FigmaNodesResponse;
  const result: Record<string, FigmaChild[]> = {};
  for (const [id, entry] of Object.entries(json.nodes)) {
    const children = entry?.document?.children ?? [];
    result[id] = children.filter((c) => c.type === 'COMPONENT');
  }
  return result;
}

// ── variant name 파싱 ──────────────────────────────────────────────────────────

function parseVariantName(name: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const part of name.split(',')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (key && value) props[key] = value;
  }
  return props;
}

// ── 섹션 헤더 생성 ─────────────────────────────────────────────────────────────

function sectionHeader(comment: string): string {
  const bar = '─'.repeat(Math.max(0, 70 - comment.length - 4));
  return `  // ── ${comment} ${bar}`;
}

// ── main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[generate:qa-map] Component Set 데이터 수집 중...');

  const allNodeIds = COMPONENT_SETS.map((c) => c.nodeId);
  const childrenMap = await fetchComponentSetChildren(allNodeIds);

  const lines: string[] = [];
  let totalGenerated = 0;
  const seen = new Set<string>(); // 중복 qaId 방지

  for (const config of COMPONENT_SETS) {
    const children = childrenMap[config.nodeId] ?? [];
    if (children.length === 0) {
      console.warn(
        `  [warn] ${config.comment} (${config.nodeId}): children 없음`,
      );
      continue;
    }

    const sectionLines: string[] = [];
    let sectionCount = 0;

    for (const child of children) {
      const props = parseVariantName(child.name);
      if (!config.filter(props)) continue;

      const result = config.toQaId(props);
      if (result === null) continue;

      const qaIds = Array.isArray(result) ? result : [result];
      for (const qaId of qaIds) {
        if (seen.has(qaId)) continue; // 중복 건너뜀 (예: Dragging+Selected=True)
        seen.add(qaId);
        sectionLines.push(`  '${qaId}': '${child.id}',`);
        sectionCount++;
        totalGenerated++;
      }
    }

    if (sectionLines.length > 0) {
      lines.push('');
      lines.push(sectionHeader(config.comment));
      lines.push(...sectionLines);
      console.log(`  ${config.comment}: ${sectionCount}개`);
    }
  }

  const content = [
    '/**',
    ' * AUTO-GENERATED by scripts/generate-qa-map.ts',
    ' * 직접 수정하지 마세요. pnpm generate:qa-map 으로 갱신합니다.',
    ' */',
    'export const AUTO_GENERATED_QA_MAP: Record<string, string> = {',
    ...lines,
    '};',
    '',
  ].join('\n');

  writeFileSync(OUTPUT_PATH, content, 'utf8');
  console.log(`[generate:qa-map] 완료 → ${OUTPUT_PATH} (${totalGenerated}개)`);
}

main().catch((err) => {
  console.error('[generate:qa-map] 실패:', err);
  process.exit(1);
});
