---
component: Modal
category: Surface
type: Sys
brand: common
version: 1.6
status: provisional  # MD-1/4/6/7 정책 합의 대기
variants:
  Size: [xs, sm, md, lg, xl, 2xl]
booleans:
  - { name: _Close Button, kind: nested, swap: true }
  - { name: Has Supporting Text, kind: simple, swap: false }
psc:
  - { name: _Close Button, variants: 1 }
  - name: _Footer
    variants: 2  # Layout 축 1개 (Space Between · Centered)
    boolean_properties: [Has Left Checkbox, Has Left Option Link, Has Secondary Button]
    render_combinations: "2 × 2³ = 16 이론치 · Centered에서 LC/LOL 무효 → 10 유효 (Figma 실측 311:958)"
size_dimensions:
  xs: 400
  sm: 520
  md: 640
  lg: 800
  xl: 1000
  "2xl": 1200
tokens_used:
  - sys/radius/sm
  - sys/bg/neutral/faint/default
  - sys/stroke/neutral/subtle/default
  - sys/border/width/thin
  - sys/elevation/modal
  - sys/text/neutral/normal/default
  - sys/typo/heading/sm/semibold
  - sys/typo/body/md/regular
  - sys/icon/neutral/subtle/default
  - sys/spacing/lg
  - sys/spacing/xl
  - sys/spacing/2xl
  - sys/spacing/3xl
  - sys/overlay/neutral/normal/default
---

# Modal

> **Hiworks Design System v3** · Sys Component · Surface 카테고리 · 브랜드 무관 공통
> 단일 기준 문서: `hiworks-ds-guide.md` · 정책: `component-property-policy.md` v3.5
> 최초 작성: 2026-05-07 (v1.0 — Modal Shell + `_Footer` / `_Close Button` PSC 패턴 채택)
> 최종 갱신: 2026-05-12 (v1.6 — YAML frontmatter 신설 + 표기 정책 §1 명시 + `_Footer` Variant/Boolean Property 분리 정합 · §11 참조)

---

## 1. 개요

> ⚠️ **Provisional 안건 안내**: 본 문서의 일부 결정은 정책 v3.6 합의 대기 중 — **MD-1**(Surface 3축 미운영) · **MD-4**(Surface 카테고리 분류 신설) · **MD-6**(Form Wrapper 카테고리) · **MD-7**(PSC 단독 게시 정책 완화). §7 참조. 합의 결과에 따라 §1 분류·§3 Property 구조·`_Footer` Asset 공개 정책이 변경될 수 있음.

> **표기 정책 (로컬)**: 본 문서는 슬래시 표기(`sys/elevation/modal`)를 사용 — Figma Variables 실명 정합. 점 표기(`sys.elevation.modal`)와 동일 토큰 (MD-8 합의 시 가이드 차원 동치 명시 예정).

| 항목 | 값 |
|---|---|
| 컴포넌트명 | `Modal` |
| 분류 | **Sys Component** (정책 v3.4 — `hiworks-ds-guide.md` Part 8 *컴포넌트 3분류 체계*에 *"Modal shell"* 예시 명시) |
| 카테고리 | **Surface** (Form Control 아님 — 컨테이너) |
| 브랜드 | 공통 (Office · HR 동일 사용 — Service mode override 없음. 내부 Button은 Service Component instance로 brand 자연 swap) |
| 참조 토큰 레이어 | `sys.*` 만 사용 (내부 Button은 Service 토큰 사용 — Public Component Instance) |
| 구조 | Wrapper 통합형 (Header · Body · Footer 한 컴포넌트 안) |
| 아키텍처 | Nested Instance 패턴 — `_Close Button` · `_Footer` 외부 swap 슬롯 |
| 본 문서 범위 | **Modal Shell + Footer 매트릭스 + Body Slot 가이드** — Backdrop(Scrim)은 Page Layer 책임 (§6 참조) · Body Slot은 Form Field 등 인스턴스 swap (§6-2 참조) |

> **왜 Surface 카테고리인가?**
> Modal은 사용자가 직접 조작하는 Form Control(Button/Input/Checkbox 등)이 아니라, **다른 컴포넌트를 담는 컨테이너**다. 그래서 `Availability=Disabled` / `Interaction=Hover` / `Validation=Error` 같은 3축 Property가 **본질적으로 무의미**하다.
> select·input은 "사용자 입력을 받는" Sys Component이고, Modal은 "다른 컴포넌트를 담는" Sys Component다. 분류는 Sys로 동일하지만 Property 정책은 다르다.
>
> → **3축 정책 미운영** — `component-property-policy.md` Part 7 *적용 가이드*에 Surface 예외 명문화 필요 (§7 안건 MD-1).

---

## 2. Anatomy

```
[Modal Shell]
 ├─ Header
 │   ├─ Title (Text Property — `header` prop)
 │   └─ _Close Button (`Close Button` Boolean=true 시 노출 · Private Sub-Component swap)
 │       └ Type: Default (Button-IconOnly Office/HR Instance)
 ├─ Body (Slot)
 │   ├─ Supporting Text (Has Supporting Text=true 시 노출 · 헤더 보조 안내문)  ← v1.1 신규
 │   └─ Body (Slot) — Frame (Auto Layout VERTICAL · HUG)
 │     · default 권장 swap: Form Field (`components/form-field.md` 참조)
 │     · 외 swap 가능: TextInput · DatePicker · Text · 자유 인스턴스
 └─ _Footer (Private Sub-Component · 항상 노출 · §3-3 참조)
     ├ Layout: Space Between / Centered
     ├ Booleans: Has Left Checkbox · Has Left Option Link · Has Secondary Button
     └ Right Actions (Slot) — Secondary Button(옵션) + Primary Button · Service Component Instance · itemSpacing `sys/spacing/lg` (§4-2)
```

