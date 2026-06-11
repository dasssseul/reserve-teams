import { useMemo, useState } from 'react';

type Status = 'pass' | 'fail' | 'skip';
type ComparisonMode = 'token' | 'value';

interface McpDiffItem {
  category: string;
  status: Status;
  mcpCandidates: Array<{ token: string; cssVar: string; value: string }>;
  domValue: string;
  domToken?: string;
  matchedToken?: string;
  comparisonMode: ComparisonMode;
  note?: string;
}

type Report = Record<string, McpDiffItem[]>;

const reportModules = import.meta.glob<{ default: Report }>(
  '../../tests/dom-qa-mcp-report.json',
  { eager: true }
);
const REPORT: Report | null = Object.values(reportModules)[0]?.default ?? null;

const STATUS_STYLE: Record<Status, { bg: string; border: string; text: string; label: string; emoji: string }> = {
  pass: { bg: '#f0fdf4', border: '#86efac', text: '#166534', label: 'PASS', emoji: '✅' },
  fail: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', label: 'FAIL', emoji: '❌' },
  skip: { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', label: 'SKIP', emoji: '⏭' },
};

function isHexLike(v: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(v.trim());
}

function ColorSwatch({ hex }: { hex: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: 3,
        background: hex,
        border: '1px solid rgba(0,0,0,0.12)',
        verticalAlign: 'middle',
        marginRight: 4,
      }}
    />
  );
}

function McpCandidateCell({
  candidate,
  matched,
}: {
  candidate: { token: string; cssVar: string; value: string };
  matched: boolean;
}) {
  const isHex = isHexLike(candidate.value);
  return (
    <div
      style={{
        padding: '4px 8px',
        borderRadius: 3,
        background: matched ? '#dcfce7' : 'transparent',
        fontWeight: matched ? 600 : 400,
        fontFamily: 'monospace',
        fontSize: 11,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {isHex && <ColorSwatch hex={candidate.value} />}
        <code style={{ color: '#0f172a' }}>{candidate.cssVar}</code>
      </div>
      <div style={{ color: '#94a3b8', paddingLeft: isHex ? 18 : 0 }}>
        <code>{candidate.token}</code> · <code>{candidate.value}</code>
      </div>
    </div>
  );
}

function DomValueCell({ item }: { item: McpDiffItem }) {
  const isHex = isHexLike(item.domValue);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'monospace', fontSize: 11 }}>
      {item.domToken ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isHex && <ColorSwatch hex={item.domValue} />}
          <code style={{ color: '#0f172a', fontWeight: 600 }}>{item.domToken}</code>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isHex && <ColorSwatch hex={item.domValue} />}
          <code style={{ color: '#0f172a' }}>{item.domValue}</code>
        </div>
      )}
      {item.domToken && (
        <div style={{ color: '#94a3b8', paddingLeft: isHex ? 18 : 0 }}>
          <code>{item.domValue}</code>
        </div>
      )}
    </div>
  );
}

function DiffRow({ item }: { item: McpDiffItem }) {
  const style = STATUS_STYLE[item.status];
  return (
    <tr style={{ borderTop: '1px solid #f1f5f9', verticalAlign: 'top' }}>
      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
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
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, letterSpacing: 0.5 }}>
          {item.comparisonMode === 'token' ? 'TOKEN' : 'VALUE'}
        </div>
      </td>
      <td
        style={{
          padding: '10px 12px',
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#1e293b',
          whiteSpace: 'nowrap',
        }}
      >
        {item.category}
      </td>
      <td style={{ padding: '10px 12px', minWidth: 320 }}>
        {item.mcpCandidates.length === 0 ? (
          <span style={{ fontSize: 11, color: '#94a3b8' }}>(없음)</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {item.mcpCandidates.map((c) => (
              <McpCandidateCell key={c.token} candidate={c} matched={c.token === item.matchedToken} />
            ))}
          </div>
        )}
      </td>
      <td style={{ padding: '10px 12px', color: '#94a3b8', textAlign: 'center' }}>→</td>
      <td style={{ padding: '10px 12px', minWidth: 220 }}>
        <DomValueCell item={item} />
      </td>
      <td
        style={{
          padding: '10px 12px',
          fontSize: 11,
          color: '#64748b',
          fontStyle: 'italic',
          maxWidth: 220,
        }}
      >
        {item.note}
      </td>
    </tr>
  );
}

