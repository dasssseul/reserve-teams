import { useMemo, useState } from 'react';
import { Button, ButtonIconOnly } from '../components/Button';
import type { ButtonRole, ButtonBtnStyle, ButtonSize } from '../components/Button';

type Status = 'pass' | 'warn' | 'fail' | 'skip';
type Channel = 'strict' | 'warn-only';

interface DiffItem {
  property: string;
  status: Status;
  channel: Channel;
  figmaValue: string;
  domValue: string;
  delta?: number;
  note?: string;
}

type Report = Record<string, DiffItem[]>;

// dom-qa-report.json은 .gitignore 됨. 파일이 없을 수 있으므로 옵셔널 import.
const reportModules = import.meta.glob<{ default: Report }>(
  '../../tests/dom-qa-report.json',
  { eager: true }
);
const REPORT: Report | null = Object.values(reportModules)[0]?.default ?? null;

// token-index: 토큰명 → hex 역조회용 (ColorChip swatch 색칠)
interface TokenIndexValue {
  tokens: string[];
  byCategory: Partial<Record<string, string[]>>;
}
interface TokenIndex {
  byHex: Record<string, TokenIndexValue>;
}
const tokenIndexModules = import.meta.glob<{ default: TokenIndex }>(
  '../../tests/fixtures/token-index.json',
  { eager: true }
);
const TOKEN_INDEX: TokenIndex | null =
  Object.values(tokenIndexModules)[0]?.default ?? null;

const TOKEN_TO_HEX: Map<string, string> = (() => {
  const map = new Map<string, string>();
  if (!TOKEN_INDEX) return map;
  for (const [hex, value] of Object.entries(TOKEN_INDEX.byHex)) {
    for (const token of value.tokens) {
      if (!map.has(token)) map.set(token, hex);
    }
  }
  return map;
})();

function isTokenValue(value: string): boolean {
  return value.startsWith('--');
}

function swatchForValue(value: string): string {
  if (isTokenValue(value)) return TOKEN_TO_HEX.get(value) ?? 'transparent';
  if (/^rgba?\(.+\)$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value;
  return 'transparent';
}

const CircleIcon = () => (
  <svg viewBox="0 0 18 18" width="100%" height="100%" fill="currentColor">
    <circle cx="9" cy="9" r="9" />
  </svg>
);

// qaId → 컴포넌트 props 파싱
interface ParsedQaId {
  kind: 'btn' | 'btn-icon';
  role: ButtonRole;
  btnStyle: ButtonBtnStyle;
  size: ButtonSize;
  disabled: boolean;
}

function parseQaId(qaId: string): ParsedQaId | null {
  const m = qaId.match(/^btn(?:-(icon))?-(brand|neutral|destructive|critical)-(solid|outline|text|ghost)-(xs|sm|md|lg)(-disabled)?$/);
  if (!m) return null;
  const kind = m[1] ? 'btn-icon' : 'btn';
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    kind,
    role: cap(m[2]) as ButtonRole,
    btnStyle: cap(m[3]) as ButtonBtnStyle,
    size: m[4] as ButtonSize,
    disabled: Boolean(m[5]),
  };
}

function ComponentPreview({ qaId }: { qaId: string }) {
  const parsed = parseQaId(qaId);
  if (!parsed) return <span style={{ fontSize: 12, color: '#94a3b8' }}>(미리보기 없음)</span>;
  const availability = parsed.disabled ? 'disabled' : 'enabled';
  if (parsed.kind === 'btn-icon') {
    return (
      <ButtonIconOnly
        icon={<CircleIcon />}
        aria-label="preview"
        role={parsed.role}
        btnStyle={parsed.btnStyle}
        size={parsed.size === 'lg' ? 'md' : parsed.size}
        availability={availability}
      />
    );
  }
  return (
    <Button
      label="저장"
      role={parsed.role}
      btnStyle={parsed.btnStyle}
      size={parsed.size}
      availability={availability}
    />
  );
}

// status별 색상 토큰
const STATUS_STYLE: Record<Status, { bg: string; border: string; text: string; label: string; emoji: string }> = {
  pass: { bg: '#f0fdf4', border: '#86efac', text: '#166534', label: 'PASS', emoji: '✅' },
  warn: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', label: 'WARN', emoji: '⚠️' },
  fail: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', label: 'FAIL', emoji: '❌' },
  skip: { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', label: 'SKIP', emoji: '⏭' },
};

function isColorProp(p: string): boolean {
  return p.toLowerCase().includes('color') || p === 'background' || p === 'borderColor';
}

function ColorChip({ value }: { value: string }) {
  const swatch = swatchForValue(value);
  const isToken = isTokenValue(value);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        title={isToken ? `${value} → ${TOKEN_TO_HEX.get(value) ?? '?'}` : value}
        style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          borderRadius: 3,
          background: swatch,
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      />
      <code style={{ fontSize: 12, color: isToken ? '#0f172a' : '#475569' }}>{value}</code>
    </span>
  );
}

