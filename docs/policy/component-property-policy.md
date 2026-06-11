# Component Property Policy — 3축 분리 정책

> **Hiworks Design System v3** · 컴포넌트 Property 명명·구조 단독 정책 문서
> 단일 기준 문서 보조: `hiworks-ds-guide.md` Part 8 *컴포넌트 운영 원칙*과 상호 참조
> 최초 작성: 2026-04-30 · 최종 갱신: 2026-05-06 (v3.5 — Locked vs ReadOnly 분리 정책 폐기, ReadOnly로 전면 통일)
> 적용 범위: Button, TextInput, Checkbox, Toggle, Radio, Select 외 향후 모든 인터랙티브 컴포넌트

---

## 목차

- [Part 0. 문서 목적](#part-0-문서-목적)
- [Part 1. 핵심 원칙](#part-1-핵심-원칙)
- [Part 2. 공통 3축 Property 정의](#part-2-공통-3축-property-정의)
- [Part 3. 컴포넌트별 특이 Property](#part-3-컴포넌트별-특이-property)
- [Part 4. 명명 규칙 (금지/추천 용어)](#part-4-명명-규칙-금지추천-용어)
- [Part 5. 토큰 매핑 원칙 — C안 (토큰 통합·변형 분리)](#part-5-토큰-매핑-원칙--c안-토큰-통합변형-분리)
- [Part 6. Availability=ReadOnly 통일 정책 (v3.5)](#part-6-availabilityreadonly-통일-정책-v35)
- [Part 7. 적용 가이드 — 컴포넌트 작업 시 체크리스트](#part-7-적용-가이드--컴포넌트-작업-시-체크리스트)
- [Part 8. 변경 이력](#part-8-변경-이력)

---

## Part 0. 문서 목적

### 0-1. 왜 별도 문서인가?

`hiworks-ds-guide.md`는 **토큰 시스템**의 단일 기준 문서다. 본 문서는 그 위 레이어인 **컴포넌트 Property 구조**를 다룬다. 토큰이 "값의 어휘(vocabulary)"라면, Property는 "값을 어떻게 조합·노출하는가의 문법(grammar)"이다. 양쪽이 분리되어야 각각의 변경이 독립적으로 추적된다.

### 0-2. 해결하려는 문제

현행 컴포넌트 정의는 `State` 단일 Property에 의미가 다른 차원이 혼합되어 있다.

| 현행 State 예시 | 실제 섞인 차원 |
|---|---|
| TextInput.State = `Default / Hover / Active / Error / Disabled / ReadOnly` | 인터랙션 + 검증 + 사용 가능 여부 (3차원 혼재) |
| Checkbox.State = `Default / Hover / Active / Error / Disabled / Locked` | 동일 패턴 |

이로 인해 발생한 문제:

1. **의미 충돌**: 같은 `Active`가 컴포넌트마다 다른 의미 (Button=Pressed, TextInput=Focused)
2. **조합 불가능 표현**: "Error 상태인 Input에 Hover" 같은 정상 상태를 단일 enum이 표현 못 함
3. **AI 가독성 저하**: 기계가 컴포넌트 컨텍스트 없이 Property 값만으로 의미 추론 불가
4. **Variant 폭증**: 차원이 합쳐지면 곱셈으로 늘어남

### 0-3. 적용 범위

이 정책은 **Figma Component Variant Property 명명·구조**에 적용된다. 토큰 명명 규칙(`hiworks-ds-guide.md` Part 2-1)은 변경하지 않는다. 토큰은 그대로 두고 **Property 차원에서만 의미를 분리**한다.

---

## Part 1. 핵심 원칙

### 1-1. 3축 분리 원칙

`State` 단일 Property를 **3개의 독립 Property**로 분리한다.

```
┌─────────────────────────────────────────────────────────────┐
│  Availability  │  사용 가능 여부 (구조적 상태)                  │
│                │  Enabled / Disabled / ReadOnly                          │
├─────────────────────────────────────────────────────────────┤
│  Interaction   │  일시적 상호작용 상태                          │
│                │  Rest / Hover                                  │
│                │  (FocusVisible은 별도 Frame, Pressed는 보류)   │
├─────────────────────────────────────────────────────────────┤
│  Validation    │  검증·피드백 결과                              │
│                │  None / Error / Warning / Success              │
└─────────────────────────────────────────────────────────────┘
```

이 3개 축은 **서로 직교(orthogonal)** 한다. 동시에 존재할 수 있다.
예: `Availability=Enabled` + `Interaction=Hover` + `Validation=Error` 동시 발현 가능.

### 1-2. State / Feature / Content 구분 원칙

Property는 의미 차원에 따라 다음 3개 카테고리로만 존재한다.

| 카테고리 | 정의 | 예시 |
|---|---|---|
| **State** | 컴포넌트의 동적 상태 | Availability, Interaction, Validation, Selection |
| **Visual** | 외형 변형 | Role, Style, Size, Alignment |
| **Feature/Content** | 구조·기능 옵션 (Boolean / Text) | Has Label, Has Tooltip, Has Supporting Text, Label, TextValue |
| **Private Sub-Component** | Nested Instance 전용 외피 컴포넌트 | _Input Content, _Select Content, _Leading Element, _Trailing Element |

→ "기능 유무"는 State가 아니라 Feature다. `Dropdown` 같은 항목은 Boolean Property로 분리한다.

### 1-3. Variant vs Boolean Property 운영 원칙

조합 폭증을 막기 위해 외형 차이의 크기에 따라 노출 방식을 분리한다.

| 노출 방식 | 적용 기준 | 예시 |
|---|---|---|
| **Variant Property** | 토큰·외형이 변하고 조합 검토 필요 | Role, Style, Size, Availability, Interaction, Validation, Selection |
| **Boolean Property** | 요소의 노출/미노출 차이만 있음 | HasLeadingIcon, HasDropdown, HasLabel |
| **Text Property** | 문자열 입력 | Label, TextValue, AssistiveText |
| **Instance Swap** | 하위 컴포넌트 교체 | Right Action (Clear/Reveal/Chevron) |

### 1-4. 1:1 정합성 원칙 (운영용/문서용 분리하지 않음)

운영용 Published Component와 문서용 Component를 **분리하지 않는다**. 모든 Variant를 단일 Component Set에 포함한다.

근거:
- 프로젝트 원칙 *"Figma 디자인 파일과 앱 구현체 간 1:1 매칭"*과의 일관성
- 라이브러리 2벌 운용 시 발생하는 검수·동기화 비용
- AI가 컴포넌트를 해석할 때 단일 진실 소스(SSOT) 보장

→ Variant 폭증은 **Boolean Property 적극 활용**으로 완화한다.

---

## Part 2. 공통 3축 Property 정의

### 2-1. Availability — 사용 가능 여부

```
값: Enabled / Disabled / ReadOnly  (v3.5: Locked 폐기, ReadOnly로 통일)
타입: Variant Property
의미: 사용자가 컴포넌트를 조작할 수 있는가?
지속성: 구조적·정책적 상태 (인터랙션과 무관하게 유지)
```

| 값 | 정의 | 적용 컴포넌트 |
|---|---|---|
| `Enabled` | 정상 조작 가능 | 모든 인터랙티브 컴포넌트 |
| `Disabled` | 일반 비활성 — 클릭/입력/포커스 모두 불가 | 모든 인터랙티브 컴포넌트 |
| `ReadOnly` | 값 변경 불가, 포커스·복사 등 일부 인터랙션 허용. **HTML `readonly` attribute 1:1 매핑** | TextInput |
| ~~`Locked`~~ | **v3.5에서 폐기** — ReadOnly로 통일. 자물쇠 시각 메타포는 anatomy 표현으로 자유 운영 (Part 6) | (역사) Checkbox·Radio 등 Choice 계열 |

> **v3.5(2026-05-06)부터 ReadOnly로 통일.** 분리 정책은 폐기 — Part 6 통일 정책 참조.

### 2-2. Interaction — 일시적 상호작용 상태

```
값: Rest / Hover     ← 운영 enum (Pressed 제외)
타입: Variant Property
의미: 현재 사용자 입력에 반응 중인가?
지속성: 일시적 (입력이 끝나면 Rest로 복귀)
```

| 값 | 정의 | 발생 조건 | 운영 여부 |
|---|---|---|---|
| `Rest` | 어떤 인터랙션도 없는 기본 상태 | 디폴트 | ✅ 운영 |
| `Hover` | 마우스 포인터가 위에 올라간 상태 | 데스크탑·마우스 환경 | ✅ 운영 |
| `Pressed` | 사용자가 누르는 순간 또는 Focus 진입·타이핑 중 시각 차등 상태 | 클릭·탭·포커스 진입·타이핑 중 | ✅ **운영 (v3.4 환원, 2026-05-06)** |
| `FocusVisible` | 키보드 포커스가 시각적으로 노출된 상태 | Tab 키 등 키보드 탐색 (`:focus-visible`) | ❌ Variant matrix 제외 — 별도 `🎯 Focus Ring 가이드` Frame 운영 |

> **명명 근거**: `FocusVisible`은 W3C ARIA 표준 용어로 AI·개발자 즉시 인식 가능. AI 가독성 원칙(`hiworks-ds-guide.md` Part 1-3) 우선.

#### 2-2-1. Pressed 운영 가이드 (v3.4 환원)

> **변경 사유 (2026-05-06)**: 길 2 정책(2026-05-04)이 *시각·토큰 100% 동일*을 전제했으나, 실제 Figma 빌드(Checkbox·Toggle·TextInput)에서 Pressed가 stroke·fill 차등 슬롯으로 활용되고 있어 **운영 enum으로 환원**.
>
> Pressed는 모든 인터랙티브 컴포넌트의 표준 운영 enum이며, 시각 처리는 컴포넌트별 매핑표(`components/*.md`)에 명시한다.
>
> **예외 — 클릭 즉시 영구 상태 전환 컴포넌트** (2026-05-13 추가): 클릭이 즉시 영구 상태(Selected=True, 페이지 전환 등)로 이어져 Pressed 순간 시각 차등이 의미 없는 경우, 컴포넌트별 정책으로 Pressed 슬롯 제외 가능. 컴포넌트별 정책 문서에 사유 명문화 필수.

| 운영 시점 | 처리 방식 |
|---|---|
| **시각 차등 있음** | 별도 토큰으로 stroke/fill 차등 (예: TextInput Pressed = `sys/stroke/neutral/strong/default`) |
| **시각 차등 없음** | Hover와 동일 토큰(`*.active`) 공유 가능 — 단, Variant 슬롯은 유지하여 향후 차등 시 비파괴적 적용 |
| **Pressed 제외 (LNB 패턴)** | 클릭 즉시 Selected/페이지 전환 트리거 컴포넌트. Pressed Variant 슬롯 생성 안 함. 컴포넌트별 정책 문서에 사유 명문화 필수 (예: `components/lnb.md`) |
| **토큰 분리 결정** | `sys.*.pressed` 같은 신규 토큰 신설 시 매핑 갱신. 정책방 합의 후 진행 |

> **참고**: `FocusVisible`은 본 enum과 별도 — Variant matrix에서 제외하고 별도 `🎯 Focus Ring 가이드` Frame 운영 (변경 없음).

> **활성 조건 (CSS 매핑)**: `:focus-visible`만 사용 (마우스 클릭에서는 ring 비표시). `:focus`는 사용 금지 — 마우스·키보드 모두 트리거되어 노이즈 발생. W3C ARIA `FocusVisible` 명명과 1:1 정합.

#### 2-2-2. Pressed 환원 영향도 (v3.4)

```
영향 받은 컴포넌트:
- Checkbox: Pressed Variant 운영 ✅ (실물 Figma 빌드 확인)
- Toggle: Pressed Variant 운영 유지 (기존 Input 계열 예외 → 표준화)
- TextInput: Pressed = Focus 진입·타이핑 중 (stroke 강조)
- Button: Pressed enum 추가 가능 (시각 차등 결정 시점)
- Radio (신규): Checkbox 패턴 따라 Pressed 운영
- LNB Nav Item: **Pressed Variant 제외** — 클릭 즉시 Selected=True 진입, 페이지 전환 트리거 (2026-05-13)
- LNB Action Button: **Pressed Variant 제외** — LNB Nav Item과 동일 패턴 (클릭 즉시 모달/페이지 전환 트리거). Style=List 단일 운영, Selected 미운영 (2026-05-13)

토큰 영향:
- 기본 Pressed 토큰 = `sys.*.{role}.{emphasis}.active` 공유 가능
- 컴포넌트별 차등 토큰 = 매핑표에 명시 (TextInput stroke 강조 등)
- 신설 토큰 = 0건 (기존 자산 활용)
```

> **비파괴성 보장**: Pressed enum 환원 시 기존 Hover Variant들은 그대로 유지. Pressed Variant는 컴포넌트별로 점진 추가됨.

### 2-3. Validation — 검증·피드백 결과

```
값: None / Error / Warning / Success
타입: Variant Property
의미: 현재 입력값·선택값의 검증 결과는?
지속성: 폼 검증 결과로 부여 (서버 응답 등)
```

| 값 | 정의 | 사용 토큰 Role |
|---|---|---|
| `None` | 검증 결과 없음 (기본) | `sys.*.neutral.*` |
| `Error` | 오류 — 사용자 입력 거절 | `sys.*.alert.*` |
| `Warning` | 경고 — 진행 가능하나 주의 | `sys.*.warning.*` |
| `Success` | 성공 — 검증 통과 명시 | `sys.*.positive.*` |

> 4값 모두 기존 토큰(`alert`, `warning`, `positive` role)으로 표현 가능. **토큰 신설 0건.**
> 컴포넌트 빌드 시점에 모든 4값을 Variant로 노출할 필요는 없다 — 사용 케이스 발생 시 점진 추가 가능. 단, 명명 슬롯은 본 정책에서 미리 예약한다.

### 2-4. 3축 동시 발현 매트릭스

```
Availability  ┐
              ├─→ 직교 결합 (모두 동시 가능)
Interaction   ┤
              │
Validation    ┘

예시 — TextInput 동시 상태:
  Availability=Enabled · Interaction=Hover · Validation=Error
  → 시각: 빨간 stroke (Validation 우선) + Hover 색조 미세 강화
```

→ 동시 발현 시 시각 우선순위는 컴포넌트 매핑표(`components/*.md`)에서 명시한다.

---

## Part 3. 컴포넌트별 특이 Property

### 3-1. Button

| 카테고리 | Property | 값 |
|---|---|---|
| **Visual** | Role | Brand / Neutral / Destructive / Critical |
| | Style | Solid / Outline / Ghost / Text |
| | Size | xs / sm / md / lg |
| **State** | Availability | Enabled / Disabled |
| | Interaction | Rest / Hover (Pressed 보류 — Part 2-2-1) |
| **Feature** | HasLeadingIcon | True / False |
| | HasTrailingIcon | True / False |
| | HasDropdown | True / False |
| | IconOnly | True / False |
| **Content** | Label | Text |

> Button은 `ReadOnly` 미운영, `Validation` 미운영 (Form 검증 대상 아님), `Selection` 미운영.
> 토글 성격 버튼은 Toggle Button으로 별도 컴포넌트 분리.
> `FocusVisible`은 Variant matrix 외 별도 Frame 운영.

### 3-2. TextInput

| 카테고리 | Property | 값 |
|---|---|---|
| **Visual** | Size | sm / md / lg |
| | Alignment | Left / Right |
| **State** | Availability | Enabled / Disabled / **ReadOnly** |
| | Interaction | Rest / Hover / **Pressed** (Focus 진입·타이핑 중) |
| | Validation | None / Error / Warning / Success |
| **Feature** | Has Label | True / False |
| | Has Supporting Text | True / False |
| | _Leading Element | True / False (Boolean + Nested Instance) |
| | _Trailing Element | True / False (Boolean + Nested Instance) |
| **Content** | Label | Text |
| | TextValue | Text |
| | SupportingText | Text |
| **Private Sub-Component** | _Leading Element | `Type = Icon / File / Profile` |
| | _Input Content | `Role = Placeholder / Text / Password / Number`, `Size = sm / md`, `Alignment = Left / Right` |
| | _Trailing Element | `Type = Clear / Reveal / Custom` (Dropdown 미사용 — Select 전용) |

> **변경 매핑 (v3.3 → v3.4)**: `HasLeftIcon` → `_Leading Element`, `HasRightAction` + `RightAction` → `_Trailing Element`, `HasAssistiveText` → `Has Supporting Text`, `AssistiveText` → `SupportingText`, `Chevron` 값 → `Dropdown` rename 후 Select 전용. Pressed enum 환원으로 Interaction 3종(Rest/Hover/Pressed) 운영.

### 3-3. Checkbox

| 카테고리 | Property | 값 |
|---|---|---|
| **State** | Selection | Unchecked / Checked / Indeterminate |
| | Availability | Enabled / Disabled / **ReadOnly** *(v3.5: Locked → ReadOnly 통일)* |
| | Interaction | Rest / Hover / **Pressed** |
| | Validation | None / Error / Warning / Success |
| **Visual** | Weight | Regular / SemiBold |
| **Feature** | Has Tooltip | True / False |
| | _Leading Element | True / False (Boolean + Nested Instance) |
| **Content** | Label | Text |
| **Private Sub-Component** | _Leading Element | `Type = Icon / File / Profile` (TextInput과 공유 가능) |

> **변경 매핑 (v3.3 → v3.4)**: `HasSlot` → `_Leading Element` (격상), `HasHelp` → `Has Tooltip` (rename), `Description` 제거(Tooltip으로 대체), Pressed enum 환원.
> `Selected` → `Selection`으로 리네이밍. 값도 `False/True/Indeterminate` → `Unchecked/Checked/Indeterminate`로 명확화.
> `Show Middle Icon`은 제거 — `Selection=Indeterminate`에서 vector shape 자동 파생.
> **v3.5부터 모든 컴포넌트 `ReadOnly`로 통일** — Locked 분리 정책 폐기 (Part 6 통일 정책 참조).

---

## Part 4. 명명 규칙 (금지/추천 용어)

### 4-1. 금지 → 추천 매핑

| 금지 / 비추천 | 추천 | 사유 |
|---|---|---|
| `State` (단일 Property로) | `Availability` / `Interaction` / `Validation` / `Selection` | 의미 혼재 해소 |
| `Active` | `Hover` / `Pressed` / `FocusVisible` / `Selected` / `Checked` | 컴포넌트별 의미 미끄러짐 방지. v3.4 Pressed 환원으로 누름은 별도 enum |
| `Default` (Interaction에서) | `Rest` | Validation의 `None`/`Default`와 혼동 방지 |
| `Locked` (TextInput에서) | `ReadOnly` | HTML 표준 attribute 매핑 |
| `ReadOnly` (Checkbox에서) | `Locked` | Choice 계열의 잠금 시각 메타포 (Part 6) |
| `Focused` | `FocusVisible` | W3C ARIA 표준 명칭, AI 가독성 ↑ |
| `Dropdown` (Property로) | `HasDropdown` (Boolean) | 상태 ≠ 기능 |
| `Tooltip` (Property로) | `Has Tooltip` (Boolean) | 상태 ≠ 기능 |
| `Left Icon` / `Right Icon` (Property로) | `_Leading Element` / `_Trailing Element` (Private Sub-Component) | swap 가능한 외피로 격상 |
| `Right Action` (Property/Layer로) | `_Trailing Element` (Private Sub-Component) | 방향 중립 + Button.trailing과 일관 어휘 |
| `Chevron` (TextInput.RightAction 값) | `Dropdown` (`_Trailing Element.Type` 값) | rename 후 shared `_Trailing Element`에 통합 (TextInput·Select 공유) |
| `Has Help` (Boolean) | `Has Tooltip` (Boolean) | 인터랙션 메커니즘 명시, AI 가독성 ↑ |
| `Has Slot` (Boolean) | `_Leading Element` (Boolean + Nested) | swap 가능한 외피로 격상 |
| `Assistive Text` | `Supporting Text` | Material 3 표준 어휘, AI/외부 협업 가독성 ↑ |
| `Status Text` (Toggle Text Property) | `Label`로 흡수 | Toggle도 일반 컴포넌트와 동일 Label 운영 — "꺼짐/켜짐"은 Label 텍스트로 입력 |
| `Base XXX` (컴포넌트명 접두) | `XXX` (접두 제거) | Sys/Service 구분은 metadata에서 처리 |
| `XXX (office)` / `XXX (hr)` (컴포넌트명 접미) | 접미 제거 | 브랜드는 토큰 레이어에서 분기 |

### 4-2. 명명 형식 규칙

```
[Variant Property]      PascalCase            예: Availability, Interaction, Type, Role, Size
    └ Private Sub-Component 내부 Properties도 동일 (예: _Trailing Element.Type)
    └ 소문자 시작 금지 (예: `type` → `Type`)

[Variant Value]         PascalCase            예: Enabled, FocusVisible, Pressed
    └ Private Sub-Component 값도 동일 (예: Clear, Reveal, Dropdown, Custom)

[Boolean Property]      분기 규칙 적용
    ├ 단순 visibility 토글 (Nested 없음) → `Has + Noun` (공백 허용)
    │   예: `Has Label`, `Has Supporting Text`, `Has Tooltip`
    │   AI 신호: 단순 show/hide, swap 불가
    └ Nested Instance visibility 토글 → 해당 Nested Instance명 그대로 (`_` 접두)
        예: `_Leading Element`, `_Trailing Element`, `_Input Content`
        AI 신호: `_` 접두 = "swap 가능한 외부 컴포넌트와 연결됨"

[Text Property]         Noun (PascalCase)      예: Label, TextValue, SupportingText

[Public Component]      PascalCase, 접두/접미 금지
    예: TextInput, Checkbox, Toggle, Radio, Select, Button
    ├ `Base XXX` 접두 금지 — Sys/Service 구분은 metadata에서 처리
    └ `XXX (office)` / `XXX (hr)` 접미 금지 — 브랜드는 토큰 레이어에서 분기

[Private Sub-Component] _ 접두 + Title Case (공백 허용)
    예: _Input Content, _Select Content, _Leading Element, _Trailing Element
    ├ Asset 패널 비공개(`_` 접두 = Figma 표준)
    ├ 공백 허용 (가독성 우선)
    ├ Public 컴포넌트의 Nested Instance로만 사용 (단독 게시 금지)
    ├ 다수 Public 컴포넌트에서 공유 가능 (예: `_Trailing Element` ← TextInput·Select 공유)
    └ 내부 Properties는 [Variant Property]·[Variant Value] 규칙 동일 적용

[Custom 슬롯 운영 원칙]
    Private Sub-Component의 `Type` Property에 `Custom` 값 운영 가능
    → 정의된 표준 값 외 자유 swap 슬롯 (미래 확장·예외 케이스 대응)
    → 사용 시 컴포넌트 문서에 swap 후보 명시 권장 (예: 정보 아이콘, 로더, 뱃지)
```

→ 모든 Property·Value는 **PascalCase 기본**. Private Sub-Component명만 가독성 위해 공백 허용. Boolean Property는 분기 규칙으로 `_` 접두(Nested) ↔ `Has +` 접두(단순) 구분. AI 파싱 일관성 확보.

---

## Part 5. 토큰 매핑 원칙 — C안 (토큰 통합·변형 분리)

### 5-1. 핵심 결정 (v3.4 환원, 2026-05-06)

> **Pressed enum 운영 환원. Rest / Hover / Pressed 3종 표준 운영.**
> 길 2 채택(2026-05-04)이 *시각·토큰 100% 동일*을 전제했으나, 실제 Figma 빌드(Checkbox·Toggle·TextInput)에서 Pressed가 stroke·fill 차등 슬롯으로 활용 중인 것이 확인되어 환원.

근거:
- 실물 빌드와 정책 간 불일치 해소가 1:1 정합성 원칙(프로젝트 지침 §2)에 부합
- Pressed = Focus 진입·타이핑 중 등 명확한 시각 차등 케이스 존재 (TextInput stroke 강조)
- Choice 계열(Checkbox)도 Pressed 활용 — Input/Choice 분류 무관 일관 운영 가능
- 토큰 신설 0건 (기존 `*.active` 토큰 공유 + 컴포넌트별 차등 매핑)

### 5-2. Interaction → 토큰 매핑

| Interaction | 사용 토큰 슬롯 | 비고 |
|---|---|---|
| `Rest` | `sys.*.{role}.{emphasis}.default` | 기본값 |
| `Hover` | `sys.*.{role}.{emphasis}.active` | 마우스 hover 상태 |
| `Pressed` | 컴포넌트별 차등 매핑 | 기본은 `*.active` 공유, stroke 강조 시 `sys.stroke.*.strong.default` 등. 컴포넌트 매핑표에서 명시 |
| `FocusVisible` | (별도 Frame) | Variant matrix 외 — 별도 `🎯 Focus Ring 가이드` Frame 운영 |

> `FocusVisible`은 시각 처리가 시스템 레벨이므로 컴포넌트 Variant에서 제외하고 통합 가이드 Frame으로 분리. Button·TextInput·Checkbox 모두 동일 정책.

### 5-3. Validation → 토큰 매핑

| Validation | 사용 토큰 Role |
|---|---|
| `None` | `sys.*.neutral.*` |
| `Error` | `sys.*.alert.*` |
| `Warning` | `sys.*.warning.*` |
| `Success` | `sys.*.positive.*` |

> 모든 Role은 `sys-tokens.json`에 기존재. **신설 0건.**

### 5-4. Availability → 토큰 매핑

| Availability | 사용 토큰 슬롯 | 비고 |
|---|---|---|
| `Enabled` | `sys.*.{role}.{emphasis}.default` 또는 `.active` | Interaction에 따라 |
| `Disabled` | `sys.*.{role}.{emphasis}.disabled` | 토큰 슬롯 활용 |
| `ReadOnly` | 컴포넌트별 정의 (TextInput: bg는 disabled, 텍스트는 default) | 행동 정의 필수 |
| ~~`Locked`~~ | **v3.5에서 폐기** — ReadOnly로 통일. 자물쇠 등 시각 요소는 anatomy 표현으로 자유 운영 |

### 5-5. 토큰 신설 진단표 (적용 점검 결과)

| 적용 항목 | 신설 필요 토큰 | 결과 |
|---|---|---|
| 3축 분리 (Availability/Interaction/Validation) | 없음 | ✅ 기존 자산만으로 충족 |
| Validation 4단계 (None/Error/Warning/Success) | 없음 | ✅ alert/warning/positive role 기존재 |
| Interaction 3단계 운영 (Rest/Hover/Pressed) + FocusVisible 별도 Frame | 없음 | ✅ 기본은 `*.active` 토큰 공유. 컴포넌트별 차등 시 기존 strong/subtle 등 활용 |
| ~~Locked vs ReadOnly 분리~~ → **ReadOnly 전면 통일** (v3.5) | 없음 | ✅ 명명만 통일, 행동 정의는 컴포넌트별 유지 |
| Private Sub-Component 카테고리 (`_Leading/_Trailing Element`, `_Input/_Select Content`) | 없음 | ✅ 외피 분리만 — 토큰은 부모 컴포넌트에서 그대로 상속 |

> **결론: 본 정책 적용에 따른 토큰 신설은 0건.** 단, Focus ring width·spread는 기존 Pending Tokenization 항목으로 별도 추적 (`hiworks-ds-guide.md` Part 8 대기열).

---

## Part 6. Availability=ReadOnly 통일 정책 (v3.5)

### 6-1. 결정 사항

> **모든 폼 컨트롤(TextInput · Checkbox · Toggle · Radio · Select 등)은 `Availability=ReadOnly`로 명명을 통일한다.**

v3.4까지 운영하던 *"Choice 계열은 `Locked`, Text 계열은 `ReadOnly`"* 분리 정책은 **v3.5(2026-05-06)에 폐기**한다. Gemini 의견 검토 후 다음 3가지 근거로 ReadOnly 통일이 더 정합적이라고 판정:

| 근거 | 내용 |
|---|---|
| **ARIA 표준 정합성** | W3C ARIA에 `aria-readonly="true"` 속성이 체크박스·라디오·스위치·콤보박스·슬라이더·트리·그리드 등 모든 폼 컨트롤에 표준화되어 있음. HTML 기본 속성에는 없지만 글로벌 웹 접근성 표준에서 "Choice 계열의 읽기 전용" 개념을 인정 |
| **모던 프레임워크 API 일관성** | MUI · Chakra UI · Radix UI 등 글로벌 디자인 시스템이 `readOnly` prop을 폼 컨트롤 전반에 통일 적용. Hiworks DS만 `locked` 쓰면 코드 사용처에서 prop명 매번 외워야 함 |
| **AI 코드 생성 호환성** | 프로젝트 비전 §1 *"AI 가독성 중심"* — Cursor 등 AI 코드 생성기가 폼 렌더링 반복 로직 짤 때, 동일 의미는 동일 prop명으로 통일되어야 에러율 낮음 |

### 6-2. 시각 메타포는 prop과 분리

`Locked` 명명을 폐기해도 **자물쇠 아이콘 등 시각 메타포는 자유롭게 운영 가능**하다. prop은 "상태"를 가리키고, 시각 메타포는 "표현"을 결정하는 별개 레이어이기 때문이다.

| 레이어 | 책임 | 예시 |
|---|---|---|
| Prop (Variant) | 상태 식별 — 머신 가독성 | `Availability=ReadOnly` |
| 시각 메타포 (Anatomy) | 사용자 인지 단서 | `_Leading Element.Type=Lock` (자물쇠 아이콘 swap) |

따라서 Choice 계열에서 자물쇠 아이콘이 더 자연스럽다고 판단되면 그건 anatomy의 leading element나 별도 데코로 처리하면 된다 — prop명은 ReadOnly로 유지.

### 6-3. 컴포넌트별 행동 정의 (참조)

각 컴포넌트의 `components/*.md`에 다음 항목을 반드시 명시한다 (Availability=ReadOnly 시):

- 클릭 가능 여부
- 키보드 변경 가능 여부
- 포커스 허용 여부
- 툴팁 허용 여부
- 접근성 노출 방식 — 표준은 `aria-readonly="true"`. 자물쇠 아이콘 디자인 채택 시 `aria-label` 보강 여부

### 6-4. 컴포넌트별 ReadOnly 운영 매핑

| 계열 | Availability 명명 | HTML/ARIA 매핑 | 시각 표현 |
|---|---|---|---|
| Form Input — TextInput, TextArea, NumberInput | `ReadOnly` | `<input readonly>` 1:1 | 텍스트 또렷 + 회색 배경 |
| Choice — Checkbox, Radio, Switch/Toggle | `ReadOnly` | `aria-readonly="true"` (HTML 기본 속성 미존재) | 자물쇠 아이콘 등 자유 운영 |
| Picker — DatePicker, Select, Combobox | `ReadOnly` | `aria-readonly="true"` | 컴포넌트별 결정 (자물쇠/회색배경/조합) |

### 6-5. v3.4 → v3.5 마이그레이션 영향

| 항목 | 영향 |
|---|---|
| 토큰 매핑 | 변경 없음 — Locked 행의 토큰을 ReadOnly 행에 그대로 사용 |
| 시각 차이 | 변경 없음 — 빌드된 컴포넌트 외형 영향 0 |
| Variant 명명 | `Availability=Locked` → `Availability=ReadOnly` |
| Figma Component Set | Variant property 값 rename (combineAsVariants 자동 갱신) |
| 컴포넌트 문서 | checkbox-office v1.4 / toggle-office v1.2 / radio-office v1.1 / select v1.1 갱신 |

### 6-6. 역사적 맥락 (참고)

- **v3.4(2026-05-06 v1.1)**: Locked vs ReadOnly 분리 정책 도입. "Choice 계열은 잠금 메타포가 자연스럽다"는 디자인 직관 + HTML readonly 미지원 논거 채택
- **v3.5(2026-05-06 v3.5)**: 분리 정책 폐기. Gemini 검토를 통해 ARIA 표준 + 모던 프레임워크 컨벤션 + AI 가독성 측면이 분리 정책의 디자인 직관보다 우선순위 높음을 확인

---

## Part 7. 적용 가이드 — 컴포넌트 작업 시 체크리스트

### 7-1. 신규 컴포넌트 작업 시

```
☐ Property 카테고리 분리 — State / Visual / Feature / Content
☐ State 카테고리 안에서 3축 적용 가능성 검토
   ☐ Availability 필요한가? → 컴포넌트가 disabled 상태를 가지는가
   ☐ Interaction 필요한가? → 인터랙티브 컴포넌트인가
   ☐ Validation 필요한가? → Form 검증 대상인가
☐ Active 용어 사용 여부 점검 — 발견 시 Pressed/FocusVisible/Selected/Checked로 치환
☐ Availability=ReadOnly 적용 — 모든 폼 컨트롤 통일 명명 (Part 6, v3.5)
☐ FocusVisible은 Variant matrix에서 제외, 별도 Frame 분리
☐ Boolean Property로 분리 가능한 항목 — Has* 패턴 적용
☐ 토큰 신설 필요성 점검 — 본 정책 적용은 신설 0건이 원칙
☐ `components/{name}.md` 작성 시 본 문서 §Part 3 패턴 따라 Property 표 구성
```

### 7-2. 기존 컴포넌트 마이그레이션 시

```
☐ 현행 State 값 분해 — 어떤 차원이 섞여 있는지 분석
☐ Locked 잔여 표기 → ReadOnly로 일괄 정정 (v3.5 통일 정책)
☐ Active → Pressed/FocusVisible/Selected 등으로 분해
☐ Hover/Pressed 토큰 통합 정책(C안) 적용 — 시각 동일·명명 분리
☐ Variant 수 증감 계산 — 폭증 시 Boolean Property 분리 검토
☐ 변경 이력 작성 — `hiworks-ds-guide.md` Part 9 + 컴포넌트 문서 작업 이력 양쪽
```

### 7-3. 정책 추인 절차

신규 컴포넌트가 본 정책에서 벗어난 패턴을 채택해야 할 경우:

1. 작업방에서 사유와 영향 범위 정리 (`정책방 이관 안건` 섹션 활용)
2. 정책방 합의 후 본 문서 Part 3에 케이스 추가 또는 Part 4·6 명명 규칙 보완
3. `hiworks-ds-guide.md` Part 8 *컴포넌트 운영 원칙*에 결정 등재
4. `hiworks-ds-guide.md` Part 9 변경 이력에 날짜·사유 기록

---

## Part 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-30 | 본 문서 신규 작성 — 3축 분리 정책 단독 문서화. Button·TextInput·Checkbox 적용. C안(토큰 통합·변형 분리) 채택. Locked vs ReadOnly 분리 명문화. FocusVisible 명명 확정. Validation 4단계 슬롯 예약 (None/Error/Warning/Success). 토큰 신설 0건. |
| 2026-05-04 | **길 2 채택 — Pressed enum 제거**. *Hover=Active 통합 정책*(2026-04-22) 연장으로 Hover가 누름 의미 흡수. Pressed는 보류 슬롯으로 유지하되, 시각 차등·토큰 분리·접근성 요구·컴포넌트별 예외 4가지 트리거 충족 시 비파괴적 enum 추가 (Part 2-2-1, 2-2-2). Variant 수 ~30% 절감. 토큰 신설 0건. |
| 2026-05-06 | **v3.5 — Locked vs ReadOnly 분리 정책 폐기, ReadOnly 전면 통일.** Gemini 의견과 ARIA `aria-readonly` 표준·모던 프레임워크(MUI·Chakra UI 등) API 일관성·AI 코드 생성 호환성 검토 결과, Choice 계열만 Locked로 분리하던 v3.4 정책을 폐기. 모든 폼 컨트롤(TextInput·Checkbox·Toggle·Radio·Select)을 `Availability=ReadOnly`로 통일. 토큰 매핑·시각 차이 0건 — Variant 명명만 갱신. Part 6 전면 재작성. 자물쇠 등 시각 메타포는 prop과 분리되어 anatomy 표현으로 자유 운영 가능. 토큰 신설 0건. |
| 2026-05-06 | **v3.4 — Pressed 환원 + Private Sub-Component 카테고리 신설.** 실물 Figma 빌드(Checkbox·Toggle·TextInput) 검수에서 Pressed가 stroke 차등 슬롯으로 활용됨을 확인 → 길 2 정책 환원, Pressed = ✅ 운영 enum으로 복귀. 동시에 `_Input Content` / `_Select Content` / `_Leading Element` / `_Trailing Element` 4종 Private Sub-Component 카테고리 신설 — Nested Instance 패턴 채택, Boolean Property 분기 규칙 명문화(`_Name` ↔ `Has + Noun`). `Right Action` → `_Trailing Element` rename, `Chevron` → `Dropdown` rename + shared `_Trailing Element`에 통합. `Has Help` → `Has Tooltip`, `Assistive Text` → `Supporting Text`, `Status Text` → `Label` 흡수 등 어휘 통일. `Base XXX` 접두 / `XXX (office)` 접미 일괄 제거 정책. Custom 슬롯 운영 원칙 추가. AI 가독성 신호로서 `_` 접두 의미 강화. 토큰 신설 0건. |

---

## 관련 문서

- `hiworks-ds-guide.md` — 토큰 시스템 단일 기준 문서 (Part 8 *컴포넌트 운영 원칙*과 상호 참조)
- `components/button-office.md` · `components/button-hr.md` — Button 컴포넌트 사양
- `components/input.md` — TextInput 컴포넌트 사양
- `components/checkbox-office.md` — Checkbox 컴포넌트 사양
- `accessibility-watchlist.md` — 접근성 이슈 단일 수렴 문서

---

*본 문서는 Property 명명·구조 정책의 단일 기준 문서다. 토큰 명명·계층 정책은 `hiworks-ds-guide.md`를 따른다. 두 문서가 충돌할 경우 토큰 정책이 우선하며, 본 문서는 그에 맞춰 갱신한다.*