function QaCard({ qaId, items, openInitially }: { qaId: string; items: McpDiffItem[]; openInitially: boolean }) {
  const [open, setOpen] = useState(openInitially);
  const counts = useMemo(() => {
    const c = { pass: 0, fail: 0, skip: 0 };
    for (const i of items) c[i.status]++;
    return c;
  }, [items]);

  const hasFail = counts.fail > 0;
  const accent = hasFail ? '#ef4444' : '#86efac';

  return (
    <div
      style={{
        border: `1px solid ${hasFail ? '#fecaca' : '#e2e8f0'}`,
        background: '#fff',
        borderRadius: 10,
        marginBottom: 12,
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
          padding: '12px 20px',
          cursor: 'pointer',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{qaId}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 11 }}>
            {counts.fail > 0 && <span style={{ color: '#991b1b', fontWeight: 700 }}>❌ {counts.fail}</span>}
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
                카테고리
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                MCP 후보
              </th>
              <th />
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                DOM 값
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', letterSpacing: 0.5 }}>
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <DiffRow key={`${it.category}-${idx}`} item={it} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── 컴포넌트 필터 ────────────────────────────────────────────────────────────
type ComponentFilter = 'all' | 'btn' | 'btn-icon' | 'input' | 'lnb' | 'modal' | 'table' | 'timetable';

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
  if (qaId.startsWith('btn-icon-')) return 'btn-icon';
  if (qaId.startsWith('btn-')) return 'btn';
  if (qaId.startsWith('input-')) return 'input';
  if (qaId.startsWith('lnb-')) return 'lnb';
  if (qaId.startsWith('modal-')) return 'modal';
  if (qaId.startsWith('tbl-')) return 'table';
  if (qaId.startsWith('tt-')) return 'timetable';
  return 'all';
}

interface IssueGroup {
  key: string;
  category: string;
  comparisonMode: ComparisonMode;
  domToken?: string;
  domValue: string;
  sampleMcpCandidates: Array<{ token: string; cssVar: string; value: string }>;
  note?: string;
  qaIds: string[];
}

function groupByPattern(report: Report, qaIds: string[]): IssueGroup[] {
  const map = new Map<string, IssueGroup>();
  for (const qaId of qaIds) {
    const items = report[qaId];
    if (!items) continue;
    for (const it of items) {
      if (it.status !== 'fail') continue;
      const key = `${it.category}::${it.comparisonMode}::${it.domToken ?? it.domValue}`;
      const existing = map.get(key);
      if (existing) {
        existing.qaIds.push(qaId);
      } else {
        map.set(key, {
          key,
          category: it.category,
          comparisonMode: it.comparisonMode,
          domToken: it.domToken,
          domValue: it.domValue,
          sampleMcpCandidates: it.mcpCandidates,
          note: it.note,
          qaIds: [qaId],
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.qaIds.length - a.qaIds.length);
}

export default function DomQAMcpReportPage() {
  const [filter, setFilter] = useState<'all' | 'issues'>('issues');
  const [componentFilter, setComponentFilter] = useState<ComponentFilter>('all');
  const [query, setQuery] = useState('');

  if (!REPORT) {
    return (
      <div style={{ padding: 48, fontFamily: 'Pretendard, sans-serif' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
          DOM QA · MCP 리포트
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
            먼저 <code>pnpm test:dom-qa-mcp</code>를 실행해 <code>tests/dom-qa-mcp-report.json</code>을 생성하세요.
          </p>
        </div>
      </div>
    );
  }

  const allQaIds = Object.keys(REPORT);

  const componentScopedIds = useMemo(() => {
    if (componentFilter === 'all') return allQaIds;
    return allQaIds.filter((id) => componentOfQaId(id) === componentFilter);
  }, [componentFilter, allQaIds]);

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

  const stats = useMemo(() => {
    let pass = 0;
    let fail = 0;
    let skip = 0;
    let failNodes = 0;
    for (const id of componentScopedIds) {
      let nodeFail = false;
      for (const it of REPORT[id]) {
        if (it.status === 'pass') pass++;
        else if (it.status === 'fail') {
          fail++;
          nodeFail = true;
        } else skip++;
      }
      if (nodeFail) failNodes++;
    }
    return { pass, fail, skip, total: componentScopedIds.length, failNodes };
  }, [componentScopedIds]);

  const groups = useMemo(
    () => groupByPattern(REPORT, componentScopedIds),
    [componentScopedIds]
  );

  const filteredQaIds = useMemo(() => {
    return componentScopedIds.filter((id) => {
      if (query && !id.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === 'issues') {
        return REPORT[id].some((i) => i.status === 'fail');
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            DOM QA · MCP 변수 리포트
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
            Figma MCP가 알려준 노드별 변수(토큰명+값)와 브라우저 렌더링 결과를 카테고리별 후보 매칭으로 비교.{' '}
            <code style={{ fontSize: 12 }}>pnpm test:dom-qa-mcp</code>로 재생성.
          </p>
        </header>

        <section style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="총 노드" value={stats.total} color="#0f172a" bg="#fff" border="#e2e8f0" />
          <StatCard label="PASS" value={stats.pass} color="#166534" bg="#f0fdf4" border="#86efac" />
          <StatCard label="FAIL" value={stats.fail} color="#991b1b" bg="#fef2f2" border="#fca5a5" />
          <StatCard label="SKIP" value={stats.skip} color="#475569" bg="#f8fafc" border="#e2e8f0" />
          <StatCard label="FAIL 노드" value={stats.failNodes} color="#991b1b" bg="#fef2f2" border="#fca5a5" />
        </section>

        {groups.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              검출된 이슈 패턴 ({groups.length}종)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {groups.map((g, idx) => (
                <IssueGroupCard key={g.key} group={g} index={idx} />
              ))}
            </div>
          </section>
        )}

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
              const hasFail = items.some((i) => i.status === 'fail');
              return <QaCard key={qaId} qaId={qaId} items={items} openInitially={hasFail} />;
            })
          )}
        </section>
      </div>
    </div>
  );
}

function IssueGroupCard({ group, index }: { group: IssueGroup; index: number }) {
  const isHex = isHexLike(group.domValue);
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #fecaca',
        borderLeft: '4px solid #ef4444',
        borderRadius: 8,
        padding: '14px 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
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
          ISSUE-{String.fromCharCode(65 + index)}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
          {group.category}
        </span>
        <span
          style={{
            fontSize: 10,
            color: '#64748b',
            letterSpacing: 0.5,
            background: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: 3,
            fontWeight: 600,
          }}
        >
          {group.comparisonMode === 'token' ? 'TOKEN' : 'VALUE'}
        </span>
        <span style={{ fontSize: 12, color: '#64748b' }}>{group.qaIds.length}건 영향</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 10,
          alignItems: 'stretch',
          marginBottom: 10,
        }}
      >
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#991b1b', letterSpacing: 1, marginBottom: 6 }}>
            MCP 후보
          </div>
          {group.sampleMcpCandidates.length === 0 ? (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>(없음)</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {group.sampleMcpCandidates.map((c) => {
                const isHexValue = isHexLike(c.value);
                return (
                  <div key={c.token} style={{ fontFamily: 'monospace', fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {isHexValue && <ColorSwatch hex={c.value} />}
                      <code style={{ color: '#0f172a' }}>{c.cssVar}</code>
                      <span style={{ color: '#94a3b8' }}>· {c.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, fontStyle: 'italic' }}>
            (첫 노드 기준 — 노드마다 후보가 다를 수 있음)
          </div>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 18, display: 'flex', alignItems: 'center' }}>→</div>
        <div style={{ background: '#dcfce7', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', letterSpacing: 1, marginBottom: 6 }}>
            DOM (코드)
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {group.domToken ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isHex && <ColorSwatch hex={group.domValue} />}
                  <code style={{ color: '#0f172a', fontWeight: 600 }}>{group.domToken}</code>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                  <code>{group.domValue}</code>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {isHex && <ColorSwatch hex={group.domValue} />}
                <code style={{ color: '#0f172a' }}>{group.domValue}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {group.note && (
        <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginBottom: 8 }}>
          {group.note}
        </div>
      )}

      <details>
        <summary style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
          영향 받은 qa-id {group.qaIds.length}개 보기
        </summary>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {group.qaIds.map((id) => (
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
