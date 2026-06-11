import { TextInput } from '../components/Input';

// Figma placeholder 아이콘과 동일한 형태 (16×16 X 모양)
const PlaceholderIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M12 4L4 12M4 4l8 8" />
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
    id: 'INP-QA-001',
    severity: 'warning',
    component: 'TextInput',
    affected: [
      'input-sm-enabled-none',
      'input-md-enabled-none',
      'input-lg-enabled-none',
    ],
    title: 'Warning Validation 서포팅텍스트 색상 미구현',
    description:
      'validation="warning" 상태의 서포팅텍스트 색상이 Warning 전용 토큰을 사용하지 않습니다. Figma 컴포넌트에 Warning variant가 아직 빌드되지 않아(스펙 INP-03) 토큰을 확정할 수 없습니다.',
    figmaValue: '--text/warning/normal/default (미빌드)',
    codeValue: '--sys-text-neutral-subtle-default (#676767) fallback',
    verdict:
      '코드가 스펙 범위 내입니다. Figma Warning variant 빌드 후 재검증 필요.',
  },
  {
    id: 'INP-QA-002',
    severity: 'warning',
    component: 'TextInput',
    affected: [
      'input-md-disabled-none',
      'input-sm-disabled-none',
      'input-lg-disabled-none',
    ],
    title: 'Disabled 입력값 텍스트 색상 토큰 미검증',
    description:
      'Figma Disabled 상태 variant에 텍스트값(Text role)이 없고 Placeholder만 존재합니다. 코드의 disabled:text 토큰을 Figma 기준으로 검증할 수 없습니다.',
    figmaValue: '텍스트값 variant 없음 (Placeholder만 표시)',
    codeValue: 'disabled:text-(--sys-text-neutral-faint-default)',
    verdict: 'Figma에 텍스트값 있는 Disabled variant 추가 후 재검증 필요.',
  },
  {
    id: 'INP-QA-003',
    severity: 'warning',
    component: 'TextInput',
    affected: [
      'input-sm-enabled-none',
      'input-md-enabled-none',
      'input-lg-enabled-none',
      'input-md-enabled-error',
      'input-md-enabled-success',
    ],
    title: 'Input 텍스트 너비 불일치 (폰트 렌더링 차이)',
    description:
      '동일한 Placeholder 기준으로 Figma와 브라우저(Chromium)의 Input 너비가 다릅니다. Figma 자체 폰트 렌더링 엔진과 브라우저 OS 폰트 스택의 차이로 Pretendard 글자 폭이 달라집니다.',
    figmaValue: '554×34px (md 기준, Figma 렌더러)',
    codeValue: 'w-full (컨테이너 너비 종속, 브라우저 렌더러)',
    verdict:
      '구현 버그 아닙니다. 높이(34px)는 일치합니다. ButtonQA-002와 동일 원인.',
  },
];

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

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

export default function InputQAPage() {
  const errorCount = QA_ISSUES.filter((i) => i.severity === 'error').length;
  const warnCount = QA_ISSUES.filter((i) => i.severity === 'warning').length;

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
            TextInput QA 이슈 리포트
          </h1>
          <span
            style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}
          >
            Figma vs Browser · Playwright pixelmatch
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          Figma 파일:{' '}
          <code style={{ fontSize: 12 }}>7FyrA0Olbv6B7SicSvVTZN</code>{' '}
          &nbsp;·&nbsp; 비교 대상: TextInput md enabled 9종 (size × availability
          × validation)
        </div>

        {/* 요약 뱃지 */}
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
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 8,
              padding: '10px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>
              13
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#166534',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              PASS
            </div>
          </div>
        </div>

        {QA_ISSUES.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </section>

      {/* ── 컴포넌트 렌더링 (픽셀 비교용) ── */}
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
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* sm enabled / disabled */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 320 }}>
              <TextInput
                size="sm"
                availability="enabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
                onClear={() => {}}
              />
            </div>
            <div style={{ width: 320 }}>
              <TextInput
                size="sm"
                availability="disabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
              />
            </div>
          </div>

          {/* md enabled (none / error / success) */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 320 }}>
              <TextInput
                size="md"
                availability="enabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
                onClear={() => {}}
              />
            </div>
            <div style={{ width: 320 }}>
              <TextInput
                size="md"
                availability="enabled"
                validation="error"
                label="Input Label"
                defaultValue="Text"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
                onClear={() => {}}
              />
            </div>
            <div style={{ width: 320 }}>
              <TextInput
                size="md"
                availability="enabled"
                validation="success"
                label="Input Label"
                defaultValue="Text"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
                onClear={() => {}}
              />
            </div>
          </div>

          {/* md disabled / readOnly */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 320 }}>
              <TextInput
                size="md"
                availability="disabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
              />
            </div>
            <div style={{ width: 320 }}>
              <TextInput
                size="md"
                availability="readOnly"
                validation="none"
                label="Input Label"
                defaultValue="Text"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
              />
            </div>
          </div>

          {/* lg enabled / disabled */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 320 }}>
              <TextInput
                size="lg"
                availability="enabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
                onClear={() => {}}
              />
            </div>
            <div style={{ width: 320 }}>
              <TextInput
                size="lg"
                availability="disabled"
                validation="none"
                label="Input Label"
                placeholder="Placeholder"
                supportingText="This is an assistive text."
                leadingIcon={<PlaceholderIcon />}
                trailingType="clear"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
