# Button — Office

> **Hiworks Design System v3** · Service Component · Office 브랜드
> 단일 기준 문서: `hiworks-ds-guide.md` · 최종 갱신: 2026-04-27 (v5 — v3 빌드 결과 반영)

---

## 1. 개요

| 항목 | 값 |
|---|---|
| 컴포넌트명 | `Button` · `Button-IconOnly` |
| 분류 | **Service Component** (정책 v3.4) |
| 브랜드 | Office (sky_blue 계열 · 메인 `#1c7fd3`) |
| 참조 토큰 레이어 | `service.office.*` + `sys.*` |
| 브랜드 대칭 | HR과 100% 동일 스켈레톤 · 토큰만 차등 |

---

## 2. Button (표준)

### 2-1. Property 구조

> **3축 분리 정책 적용 (2026-04-30)** — 단독 정책 문서 `component-property-policy.md` 참조.
> 기존 `State` Property를 `Availability` + `Interaction`으로 분리. 토큰 매핑(§3)은 변경 없음.

#### Variants

| Property | Values | 개수 |
|---|---|---|
| **Role** | Brand / Neutral / Destructive / Critical | 4 |
| **Style** | Solid / Outline / Ghost / Text | 4 |
| **Size** | xs / sm / md / lg | 4 |
| **Availability** | Enabled / Disabled | 2 |
| **Interaction** | Rest / Hover | 2 |
| **Icon Position** | none / leading / trailing | 3 |

> **명명 매핑 (이전 → 신규)**:
> - `State=Default` → `Availability=Enabled` + `Interaction=Rest`
> - `State=Active` → `Availability=Enabled` + `Interaction=Hover` (Hover=Active 통합 정책 연장 — 누름·호버 의미 흡수)
> - `State=Disabled` → `Availability=Disabled` + `Interaction=Rest`
> - `FocusVisible`은 Variant matrix 제외 — `🎯 Focus Ring 가이드` Frame 운영 (정책 일관성)
> - **`Pressed`는 보류 슬롯** — 시각 차등 필요 시 비파괴적 enum 추가 (`component-property-policy.md` Part 2-2-1)

#### Booleans (v3 빌드 미반영 — 후속 작업)
- `Dropdown` — true / false · 우측 `▼` 아이콘 추가 (interaction 의미)
  > v3 범위 외 — 차기 빌드에서 도입 예정

#### Text
- `Label` — 버튼 텍스트

### 2-2. 유효 Role × Style 조합 (8개)

| | Solid | Outline | Ghost | Text |
|---|:---:|:---:|:---:|:---:|
| **Brand** | ✅ | ✅ | — | ✅ |
| **Neutral** | ✅ | ✅ | ✅ | — |
| **Destructive** | ✅ | — | — | — |
| **Critical** | ✅ | — | — | — |

> 무효 조합(`—`)은 Figma Component Set에서 해당 Frame 생성 생략

### 2-3. 총 Variant 수
`8 유효 조합 × 4 Size × 2 Availability × 2 Interaction × 3 Icon Position` = **384 variants** (정책 적용 후 / 빌드 재구성 대상)

> **빌드 재구성 영향도**: 기존 288 → 384 (Disabled 케이스에서 Hover가 무의미하므로 빌드 시 무효 조합 자동 생략 권장 → 실효 ~288, 즉 기존과 거의 동일 수준). 후속 빌드 작업 시 적용.
> **길 2 적용 (2026-05-04)**: Pressed enum 제거로 기존 길 1 산식 576 → 길 2 산식 384로 ~33% 절감.

> **Focus state는 Component variant에서 제외** — 별도 `🎯 Focus Ring 가이드` frame 으로 분리 (자세한 내용 §3 표기 규칙 참조)
> **Dropdown boolean** 은 v3 빌드 범위 외

---

## 3. 토큰 매핑표

