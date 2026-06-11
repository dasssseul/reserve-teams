import { useState } from 'react';
import './App.css';
import { Button, ButtonIconOnly } from './components/Button';
import { TextInput } from './components/Input';
import { LNB } from './components/LNB';
import ButtonQAPage from './qa/ButtonQAPage';
import InputQAPage from './qa/InputQAPage';
import LNBQAPage from './qa/LNBQAPage';
import ModalQAPage from './qa/ModalQAPage';
import DomQAReportPage from './qa/DomQAReportPage';
import DomQAMcpReportPage from './qa/DomQAMcpReportPage';
import TimetableQAPage from './qa/TimetableQAPage';
import TableQAPage from './qa/TableQAPage';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

// ── LNB 예약시스템 시안 아이콘 (HTML 시안에서 가져옴) ───────────────────────
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

const TasksIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.5 4.5H14M6.5 8H14M6.5 11.5H14" />
    <path d="M2 4.3l1 1 1.6-1.7" />
    <path d="M2 7.8l1 1 1.6-1.7" />
    <path d="M2.4 11.5h.01" />
  </svg>
);

const CategoryIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinejoin="round"
  >
    <path d="M2.5 3.2h4.6l6.4 6.4-4.5 4.5-6.5-6.5z" />
    <circle cx="5" cy="5.7" r="1" />
  </svg>
);

const SignatureIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 13.2c2-.8 3.2-2.6 5-4.4l2.6 2.6c-1.8 1.8-3.6 3-4.6 3z" />
    <path d="M9.4 4.6l2 2 1.6-1.6a1.4 1.4 0 0 0-2-2z" />
  </svg>
);

const UndoIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7.5h6.2a3 3 0 0 1 0 6H6.5" />
    <path d="M4 7.5l2.6-2.6M4 7.5l2.6 2.6" />
  </svg>
);

const CategorySettingIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
  >
    <path d="M6 4h8M6 8h8M6 12h5.5" />
    <circle cx="3" cy="4" r="1.1" />
    <circle cx="3" cy="8" r="1.1" />
    <circle cx="3" cy="12" r="1.1" />
  </svg>
);

const WrenchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 2.5a3.3 3.3 0 0 0-4 4.1l-4.3 4.3a1.3 1.3 0 0 0 1.9 1.9l4.3-4.3a3.3 3.3 0 0 0 4-4l-2 2L9 5.1z" />
  </svg>
);

const UserAdminIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="5" r="2.4" />
    <path d="M2 13.2c0-2.2 1.8-3.6 4-3.6 1 0 1.9.3 2.6.8" />
    <path d="M10.6 11.2l1.3 1.3 2.3-2.4" />
  </svg>
);

