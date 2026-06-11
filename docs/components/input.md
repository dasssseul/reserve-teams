# Input — TextInput

> **Hiworks Design System v3** · Sys Component · 브랜드 무관 공통
> 단일 기준 문서: `hiworks-ds-guide.md` · 정책: `component-property-policy.md` v3.4
> 최종 갱신: 2026-05-06 (v1.5 — Private Sub-Component 패턴 채택: `_Leading/_Trailing Element`, `Has Supporting Text` 어휘 통일, `Base` 접두 제거)

---

## 1. 개요

| 항목 | 값 |
|---|---|
| 컴포넌트명 | `TextInput` |
| 분류 | **Sys Component** (정책 v3.4) |
| 브랜드 | 공통 (Office · HR 동일 사용 — Service mode override 없음) |
| 참조 토큰 레이어 | `sys.*` 만 사용 |
| 구조 | Wrapper 통합형 (Label · Input Area · Supporting Text 한 컴포넌트 안) |
| 아키텍처 | Nested Instance 패턴 — `_Leading Element` · `_Input Content` · `_Trailing Element` 외부 swap 슬롯 |
| Form 분류 | Text 계열 — Section 3 정책상 "Text/Upload는 Sys, Choice/Picker는 Service" |

---

## 2. Anatomy

```
[Wrapper]
 ├─ Label                       (Has Label, optional)
 ├─ Input Area  (박스 본체)
 │   ├─ _Leading Element       (_Leading Element=true 시 노출 · Private Sub-Component swap)
 │   │   └ Type: Icon / File / Profile
 │   ├─ _Input Content         (항상 노출 · Private Sub-Component)
 │   │   └ Role: Placeholder / Text / Password / Number
 │   │   └ Size: sm / md · Alignment: Left / Right
 │   └─ _Trailing Element      (_Trailing Element=true 시 노출 · Private Sub-Component swap)
 │       └ Type: Clear / Reveal / Custom (Dropdown은 Select 전용)
 └─ Supporting Text             (Has Supporting Text, optional · 에러 시 색만 swap)
```

> **v1.4 → v1.5 구조 변경**: Left Icon · Value/Placeholder · Right Action 3개 직접 자식이 모두 **Private Sub-Component(Nested Instance)로 격상**됨. Single Source of Truth가 외부 sub-component로 이동 → Variant 폭증 회피 + AI swap 인지 ↑.

---

## 3. Property 구조

### 3-1. Variants

> **3축 분리 정책 적용 (2026-04-30)** + **v3.4 정책 환원 일관 (2026-05-06)** — 단독 정책 문서 `component-property-policy.md` 참조.
> 기존 `State` Property를 `Availability` + `Interaction` + `Validation` 3축으로 분리. 토큰 매핑(§4)은 변경 없음.
> v3.4에서 Pressed enum 운영 환원이 표준화 — TextInput은 v1.4부터 이미 Pressed 명세 보유, 정책과 정합.

| Property | Values | 개수 |
|---|---|---|
| **Size** | sm / md / lg | 3 |
| **Availability** | Enabled / Disabled / **ReadOnly** | 3 |
| **Interaction** | Rest / Hover / **Pressed** | 3 (Pressed = focus·타이핑 중) |
| **Validation** | None / Error / **Success** / Warning | 4 (Warning은 슬롯 예약) |
| **Alignment** | Left / Right | 2 |

> **명명 매핑 (이전 → 신규)**:
> - `State=Default` → `Availability=Enabled` + `Interaction=Rest` + `Validation=None`
> - `State=Hover` → `Interaction=Hover`
> - `State=Active / Focused` → `Interaction=Pressed` (타이핑 진입 상태 — stroke 강조)
> - `State=Error` → `Validation=Error`
> - `State=Disabled` → `Availability=Disabled`
> - `State=ReadOnly` → `Availability=ReadOnly` (HTML `readonly` attribute 1:1 매핑 유지)
> - **`FocusVisible`은 Variant matrix 제외** — 별도 `🎯 Focus Ring 가이드` frame 운영 정책 유지
> - **`Pressed` (Interaction 3번째 enum)**: Focus ring과 병행 발생 — stroke 강조(`strong/default`)가 Pressed의 시각 표현
>
> **Validation 슬롯**: 현재 빌드에 `None` / `Error` / `Success` 포함. `Warning`은 슬롯 예약 (토큰 `sys.warning.*` 기존재, 사용 케이스 발생 시 추가).

