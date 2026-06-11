# LNB — Office

> **Hiworks Design System v3** · Service Component · Office 브랜드
> 단일 기준 문서: `hiworks-ds-guide.md` · 정책: `component-property-policy.md`
> 최종 갱신: 2026-06-04 (v1.3 — Section Header·Action Button 색표 신설 + LNB 전역 faint/active 통일. v1.2 Nav Item 트리거② 포함)

---

## 1. 개요

| 항목 | 값 |
|---|---|
| 컴포넌트명 | `_LNB Template` + 서비스별 마스터 (`LNB / {Service}`) |
| 분류 | **Service Component (Template Pattern)** |
| 너비 | 276px 고정 |
| 참조 토큰 레이어 | `service.office.*` + `sys.*` + `global.border.*` |
| Figma 파일 | `DesignSystemOffice-anna` (`7FyrA0Olbv6B7SicSvVTZN`) — 우선 통합 운영 |

---

## 2. 아키텍처 (Template Pattern)

수직 스택(Vertical Auto Layout) 구조:

```
_LNB Template (W 276px · H Fill)
├ Top Header (Fixed)               — 서비스 로고·타이틀
├ Scroll Area (Overflow: Vertical) — 메뉴 목록
│  ├ _Base Nav Item
│  ├ _Section Header
│  └ _Divider
└ _LNB Footer Container (Fixed)
    └ _Footer Modules (slot)
```

**서비스별 LNB 운영 — 동기화 방식 A (인스턴스 + 슬롯 override)**:
- 시스템 디자이너: `_LNB Template` 마스터 관리 (Hidden — `_` prefix)
- 서비스 디자이너: `_LNB Template` **인스턴스 + Scroll Area 슬롯 채움**으로 서비스별 LNB 구성
- 완성된 인스턴스를 새 마스터(`LNB / Mail`, `LNB / Approval` 등)로 격상
- **변경 동기화**: `_LNB Template` 변경 시 모든 서비스 마스터에 자동 반영

---

## 3. Sub-Component 정의

### 3-1. `_Base Nav Item`

일반 메뉴 링크 항목.

**Variants**

| Property | Values | 개수 |
|---|---|---|
| Level | 1 / 2 / 3 | 3 (메뉴 깊이) |
| Availability | Enabled / Disabled | 2 |
| Interaction | Rest / Hover | 2 (**Pressed 제외** — LNB 패턴) |
| Selected | False / True | 2 |
| DND State | None / Dragging / DragOver | 3 |

**Boolean**

| Property | Default | 비고 |
|---|---|---|
| Has Badge | False | 우측 N 뱃지/카운트 |
| `_Leading Nav Element` | **True** | 아이콘 슬롯 — LNB 메뉴는 상시 노출이라 디폴트 True (form-field role 패턴의 LNB 한정 예외) |
| `_Trailing Nav Element` | False | 우측 액션 슬롯 |

**총 Variant 수**: 24개 (이론치 72개 대비 약 33%. 무효 조합 생략: Selected=True × Interaction=Hover, Selected=True × DND=DragOver, Disabled × Selected 등)

> **Pressed 제외 사유**: 클릭 즉시 `Selected=True` 진입 + 페이지 전환 트리거. 정책 §2-2-1 LNB 패턴 예외 조항 정합.
> **Selected=True**: Interaction=Rest 단일. Hover/Pressed 영향 안 받음 (Anna 결정 C-2, 2026-05-13).

### 3-2. `_Section Header`

메뉴 그룹 헤더 ("내 근무", "승인 메일함" 등).

**Variants**: Level(1/2) × Availability × Interaction × DND State (Nav Item과 동일 인터랙션 패턴, Pressed 제외)

**토큰 매핑 (Figma 실측 2026-06-04, v1.3)**

