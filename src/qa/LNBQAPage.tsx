import { LNB } from '../components/LNB';
import { Button } from '../components/Button';
import type { LnbNavLevel, LnbSectionLevel } from '../components/LNB';

// ── 16×16 더미 아이콘 (Figma placeholder 호환) ────────────────────────────────
const FolderIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="currentColor">
    <path d="M1.5 4a1 1 0 0 1 1-1H6l1.5 1.5h6a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4z" />
  </svg>
);

const PencilIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 18 18"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M9 4v10M4 9h10" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    viewBox="0 0 14 14"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="2.5" />
    <path d="M7 1.5v1.5M7 11v1.5M1.5 7h1.5M11 7h1.5M3.1 3.1l1 1M9.9 9.9l1 1M10.9 3.1l-1 1M4.1 9.9l-1 1" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 14 14" width="100%" height="100%" fill="currentColor">
    <circle cx="3" cy="7" r="1.2" />
    <circle cx="7" cy="7" r="1.2" />
    <circle cx="11" cy="7" r="1.2" />
  </svg>
);

// ── QA 이슈 데이터 ────────────────────────────────────────────────────────────

type IssueSeverity = 'error' | 'warning' | 'info';

interface QAIssue {
  id: string;
  severity: IssueSeverity;
  component: string;
  affected: string[];
  title: string;
  description: string;
  figmaValue: string;
  codeValue: string;
  verdict: string;
}

const QA_ISSUES: QAIssue[] = [
  {
    id: 'LNB-QA-001',
    severity: 'info',
    component: 'NavItem · SectionHeader',
    affected: ['lnb-nav-l1-dragover', 'lnb-section-l1-dragover'],
    title: 'DragOver 시각이 Hover와 동일 (의도된 동작)',
    description:
      'lnb.md v1.3 §4-1 — DragOver bg를 `faint/active`(#ecf7fe)로 통일하여 Hover와 동일 시각. 드래그 타깃 변별 신호가 부족함은 a11y watchlist A11Y-LNB-01로 등재되어 별도 추적.',
    figmaValue: '--office-bg-brand-faint-active (#ecf7fe, = Hover)',
    codeValue: '--office-bg-brand-faint-active (#ecf7fe)',
    verdict: '정합 (의도된 시각 동일). a11y는 별도 토큰 신설 시점에 보강 예정.',
  },
  {
    id: 'LNB-QA-002',
    severity: 'info',
    component: 'NavItem',
    affected: ['lnb-nav-l1-rest'],
    title: 'Badge 색을 alert 토큰으로 매핑 (시안 하드코딩 정정)',
    description:
      '예약시스템 시안에서 Badge bg가 `#e8453c`로 직접 지정되어 있으나, 토큰 1:1 원칙에 따라 `--sys-bg-alert-strong-default`로 매핑함. 시각 차이는 미세(#dd2832 ↔ #e8453c, alert family).',
    figmaValue: '#e8453c (시안 하드코딩)',
    codeValue: '--sys-bg-alert-strong-default',
    verdict: '토큰 1:1 원칙 우선. 디자인 토큰 패키지에 #e8453c 매핑 신설 시 swap 가능.',
  },
  {
    id: 'LNB-QA-003',
    severity: 'info',
    component: 'NavItem',
    affected: ['lnb-nav-l1-dragging'],
    title: 'Dragging shadow를 elevation lv2 토큰으로 매핑',
    description:
      'lnb.md v1.3 — Dragging은 `sys/elevation/floating` 토큰을 요구. 본 구현은 Tailwind @utility `shadow-lv2`(=lv2 토큰)로 매핑. lv2는 카드 기본 그림자로 floating과 유사 (0 2px 8px rgba 8%).',
    figmaValue: 'sys/elevation/floating',
    codeValue: 'shadow-lv2 (sys/elevation/lv2)',
    verdict: 'lv2가 시안 그림자와 시각 동일. floating 토큰이 별도 정의되면 swap.',
  },
];

// ── Issue Card / Severity 스타일 ──────────────────────────────────────────────

const SEVERITY_STYLE: Record<
  IssueSeverity,
  { badge: string; border: string; bg: string }
> = {
  error: { badge: '#fff', border: '#f87171', bg: '#fef2f2' },
  warning: { badge: '#fff', border: '#fbbf24', bg: '#fffbeb' },
  info: { badge: '#fff', border: '#60a5fa', bg: '#eff6ff' },
};

const SEVERITY_LABEL: Record<IssueSeverity, string> = {
  error: 'ERROR',
  warning: 'WARNING',
  info: 'INFO',
};