### 표기 규칙
- `svc` = `service.office` · `tr` = transparent (Focus 행은 v5 부터 별도 Frame 분리)
- **State 규칙**:
  - Hover 상태는 Active 토큰과 공유 (Figma Variant 상에서도 통합)
  - **Focus state는 Component Variant에서 제외** — 별도 `🎯 Focus Ring 가이드` frame 으로 분리 (ring: 브라우저 default focus blue · width 2px · spread 2px · 활성: `:focus-visible` · 합의: 토큰화 안함)
  - Disabled 텍스트/아이콘: Solid는 `sys.*.inverse` 유지, Outline/Ghost/Text는 Role에 따라 sys 또는 svc의 `.disabled`

> 아래 §3-1 ~ §3-8 표에서 `focus` 행은 v3 빌드에서 모두 제거됨 (별도 frame 참조)

### 3-1. Brand-Solid

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `svc.bg.brand.strong.default` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| active | `svc.bg.brand.strong.active` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| disabled | `svc.bg.brand.strong.disabled` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |

### 3-2. Brand-Outline

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `sys.bg.neutral.faint.default` (white) | `svc.text.brand.normal.default` | `sys.stroke.neutral.subtle.default` | `svc.icon.brand.normal.default` |
| active | `sys.bg.neutral.faint.default` (white) | `svc.text.brand.normal.default` | `svc.stroke.brand.normal.default` | `svc.icon.brand.normal.default` |
| disabled | `sys.bg.neutral.faint.default` (white) | `svc.text.brand.normal.disabled` | `sys.stroke.neutral.subtle.default` | `svc.icon.brand.normal.disabled` |

> **피드백 철학**: default·active·disabled 모두 bg는 **white(faint.default) 유지**. stroke만 active 시 브랜드 컬러로 reveal (v8 확정 — HR/Office 정책 통합).
> Neutral-Outline 의 `faint.active` 회색 hover 효과와 차별화 — Brand 는 stroke 변화로만 피드백.

> **피드백 철학**: default에는 중립 회색 stroke, active 시점에 브랜드 컬러 reveal

### 3-3. Brand-Text

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | tr | `svc.text.brand.normal.default` | — | `svc.icon.brand.normal.default` |
| active | `sys.bg.neutral.subtle.default` (중립 회색) | `svc.text.brand.strong.default` | — | `svc.icon.brand.normal.default` |
| disabled | tr | `svc.text.brand.normal.disabled` | — | `svc.icon.brand.normal.disabled` |

> **피드백 철학**: active bg는 **중립 회색 (gray.100)** 으로 운영 — `service.office.bg.brand.subtle` 신설 보류하고 `sys` 레이어 재사용 (v8 확정).
> Neutral-Ghost active 와 bg는 동일, **text는 `svc.text.brand.strong.default`** 로 브랜드 정체성 유지.

### 3-4. Neutral-Solid

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `sys.bg.neutral.subtle.default` | `sys.text.neutral.normal.default` | — | `sys.icon.neutral.normal.default` |
| active | `sys.bg.neutral.subtle.active` | `sys.text.neutral.normal.active` | — | `sys.icon.neutral.normal.active` |
| disabled | `sys.bg.neutral.subtle.disabled` | `sys.text.neutral.normal.disabled` | — | `sys.icon.neutral.normal.disabled` |

### 3-5. Neutral-Outline

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `sys.bg.faint.default` | `sys.text.neutral.normal.default` | `sys.stroke.neutral.subtle` | `sys.icon.neutral.normal.default` |
| active | `sys.bg.faint.active` | `sys.text.neutral.normal.active` | `sys.stroke.neutral.subtle` | `sys.icon.neutral.normal.active` |
| disabled | `sys.bg.faint.default` | `sys.text.neutral.normal.disabled` | `sys.stroke.neutral.subtle` | `sys.icon.neutral.normal.disabled` |

> **피드백 철학**: bg 변화(white→gray.100) + text 진하기. stroke는 고정 subtle

