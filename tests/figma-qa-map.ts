/**
 * qa-id → Figma node-id 매핑
 *
 * Figma 파일이 변경되어 node-id가 바뀌면 이 파일만 업데이트.
 * 파일 키: 7FyrA0Olbv6B7SicSvVTZN (DesignSystemOffice-anna)
 *
 * Figma variant 명명 규칙:
 *   Icon Position=none + Interaction=Rest 기준 스크린샷 사용
 */

export const FILE_KEY = '7FyrA0Olbv6B7SicSvVTZN';

/**
 * sys/svc 토큰이 정의된 라이브러리 파일 키.
 * 컴포넌트 파일의 boundVariables가 라이브러리 published variable을 참조하는 경우,
 * 라이브러리 파일의 /variables/local도 함께 호출해야 토큰 ID → 이름 매핑이 가능.
 */
export const LIBRARY_FILE_KEYS: readonly string[] = [
  '8vvb2YyUYKrKzn5GMiiyli', // 하이웍스 컬러 팔레트 v3
];

export const FIGMA_QA_MAP: Record<string, string> = {
  // ── Button · Brand · Solid ───────────────────────────────────────────────
  'btn-brand-solid-xs': '205:1217',
  'btn-brand-solid-sm': '205:1250',
  'btn-brand-solid-md': '205:1283',
  'btn-brand-solid-lg': '205:1316',
  'btn-brand-solid-xs-disabled': '205:1239',
  'btn-brand-solid-sm-disabled': '205:1272',
  'btn-brand-solid-md-disabled': '205:1305',
  'btn-brand-solid-lg-disabled': '205:1338',

  // ── Button · Brand · Outline ─────────────────────────────────────────────
  'btn-brand-outline-xs': '205:1349',
  'btn-brand-outline-sm': '205:1382',
  'btn-brand-outline-md': '205:1415',
  'btn-brand-outline-lg': '205:1448',
  'btn-brand-outline-xs-disabled': '205:1371',
  'btn-brand-outline-sm-disabled': '205:1404',
  'btn-brand-outline-md-disabled': '205:1437',
  'btn-brand-outline-lg-disabled': '205:1470',

  // ── Button · Brand · Text ────────────────────────────────────────────────
  'btn-brand-text-xs': '205:1481',
  'btn-brand-text-sm': '205:1514',
  'btn-brand-text-md': '205:1547',
  'btn-brand-text-lg': '205:1580',
  'btn-brand-text-xs-disabled': '205:1503',
  'btn-brand-text-sm-disabled': '205:1536',
  'btn-brand-text-md-disabled': '205:1569',
  'btn-brand-text-lg-disabled': '205:1602',

  // ── Button · Neutral · Solid ─────────────────────────────────────────────
  'btn-neutral-solid-xs': '205:1613',
  'btn-neutral-solid-sm': '205:1646',
  'btn-neutral-solid-md': '205:1679',
  'btn-neutral-solid-lg': '205:1712',
  'btn-neutral-solid-xs-disabled': '205:1635',
  'btn-neutral-solid-sm-disabled': '205:1668',
  'btn-neutral-solid-md-disabled': '205:1701',
  'btn-neutral-solid-lg-disabled': '205:1734',

  // ── Button · Neutral · Outline ───────────────────────────────────────────
  'btn-neutral-outline-xs': '205:1745',
  'btn-neutral-outline-sm': '205:1778',
  'btn-neutral-outline-md': '205:1811',
  'btn-neutral-outline-lg': '205:1844',
  'btn-neutral-outline-xs-disabled': '205:1767',
  'btn-neutral-outline-sm-disabled': '205:1800',
  'btn-neutral-outline-md-disabled': '205:1833',
  'btn-neutral-outline-lg-disabled': '205:1866',

  // ── Button · Neutral · Ghost ─────────────────────────────────────────────
  'btn-neutral-ghost-xs': '205:1877',
  'btn-neutral-ghost-sm': '205:1910',
  'btn-neutral-ghost-md': '205:1943',
  'btn-neutral-ghost-lg': '205:1976',
  'btn-neutral-ghost-xs-disabled': '205:1899',
  'btn-neutral-ghost-sm-disabled': '205:1932',
  'btn-neutral-ghost-md-disabled': '205:1965',
  'btn-neutral-ghost-lg-disabled': '205:1998',

  // ── Button · Destructive · Solid ─────────────────────────────────────────
  'btn-destructive-solid-xs': '205:2009',
  'btn-destructive-solid-sm': '205:2042',
  'btn-destructive-solid-md': '205:2075',
  'btn-destructive-solid-lg': '205:2108',
  'btn-destructive-solid-xs-disabled': '205:2031',
  'btn-destructive-solid-sm-disabled': '205:2064',
  'btn-destructive-solid-md-disabled': '205:2097',
  'btn-destructive-solid-lg-disabled': '205:2130',

  // ── Button · Critical · Solid ────────────────────────────────────────────
  'btn-critical-solid-xs': '205:2141',
  'btn-critical-solid-sm': '205:2174',
  'btn-critical-solid-md': '205:2207',
  'btn-critical-solid-lg': '205:2240',
  'btn-critical-solid-xs-disabled': '205:2163',
  'btn-critical-solid-sm-disabled': '205:2196',
  'btn-critical-solid-md-disabled': '205:2229',
  'btn-critical-solid-lg-disabled': '205:2262',

  // ── ButtonIconOnly · Brand · Solid ───────────────────────────────────────
  'btn-icon-brand-solid-xs': '232:1210',
  'btn-icon-brand-solid-sm': '232:1216',
  'btn-icon-brand-solid-md': '232:1222',
  'btn-icon-brand-solid-xs-disabled': '232:1214',
  'btn-icon-brand-solid-sm-disabled': '232:1220',
  'btn-icon-brand-solid-md-disabled': '232:1226',

  // ── ButtonIconOnly · Brand · Outline ─────────────────────────────────────
  'btn-icon-brand-outline-xs': '232:1228',
  'btn-icon-brand-outline-sm': '232:1234',
  'btn-icon-brand-outline-md': '232:1240',
  'btn-icon-brand-outline-xs-disabled': '232:1232',
  'btn-icon-brand-outline-sm-disabled': '232:1238',
  'btn-icon-brand-outline-md-disabled': '232:1244',

  // ── ButtonIconOnly · Brand · Text ────────────────────────────────────────
  'btn-icon-brand-text-xs': '232:1246',
  'btn-icon-brand-text-sm': '232:1252',
  'btn-icon-brand-text-md': '232:1258',
  'btn-icon-brand-text-xs-disabled': '232:1250',
  'btn-icon-brand-text-sm-disabled': '232:1256',
  'btn-icon-brand-text-md-disabled': '232:1262',

  // ── ButtonIconOnly · Neutral · Solid ─────────────────────────────────────
  'btn-icon-neutral-solid-xs': '232:1264',
  'btn-icon-neutral-solid-sm': '232:1270',
  'btn-icon-neutral-solid-md': '232:1276',
  'btn-icon-neutral-solid-xs-disabled': '232:1268',
  'btn-icon-neutral-solid-sm-disabled': '232:1274',
  'btn-icon-neutral-solid-md-disabled': '232:1280',

  // ── ButtonIconOnly · Neutral · Outline ───────────────────────────────────
  'btn-icon-neutral-outline-xs': '232:1282',
  'btn-icon-neutral-outline-sm': '232:1288',
  'btn-icon-neutral-outline-md': '232:1294',
  'btn-icon-neutral-outline-xs-disabled': '232:1286',
  'btn-icon-neutral-outline-sm-disabled': '232:1292',
  'btn-icon-neutral-outline-md-disabled': '232:1298',

  // ── ButtonIconOnly · Neutral · Ghost ─────────────────────────────────────
  'btn-icon-neutral-ghost-xs': '232:1300',
  'btn-icon-neutral-ghost-sm': '232:1306',
  'btn-icon-neutral-ghost-md': '232:1312',
  'btn-icon-neutral-ghost-xs-disabled': '232:1304',
  'btn-icon-neutral-ghost-sm-disabled': '232:1310',
  'btn-icon-neutral-ghost-md-disabled': '232:1316',

  // ── ButtonIconOnly · Destructive · Solid ─────────────────────────────────
  'btn-icon-destructive-solid-xs': '232:1318',
  'btn-icon-destructive-solid-sm': '232:1324',
  'btn-icon-destructive-solid-md': '232:1330',
  'btn-icon-destructive-solid-xs-disabled': '232:1322',
  'btn-icon-destructive-solid-sm-disabled': '232:1328',
  'btn-icon-destructive-solid-md-disabled': '232:1334',

  // ── ButtonIconOnly · Critical · Solid ────────────────────────────────────
  'btn-icon-critical-solid-xs': '232:1336',
  'btn-icon-critical-solid-sm': '232:1342',
  'btn-icon-critical-solid-md': '232:1348',
  'btn-icon-critical-solid-xs-disabled': '232:1340',
  'btn-icon-critical-solid-sm-disabled': '232:1346',
  'btn-icon-critical-solid-md-disabled': '232:1352',

  // ── LNB · NavItem (Figma `_Base Nav Item` Component Set 338:1126) ────────
  // Variant 축: Level × Availability × Interaction × Selected × DND State
  // qa-id는 Interaction=Rest · DND State=None · Selected=False 기준 (Disabled는 별도)
  'lnb-nav-l1-rest': '338:1127', // Level=1, Enabled, Rest, Selected=False, DND=None
  'lnb-nav-l2-rest': '346:427', // Level=2
  'lnb-nav-l3-rest': '346:571', // Level=3
  'lnb-nav-l1-selected': '338:1914', // Selected=True
  'lnb-nav-l2-selected': '346:463',
  'lnb-nav-l3-selected': '346:607',
  // NavItem 컴포넌트의 stateLabel은 disabled 단일 키(`-rest-` 접두 없음) — `NavItem.tsx:127`
  'lnb-nav-l1-disabled': '338:1956', // Availability=Disabled
  'lnb-nav-l2-disabled': '346:445',
  'lnb-nav-l3-disabled': '346:589',
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
  'tbl-cell-header-md-center': '488:3108',
  'tbl-cell-header-md-left': '491:537',

  // ── Table · Cell (Data) ────────────────────────────────────────────────
  'tbl-cell-data-md-left': '488:3570',
  'tbl-cell-data-md-center': '488:3734',
  'tbl-cell-data-md-right': '488:3758',

  // ── Table · HeaderRow ──────────────────────────────────────────────────
  'tbl-header-row': '528:1511',

  // ── Table · Row ────────────────────────────────────────────────────────
  'tbl-row-enabled': '550:2532',

  // ── Table · Table ──────────────────────────────────────────────────────
  'tbl-table-loaded': '558:7283',
  'tbl-table-empty': '592:5263',

  // ── Table · TableMessage ───────────────────────────────────────────────
  'tbl-message-empty': '592:5955',

  // ── LNB · SectionHeader (Figma `_Section Header` Component Set 338:2489) ─
  // Variant 축: Level × Availability × Interaction × DND State
  // expanded/collapsed 시각 차이는 Variant가 아니라 chevron 회전(코드 Boolean)이라
  // expanded·collapsed 두 qa-id를 동일 base node에 매핑 (시각상 동일 박스 영역).
  'lnb-section-l1-expanded': '338:2490', // Level=1, Enabled, Rest, DND=None
  'lnb-section-l2-expanded': '349:194', // Level=2
  'lnb-section-l1-collapsed': '338:2490', // expanded와 동일 base (chevron만 회전)
  'lnb-section-l2-collapsed': '349:194',
  // SectionHeader 컴포넌트의 stateLabel도 disabled 단일 키 — `SectionHeader.tsx:97`
  'lnb-section-l1-disabled': '338:2508', // Availability=Disabled
  'lnb-section-l2-disabled': '349:212',

  // ── LNB · ActionButton (Figma `_LNB Action Button` 363:721) · Divider ────
  'lnb-action-rest': '363:720', // Enabled, Rest
  'lnb-action-rest-disabled': '363:727', // Disabled, Rest
  'lnb-divider': '361:1950', // 단일 COMPONENT (variant 없음)

  // ── TextInput (Figma `TextInput` Component Set 216:4816) ─────────────────
  // 기준: Alignment=Left, Style=Boxed, Interaction=Rest (코드 default)
  // Variant 축: Size × Alignment × Availability × Interaction × Validation × Style
  'input-sm-enabled-none': '295:656',
  'input-sm-disabled-none': '216:4768',
  'input-md-enabled-none': '263:353',
  'input-md-enabled-error': '263:374',
  'input-md-enabled-success': '278:3186',
  'input-md-disabled-none': '263:381',
  'input-md-readonly-none': '263:388',
  'input-lg-enabled-none': '263:490',
  'input-lg-disabled-none': '263:518',

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
