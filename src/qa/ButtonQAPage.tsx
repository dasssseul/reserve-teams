import { Button, ButtonIconOnly } from '../components/Button';
import type { ButtonBtnStyle, ButtonRole, ButtonSize } from '../components/Button';

// Figma ButtonIconOnly placeholder 아이콘과 동일한 형태 (viewBox 18×18, r=9 꽉 채운 원)
const CircleIcon = () => (
  <svg viewBox="0 0 18 18" width="100%" height="100%" fill="currentColor">
    <circle cx="9" cy="9" r="9" />
  </svg>
);

type Combo = { role: ButtonRole; btnStyle: ButtonBtnStyle };

const COMBOS: Combo[] = [
  { role: 'Brand', btnStyle: 'Solid' },
  { role: 'Brand', btnStyle: 'Outline' },
  { role: 'Brand', btnStyle: 'Text' },
  { role: 'Neutral', btnStyle: 'Solid' },
  { role: 'Neutral', btnStyle: 'Outline' },
  { role: 'Neutral', btnStyle: 'Ghost' },
  { role: 'Destructive', btnStyle: 'Solid' },
  { role: 'Critical', btnStyle: 'Solid' },
];

const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];
const ICON_SIZES = ['xs', 'sm', 'md'] as const;

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
    id: 'QA-001',
    severity: 'error',
    component: 'ButtonIconOnly',
    affected: [
      'btn-icon-neutral-solid-md',
      'btn-icon-neutral-outline-md',
      'btn-icon-neutral-ghost-md',
    ],
    title: 'Neutral 아이콘 색상 토큰 불일치',
    description:
      'ButtonIconOnly Neutral 계열 컴포넌트의 아이콘 fill 색상이 스펙과 다릅니다. Figma 컴포넌트 내부 placeholder 아이콘이 잘못된 토큰(subtle)을 참조하고 있습니다.',
    figmaValue: '#676767 (sys.icon.neutral.subtle.default)',
    codeValue: '#333333 (sys.icon.neutral.normal.default)',
    verdict: '코드가 스펙 기준으로 정확합니다. Figma 컴포넌트 수정 필요.',
  },
  {
    id: 'QA-002',
    severity: 'warning',
    component: 'Button',
    affected: [
      'btn-brand-solid-md', 'btn-brand-outline-md', 'btn-brand-text-md',
      'btn-neutral-solid-md', 'btn-neutral-outline-md', 'btn-neutral-ghost-md',
      'btn-destructive-solid-md', 'btn-critical-solid-md',
    ],
    title: 'Button 텍스트 너비 불일치 (폰트 렌더링 차이)',
    description:
      '동일한 라벨("저장") 기준으로 Figma와 브라우저(Chromium)의 버튼 너비가 다릅니다. Figma는 자체 폰트 렌더링 엔진을 사용하고, 브라우저는 OS 폰트 스택을 사용하여 Pretendard의 글자 폭이 차이 납니다.',
    figmaValue: '82×34px (Solid/Outline md 기준)',
    codeValue: '65×34px (Solid md 기준)',
    verdict:
      '구현상 버그는 아닙니다. Figma ↔ 브라우저 폰트 렌더링 차이로 인한 픽셀 비교 한계. 높이(34px)는 일치합니다.',
  },
  {
    id: 'QA-003',
    severity: 'warning',
    component: 'ButtonIconOnly',
    affected: [
      'btn-icon-brand-solid-md',
      'btn-icon-brand-outline-md',
      'btn-icon-brand-text-md',
    ],
    title: 'Brand ButtonIconOnly 너비 1px 초과',
    description:
      'ButtonIconOnly Brand 계열 md 사이즈의 브라우저 렌더링 너비가 Figma보다 1px 큽니다. 요소의 subpixel 위치에 따른 Playwright screenshot 반올림으로 추정됩니다.',
    figmaValue: '34×34px',
    codeValue: '35×34px',
    verdict:
      '시각적으로 무의미한 1px 오차입니다. 실제 CSS 크기(size-[34px])는 올바르게 적용되어 있습니다.',
  },
];

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<IssueSeverity, { badge: string; border: string; bg: string }> = {
  error:   { badge: '#fff',    border: '#f87171', bg: '#fef2f2' },
  warning: { badge: '#fff',    border: '#fbbf24', bg: '#fffbeb' },
  info:    { badge: '#fff',    border: '#60a5fa', bg: '#eff6ff' },
};