### 3-2. Booleans

| 종류 | Property | 의미 | 분기 규칙 |
|---|---|---|---|
| 단순 토글 | `Has Label` | 상단 Label 노출 여부 | `Has + Noun` (swap 불가) |
| 단순 토글 | `Has Supporting Text` | 하단 Supporting Text 노출 여부 | `Has + Noun` (swap 불가) |
| Nested 토글 | `_Leading Element` | 좌측 sub-component 노출 여부 + swap | `_` 접두 (swap 가능) |
| Nested 토글 | `_Trailing Element` | 우측 sub-component 노출 여부 + swap | `_` 접두 (swap 가능) |

> **v1.4 → v1.5 변경**:
> - `Has Left Icon` → `_Leading Element` (격상 — swap 가능 외피로)
> - `Has Right Action` → `_Trailing Element` (격상 + 명명 일관)
> - `Has Assistive Text` → `Has Supporting Text` (Material 3 어휘)

### 3-3. Private Sub-Components (Nested Instance)

| Sub-Component | Properties | 값 | 비고 |
|---|---|---|---|
| `_Leading Element` | `Type` | `Icon / File / Profile` | swap 가능. Checkbox·Toggle과 공유 가능 |
| `_Input Content` | `Role` | `Placeholder / Text / Password / Number` | 입력 모드 (HTML input type 계열) |
| | `Size` | `sm / md` | 부모 TextInput Size와 연동 |
| | `Alignment` | `Left / Right` | 텍스트 정렬 |
| `_Trailing Element` | `Type` | `Clear / Reveal / Custom` | swap 가능. **`Dropdown`은 Select 전용** — TextInput에서는 미사용. Select와 공유 컴포넌트 |

> **v1.4 → v1.5 변경**:
> - `Right Action` Instance Property 폐기 → `_Trailing Element` Nested Instance로 이전
> - `Chevron` 값 → `Dropdown` rename 후 Select 전용 분리
> - 기존 직접 자식이었던 `Left Icon`·`Value/Placeholder`·`Right Action` 3개가 모두 Private Sub-Component 외피로 격상

### 3-4. Text Properties

- `Label` — 상단 라벨 텍스트
- `TextValue` (`_Input Content` 내부) — 입력값
- `Placeholder` (`_Input Content.Role=Placeholder`에서 표시) — 안내 문구
- `SupportingText` — 안내 또는 에러 메시지

### 3-5. 총 Variant 수

> **외피(TextInput) 산식**: `3 Size × 3 Availability × 3 Interaction × 3 Validation(None/Error/Success) × 2 Alignment` = **162 variants** (이론치)
>
> **실효 variant 수**: Disabled·ReadOnly에서는 Interaction=Hover/Pressed·Validation=Error/Success 무의미 → 무효 조합 생략 시 실효 ~54. Figma combineAsVariants 시 자동 처리.
> Warning은 슬롯 예약만 — 현재 빌드 미포함.
>
> **Private Sub-Component Variant (외부 분리)**:
> - `_Leading Element`: `3 Type` (Icon/File/Profile)
> - `_Input Content`: `4 Role × 2 Size × 2 Alignment` = **16 variants**
> - `_Trailing Element`: `3 Type` (Clear/Reveal/Custom — TextInput에서 사용분만, Dropdown 제외)
>
> Nested Instance로 외부화되어 부모 TextInput Variant 수에는 영향 없음. **AI swap 인지 + 폭증 회피** 동시 달성.

