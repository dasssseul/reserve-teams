# Timetable

> **Hiworks Design System v3** · Service Component · **Data Display 카테고리** (확장) · Office 분기 빌드 (HR 후행)
> 단일 기준 문서: `hiworks-ds-guide.md` · 정책: `component-property-policy.md` v3.12 · 운영: `session-sync-protocol.md`
> 최초 작성: 2026-05-26 (v0.1 봉인) — Phase 1 초안
> v0.2 봉인: 2026-05-29 — Phase 2 Figma 마스터 빌드 완성. 가족 트리 Public 2+PSC 6 → Public 3+PSC 11 (시간/날짜 시나리오 분리). 신규 토큰 7건 + 재사용 1건 + 명문화 1건. 정책 신설/확장 5건. v0.1 §12 안건 #5/#6 해소.
> v0.3 봉인: 2026-05-29 — Phase 3a. **State Variant 미운영(NO) 결정** (안건 #4 🔒 종결). 사유: EventBlock은 overlay 데이터 / 그리드(시간·날짜축 + 자원 컬럼)는 상시 존재하는 구조물 → "예약 0건" = *빈 그리드 자체가 empty 표현*. table v1.7 *row=content* 전제(Empty/Loading이 행 영역 대체)와 구조 상이 → 동형 부적합. Loading 표현·메시지 PSC·skeleton 모두 미운영. Density(안건 #10) 다음 회차 보류 재확인. **신규 컴포넌트·토큰·Variant·PSC 매트릭스 변경 0건.**
> v0.4 봉인: 2026-05-29 — 사이즈 실측 정정 3건 (모두 Anna Figma 선작업, 재개 트리거 ②). ①그리드 셀 높이 통일 32px → **시간 24 / 날짜 40** 분리 ②**EventBlock 마스터 높이 62→48** (1시간=2×24 정합) + 제목↔부제 gap `spacing/5xs`(1px) ③**Timetable·Datetable Top Line** 1px `sys/stroke/neutral/subtle/default` 추가 (Table v1.6 *Top Line 레이어* 동형). 하드코딩 유지 · **신규 토큰·컴포넌트·Variant·PSC 0건**. 셀 높이 토큰화 안건 #12 예약. 새 PSC 추가 차기 회차 분리.
> v0.5 봉인: 2026-05-29 — 신규 PSC **_NowIndicator**(현재시간 표시선) 정의. Overlay Slot 거주·시간 시나리오 전용·**solid + red**. PSC 11→12. **신규 sys 토큰 1건**(`sys/stroke/calendar/now-indicator` #d84a49, global 추가 0) · Variant 0. brand blue 회피(EventBlock.Mine.Confirmed·_SelectionBox 색 충돌)·dashed 미운영(=_SelectionBox 전용 정합).
> v0.6 봉인: 2026-06-02 — `_ResourcePhoto` 종횡비 박스 → 고정 높이 98px 환원 (폭 가변 시 소수 높이 전파 정정, 재개 트리거 ②). 하드코딩 유지 · **신규 토큰·컴포넌트·Variant·PSC 0건**. Figma 재바인딩 Anna 수동.
> v0.7 봉인: 2026-06-04 — **점유 슬롯 드래그 차단 규칙** 명문화(_SelectionBox 빈 슬롯 전용, 중복 예약 미허용) → _SelectionBox↔EventBlock 공간 배타 → 색 겹침 충돌 비발생 → **EventBlock.Mine.Confirmed brand strong 채움 유지**(좌측 막대+흰 배경 실험안 폐기, 트리거 ② 불성립). **신규 토큰·컴포넌트·Variant·PSC 0건**.
> **최종 갱신: 2026-06-04 (v0.8 봉인)** — EventBlock 색 스킴 **전면 재설계**: brand strong 채움(#1c7fd3)+inverse white **폐기** → **12 variant 공통 "좌측 3px 막대(`sys/border/width/thick`) + 배경틴트 + 본문 텍스트"** 체계. 막대 색이 소유(Mine/Others)×상태(Confirmed/Tentative/Cancelled) 인코딩. Cancelled에 **취소선(line-through)** 신규. **재개 트리거 ⑤(디자인 오너 직권 재설계, 신설)** 적용 — v0.2 #18 / v0.7 #49 supersede, 정책방 비준 완료. 신규 토큰 1건(`service/office/stroke/brand/subtle/default` #98caf4 → global sky_blue/80, 등재 완료). Figma node 763:2 실측(253:8826/8856 폐기).

---

## 1. 개요

| 항목 | 값 |
|---|---|
| **Public 컴포넌트** | `Timetable` (시간 시나리오) · `Datetable` (날짜 시나리오) · `EventBlock` |
| **PSC 12** | `_TimeAxisCell` · `_TimeAxisColumn` · `_TimeSlotCell` · `_DateAxisCell` · `_DateAxisColumn` · `_DateSlotCell` · `_AxisCorner` · `_ResourceHeader` · `_ResourceColumn` · `_ResourcePhoto` · `_SelectionBox` · `_NowIndicator` |
| 분류 | **Service Component** — brand 시각 보유 (EventBlock.Mine = office brand 막대/bg [v0.8], *SlotCell.Selected=brand normal) → [[feedback_component_layer_split]] 원칙 A 정합 |
| 카테고리 | **Data Display 확장** — Table family와 동형 분류 |
| 브랜드 | Office (HR 후행) |
| 참조 토큰 | `service/office/*` + `sys/*` (Calendar / border.style / opacity 카테고리 운영) |
| 범위 (시간 시나리오) | 회의실 예약 등 시간×자원 그리드 |
| 범위 (날짜 시나리오) | 콘도 예약 등 날짜×자원 그리드 |
| 범위 외 | Calendar Panel · 반복 예약 · 시간대 변환 · React 구현 (Phase 4) · HR 브랜드 |

> **v0.1 → v0.2 핵심 변경**: ①시간/날짜 시나리오 분리 (Time/Date prefix 일관) ②_SlotCell → _TimeSlotCell rename + _DateSlotCell 신설 ③_AxisCorner PSC 신설 (Time/Date 공통 단일) ④_ResourceColumn.Mode Variant 분기 ⑤Datetable Public 신설 ⑥EventBlock 시각 위계 정밀화 (Mine.Confirmed = brand strong + Inverse 고정).

---

## 2. 컴포넌트 가족

```
[Public 컨테이너]
  Timetable                ← 시간 시나리오 컨테이너
  Datetable                ← 날짜 시나리오 컨테이너 (신규 v0.2)

[축 PSC — 시간축]
  _TimeAxisColumn          ← 시간축 세로 묶음 (_TimeAxisCell × N)
  _TimeAxisCell            ← 시간축 단위 셀 (Format=Hour/HalfHour)

[축 PSC — 날짜축]
  _DateAxisColumn          ← 날짜축 세로 묶음 (_DateAxisCell × N)
  _DateAxisCell            ← 날짜축 단위 셀 (Day Type=Weekday/Saturday/Holiday)

[축 공통 PSC]
  _AxisCorner              ← 축 시작점 코너 (Time/Date 공통, 자원 헤더 row와 수직 정렬)

[자원축 PSC]
  _ResourceColumn          ← 자원 컬럼 (Mode=Time/Date Variant)
  _ResourceHeader          ← 자원 라벨 헤더 (Has Leading=Tag / Has Trailing=Tooltip)
  _ResourcePhoto           ← 자원 사진 (4:3, Optional)

[그리드 셀 PSC]
  _TimeSlotCell            ← 시간 시나리오 슬롯 (Format × Availability × Interaction × Selected)
  _DateSlotCell            ← 날짜 시나리오 슬롯 (Availability × Interaction × Selected, Format 미운영)

[Public Service Component — 이벤트]
  EventBlock               ← 예약 블록 (Is Mine × Status × Interaction)

[오버레이 PSC]
  _SelectionBox            ← 드래그 임시 영역 (dashed + opacity/dragging)
  _NowIndicator            ← 현재시간 표시선 (시간 시나리오 전용, solid red, v0.5 신규)
```

> **Time/Date prefix 일관 명명 패턴** (Anna 결정 2026-05-29): 책임 동형 컴포넌트도 시나리오 분리. 명명 prefix 일관성 + 시각 정합 우선. AI 학습 친화성 강함 — *prefix 패턴 인식 + 시나리오 명확화*.

---

## 3. `Timetable` — 시간 시나리오 Public 컨테이너

### 3-1. Property
- **variant 0개** 단일 컴포넌트 (table v1.5 *_Table* 패턴 동형)

### 3-2. Slot 구성

| Slot | 구성 |
|---|---|
| Header Slot (Optional) | `_AxisCorner` + `_ResourceHeader × N` |
| Body Slot | `_TimeAxisColumn × 1` + `_ResourceColumn(Mode=Time) × N` |
| **Overlay Slot** | **Container Overlay Slot 패턴** (Auto Layout OFF, layoutPositioning ABSOLUTE) — `EventBlock × N` + `_SelectionBox` |

### 3-3. 빌더 운영 룰
- _AxisCorner 높이 = _ResourceHeader (42) + _ResourcePhoto (98, Optional) = **140** 또는 **42** (Photo 미운영 시)
- 마지막 _ResourceColumn 인스턴스: `strokeRightWeight=0` override (table v1.3.3 *마지막 컬럼 인스턴스 override* 패턴)
- EventBlock 인스턴스 height = N cells × cell_height (cell_height = 24 시간 / 40 날짜, v0.4)
- **Top Line** (v0.4): 컨테이너 최상단 별도 1px Line 레이어 = `sys/stroke/neutral/subtle/default`. Table v1.6 *Top Line 레이어* 동형 (Layer Panel 가시성 + 상단 닫힘 일관). 하단 외곽선 미운영 (상단만)

---

## 3b. `Datetable` — 날짜 시나리오 Public 컨테이너 (신규 v0.2)

### 3b-1. Property
- **variant 0개** 단일 컴포넌트

### 3b-2. Slot 구성

| Slot | 구성 |
|---|---|
| Header Slot (Optional) | `_AxisCorner` + `_ResourceHeader × N` |
| Body Slot | `_DateAxisColumn × 1` + `_ResourceColumn(Mode=Date) × N` |
| Overlay Slot | Container Overlay Slot 패턴 — `EventBlock × N` + `_SelectionBox` |

→ Timetable과 책임 동형. *_TimeAxisColumn → _DateAxisColumn* / *_ResourceColumn.Mode=Time → Date* 차이만. **Top Line도 동일 적용** (1px `sys/stroke/neutral/subtle/default`, v0.4).

### 3b-3. Public 분리 사유
- 시간(48 cells × **24px** = 1152) vs 날짜(31 cells × **40px** = 1240) — 셀 높이·시나리오 차이 (v0.4 정정: 통일 32 → Time 24 / Date 40)
- *책임 동형이지만 시각 정합 강조* — Time/Date prefix 일관 명명 패턴 적용

---

## 4. `_TimeAxisCell` / `_TimeAxisColumn` — 시간축

### 4-1. `_TimeAxisColumn`
- **variant 0개** 단일 컴포넌트
- 24h × 30분 단위 = **48 cells** Auto Layout 세로
- 너비 100 / **셀 높이 24px** (v0.4 — 통일 32 → 시간 셀 축소) → 48 cells Auto Layout 세로 (컬럼 총높이 가변, Compact 라벨)
- 빌더 운영 룰: 시작/끝 시간에 따라 cell 인스턴스 trim (Auto Layout 가변)

### 4-2. `_TimeAxisCell.Format` Property

| Format | 시각 | 의미 |
|---|---|---|
| `Hour` | text 표시 ("09:00") + border-bottom `stroke/neutral/subtle/default` + **dashed** | 셀 아래쪽 = 30분 보조 분기 |
| `HalfHour` | text transparent + border-bottom `stroke/neutral/subtle/default` + **solid** | 셀 아래쪽 = 정각 주요 분기 |

> **border-bottom = 셀 아래쪽 분기 의미** ([[feedback_border_bottom_semantic]]) — 셀 자체 위계가 아닌 *다음 분기점* 기준. 일반 캘린더 컨벤션 정합.

### 4-3. 명명 결정 — `Format` 어휘 유지
- *Format* = 시각 표현 형식 (label 유무, border style)
- *Mode*(책임 분기)와 의미 차별 — table _Cell Content.Data Format 사례 정합
- _TimeSlotCell.Format과 일관 어휘

---

## 4b. `_DateAxisCell` / `_DateAxisColumn` — 날짜축

### 4b-1. `_DateAxisColumn`
- **variant 0개** 단일 컴포넌트
- N일 분량 cells Auto Layout 세로 (콘도 등 시나리오별 가변) — **셀 높이 40px** (v0.4 — 통일 32 → 날짜 셀 확대)
- 빌더 운영 룰: 시작/끝 날짜에 따라 cell 인스턴스 추가

### 4b-2. `_DateAxisCell.Day Type` Property

| Day Type | text color 토큰 | hex |
|---|---|---|
| Weekday | `sys/text/calendar/weekday` | #333333 |
| Saturday | `sys/text/calendar/saturday` | #0062c1 |
| Holiday | `sys/text/calendar/holiday` | #d84a49 |

> **Calendar 시멘틱 카테고리 신설** (sync §4-2, 2026-05-29) — informative/alert 재사용 회피, 의미 단일성. Office sky_blue 미참조 (sys-level intent). *Holiday는 Sunday + 공휴일 통합*.

### 4b-3. 공통 시각
- bg `bg/neutral/faint/default` (#fff)
- border-bottom `stroke/neutral/subtle/default` solid (일별 분리)
- typo `sys/typo/body/md/regular`

---

## 4c. `_AxisCorner` — 축 시작점 코너 (신규 v0.2)

### 4c-1. Property
- **variant 0개** 단일 컴포넌트
- 너비 = axis column 너비 (100, 또는 _ResourceHeader 너비 정합)
- 높이 가변 = _ResourceHeader (42) + _ResourcePhoto (98, Optional) = 140 또는 42

### 4c-2. 시각
- bg `bg/neutral/faint/default` 또는 placeholder
- border-bottom `stroke/neutral/subtle/default`

### 4c-3. 책임
- 시간/날짜 axis **공통** (Time/Date 무관 단일 컴포넌트)
- 자원 헤더 row와 수직 정렬 의무
- AI 학습 친화성 ⭐ — Excel·Spreadsheet *grid corner cell* 패턴 정합

---

## 5. `_ResourceColumn` / `_ResourceHeader` / `_ResourcePhoto` — 자원축

### 5-1. `_ResourceColumn.Mode` Property (Variant)

| Mode | 구성 |
|---|---|
| `Time` | _ResourceHeader + _ResourcePhoto(Optional) + _TimeSlotCell × 48 (Compact) |
| `Date` | _ResourceHeader + _ResourcePhoto(Optional) + _DateSlotCell × N |

- right border `stroke/neutral/subtle/default` 1px solid — **세로 분리선** (table v1.3.3 *_Cell 본체 우측 stroke 기본 운영* 동형)
- 마지막 컬럼: 인스턴스 단위 `strokeRightWeight=0` override

### 5-2. `_ResourceHeader` Property

| Property | Values | 시각 책임 |
|---|---|---|
| `Has Leading` | True / False | Tag instance swap (자원 메타 — 운영여부 등) |
| `Has Trailing` | True / False | Tooltip trigger instance swap (i 아이콘 hover) |

- 자원명 text: `sys/typo/label/md/semibold` 본체 input (instance 단위)
- bg `bg/neutral/faint/default`
- border-bottom `stroke/neutral/normal/default` (헤더 row 강조 — 본문보다 진함)

### 5-3. `_ResourcePhoto`
- **variant 0개** 단일. **높이 고정 98px** (resize = Fixed height, *aspect-ratio 박스 금지*) — 마스터 4:3(131×98) 기준값. layer 하드코딩
  - ⚠️ 종횡비 박스(`aspect`)로 두면 컬럼 폭이 가변(아이템 수에 따라)일 때 `폭 × 0.75`가 소수가 되어 _AxisCorner·컬럼·Timetable 전체 높이가 소수로 전파됨 (v0.6 정정)
- border-bottom only (axis cell family border-bottom 패턴 정합)
- bg image fill (instance 단위 swap, cover — 폭 가변 시 크롭, 높이 98 고정 유지)

### 5-4. Operating 어휘 검토 결과 (v0.2)
- 옛 권고: `Operating: T/F` Property 도입
- **최종**: 폐기 — DS v3 표준 `Availability=Enabled/Disabled` 어휘 재사용 정합. _ResourceHeader 현 시점 Property 미운영 (필요 시 추가)

---

## 6. `_TimeSlotCell` — 시간 시나리오 슬롯 (rename from _SlotCell, v0.2)

> **셀 높이 24px** (v0.4 — _TimeAxisCell와 동일, 통일 32에서 축소). layer 하드코딩.

### 6-1. Property 매트릭스

| Property | Values | 비고 |
|---|---|---|
| `Format` | `Hour` / `HalfHour` | _TimeAxisCell.Format과 일관 |
| `Availability` | `Enabled` / `Disabled` / `ReadOnly` | DS v3 표준. ReadOnly=관리자 임시 차단 |
| `Interaction` | `Rest` / `Hover` | **Pressed 미운영** (LNB 패턴 적용) |
| `Selected` | `True` / `False` Boolean | table v1.3 *Selected: T/F vs Selection: enum 책임 분리* 패턴 |

### 6-2. 운영 variant (10)

| Format | Variant 운영 |
|---|---|
| Hour | Enabled.Rest.F, Enabled.Rest.T, Enabled.Hover.F, Disabled.Rest.F, ReadOnly.Rest.F (5) |
| HalfHour | 동형 (5) |

### 6-3. 활성 제어 룰

| 차단 조합 | 사유 |
|---|---|
| `Selected=True × Hover` | LNB 패턴 — Selected 영구 강조, Hover 영향 안 받음 |
| `Disabled × {Hover, Selected=True}` | Availability-Property 활성 제어 (table v1.3.6) |
| `ReadOnly × {Hover, Selected=True}` | 동일 |

### 6-4. 시각 매핑

| Variant | bg | border (Format별 차등) |
|---|---|---|
| Enabled.Rest.F | `bg/neutral/faint/default` (#fff) | Hour=dashed subtle / HalfHour=solid subtle |
| Enabled.Hover.F | `bg/neutral/faint/active` (#f7f7f7) | 동일 (*.active 슬롯 공유) |
| Enabled.Rest.T | `office/bg/brand/normal/default` (#d8e9fb) — LNB Selected 패턴 동형 | 동일 |
| Disabled.Rest.F | `bg/neutral/strong/disabled` (#c4c4c4) — *영구 차단 강한 시각* | 동일 |
| ReadOnly.Rest.F | `bg/neutral/faint/disabled` (#eaeaea) — *임시 차단 약한 시각* | 동일 |

### 6-5. LNB 패턴 적용 (Pressed 미운영)
- 클릭/드래그 → 즉시 `Selected=True` 발현 — Pressed 시각 표현 가치 없음
- sync §4-2 *LNB 패턴 적용 범위 확장 (SlotCell 2번째 사례, 2026-05-29)* 정합

---

## 6b. `_DateSlotCell` — 날짜 시나리오 슬롯 (신규 v0.2)

> **셀 높이 40px** (v0.4 — _DateAxisCell와 동일, 통일 32에서 확대). layer 하드코딩.

### 6b-1. Property 매트릭스 (Format 미운영)

| Property | Values |
|---|---|
| `Availability` | `Enabled` / `Disabled` / `ReadOnly` |
| `Interaction` | `Rest` / `Hover` |
| `Selected` | `True` / `False` Boolean |

→ 운영 variant **5** (활성 제어 적용): Enabled.{Rest×{F,T}, Hover.F} + Disabled.Rest.F + ReadOnly.Rest.F

### 6b-2. 시각
- _TimeSlotCell와 bg 매핑 동일
- border-bottom: solid + `stroke/neutral/subtle/default` (일별 분리, Format 차등 없음)

### 6b-3. _TimeSlotCell과 별도 PSC 사유
- 책임 동형이지만 *Format 차원 부재* (Hour/HalfHour 의미 없음)
- *Time/Date prefix 일관성* 우선
- AI 학습: 시나리오 명확화

---

## 7. `EventBlock` — Public Service Component

### 7-1. Property 매트릭스 (12 variant + 2 Boolean layer-bind)

| Property | Values | 비고 |
|---|---|---|
| `Is Mine` | `True` / `False` Boolean | Mine=brand 시각 / Others=neutral |
| `Status` | `Confirmed` / `Tentative` / `Cancelled` | 비즈니스 도메인 상태 |
| `Interaction` | `Rest` / `Hover` | Pressed 미운영 (모달 trigger 패턴) |
| **`Has Time`** | `True` / `False` Boolean | **Component Property + layer visibility bind** — 시간 라벨 ("10:00 - 11:00") 토글. variant 폭증 회피 |
| **`Has Author`** | `True` / `False` Boolean | **Component Property + layer visibility bind** — 예약자명 ("이하이") 토글. variant 폭증 회피 |

### 7-2. 활성 제어 — 12 variant 모두 운영
- Cancelled × Hover도 운영 (Anna 결정 — 취소 예약 클릭 시 상세 모달 trigger 가능)

### 7-3. 시각 매트릭스 (Rest 기준) — v0.8 봉인

> **봉인.** 아래는 Figma node 763:2(2026-06-04 실측) 기준 신 매트릭스. **직전 봉인(v0.7) = brand strong 채움**(§11-1f #49)을 supersede(재개 트리거 ⑤, 정책방 비준 완료). 옛 brand strong 매트릭스 이력은 §11-1f·§11-1g 참조.
>
> **공통 구조**: 12 variant 전부 **좌측 3px 막대**(`sys/border/width/thick`, solid, 좌측 only) + 배경틴트 + 본문 텍스트. 박스 모델·typo·Has Time/Author는 §7-5 유지.

| Variant | bg | 좌측 막대 3px (border-left) | text |
|---|---|---|---|
| **Mine.Confirmed** ⭐ | `office/bg/brand/normal/default` (#d8e9fb) | **`office/stroke/brand/normal/default`** (#1c7fd3) | `text/neutral/normal/default` (#333) |
| Mine.Tentative | `office/bg/brand/subtle/default` (#e6eff9) | **`office/stroke/brand/subtle/default`** (#98caf4) 🆕 | `text/neutral/subtle/default` (#676767) |
| Mine.Cancelled | `bg/neutral/muted/default` (#f7f7f7) | `stroke/neutral/subtle/default` (#d6d6d6) | `text/neutral/faint/default` (#aeaeae) + **취소선** |
| Others.Confirmed | `bg/neutral/muted/default` (#f7f7f7) | `stroke/neutral/strong/default` (#676767) | `text/neutral/normal/default` (#333) |
| Others.Tentative | `bg/neutral/muted/default` (#f7f7f7) | `stroke/neutral/normal/default` (#c4c4c4) | `text/neutral/subtle/default` (#676767) |
| Others.Cancelled | `bg/neutral/muted/default` (#f7f7f7) | `stroke/neutral/subtle/default` (#d6d6d6) | `text/neutral/faint/default` (#aeaeae) + **취소선** (Mine과 통일) |

→ **Hover**: bg만 `*.active` 공유, **막대 색·text 유지**. Mine.Confirmed→`office/bg/brand/normal/active`(#badbf8) / Mine.Tentative→`office/bg/brand/subtle/active`(#d7ebfc) / Others·Cancelled(neutral muted)→`bg/neutral/muted/active`(#eaeaea).
→ 🆕 `office/stroke/brand/subtle/default`(#98caf4) = **등재 완료** (`tokens/service-tokens.json` → global sky_blue/80 참조, brand stroke 램프 채움. §10-6 · 안건 #15 종결).

### 7-4. 시각 위계 — v0.8 봉인

> v0.8 재설계: 위계를 **bg 틴트 + 좌측 막대 색 농도**로 인코딩(채움 강조 제거). 막대 색 농도 = 식별 우선순위.

| 강도 | Variant | 막대 / bg | 의미 |
|---|---|---|---|
| ⭐⭐⭐ | **Mine.Confirmed** | brand normal 막대(#1c7fd3) + brand normal bg | 내 예약 즉시 식별 |
| ⭐⭐ | Others.Confirmed | neutral strong 막대(#676767) + neutral muted bg | 타인 확정 |
| ⭐ | Mine.Tentative | brand subtle 막대(#98caf4) + brand subtle bg | 내 임시 |
| ⭐ | Others.Tentative | neutral normal 막대(#c4c4c4) + neutral muted bg | 타인 임시 |
| × | Cancelled (Mine·Others 통일) | neutral subtle 막대(#d6d6d6) + faint text + **취소선** | 취소 |

→ AI 학습 친화성 강함 — Mine = brand 색 막대/bg, Others = neutral 막대/muted bg로 *소유 구분이 색상 계열로 즉시 인코딩*. Google Calendar 좌측 컬러바 패턴 정합.

### 7-5. 텍스트 구성 · 박스 모델
- **마스터 기본 높이 48px** (v0.4 — 62→48, 1시간=2×24 셀 정합). 실사용 height = N cells × cell_height (overlay 가변)
- padding: px `spacing/sm`(10) · py `spacing/3xs`(4) · 제목↔부제 세로 gap `spacing/5xs`(1px, v0.4 — 48 정밀 정합: 4+21+1+18+4)
- 제목: `sys/typo/body/md/semibold` (14px SemiBold) — *높이 축소 시에도 14px 유지* (13px drift 환원, v0.4 #40)
- 부제 (flex container, gap `spacing/2xs` 6px):
  - 시간 layer: `sys/typo/caption/md/regular` — Has Time visibility bind
  - 예약자 layer: `sys/typo/caption/md/regular` — Has Author visibility bind
- 4 조합 운영: 둘 다 표시 / 시간만 / 예약자만 / 둘 다 숨김

### 7-6. Cancelled.Is Mine 시각 통일 패턴
- *취소된 예약은 누구 것이든 동일 시각* — Property는 데이터 모델 분리, 시각은 통일 (bg neutral muted + 막대 neutral subtle + text faint, Mine·Others 동일)
- 회귀 차단: Cancelled에 brand 시각 환수 금지
- **v0.8 신규: 제목 `line-through`(취소선)** — Confirmed/Tentative와 즉시 변별. neutral 통일 원칙(v0.2 #19) 유지 위에 취소선만 추가 (결정 #54).

### 7-7. dashed 미운영 (v0.2 정정 · v0.8 재확인)
- 옛 1차: Tentative=dashed border
- v0.2~v0.7: **dashed = _SelectionBox 전용 원칙** — Tentative=solid border + 색·text 약화로 차등
- **v0.8**: 전 variant 좌측 막대는 **solid**(dashed 아님) → dashed=_SelectionBox 전용 원칙 **유지**(위반 없음). Tentative 차별화는 *막대 색 약화(subtle) + bg subtle + text subtle*로 흡수(전체 박스 border 폐기).

---

## 8. `_SelectionBox` — 드래그 임시 영역

### 8-1. Property
- **variant 0개** 단일 컴포넌트
- 100 × 64 placeholder (instance 단위 width/height 조정)

### 8-2. 시각
- bg `office/bg/brand/normal/default` (#d8e9fb) + **`sys/opacity/dragging` (50%)** — table v1.4.1 토큰 **재사용** (v0.1 §12 #6 해소)
- border `office/stroke/brand/normal/default` (#1c7fd3) + **dashed** (`sys/border/style/dashed` 신설)
- radius `radius/sm` (4)

### 8-3. dashed = _SelectionBox 전용 원칙
- EventBlock·Table 등 데이터 표시 컴포넌트 dashed 환수 회귀 차단 (sync §4-2, 2026-05-29)
- 시각 차등은 *solid border 색 + text 약화*로 표현

### 8-4. 빈 슬롯 전용 — 점유 슬롯 드래그 차단 (v0.7, 2026-06-04)
- **_SelectionBox는 빈 슬롯에서만 발현.** EventBlock이 점유한 슬롯 위로의 드래그 생성은 **차단**(불가) — 중복 예약 미허용.
- 귀결: _SelectionBox ↔ EventBlock는 **공간적으로 상호 배타** → 둘이 겹쳐 그려지는 상황이 원천 비발생.
- 영향: "brand 채움 EventBlock 위에 _SelectionBox(파란 dashed)가 올라가면 경계선이 안 보인다"는 **충돌 시나리오 자체가 비발생** (드래그 차단 규칙 #48은 v0.8에서도 유효). ⚠️ *단, 본 규칙이 정당화하던 "brand strong 채움 유지"(v0.7 #49) 결론은 v0.8 #50에서 supersede됨* — EventBlock은 좌측 막대 체계로 전환(§7-3). 드래그 차단 규칙 자체는 색 스킴과 독립이라 불변.
- §13 드래그 인터랙션 명세와 정합. (Anna 결정 2026-06-04, 재개 트리거 ② 불성립 확인)

---

## 8c. `_NowIndicator` — 현재시간 표시선 (신규 v0.5)

> Overlay PSC. 시간 시나리오(Timetable) 전용. `_SelectionBox`와 함께 *prefix 없는 overlay PSC* 명명 패턴 정합.

### 8c-1. Property
- **variant 0개** 단일 컴포넌트 (`_SelectionBox`·`_AxisCorner` 패턴 동형)
- 시간 시나리오 전용 — Datetable 미적용 (Anna 결정 2026-05-29). 날짜 시나리오 "오늘" 표현은 별도 메커니즘 (현 시점 미운영)

### 8c-2. 구성 (2 레이어 — 라벨 없음)
- **Line**: 그리드 가로 폭 span, 1px **solid** `sys/stroke/calendar/now-indicator` (#d84a49)
- **Dot**: 좌측 끝(시간축 경계) 8×8 원형, `sys/stroke/calendar/now-indicator` (#d84a49), cornerRadius 50% — 하드코딩

### 8c-3. 거주 — Container Overlay Slot 패턴 정합
- Overlay Slot 거주 (EventBlock·_SelectionBox 동형, Auto Layout OFF · layoutPositioning ABSOLUTE)
- **Y 위치 빌더룰**: Y = ((현재시각 − 그리드 시작) 분 / 30) × 24px (시간 셀 높이). Line 세로중앙 = 해당 Y
- **Z-order**: Overlay Slot **최상단** 레이어 (EventBlock 위 — Google Calendar·Outlook 정합). z-index 토큰화 안 함, 레이어 순서 운영 (Container Overlay Slot 결정 (c) 정합)

### 8c-4. 색 = red (brand blue 회피)
- **brand blue(#1c7fd3) 미사용** — EventBlock.Mine.Confirmed bg·_SelectionBox border와 색 충돌 → 변별 불가 회피
- **빨강 = 업계 표준** now-indicator (Google Calendar·Outlook·Apple). "지금/live" 신호, 학습 비용 0
- **Calendar 시멘틱 카테고리 확장** (`sys/stroke/calendar/now-indicator`) — alert(오류) intent 재사용 회피. holiday 색 정신(안건 #7) 정합. global 추가 0 (red.50 재사용)

### 8c-5. solid 운영 (dashed 미운영)
- **dashed = _SelectionBox 전용 원칙**(2026-05-29 🟢 Active) 정합 — solid + red 색으로 차등 (Anna 결정 2026-05-29)
- 1px gray 그리드선 위에서 red 색 자체가 강한 시각 차등 → 두께 증가 불필요

### 8c-6. A11y (Phase 4 예약)
- aria-label "현재 시각" — 스크린리더 노출 (가시 숫자 라벨 없음, 선 위치로 현재시각 표현)
- WCAG 대비비 검수 (red.50 #d84a49 on white #fff) Phase 4

---

## 9. 사용 가이드 (v0.2 골격)

### 9-1. 시간 시나리오 (회의실 예약)

1. `Timetable` 인스턴스 추가
2. Header Slot: `_AxisCorner × 1` + `_ResourceHeader × N`
3. Body Slot: `_TimeAxisColumn × 1` + `_ResourceColumn(Mode=Time) × N`
4. Overlay Slot: `EventBlock × N` (절대 위치) + `_SelectionBox` (드래그 시)

### 9-2. 날짜 시나리오 (콘도 예약)

1. `Datetable` 인스턴스 추가
2. Header Slot: `_AxisCorner × 1` + `_ResourceHeader × N`
3. Body Slot: `_DateAxisColumn × 1` + `_ResourceColumn(Mode=Date) × N`
4. Overlay Slot: `EventBlock × N` + `_SelectionBox`

### 9-3. 빌더 운영 룰
- *_AxisCorner 높이* = _ResourceHeader (42) + _ResourcePhoto (98 if Optional True) = 140 또는 42
- *마지막 _ResourceColumn 인스턴스* = strokeRightWeight=0 override (table v1.3.3 패턴)
- *EventBlock height* = N cells × cell_height (cell_height = 24 Time / 40 Date, v0.4 — 빌더 가변)
- *_TimeAxisColumn / _DateAxisColumn 시작/끝* = cell 인스턴스 trim 또는 추가 (Auto Layout 가변)

---

## 10. 토큰 매핑

### 10-1. 신규 토큰 7건 (v0.2)

| 토큰 | 사용처 | 카테고리 |
|---|---|---|
| `sys/text/calendar/weekday` (#333) | _DateAxisCell.Day Type=Weekday | **Calendar (신규 intent)** |
| `sys/text/calendar/saturday` (#0062c1) | _DateAxisCell.Day Type=Saturday | Calendar |
| `sys/text/calendar/holiday` (#d84a49) | _DateAxisCell.Day Type=Holiday | Calendar |
| `global/border/style/solid` | (fallback default) | **border.style (신규 카테고리)** |
| `global/border/style/dashed` | _SelectionBox / _TimeAxisCell·_TimeSlotCell.Format=Hour | border.style |
| `sys/border/style/solid` (alias) | semantic | border.style |
| `sys/border/style/dashed` (alias) | _SelectionBox / _TimeAxisCell HalfHour | border.style |

### 10-2. 재사용 1건 (v0.1 §12 #6 해소)

| 토큰 | 출처 | _SelectionBox 사용 |
|---|---|---|
| `sys/opacity/dragging` (50%) | table v1.4.1 신설 | 드래그 임시 영역 50% opacity (별도 `sys/opacity/selection` 신설 회피) |

### 10-3. 명문화 1건 (사후)

| 토큰 | 명문화 사유 |
|---|---|
| `sys/text/neutral/faint/default` (#aeaeae) | 2026-04-21 JSON 등재, 가이드 명문화 누락. EventBlock.Cancelled text 첫 운영 사례 |

### 10-4. brand strong 운영 사례 — v0.8에서 EventBlock 제외 (봉인)

> ~~v0.2~v0.7: EventBlock.Mine.Confirmed bg=`office/bg/brand/strong/default`(#1c7fd3) + Inverse white~~ → **v0.8 폐기**. EventBlock은 좌측 막대 체계로 전환(§7-3) → brand strong **채움(bg)** 미사용.
> 귀결: **brand strong bg 운영 사례 = Button.Solid 단독으로 환원**. (EventBlock은 `office/stroke/brand/normal`(#1c7fd3)을 *막대(stroke)* 로만 사용 — strong bg 아님.) guide Part 8 brand strong 선례 기술 정정 완료.

### 10-5. 토큰 매핑 종합

| 컴포넌트 | 슬롯 | 토큰 |
|---|---|---|
| _TimeAxisCell | text | `text/neutral/normal/default` + `sys/typo/body/md/regular` |
| _TimeAxisCell.Hour | border-bottom | `stroke/neutral/subtle/default` + **dashed** |
| _TimeAxisCell.HalfHour | border-bottom | `stroke/neutral/subtle/default` + solid |
| _DateAxisCell | text | `sys/text/calendar/{weekday/saturday/holiday}` |
| _DateAxisCell | border-bottom | `stroke/neutral/subtle/default` + solid |
| _AxisCorner | bg | `bg/neutral/faint/default` |
| _AxisCorner | border-bottom | `stroke/neutral/subtle/default` |
| _ResourceHeader | bg | `bg/neutral/faint/default` |
| _ResourceHeader | border-bottom | `stroke/neutral/normal/default` (강조) |
| _ResourceHeader | text | `sys/typo/label/md/semibold` + `text/neutral/normal/default` |
| _ResourceColumn | right border | `stroke/neutral/subtle/default` 1px solid |
| _ResourcePhoto | border-bottom | `stroke/neutral/subtle/default` (image fill) |
| _TimeSlotCell·_DateSlotCell | bg Enabled.Rest.F | `bg/neutral/faint/default` |
| *SlotCell | bg Enabled.Hover.F | `bg/neutral/faint/active` |
| *SlotCell | bg Enabled.Rest.T | `office/bg/brand/normal/default` (LNB 패턴) |
| *SlotCell | bg Disabled.Rest.F | `bg/neutral/strong/disabled` (강한 시각) |
| *SlotCell | bg ReadOnly.Rest.F | `bg/neutral/faint/disabled` (약한 시각) |
| EventBlock.Mine.Confirmed [v0.8] | bg / 막대 / text | `office/bg/brand/normal/default` (#d8e9fb) / `office/stroke/brand/normal/default` (#1c7fd3) / `text/neutral/normal` |
| EventBlock.Mine.Tentative [v0.8] | bg / 막대 / text | `office/bg/brand/subtle/default` (#e6eff9) / `office/stroke/brand/subtle/default` (#98caf4 🆕) / `text/neutral/subtle` |
| EventBlock.Others.Confirmed [v0.8] | bg / 막대 | `bg/neutral/muted/default` / `stroke/neutral/strong/default` (#676767) |
| EventBlock.Others.Tentative [v0.8] | bg / 막대 | `bg/neutral/muted/default` / `stroke/neutral/normal/default` (#c4c4c4) |
| EventBlock.Cancelled (통일) [v0.8] | bg / 막대 / text | `bg/neutral/muted/default` / `stroke/neutral/subtle/default` (#d6d6d6) / `text/neutral/faint` + 취소선 |
| EventBlock [v0.8] | 좌측 막대 width | `sys/border/width/thick` (3px) — 전 variant 공통 |
| EventBlock | 제목↔부제 gap | `spacing/5xs` (1px, v0.4) |
| EventBlock | 마스터 기본 높이 | 48px (62→48, 1시간=2×24, v0.4) — 하드코딩 |
| Timetable·Datetable | Top Line (상단 외곽) | `sys/stroke/neutral/subtle/default` 1px 별도 Line 레이어 (Table v1.6 동형, v0.4) |
| _SelectionBox | bg | `office/bg/brand/normal/default` + `sys/opacity/dragging` |
| _SelectionBox | border | `office/stroke/brand/normal/default` + dashed |
| _SelectionBox | radius | `radius/sm` |
| _NowIndicator | Line | `sys/stroke/calendar/now-indicator` (#d84a49) 1px solid ← 신규 |
| _NowIndicator | Dot | `sys/stroke/calendar/now-indicator` (#d84a49) 8×8 원형, cornerRadius 50% 하드코딩 |

### 10-6. v0.8 토큰 변경 (봉인)

| 구분 | 토큰 | 상태 |
|---|---|---|
| **신규 등재** | `service/office/stroke/brand/subtle/default` (#98caf4) | ✅ `tokens/service-tokens.json` 등재 완료 → `{global.color.sky_blue.80}` 참조. Mine.Tentative 막대. `office/stroke/brand/normal`(sky_blue.40) 하위 농도, brand stroke 램프 채움 |
| 신규 사용(기존 존재) | `sys/stroke/neutral/strong/default` (#676767) | Others.Confirmed 막대 |
| 신규 사용(기존 존재) | `sys/stroke/neutral/normal/default` (#c4c4c4) | Others.Tentative 막대 |
| 신규 사용(기존 존재) | `sys/border/width/thick` (3px) | 전 variant 좌측 막대 두께 |
| 신규 사용(기존 존재) | `service/office/bg/brand/subtle/default` (#e6eff9) · `.../active` (#d7ebfc) | Mine.Tentative bg |
| **폐기** | `office/bg/brand/strong/default`(#1c7fd3 bg) · `text/neutral/inverse`(#fff) | EventBlock에서 미사용 (§10-4) |

→ 신규 토큰 **1건**(`office/stroke/brand/subtle/default`). 나머지는 기존 토큰 재사용. 취소선(line-through)은 layer 텍스트 속성(토큰 불요).

---

## 11. 결정 이력

### 11-1. v0.2 봉인 (2026-05-29) — 결정 18건

| # | 결정 | 근거 |
|---|---|---|
| 13 | Time/Date prefix 일관 명명 패턴 | Anna 결정 — 시나리오 분리 우선, AI 학습 prefix 패턴 인식 |
| 14 | `_TimeSlotCell` / `_DateSlotCell` 별도 PSC 분리 | (b) Format=Date enum 권고 환수 — Anna (c) 별도 PSC 채택 |
| 15 | `_AxisCorner` PSC 신설 (Time/Date 공통 단일) | 시간/날짜 axis 공통 책임 — 분리 안 함. AI 학습 ⭐ |
| 16 | `Datetable` Public 컴포넌트 신설 | Public 2 → 3. 시간/날짜 시나리오 별도 Public |
| 17 | `_ResourceColumn.Mode = Time / Date` Variant | (B) PSC 분리 vs (C) Variant 중 Variant 채택 — *cell 종류만 다름* |
| 18 | EventBlock.Mine.Confirmed = brand strong + Inverse | 시각 위계 강화 — *내 예약 즉시 식별* 패턴 (Google Calendar·Outlook 정합) |
| 19 | Cancelled.Is Mine 시각 통일 패턴 | 취소된 예약은 누구 것이든 동일 시각. Property는 데이터 모델 분리 |
| 20 | dashed = _SelectionBox 전용 원칙 | EventBlock·Table 등 dashed 환수 회귀 차단 |
| 21 | LNB 패턴 적용 범위 확장 (SlotCell 2번째 사례) | sync §4-2 등재. Pressed 시각 표현 가치 없음 + Selected 즉시 발현 흡수 |
| 22 | ReadOnly 어휘 적용 범위 확장 (첫 비-폼 사례) | *SlotCell.ReadOnly 채택. Blocked·Locked 신규 어휘 회피 |
| 23 | Calendar 시멘틱 카테고리 신설 | sys/text/calendar/* 3건. informative/alert 재사용 회피 |
| 24 | border.style + Figma 한계 정책 | global+sys 4건 신설. dashPattern Variable bind 불가, layer 직접 |
| 25 | opacity/dragging 재사용 (v0.1 §12 #6 해소) | table v1.4.1 토큰 재활용 — sys/opacity/selection 별도 신설 회피 |
| 26 | `sys/text/neutral/faint/default` 명문화 | 2026-04-21 JSON 등재, 가이드 사후 명문화 |
| 27 | _ResourceColumn right border (세로 분리선) | table v1.3.3 *_Cell 본체 우측 stroke 기본 운영* 동형 |
| 28 | Operating 어휘 폐기 → Availability 표준 환수 | DS v3 표준 어휘 재사용. _ResourceHeader 현 시점 Property 미운영 |
| 29 | EventBlock.Tentative dashed → solid border 환수 | dashed = _SelectionBox 전용 원칙 정합 |
| 30 | _TimeAxisCell·_DateAxisCell 별도 PSC 유지 (통합 검토 환수) | Anna 결정 — 별도 유지 정합. _SlotCell rename(_TimeSlotCell)만 진행 |
| 31 | **Component Property Boolean + layer visibility bind 패턴 도입** (EventBlock.Has Time·Has Author) | variant 폭증 회피 (12 유지) + 데이터 모델 명확. AI·React 친화성 강함. DS v3 운영 첫 표준 사례 |

### 11-1b. v0.3 봉인 (2026-05-29) — State Variant 미운영 결정

| # | 결정 | 근거 |
|---|---|---|
| 32 | **Timetable·Datetable State Variant 미운영 (NO)** | EventBlock = overlay 데이터 / 그리드 = 상시 구조물. "예약 0건" = 빈 그리드 자체가 empty. table v1.7 *row=content* 전제와 구조 상이 → 동형 부적합. 안건 #4 🔒 종결 |
| 33 | 메시지 PSC(_TimetableMessage 등) 미운영 | State Variant 미운영의 귀결. Empty/Loading 컨테이너 메시지 컴포넌트 불필요 |
| 34 | skeleton(β 케이스) 미운영 | 2D 그리드 + absolute overlay 구조상 행 기반 skeleton 부적합. table _SkeletonRow 비동형 |
| 35 | Loading 표현 본 세션 미논의 | State Variant 아님. 필요 시 overlay 스피너 등 별도 메커니즘 — Phase 3 React 시점 재검토 |
| 36 | Density(안건 #10) 다음 회차 보류 재확인 | "Compact"는 현행 32px 라벨일 뿐. table `Size` md/lg 선례 참고하여 추후 설계 |

→ 신규 컴포넌트 0 · 신규 토큰 0 · Variant 0 · PSC 매트릭스 변경 0 · Figma 빌드 0. **결정 기록 전용 봉인.**

### 11-1c. v0.4 봉인 (2026-05-29) — 사이즈 실측 정정 3건

| # | 결정 | 근거 |
|---|---|---|
| 37 | **셀 높이 통일 32px → 시간 24px / 날짜 40px 분리** | Anna Figma 선작업 실측. Time 축소(밀도↑) / Date 확대(가독성↑). 문서 §4-1 *32* stale 정정 (재개 트리거 ② 실측 충돌) |
| 38 | 하드코딩 유지 · 토큰 신설 0건 | 셀 높이 layer px 직접. `sys/size/*` 승격은 안건 #12 예약 (size 토큰 B안 선례 검토 선행) |
| 39 | 새 PSC 추가 차기 회차 분리 | 본 회차 실측 정정 단일 범위. 가족 트리(Public 3 + PSC 11) 변경 0 |
| 40 | **EventBlock 마스터 높이 62 → 48** + 제목↔부제 gap `spacing/5xs`(1px) | 1시간=2×24 셀 정합. 제목 typo는 14px(body/md) 유지 — 13px drift Figma 환원. 토큰 0건 |
| 41 | **Timetable·Datetable Top Line 추가** (1px `sys/stroke/neutral/subtle/default` 별도 Line 레이어) | Table v1.6 *Top Line 레이어* 동형 — Layer Panel 가시성 + 상단 닫힘 일관. 상단만(하단 미운영). 토큰 0건 |

→ 사이즈 실측 정정 3건(그리드 셀 높이 · EventBlock · Top Line). 신규 컴포넌트 0 · 신규 토큰 0 · Variant 0 · PSC 매트릭스 변경 0. **실측 정합 전용 봉인.**

### 11-1d. v0.5 봉인 (2026-05-29) — 신규 PSC _NowIndicator + Calendar 토큰 2건

| # | 결정 | 근거 |
|---|---|---|
| 42 | **`_NowIndicator` PSC 신설** (PSC 11→12) | 현재시간 표시선. Overlay Slot 거주, Container Overlay Slot 패턴 정합. v0.4 "새 PSC 차기 회차" 예약분. prefix 없는 overlay PSC(_SelectionBox 동형) |
| 43 | **색 = red** (#d84a49, brand blue 회피) | brand blue는 EventBlock.Mine.Confirmed·_SelectionBox와 충돌 → 변별 불가. red = 업계 표준 now-indicator. Anna 결정 |
| 44 | **Calendar 카테고리 확장 — `sys/stroke/calendar/now-indicator` 1건 신설** | B안 채택 (Anna). alert(오류) intent 재사용 회피, holiday 색 정신(안건 #7) 정합. global 추가 0 (red.50 재사용). **라벨(시각 숫자) 미운영 → text 토큰 불요, Line+Dot만** (Anna 결정) |
| 45 | **solid 운영** (dashed 미운영) | dashed=_SelectionBox 전용 원칙 정합. red 색만으로 충분한 차등. Anna 결정 |
| 46 | **시간 시나리오(Timetable) 전용** | Datetable 미적용. 날짜 "오늘" 표현은 별도 메커니즘 보류 |

→ 신규 PSC 1건(_NowIndicator) · **신규 sys 토큰 1건**(stroke calendar/now-indicator) · global 0 · Variant 0. PSC 11→12. **신규 PSC 회차 봉인.**

### 11-1e. v0.6 봉인 (2026-06-02) — _ResourcePhoto 높이 고정 정정

| # | 결정 | 근거 |
|---|---|---|
| 47 | **`_ResourcePhoto` 종횡비 박스 → 고정 높이 98px 환원** | Figma 실측이 `aspect-[100/75]`(종횡비)로 드리프트 → 컬럼 폭 가변(아이템 수) 시 `폭 × 0.75` 소수 높이 발생, _AxisCorner(116.25)·TimeAxisColumn(1268.25)·Timetable 전체(1292.6875)로 전파. 문서 §5-3 *고정 98* 스펙으로 환수 (재개 트리거 ② 실측↔문서 충돌). 하드코딩 유지 · 신규 토큰 0건. Figma 재바인딩 Anna 수동 |

→ 실측 정정 1건. 신규 컴포넌트 0 · 신규 토큰 0 · Variant 0 · PSC 매트릭스 변경 0. **실측 정합 전용 봉인.**

### 11-1f. v0.7 봉인 (2026-06-04) — 점유 슬롯 드래그 차단 규칙 + EventBlock 색 채움 유지

| # | 결정 | 근거 |
|---|---|---|
| 48 | **점유 슬롯 드래그 차단 규칙 명문화** | EventBlock 점유 슬롯 위 드래그 생성 불가 → _SelectionBox는 빈 슬롯 전용. _SelectionBox ↔ EventBlock 공간 상호 배타. 미명세였던 §13 드래그 인터랙션 확정. Anna 결정 |
| 49 | **EventBlock.Mine.Confirmed 색 스킴 변경 폐기 — brand strong 채움 유지** | 겹침 원천 차단 → "겹치면 경계선 안 보임" 충돌 비발생 → **재개 트리거 ②(실측 충돌) 불성립**. v0.2 #18 유지. 좌측 3px 막대+흰 배경 실험안(Figma node 253:8856) 환원 대상(Anna 수동). 토큰 0건 |

→ 인터랙션 규칙 1건 명문화 + 색 스킴 봉인 유지 재확인. 신규 컴포넌트 0 · 신규 토큰 0 · Variant 0 · PSC 변경 0. **결정 기록 전용 봉인.**

### 11-1g. v0.8 봉인 (2026-06-04) — EventBlock 색 스킴 전면 재설계

> **봉인 — 정책방 종결분(v0.2 #18 / v0.7 #49) 재개.** 재개 트리거 = **⑤ 디자인 오너 직권 재설계**(sync §5 신설). 정책방 비준 완료 2026-06-04. Figma node 763:2 실측 정합.

| # | 결정 | 근거 |
|---|---|---|
| 50 | **EventBlock.Mine.Confirmed brand strong 채움(#1c7fd3 bg + inverse white) 폐기** → 좌측 3px 막대 + 옅은 배경 + 본문 텍스트 | 디자인 방향 전환(Anna 직권). v0.2 #18 / v0.7 #49 supersede. **재개 트리거 ⑤(디자인 오너 직권 재설계, sync §5 신설)** 적용, 정책방 비준 완료 |
| 51 | **12 variant 공통 "좌측 3px 막대" 체계 채택** (`sys/border/width/thick`, solid, 좌측 only) | 막대 색이 소유×상태 인코딩. Google Calendar 좌측 컬러바 패턴. 전체 박스 border(Tentative) 폐기 흡수 |
| 52 | **막대 색 매핑**: Mine.Confirmed=brand normal(#1c7fd3) / Mine.Tentative=brand subtle(#98caf4) / Others.Confirmed=neutral strong(#676767) / Others.Tentative=neutral normal(#c4c4c4) / Cancelled=neutral subtle(#d6d6d6) | 소유=색 계열(brand/neutral), 상태=농도 |
| 53 | **bg 매핑**: Mine.Confirmed=brand normal(#d8e9fb) / Mine.Tentative=brand subtle(#e6eff9) / Others·Cancelled=neutral muted(#f7f7f7). Hover=`*.active` 공유(막대 색 유지) | Mine만 brand 틴트, Others는 neutral. *.active 슬롯 공유 패턴 정합 |
| 54 | **Cancelled 제목 line-through(취소선) 신규** | Confirmed/Tentative 즉시 변별. neutral 통일(v0.2 #19) 유지 위 취소선 추가 |
| 55 | **신규 토큰 1건**: `service/office/stroke/brand/subtle/default`(#98caf4) | Mine.Tentative 막대. JSON 미존재 → 생성. brand stroke 램프 채우기 |
| — | dashed=_SelectionBox 전용 원칙 **유지**(막대 solid) / EventBlock Selected enum **미추가 유지** | 회귀 차단 정합 (위반 없음) |

→ 신규 토큰 1건(등재 완료) · Variant 0(12 유지) · PSC 0 · 컴포넌트 0. **v0.8 정식 봉인 — 재개 트리거 ⑤ 첫 적용 사례.**

### 11-2. 회귀 차단점

**자주 망각 10건 매칭** (모두 적용):
- Active 폐기 — `Interaction`에 Active enum 미사용
- Locked → ReadOnly 통일 — Availability 표준
- Focused → FocusVisible 별도 가이드
- Pressed enum 운영 표준 (LNB 패턴 한정 제외)
- Hover = *.active 슬롯 공유
- Has Slot Boolean → _Leading/_Trailing Element PSC
- Office 메인 sky_blue.40
- HR 메인 violet.50 (후행 빌드)
- Warning = orange

**v0.2 신규 회귀 차단점**:
- *_TimeAxisCell.Format=Date 흡수 회귀* — _DateAxisCell 별도 PSC 정합
- *_SlotCell·_DateSlotCell 통합 회귀* — Time/Date 분리 정합 (v0.2 결정 #14)
- *Datetable을 Timetable에 흡수 회귀* — Public 분리 정합 (v0.2 결정 #16)
- *_ResourcePhoto를 aspect-ratio 박스로 재변경 회귀* — 고정 높이 98 확정 (v0.6 #47). 종횡비는 컬럼 폭 가변 시 소수 높이 유발
- *informative/alert로 Calendar 색 재사용 회귀* — Calendar 신규 intent
- *EventBlock Tentative=dashed 회귀* — dashed = _SelectionBox 전용 (v0.2 결정 #20)
- *sys/opacity/selection 신설 회귀* — opacity/dragging 재사용 (v0.2 결정 #25)
- *Cancelled에 brand 시각 환수 회귀* — neutral muted 통일 (v0.2 결정 #19)
- *EventBlock에 Selected 추가 회귀* — 모달 trigger 패턴, 영구 강조 미운영
- *_ResourceColumn.IsLast Property 신설 회귀* — 인스턴스 override 운영 (table v1.3.3)
- *Blocked enum 신규 도입 회귀* — ReadOnly 표준 어휘 (Locked·v3.5 정신 연장)
- *Validation 신규 차원 회귀* — *SlotCell.Validation 미운영 확정
- *_SlotCell에 Pressed enum 추가 회귀* (LNB 패턴 정합)
- *Operating Property 어휘 회귀* — Availability 표준 환수
- *Has Time·Has Author Boolean을 variant Property로 변환 회귀 차단* — Component Property layer bind 정합 (v0.2 결정 #31). variant 12→48 폭증 회피

**v0.3 신규 회귀 차단점**:
- *Timetable·Datetable에 table v1.7식 State Variant(Loaded/Empty/Loading) 추가 회귀* — EventBlock overlay 구조상 컨테이너 State 부적합, 미운영 확정 (v0.3 결정 #32). 재개 시 그리드=구조물 / EventBlock=데이터 분리 전제 재검토 필수
- *_TimetableMessage·_DatetableMessage 등 Empty/Loading 메시지 PSC 신설 회귀* — 메시지 PSC 미운영 확정 (v0.3 결정 #33)
- *Timetable skeleton(β) PSC 신설 회귀* — 2D 그리드 구조상 행 skeleton 비동형, 미운영 확정 (v0.3 결정 #34)
- *"Compact"를 정식 density Property로 즉시 승격 회귀* — 안건 #10 보류, table `Size` md/lg 선례 검토 선행 (v0.3 결정 #36)

**v0.4 신규 회귀 차단점**:
- *시간·날짜 셀 높이 재통일(32 환원) 회귀* — 의도적 분리 확정 (v0.4 #37). 시간 24 / 날짜 40 고정
- *셀 높이를 임의 토큰 신설로 처리 회귀* — 안건 #12 예약, 현 시점 하드코딩 유지 (v0.4 #38)
- *EventBlock 제목 typo를 13px(body/sm)로 재변경 회귀* — body/md(14px) 유지 확정 (v0.4 #40, drift 환원). 높이 축소는 gap·height로 흡수
- *Top Line을 Frame Inside stroke로 환원 / `stroke/neutral/normal`(강조)로 변경 회귀* — 별도 1px Line 레이어 + subtle 토큰 확정 (v0.4 #41, Table v1.6 동형)

**v0.5 신규 회귀 차단점**:
- *_NowIndicator를 brand blue로 변경 회귀* — red 확정. brand blue는 EventBlock.Mine.Confirmed·_SelectionBox와 색 충돌 (v0.5 #43)
- *_NowIndicator를 dashed로 변경 회귀* — solid 확정 (dashed=_SelectionBox 전용, v0.5 #45)
- *_NowIndicator 색을 alert intent로 소싱 회귀* — Calendar 카테고리(calendar/now-indicator) 정합, alert(오류) 의미 회피 (v0.5 #44)
- *_NowIndicator에 Time prefix 부여 회귀* — overlay PSC는 prefix 없음(_SelectionBox 동형). 시나리오 한정은 운영 룰로 처리 (**policy v3.11 §4-X-b Overlay PSC prefix 면제 명문화**)
- *_DateNowIndicator/날짜 시나리오 확장 회귀* — 시간 전용 확정 (v0.5 #46)
- *_NowIndicator에 시각 숫자 라벨 추가 회귀* — 라벨 미운영 확정(Line+Dot만), text 토큰 불요 (Anna 결정)

**v0.7 신규 회귀 차단점**:
- ⚪ ~~*EventBlock.Mine.Confirmed를 "좌측 막대 + 흰 배경"으로 변경 회귀* — brand strong 채움 유지 (v0.7 #49)~~ → **Superseded by v0.8 #50** (디자인 오너 직권 재설계, 트리거 ⑤). 좌측 막대 체계가 정식 채택됨. *드래그 차단 규칙(#48)은 별개로 유효.*
- *점유 슬롯 위 드래그로 중복 예약 생성 허용 회귀* — 빈 슬롯 전용 확정 (v0.7 #48). 변경 시 색 충돌 안건 동반 재검토 필수
- *"파란 채움 = _SelectionBox 전용" 원칙 신설 회귀* — 채움 충돌이 비발생이므로 해당 원칙 불필요, 미신설 확정 (v0.7)

---

## 12. 정책 영향 안건

### 안건 #1 — Container Overlay Slot 패턴 — 🔒 결정됨 (2026-05-26)
*v0.1 봉인 사이클 종결*. 5항 결정 + 산출물 5개 문서 패치. Timetable·Datetable Overlay Slot 직접 적용.

### 안건 #2 — 신규 카테고리 검토 (Scheduling vs Data Display 확장)
*v0.2 시점 — Data Display 확장 유지*. 향후 Calendar Panel 추가 시 Scheduling 신규 카테고리 신설 vs 현행 유지 재검토.

### 안건 #3 — Workflow 차원 (예약 승인 절차)
*Phase 3 후행*. *SlotCell.Availability 확장 vs EventBlock.Workflow 신설 vs 양쪽 중 결정.

### 안건 #4 — Timetable.State Variant 도입 (table v1.7 동형) — 🔒 종결 (2026-05-29, 미운영 NO)
*Phase 3a 결정*. Timetable·Datetable 둘 다 State Variant **미운영 확정** (Anna 결정).
사유: EventBlock은 overlay 데이터, 그리드(시간/날짜축 + 자원 컬럼)는 *상시 존재하는 구조물*. "예약 0건" = EventBlock 없음일 뿐이며 *빈 그리드 자체가 곧 empty 표현* → 컨테이너 Body를 메시지로 대체할 이유 없음. table v1.7의 *row = content* 전제(Empty/Loading이 행 영역을 통째 대체)와 구조가 다르므로 동형 적용 부적합. 메시지 PSC(_TimetableMessage 등)·skeleton(β)·Loading 표현 모두 본 세션 미운영. Loading이 필요해질 경우 State Variant가 아닌 *그리드를 덮는 overlay 스피너* 등 별도 메커니즘으로 추후 검토.

### 안건 #5 — sys/border/style/{solid, dashed} 신설 — 🔒 종결 (2026-05-29)
*v0.1 §12 #5 해소*. 4건 신설 + Figma 한계 정책 동반.

### 안건 #6 — sys/opacity/selection 신설 — 🔒 종결 (2026-05-29, 해소 방식 = 재사용)
*v0.1 §12 #6 해소*. opacity/dragging (table v1.4.1) 재사용 — 별도 신설 회피.

### 안건 #7 — Calendar 시멘틱 카테고리 — 🔒 종결 (2026-05-29)
*신규 안건*. sys/text/calendar/* 3건 신설.

### 안건 #8 — LNB 패턴 적용 범위 확장 — 🔒 종결 (2026-05-29)
*신규 안건*. SlotCell 2번째 사례. 정책 일반화 검토.

### 안건 #9 — ReadOnly 어휘 적용 범위 확장 — 🔒 종결 (2026-05-29)
*신규 안건*. 첫 비-폼 사례.

### 안건 #10 — Compact View Density 후행 빌드
*Phase 3 후행 (v0.3에서 다음 회차 보류 재확인)*. *AxisCell·*SlotCell 등 View Density 매트릭스 확장 예약.
> **v0.3 메모 (2026-05-29)**: "Compact"는 현행 32px 빌드의 *라벨*일 뿐, 정식 density Property·칸높이 토큰·View Density 축은 정의·결정된 적 없음. "Density" 개념의 어원은 table 폐기 1차본(`archive/table-DELETED-2026-05-18.md`, table v0.1 2026-05-14)의 *Density 3단 `sm/md/lg`* → table v1.0 재구축 시 *`Size` md/lg*로 대체되며 폐기. timetable은 명명만 차용한 상태. 향후 density 설계 착수 시 table `Size` md/lg 선례 참고.
> **v0.4 메모 (2026-05-29)**: 셀 높이가 통일 32 → **시간 24 / 날짜 40**으로 분리됨(v0.4 #37). 이는 *시나리오별 단일 baseline*이지 density 다단(同 시나리오 내 sm/md/lg)이 아님 — 안건 #10 Density는 여전히 보류. 셀 높이 토큰화는 별도 안건 #12.

### 안건 #11 — `_HeaderRow` PSC 분리 검토 (v0.3 후행)
table v1.5 *_Table.Header Slot Optional + Body Slot 가변* 패턴 동형. _ResourceColumn 책임 단순화 (cells only) + Header Row 별도 슬롯.

### 안건 #12 — 그리드 셀 높이 토큰화 (v0.4 예약)
*v0.4 결정 #38*. 현재 시간 24px / 날짜 40px는 layer 하드코딩. `sys/size/cell/{time,date}` 등 토큰 승격 검토 — size 토큰 B안(global/size primitive + sys/size alias) 선례 참고. size 운영 사례 누적 시 정책방 일반화 트리거.

### 안건 #13 — Calendar stroke intent 확장 (v0.5)
*v0.5 결정 #44*. `sys/stroke/calendar/now-indicator` 신설로 Calendar 시멘틱 카테고리가 text → stroke로 확장됨. 안건 #7(Calendar 카테고리, 🔒) 정신 연장 — 작업방 토큰 authoring 범위 (정책 신규 룰 아님, 정책방 이관 불요). 향후 calendar/* 멤버 누적(now-indicator·today·current 등) 시 정책방 일반화 검토 트리거. **2026-06-01 정책 세션에서 명명 2건 일반화 완료** — Overlay PSC prefix 면제(policy v3.11) + 토큰 명명 일반 leaf 선점 금지(guide Part 8).

### 안건 #14 — ✅ EventBlock 색 스킴 재설계 (정책방 비준 완료, v0.8 봉인)
*종결 (2026-06-04 정책방 비준).* v0.2 #18 / v0.7 #49 재개 → **재개 트리거 ⑤(디자인 오너 직권 재설계) 신설 + 첫 적용**. 반영 완료: ①좌측 막대 체계 비준 ②sync §1·§4 Closed Topic(EventBlock brand strong) 🟢 Active → ⚪ Superseded ③Drift Log §8 갱신 ④guide Part 8 brand strong 선례 = Button.Solid 단독 환원 ⑤v0.7 #49 회귀 차단점 무효화(§11-2). v0.8 정식 봉인.

### 안건 #15 — `office/stroke/brand/subtle` 토큰 신설 (v0.8)
*종결 (2026-06-04).* `service/office/stroke/brand/subtle/default`(#98caf4) → `{global.color.sky_blue.80}` 등재 완료(`tokens/service-tokens.json`). brand stroke 램프(normal+subtle) 채움. global 추가 0(sky_blue.80 기존). HR 후행 시 `hr/stroke/brand/subtle` 동반 신설은 HR 빌드 회차에서 결정.

---

## 13. 다음 라운드 작업

### Phase 3 — React 구현 (예정)
- Absolute overlay 패턴 React 구현 (CSS positioning)
- 드래그 인터랙션 (mousedown → mousemove → mouseup) → _SelectionBox → EventBlock 생성. **빈 슬롯에서만 발현 — 점유 슬롯(EventBlock 존재) 위 드래그 차단**(§8-4, v0.7 #48). 중복 예약 미허용
- Workflow 차원 도입 시 상태 머신 분리
- Compact variant 추가 빌드
- HR 브랜드 분기 빌드

### Phase 4 — A11y 정착
- A11Y-OVL-01 Container Overlay Slot focus order
- Calendar 색 차등 color blindness 영향 검토
- EventBlock.Mine.Confirmed brand strong WCAG AA 대비비 검수

---

## 부록 — Phase 0 충돌 8건 ↔ v0.2 정정 결과 매트릭스

| # | Phase 0 충돌 (제미나이 분석안) | v0.2 정정 결과 | 본문 위치 |
|---|---|---|---|
| 1 | `TimeCell.type` 어휘 사용 | `_TimeAxisCell.Format` (Hour/HalfHour) | §4-2 |
| 2 | `GridCell.state` 단일 enum | _TimeSlotCell 4축 직교 + _DateSlotCell 3축 (Format 제외) | §6, §6b |
| 3 | `EventBlock.status` 단일 enum | Is Mine × Status × Interaction 3축 직교 | §7-1 |
| 4 | hover 단독 토큰화 | *.active 슬롯 공유 | §6-4, §7-3 |
| 5 | `_SelectionBox` opacity hardcoded | `sys/opacity/dragging` 재사용 (table v1.4.1) | §8-2 |
| 6 | `_SelectionBox` border solid/dashed | `sys/border/style/{solid,dashed}` 신설 + Figma 한계 정책 | §8-2 |
| 7 | `_ResourceHeader` boolean 흡수안 | Has Leading/Trailing 2 Boolean PSC 격상 | §5-2 |
| 8 | Absolute position overlay 정책 부재 | Container Overlay Slot 패턴 (2026-05-26 정책방 사이클) | §3-2, §3b-2 |

---

> **v0.2 봉인 — 2026-05-29.** Phase 2 산출물 완성. Public 3 + PSC 11. 신규 토큰 7건 + 재사용 1건 + 명문화 1건. 정책 신설/확장 5건. v0.1 §12 안건 #5/#6 해소. 다음 진입: Phase 3 React 구현체 (예정).

> **v0.3 봉인 — 2026-05-29.** Phase 3a. **State Variant 미운영(NO) 결정** — EventBlock overlay 구조상 그리드가 상시 존재 → table v1.7식 컨테이너 Empty/Loading State 부적합. 안건 #4 🔒 종결. 메시지 PSC·skeleton·Loading 모두 미운영. Density(안건 #10) 다음 회차 보류. 신규 컴포넌트·토큰·Variant·PSC 변경 **0건** (결정 기록 전용 봉인). 다음 진입: Phase 3 React 구현체 (예정).

> **v0.4 봉인 — 2026-05-29.** 사이즈 실측 정정 3건 — ①그리드 셀 높이 32→시간24/날짜40 ②EventBlock 마스터 높이 62→48 + 제목↔부제 gap `spacing/5xs` ③Timetable·Datetable Top Line 1px `sys/stroke/neutral/subtle/default` 추가(Table v1.6 동형). 모두 Anna Figma 선작업, 실측 ↔ 문서 충돌 정정(재개 트리거 ②). 하드코딩 유지 · **신규 토큰·컴포넌트·Variant·PSC 0건**. 셀 높이 토큰화 안건 #12 예약 · 새 PSC 차기 회차. 다음 진입: 새 PSC 정의(차기) → Phase 3 React.

> **v0.5 봉인 — 2026-05-29.** 신규 PSC **_NowIndicator**(현재시간 표시선) — Overlay Slot 거주, 시간 시나리오(Timetable) 전용, **solid + red** (`sys/stroke/calendar/now-indicator` #d84a49 신설 1건, global 0). 라벨(숫자) 미운영 — Line+Dot 2레이어. brand blue 회피(EventBlock.Mine.Confirmed·_SelectionBox 색 충돌)·dashed 미운영(=_SelectionBox 전용 정합)·Calendar 카테고리 stroke 신설. PSC 11→12. 신규 sys 토큰 1건·global 0·Variant 0. 패치: `components/timetable.md` v0.5 + `tokens/sys-tokens.json` + `session-sync-protocol.md` §1·§4·연대기 + `hiworks-ds-guide.md` Part 8·9. 다음 진입: Figma _NowIndicator 빌드 → Phase 3 React.

> **v0.6 봉인 — 2026-06-02.** `_ResourcePhoto` 종횡비 박스 → 고정 높이 98px 환원. 컬럼 폭 가변 시 `폭×0.75` 소수 높이가 _AxisCorner·TimeAxisColumn·Timetable 전체로 전파되던 드리프트 정정(재개 트리거 ② 실측↔문서 충돌). 하드코딩 유지 · **신규 토큰·컴포넌트·Variant·PSC 0건**. Figma 재바인딩 Anna 수동.

> **v0.7 봉인 — 2026-06-04.** **점유 슬롯 드래그 차단 규칙** 명문화 — _SelectionBox는 빈 슬롯에서만 발현, EventBlock 점유 슬롯 위 드래그 생성 차단(중복 예약 미허용). 귀결: _SelectionBox↔EventBlock 공간 상호 배타 → "brand 채움 위 파란 dashed 경계 소실" 충돌 시나리오 원천 비발생 → **EventBlock.Mine.Confirmed brand strong 채움(v0.2 #18) 유지**, 좌측 막대+흰 배경 실험안(Figma node 253:8856) 폐기. **재개 트리거 ②(실측 충돌) 불성립** 확인. 결정 #48·#49. 신규 토큰·컴포넌트·Variant·PSC **0건**. 패치: `components/timetable.md` §8-4·§11-1f·§13 + `session-sync-protocol.md` §1·§4 + `hiworks-ds-guide.md` Part 8·9. Figma 실험안 환원 = Anna 수동.

> **v0.8 봉인 — 2026-06-04.** EventBlock 색 스킴 전면 재설계 — brand strong 채움(#1c7fd3 bg)+inverse white 폐기 → **12 variant 공통 좌측 3px 막대(`sys/border/width/thick`) + 배경틴트 + 본문 텍스트**(§7-3). 막대 색=소유×상태 인코딩, Cancelled 취소선 신규. **재개 트리거 ⑤(디자인 오너 직권 재설계, sync §5 신설) 첫 적용** — v0.2 #18 / v0.7 #49 supersede, 정책방 비준 완료. 신규 토큰 1건(`service/office/stroke/brand/subtle/default` #98caf4 → sky_blue/80, 등재 완료)·Variant 0·PSC 0. Figma node 763:2 실측(253:8826/8856 폐기). 결정 #50~#55(§11-1g). 안건 #14·#15 종결. 패치: `components/timetable.md` v0.8 + `tokens/service-tokens.json` + `session-sync-protocol.md` §1·§4·§5·§8·연대기 + `hiworks-ds-guide.md` Part 8·9.
