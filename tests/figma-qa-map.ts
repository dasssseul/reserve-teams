/**
 * qa-id → Figma node-id 매핑
 *
 * Figma 파일이 변경되어 node-id가 바뀌면:
 *   - 자동화 대상(Button, ButtonIconOnly, TextInput, LNB):
 *       pnpm generate:qa-map 실행 → figma-qa-map.auto.ts 자동 갱신
 *   - 수동 관리 대상(Timetable, Table, Modal, Divider):
 *       이 파일의 MANUAL_QA_MAP 섹션을 직접 수정
 *
 * 파일 키: 7FyrA0Olbv6B7SicSvVTZN (DesignSystemOffice-anna)
 */

import { AUTO_GENERATED_QA_MAP } from './figma-qa-map.auto';

export const FILE_KEY = '7FyrA0Olbv6B7SicSvVTZN';

/**
 * sys/svc 토큰이 정의된 라이브러리 파일 키.
 * 컴포넌트 파일의 boundVariables가 라이브러리 published variable을 참조하는 경우,
 * 라이브러리 파일의 /variables/local도 함께 호출해야 토큰 ID → 이름 매핑이 가능.
 */
export const LIBRARY_FILE_KEYS: readonly string[] = [
  '8vvb2YyUYKrKzn5GMiiyli', // 하이웍스 컬러 팔레트 v3
];

/**
 * 수동 관리 매핑.
 * Figma Boolean Component Property 등 자동 추출 불가 컴포넌트들.
 */
const MANUAL_QA_MAP: Record<string, string> = {
  // ── Timetable · TimeAxisCell ─────────────────────────────────────────────
  'tt-time-axis-hour': '600:2396',
  'tt-time-axis-halfhour': '600:2398',

  // ── Timetable · DateAxisCell ───────────────────────────────────────────
  'tt-date-axis-weekday': '644:60',
  'tt-date-axis-holiday': '644:66',
  'tt-date-axis-saturday': '644:64',

  // ── Timetable · TimeSlotCell ───────────────────────────────────────────
  'tt-timeslot-hour-enabled': '600:2410',
  'tt-timeslot-hour-enabled-selected': '600:4244',
  'tt-timeslot-hour-readonly': '600:4240',
  'tt-timeslot-hour-disabled': '600:4234',
  'tt-timeslot-halfhour-enabled': '600:2412',
  'tt-timeslot-halfhour-enabled-selected': '600:4245',
  'tt-timeslot-halfhour-readonly': '600:4239',
  'tt-timeslot-halfhour-disabled': '600:4235',

  // ── Timetable · DateSlotCell ───────────────────────────────────────────
  'tt-dateslot-enabled': '654:1654',
  'tt-dateslot-enabled-selected': '654:1655',
  'tt-dateslot-readonly': '654:1657',
  'tt-dateslot-disabled': '654:1659',

  // ── Timetable · ResourceHeader ─────────────────────────────────────────
  'tt-resource-header': '618:3897',

  // ── Timetable · ResourcePhoto ──────────────────────────────────────────
  'tt-resource-photo': '632:212',

  // ── Timetable · AxisCorner ─────────────────────────────────────────────
  'tt-axis-corner': '654:1396',

  // ── Timetable · SelectionBox ───────────────────────────────────────────
  'tt-selection-box': '650:67',

  // ── Timetable · NowIndicator ───────────────────────────────────────────
  'tt-now-indicator': '682:2',

  // ── Timetable · EventBlock ─────────────────────────────────────────────
  'tt-event-mine-confirmed': '770:933',
  'tt-event-mine-tentative': '763:16',
  'tt-event-mine-cancelled': '763:27',
  'tt-event-others-confirmed': '763:37',
  'tt-event-others-tentative': '763:47',
  'tt-event-others-cancelled': '763:57',

  // ── Table · Cell (Header) ────────────────────────────────────────────────
  // Header md만 매핑 (lg, Edit mode는 의도적 미매핑 — QA 페이지에서 사용하지 않음)
  'tbl-cell-header-md-center': '488:3108',
  'tbl-cell-header-md-left': '491:537',

  // ── Table · Cell (Data) ────────────────────────────────────────────────
  // Data md만 매핑 (lg는 의도적 미매핑)
  'tbl-cell-data-md-left': '488:3570',
  'tbl-cell-data-md-center': '488:3734',
  'tbl-cell-data-md-right': '488:3758',

  // ── Table · HeaderRow ──────────────────────────────────────────────────
  'tbl-header-row': '528:1511',

  // ── Table · Row (Enabled·None 기본만 매핑, 나머지 조합은 의도적 미매핑) ────
  'tbl-row-enabled': '550:2532',

  // ── Table · Table ──────────────────────────────────────────────────────
  'tbl-table-loaded': '558:7283',
  'tbl-table-empty': '592:5263',

  // ── Table · TableMessage ───────────────────────────────────────────────
  'tbl-message-empty': '592:5955',

  // ── LNB · Divider (단일 COMPONENT, variant 없음) ────────────────────────
  'lnb-divider': '361:1950',

  // ── Modal Shell (Figma `Modal` Component Set 312:994) ────────────────────
  // Variant 축은 Size만 (xs/sm/md/lg/xl/2xl). Has Supporting Text / _Close Button은
  // Boolean Component Property로, Variant child가 별도로 없음.
  // → Figma default(Has Supporting Text=true, _Close Button=false)에 정합하는
  //    `*-sup-noclose` 조합 6개만 매핑한다. 다른 18개 조합은 의도적으로 미매핑
  //    (dom-qa.spec.ts에서 unmapped warn 표시되지만 strict fail은 발생하지 않음).
  'modal-shell-xs-sup-noclose': '312:2195',
  'modal-shell-sm-sup-noclose': '309:1030',
  'modal-shell-md-sup-noclose': '312:995',
  'modal-shell-lg-sup-noclose': '312:1009',
  'modal-shell-xl-sup-noclose': '312:1023',
  'modal-shell-2xl-sup-noclose': '312:1037',

  // ── Modal Footer (Figma `_Footer` Component Set 311:958) ─────────────────
  // Variant 축 = Layout만. 나머지 3개(Has Left Checkbox / Has Left Option Link /
  // Has Secondary Button)는 Boolean Property → Figma default(모두 true) 조합 2개만 매핑.
  'modal-footer-spacebetween-lc-lol-sb': '309:1872', // Space Between · LC=T LOL=T SB=T
  'modal-footer-centered-sb-sb': '311:959', // Centered · SB=T (LC/LOL은 Centered에서 무효)
};

export const FIGMA_QA_MAP: Record<string, string> = {
  ...AUTO_GENERATED_QA_MAP,
  ...MANUAL_QA_MAP,
};