---

## 4. 토큰 매핑표

### 4-1. 모든 사이즈·상태 공통

| 항목 | 토큰 |
|---|---|
| Box cornerRadius (4 corners) | `sys/radius/sm` (4) |
| Box strokeWeight | raw 1px (Pending — `sys/border/width` 신설 검토 중) |
| Box strokeAlign | INSIDE |
| Label fill | `sys/text/neutral/normal/default` (Disabled만 변경) |
| Label textStyle | `sys/typo/label/md/regular` (모든 사이즈 동일) |
| Supporting Text textStyle | `sys/typo/caption/md/regular` (모든 사이즈 동일) |

### 4-2. State별 차이값 (Default 기준 변경분만)

> **Label fill 원칙**: **Disabled를 제외한 모든 상태에서 `sys/text/neutral/normal/default` 고정**. Hover / Pressed / Error / Success 에서도 Label 색은 변하지 않는다 (유효성 검사 2026-05-04 확인).

#### Rest / Default (기준)
| 위치 | 토큰 | 팔레트 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | gray.20 (#333333) |
| Box fill | `sys/bg/neutral/faint/default` | white (#ffffff) |
| Box stroke | `sys/stroke/neutral/subtle/default` | gray.90 (#d6d6d6) |
| _Leading Element fill | `sys/icon/neutral/normal/default` | gray.20 (Icon / File / Profile 공통 default) |
| _Input Content fill (Role=Text/Password/Number) | `sys/text/neutral/normal/default` | gray.20 |
| _Input Content fill (Role=Placeholder) | `sys/text/neutral/muted/default` | gray.50 (#909090) |
| _Trailing Element vector fill | `sys/icon/neutral/normal/default` | gray.20 (Clear / Reveal / Custom 공통) |
| Supporting Text fill | `sys/text/neutral/subtle/default` | gray.40 (#676767) |

#### Hover
| 위치 | 토큰 | 비고 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | 변경 없음 |
| Box stroke | `sys/stroke/neutral/subtle/active` | gray.70 (#aeaeae) |

#### Pressed _(= Focus 진입 · 타이핑 중)_
| 위치 | 토큰 | 비고 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | 변경 없음 ✅ |
| Box stroke | `sys/stroke/neutral/strong/default` | gray.40 (#676767) |

> Pressed = 사용자가 클릭·탭으로 포커스를 잡고 타이핑 중인 상태. stroke 강조(`strong/default`)가 유일한 시각 차이. Focus Ring은 Pressed 위에 오버레이(§4-3).

#### Error
| 위치 | 토큰 | 비고 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | 변경 없음 ✅ |
| Box stroke | `sys/stroke/alert/normal/default` | red.50 (#d84a49) |
| Supporting Text fill | `sys/text/alert/normal/default` | red.40 (#c54342) |

#### Success _(신규 — 2026-05-04 Figma 빌드 추가)_
| 위치 | 토큰 | 비고 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | 변경 없음 ✅ |
| Box stroke | `sys/stroke/neutral/subtle/default` | **stroke 변경 없음** — `sys/stroke/positive` 미사용 |
| Supporting Text fill | `sys/text/positive/normal/default` | green.40 (#45a243) |

> Success는 Supporting Text 색만 바뀐다. Box stroke가 변하지 않는 이유: 유효성 "통과" 메시지는 조용한 피드백으로 충분 — 강한 테두리 변화는 오히려 혼란을 줄 수 있음. 토큰 레이어에 `sys/stroke/positive` 존재하지만 Input에서는 의도적으로 미사용.

#### Disabled
| 위치 | 토큰 | 팔레트 |
|---|---|---|
| **Label fill** | **`sys/text/neutral/normal/disabled`** | gray.70 (#aeaeae) — **유일하게 변경** |
| Box fill | `sys/bg/neutral/subtle/disabled` | gray.100 (#f7f7f7) |
| Box stroke | `sys/stroke/neutral/subtle/default` | 변경 없음 |
| _Leading Element fill | `sys/icon/neutral/normal/disabled` | gray.70 |
| _Input Content fill | `sys/text/neutral/faint/default` | gray.70 |
| _Trailing Element vector fill | `sys/icon/neutral/normal/disabled` | gray.70 |
| Supporting Text fill | `sys/text/neutral/subtle/disabled` | gray.80 (#c4c4c4) |

#### ReadOnly
| 위치 | 토큰 | 비고 |
|---|---|---|
| Label fill | `sys/text/neutral/normal/default` | 정상 색 유지 |
| Box fill | `sys/bg/neutral/subtle/disabled` | gray.100 — Disabled와 동일 배경 |
| Box stroke | `sys/stroke/neutral/subtle/default` | 변경 없음 |
| _Leading Element fill | `sys/icon/neutral/normal/default` | 정상 색 |
| **_Input Content fill** | **`sys/text/neutral/normal/default`** | gray.20 — 또렷하게 읽힘 |
| _Trailing Element vector fill | `sys/icon/neutral/normal/default` | 정상 색 |
| Supporting Text fill | `sys/text/neutral/subtle/default` | 정상 색 |

> **ReadOnly vs Disabled 핵심 차이**: bg는 동일(회색 배경)이지만 텍스트·아이콘 색이 다름. ReadOnly는 "값을 보여주는" 상태라 normal 토큰 유지. Label도 normal/default — Disabled와 달리 disabled 토큰 불사용.

---

### 4-3. Focus Ring (별도 가이드 frame)

Focus 상태는 **Component variant에서 제외** — 별도 `🎯 Focus Ring 가이드` frame으로 분리. Button과 동일한 운영 정책.

| 항목 | 값 |
|---|---|
| Ring 위치 | Box 외곽 (outside) |
| Ring width | 2px |
| Ring spread | 2px |
| Ring 색 | 브라우저 default focus blue (시스템 의존) |
| **활성 조건** | 키보드 탐색 시에만 표시 (`:focus-visible`) — 마우스 클릭에는 비표시 |
| 토큰화 | 보류 — `hiworks-ds-guide.md` Part 8 "대기열(Pending Tokenization)" 등재 (Button과 공통) |

> **왜 별도 frame인가?**
> Focus는 컴포넌트 고유 시각이 아니라 **시스템 레벨 시각 피드백**(키보드 탐색 등). 모든 interactive element에 동일하게 적용되므로 Input·Button·Checkbox 등 컴포넌트마다 개별 정의하지 않고 한 곳에서 가이드.

> **Pressed(=구 Active) vs FocusVisible 차이**: Pressed는 마우스 클릭으로 "들어와서 타이핑 중"(stroke 변화 / `:focus`로 활성화되지 않음 — 입력 진입 시각), FocusVisible은 키보드 Tab 탐색 시각 표시(ring 오버레이 / `:focus-visible`). **마우스 클릭으로 진입한 입력 상태에서는 Pressed만 보이고 ring은 표시되지 않음**. 키보드 진입 시 Pressed + FocusVisible 중첩 가능.

---

## 5. Size · Dimension 매핑

| 항목 | **sm** | **md** ← 기본 | **lg** |
|---|---|---|---|
| Box height | 26 | 34 | 40 |
| Wrapper itemSpacing | `sys/spacing/xs` (8) | `sys/spacing/sm` (10) | `sys/spacing/md` (12) |
| Box paddingL/R | `sys/spacing/xs` (8) | `sys/spacing/sm` (10) | `sys/spacing/md` (12) |
| Box itemSpacing (icon↔text) | `sys/spacing/2xs` (6) | `sys/spacing/xs` (8) | `sys/spacing/sm` (10) |
| _Input Content 텍스트 | `sys/typo/body/sm/regular` (13/lh20) | `sys/typo/body/md/regular` (14/lh21) | `sys/typo/body/md/regular` (14/lh21) |
| _Leading Element 크기 | 14 × 14 | 16 × 16 | 16 × 16 |
| _Trailing Element 크기 | 14 × 14 | 16 × 16 | 16 × 16 |

> **lg = "여유 있는 md"**: `_Input Content` 텍스트·`_Leading/_Trailing Element` 사이즈는 md와 동일. 박스 크기·패딩만 커짐. 로그인·검색바 같은 편안한 타이핑용.

---

## 6. Alignment

- `Left` — `_Input Content` 텍스트 좌측 정렬 (기본)
- `Right` — `_Input Content` 텍스트 우측 정렬 (숫자·금액 입력 등)

토큰 차이 없음 — `_Input Content.Alignment` Variant Property로 구분 (Nested Instance 내부 처리).

---

## 7. 정책방 이관 안건

| # | 안건 | 상태 |
|---|---|---|
| 1 | `sys.stroke.neutral` 시맨틱 재정의 — `subtle`을 "기본 보더 통합", `normal`을 "강조 보더 보존"으로 description 정정 (값 변경 없음) | ✅ 토큰 description 반영 — `hiworks-ds-guide.md` Part 8 등재 (2026-04-28) |
| 2 | `sys.text.neutral.muted.disabled` 토큰 신규 정의 검토 | 대기 — 현재 Disabled placeholder는 `faint/default`(gray.70) 우회 사용 |
| 3 | `sys.border.width` (Pending Tokenization) | 대기 — Input·Outline 버튼·Card·Divider 등 다중 컴포넌트에서 width 차등 요구 시 신설 |
| 4 | Form 컨트롤 분류 모델 확정 — Text/Upload는 Sys, Choice/Picker는 Service (또는 하이브리드) | 대기 — 추후 Choice 작업방 시작 시 결정 |
| 5 | Hover · Active 통합 정책 적용 — Input의 경우 Active 상태 자체가 부적합해 Hover만 별도 운영 | ✅ 해소 (2026-04-30) — C안 채택으로 Hover/Pressed 토큰 공유 + Variant 명명 분리. `hiworks-ds-guide.md` Part 8 등재 |
| 6 | State 명칭 통일 — `Focused` → `Active` rename + Focus를 별도 가이드 frame으로 분리 | ✅ 해소 (2026-04-30) — `Active` → `Pressed`로 추가 명확화, `FocusVisible`은 Variant matrix 외 Frame 운영 정책 일관 적용. `component-property-policy.md` 등재 |

---

## 8. 알려진 이슈 (Known Issues)

| ID | 위치 | 이슈 | 조치 |
|---|---|---|---|
| INP-01 | Disabled variants × 2 위치 (_Leading Element · _Trailing Element vector) | Figma Variable 이름 오타 — `sys/icon/neutral/normal/disabeld` (정상: `disabled`) | Figma Variables 패널에서 rename 시 모든 바인딩 자동 갱신됨 |
| INP-02 | sm Default · Alignment=Left | _Trailing Element 16×16 (다른 sm variant는 14×14) | Figma에서 14×14로 통일 |
| INP-03 | Warning Validation | Warning variant 미빌드 — 슬롯 예약 상태 | 사용 케이스 발생 시 `sys/text/warning/normal/default` + `sys/stroke/warning/normal/default` 으로 추가 |

---

## 9. 접근성 노트

| 조합 | 대비비 | WCAG | 비고 |
|---|---|---|---|
| Label gray.20 on white | ~12.6:1 | AAA ✅ | |
| _Input Content 텍스트 gray.20 on white (ReadOnly Value) | ~12.6:1 | AAA ✅ | |
| Placeholder gray.50 on white (Default muted) | ~3.5:1 | AA Large ✅ / AA Normal ⚠️ 경계 | placeholder는 hint 영역, AA 면제 |
| Disabled placeholder gray.70 on gray.100 | ~2.4:1 | 미달 | Disabled는 비활성, AA 면제 |
| Box stroke gray.90 on white | UI ~1.4:1 | UI 3:1 미달 ⚠️ | 아래 §A11Y 참조 |
| Focused stroke gray.40 on white | UI ~5.7:1 | UI 3:1 ✅ | |
| Error stroke red.50 on white | UI ~3.4:1 | UI 3:1 ✅ | |

> **§A11Y — Box stroke 대비 부족**: Default 상태 stroke가 너무 연해 박스 식별이 어려울 수 있음. 사용 컨텍스트(Form 내 다른 시각 단서 — Label·간격 등)로 보완되는지 검증 필요. 미흡 시 `accessibility-watchlist.md`에 등록.

---

## 10. 모바일 영향 체크 (officeApp · messenger)

| Sys 토큰 | 데스크탑 (현재) | 모바일 오버라이드 (보류) | 영향 |
|---|---|---|---|
| `sys/typo/body/sm/regular` (sm Input) | 13px | 14px (예상) | sm Input 텍스트 +1px |
| `sys/typo/body/md/regular` (md, lg Input) | 14px | 16px (예상) | md/lg Input 텍스트 +2px |
| `sys/typo/caption/md/regular` (Supporting Text) | 12px | 13px (예상) | Supporting Text +1px |

> 모바일 시안 확정 시 Service 레이어에서 오버라이드 검증 필요. Box height도 +4~6 정도 키우는 게 자연스러움 (터치 타겟).

---

## 11. 작업 이력

- 2026-04-29 v1 — 초기 빌드 + 토큰 검증 완료 (Cowork 세션)
  - Anatomy 5요소 확정 (Label · Box · Assistive · Left Icon · Right Action)
  - State 6종 확정 (Default · Hover · Focused · Error · Disabled · ReadOnly)
  - Size 3종 확정 (sm 26 / md 34 / lg 40)
  - Right Action 인스턴스 패턴 적용 (Clear · Reveal · Chevron 스왑 가능)
  - **36 variants 토큰 바인딩 완료** (md → sm → lg 순)
  - Sys Component 분류 확정 — 브랜드 무관, Service mode override 없음
  - 토큰 시맨틱 재정의 — `subtle` stroke이 기본 보더 통합 슬롯 (정책방 등재 완료)
  - **Pending**: INP-01 오타 수정, INP-02 sm 우측 아이콘 사이즈 정정
- 2026-04-29 v1.1 — State 명칭 통일 (Button 정책 반영)
  - `Focused` state → `Active`로 rename (의미: "engaged interaction" 시맨틱으로 통합)
  - Focus는 별도 `🎯 Focus Ring 가이드` frame으로 분리 (variant 매트릭스에서 제외)
  - Hover는 분리 유지 (Input 고유 결정 — Button과 다른 인터랙션 흐름)
  - Variant 수 동일 36개 (naming만 변경, 토큰 바인딩 영향 없음)
  - **Pending**: Figma Component Set의 State property "Focused" → "Active" rename, Focus Ring 가이드 frame 신규 생성
- 2026-04-30 v1.2 — **Property 3축 분리 정책 반영 (스펙만 갱신, 빌드 재구성 후속)**
  - `State` Property 폐기 → **`Availability` + `Interaction` + `Validation`** 3축 분리 (`component-property-policy.md` 신규 정책 적용)
  - 명명 매핑: `Default` → `Enabled+Rest+None` / `Hover` → `Interaction=Hover` / `Active` → `Interaction=Pressed` (의미 명확화) / `Error` → `Validation=Error` / `Disabled` → `Availability=Disabled` / `ReadOnly` → `Availability=ReadOnly`
  - **Validation 4단계 슬롯 예약**: 현재 빌드는 `None`/`Error`만 노출, `Warning`/`Success`는 사용 케이스 등장 시 점진 추가
  - 토큰 매핑(§4) 변경 없음 — Hover/Pressed는 모두 기존 `*.active` 토큰 공유 (C안)
  - **본 v1.2는 스펙 문서 갱신만** — Figma Component Set 빌드 재구성은 후속 작업
  - 정책방 안건 #5, #6 ✅ 해소 처리
- 2026-05-04 v1.3 — **(롤백됨 → v1.4로 대체)**
  - 길 2(Pressed enum 제거) 정책 검토 — 실제 Figma 빌드에 Pressed 유지 확인 후 v1.4에서 Pressed 복원
- 2026-05-06 v1.5 — **Private Sub-Component 패턴 채택 (정책 v3.4 동기화)**
  - 컴포넌트명: `Base TextInput` → `TextInput` (Base 접두 제거)
  - **Anatomy 격상**: `Left Icon` · `Value/Placeholder` · `Right Action` 직접 자식 → 모두 Private Sub-Component(Nested Instance) 외피로 격상
    - `Left Icon` → `_Leading Element` (Type: Icon/File/Profile)
    - `Value/Placeholder` → `_Input Content` (Role: Placeholder/Text/Password/Number, Size: sm/md, Alignment: Left/Right)
    - `Right Action` → `_Trailing Element` (Type: Clear/Reveal/Custom — Dropdown은 Select 전용)
  - **Boolean Property 분기 규칙 적용**:
    - 단순 토글 (`Has Label`, `Has Supporting Text`) — `Has + Noun` 유지
    - Nested 토글 (`_Leading Element`, `_Trailing Element`) — Nested Instance명 그대로
  - **어휘 통일**: `Assistive Text` → `Supporting Text` (Material 3 표준)
  - **Chevron 분리**: `Right Action.Chevron` 값 → `_Trailing Element.Dropdown`으로 rename + Select 전용 분리
  - **토큰 매핑 명명 동기화**: §4-2 모든 표의 `Left Icon`·`Right Action`·`Assistive` 표기 → `_Leading Element`·`_Trailing Element`·`Supporting Text`로 일괄 갱신
  - **Variant 산식 영향**: 외피 162 (변경 없음). Private Sub-Component는 Nested로 외부화되어 폭증 회피.
  - 토큰 신설 0건. 정책 `component-property-policy.md` v3.4 등재 완료.
- 2026-05-04 v1.4 — **Figma 유효성 검사 반영**
  - 검사 대상: Figma inspector JSON (Base TextInput Component Set 전체)
  - **[변경 1] 프로퍼티 축 확정**: `Size × Availability × Interaction × Validation × Alignment` 5축 ✅ (Figma 빌드 일치)
  - **[변경 2] Pressed 복원**: Interaction = `Rest / Hover / Pressed` 3종 확정 (Figma 빌드 일치)
    - Pressed = Focus 진입 + 타이핑 중 상태. Box stroke `sys/stroke/neutral/strong/default` 바인딩
    - v1.3 "길 2" 결정 재검토 후 Figma 실물 기준으로 3축 채택
  - **[변경 3] Success Validation 추가**: Validation = `None / Error / Success` 빌드 확정 (Warning은 슬롯 예약)
    - Success: Box stroke 변경 없음, Assistive fill → `sys/text/positive/normal/default` (green.40)
  - **[변경 4] Label 컬러 명시**: "Disabled를 제외한 전 상태에서 `sys/text/neutral/normal/default` 고정" 원칙 §4-2 상단에 명시
    - Hover / Pressed / Error / Success 각 섹션에 Label fill 명시 (유효성 검사 확인)
  - **토큰 존재 전수 검사**: 21개 사용 토큰 전항목 sys-tokens.json 존재 ✅
  - Known Issues INP-03 추가 (Warning 미빌드)
  - "Active" 용어 폐기 완료 — `Pressed`로 통일

---

*다음 작업 후보: Choice 계열(Checkbox · Radio · Select) 작업방 — Service Component 분류로 진행 예정*