| State | bg | text | icon | weight |
|---|---|---|---|---|
| Rest | none (컨테이너 색 #fff 투과) | `sys.text.neutral.normal.default` | `sys.icon.neutral.muted.default` (#909090) | **semibold** |
| Hover | `office.bg.brand.faint.active` (#ecf7fe) | `sys.text.neutral.normal.default` | `sys.icon.neutral.muted.default` | semibold |
| DragOver | `office.bg.brand.faint.active` (#ecf7fe, = Hover) | `sys.text.neutral.normal.default` | `sys.icon.neutral.muted.default` | semibold |
| Disabled | none (컨테이너 색 투과 — Rest 동일) | `sys.text.neutral.normal.disabled` (#aeaeae) | `sys.icon.neutral.subtle.disabled` (#c4c4c4) | semibold |

> **Section Header 색 체계 (v1.3, 2026-06-04)**: bg는 Nav Item과 동일 단일 `faint/active`(#ecf7fe) — Hover·DragOver 공통(DragOver=Hover). Rest·Disabled는 fill 미바인딩(컨테이너 #fff 투과, *컨테이너 bg 동일=fill 미바인딩 원칙*). Nav Item과 차이 = **상시 semibold + leading icon `muted/default`(#909090)**. 옛 `subtle/active`(#d7ebfc) Hover/DragOver는 2026-06-04 Anna가 `faint/active`로 통일(Figma 재바인딩).

> `Expanded` 상태는 별도 슬롯 컴포넌트 `_Leading Header Element`(Level × Expanded)로 외부화. form-field 슬롯 패턴 적용.

### 3-3. `_LNB Action Button`

LNB 안의 주요 액션 트리거 (예: "메일 쓰기", "휴가 신청").

**Variants**

| Property | Values |
|---|---|
| Availability | Enabled / Disabled |
| Interaction | Rest / Hover (**Pressed 제외**) |

**토큰 매핑 (Figma 실측 2026-06-04, v1.3)**

| State | bg | text | icon |
|---|---|---|---|
| Rest | none (컨테이너 색 #fff 투과) | `sys.text.neutral.normal.default` | `office.icon.brand.normal.default` (#1c7fd3) |
| Hover | `office.bg.brand.faint.active` (#ecf7fe) | `sys.text.neutral.normal.default` | `office.icon.brand.normal.default` (#1c7fd3) |
| Disabled | none (컨테이너 색 투과 — Rest 동일) | `sys.text.neutral.normal.disabled` (#aeaeae) | `office.icon.brand.normal.disabled` (#badbf8) |

> **Action Button 색 체계 (v1.3, 2026-06-04)**: Hover bg = `faint/active`(#ecf7fe — Nav Item·Section Header 통일). Rest·Disabled fill 미바인딩. Nav Item과 차이 = **leading icon이 brand 색**(Rest #1c7fd3 / Disabled #badbf8) — CTA 성격 반영. DragOver·Selected 미운영. 옛 `subtle/active` Hover는 2026-06-04 `faint/active`로 통일.

> Style=List 단일 운영 (Solid 미적용). Selected 미운영. `_Base Nav Item`과 동일 인터랙션 패턴.
> **역할**: 시각이 메뉴와 닮았으나 의미적으로 **버튼** (레거시 특성). 클릭 즉시 모달/페이지 전환 트리거하여 Pressed 제외 (정책 §2-2-2 영향도 등재).

### 3-4. `_Divider`

메뉴 그룹 간 또는 Action Area 하단 구분선.

- **Stroke 스타일** (Option A, 2026-05-13)
- 두께: `border/width/thin` (=1px) 바인딩
- Color: `office/stroke/brand/faint/default`
- 양쪽 spacing/xs 패딩 컨테이너 적용

### 3-5. `_LNB Footer Container`

하단 고정 영역 (설정·매뉴얼 링크 등).

**Variants**: State = Expanded / Collapsed

### 3-6. `_Footer Modules`

푸터 내부 슬롯 모듈.

**Variants**: Type = Manual Button / Storage Chart / VAT Calculator

### 3-7. Leading/Trailing Element (4종 슬롯)

Nav Item과 Section Header 양쪽에 들어가는 슬롯형 sub-component.

| 컴포넌트 | 사용처 | 주요 Property |
|---|---|---|
| `_Leading Nav Element` | Nav Item 좌측 | Type=Checkbox/Icon · Has Chevron · Expanded |
| `_Trailing Nav Element` | Nav Item 우측 | Type=Icon Button / Outline Button / Action Group |
| `_Leading Header Element` | Section Header 좌측 | Level · Expanded |
| `_Trailing Header Element` | Section Header 우측 | Type=Icon Button / Action Group |

---

## 4. 토큰 매핑표 — `_Base Nav Item`

### 4-1. Selected=False · Level=1 (v1.2 — 2026-06-04 트리거 ② 정정)

| State | bg | text | icon | weight |
|---|---|---|---|---|
| Rest | **none** (LNB 컨테이너 색 투과) | `sys.text.neutral.normal.default` | `sys.icon.neutral.faint.default` | regular |
| **Hover** | **`office.bg.brand.faint.active`** (#ecf7fe) | `sys.text.neutral.normal.default` | `sys.icon.neutral.muted.default` | regular |
| **Disabled** | **none** (LNB 컨테이너 색 #fff 투과 — Rest 동일) | `sys.text.neutral.normal.disabled` | `sys.icon.neutral.subtle.disabled` | regular |
| **DragOver** | **`office.bg.brand.faint.active`** (#ecf7fe, = Hover) | `sys.text.neutral.normal.default` | `sys.icon.neutral.muted.default` | regular |
| **Dragging** | `office.bg.brand.subtle.default` (#e6eff9) + `sys/opacity/dragging` (50%) + `sys/elevation/floating` | — | — | regular |

> **Rest fill 제거 결정 (2026-05-13)**: LNB 컨테이너 배경색 자동 동기화 + 토큰 절약.
> **Hover bg `brand/faint/active` (v1.1, 2026-05-21)**: 옛 cool_gray.100(#f3f4f6) → light_blue.95(#ecf7fe) 재정렬. *Hover = 가장 옅은 임시 강조* 정합. `faint/active` 슬롯 신설 (정책 명분 원칙 #2 갱신 — faint도 .default/.active 표준 진입).
> **Disabled bg none (v1.2, 2026-06-04, 트리거 ②)**: Figma 실측(node 338:1956 등) — Disabled variant에 fill 변수 **미바인딩**. *컨테이너 bg 동일 = fill 미바인딩 원칙* (컨테이너 = `bg/neutral/faint/default` #fff, Rest 동일). 옛 v1.1 `subtle/disabled`(#d6deeb) 바인딩은 Figma 미적용 → supersede. text/icon만 dim. **AI 가독성: 빈칸 금지, `none`+사유 명시.**
> **Disabled chevron**: `sys.icon.neutral.subtle.disabled` (#c4c4c4) — `_Leading Nav Element` 내부 chevron에 적용.
> **DragOver bg `faint/active` (v1.2, 2026-06-04, 트리거 ②)**: Figma 실측(node 338:2137 등) — DragOver = Hover와 동일 `faint/active`(#ecf7fe) 바인딩. 옛 v1.1 `subtle/active`(#d7ebfc) 재바인딩은 Figma 미적용 → supersede. ⚠️ DragOver 시각 = Hover 동일(드래그 타깃 변별 신호 없음 — 오너 ② 수용, a11y watchlist A11Y-LNB-01 등재).
> **Dragging (v1.1, 2026-05-21, spec 신규 등재)**: subtle/default bg + 50% opacity + floating elevation. Figma 실측 반영.

### 4-2. Selected=True · Level=1 (Interaction=Rest 단일)

| State | bg | text | icon | weight |
|---|---|---|---|---|
| Rest | `office.bg.brand.normal.default` (#d8e9fb) | `office.text.brand.strong.default` (#0062c1) | `office.icon.brand.strong.default` (#0062c1) | **semibold** |

> Selected 메뉴는 Hover/Pressed 영향 안 받음 — 현재 메뉴 영구 강조.

### 4-3. Typography

| Variant | Text Style |
|---|---|
| Selected=False (Rest/Hover/Disabled) | `sys.typo.body.md.regular` |
| Selected=True | `sys.typo.body.md.semibold` |

---

## 5. 신설 토큰

### 5-1. v1 등재 (2026-05-13)

| 토큰 | 값 | 계층 | 용도 |
|---|---|---|---|
| `global.border.width.thin` | 1 | primitive | Divider 1px stroke 등 |
| `sys.border.width.thin` (alias) | `{global.border.width.thin}` | semantic | sys 레이어 alias (size 토큰 B안 선례 적용) |
| `sys.icon.neutral.faint.default` | `#aeaeae` | semantic | 약한 강도 neutral 아이콘 (Nav Item Rest leading 아이콘) |
| ~~`office.bg.brand.faint.default`~~ | ~~#f3f4f6~~ | ~~service~~ | **v1.1 재정렬 — light_blue.100(#f6fbfe)로 reference 변경. cool_gray 환수** |
| ~~`office.bg.brand.faint.active`~~ | ~~#e8e9ec~~ | ~~service~~ | **v1.1 폐기 — DragOver는 `subtle/active`로 흡수. faint.active는 light_blue.95(#ecf7fe)로 재정의되어 Hover 슬롯 점유** |

### 5-2. v1.1 신설/재정렬 (2026-05-21)

| 토큰 | 값 | 계층 | 용도 |
|---|---|---|---|
| `office.bg.brand.normal.active` | `{global.color.sky_blue.90}` (#badbf8) | service | normal Hover/Pressed (Hover=Active 통합) |
| `office.bg.brand.normal.disabled` | `{global.color.blue_gray.80}` (#c2cee1) | service | normal 비활성 |
| `office.bg.brand.subtle.active` | `{global.color.light_blue.80}` (#d7ebfc) | service | LNB DragOver + Table Selected.Hover. interaction-driven 강조 다중 흡수 |
| ~~`office.bg.brand.subtle.disabled`~~ | ~~#d6deeb~~ | ~~service~~ | **v1.2 폐기 (트리거 ②)** — LNB Disabled fill 미바인딩 확정. LNB 전용 토큰 → 고아화, service-tokens.json 제거 |
| `office.bg.brand.faint.default` | `{global.color.light_blue.100}` (#f6fbfe) | service | (재정렬) 옅은 brand bg 진입점. cool_gray.100→light_blue.100 |
| `office.bg.brand.faint.active` | `{global.color.light_blue.95}` (#ecf7fe) | service | (재정렬) LNB Hover. 가장 옅은 임시 강조. faint emphasis .active 슬롯 표준 진입 |

**3단계 계층 무결성** ✅
- `sys.icon.neutral.faint` — `neutral` intent → sys 정상
- `office.bg.brand.*` — `brand` intent → service가 global 직접 참조 (sys 우회는 의도된 정상 경로)
- `border.width` — global primitive + sys alias 패턴
- **cool_gray 의존성 완전 환수** (2026-05-21) — service/office/brand 슬롯 전수 검사 완료 (정책 명분 원칙 #6)
- **light_blue 팔레트 brand 변종 공식 지위** (2026-05-21) — subtle/active, faint/default, faint/active 3 슬롯 점유 (원칙 #7)

---

## 6. 운영 가이드

### 6-1. 배포 규칙

- 시스템 공통 뼈대(`_LNB Template`, `_Base Nav Item`, `_Section Header`, `_Divider`, `_LNB Footer Container`, `_Footer Modules`, Leading/Trailing Element 4종)는 **`_` prefix로 Hidden** 처리 — Figma 에셋 패널 비노출
- 서비스별 마스터(`LNB / Mail`, `LNB / Approval` 등) — Visible

### 6-2. 서비스별 LNB 적용 (Template Pattern + 동기화 방식 A)

1. 시스템 디자이너: `_LNB Template`만 관리
2. 서비스별 LNB = `_LNB Template` 인스턴스 + Scroll Area 슬롯에 Nav Item·Section Header·Divider 채움
3. 완성된 인스턴스를 새 마스터(`LNB / {Service}`)로 격상
4. **변경 동기화**: Template 변경 시 모든 서비스 마스터 자동 반영

> **현재 운영 (2026-05-13)**: 모든 서비스별 LNB 마스터를 `DesignSystemOffice-anna` 파일에 **통합 보관**. 메타데이터 확인된 인스턴스: `mail`, `booking`, (전자결재 추정).
> 추후 서비스별 디자인 파일로 분리 가능성 있음 — 분리 시점에 본 문서 §1 파일 위치 갱신.

### 6-3. 오토레이아웃 규칙

- LNB 메인 프레임: **W 276px 고정**
- 내부 컨테이너 및 아이템: 모두 **Fill container** — 텍스트 길이 대응

### 6-4. 스크롤 거동

- Top Header / `_LNB Footer Container`: **Fixed**
- Scroll Area: `Overflow: Vertical` — 메뉴 목록만 스크롤

---

## 7. 정책 정합 — LNB 패턴 예외 사유

본 컴포넌트는 정책 `component-property-policy.md` §2-2-1 **LNB 패턴 예외 조항** 적용 대상.

**Pressed Variant 제외 사유:**
- `_Base Nav Item`: 클릭 즉시 `Selected=True` 진입 + 페이지 전환 트리거 → Pressed 순간 시각 차등이 의미 없음
- `_LNB Action Button`: 클릭 즉시 모달/페이지 전환 트리거 → 동일 논리

**Selected Property 추가 (`_Base Nav Item`만):**
- 정책 §1-1, §4-1 — `Active` 폐기 → `Selected` 분해 권고 정합
- `_LNB Action Button`은 Selected 무의미 — 미신설

**`_Leading Nav Element=True` 디폴트 (LNB 한정 예외):**
- form-field role 원칙 "PSC defaults 모두 false (부가 요소 opt-in)"의 LNB 한정 의도된 예외
- 사유: LNB 메뉴는 좌측 아이콘 상시 노출이 표준

---

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-13 | **v1 신규 작성** — Anna 검수 종결 반영. Selected Property 신설 · Pressed LNB 패턴 예외(§2-2-1, §2-2-2 갱신) · Divider Option A 적용 · 신설 토큰 6건 등재. 동기화 방식 A, 서비스별 마스터 office 파일 통합 운영 확정. |
| 2026-05-21 | **v1.1 토큰 매핑 재정렬** — Figma 실측 vs spec drift 5건 정정. (1) Hover bg `faint/default`(#f3f4f6, cool_gray.100) → `faint/active`(#ecf7fe, light_blue.95) (2) Disabled bg `subtle/default` → `subtle/disabled`(#d6deeb, blue_gray.90) (3) DragOver bg `faint/active`(#e8e9ec, cool_gray.95) → `subtle/active`(#d7ebfc, light_blue.80) — interaction 강도 진행 정합 (4) Dragging spec 신규 등재 (5) §5 신설 토큰표 v1.1 재정렬. **cool_gray 환수 · light_blue 도입 · faint emphasis .active 슬롯 표준 진입** (정책 명분 원칙 #2·#5·#6·#7 갱신). 재개 트리거 ② (Figma 실측 충돌). |
| 2026-06-04 | **v1.2 정정 (트리거 ② 실측 검수 충돌)** — Figma variable_defs 검증(node 338:1126). (1) Disabled bg `subtle/disabled`(#d6deeb) → **none**(컨테이너 bg=#fff 동일, fill 미바인딩, Rest 동일) (2) DragOver bg `subtle/active`(#d7ebfc) → `faint/active`(#ecf7fe, = Hover). v1.1 두 재바인딩이 Figma 마스터에 미적용임을 실측 확인 → supersede. `office/bg/brand/subtle/disabled` 고아화 → service-tokens.json 제거. Dragging은 Figma=문서 정합(무변경, 그림자 0/2/8 8% 확인). 오너 Anna ② 승인. sync §1/§4/§8 + guide Part 9 + a11y watchlist 동기. |
| 2026-06-04 | **v1.3 — Section Header·Action Button 색 매핑표 신설 + faint/active 통일.** v1.2(Nav Item) 후속 Figma 전수 재검증(_Section Header·_LNB Action Button·_Divider·_Leading·_Footer). 두 컴포넌트가 옛 `subtle/active`(#d7ebfc) Hover/DragOver를 쓰던 것을 Anna가 `faint/active`(#ecf7fe)로 Figma 재바인딩 → **LNB 전역 단일 faint/active 체계(Hover=DragOver)**. §3-2/§3-3 색표 신규 등재(SH=상시 semibold+muted icon / AB=brand icon #1c7fd3·#badbf8). `subtle/active`는 LNB 미사용이나 Table·Timetable 사용 중 → 토큰 유지. `_Divider` stroke `office/stroke/brand/faint/default`(#d6deeb) JSON 실재 확인. Figma=최종 원칙. 신규 토큰 0건. |