> **Body는 Frame slot 유지** — `Body (Slot)`은 PSC 격상 안 함 (`_` 접두 미부여 의도 — AI가 PSC 신호로 오인하지 않도록). 사용자 자유 콘텐츠 슬롯이라 swap 외피로 격상하면 오버엔지니어링.
>
> **`_Close Button` PSC 격상 결정 (MD-K03)**: 정책 §4-2 *"swap 가능 외피는 `_` 접두 PSC"* 정합. brand별(Office/HR) Button-IconOnly Instance swap도 자연스럽게 처리됨.

---

## 3. Property 구조

### 3-1. Variants

> **3축 분리 정책 미운영** — Surface 카테고리 예외 (§1 사유, §7 안건 MD-1).
> Variant는 **Size 1축**만 운영. `Layout=Centered` 같은 형태 차이는 PSC `_Footer`에서만 발현.

| Property | Values | 개수 |
|---|---|---|
| **Size** | xs / sm / md / lg / xl / 2xl | 6 |

> **Modal Shell Variant 산식**: 6 (Size 단독) — Form Control과 비교 시 압도적으로 적음. Surface 카테고리 특성상 Variant 폭증이 본질적으로 발생하지 않음. (v1.1에서 `2xl` 추가로 5→6)

### 3-2. Booleans

| 종류 | Property | 의미 | 분기 규칙 |
|---|---|---|---|
| Nested 토글 | `_Close Button` | Header 우상단 닫기 버튼 노출 여부 + swap | `_` 접두 (swap 가능) |
| 단순 토글 | `Has Supporting Text` | Header 아래 보조 안내문 노출 여부 (v1.1 신규) | `Has + Noun` (swap 불가) |

> **PSC 격상으로 Boolean 분기 규칙 적용** (`Has Icon Button` → `_Close Button`). 정책 §4-2 정합.
> 단순 토글(`Has + Noun`)은 v1.1에서 `Has Supporting Text` 신규 추가로 운영 시작. Header 보조 안내문 노출 토글이 유일한 케이스이며, 그 외 외형 차이는 PSC(`_Close Button`) 또는 Footer PSC 내부 Boolean(`Has Left Checkbox` · `Has Left Option Link` · `Has Secondary Button`)으로 위임됨.

### 3-3. Private Sub-Components (Nested Instance)

#### `_Close Button`

| Property | Values | 비고 |
|---|---|---|
| `Type` | `Default` | swap 가능. Button-IconOnly (Office/HR) Instance — brand는 사용처에서 자연 swap |

> **Anatomy**: 26 × 26 box (rounded `sys/radius/sm`). Inner icon 14 × 14 (`sys/icon/neutral/subtle/default`).

#### `_Footer`

| Property | Values | 비고 |
|---|---|---|
| `Layout` | `Space Between` / `Centered` | 좌/우 양끝 vs 중앙 정렬 |
| `Has Left Checkbox` | `True` / `False` | 좌측 Checkbox(Office/HR Instance) 노출 — **Layout=Space Between 시에만 유효** |
| `Has Left Option Link` | `True` / `False` | 좌측 Ghost Button(옵션 링크) 노출 — **Layout=Space Between 시에만 유효** |
| `Has Secondary Button` | `True` / `False` | 우측 보조 버튼('취소' 등) 노출 — Layout 무관 적용 |

> **`_Footer` PSC 격상 결정 (MD-K02)**: 정책 §1-2 *"PSC는 `_` 접두 + 단독 게시 금지"* 정합. 단독 사용 케이스 발생 시 Modal 인스턴스에서 detach 운영.
>
> **Layout=Centered 시 무효화 (Figma 코드 검증 결과)**:
> - `Has Left Checkbox` / `Has Left Option Link` Boolean 값과 무관하게 **표시되지 않음**
> - `Has Secondary Button` 만 `Layout=Centered` 모드에서 의미 유지 (취소·확인 좌우 정렬)
> - Figma `combineAsVariants`에서 무효 조합은 자동 처리되며, 빌드 시 hidden layer로 보존하여 Layout swap 시 비파괴

#### `_Footer` Variant 산식 (Figma 실측 정합 — node `311:958`)

**Figma 실제 구조**: Variant 축 1개 + Boolean Component Property 3개 (Variant 곱 아님)

| 구분 | 값 | 비고 |
|---|---|---|
| Variant 축 | `Layout` (1개) | values: `Space Between` / `Centered` (default `Space Between`) |
| Variant 수 | **2** | Layout 값 개수 |
| Boolean Property | 3개 | `Has Left Checkbox` · `Has Left Option Link` · `Has Secondary Button` (모두 default `true`) |
| 이론적 render 조합 | 2 × 2³ = **16** | Variant × Boolean 곱 |
| 유효 render 조합 | **10** | Space Between 8 (모든 Boolean 조합) + Centered 2 (`Has Secondary Button` 토글만 의미 있음) |

**무효 조합 enumeration (Centered에서 Left 2종 Boolean 무관)**:

```yaml
invalid_combos:
  # Layout=Centered에서 LC=T 또는 LOL=T인 모든 케이스 (Has Secondary Button 무관, 6건)
  - { Layout: Centered, "Has Left Checkbox": true,  "Has Left Option Link": true,  "Has Secondary Button": "*" }  # ×2
  - { Layout: Centered, "Has Left Checkbox": true,  "Has Left Option Link": false, "Has Secondary Button": "*" }  # ×2
  - { Layout: Centered, "Has Left Checkbox": false, "Has Left Option Link": true,  "Has Secondary Button": "*" }  # ×2
# = 6건 무효. 16 - 6 = 10 유효
```

> **v1.5까지 명세 "12 variants" 표기는 오류** — Figma는 Boolean을 Variant 축이 아닌 **Component Property**로 운영. "Variant × Boolean 곱"이라는 산식 자체가 두 개념 혼용. v1.6에서 *Variant 축 / Boolean Property / render 조합* 3계층으로 분리 정정 (P3-3).

### 3-4. Text Properties

- `Title` — Header 상단 타이틀 텍스트 (예: "예약하기")
- `Supporting Text` — Header 아래 보조 안내문 (예: "모달의 용도를 적어주세요.") · `Has Supporting Text=true` 시 노출 (v1.1 신규)
- (Body 내부 콘텐츠는 사용자 swap Instance 책임)
- (Footer 내부 텍스트는 `_Footer` 인스턴스 내 Button instance가 담당)