function ValueCell({ value, property }: { value: string; property: string }) {
  if (isColorProp(property)) return <ColorChip value={value} />;
  const isToken = isTokenValue(value);
  return (
    <code style={{ fontSize: 12, color: isToken ? '#0f172a' : '#475569', fontWeight: isToken ? 600 : 400 }}>
      {value}
    </code>
  );
}

function DiffRow({ item }: { item: DiffItem }) {
  const style = STATUS_STYLE[item.status];
  return (
    <tr style={{ borderTop: '1px solid #f1f5f9' }}>
      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            background: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
            padding: '2px 8px',
            borderRadius: 4,
            letterSpacing: 0.5,
          }}
        >
          {style.emoji} {style.label}
        </span>
        {item.channel === 'warn-only' && (
          <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6 }}>warn-only</span>
        )}
      </td>
      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: '#1e293b' }}>
        {item.property}
      </td>
      <td style={{ padding: '8px 12px' }}>
        <ValueCell value={item.figmaValue} property={item.property} />
      </td>
      <td style={{ padding: '8px 12px', color: '#94a3b8', textAlign: 'center' }}>→</td>
      <td style={{ padding: '8px 12px' }}>
        <ValueCell value={item.domValue} property={item.property} />
      </td>
      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>
        {item.delta !== undefined &&
          (isColorProp(item.property)
            ? `ΔE=${item.delta}`
            : `Δ=${item.delta > 0 ? '+' : ''}${item.delta}`)}
        {item.note && <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>{item.note}</div>}
      </td>
    </tr>
  );
}