function App() {
  const [clearValue, setClearValue] = useState('지우기 버튼 테스트');
  const [passwordValue, setPasswordValue] = useState('password123');

  if (window.location.pathname === '/qa') return <ButtonQAPage />;
  if (window.location.pathname === '/qa/input') return <InputQAPage />;
  if (window.location.pathname === '/qa/lnb') return <LNBQAPage />;
  if (window.location.pathname === '/qa/modal') return <ModalQAPage />;
  if (window.location.pathname === '/qa-report') return <DomQAReportPage />;
  if (window.location.pathname === '/qa-report/mcp') return <DomQAMcpReportPage />;
  if (window.location.pathname === '/qa/timetable') return <TimetableQAPage />;
  if (window.location.pathname === '/qa/table') return <TableQAPage />;

  return (
    <>
      {/* ── Input 컴포넌트 테스트 ── */}
      <section
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          background: '#fff',
          borderBottom: '1px solid #eaeaea',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            fontFamily: 'monospace',
            margin: 0,
          }}
        >
          TextInput
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Size · sm / md / lg
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 320,
            }}
          >
            <TextInput size="sm" placeholder="sm — 26px" />
            <TextInput size="md" placeholder="md — 34px" />
            <TextInput size="lg" placeholder="lg — 40px" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Label + Supporting Text
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxWidth: 320,
            }}
          >
            <TextInput
              label="이메일"
              placeholder="example@hiworks.com"
              supportingText="회사 이메일 주소를 입력하세요."
            />
            <TextInput
              label="이메일"
              placeholder="잘못된 형식"
              validation="error"
              supportingText="올바른 이메일 주소를 입력하세요."
              defaultValue="wrong@"
            />
            <TextInput
              label="이메일"
              placeholder="확인 완료"
              validation="success"
              supportingText="사용 가능한 이메일입니다."
              defaultValue="ok@hiworks.com"
            />
            <TextInput
              label="이메일"
              placeholder="주의 필요"
              validation="warning"
              supportingText="이미 사용 중일 수 있습니다."
              defaultValue="maybe@hiworks.com"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Availability · enabled / disabled / readOnly
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 320,
            }}
          >
            <TextInput
              label="활성"
              placeholder="입력 가능"
              availability="enabled"
            />
            <TextInput
              label="비활성"
              placeholder="입력 불가"
              availability="disabled"
              defaultValue="disabled 상태"
            />
            <TextInput
              label="읽기 전용"
              availability="readOnly"
              defaultValue="읽기 전용 텍스트"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Leading Icon
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 320,
            }}
          >
            <TextInput
              placeholder="검색어를 입력하세요"
              leadingIcon={<SearchIcon />}
            />
            <TextInput
              placeholder="검색어를 입력하세요"
              leadingIcon={<SearchIcon />}
              size="sm"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Trailing · clear / reveal / custom
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 320,
            }}
          >
            <TextInput
              placeholder="텍스트 입력 후 X 버튼"
              trailingType="clear"
              value={clearValue}
              onChange={(e) => setClearValue(e.target.value)}
              onClear={() => setClearValue('')}
            />
            <TextInput
              label="비밀번호"
              trailingType="reveal"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <TextInput
              placeholder="커스텀 아이콘"
              trailingType="custom"
              trailingIcon={<SearchIcon />}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Alignment · left / right
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 320,
            }}
          >
            <TextInput placeholder="왼쪽 정렬 (기본)" alignment="left" />
            <TextInput
              placeholder="오른쪽 정렬"
              alignment="right"
              defaultValue="12,500"
            />
          </div>
        </div>
      </section>

      {/* ── Button 컴포넌트 테스트 ── */}
      <section
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Brand · Solid / Outline / Text
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button label="저장" role="Brand" btnStyle="Solid" size="md" />
            <Button label="저장" role="Brand" btnStyle="Outline" size="md" />
            <Button label="저장" role="Brand" btnStyle="Text" size="md" />
            <Button
              label="저장"
              role="Brand"
              btnStyle="Solid"
              size="md"
              availability="disabled"
            />
            <Button
              label="아이콘 앞"
              role="Brand"
              btnStyle="Solid"
              size="md"
              iconPosition="leading"
              icon={<StarIcon />}
            />
            <Button
              label="아이콘 뒤"
              role="Brand"
              btnStyle="Outline"
              size="md"
              iconPosition="trailing"
              icon={<StarIcon />}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Neutral · Solid / Outline / Ghost
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button label="저장" role="Neutral" btnStyle="Solid" size="md" />
            <Button label="저장" role="Neutral" btnStyle="Outline" size="md" />
            <Button label="저장" role="Neutral" btnStyle="Ghost" size="md" />
            <Button
              label="비활성"
              role="Neutral"
              btnStyle="Solid"
              size="md"
              availability="disabled"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Destructive · Critical
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              label="삭제"
              role="Destructive"
              btnStyle="Solid"
              size="md"
            />
            <Button label="삭제" role="Critical" btnStyle="Solid" size="md" />
            <Button
              label="삭제"
              role="Destructive"
              btnStyle="Solid"
              size="md"
              availability="disabled"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            Size · xs / sm / md / lg
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button label="버튼" role="Brand" btnStyle="Solid" size="xs" />
            <Button label="버튼" role="Brand" btnStyle="Solid" size="sm" />
            <Button label="버튼" role="Brand" btnStyle="Solid" size="md" />
            <Button label="버튼" role="Brand" btnStyle="Solid" size="lg" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p
            style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
          >
            ButtonIconOnly · xs / sm / md
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Brand"
              btnStyle="Solid"
              size="xs"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Brand"
              btnStyle="Solid"
              size="sm"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Brand"
              btnStyle="Solid"
              size="md"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Brand"
              btnStyle="Outline"
              size="md"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Neutral"
              btnStyle="Ghost"
              size="md"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Critical"
              btnStyle="Solid"
              size="md"
            />
            <ButtonIconOnly
              icon={<StarIcon />}
              aria-label="즐겨찾기"
              role="Brand"
              btnStyle="Solid"
              size="md"
              availability="disabled"
            />
          </div>
        </div>
      </section>

      {/* ── LNB 컴포넌트 데모 (예약 시스템 시안) ── */}
      <section
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#f7f7f7',
          borderTop: '1px solid #eaeaea',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            fontFamily: 'monospace',
            margin: 0,
          }}
        >
          LNB · 예약 시스템 시안
        </p>
        <p style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}>
          전체 변형 매트릭스: <a href="/qa/lnb">/qa/lnb</a>
        </p>

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
              leading={<TasksIcon />}
              selected
            />
            <LNB.NavItem label="과천 6층 회의실" leading={<CategoryIcon />} />
            <LNB.NavItem label="과천 5층 회의실" leading={<CategoryIcon />} />
            <LNB.NavItem label="과천 4층 회의실" leading={<CategoryIcon />} />
            <LNB.NavItem
              label="과천 공용 회의실"
              leading={<CategoryIcon />}
            />
            <LNB.NavItem label="사내콘도" leading={<CategoryIcon />} />
            <LNB.NavItem label="관제센터 회의실" leading={<CategoryIcon />} />
            <LNB.NavItem label="법인차량" leading={<CategoryIcon />} />
            <LNB.NavItem label="테스트기기" leading={<CategoryIcon />} />
            <LNB.NavItem label="노트북 대여" leading={<CategoryIcon />} />
            <LNB.NavItem label="공용차량(제주)" leading={<CategoryIcon />} />
            <LNB.Divider />
            <LNB.SectionGroup label="예약 관리" defaultExpanded>
              <LNB.NavItem
                level={2}
                label="승인 관리"
                leading={<SignatureIcon />}
              />
              <LNB.NavItem
                level={2}
                label="반납 관리"
                leading={<UndoIcon />}
              />
              <LNB.NavItem
                level={2}
                label="카테고리 관리"
                leading={<CategorySettingIcon />}
              />
              <LNB.NavItem
                level={2}
                label="자원 관리"
                leading={<WrenchIcon />}
              />
              <LNB.NavItem
                level={2}
                label="예약 관리자"
                leading={<UserAdminIcon />}
              />
            </LNB.SectionGroup>
          </LNB>
        </div>
      </section>

      {/* ── Timetable 컴포넌트 링크 ── */}
      <section
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#fff',
          borderTop: '1px solid #eaeaea',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            fontFamily: 'monospace',
            margin: 0,
          }}
        >
          Timetable
        </p>
        <p
          style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
        >
          전체 변형 매트릭스: <a href="/qa/timetable">/qa/timetable</a>
        </p>
      </section>

      {/* ── Table 컴포넌트 링크 ── */}
      <section
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#f7f7f7',
          borderTop: '1px solid #eaeaea',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            fontFamily: 'monospace',
            margin: 0,
          }}
        >
          Table
        </p>
        <p
          style={{ fontSize: 11, color: '#909090', fontFamily: 'monospace' }}
        >
          나의 예약 목록: <a href="/qa/table">/qa/table</a>
        </p>
      </section>
    </>
  );
}

export default App;
