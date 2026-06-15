import { Timetable } from '../components/Timetable';
import { Datetable } from '../components/Timetable';
import EventBlock from '../components/Timetable/EventBlock';
import TimeAxisCell from '../components/Timetable/TimeAxisCell';
import DateAxisCell from '../components/Timetable/DateAxisCell';
import TimeSlotCell from '../components/Timetable/TimeSlotCell';
import DateSlotCell from '../components/Timetable/DateSlotCell';
import ResourceHeader from '../components/Timetable/ResourceHeader';
import ResourcePhoto from '../components/Timetable/ResourcePhoto';
import AxisCorner from '../components/Timetable/AxisCorner';
import NowIndicator from '../components/Timetable/NowIndicator';
import SelectionBox from '../components/Timetable/SelectionBox';

// ─── 아이콘 ──────────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="7" cy="4.5" r="0.75" fill="currentColor" />
  </svg>
);

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

function generateTimeAxisCells(startHour: number, endHour: number) {
  const cells: { label: string; format: 'Hour' | 'HalfHour' }[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const hh = String(h).padStart(2, '0');
    cells.push({ label: `${hh}:00`, format: 'Hour' });
    cells.push({ label: `${hh}:30`, format: 'HalfHour' });
  }
  return cells;
}

// ─── 시간 시나리오 리소스 (피그마 기준) ──────────────────────────────────────

const TIME_RESOURCES = [
  { name: '603S', photo: 'https://picsum.photos/seed/603/200/98' },
  { name: '604S', photo: 'https://picsum.photos/seed/604/200/98' },
  { name: '605S', photo: 'https://picsum.photos/seed/605/200/98' },
  { name: '606M', photo: 'https://picsum.photos/seed/606/200/98' },
  { name: '607M', photo: 'https://picsum.photos/seed/607/200/98' },
  { name: '608M', photo: 'https://picsum.photos/seed/608/200/98' },
  { name: '609M', photo: 'https://picsum.photos/seed/609/200/98' },
];

// ─── 날짜 시나리오 리소스 (피그마 기준) ──────────────────────────────────────

const DATE_RESOURCES = [
  { name: '레이저포인터', photo: 'https://picsum.photos/seed/laser/200/98' },
  { name: '아이폰11', photo: 'https://picsum.photos/seed/iphone/200/98' },
  { name: '갤럭시 S20', photo: 'https://picsum.photos/seed/galaxy/200/98' },
  { name: '아이폰6', photo: 'https://picsum.photos/seed/ip6/200/98' },
  { name: 'iPad 7세대', photo: 'https://picsum.photos/seed/ipad/200/98' },
  { name: 'shure mv88...', photo: 'https://picsum.photos/seed/shure/200/98' },
  { name: '삼성 갤럭시탭S7', photo: 'https://picsum.photos/seed/tabs7/200/98' },
];

// ─── 섹션 제목 스타일 ────────────────────────────────────────────────────────

// Day Type → Tailwind text color (Datetable 행 기반 렌더링용)
const DAY_TYPE_TEXT_MAP: Record<string, string> = {
  Weekday: 'text-(--sys-text-calendar-weekday)',
  Saturday: 'text-(--sys-text-calendar-saturday)',
  Holiday: 'text-(--sys-text-calendar-holiday)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#333',
  fontFamily: 'monospace',
  margin: '0 0 12px',
};

const subTitle: React.CSSProperties = {
  fontSize: 11,
  color: '#909090',
  fontFamily: 'monospace',
  margin: '0 0 8px',
};

// ─── 페이지 ──────────────────────────────────────────────────────────────────