### 3-6. Neutral-Ghost

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | tr | `sys.text.neutral.normal.default` | — | `sys.icon.neutral.normal.default` |
| active | `sys.bg.neutral.subtle.default` | `sys.text.neutral.normal.active` | — | `sys.icon.neutral.normal.active` |
| disabled | tr | `sys.text.neutral.normal.disabled` | — | `sys.icon.neutral.normal.disabled` |

### 3-7. Destructive-Solid

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `sys.bg.neutral.strong.default` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| active | `sys.bg.neutral.strong.active` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| disabled | `sys.bg.neutral.strong.disabled` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |

### 3-8. Critical-Solid

| State | bg | text | stroke | icon |
|---|---|---|---|---|
| default | `sys.bg.alert.strong.default` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| active | `sys.bg.alert.strong.active` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |
| disabled | `sys.bg.alert.strong.disabled` | `sys.text.neutral.inverse.default` | — | `sys.icon.neutral.inverse.default` |

---

## 4. Size · Dimension 매핑

### 4-1. Button (표준)

> **Style별 Padding 차등 정책 (v11 — 2026-05-07)** — Solid·Outline 은 시각 경계(bg/border)가 명확해 기존 패딩 유지, Text·Ghost 는 경계 없이 텍스트 hit area 만 노출되어 동일 패딩 시 시각적으로 과해 보임 → **한 단계 다운 스케일 적용**.

| Size | Height | Padding-H<br/>(Solid·Outline) | Padding-H<br/>(Text·Ghost) | Gap(icon↔label) | Radius | Typography (key) | Icon Size |
|---|---|:---:|:---:|---|---|---|---|
| **xs** | 24 | 10 | **6** | 4 | 4 | `sys/typo/label/xs/medium` (12 / lh 17) | 12 |
| **sm** | 26 | 10 | **8** | 4 | 4 | `sys/typo/label/sm/regular` (13 / lh 17) | 12 |
| **md** ← 기본 | 34 | 20 | **10** | 6 | 4 | `sys/typo/label/md/regular` (14 / lh 18) | 13 |
| **lg** | 44 | 56 | **12** | 10 | 4 | `sys/typo/label/lg/regular` (18 / lh 25) | 14 |

**토큰 바인딩 (Padding-H)**

| Size | Solid · Outline | Text · Ghost |
|---|---|---|
| xs | `sys.spacing.sm` (10) | `sys.spacing.2xs` (6) |
| sm | `sys.spacing.sm` (10) | `sys.spacing.xs` (8) |
| md | `sys.spacing.xl` (20) | `sys.spacing.sm` (10) |
| lg | `sys.spacing.6xl` (56) | `sys.spacing.md` (12) |

> ✅ **Layout / Radius 토큰 바인딩 완료** — 모든 padding/gap/radius 가 `sys.*` Semantic 토큰으로 바인딩됨 (3계층 무결성 충족)
>
> **Typography 정책**
> - xs 만 Medium (가독성), sm/md/lg 는 Regular
> - Text Style 은 라이브러리 키 import 방식 (`importStyleByKeyAsync`) — 라이브러리 재 publish 시 `TEXT_STYLE_KEYS` 갱신 필요
>
> **lg 의 Padding-H 차등 운영**
> - **Solid·Outline lg = 56**: 100% width CTA (로그인 / 주목 CTA) 시 좌우 여백 보장용 — 인스턴스 시 `layoutAlign=STRETCH` 권장
> - **Text·Ghost lg = 12**: full-width CTA 용도 아님(보조·인라인 액션) → 표준 다운 스케일 유지

### 4-2. Icon Position 배치 규칙

| Position | 구조 |
|---|---|
| `none` | `[ Label ]` |
| `leading` | `[ Icon · Gap · Label ]` |
| `trailing` | `[ Label · Gap · Icon ]` |