function QaCard({ qaId, items, openInitially }: { qaId: string; items: DiffItem[]; openInitially: boolean }) {
  const [open, setOpen] = useState(openInitially);
  const counts = useMemo(() => {
    const c = { pass: 0, warn: 0, fail: 0, skip: 0 };
    for (const i of items) c[i.status]++;
    return c;
  }, [items]);

  const hasFail = counts.fail > 0;
  const hasWarn = counts.warn > 0;
  const accent = hasFail ? '#ef4444' : hasWarn ? '#f59e0b' : '#86efac';

  return (
    <div
      style={{
        border: `1px solid ${hasFail ? '#fecaca' : hasWarn ? '#fde68a' : '#e2e8f0'}`,
        background: '#fff',
        borderRadius: 10,
        marginBottom: 14,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          all: 'unset',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          padding: '14px 20px',
          cursor: 'pointer',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div style={{ flex: '0 0 auto' }}>
          <ComponentPreview qaId={qaId} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{qaId}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 11 }}>
            {counts.fail > 0 && <span style={{ color: '#991b1b', fontWeight: 700 }}>❌ {counts.fail}</span>}
            {counts.warn > 0 && <span style={{ color: '#92400e', fontWeight: 700 }}>⚠️ {counts.warn}</span>}
            {counts.pass > 0 && <span style={{ color: '#166534' }}>✅ {counts.pass}</span>}
            {counts.skip > 0 && <span style={{ color: '#64748b' }}>⏭ {counts.skip}</span>}
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{open ? '접기 ▲' : '펼치기 ▼'}</span>
      </button>
      {open && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fcfcfd' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                상태
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                속성
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                Figma
              </th>
              <th />
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                DOM (코드)
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                차이
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <DiffRow key={`${it.property}-${idx}`} item={it} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

interface IssueGroup {
  key: string;
  label: string;
  property: string;
  figmaValue: string;
  domValue: string;
  delta?: number;
  qaIds: string[];
}

function groupByPattern(report: Report, qaIds: string[]): IssueGroup[] {
  const map = new Map<string, IssueGroup>();
  for (const qaId of qaIds) {
    const items = report[qaId];
    if (!items) continue;
    for (const it of items) {
      if (it.status !== 'fail' || it.channel !== 'strict') continue;
      const key = `${it.property}::${it.figmaValue}::${it.domValue}`;
      const existing = map.get(key);
      if (existing) {
        existing.qaIds.push(qaId);
      } else {
        map.set(key, {
          key,
          label: `${it.property} 불일치 (Figma ${it.figmaValue} vs DOM ${it.domValue})`,
          property: it.property,
          figmaValue: it.figmaValue,
          domValue: it.domValue,
          delta: it.delta,
          qaIds: [qaId],
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.qaIds.length - a.qaIds.length);
}

// ── 컴포넌트 필터 ────────────────────────────────────────────────────────────
type ComponentFilter =
  | 'all'
  | 'btn'
  | 'btn-icon'
  | 'input'
  | 'lnb'
  | 'modal'
  | 'table'
  | 'timetable';

const COMPONENT_FILTERS: Array<{ key: ComponentFilter; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'btn', label: 'Button' },
  { key: 'btn-icon', label: 'ButtonIconOnly' },
  { key: 'input', label: 'Input' },
  { key: 'lnb', label: 'LNB' },
  { key: 'modal', label: 'Modal' },
  { key: 'table', label: 'Table' },
  { key: 'timetable', label: 'Timetable' },
];

function componentOfQaId(qaId: string): ComponentFilter {
  // btn-icon-가 btn-보다 먼저 (긴 접두 우선)
  if (qaId.startsWith('btn-icon-')) return 'btn-icon';
  if (qaId.startsWith('btn-')) return 'btn';
  if (qaId.startsWith('input-')) return 'input';
  if (qaId.startsWith('lnb-')) return 'lnb';
  if (qaId.startsWith('modal-')) return 'modal';
  if (qaId.startsWith('tbl-')) return 'table';
  if (qaId.startsWith('tt-')) return 'timetable';
  return 'all';
}

export default function DomQAReportPage() {
  const [filter, setFilter] = useState<'all' | 'issues'>('issues');
  const [componentFilter, setComponentFilter] = useState<ComponentFilter>('all');
  const [query, setQuery] = useState('');

  if (!REPORT) {
    return (
      <div style={{ padding: 48, fontFamily: 'Pretendard, sans-serif' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
          DOM QA 리포트
        </h1>
        <div
          style={{
            padding: 24,
            border: '1px solid #fcd34d',
            background: '#fffbeb',
            borderRadius: 8,
            color: '#92400e',
            maxWidth: 720,
          }}
        >
          <strong>리포트 파일이 없습니다.</strong>
          <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
            먼저 <code>pnpm test:dom-qa</code>를 실행해 <code>tests/dom-qa-report.json</code>을 생성하세요.
          </p>
        </div>
      </div>
    );
  }

  const allQaIds = Object.keys(REPORT);

  // 컴포넌트 필터 적용된 qa-id 풀 (다른 필터 동작의 베이스)
  const componentScopedIds = useMemo(() => {
    if (componentFilter === 'all') return allQaIds;
    return allQaIds.filter((id) => componentOfQaId(id) === componentFilter);
  }, [componentFilter, allQaIds]);

  // 컴포넌트별 qa-id 개수 (필터 탭에 표시)
  const componentCounts = useMemo(() => {
    const c: Record<ComponentFilter, number> = {
      all: allQaIds.length,
      btn: 0,
      'btn-icon': 0,
      input: 0,
      lnb: 0,
      modal: 0,
      table: 0,
      timetable: 0,
    };
    for (const id of allQaIds) {
      const k = componentOfQaId(id);
      if (k !== 'all') c[k]++;
    }
    return c;
  }, [allQaIds]);

  // 통계는 컴포넌트 필터에 따라 동적 계산
  const stats = useMemo(() => {
    let strictPass = 0;
    let strictFails = 0;
    let warns = 0;
    let skips = 0;
    for (const id of componentScopedIds) {
      for (const it of REPORT[id]) {
        if (it.status === 'skip') skips++;
        else if (it.status === 'warn') warns++;
        else if (it.status === 'fail' && it.channel === 'strict') strictFails++;
        else if (it.status === 'pass' && it.channel === 'strict') strictPass++;
      }
    }
    return { strictPass, strictFails, warns, skips, total: componentScopedIds.length };
  }, [componentScopedIds]);

  // 이슈 패턴 그룹도 컴포넌트 스코프 안에서만
  const groups = useMemo(
    () => groupByPattern(REPORT, componentScopedIds),
    [componentScopedIds],
  );

  const filteredQaIds = useMemo(() => {
    return componentScopedIds.filter((id) => {
      if (query && !id.includes(query.toLowerCase())) return false;
      if (filter === 'issues') {
        const items = REPORT[id];
        return items.some((i) => i.status === 'fail' || i.status === 'warn');
      }
      return true;
    });
  }, [filter, query, componentScopedIds]);

  return (
    <div
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '32px 40px 64px',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 헤더 */}
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            DOM QA 리포트
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
            Figma 메타데이터 vs 브라우저 렌더링을 수치로 비교한 결과.{' '}
            <code style={{ fontSize: 12 }}>pnpm test:dom-qa</code>로 재생성.
          </p>
        </header>

        {/* 요약 통계 */}
        <section style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="총 항목" value={stats.total} color="#0f172a" bg="#fff" border="#e2e8f0" />
          <StatCard
            label="strict PASS"
            value={stats.strictPass}
            color="#166534"
            bg="#f0fdf4"
            border="#86efac"
          />
          <StatCard
            label="WARN"
            value={stats.warns}
            color="#92400e"
            bg="#fffbeb"
            border="#fcd34d"
          />
          <StatCard
            label="strict FAIL"
            value={stats.strictFails}
            color="#991b1b"
            bg="#fef2f2"
            border="#fca5a5"
          />
          <StatCard
            label="SKIP"
            value={stats.skips}
            color="#475569"
            bg="#f8fafc"
            border="#e2e8f0"
          />
        </section>

        {/* 이슈 그룹 (자동 패턴 분류) */}
        {groups.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              검출된 이슈 패턴 ({groups.length}종)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {groups.map((g, idx) => (
                <div
                  key={g.key}
                  style={{
                    background: '#fff',
                    border: '1px solid #fecaca',
                    borderLeft: '4px solid #ef4444',
                    borderRadius: 8,
                    padding: '14px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontFamily: 'monospace',
                      }}
                    >
                      ISSUE-{String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                      {g.property}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{g.qaIds.length}건 영향</span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: 10,
                      alignItems: 'center',
                      marginBottom: 10,
                      maxWidth: 600,
                    }}
                  >
                    <div style={{ background: '#fee2e2', borderRadius: 6, padding: '8px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#991b1b', letterSpacing: 1 }}>
                        FIGMA
                      </div>
                      <ValueCell value={g.figmaValue} property={g.property} />
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 18 }}>→</div>
                    <div style={{ background: '#dcfce7', borderRadius: 6, padding: '8px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', letterSpacing: 1 }}>
                        DOM (코드)
                      </div>
                      <ValueCell value={g.domValue} property={g.property} />
                    </div>
                  </div>
                  <details>
                    <summary style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                      영향 받은 qa-id {g.qaIds.length}개 보기
                    </summary>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {g.qaIds.map((id) => (
                        <code
                          key={id}
                          style={{
                            fontSize: 11,
                            background: '#f1f5f9',
                            padding: '2px 8px',
                            borderRadius: 4,
                            color: '#334155',
                          }}
                        >
                          {id}
                        </code>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 필터 바 */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 16,
            position: 'sticky',
            top: 0,
            background: '#f8fafc',
            padding: '12px 0',
            zIndex: 1,
          }}
        >
          {/* 1줄: 컴포넌트 필터 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 0.5 }}>
              COMPONENT
            </span>
            <div
              style={{
                display: 'flex',
                gap: 4,
                background: '#fff',
                borderRadius: 6,
                padding: 4,
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap',
              }}
            >
              {COMPONENT_FILTERS.map(({ key, label }) => (
                <FilterTab
                  key={key}
                  active={componentFilter === key}
                  onClick={() => setComponentFilter(key)}
                >
                  {label} ({componentCounts[key]})
                </FilterTab>
              ))}
            </div>
          </div>

          {/* 2줄: 이슈/전체 토글 + 검색 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                gap: 4,
                background: '#fff',
                borderRadius: 6,
                padding: 4,
                border: '1px solid #e2e8f0',
              }}
            >
              <FilterTab active={filter === 'issues'} onClick={() => setFilter('issues')}>
                이슈만 ({filteredQaIds.length})
              </FilterTab>
              <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>
                전체 ({componentScopedIds.length})
              </FilterTab>
            </div>
            <input
              type="text"
              placeholder="qa-id 검색 (예: brand-solid)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                maxWidth: 320,
                padding: '8px 12px',
                fontSize: 13,
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                outline: 'none',
              }}
            />
          </div>
        </section>

        {/* qa-id별 카드 */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            qa-id 상세
          </h2>
          {filteredQaIds.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              해당하는 항목이 없습니다.
            </div>
          ) : (
            filteredQaIds.map((qaId) => {
              const items = REPORT[qaId];
              const hasIssue = items.some((i) => i.status === 'fail' || i.status === 'warn');
              return <QaCard key={qaId} qaId={qaId} items={items} openInitially={hasIssue} />;
            })
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  bg,
  border,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: '12px 20px',
        minWidth: 110,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color, fontWeight: 600, letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '6px 14px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 4,
        background: active ? '#0f172a' : 'transparent',
        color: active ? '#fff' : '#475569',
      }}
    >
      {children}
    </button>
  );
}