export default function TimetableQAPage() {
  const timeAxisCells = generateTimeAxisCells(0, 23);

  // 날짜축 — 5월 1~31일
  const dateCells: { label: string; dayType: 'Weekday' | 'Saturday' | 'Holiday' }[] = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(2026, 4, d); // 5월
    const dow = date.getDay();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    let dayType: 'Weekday' | 'Saturday' | 'Holiday' = 'Weekday';
    if (dow === 0) dayType = 'Holiday';
    if (dow === 6) dayType = 'Saturday';
    dateCells.push({
      label: `5월 ${d}일 (${dayNames[dow]})`,
      dayType,
    });
  }

  return (
    <div style={{ padding: 24, background: '#f7f7f7', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: '#333' }}>
        Timetable QA
      </h1>

      {/* ── Section 1: EventBlock 전체 변형 ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>EventBlock — 12 variant (v0.8 색 스킴)</p>
        <p style={subTitle}>Is Mine x Status x Interaction (hover로 확인)</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 12 }}>
          <EventBlock qaId="tt-event-mine-confirmed" title="주간회의_도메인사업" isMine status="Confirmed" time="10:00 - 11:00" author="관리자 영" style={{ height: 48 }} />
          <EventBlock qaId="tt-event-mine-tentative" title="주간회의_도메인사업" isMine status="Tentative" time="10:00 - 11:00" author="Howard" style={{ height: 48 }} />
          <EventBlock qaId="tt-event-mine-cancelled" title="취소된 회의" isMine status="Cancelled" time="10:00 - 11:00" author="Anna" style={{ height: 48 }} />
          <EventBlock qaId="tt-event-others-confirmed" title="회의" isMine={false} status="Confirmed" time="09:00 - 10:00" author="Anna(이" style={{ height: 48 }} />
          <EventBlock qaId="tt-event-others-tentative" title="회의" isMine={false} status="Tentative" time="09:30 - 12:30" author="Denny(노" style={{ height: 48 }} />
          <EventBlock qaId="tt-event-others-cancelled" title="취소된 회의" isMine={false} status="Cancelled" time="13:30 - 15:00" author="Tommy(" style={{ height: 48 }} />
        </div>

        <p style={{ ...subTitle, marginTop: 16 }}>Has Time / Has Author 조합</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 12 }}>
          <EventBlock title="둘 다 표시" isMine status="Confirmed" time="10:00 - 11:00" author="Anna" style={{ height: 48 }} />
          <EventBlock title="시간만 표시" isMine status="Confirmed" time="10:00 - 11:00" style={{ height: 48 }} />
          <EventBlock title="예약자만 표시" isMine status="Confirmed" author="Anna" style={{ height: 48 }} />
          <EventBlock title="둘 다 숨김" isMine status="Confirmed" style={{ height: 48 }} />
        </div>
      </section>

      {/* ── Section 2: 축 셀 ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>TimeAxisCell — Hour / HalfHour</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <p style={subTitle}>Hour (dashed border)</p>
            <TimeAxisCell qaId="tt-time-axis-hour" label="09:00" format="Hour" />
            <TimeAxisCell label="10:00" format="Hour" />
          </div>
          <div>
            <p style={subTitle}>HalfHour (solid border)</p>
            <TimeAxisCell qaId="tt-time-axis-halfhour" label="" format="HalfHour" />
            <TimeAxisCell label="" format="HalfHour" />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>DateAxisCell — Day Type</p>
        <div>
          <DateAxisCell qaId="tt-date-axis-weekday" label="5월 8일 (월)" dayType="Weekday" />
          <DateAxisCell qaId="tt-date-axis-saturday" label="5월 13일 (토)" dayType="Saturday" />
          <DateAxisCell qaId="tt-date-axis-holiday" label="5월 14일 (일)" dayType="Holiday" />
        </div>
      </section>

      {/* ── Section 3: SlotCell 변형 ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>TimeSlotCell — Availability x Selected</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 160 }}>
            <p style={subTitle}>enabled</p>
            <TimeSlotCell qaId="tt-timeslot-hour-enabled" format="Hour" availability="enabled" />
            <TimeSlotCell qaId="tt-timeslot-halfhour-enabled" format="HalfHour" availability="enabled" />
            <p style={{ ...subTitle, marginTop: 8 }}>Selected</p>
            <TimeSlotCell qaId="tt-timeslot-hour-enabled-selected" format="Hour" availability="enabled" selected />
            <TimeSlotCell qaId="tt-timeslot-halfhour-enabled-selected" format="HalfHour" availability="enabled" selected />
          </div>
          <div style={{ width: 160 }}>
            <p style={subTitle}>disabled</p>
            <TimeSlotCell qaId="tt-timeslot-hour-disabled" format="Hour" availability="disabled" />
            <TimeSlotCell qaId="tt-timeslot-halfhour-disabled" format="HalfHour" availability="disabled" />
          </div>
          <div style={{ width: 160 }}>
            <p style={subTitle}>readOnly</p>
            <TimeSlotCell qaId="tt-timeslot-hour-readonly" format="Hour" availability="readOnly" />
            <TimeSlotCell qaId="tt-timeslot-halfhour-readonly" format="HalfHour" availability="readOnly" />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>DateSlotCell — Availability x Selected</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 160 }}>
            <p style={subTitle}>enabled</p>
            <DateSlotCell qaId="tt-dateslot-enabled" availability="enabled" />
            <p style={{ ...subTitle, marginTop: 8 }}>Selected</p>
            <DateSlotCell qaId="tt-dateslot-enabled-selected" availability="enabled" selected />
          </div>
          <div style={{ width: 160 }}>
            <p style={subTitle}>disabled</p>
            <DateSlotCell qaId="tt-dateslot-disabled" availability="disabled" />
          </div>
          <div style={{ width: 160 }}>
            <p style={subTitle}>readOnly</p>
            <DateSlotCell qaId="tt-dateslot-readonly" availability="readOnly" />
          </div>
        </div>
      </section>

      {/* ── Section 4: ResourceHeader + Photo ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>ResourceHeader + ResourcePhoto</p>
        <div style={{ display: 'flex', gap: 0, width: 'fit-content' }}>
          <div style={{ width: 160, borderRight: '1px solid #d6d6d6' }}>
            <ResourceHeader qaId="tt-resource-header" name={TIME_RESOURCES[0].name} />
            <ResourcePhoto qaId="tt-resource-photo" src={TIME_RESOURCES[0].photo} alt={TIME_RESOURCES[0].name} />
          </div>
          {TIME_RESOURCES.slice(1, 3).map((r) => (
            <div key={r.name} style={{ width: 160, borderRight: '1px solid #d6d6d6' }}>
              <ResourceHeader name={r.name} />
              <ResourcePhoto src={r.photo} alt={r.name} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: AxisCorner ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>AxisCorner</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <p style={subTitle}>hasPhoto=false (42px)</p>
            <AxisCorner hasPhoto={false} />
          </div>
          <div>
            <p style={subTitle}>hasPhoto=true (140px)</p>
            <AxisCorner qaId="tt-axis-corner" hasPhoto />
          </div>
        </div>
      </section>

      {/* ── Section 6: NowIndicator + SelectionBox ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>NowIndicator + SelectionBox</p>
        <div style={{ position: 'relative', width: 500, height: 120, background: '#fff', border: '1px solid #d6d6d6' }}>
          <NowIndicator qaId="tt-now-indicator" style={{ top: 40 }} />
          <SelectionBox qaId="tt-selection-box" style={{ top: 60, left: 100, width: 160, height: 48 }} />
        </div>
      </section>

      {/* ── Section 7: Timetable 풀 조립 (시간 시나리오) ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>Timetable — 시간 시나리오 (회의실 예약)</p>
        <p style={subTitle}>0시~23시, 7개 자원 — 피그마 스크린샷 대응</p>

        <div style={{ overflow: 'auto', maxHeight: 600, border: '1px solid #d6d6d6', background: '#fff' }}>
          <Timetable>
            {/* Header row */}
            <div className="flex sticky top-0 z-10 bg-(--sys-bg-neutral-faint-default) border-b border-solid border-(--sys-stroke-neutral-subtle-default)">
              <AxisCorner hasPhoto />
              {TIME_RESOURCES.map((r, i) => (
                <div key={r.name} className={`flex-1 min-w-[120px] ${i < TIME_RESOURCES.length - 1 ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)' : ''}`}>
                  <ResourceHeader name={r.name} trailing={<InfoIcon />} />
                  <ResourcePhoto src={r.photo} alt={r.name} />
                </div>
              ))}
            </div>

            {/* Body: 행 기반 그리드 — 시간축 border가 전체 폭을 가로지름 */}
            <div className="relative">
              {/* 행 그리드 (시간축 + 슬롯이 같은 행, border-bottom 공유) */}
              {timeAxisCells.map((c, i) => (
                <div
                  key={i}
                  className={[
                    'flex h-[24px]',
                    'border-b border-(--sys-stroke-neutral-subtle-default)',
                    c.format === 'Hour' ? 'border-dashed' : 'border-solid',
                  ].join(' ')}
                >
                  {/* 시간 라벨 — 오른쪽 세로 구분선 */}
                  <div className="w-[100px] shrink-0 flex items-start justify-end pr-xs border-r border-solid border-(--sys-stroke-neutral-subtle-default)">
                    {c.format === 'Hour' && (
                      <span className="body-md-regular text-(--sys-text-neutral-normal-default)">
                        {c.label}
                      </span>
                    )}
                  </div>
                  {/* 자원 슬롯 셀들 */}
                  {TIME_RESOURCES.map((r, ri) => (
                    <div
                      key={r.name}
                      className={[
                        'flex-1 min-w-[120px]',
                        ri < TIME_RESOURCES.length - 1
                          ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)'
                          : '',
                      ].filter(Boolean).join(' ')}
                    />
                  ))}
                </div>
              ))}

              {/* Overlay Slot — EventBlock 예시 */}
              <EventBlock
                title="주간회의_도메인사업"
                isMine
                status="Confirmed"
                time="10:00 - 11:00"
                author="관리자 영"
                style={{
                  position: 'absolute',
                  top: 20 * 24,
                  left: 100,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 24,
                }}
              />
              <EventBlock
                title="보안사업팀 주간회의"
                isMine={false}
                status="Confirmed"
                time="09:30 - 10:30"
                author="Howard"
                style={{
                  position: 'absolute',
                  top: 19 * 24,
                  left: `calc(100px + (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 24,
                }}
              />
              <EventBlock
                title="주간회의_도메인사업"
                isMine={false}
                status="Confirmed"
                time="10:30 - 11:30"
                author="Dixie(최"
                style={{
                  position: 'absolute',
                  top: 21 * 24,
                  left: `calc(100px + (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 24,
                }}
              />
              <EventBlock
                title="회의"
                isMine
                status="Confirmed"
                time="09:00 - 10:00"
                author="Anna(이"
                style={{
                  position: 'absolute',
                  top: 18 * 24,
                  left: `calc(100px + 3 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 24,
                }}
              />
              <EventBlock
                title="회의"
                isMine={false}
                status="Confirmed"
                time="09:30 - 12:30"
                author="Denny(노"
                style={{
                  position: 'absolute',
                  top: 19 * 24,
                  left: `calc(100px + 4 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 6 * 24,
                }}
              />
              <EventBlock
                title="회계기획 주간회의"
                isMine={false}
                status="Confirmed"
                time="13:30 - 15:00"
                author="Tommy("
                style={{
                  position: 'absolute',
                  top: 27 * 24,
                  left: `calc(100px + 4 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 3 * 24,
                }}
              />
              <EventBlock
                title="회의"
                isMine={false}
                status="Confirmed"
                time="11:00 - 12:00"
                author="Tommy("
                style={{
                  position: 'absolute',
                  top: 22 * 24,
                  left: `calc(100px + 5 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 24,
                }}
              />
              <EventBlock
                title="회계기획 주간회의"
                isMine={false}
                status="Confirmed"
                time="15:30 - 18:00"
                author="Tommy("
                style={{
                  position: 'absolute',
                  top: 31 * 24,
                  left: `calc(100px + 4 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 5 * 24,
                }}
              />

              {/* NowIndicator — 13:00 위치 (slot 26) */}
              <NowIndicator style={{ top: 26 * 24, left: 0, right: 0 }} />
            </div>
          </Timetable>
        </div>
      </section>

      {/* ── Section 8: Datetable 풀 조립 (날짜 시나리오) ── */}
      <section style={{ marginBottom: 48 }}>
        <p style={sectionTitle}>Datetable — 날짜 시나리오 (기기 대여)</p>
        <p style={subTitle}>5월 1~31일, 7개 자원 — 피그마 스크린샷 대응</p>

        <div style={{ overflow: 'auto', maxHeight: 600, border: '1px solid #d6d6d6', background: '#fff' }}>
          <Datetable>
            {/* Header row */}
            <div className="flex sticky top-0 z-10 bg-(--sys-bg-neutral-faint-default) border-b border-solid border-(--sys-stroke-neutral-subtle-default)">
              <AxisCorner hasPhoto />
              {DATE_RESOURCES.map((r, i) => (
                <div key={r.name} className={`flex-1 min-w-[120px] ${i < DATE_RESOURCES.length - 1 ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)' : ''}`}>
                  <ResourceHeader name={r.name} trailing={<InfoIcon />} />
                  <ResourcePhoto src={r.photo} alt={r.name} />
                </div>
              ))}
            </div>

            {/* Body: 행 기반 그리드 */}
            <div className="relative">
              {dateCells.map((c, i) => (
                <div
                  key={i}
                  className="flex h-[40px] border-b border-solid border-(--sys-stroke-neutral-subtle-default)"
                >
                  <div className="w-[100px] shrink-0 flex items-center justify-start pl-xs border-r border-solid border-(--sys-stroke-neutral-subtle-default)">
                    <span className={`body-md-regular ${DAY_TYPE_TEXT_MAP[c.dayType]}`}>
                      {c.label}
                    </span>
                  </div>
                  {DATE_RESOURCES.map((r, ri) => (
                    <div
                      key={r.name}
                      className={[
                        'flex-1 min-w-[120px]',
                        ri < DATE_RESOURCES.length - 1
                          ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)'
                          : '',
                      ].filter(Boolean).join(' ')}
                    />
                  ))}
                </div>
              ))}

              {/* Overlay: 아이폰11 — 외부교육 진행 5/2~5/4 (Others) */}
              <EventBlock
                title="외부교육 진행"
                isMine={false}
                status="Confirmed"
                author="Howard(이태이)"
                style={{
                  position: 'absolute',
                  top: 1 * 40,
                  left: `calc(100px + 1 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 3 * 40,
                }}
              />

              {/* 갤럭시 S20 — 테스트 기기 대여 5/8~5/9 (Mine) */}
              <EventBlock
                title="테스트 기기 대여"
                isMine
                status="Confirmed"
                author="Howard(이태이)"
                style={{
                  position: 'absolute',
                  top: 7 * 40,
                  left: `calc(100px + 2 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 40,
                }}
              />

              {/* 아이폰6 — 테스트 기기 대여 5/8 (Mine) */}
              <EventBlock
                title="테스트 기기 대여"
                isMine
                status="Confirmed"
                author="Anna(박소연)"
                style={{
                  position: 'absolute',
                  top: 7 * 40,
                  left: `calc(100px + 3 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 1 * 40,
                }}
              />

              {/* 아이폰6 — 테스트 기기 대여 5/10 (Tentative) */}
              <EventBlock
                title="테스트 기기 대여"
                isMine
                status="Tentative"
                author="Anna(박소연)"
                style={{
                  position: 'absolute',
                  top: 9 * 40,
                  left: `calc(100px + 3 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 1 * 40,
                }}
              />

              {/* 갤럭시 S20 — 테스트 기기 대여 5/11~5/12 */}
              <EventBlock
                title="테스트 기기 대여"
                isMine={false}
                status="Confirmed"
                author="Howard(이태이)"
                style={{
                  position: 'absolute',
                  top: 10 * 40,
                  left: `calc(100px + 2 * (100% - 100px) / 7)`,
                  width: `calc((100% - 100px) / 7)`,
                  height: 2 * 40,
                }}
              />
            </div>
          </Datetable>
        </div>
      </section>
    </div>
  );
}