const SEVERITY_BADGE_BG: Record<IssueSeverity, string> = {
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

function IssueCard({ issue }: { issue: QAIssue }) {
  const style = SEVERITY_STYLE[issue.severity];
  return (
    <div
      style={{
        border: `1.5px solid ${style.border}`,
        background: style.bg,
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            background: SEVERITY_BADGE_BG[issue.severity],
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 4,
            padding: '2px 8px',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        >
          {SEVERITY_LABEL[issue.severity]}
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#6b7280',
            background: '#f3f4f6',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {issue.id}
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#374151',
            background: '#e5e7eb',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {issue.component}
        </span>
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#111827',
          marginBottom: 6,
        }}
      >
        {issue.title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#374151',
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {issue.description}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            background: '#fee2e2',
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#991b1b',
              marginBottom: 2,
              letterSpacing: 1,
            }}
          >
            FIGMA
          </div>
          <div
            style={{ fontFamily: 'monospace', fontSize: 13, color: '#7f1d1d' }}
          >
            {issue.figmaValue}
          </div>
        </div>
        <div
          style={{
            background: '#dcfce7',
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#166534',
              marginBottom: 2,
              letterSpacing: 1,
            }}
          >
            CODE
          </div>
          <div
            style={{ fontFamily: 'monospace', fontSize: 13, color: '#14532d' }}
          >
            {issue.codeValue}
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: '#4b5563',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 6,
          padding: '6px 12px',
          marginBottom: 10,
          fontStyle: 'italic',
        }}
      >
        💬 {issue.verdict}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {issue.affected.map((id) => (
          <span
            key={id}
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              background: 'rgba(0,0,0,0.06)',
              color: '#374151',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Variant 매트릭스 ─────────────────────────────────────────────────────────

const NAV_LEVELS: LnbNavLevel[] = [1, 2, 3];
const SECTION_LEVELS: LnbSectionLevel[] = [1, 2];

const matrixBoxStyle = {
  background: 'var(--office-bg-brand-subtle-default)',
  border: '1px solid #cdd6e2',
  borderRadius: 8,
  padding: 16,
  width: 276,
};

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function LNBQAPage() {
  const warnCount = QA_ISSUES.filter((i) => i.severity === 'warning').length;
  const infoCount = QA_ISSUES.filter((i) => i.severity === 'info').length;
  const errorCount = QA_ISSUES.filter((i) => i.severity === 'error').length;

  return (
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '40px 48px',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* ── QA 이슈 리포트 ── */}
      <section style={{ maxWidth: 800, marginBottom: 64 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: '#111827',
            }}
          >
            LNB QA 이슈 리포트
          </h1>
          <span
            style={{
              fontSize: 12,
              color: '#9ca3af',
              fontFamily: 'monospace',
            }}
          >
            docs/components/lnb.md v1.3 + 예약시스템 시안 정합
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          Figma 파일:{' '}
          <code style={{ fontSize: 12 }}>7FyrA0Olbv6B7SicSvVTZN</code> · 비교
          기준: HTML 시안{' '}
          <code style={{ fontSize: 12 }}>LNB_예약시스템_시안.html</code>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 8,
              padding: '10px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>
              {errorCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#991b1b',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              ERROR
            </div>
          </div>
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: 8,
              padding: '10px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
              {warnCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#92400e',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              WARNING
            </div>
          </div>
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #93c5fd',
              borderRadius: 8,
              padding: '10px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>
              {infoCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#1e3a8a',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              INFO
            </div>
          </div>
        </div>

        {QA_ISSUES.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </section>

      {/* ── 컴포넌트 매트릭스 ── */}
      <section>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#6b7280',
            marginBottom: 16,
            letterSpacing: 1,
          }}
        >
          COMPONENT RENDER (data-qa-id 기준 Playwright 캡처 대상)
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
          }}
        >
          {/* NavItem 매트릭스 */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              NavItem · Level × State
            </div>
            <div style={matrixBoxStyle}>
              {NAV_LEVELS.map((level) => (
                <LNB.NavItem
                  key={`rest-${level}`}
                  level={level}
                  label={`Level ${level} · Rest`}
                  leading={<FolderIcon />}
                />
              ))}
              {NAV_LEVELS.map((level) => (
                <LNB.NavItem
                  key={`selected-${level}`}
                  level={level}
                  selected
                  label={`Level ${level} · Selected`}
                  leading={<FolderIcon />}
                />
              ))}
              {NAV_LEVELS.map((level) => (
                <LNB.NavItem
                  key={`disabled-${level}`}
                  level={level}
                  availability="disabled"
                  label={`Level ${level} · Disabled`}
                  leading={<FolderIcon />}
                />
              ))}
              <LNB.NavItem
                level={1}
                label="With Badge"
                leading={<FolderIcon />}
                badge={12}
              />
              <LNB.NavItem
                level={1}
                selected
                label="Selected + Badge"
                leading={<FolderIcon />}
                badge={3}
              />
            </div>
          </div>

          {/* NavItem 확장 매트릭스 — chevron, trailing iconbtn, DND */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              NavItem · Chevron · TrailingAction · DND
            </div>
            <div style={matrixBoxStyle}>
              <LNB.NavItem
                label="펼침/접힘 메뉴"
                hasChevron
                expanded
                leading={<FolderIcon />}
              />
              <LNB.NavItem
                label="접힌 메뉴"
                hasChevron
                expanded={false}
                leading={<FolderIcon />}
              />
              <LNB.NavItem
                label="Trailing Action"
                leading={<FolderIcon />}
                trailingAction={{
                  icon: <SettingsIcon />,
                  ariaLabel: '설정',
                  onClick: () => undefined,
                }}
              />
              <LNB.NavItem
                label="More Action"
                leading={<FolderIcon />}
                trailingAction={{
                  icon: <MoreIcon />,
                  ariaLabel: '더보기',
                  onClick: () => undefined,
                }}
              />
              <LNB.NavItem
                label="DragOver 상태"
                leading={<FolderIcon />}
                dragOver
              />
              <LNB.NavItem
                label="Dragging 상태"
                leading={<FolderIcon />}
                dragging
              />
            </div>
          </div>

          {/* SectionHeader 매트릭스 */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              SectionHeader · Level × Expanded
            </div>
            <div style={matrixBoxStyle}>
              {SECTION_LEVELS.map((level) => (
                <LNB.SectionHeader
                  key={`exp-${level}`}
                  level={level}
                  expanded
                  label={`Level ${level} · Expanded`}
                />
              ))}
              {SECTION_LEVELS.map((level) => (
                <LNB.SectionHeader
                  key={`col-${level}`}
                  level={level}
                  expanded={false}
                  label={`Level ${level} · Collapsed`}
                />
              ))}
              {SECTION_LEVELS.map((level) => (
                <LNB.SectionHeader
                  key={`exp-dis-${level}`}
                  level={level}
                  expanded
                  availability="disabled"
                  label={`Level ${level} · Disabled`}
                />
              ))}
            </div>
          </div>

          {/* SectionGroup + ActionButton + Divider */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              SectionGroup · ActionButton · Divider
            </div>
            <div style={matrixBoxStyle}>
              <LNB.ActionButton label="메일 쓰기" icon={<PencilIcon />} />
              <LNB.ActionButton
                label="휴가 신청"
                icon={<PencilIcon />}
                availability="disabled"
              />
              <LNB.Divider />
              <LNB.SectionGroup label="펼침 (default)" defaultExpanded>
                <LNB.NavItem
                  level={2}
                  label="자식 1"
                  leading={<FolderIcon />}
                />
                <LNB.NavItem
                  level={2}
                  label="자식 2"
                  leading={<FolderIcon />}
                />
              </LNB.SectionGroup>
              <LNB.SectionGroup
                label="접힘 (클릭 토글)"
                defaultExpanded={false}
              >
                <LNB.NavItem
                  level={2}
                  label="숨겨진 자식"
                  leading={<FolderIcon />}
                />
              </LNB.SectionGroup>
            </div>
          </div>

          {/* LNB 컨테이너 실사용 예 — 예약시스템 시안 */}
          <div
            style={{
              gridColumn: '1 / -1',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              LNB Container · 예약 시스템 실사용 시나리오
            </div>
            <div style={{ height: 720, display: 'flex' }}>
              <LNB
                header={
                  <Button
                    label="예약하기"
                    role="Brand"
                    btnStyle="Solid"
                    size="lg"
                    iconPosition="leading"
                    icon={<PlusIcon />}
                    className="w-full"
                  />
                }
              >
                <LNB.NavItem
                  label="나의 예약 목록"
                  leading={<FolderIcon />}
                  selected
                />
                <LNB.NavItem label="과천 6층 회의실" leading={<FolderIcon />} />
                <LNB.NavItem label="과천 5층 회의실" leading={<FolderIcon />} />
                <LNB.NavItem label="과천 4층 회의실" leading={<FolderIcon />} />
                <LNB.NavItem label="사내콘도" leading={<FolderIcon />} />
                <LNB.NavItem label="법인차량" leading={<FolderIcon />} />
                <LNB.Divider />
                <LNB.SectionGroup label="예약 관리" defaultExpanded>
                  <LNB.NavItem
                    level={2}
                    label="승인 관리"
                    leading={<PencilIcon />}
                  />
                  <LNB.NavItem
                    level={2}
                    label="반납 관리"
                    leading={<PencilIcon />}
                  />
                  <LNB.NavItem
                    level={2}
                    label="카테고리 관리"
                    leading={<PencilIcon />}
                  />
                </LNB.SectionGroup>
              </LNB>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