### 3-5. 총 Variant 수

> **Modal Shell**: 6 variants (Size만 — xs/sm/md/lg/xl/2xl)
> **`_Footer` PSC (외부 분리)**: **2 variants** (Layout 축) + 3 Boolean Property → render 조합 16 이론치 / 10 유효 (§3-3 enumeration 참조)
> **`_Close Button` PSC (외부 분리)**: 1 variant (Type=Default)
>
> Nested Instance로 외부화되어 부모 Modal Shell Variant 수에는 영향 없음. **Surface 카테고리 + PSC 패턴**으로 폭증 회피.

---

## 4. 토큰 매핑표

### 4-1. Modal Shell — 모든 사이즈 공통

| 항목 | 토큰 | 팔레트·실값 |
|---|---|---|
| Box cornerRadius (4 corners) | `sys/radius/sm` | 4 |
| Box fill | `sys/bg/neutral/faint/default` | white (#ffffff) |
| Box stroke | `sys/stroke/neutral/subtle/default` | gray.90 (#d6d6d6) |
| Box strokeWeight | `sys/border/width/thin` | 1 |
| Box strokeAlign | — | INSIDE |
| **Box elevation (Drop Shadow)** | **`sys/elevation/modal`** | DROP_SHADOW(offset 0/8, blur 24, spread 0, color #0000001F) |
| Title fill | `sys/text/neutral/normal/default` | gray.20 (#333333) |
| Title textStyle | `sys/typo/heading/sm/semibold` | 16/lh22 SemiBold |
| Supporting Text fill | `sys/text/neutral/normal/default` | gray.20 (#333333) |
| Supporting Text textStyle | `sys/typo/body/md/regular` | 14/lh21 Regular |
| _Close Button rounded | `sys/radius/sm` | 4 |
| _Close Button icon fill | `sys/icon/neutral/subtle/default` | gray.40 (#676767) |

> **Elevation 토큰 결정 (MD-K04)**: `sys/elevation/modal` 토큰값(blur 24)을 정답으로 채택. 현재 컴포넌트 코드(`drop-shadow-[0px_8px_12px_rgba(0,0,0,0.12)]`)는 토큰 미바인딩 상태 → Figma Variables 패널에서 `sys/elevation/modal` Effect 바인딩으로 정정 필요. SSOT 원칙(`hiworks-ds-guide.md` §7-4) 준수.
>
> **Part 8 등재 제안**: `sys/elevation/modal` 토큰은 현재 Variables에 존재하지만 가이드 Part 8 *주요 결정사항*에 등재 기록 없음 → §7 안건 MD-2로 추가.

### 4-2. Modal Shell — 영역별 spacing·padding

| 영역 | 항목 | 토큰 | 실값 |
|---|---|---|---|
| Header | padding-top | `sys/spacing/2xl` | 24 |
| Header | padding-bottom | `sys/spacing/3xl` | 32 |
| Header | padding-left·right | `sys/spacing/2xl` | 24 |
| Header | itemSpacing (Title↔Close Button) | `sys/spacing/2xl` | 24 |
| Body (Slot) | padding-top | 0 (Header bottom-padding으로 흡수) | — |
| Body (Slot) | padding-bottom | `sys/spacing/2xl` | 24 |
| Body (Slot) | padding-left·right | `sys/spacing/2xl` | 24 |
| Body (Slot) | itemSpacing (Supporting Text ↔ Body) | `sys/spacing/xl` | 20 |
| Footer (`_Footer`) | padding-top | `sys/spacing/lg` | 16 |
| Footer (`_Footer`) | padding-bottom | `sys/spacing/2xl` | 24 |
| Footer (`_Footer`) | padding-left·right | `sys/spacing/2xl` | 24 |
| Footer (`_Footer`) | itemSpacing (요소 간) | `sys/spacing/lg` | 16 |
| Footer Right Actions | itemSpacing (Secondary↔Primary) | `sys/spacing/lg` | 16 |

### 4-3. `_Footer` Variant — Layout별 차이

| Layout | 정렬 방식 | Left 슬롯 | Right Actions 슬롯 |
|---|---|---|---|
| `Space Between` | `justifyContent: space-between` | Has Left Checkbox / Has Left Option Link 표시 (Boolean 제어) | 우측 정렬, `flex-1` 채움 |
| `Centered` | `justifyContent: center` | **무효** (Boolean 값 무관) | 중앙 정렬 |

> Footer 내부 Button Instance는 Service Component로, brand 토큰(`office/bg/brand/strong/default` · `hr/bg/brand/strong/default`)을 자체적으로 사용. Modal Shell의 Sys 토큰 정책과 충돌 없음 (instance 분리).

---

## 5. Size · Dimension 매핑

> 세로 높이는 콘텐츠에 따라 Hug Contents (Auto Layout primaryAxisSizingMode HUG). 가로 너비만 Variant로 고정.

| Size | Box width | 권장 용도 |
|---|---|---|
| **xs** | 400 | 단순 알림 / 확인·취소 팝업 |
| **sm** | 520 | 입력 폼 1~2개 (간단한 데이터 입력) |
| **md** ← 기본 | 640 | 일반 설정 / 예약 폼 |
| **lg** | 800 | 다단 데이터 / 복잡한 폼 구조 |
| **xl** | 1000 | 큰 테이블 |
| **2xl** | 1200 | 대량 데이터 일괄 표시 (v1.1 신규) |

> **v1.1 정정 사항 (MD-A1)**: v1.0 명세(xs=480~xl=1200, 5단계)는 초안 추정값. Figma 실물 동기화 결과 6단계로 갱신 (xs=400~2xl=1200, 8px grid 정합). 모든 폭이 한 단계씩 다운 + 2xl 추가. Carbon Design 패턴 정합.
>
> **간격 비대칭 의도**: 작은 사이즈(xs↔sm↔md, 120/120 간격)는 alert·confirm 미세 차이, 큰 사이즈(lg↔xl↔2xl, 200/200 간격)는 콘텐츠 밀도 차이 반영.
>
> **반응형 max-height + scroll (MD-A6)**: Figma Component는 콘텐츠 Hug만 처리 — `max-height` + 내부 scroll 정책은 **사용처(Page Layer) 책임**으로 둔다. 실측 권장: viewport height의 80% 이내 + Body 영역에 `overflow-y: auto` 적용.

---

## 6. Backdrop (Scrim) 처리 가이드

> **Modal Shell은 Backdrop을 포함하지 않는다.** Page Layer에서 별도 적용.

| 항목 | 처리 |
|---|---|
| 위치 | Modal Shell 외곽 — viewport 전체 덮음 |
| 색상 토큰 | `sys/overlay/neutral/normal/default` (rgba(0, 0, 0, 0.40) — `hiworks-ds-guide.md` §2-3 명시) |
| 적용 위치 | Page · App Shell의 Modal 컨테이너 (Figma Component 외부) |
| 동작 | Modal open 시 페이드 인, close 시 페이드 아웃 (구현 사양) |

> **왜 Modal Component에 포함하지 않나?**
> - Backdrop은 Modal 1개 vs N개 동시 띄움(Stack) 케이스에 따라 합성 처리됨 → 컴포넌트가 자체 책임지면 중첩 시 딤이 누적됨
> - 사용처(Page)에서 z-index 관리와 함께 단일 Backdrop 레이어 운영이 표준 패턴 (MUI · Radix UI · Chakra UI 모두 동일)
> - `sys/overlay/neutral/normal/default` 토큰은 가이드에 이미 정의되어 있어 추가 작업 불필요

---

## 6-2. Body Slot 사용 가이드 (v1.1 신규)

> **Body Slot은 Form Field 인스턴스 swap이 기본 패턴이다.** Modal 자체는 콘텐츠 컨테이너 — 실제 폼 입력 묶음은 외부 컴포넌트(Form Field)가 책임진다.

### 권장 swap 컴포넌트

| 우선 | 컴포넌트 | 사용 케이스 | 참조 문서 |
|---|---|---|---|
| 🟢 1 | **Form Field** | 라벨 + 입력 묶음(가장 일반적) | `components/form-field.md` |
| 🟢 2 | TextInput · Select · DatePicker · RangePicker | 단일 입력만 필요 | 각 컴포넌트 문서 |
| 🟡 3 | 자유 텍스트 / 카드 / 이미지 | 알림·확인 모달의 본문 | — |

### Form Field swap 패턴

```
Modal Shell
 └─ Body (Slot)
     └─ Form Field instance (1~N개 수직 스택)
         ├─ Layout: Vertical (모달 폭이 좁을 때 권장)
         ├─ Layout: Horizontal (md 이상 모달, 라벨 좌측 배치 시)
         └─ Input Slot: TextInput / Radio Group / Checkbox Group / Select / ...
```

> **Form Field 외 직접 입력 컴포넌트 swap 시 주의**: 라벨 처리는 사용처에서 추가 인스턴스로 보강해야 한다 (TextInput 자체의 `Has Label`은 단일 라벨 케이스에만 적합).

### Body Slot 패턴별 sizing 가이드

| Modal Size | Form Field 권장 layout | 권장 인스턴스 수 |
|---|---|---|
| xs (400) | Vertical | 1~2개 (또는 자유 텍스트) |
| sm (520) | Vertical | 2~3개 |
| md (640) ← 기본 | Vertical / Horizontal | 3~5개 |
| lg (800) | Horizontal 권장 | 5~10개 (좌측 라벨 정렬로 가독성 ↑) |
| xl (1000) / 2xl (1200) | Horizontal · 2단 grid 가능 | 10개 이상 |

---

## 7. 정책방 이관 안건

| # | 안건 | 상태 |
|---|---|---|
| **MD-1** | **Surface 카테고리 3축 정책 미운영 명문화** — `component-property-policy.md` Part 7 *적용 가이드*에 "Surface 카테고리(Modal · Toast · Drawer 등)는 3축 미적용" 예외 추가. 현재는 *모든 인터랙티브 컴포넌트*에 3축 강제로 명시되어 있어 Surface 카테고리가 정책 사각지대 | **합의 필요** — 정책 v3.6 후보 |
| **MD-2** | **`sys/elevation/modal` 토큰 가이드 등재 확인** — `hiworks-ds-guide.md` Part 9 변경 이력(2026-05-11, L963)에 `sys.elevation.{none/raised/floating/dropdown/modal/toast}` 6종 신설 등재 확인. 2026-05-11 검수 시 점 표기(가이드) ↔ 슬래시 표기(Modal·Figma) 차이로 grep 누락 → 본 작업방 grep 패턴 정정 후 확인. datepicker-panel · rangepicker-panel · select-listbox · Toast 재사용 패턴 사용 가능 | ✅ **Resolved** — 가이드 기등재 확인, 추가 작업 불필요 |
| **MD-3** | **`sys/border/width/thin` 토큰 기존 존재 확인** — `hiworks-ds-guide.md` Part 9 L963 (2026-05-11) `sys.border.width.{none/thin/medium/thick/heavy}` 5단계 신설 등재 확인. Modal에 본 v1.3 정정으로 바인딩 적용 + Anna Figma 작업방에서 Stroke 슬롯 바인딩 실작업 완료. TextInput · Select · Card 등 잔존 raw 1px stroke 후속 일괄 바인딩 대상 | ✅ **Resolved** — 본 modal.md v1.3 본문 정정 + Figma 바인딩 모두 완료. 타 컴포넌트 후속 바인딩은 별도 작업 |
| **MD-4** | **Surface 카테고리 컴포넌트 분류 신설** — 정책 §1-2 *"State / Visual / Feature/Content / Private Sub-Component"* 4분류에 더해, Modal · Toast · Drawer 등을 묶는 **Surface** 카테고리 신설 검토. Modal-K01 결정의 정책 정합성 확보 | **합의 필요** — 정책 v3.6에서 Form Control vs Surface 구분 명문화 |
| **MD-5** | **Modal Shell의 max-height 정책 위치** — Figma Component는 Hug Contents만 처리, max-height + scroll은 사용처(Page) 책임. 이 분리 정책을 어디에 명문화할지 (가이드? Page Pattern 문서?) | 정책방 검토 |
| **MD-6** | **Form Field 신규 컴포넌트 등재** — Modal `Body` slot의 권장 swap 컴포넌트로 Form Field 등재. Modal 외 Page 직접 사용도 지원하는 공용 Wrapper. `components/form-field.md` v1.0 신규 작성 (v1.1 작업방). 정책방에서 *Sys Component · Form Wrapper 카테고리* 신설 검토 (Surface 카테고리와 별도) | **합의 필요** — 카테고리 신설 |
| **MD-7** | **PSC 단독 게시 정책 완화** — 정책 §1-2 *"PSC = `_` 접두 + 단독 게시 금지"*에서 단독 게시 금지 부분 완화 검토. 디자이너 Asset 검색·swap 워크플로우 효율 확보. 변경안: *"단독 사용 비권장 (Description 의무) + Asset 공개 허용"*. `_` 접두는 그대로 PSC 신호 역할 유지. 영향: `_Leading Element` · `_Trailing Element` · `_Input Content` · `_Close Button` · `_Footer` · `_Field Label` 등 기존 PSC 6종+ 일괄 적용 | **합의 필요** — 정책 v3.6 후보 |
| **MD-8** | **점 표기(JSON 참조) ↔ 슬래시 표기(Figma Variables) 동치 명시** — 가이드 본문은 `sys.elevation.modal` 점 표기, 컴포넌트 명세·Figma Variables는 `sys/elevation/modal` 슬래시 표기를 혼용. 가이드 Part 6-3 *토큰 경로 → CSS/코드 변환* 섹션은 변환 규칙을 다루지만 Part 2-1 *네이밍 컨벤션*에 *"양식 동치"* 1행 부재. AI 컨슈머가 두 표기를 다른 토큰으로 오인할 위험 — 프로젝트 비전 §1 *AI 가독성 중심* 원칙 충돌. 변경안: 가이드 Part 2-1에 *"점·슬래시 표기는 동일 토큰 — JSON·Figma 컨텍스트에 따라 자동 변환"* 1행 추가 | **합의 필요** — 정책 영향 없음, 가이드 보강 단독. 본 modal.md 작업방 발견 (2026-05-12) |

---

## 8. 알려진 이슈 (Known Issues)

| ID | 위치 | 이슈 | 조치 | 상태 |
|---|---|---|---|---|
| MD-K01 | Modal/Base Box elevation | `drop-shadow-[0px_8px_12px_...]` raw value — `sys/elevation/modal` 토큰 미바인딩 | Figma Variables 패널에서 Effect 바인딩으로 정정 (blur 24px) | ✅ **Resolved** (2026-05-12) — Anna Figma 작업방에서 Modal Box Effect 슬롯 `sys/elevation/modal` 바인딩 실작업 완료 보고 |
| MD-K02 | Modal/Footer | Public Component로 단독 게시 — 정책 §1-2 PSC 단독 게시 금지 위반 | `_Footer` rename + Asset 비공개 (단, MD-7 합의 시 공개 허용) | 🟡 v1.1 시점 — `_Footer` rename은 됐으나 정책 v3.6(MD-7) 합의 대기 |
| MD-K03 | Modal/Base Header | `Has Icon Button` → `_Close Button` Nested Boolean 격상 | rename 완료 | ✅ Resolved |
| MD-K04 | Layout=Centered variant 4건 | Has Left Checkbox · Has Left Option Link 무효 조합 명세 누락 | hidden layer로 보존하되 명세에 "Centered 시 무효" 주석 추가 | 🟡 명세는 §3-3에 추가됨, Figma hidden layer 보존 작업 미완 |
| MD-K05 | Modal Property 명명 | **Figma 실물(camelCase)** vs **명세(PascalCase + 공백)** 전면 불일치 — Shell: `header` / `closeButton` / `hasSupportingText` vs `Title` / `_Close Button` / `Has Supporting Text`. **`_Footer` PSC (v1.2 신규)**: `hasLeftCheckbox` / `hasLeftOptionLink` / `hasSecondaryButton` vs `Has Left Checkbox` / `Has Left Option Link` / `Has Secondary Button`. 가이드 Part 8 *1:1 정합성 원칙* 정면 위반 | Figma Property 명을 명세와 통일 (rename) — **단, Figma는 camelCase·공백 미지원** 제약 존재 → **정책방 §7 안건 신규 등재 후보**: ① Figma도 PascalCase로 통일(1:1 정합 ↑, 단 Figma UI 제약 검증 필요) ② 명세를 Figma 변환 규칙(camelCase mapping)에 맞춰 다시 풀이 ③ 양쪽 표기 병기(명세 = canonical, Figma = mirror with rename rule) | 🔴 **Critical** — 가이드 Part 8 *1:1 정합성 원칙* 위반. 정책방 표기 규약 합의 우선 필요 후 일괄 rename |

---

## 9. 접근성 노트

| 조합 | 대비비 | WCAG | 비고 |
|---|---|---|---|
| Title gray.20 on white | ~12.6:1 | AAA ✅ | TextInput Label과 동일 |
| _Close Button icon gray.40 on white | ~5.7:1 | UI 3:1 ✅ | gray.40 = `sys/icon/neutral/subtle/default` |
| Box stroke gray.90 on white | UI ~1.4:1 | UI 3:1 미달 ⚠️ | 다른 컴포넌트와 동일한 알려진 케이스 — `accessibility-watchlist.md` 기등재 |
| Backdrop rgba(0,0,0,0.40) | — | — | 콘텐츠 영역 명확화 OK |

> **§A11Y 보강 권고**:
> - **Focus Trap**: Modal open 시 키보드 포커스가 Modal 내부에서만 순환되어야 함 (Tab/Shift+Tab) — 구현 사양
> - **Initial Focus**: Modal open 시 첫 번째 입력 가능 요소 또는 `_Close Button`에 포커스 (디자인 시스템 권장)
> - **Esc Key Close**: ESC 키로 닫기 가능 — 구현 사양
> - **ARIA**: `role="dialog"` + `aria-modal="true"` + `aria-labelledby={Title id}` — `accessibility-watchlist.md`에 Modal 항목 추가 권고

---

## 10. 모바일 영향 체크 (officeApp · messenger)

| Sys 토큰 | 데스크탑 (현재) | 모바일 오버라이드 (보류) | 영향 |
|---|---|---|---|
| `sys/typo/heading/sm/semibold` (Title) | 16/lh22 | 18px 고려 (보류) | Title 가독성 +2px |
| Modal Box width | xs=400 / sm=520 / md=640 / lg=800 / xl=1000 / 2xl=1200 (§5 정합, v1.1) | viewport 90% 또는 full-width로 재정의 필요 | 모바일은 Size enum 자체 재설계 가능성 (Bottom Sheet 패턴 통합?) |
| `sys/spacing/2xl` (24) Header padding | 24 | 모바일 터치 타겟 영향 미미 (현재 유지 권장) | 변경 없음 |

> 모바일 시안 확정 시 **모바일은 Modal vs Bottom Sheet 분기 검토 필요** — 데스크탑은 중앙 띄움, 모바일은 하단 시트가 일반적. Service 레이어에서 Modal 자체를 오버라이드하기보다 **Bottom Sheet 별도 컴포넌트** 신설이 자연스러움 (후속 작업 후보).

---

## 11. 작업 이력

- **2026-05-12 v1.6** — AI 가독성 구조 개선 3건 (Cowork 작업방)
  - **P3-1 (YAML frontmatter 신설, 문서 최상단)**: LLM 1-shot ingest용 머신 가독 블록. `component / category / type / brand / version / status / variants / booleans / psc / size_dimensions / tokens_used` 필드. peer 컴포넌트(input · select · form-field 등) 11종 모두 frontmatter 부재 확인 → **Modal이 첫 도입 사례**. 후속 컴포넌트 일괄 적용 후보(prototype 단계).
  - **P3-2 (§1 표기 정책 1줄 명시)**: 슬래시 표기(`sys/elevation/modal`) Figma Variables 실명 정합 선언. 점 표기(`sys.elevation.modal`)와 동일 토큰임을 로컬 명시 — MD-8 가이드 차원 합의 전 브리지. 본문 토큰 grep 결과 슬래시 표기 일관 (v1.3 P1-A 일괄 치환 결과 유지 확인).
  - **P3-3 (`_Footer` Variant 산식 Figma 실측 정합)**: Figma node `311:958` 실측 → _Footer는 **Variant 축 1개**(Layout: Space Between · Centered, 2 values) + **Boolean Component Property 3개**(`Has Left Checkbox` · `Has Left Option Link` · `Has Secondary Button`, 모두 default `true`) 구조. v1.5까지 명세 *"2 Layout × 2³ Boolean = 16 → 12 variants"* 산식은 **Variant와 Boolean Property 혼용 오류**. v1.6에서 *Variant 축 / Boolean Property / render 조합* 3계층 분리 정정. 무효 조합 enumeration 추가: Centered + (LC=T or LOL=T) 6건 무효 → 16 이론치 - 6 = **10 유효 render 조합**. §3-3 · §3-5 · frontmatter `psc.[_Footer]` 동시 동기화.
  - **토큰 신설·바인딩 0건. 구조 표기 정합 + 머신 가독 메타데이터 도입만.**

- **2026-05-12 v1.5** — v1.4 P2-1 잔존 active spec `_Body` → `Body (Slot)` 정합 (§4-2 L163 매핑표 우측 참조 · §6-2 L236 Form Field swap 다이어그램 · §7 MD-6 안건 본문 3건). PSC 격상 안 함이므로 `_` 접두 AI 컨슈머 오인 차단. 작업이력(L320·350·364) historical 표기는 보존.

- **2026-05-12 v1.4** — v1.3 마이너 잔존 4건 + P2 일관성 보강 4건 (Cowork 작업방)
  - **M-1 (§4-1 L138 표 셀 정합)**: `| Box strokeAlign | — | INSIDE |` — 토큰 컬럼 셀 누락 정합(3열 구조 복원).
  - **M-2 (§7 MD-2 비고 절대 날짜화)**: *"어제 검수 시"* → *"2026-05-11 검수 시"*. 상대 시점 표기 제거(메모리 룰 정합 — 시간 경과 후 해석 가능성 ↑).
  - **M-3 (v1.0 이력 MD-K01 라벨 충돌 errata)**: v1.0 §11에 적힌 `(MD-K01)` = "3축 정책 미운영 결정"과, v1.1부터 §8 Known Issues에 등재된 `MD-K01` = "Modal Box elevation 미바인딩"이 동일 ID 충돌. v1.0 이력 줄 끝에 errata 1줄 추가하여 히스토리 보존 + 충돌 명시. (옵션 3안 중 ①번 채택)
  - **M-4 (§11 v1.3 항목 P-넘버링 정합)**: `P1-3 (§1 disclaimer)` → `P1-1`, `P1-5 (MD-K05)` → `P1-3`. v1.3 작업 시작 프롬프트 순번과 정합.
  - **P2-1 (§2 Anatomy + L51 노트 `_Body` 표기 통일)**: `_Body` → `Body (Slot)`. `_` 접두는 PSC 신호로 학습되는데, Body는 PSC 격상 안 함(L51 노트 정합) → AI 컨슈머 오인 차단. Anatomy 다이어그램과 노트 한 줄 동시 정정.
  - **P2-2 (§11 v1.0 회고 톤 통일)**: v1.0 Size 매트릭스 줄의 "Figma 실측" 표기를 "v1.0 시점 추정값 — v1.1 실측 동기화로 갱신"으로 톤 정합. v1.1 회고 줄(L335 "초안 추정")과 모순 해소.
  - **P2-3 (§2 Anatomy `Right Actions` 슬롯 명시)**: `_Footer` 내부에 `Right Actions (Slot)` 1줄 추가. §4-2 L167 `Footer Right Actions itemSpacing` 매핑표에 슬롯 존재하나 Anatomy에 부재였던 비대칭 해소.
  - **P2-4 (`accessibility-watchlist.md` A11Y-MDL-01 신규 등재)**: §9 L289 *"기등재"* 주장 실체화. Box stroke gray.90 on white(~1.4:1, UI 3:1 미달 -1.6) 항목 🟡 Monitoring 등재 — 시스템 전반 stroke 토큰 사용처 광범위 → 정책방 일괄 검토 안건으로 분류.
  - **토큰 신설·재바인딩 0건. 본문 정합·표기 통일·외부 watchlist 등재만.**

- **2026-05-11 v1.3** — P0 잔존 클린업 + P1 정책 정합성 신호 보강 (Cowork 작업방)
  - **P0-1 잔존 (L275 MD-K04 본문)**: v1.2에서 표 본체만 `Has +` 접두 적용했으나 MD-K04 *이슈* 설명문에 옛 명칭 잔존 → `Left Checkbox · Left Option Link` → `Has Left Checkbox · Has Left Option Link` 정합.
  - **P0-2 잔존 (L276 MD-K05 본문 확장)**: v1.2에서 신설된 Footer Boolean 3건(`Has Left Checkbox` / `Has Left Option Link` / `Has Secondary Button`) Figma rename 항목을 MD-K05에 추가. **Figma 제약**(camelCase·공백 미지원) 명시 + 정책방 §7 안건 신규 등재 후보 3가지 옵션 기재(① Figma PascalCase 통일 ② 명세 camelCase 변환 ③ 양쪽 병기 mapping).
  - **P1-1 (§1 모두 Provisional disclaimer)**: 정책 v3.6 합의 대기 안건(MD-1 · MD-4 · MD-6 · MD-7) 4건이 §1 분류·§3 Property 구조·`_Footer` Asset 정책에 영향을 줄 수 있음을 상단 1줄 ⚠️ 박스로 명시. AI 가독성·디자이너 정합 검수 효율 ↑.
  - **P1-3 (MD-K05 심각도 격상)**: 🔴 Open → 🔴 **Critical**. 가이드 Part 8 *1:1 정합성 원칙* 정면 위반 명시. 정책방 표기 규약 합의 우선 필요 후 일괄 rename.
  - **P1-2 (strokeWeight 토큰 바인딩, in-place 정정)**: Figma Variables 재검증 결과 `border/width/thin` 기존 토큰 존재 확인 → §4-1 L137을 `sys/border/width/thin` 바인딩으로 정정. §7 MD-3 안건은 ✅ **Resolved** 처리 (신설 검토 → 기존 발견). TextInput · Select · Card 등 타 컴포넌트는 후속 바인딩 대상.
  - **P1-A (Elevation 토큰 명칭 정정)**: `sys/lift/xl`(v1.0 추정 명칭) → `sys/elevation/modal`(Figma Variables 실명) 일괄 치환. 의미적으로도 더 정확 — Modal 전용 elevation. §4-1 / §7 MD-2 / §8 MD-K01 / v1.0 이력 동시 갱신.
  - **2026-05-12 추가 작업 (C·E·MD-8 일괄, in-place 정정)**:
    - **§8 MD-K01 ✅ Resolved**: Anna Figma 작업방에서 Modal Box Effect 슬롯 `sys/elevation/modal` 바인딩 실작업 완료 보고 반영. 명세 ↔ Figma 컴포넌트 정합 완성.
    - **§7 MD-2 ✅ Resolved**: `hiworks-ds-guide.md` Part 9 변경 이력 L963 (2026-05-11)에 `sys.elevation.{6종}` 신설 등재 확인. 점 표기(가이드) ↔ 슬래시 표기(Modal·Figma) 차이로 어제 grep 검수 누락 → 본 작업방 패턴 정정 후 확인. MD-3 비고도 가이드 Part 9 L963 5단계 신설 사실 + Figma 바인딩 완료 사실 추가 보강.
    - **§7 MD-8 신규 등재**: 점·슬래시 표기 동치 명시 안건. AI 가독성 원칙(프로젝트 비전 §1) 위반 위험 대응. 정책 영향 없음, 가이드 Part 2-1 1행 보강 후보.
  - **토큰 신설 0건. 기존 토큰 재바인딩 2건(elevation + border width) + Known Issues + disclaimer 보강 + 05-12 정책방 안건 상태 정합.**

- **2026-05-11 v1.2** — 정책 §4-2 정합 + v1.1 갱신 누락 정정 (Cowork 작업방)
  - **Footer Boolean `Has +` 접두 적용 (P0-1)**: `Left Checkbox` → `Has Left Checkbox`, `Left Option Link` → `Has Left Option Link`, `Secondary Button` → `Has Secondary Button`. 정책 `component-property-policy.md` §4-2 *"단순 visibility 토글(Nested 없음) → `Has + Noun`"* 정합. Anatomy(L46) · `_Footer` PSC 표(§3-3) · Variant 산식(§3-3) · `_Footer` Variant 표(§4-3) 일괄 동기화. **Figma 빌드도 동일 rename 필요** (Known Issue MD-K05에 항목 추가 후속).
  - **§10 모바일 영향 체크 표 Size 수치 동기화 (P0-2)**: v1.0 옛 수치(xs=480 / sm=640 / md=800 / lg=960 / xl=1200, 5단계)가 §5 갱신 후에도 잔존 → 신 수치(xs=400 / sm=520 / md=640 / lg=800 / xl=1000 / 2xl=1200, 6단계) 정합. v1.1 동기화 누락분.
  - **Variant 개수 5→6 동기화 (P0-3)**: §3-1 Values 표 `2xl` 추가, 산식 "5 (Size 단독)" → "6 (Size 단독)", §3-5 "Modal Shell: 5 variants" → "6 variants". v1.1에서 Size 6단계 채택했으나 개수 표기는 5로 잔존 → 정합.
  - **§3-2 Boolean 노트 충돌 해소 (P0-4)**: v1.0 노트 *"단순 토글(`Has + Noun`)은 Modal Shell에서 미사용"*이 v1.1 신규 `Has Supporting Text`와 직접 충돌 → `Has Supporting Text` v1.1 추가로 운영 시작했음을 반영하는 문장으로 갱신.
  - **토큰 신설 0건. Property rename only.**

- **2026-05-07 v1.1** — Figma 실물 동기화 (Cowork 작업방, Figma `312:994` 재분석)
  - **Size 매트릭스 6단계로 갱신**: xs=480→400 / sm=640→520 / md=800→640 / lg=960→800 / xl=1200→1000 / **2xl=1200 신규**. v1.0(5단계, 균일 160 간격)은 초안 추정 — Figma 실측은 8px grid 정합 6단계 + 비대칭 간격(120/120/160/200/200). Carbon Design 패턴 정합.
  - **`Has Supporting Text` Boolean 신규 등재**: Header 아래 보조 안내문 노출 토글 (Material 3 어휘 통일). `Has + Noun` 패턴 (swap 불가). 토큰: `sys/typo/body/md/regular` + `sys/text/neutral/normal/default`. Body 영역 itemSpacing `sys/spacing/xl` (20).
  - **§6-2 Body Slot 사용 가이드 신규**: Form Field 인스턴스 swap이 기본 패턴. Modal Size별 Form Field layout 권장(Vertical/Horizontal) 및 인스턴스 수 가이드.
  - **`components/form-field.md` v1.0 신규 작성**: Sys Component · Form Wrapper 카테고리. Layout × Has Label, `_Field Label` PSC 흡수. Modal `_Body` swap + Page 직접 사용 양쪽 지원.
  - **정책방 이관 안건 2건 추가**: MD-6(Form Field 신규 등재 + Form Wrapper 카테고리 신설) · MD-7(PSC 단독 게시 정책 완화 — Asset 공개 허용 + Description 의무).
  - **Known Issues 상태 갱신**: MD-K03 Resolved, K01·K02·K04 부분 완료, K05 신규(Property camelCase ↔ 명세 어휘 통일).
  - 토큰 신설 0건. Figma rename: `_Form Field` → `Form Field`(공용 격하), `Layput` → `Layout`(오타), `Subtitle` → `_Field Label`(어휘 + PSC 격상), `hasButton` → `hasActionButton`, `hasSubtitle` → `hasLabel`.

- **2026-05-07 v1.0** — 초기 빌드 + 토큰 매핑 합의 (Cowork 작업방, Figma `309:913` 분석 기반)
  - **컴포넌트명**: `Modal` (Sys Component, brand 접미 없음 — Surface 카테고리)
  - **분류**: Sys Component + Surface 카테고리 (Form Control 아님)
  - **3축 정책 미운영 결정 (MD-K01)**: Surface 카테고리 예외 — Variant=Size 1축만 운영. 정책 §7 *적용 가이드*에 Surface 예외 명문화 안건 등재 (MD-1) · *※ 본 (MD-K01) 라벨은 v1.0 시점의 명명이며, v1.1부터 §8 Known Issues의 MD-K01은 Modal Box elevation 토큰 미바인딩 이슈를 가리킴 (라벨 충돌 errata, v1.4 추가)*
  - **`_Footer` PSC 격상 결정 (MD-K02)**: 정책 §1-2 정합. Public Component (`Modal/Footer`) → Private Sub-Component (`_Footer`)로 rename + Asset 패널 비공개
  - **`_Close Button` PSC 격상 결정 (MD-K03)**: `Has Icon Button` Boolean → `_Close Button` Nested Boolean. Button-IconOnly Office/HR Instance swap으로 brand 자연 처리
  - **`sys/elevation/modal` Elevation 토큰 채택 (MD-K04)**: SSOT 원칙 준수 — 토큰값(blur 24px) 정답, 컴포넌트 raw value(blur 12px) 정정. Part 8 등재 안건(MD-2) 등재
  - **Size 매트릭스**: xs=480 / sm=640 / md=800 / lg=960 / xl=1200 (v1.0 시점 추정값 — v1.1 Figma 실측 동기화로 6단계 갱신 · 회고 톤 통일 v1.4)
  - **Backdrop은 Modal Shell 미포함**: 사용처 Page Layer에서 `sys/overlay/neutral/normal/default` 적용. 컴포넌트 책임 분리 + Stack 케이스 대응
  - **Body는 Frame slot 유지**: `_Body` PSC 격상 안 함 — 자유 콘텐츠 슬롯에 swap 외피는 오버엔지니어링
  - **Footer Layout=Centered 무효 조합 명세화**: Layout=Centered 시 Left Checkbox · Left Option Link Boolean 무효 → hidden layer 보존 + 명세 주석
  - **Modal-office/Modal-hr 분리 안 함**: Sys Component이므로 brand 토큰 미사용. 내부 Button Instance만 brand 차이 처리
  - **Variant 산식**: Modal Shell 5 (Size 단독) + `_Footer` PSC 12 (Layout × Booleans 실효) + `_Close Button` PSC 1 = 외부화로 폭증 회피
  - **신규 토큰 신설 0건** — `sys/elevation/modal`은 기존 Variables 활용 + Part 8 등재만 추가
  - **정책방 이관 안건 5건 등재** — MD-1(Surface 3축 예외) · MD-2(`sys/elevation/modal` 등재) · MD-3(`sys/border/width` 신설 검토 누적) · MD-4(Surface 카테고리 분류 신설) · MD-5(max-height 정책 위치)

---

*다음 작업 후보: `components/form-field.md` v1.0 신규 작성(본 v1.1 작업방 동시 산출) → `components/toast.md` → `components/datepicker-panel.md` · `components/rangepicker-panel.md` · `components/select-listbox.md` (Modal/Toast surface 토큰 위에 얹음)*