**Dropdown 보조 규칙 (v3 빌드 미반영 — 차기 빌드 도입 예정)**
Dropdown=true 시 Icon Position 과 독립적으로 우측 `▼` 추가:
- `leading + dropdown` → `[ Icon · Label · ▼ ]` (권장)
- `trailing + dropdown` → `[ Label · Icon · ▼ ]` (비권장 — 시각 혼잡)

Border width (Outline): **1px 고정** (토큰화 보류 — 향후 #20 Layout/Radius 토큰 바인딩 작업과 함께 검토)

---

## 5. Button-IconOnly (Standard Button 미러 sub-component)

### 5-1. 사용 범위 (v7 확정 — 표준 Button §3 와 동일 매핑)
- **Role × Style**: 표준 Button 의 8개 유효 조합 모두 지원 (§5-3 참조)
- **Size**: xs / sm / md **(lg 제외)**
- **Availability** + **Interaction**: 표준 Button §2-1과 동일 (Enabled/Disabled × Rest/Hover)
- **Dropdown**: 없음 (IconOnly 특성상)

### 5-2. Property 구조

> **3축 분리 정책 적용 (2026-04-30)** — 표준 Button §2-1과 동일 정책 (`component-property-policy.md` 참조).

| Property | Values | 개수 |
|---|---|---|
| **Role** | Brand / Neutral / Destructive / Critical | 4 |
| **Style** | Solid / Outline / Ghost / Text | 4 |
| **Size** | xs / sm / md | 3 |
| **Availability** | Enabled / Disabled | 2 |
| **Interaction** | Rest / Hover | 2 |

#### 유효 Role × Style 조합 (8개) — 표준 Button §2-2 와 동일

| | Solid | Outline | Ghost | Text |
|---|:---:|:---:|:---:|:---:|
| **Brand** | ✅ | ✅ | — | ✅ |
| **Neutral** | ✅ | ✅ | ✅ | — |
| **Destructive** | ✅ | — | — | — |
| **Critical** | ✅ | — | — | — |

총 Variant 수: `8 유효 조합 × 3 Size × 2 Availability × 2 Interaction` = **96 variants** (정책 적용 후 / 빌드 재구성 대상)

> **lg 제외 사유**: IconOnly 는 본문 강조용 CTA 보다는 **툴바/테이블/필드 보조** 용도가 주력 → lg(44×44) 케이스 실사용 빈도 낮음.

### 5-3. 토큰 매핑 — **표준 Button §3-1 ~ §3-8 의 `bg / stroke / icon` 매핑을 그대로 적용**

> Text 항목만 IconOnly 특성상 미적용. 모든 토큰 레퍼런스는 §3 표 참조.
> 예: IconOnly Brand-Solid Active → `service.office.bg.brand.strong.active` + `sys.icon.neutral.inverse.default` (§3-1 동일)

### 5-4. Size — 정사각형 (width = height)

| Size | W × H | Padding | Icon Size | Radius |
|---|---|---|---|---|
| **xs** | 24 × 24 | 자동 ((dim − iconSize) ÷ 2 = 6) | 12 | 4 |
| **sm** | 26 × 26 | 자동 (= 6) | 14 | 4 |
| **md** ← 기본 | 34 × 34 | 자동 (= 8) | 18 | 4 |

> **Padding**: Auto Layout `CENTER` 정렬 + 고정 `dim` 사용 → 별도 padding 값 미설정 (토큰 바인딩 무관)
> **Radius**: `sys.radius.sm` 바인딩 (v6 빌드부터 정상)
> **Icon Size**: 현재 raw px — **#20 후속 보완 대상**

---

## 6. 접근성 체크

| 조합 | 명도 대비 | WCAG |
|---|---|---|
| Brand Solid text(white) on `sky_blue.40` | 4.7 : 1 | AA ✅ |
| Destructive Solid text(white) on `gray.30` | 7.1 : 1 | AAA ✅ |
| Critical Solid text(white) on `red.50` | 3.5 : 1 | Large Text(14px+ SemiBold) AA ✅ · xs(12px) 재검토 권장 ⚠️ |

---

## 7. 정책방 이관 안건 (작업방 합의 완료)

| # | 안건 | 상태 |
|---|---|---|
| 1 | `sys.text.neutral.inverse` / `sys.icon.neutral.inverse` 신설 | ✅ 토큰 반영 — **추인 필요** |
| 2 | Hover → Active 통합 운영 (Variant·토큰 모두) | 원칙 등록 필요 |
| 3 | Focus ring width 2px 상수 (중장기 토큰화 후보) | 대기 |
| 4 | `service.office.text.brand.normal.disabled` (sky_blue.90) | ✅ 토큰 반영 — **추인 필요** |
| 5 | `service.office.icon.brand.normal.disabled` (sky_blue.90) | ✅ 토큰 반영 — **추인 필요** |
| 6 | Outline의 default stroke = `sys.stroke.neutral.subtle` (브랜드 stroke는 active reveal) | 설계 원칙 등록 필요 |

---

## 8. 작업 이력

- 2026-04-21 v1 — 초안 매트릭스 (Role 3종 + Style 3종)
- 2026-04-21 v2 — Gemini 1차 분류 기준 재설계 (Role 4 × Style 4)
- 2026-04-21 v3 — Outline bg 고정, Focus ring 공통 중립, brand disabled 토큰 신설
- 2026-04-21 v4 — Icon Position Enum 도입, Button-IconOnly 분리 (Brand-Solid 한정)
- 2026-04-27 v5 — **v3 빌드 결과 반영**
  - Focus state Variant 제외 (별도 `🎯 Focus Ring 가이드` Frame 으로 분리)
  - Dropdown boolean v3 빌드 범위 외 명시
  - 표준 Size 빌드값 동기화: sm Height 28→26, md Height 36→34, Padding-H/Gap/Radius 전면 갱신 (Radius 4 통일)
  - Typography Token 형식 명시 (`sys/typo/label/{size}/{weight}` · xs Medium, 외 Regular)
  - IconOnly Size 표 동조 (Padding 자동 계산 표기)
  - **#20 Layout / Radius 토큰 바인딩 미적용** 사항 spec 명시 (후속 보완 트리거)
- 2026-04-28 v6 — **빌드 정합성 확정** (HR 동기화)
  - **#20 해소**: `layoutBoundVariables` 정상 바인딩 확인
  - **§3-2 Brand-Outline `active` bg**: `sys.bg.neutral.faint.default` (white) 로 확정 (stroke만 brand reveal)
  - **§3-3 Brand-Text `active` bg**: `sys.bg.neutral.subtle.default` (중립 회색) 로 확정
  - **Dropdown Icon visibility 정합성**: Icon Position=none 변형에서 hidden 처리 확인
  - 총 Variant 수: **288 유지** (8 × 4 × 3 × 3, Focus state 제외)
- 2026-04-28 v7 — **Button-IconOnly 범위 확장** (HR 동기화)
  - **Role × Style**: Brand-Solid 한정 → 표준 Button §3 의 8개 유효 조합 전체 지원
  - **Size**: lg 제거 (xs / sm / md 만 운영 — IconOnly 의 툴바·테이블 보조 용도 특성 반영)
  - **State**: 변경 없음 (Default / Active / Disabled)
  - **총 Variant 수**: 12 → **72** (8 × 3 × 3)
  - **토큰 매핑**: 표준 Button §3-1 ~ §3-8 의 `bg / stroke / icon` 그대로 재사용 (Text 제외)
  - **사후 작업**: `code.js` IconOnly 빌더 8조합 분기 추가 + lg 케이스 제거 필요
- 2026-04-28 v8 — **Brand-Outline `active` bg 정책 통합** (Office ↔ HR)
  - **§3-2 Brand-Outline `active` bg**: `sys.bg.neutral.faint.active` (gray) → **`sys.bg.neutral.faint.default` (white)**
  - **§3-3 Brand-Text `active` bg**: `svc.bg.brand.subtle.default` → **`sys.bg.neutral.subtle.default`** (HR v6 동기화)
  - **`code.js` TOKEN_MAP** 수정: Brand-Outline active bg = `sys/bg/neutral/faint/default`
  - 영향 받는 Office Variant: **표준 Button 12 (Brand-Outline×4size×3pos) + IconOnly 3 (Brand-Outline×3size) = 15개 재빌드 필요**
  - HR 은 이미 정책 적용된 상태 — Office 만 재빌드
- 2026-04-30 v9 — **Property 3축 분리 정책 반영 (스펙만 갱신, 빌드 재구성 후속)**
  - `State` Property 폐기 → **`Availability` + `Interaction`** 분리 (`component-property-policy.md` 신규 정책 적용)
  - 명명 매핑: `Default` → `Enabled+Rest` / `Active` → `Enabled+Hover` 또는 `Pressed` (토큰 공유) / `Disabled` → `Disabled+Rest`
  - 토큰 매핑(§3-1 ~ §3-8) 변경 없음 — Hover/Pressed는 모두 기존 `*.active` 토큰 공유 (C안)
  - **본 v9는 스펙 문서 갱신만 — Figma Component Set 빌드 재구성은 후속 작업**
  - `IconOnly` boolean property화 검토 (현재는 별도 sub-component) — 정책방 추가 안건
- 2026-05-04 v10 — **길 2 채택 — Pressed enum 제거**
  - Interaction 값: `Rest / Hover / Pressed` → **`Rest / Hover`** (Pressed 운영 enum에서 제외)
  - Hover가 누름·호버 의미 흡수 — *Hover=Active 통합 정책*(2026-04-22) 연장
  - 표준 Button Variant 수: 길 1 산식 576 → **길 2 산식 384** (~33% 절감)
  - IconOnly Variant 수: 길 1 산식 144 → **길 2 산식 96**
  - 토큰 매핑(§3-1 ~ §3-8) 변경 없음 — Hover만 운영하지만 토큰은 그대로
  - **Pressed는 보류 슬롯**: 시각 차등 결정·토큰 분리·접근성 요구·컴포넌트별 예외 4가지 트리거 충족 시 enum 비파괴적 추가 (`component-property-policy.md` Part 2-2-1, 2-2-2)
  - "Active" 용어 폐기는 그대로 유지 (Hover로 명확화) — C안 핵심 효과 보존
- 2026-05-07 v11 — **Style별 Padding 차등 정책 (Text·Ghost 다운 스케일)**
  - **사유**: Text·Ghost 는 시각 경계(bg/border) 부재 → Solid·Outline 과 동일 패딩 시 시각적으로 과해 보임 (디자이너 피드백)
  - **§4-1 표 분리**: Padding-H 컬럼을 `Solid·Outline` / `Text·Ghost` 2개로 분리
  - **Text·Ghost Padding-H 변경**: xs `10→6`, sm `10→8`, md `20→10`, lg `56→12` (한 단계 다운 스케일)
  - **토큰 바인딩**: Text·Ghost padding 은 `sys.spacing.{2xs|xs|sm|md}` 로 신규 바인딩 (Solid·Outline 기존 유지)
  - **3계층 무결성**: 모든 변경값이 `sys.spacing.*` Semantic 토큰으로 바인딩 — Raw value 참조 없음 ✓
  - **lg 차등 사유 명시**: Solid·Outline lg=56 (full-width CTA 용), Text·Ghost lg=12 (보조·인라인 액션 용)
  - **영향 받는 Variant**: Brand-Text + Neutral-Ghost = 2 Style × 4 Size × 2 Avail × 2 Inter × 3 IconPos = **96개** 빌드값 갱신
  - **HR 동기화 필요**: `button-hr.md` §4-1 동일 정책 적용 검토 (1:1 정합성 원칙)