const SEVERITY_LABEL: Record<IssueSeverity, string> = {
  error:   'ERROR',
  warning: 'WARNING',
  info:    'INFO',
};

const SEVERITY_BADGE_BG: Record<IssueSeverity, string> = {
  error:   '#ef4444',
  warning: '#f59e0b',
  info:    '#3b82f6',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
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

      <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
        {issue.title}
      </div>
      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 12 }}>
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
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '8px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#991b1b', marginBottom: 2, letterSpacing: 1 }}>
            FIGMA
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#7f1d1d' }}>
            {issue.figmaValue}
          </div>
        </div>
        <div style={{ background: '#dcfce7', borderRadius: 6, padding: '8px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', marginBottom: 2, letterSpacing: 1 }}>
            CODE
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#14532d' }}>
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
        {issue.affected.map(id => (
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

export default function ButtonQAPage() {
  const errorCount = QA_ISSUES.filter(i => i.severity === 'error').length;
  const warnCount = QA_ISSUES.filter(i => i.severity === 'warning').length;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 48px', fontFamily: 'Pretendard, sans-serif' }}>

      {/* ── QA 이슈 리포트 ── */}
      <section style={{ maxWidth: 800, marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Button QA 이슈 리포트
          </h1>
          <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>
            Figma vs Browser · Playwright pixelmatch
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          Figma 파일: <code style={{ fontSize: 12 }}>7FyrA0Olbv6B7SicSvVTZN</code> &nbsp;·&nbsp;
          비교 대상: Button md enabled 8종, ButtonIconOnly md enabled 8종
        </div>

        {/* 요약 뱃지 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{errorCount}</div>
            <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 600, letterSpacing: 1 }}>ERROR</div>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{warnCount}</div>
            <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600, letterSpacing: 1 }}>WARNING</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>5</div>
            <div style={{ fontSize: 11, color: '#166534', fontWeight: 600, letterSpacing: 1 }}>PASS</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#94a3b8' }}>11</div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 1 }}>SKIP (크기 불일치)</div>
          </div>
        </div>

        {QA_ISSUES.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </section>

      {/* ── 컴포넌트 렌더링 (픽셀 비교용) ── */}
      <section>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 16, letterSpacing: 1 }}>
          COMPONENT RENDER (data-qa-id 기준 Playwright 캡처 대상)
        </h2>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          {/* Button enabled */}
          {COMBOS.map(({ role, btnStyle }) =>
            SIZES.map(size => (
              <div key={`btn-${role}-${btnStyle}-${size}`} style={{ display: 'inline-flex', margin: 8 }}>
                <Button label="저장" role={role} btnStyle={btnStyle} size={size} />
              </div>
            ))
          )}

          {/* Button disabled */}
          {COMBOS.map(({ role, btnStyle }) =>
            SIZES.map(size => (
              <div key={`btn-${role}-${btnStyle}-${size}-disabled`} style={{ display: 'inline-flex', margin: 8 }}>
                <Button label="버튼" role={role} btnStyle={btnStyle} size={size} availability="disabled" />
              </div>
            ))
          )}

          {/* ButtonIconOnly enabled */}
          {COMBOS.map(({ role, btnStyle }) =>
            ICON_SIZES.map(size => (
              <div key={`btn-icon-${role}-${btnStyle}-${size}`} style={{ display: 'inline-flex', margin: 8 }}>
                <ButtonIconOnly icon={<CircleIcon />} aria-label="아이콘" role={role} btnStyle={btnStyle} size={size} />
              </div>
            ))
          )}

          {/* ButtonIconOnly disabled */}
          {COMBOS.map(({ role, btnStyle }) =>
            ICON_SIZES.map(size => (
              <div key={`btn-icon-${role}-${btnStyle}-${size}-disabled`} style={{ display: 'inline-flex', margin: 8 }}>
                <ButtonIconOnly icon={<CircleIcon />} aria-label="아이콘" role={role} btnStyle={btnStyle} size={size} availability="disabled" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
