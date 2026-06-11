# Table

> **Hiworks Design System v3** · Service Component · **Data Display 카테고리** · 브랜드 분기 빌드 (Office · HR)
> 단일 기준 문서: `hiworks-ds-guide.md` · 정책: `component-property-policy.md` v3.8 · 운영: `session-sync-protocol.md`
> 최초 작성: 2026-05-18 (v1.0) · v1.1~v1.4.2: 2026-05-18~20 · v1.5 등재 ~ v1.5.2 봉인: 2026-05-20~21 (`Table` 컨테이너 컴포넌트 명세 + 좌측 헤더 표 / 다단 헤더 운영 가이드 + 외곽 책임 환원 + 토큰 매핑 정합·시각 위계 정정) · v1.6 등재: 2026-05-21 (`_Table`→`Table` rename 정합 정정 + Top Line 레이어 명문화 + B' 우측 헤더 표 케이스 + Header.Align=Right 환수) · **v1.7 등재: 2026-05-26** (Table.State Variant 3축 + Show Header Boolean + `_TableMessage` PSC + `_SkeletonCell` / `_SkeletonRow` PSC + min-height 토큰 바인딩) · **v1.8 등재: 2026-06-01** (실적용 색 과진 → Header bg `brand/normal/*`→`brand/subtle/*`, Selected bg `brand/subtle/*`→`brand/faint/*` 위계 유지 한 칸 하향. 토큰 값 0건. 재개 트리거 ②)

---

## 1. 개요

| 항목 | 값 |
|---|---|
| 컴포넌트명 | **`Table`** (Public 최상위 컨테이너, v1.6 rename) · **`_Cell`** (베이스 슈퍼 컴포넌트) · **`_Cell Content`** · **`_Leading Element`** / **`_Trailing Element`** · **`_Row`** / **`_HeaderRow`** / **`_DnDRow`** · **`_DragHandle`** · **`_TableMessage`** / **`_SkeletonCell`** / **`_SkeletonRow`** (v1.7 신규) — 모두 PSC, `_` 접두 유지 |
| 분류 | **Service Component** — Table family는 brand 시각(Row.Selected bg / `_Cell` brand bg·border) 보유 |
| 카테고리 | **Data Display** |
| 브랜드 | Office · HR 분기 빌드 |
| 참조 토큰 | `service/{brand}/*` + `sys/*` |
| 범위 | Simple Table (조회/읽기) + Data Table (인라인 편집) — 단일 `_Cell` 베이스, **Mode가 시각 책임 분기** |
| 범위 외 (다음 라운드) | Pagination · 트리 표 · 멀티헤더 · 소계·총계 행 · 토큰 매핑 |

> **v1.1.1 정정 사유 (재개 트리거 ② Figma 실측 검수 충돌)**:
> v1.0/v1.1의 `Editing` enum이 *Mode=Edit과 책임 중복*이라는 통찰 — Mode가 모드 책임을 가지므로 Interaction은 *순수 인터랙션*만 (Rest/Hover/Pressed). 외부 일관성 우선 원칙 두 번째 적용 (Size에 이은 Interaction 명명).

---

## 2. 컴포넌트 가족

```
[Base 슈퍼 컴포넌트]
  _Cell                 ← 모든 셀의 단일 근간
   ├── _Cell Content    ← 읽기용 데이터 표현 전용
   ├── _Leading Element ← 좌측 부가 요소 PSC (Header/Data만 운영)
   └── _Trailing Element← 우측 부가 요소 PSC (Header/Data만 운영)

[래핑 컴포넌트 — Row family (v1.3)]
  _Row                  ← _Cell.Mode=Data 가로 묶음 (일반 데이터 행)
  _HeaderRow            ← _Cell.Mode=Header 가로 묶음 (헤더 전용)
  _DnDRow               ← Drag and Drop 전용 행

[Body Slot 상태 표현 PSC — v1.7 신규]
  _TableMessage         ← Empty / Loading 상태 메시지 (State enum 2)
  _SkeletonCell         ← Skeleton placeholder 셀 (Size × Length = 8 variants, _Cell 동형)
  _SkeletonRow          ← Skeleton placeholder 행 (_SkeletonCell × 15, _Row 동형 단일 컴포넌트)

[Table 컨테이너 (v1.5 신설 / v1.6 rename — Public Component / v1.7 Property 신설)]
  Table                 ← State Variant (Loaded/Empty/Loading) + Show Header Boolean
                         + Header Slot (Instance Swap, Show Header=T 시 노출)
                         + Body Slot (Auto Layout 가변, State별 default 분기)

[Data Cell 래핑 폐기 — _Cell + Mode=Edit 직접 사용]
```

---

## 3. `_Cell` — Base 슈퍼 컴포넌트

### 3-1. Property 매트릭스

| 카테고리 | Property | Values | 비고 |
|---|---|---|---|
| **형태** | `Mode` | `Header` / `Data` / `Edit` | 시각 책임 분기 |
| 형태 | `Size` | `md` / `lg` | 외부 컴포넌트 시멘틱 정합 |
| 형태 | `Align` | `Left` / `Center` / `Right` | Mode별 제약 (§3-2) |
| **상태** (Mode=Edit 한정) | `Availability` | `Enabled` / `Disabled` / `ReadOnly` | policy v3.5 |
| 상태 | `Interaction` | `Rest` / `Hover` / **`Pressed`** | **v1.1.1: Editing → Pressed rename** (외부 인풋 일관성 + Mode가 모드 책임 흡수) |
| 상태 | `Validation` | `None` / `Error` | Mode=Edit, Interaction=Hover에서 운영 |
| **가시성** (Header/Data만) | `_Leading Element` | `False` / `True` | Edit Mode에서 비활성 (Edit Slot의 Input이 자체 처리) |
| 가시성 | `_Trailing Element` | `False` / `True` | Edit Mode에서 비활성 |
| **슬롯** | `Data Slot` (Instance Swap) | Mode=Data 활성 / 기본 _Cell Content | swap 후보: _Cell Content 전체 + 모든 폼·인터랙티브 원본 |
| 슬롯 | `Edit Slot` (Instance Swap) | Mode=Edit 활성 / 기본 Borderless TextInput | swap 후보: Borderless variant 컴포넌트들 |
| (Mode=Header) | — | Slot 비활성, `_Cell Content` 고정 | 헤더는 텍스트 컬럼명 전용 |

### 3-2. Mode별 운영 매트릭스

| Mode | Align | Availability | Interaction | Validation | _Leading / _Trailing | Slot |
|---|---|---|---|---|---|---|
| **Header** | **Left / Center / Right** (v1.6 환수 — B' 우측 헤더 표 대응) | Enabled 고정 | Rest / Hover | None 고정 | False / True | 비활성 (_Cell Content 고정) |
| **Data** | Left / Center / Right | Enabled 고정 | Rest 고정 | None 고정 | False / True | Data Slot 활성 |
| **Edit** | Left / Right (Center 미운영) | Enabled / Disabled / ReadOnly | Rest / Hover / **Pressed** | None / Error (Hover 시) | **비활성** | Edit Slot 활성 |

→ Mode가 *시각 책임 + 운영 제약*을 가름. Mode-Interaction *책임 분리* 정합.

### 3-3. Borderless Input — Mode=Edit의 Cell 자체 시각

엑셀시트형 인라인 편집은 *셀 자체가 인풋 시각*.

```
Mode=Edit + Interaction:
  Rest    → border·bg 없음, 텍스트만
  Hover   → 회색 border 노출
  Pressed → 파란 border + 텍스트 활성 (클릭 후 편집 모드 진입 시각)
Mode=Edit + Validation=Error (Hover 시) → 빨간 border (경고)
Mode=Edit + Availability=Disabled/ReadOnly → 회색 bg
```

> v1.1에서 `Editing`이라 명명한 시각이 v1.1.1에서 `Pressed`로 통일됨. *Mode=Edit이 이미 편집 모드를 표현*하므로 Interaction에서 별도 Editing enum 불필요. 외부 인풋 컴포넌트의 Pressed와 명칭 일관.

---

## 4. `_Cell Content` — 읽기용 데이터 표현 전용

### 4-1. Property 매트릭스 (v1.3.5 — Availability 추가)

| Property | Values |
|---|---|
| `Data Format` | `Text` / `Number` / `Avatar+Text` / `Badge` |
| `Weight` | `Regular` / `SemiBold` |
| **`Availability`** (v1.3.5) | **`Enabled` / `Disabled`** |

매트릭스: 4 × 2 × 2 = **16 variants**

### 4-2. 정의

> *"_Cell Content는 글자·정보의 시각적 형태만 정의. 인터랙티브·액션 요소는 포함하지 않는다."*

### 4-3. Weight 운영 — 권장 default + 자유 선택

| Mode | Weight default | 강조 |
|---|---|---|
| Header | SemiBold | (강조 없음) |
| Data·Edit | Regular | SemiBold 자유 선택 |

### 4-4. Availability 운영 — 자동 전파 (v1.3.5)

#### 발현 범위
| Mode | _Cell Content.Availability | 발현 |
|---|---|---|
| Header | Enabled 고정 (헤더는 Availability 의미 X) | — |
| **Data** | Enabled / Disabled | ✅ 메인 발현 |
| Edit | _Cell Content가 Slot에 안 들어감 (Edit Slot 활성) | — |

#### Disabled 시각 매핑

| Data Format | Enabled | Disabled |
|---|---|---|
| **Text** (Regular/SemiBold) | `sys/text/neutral/normal/default` (#333) | `sys/text/neutral/normal/disabled` (#aeaeae) |
| **Number** (Regular/SemiBold) | 동일 | 동일 |
| **Avatar+Text** (Regular/SemiBold) | `sys/text/neutral/normal/default` + Avatar(Enabled) | `sys/text/neutral/normal/disabled` + **Avatar 컴포넌트 자체 Availability=Disabled override** |
| **Badge** (Regular/SemiBold) | Badge 컴포넌트 (Availability=Enabled) | **Badge 컴포넌트 자체 Availability=Disabled override** |

→ Avatar+Text·Badge는 *nested 컴포넌트(Avatar, Badge) 자체*의 Availability variant가 책임. _Cell Content.Disabled variant 안에서 *nested instance.Availability=Disabled override* 박혀 있음.

#### 자동 전파 운영 룰 (v1.3.5)

```
빌더 1단계:
  _Row.Availability = Disabled 토글

자동 전파:
  ↓ _Row.Disabled variant 안에 박힌 override
  → 모든 _Cell Content.Availability = Disabled
    ↓ _Cell Content.Disabled variant 안에 박힌 override
    → nested Avatar.Availability / Badge.Availability = Disabled
```

빌더는 _Row.Availability만 토글 → 시각이 *3단계 자동 전파*. Layer Panel multi-select 불필요.

#### 책임 분리 정합

| 레이어 | Availability 책임 |
|---|---|
| `_Row` | 행 단위 (bg + 자동 전파 트리거) |
| `_Cell` | 셀 컨테이너 (Edit Mode 한정 — v1.1.1) |
| **`_Cell Content`** | **콘텐츠 자체 시각 (v1.3.5)** |
| nested Avatar/Badge | 자체 시각 (각자 컴포넌트 책임) |
| Slot swap 폼 컨트롤 (TextInput·Select 등) | 자체 Availability (이미 운영) |

→ Slot에 들어가는 모든 요소가 *자체 Availability를 가지는 일관 패턴*.

---

## 5. `_Leading Element` / `_Trailing Element` — Header·Data 한정 운영

Edit Mode에서는 **비활성**. 이유: Edit Slot에 들어가는 Input 컴포넌트(Borderless TextInput·Select 등)가 *자체 _Leading/_Trailing PSC* 보유 → Cell 외부 슬롯은 중복.

### 5-1. `_Leading Element`
| Property | Values |
|---|---|
| `Type` | `Icon` / `Tag` / `Checkbox` |

### 5-2. `_Trailing Element`
| Property | Values |
|---|---|
| `Type` | `Sorting Icon` / `Tooltip` |
| `Sorting` | `False` / `True` |

---

## 6. 래핑 컴포넌트 — Row family (v1.3)

### 6-1. `_Row` — 일반 데이터 행 (Simple Table용)

```
구성:        _Cell.Mode=Data 가로 묶음 (Auto Layout)
Expose OFF:  내부 Cell의 Mode 관련 Property (Row가 Cell.Mode를 알지 못함)
```

#### Property 매트릭스 (6상태, 4축 분해)

| Property | Values | 비고 |
|---|---|---|
| `Availability` | `Enabled` / `Disabled` | 권한·일시 락 (기획 자유) |
| `Validation` | `None` / `Error` | **행 단위 invalid** (Cell.Validation과 직교 책임) |
| `Selected` | `True` / `False` | LNB 정합 — 영구 선택 상태 (Checkbox 도구 결과) |
| `Highlight` | `True` / `False` | 임시 강조 (검색 매칭·임시 포커스 등) ※ 색상 토큰 Figma 실측 후 v1.4 |
| `Interaction` | `Rest` / `Hover` | Pressed 제외 (영구 선택 패턴) |

매트릭스 크기 (v1.3.6 정정): **17 variants** — 직교 32에서 Disabled 14개 통합

#### Availability-Property 활성 제어 (v1.3.6 신규 원칙)

`_Cell.Mode`별 Property 활성 제어와 동형 패턴 적용:

| Availability | 활성 Property | Variants |
|---|---|---|
| **Enabled** | Validation × Selected × Highlight × Interaction (2×2×2×2) | **16 variants** |
| **Disabled** | Validation/Selected/Highlight/Interaction 모두 default 고정 | **1 variant** (Disabled가 모든 시각 흡수) |

**총 17 variants** (직교 32 대비 47% 절약)

#### 시각 우선순위 (Enabled 내부)

```
Enabled에서만 적용: Error > Selected > Highlight > Hover > Rest
```

Disabled는 *Availability-Property 활성 제어*로 다른 Property 시각을 *완전 흡수* — 시각 우선순위와 별개의 *상위 제어 계층*.

#### 운영 정책 — Max Cell 전략 (v1.3.4 등재)

`_Row` 마스터 구조:

| 항목 | 정책 |
|---|---|
| **마스터 내부 _Cell 개수** | **15개** 미리 박음 (Hiworks 실사용 최대 컬럼 수 기준) |
| **컬럼 수 가변 방식** | **visibility 토글** — 빌더가 필요한 컬럼만 visible=true |
| **각 _Cell instance 기본값** | Mode=Data / Size=md / Align=Left / Slot=`_Cell Content` |
| **_Row 본체 width** | Fill (Table 컨테이너 width 따라감) |
| **_Cell instances 기본 width** | **모두 Fill** (Auto Layout 균등 분배) |
| **Mixed width 운영** | 사용 시 cell 단위 *Fixed로 override* (체크박스 40px, 액션 100px 등 — hardcoded) |
| **Nested Instance Expose** | **OFF** — 빌더가 _Row 안 _Cell instance 직접 선택해 Property 컨트롤 |
| **Cell.Size 컨트롤** | _Row Property로 분리 X — *cell instance 단위* 컨트롤 (multi-select로 일괄 변경 가능) |
| **마지막 컬럼 stroke 제거** | 빌더 운영 룰 — 마지막 visible cell 선택해 *stroke right 제거 override* (v1.3.3 A안) |

##### 빌더 운영 가이드

```
1. _Row 인스턴스 꺼냄
2. visibility 토글로 사용할 컬럼만 visible=true (나머지 hide)
3. 각 _Cell의 Property 컨트롤 — Mode/Size/Align/Slot/Data Format 등 직접 변경
4. Mixed width 운영 시 — 특정 cell instance를 Fixed로 override
5. 마지막 보이는 _Cell 선택 → Stroke right 제거 override (외곽 분리선 흡수 회피)
```

##### Max Cell 전략 채택 근거

- 마스터 컴포넌트 1개로 모든 컬럼 수 케이스 커버
- 빌더 운영 단순화 (visibility 토글)
- 컬럼별 align/size/Data Format 자유 변경 (Nested Instance 직접 컨트롤)
- 큰 표에서는 노드 수 약간 증가 (15 cell × 100행 = 1500 노드)지만 wrapper Frame 패턴(3배) 대비 효율

##### 체크박스 cell 운영 패턴 (v1.4.2 명문화)

행 단위 체크 컨트롤이 필요한 경우 **Max Cell 15에 체크박스 cell 포함** 운영 — 데이터 cell은 14개로 축소.

| 위치 | _Cell 셋팅 |
|---|---|
| **첫 cell (체크박스 cell)** | `_Leading Element=True` + `Type=Checkbox` / `Data Slot` hidden / `_Trailing Element` hidden / width **Fixed 36px** (Mixed width) |
| 나머지 14 cells (데이터 cells) | 기본값 — Mode=Data / Size=md / Align=Left / Slot=`_Cell Content` / width Fill |

**Max Cell 정책 정합 유지**: Max Cell 15는 *총 cell 개수* — 체크박스 cell 포함. 데이터 cell이 *최대 14개* (체크박스 사용 시) 또는 *15개* (체크박스 미사용 시).

빌더 운영:
```
체크박스 행이 필요한 표:
1. _Row 인스턴스 꺼냄
2. 첫 cell — Leading=True + Checkbox swap + Slot hidden + width Fixed 36
3. 나머지 cells — visibility 토글로 사용할 컬럼만 visible
4. (필요 시) 마지막 visible cell stroke right 제거 override
```

체크박스 행은 *행 단위 선택 패턴* — `_Row.Selected` Property와 연동 (Checkbox.Selection=Checked ↔ Row.Selected=True 빌더가 sync). v1.3 §6-1 *Selected: T/F* 정합.

### 6-2. `_HeaderRow` — 헤더 전용 (v1.3 분리 / v1.3.1 정정 — variant 없는 단일 컴포넌트)

#### 분리 근거
- 상태 매트릭스 불일치: 헤더는 Disabled/Error/Selected/Highlight **없음** (컬럼명 묶음, 행 단위 상태 없음)
- 내부 Cell.Mode 고정 강제: `_Cell.Mode=Header`만 허용

#### Property 매트릭스 — **0 variants** (단일 컴포넌트, v1.3.1 정정)

| Property | Values |
|---|---|
| (없음) | _HeaderRow는 Property variant 없는 단일 컴포넌트 |

**책임**:
1. `_Cell.Mode=Header` 강제 (빌더 UX 보호 — 데이터 셀이 헤더 자리에 들어가는 실수 차단)
2. 행 하단 border (분리선) — 행 차원 책임

**Hover 시각**: `_Cell.Mode=Header.Interaction=Hover`가 셀 단위로 처리. Row 차원 Hover variant *제거 (중복 회피)*.

> 향후 *컬럼 정렬 Active*·*전체 선택 Checkbox 상태* 등 *행 차원 변별*이 필요해지면 trigger ④로 Property 매트릭스 신설 가능.

### 6-3. `_DnDRow` — Drag and Drop 전용 (v1.3 분리 / v1.4 본격 명세)

#### 분리 근거
- DnD를 `_Row.Property`에 추가 시 매트릭스 64로 폭증 (안 A/B 거부)
- DnD 자체 상태가 일반 행 상태와 *직교 아닌 모드*
- 별도 컴포넌트로 분리 — `_HeaderRow` 분리와 동형 패턴

#### Property 매트릭스 (v1.4 본격 명세)

| Property | Values | 비고 |
|---|---|---|
| **`DnDMode`** | `Active` / `Inactive` | DnD 기능 활성/비활성 토글. Mode-Property 활성 제어 — `_Cell.Mode` 패턴 정합 |
| **`DragState`** | `Idle` / `DragOver` / `Dragging` | DnDMode=Active 한정 발현. HTML5 DnD spec 어휘 정합 |

매트릭스 (Mode-Property 활성 제어 적용):

| DnDMode | DragState | variant 수 |
|---|---|---|
| **Inactive** | default 고정 (활성 제어로 흡수) | **1 variant** (일반 행 시각) |
| **Active** | Idle / DragOver / Dragging | **3 variants** |

→ **총 4 variants** (직교 6에서 활성 제어로 단순화. v1.3.6 *Availability-Property 활성 제어*와 동형 패턴 확장)

#### DragState 의미 정의

| 값 | 의미 | 시각 후보 (v1.4 후속 매핑) |
|---|---|---|
| **Idle** | DnD 모드 켜졌으나 현재 drag 없음 | 일반 행 + Drag handle 표시 |
| **DragOver** | 마우스 drag가 이 행 위에 있음 (drop preview 포함) | brand faint bg (LNB DragOver 정합) 또는 highlight subtle |
| **Dragging** | 자기 자신이 끌리는 중 | opacity 낮춤 + shadow |

#### _DragHandle PSC (자체)

| 항목 | 정책 |
|---|---|
| 컴포넌트 위치 | `_DnDRow` 자체 PSC (`_Cell._Leading Element` 미사용 — 행 단위 책임 분리) |
| 노출 조건 | `DnDMode=Active`에서 표시 / `Inactive`에서 숨김 (자동) |
| 시각 | Drag handle Icon (보통 `::` grip 또는 `⋮⋮` 6-dot) |
| Auto Layout 위치 | Leading (가장 좌측, _Cell × 15 앞) |
| Swap 후보 | 단일 (기본 grip icon 고정) |

#### _Row와의 책임 분리 (Property 미운영 — Anna 결정 5)

`_DnDRow`는 **DnD 인터랙션 한정 컴포넌트**. _Row의 Property는 미운영:

| _Row Property | _DnDRow 운영? | 대체 |
|---|---|---|
| Availability(Disabled) | ❌ | `DnDMode=Inactive`가 비활성 의미 흡수 |
| Validation(Error) | ❌ | DnD 인터랙션과 무관 |
| Selected | ❌ | DnD 행 선택은 별도 인터랙션 |
| Highlight | ❌ | DragOver/Dragging 시각이 대체 |
| Interaction(Hover) | △ | DragHandle 자체 hover (PSC가 처리) |

→ Cell.Mode 혼용 차단 룰(§6-4)과 동형 — *DnDRow는 DnD 책임만 운영*.

#### Max Cell 전략 (v1.3.4 정합 — Anna 결정 6)

`_Row`와 동일:
- 15개 `_Cell` 미리 박음 + visibility 토글
- 기본값: Mode=Data / Size=md / Align=Left / Slot=`_Cell Content`
- width: 모든 cell Fill (Mixed 시 cell 단위 Fixed override)
- Nested Instance Expose: OFF
- 마지막 컬럼 stroke right 제거 = 빌더 override (v1.3.3 A안)

#### 컴포넌트 구조

```
_DnDRow (Component Set, 4 variants)
└── Auto Layout (가로)
    ├── _DragHandle (PSC, DnDMode=Active 시 노출)
    │   └── grip Icon
    └── [_Cell × 15] (Max Cell, visibility 토글)
```

#### 시각 매핑 (v1.4.1 본격 등재)

| Variant | bg | DragHandle icon | 추가 효과 |
|---|---|---|---|
| **DnDMode=Inactive** | (없음 — 일반 행) | `sys/icon/neutral/subtle/disabled` (gray.80) — **Inactive 신호** | — |
| **Active.Idle** | `sys/bg/neutral/faint/default` (#fff) | `sys/icon/neutral/muted/default` (#909090) | — |
| **Active.DragOver** | `office/bg/brand/subtle/active` (#d7ebfc) — brand 강조 | muted/default | — |
| **Active.Dragging** | `sys/bg/neutral/faint/default` | muted/default | **opacity = `sys/opacity/dragging` (0.5)** + `sys/elevation/floating` shadow |

#### 신규 토큰 (v1.4.1)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `global/opacity/50` | 0.5 (Figma 50) | primitive |
| `global/opacity/40` | 0.4 (Figma 40) | primitive |
| `sys/opacity/dragging` | `{global.opacity.50}` | _DnDRow.Dragging |
| `sys/bg/overlay/neutral/normal` | `#00000066` (#000 + 40% alpha) | Modal scrim 등 (신규 카테고리) |

#### Opacity 값 표기 정책 (lineHeight 패턴 정합)

| 위치 | 표기 |
|---|---|
| Figma Variable | integer percent (50) — 소수점 입력 한계 |
| JSON token | number 0~1 (0.5) — CSS/개발 정합 |
| 토큰명 | percent scale (`opacity/50`) — Tailwind/Material 어휘 |

→ lineHeight 정책과 동형. Figma↔JSON 변환 운영 룰.

---

### 6-4. Cell.Mode 혼용 운영 룰 (v1.3 신규)

`_Row` 안에 들어가는 `_Cell.Mode`별 행 상태 시각 적용:

| 내부 Cell 패턴 | 사용 | Row 상태 시각 |
|---|---|---|
| **A. 조회 행** (`_Cell.Mode=Data`, Slot = `_Cell Content`) | 기본 | ✅ Hover / Selected / Highlight 모두 적용 |
| **B. 인라인 편집 — boxed input** (`_Cell.Mode=Data`, Data Slot에 boxed TextInput·Select 등 swap) | **인라인 편집의 기본 패턴** (사용 사례 가장 많음) | ✅ Hover / Selected / Highlight 모두 적용 (boxed input 자체 시각 보존 → 시각 충돌 없음) |
| **C. 인라인 편집 — borderless** (`_Cell.Mode=Edit`, 셀 자체가 인풋 시각) | 대안 케이스 (사용 사례 적음) | ❌ Hover / Selected / Highlight **시각 차단** — 빌더가 Row.Interaction=Rest / Selected=False 고정 운영 |

#### 근거
- Borderless 셀은 *셀 자체가 인풋 시각*. Row bg가 깔리면 텍스트 가독성·border 시각 간섭
- boxed input 셀은 *자체 bg/border 보존*. Row bg와 시각 층 분리

#### 운영 정책
- Figma는 시각 변종 추가 안 함 (매트릭스 변동 0건)
- *룰 명문화로 처리* — Cell.Mode=Edit 사용 시 Row Property 변경 안 함

---

### 6-5. Row 시각 책임 정리

| 책임 | 담당 |
|---|---|
| 행 단위 시각 (Hover/Selected/Disabled/Error/Highlight) | `_Row` 본체 |
| 셀 단위 시각 (Header bg / Edit borderless border 등) | `_Cell` 본체 |
| 체크박스 컨트롤 (Selection 입력) | `_Cell._Leading Element.Type=Checkbox` PSC |
| Drag handle 컨트롤 | `_DnDRow`의 PSC (v1.4 명세) |

> Row와 Cell의 시각 책임은 *층 분리*. 책임 중복·간섭은 §6-4 운영 룰로 우회.

### 6-6. 분리선 책임 (v1.3.2 등재 / v1.3.3 정정 — 세로선 기본 운영화)

| 분리선 | 책임 | 토큰 | 비고 |
|---|---|---|---|
| **행 사이 가로 분리선** | `_Row` / `_HeaderRow` 본체 하단 border | `sys/stroke/neutral/subtle/default` | 두께 `border/width/thin` (1) |
| **Error 행 상하 강조 border** | `_Row.Validation=Error` 상하 border | `sys/stroke/alert/normal/default` | Error 시각 강조 |
| **세로 분리선 (컬럼 사이)** — **기본 운영 (v1.3.3 정정)** | `_Cell` 본체 **우측** stroke (모든 Mode 공통 — Header/Data/Edit) | `sys/stroke/neutral/subtle/default` | `border/width/thin` (1), Inside position |
| **마지막 컬럼 외곽 충돌 해소** | `_Row`/`_HeaderRow` 내부 마지막 `_Cell` 인스턴스에 **stroke right 제거 override** | — | Property 신설 X — 빌더 운영 룰. 컬럼 가변 패턴 정합 |
| **테이블 외곽 border (상·하만)** (v1.5 확정 — 패턴 D, v1.6 Top Line 명문화) | **Table 컨테이너 책임** — 상단은 별도 `Top Line` 1px 레이어 운영 (v1.6) / 하단은 Frame Inside stroke | `sys/stroke/neutral/subtle/default` + `border/width/thin` (1) | 좌·우 외곽 없음 (clean UI). 마지막 _Row 하단 stroke와 동일 토큰이라 시각 1줄. Top Line 레이어로 박는 이유 = Layer Panel 가시성 + B/B'/Headerless 케이스 상단 닫힘 일관 |

> 첫/마지막 행의 외곽 처리: 마지막 `_Row` 하단 border는 그대로 외곽 하단 역할 / 첫 행 상단 + 좌우는 Table 컨테이너 책임.

---

### 6-7. `Table` 컨테이너 컴포넌트 (v1.5 신설 / v1.6 rename — Public Component / v1.7 Property 신설)

#### 컴포넌트 구조

```
Table (컨테이너 컴포넌트, Public — Asset 패널 공개)
├── State (Variant, v1.7 신규)
│   ├── Loaded   ← Body Slot default: 비어있음 (빌더가 _Row × N 채움)
│   ├── Empty    ← Body Slot default: _TableMessage(State=Empty) auto-fill
│   └── Loading  ← Body Slot default: _TableMessage(State=Loading) auto-fill (α 스피너)
│                  └ β 스켈레톤 케이스는 Body Slot instance swap으로 _SkeletonRow × N 명시 교체
├── Show Header (Boolean, v1.7 신규, State와 직교)
│   ├── True     ← Header Slot 노출 (default)
│   └── False    ← Header Slot 숨김 (좌·우 헤더 표 / Headerless 표 케이스)
├── Header Slot (Instance Swap, Show Header=True 시 노출)
│   default: _HeaderRow
│   swap 후보: _ComplexHeaderBlock (다단 헤더, v1.5 헬퍼 미신설 — 디자이너 직접 조립)
└── Body Slot (Auto Layout 가변)
    └── State variant별 default 분기 + 사용자 instance swap override 가능
```

#### Property 매트릭스 — State Variant 3 + Show Header Boolean (v1.7 신규)

`Table`은 v1.5 단일 컴포넌트에서 v1.7 State Variant 신설로 전환. *§10-16 Closed Topic — `Table` variant 없는 단일 컴포넌트* 부분 철회 (트리거 ④ Empty/Loading은 Slot 차원으로 표현 불가).

| Property | Values | 책임 |
|---|---|---|
| **`State`** (Variant) | `Loaded` / `Empty` / `Loading` | Body Slot default content 자동 분기 |
| **`Show Header`** (Boolean) | `True` / `False` | Header Slot visibility 게이트 (직교 Property) |

매트릭스: 3 × 2 = **6 variants** (State와 Show Header 직교)

##### State별 Body Slot default 분기

| State | Body Slot default | 시각 | 사용처 |
|---|---|---|---|
| **Loaded** | (비어있음, 빌더가 `_Row × N` 채움) | 일반 데이터 표 | 데이터 정상 표시 |
| **Empty** | `_TableMessage` (State=Empty) auto-fill | "조회된 데이터가 없습니다" | 검색 결과 없음 / 빈 상태 |
| **Loading (α 스피너)** | `_TableMessage` (State=Loading) auto-fill | spinner + "불러오는 중..." | 빠른 로딩 / 작은 테이블 |
| **Loading (β 스켈레톤)** | Body Slot instance swap → `_SkeletonRow × N` | 회색 placeholder 행 | 큰 테이블 / SSR placeholder / 긴 로딩 |

→ **State enum의 자동 fill은 α 스피너 default**. β 스켈레톤 운영은 *사용자 명시 swap*. AI 학습 친화성 — "Loading 상태 표현해줘" 한 줄 프롬프트에 spinner 자동.

##### Slot · 외곽 정책 (v1.5~v1.6 유지)

| 항목 | 정책 |
|---|---|
| Header Slot | Instance Swap + `Show Header` Boolean 게이트 (default `_HeaderRow`) |
| Body Slot | Auto Layout 가변. State variant별 default content 자동 + 사용자 swap override |
| 외곽 stroke | 상·하 1px `sys/stroke/neutral/subtle/default` · **상단은 `Top Line` 레이어 운영** (v1.6, Frame Inside stroke 대신 — Layer Panel 가시성 + B/B'/Headerless 케이스 상단 닫힘 일관) / 하단은 Frame Inside stroke |
| 좌·우 외곽 | 미운영 (clean UI, 패턴 D) |
| width | Fill (외부 컨테이너 따라감) |

#### 운영 룰 (v1.7 Show Header Property 정합 갱신)

| 케이스 | State | Show Header | Body |
|---|---|---|---|
| **A. 상단 헤더 표** (일반) | Loaded | True (default) | Header Slot=`_HeaderRow` (default) / Body Slot=`_Row` × N |
| **B. 좌측 헤더 표** (비교 표·속성 표) | Loaded | **False** | Header Slot 숨김 / Body Slot=`_Row` × N, *각 행 첫 cell.Mode=Header* (Cell.Mode 혼용) |
| **B'. 우측 헤더 표** (좌측 mirror, v1.6 신규) | Loaded | **False** | Header Slot 숨김 / Body Slot=`_Row` × N, *각 행 마지막 cell.Mode=Header* + Header.Align=Right (Cell.Mode 혼용) |
| **C. 다단 헤더 표** (colspan/rowspan) | Loaded | True | Header Slot=`_ComplexHeaderBlock` Instance Swap (디자이너 직접 조립, v1.5 헬퍼 미신설) / Body Slot=`_Row` × N |
| **D. Headerless 표** | Loaded | **False** | Header Slot 숨김 / Body Slot=`_Row` × N |
| **E. Empty 표** (v1.7) | **Empty** | T or F | Body Slot=`_TableMessage`(State=Empty) auto-fill |
| **F. Loading 표 (α 스피너)** (v1.7) | **Loading** | T or F | Body Slot=`_TableMessage`(State=Loading) auto-fill |
| **F'. Loading 표 (β 스켈레톤)** (v1.7) | **Loading** | T or F | Body Slot instance swap → `_SkeletonRow × N` |

> v1.5/v1.6의 *visibility OFF* 메커니즘은 v1.7에서 **`Show Header` Boolean Property**로 명시화. 빌더 UX 개선 (의미 명시 + AI 학습 친화성).

#### 외곽 stroke 정정 근거 (v1.5)

이전 안건 — *Anna 통찰 (v1.4.x)*: _HeaderRow 상단 + _Row 하단으로 외곽 흡수.

문제 — *좌측 헤더 표 / Headerless 표*에서 *상단 외곽 부재*. Anna 발견 (2026-05-20).

해법 — **Table 컨테이너 책임으로 환원** (방안 5):
- _HeaderRow 상단 stroke 추가 안건 **폐기** (Anna 통찰 부분 철회)
- Table 컨테이너에 상·하 stroke 운영 — 모든 표 케이스 일관 처리

→ 일관 패턴: 상단 헤더 표 / 좌측 헤더 표 / 우측 헤더 표 / 다단 헤더 표 / Headerless 표 모두 **동일 외곽 처리**.

#### 'Top Line' 레이어 운영 근거 (v1.6)

- 이전 `_Cell`/`_Row`는 *상단 stroke를 정의한 적 없음* → Figma 실측에서 Table 맨 위 라인이 누락된 채 운영 중이었음
- v1.5 §6-7 spec은 *Table 컨테이너 책임 (상·하 1px Inside)*으로 이미 환원했으나, Frame Inside stroke는 Layer Panel에 표시되지 않아 *어디서 오는지* 추적 어려움
- v1.6 — 상단을 별도 **`Top Line` 1px 레이어**로 박아 Layer Panel 가시성 확보 + 좌측/우측/Headerless 헤더 케이스 *상단 닫힘 일관* 보장
- 토큰 = `sys/stroke/neutral/subtle/default` 동일 재사용. **신규 토큰 0건**
- 하단 stroke는 Frame Inside 유지 (마지막 `_Row` 하단 stroke와 시각 1줄)

#### 채택 근거 (v1.3.3) — wrapper Frame vs Cell 본체 stroke

| 안 | 노드 수 (20컬럼×100행) | Property 노출 | 컬럼 가변 운영 |
|---|---|---|---|
| wrapper Frame + border 레이어 | ❌ +4000 노드 폭증 | △ 복잡도↑ | △ |
| 인스턴스 override stroke | ✅ 적음 | ✅ | ❌ 컬럼 추가마다 수동 |
| **`_Cell` 본체 우측 stroke (채택)** | ✅ 적음 | ✅ | ✅ 자동 적용 |

#### Edit Mode + 세로 분리선 정합

`_Cell.Mode=Edit`도 **우측 stroke 적용** (v1.3.3 결정). Borderless 정책의 *시각 0*은 *외곽 시각(bg/외곽 stroke/effect)*에 한정 — *컬럼 분리선*은 별도 책임으로 분리. `docs/policy/borderless-policy-spec.md` 정합 검토 필요 (별도 안건 → §10).

---

### 6-8. Body Slot 상태 표현 PSC (v1.7 신규)

Table.Body Slot은 데이터 상태에 따라 *다른 콘텐츠*를 표현. v1.7에서 *Empty / Loading 상태* 표현용 PSC 3종 신설. Figma Variant default 자동 fill + 사용자 instance swap override 가능 구조.

#### 6-8-1. `_TableMessage` — Empty / Loading 메시지 PSC

```
구성:        HORIZONTAL Auto Layout, items-center, justify-center
용도:        Table.State=Empty / Loading 시 Body Slot default 채움
Figma 노드:  595:2582
```

##### Property 매트릭스

| Property | Values | 비고 |
|---|---|---|
| **`State`** (Variant) | `Empty` / `Loading` | Empty = 텍스트 only / Loading = spinner icon + 텍스트 |

매트릭스: **2 variants** (Boolean Property 미운영 — 시각 차이가 State enum으로 흡수됨)

##### 시각 매핑

| State | Leading Icon | Headline 텍스트 |
|---|---|---|
| **Empty** | (icon 없음) | "조회된 데이터가 없습니다" |
| **Loading** | spinner (animated, 16×16) | "불러오는 중..." |

##### 운영 규칙
- min-height: 53 (v1.7 토큰 바인딩 적용 — Anna 2026-05-26 추가)
- 좌측·우측 stroke: `sys/stroke/neutral/subtle/default` + 1px (`_Cell` 우측 stroke 패턴 정합)
- 본 PSC는 *Table 안 Body Slot의 default 채움*용. Table.State=Loading variant에서 *α 스피너 케이스* 담당. *β 스켈레톤 케이스*는 Body Slot을 `_SkeletonRow × N`으로 instance swap (§7-6)

##### Closed Topic 정합
- Boolean Property (Has Leading/Trailing Element) 미운영 — *시각 차이가 State enum으로 흡수되어 Boolean 분기 의미 없음*. *Has Slot Boolean 폐기* 정합

---

#### 6-8-2. `_SkeletonCell` — Skeleton placeholder 셀 PSC

```
구성:        _Cell.Mode=Data 외곽 동형 + 내부 placeholder 1개
용도:        _SkeletonRow의 atomic cell (Variant Property 운영을 위한 atomic 분리)
Figma 노드:  596:2386
```

##### Property 매트릭스

| Property | Values | 비고 |
|---|---|---|
| **`Size`** (Variant) | `md` / `lg` | `_Cell.Size`와 동형. md=height 34 / lg=height 40 |
| **`Placeholder Length`** (Variant) | `Short` / `Medium` / `Long` / `Fill` | 내부 placeholder 너비 결정 (cell 가로폭은 100% Fill 고정) |

매트릭스: 2 × 4 = **8 variants**

##### 시각 매핑

| 항목 | 토큰 / 값 |
|---|---|
| 외곽 width | Fill (Cell 100%) |
| min-height | md=34 / lg=40 (`_Cell` 동일 트랙, 픽셀 hardcoded) |
| padding | `_Cell.Mode=Data` 동형 (§8-0 — md: `spacing/sm`(10) × `spacing/2xs`(6) / lg: `spacing/md`(12) × `spacing/xs`(8)) |
| 우측 stroke | `sys/stroke/neutral/subtle/default` + `border/width/thin` (1) Inside — `_Cell` 패턴 정합 |
| Placeholder height | 16 (hardcoded — 텍스트 1줄 가정) |
| Placeholder bg | `sys/bg/neutral/subtle/default` (#eaeaea) |
| Placeholder radius | `sys/radius/sm` (4) |
| Placeholder width | Property `Placeholder Length` 결정 — Short ≈ 30% / Medium ≈ 60% / Long ≈ 90% / Fill = 100% |

##### 운영 규칙
- *atomic PSC* — 단독 사용 미지원. 항상 `_SkeletonRow` 내부 인스턴스로 사용
- Per-cell Length 결정은 `_SkeletonRow` 인스턴스 안에서 *각 cell instance의 Variant 값 변경*으로 운영 (`_Cell.Mode` 패턴 동형 — instance swap 아님)

---

#### 6-8-3. `_SkeletonRow` — Skeleton placeholder 행 PSC

```
구성:        HORIZONTAL Auto Layout + _SkeletonCell × 15 (visibility 토글)
용도:        Table.State=Loading의 β 스켈레톤 케이스용. Body Slot에 사용자 instance swap으로 N개 배치
Figma 노드:  592:3488
```

##### Property 매트릭스

| Property | Values | 비고 |
|---|---|---|
| (없음) | _SkeletonRow는 Variant 없는 **단일 컴포넌트** | v1.3.4 *Cell.Size는 _Row Property 분리 X* 정합 — Size는 내부 _SkeletonCell × 15 cell instance 단위 결정 |

매트릭스: **0 variants** (단일 컴포넌트, `_Row` 동형)

##### 시각 매핑

| 항목 | 토큰 / 값 |
|---|---|
| width | Fill (Table.Body Slot 폭 따라감) |
| min-height | _SkeletonCell × 15 instance 중 가장 큰 cell height 따라감 (md 시 34, lg 시 40) |
| bg | `sys/bg/neutral/faint/default` (#ffffff) |
| 행 단위 stroke | `border/width/none` (0) — _Cell 우측 stroke만 운영 |
| 내부 _SkeletonCell 개수 | **15개** (visibility 토글 — `_Row` Max Cell 전략 정합) |

##### 운영 규칙 — Max Cell 전략 정합

| 항목 | 정책 |
|---|---|
| 마스터 내부 _SkeletonCell 개수 | **15개** (Hiworks 실사용 최대 컬럼 수 — `_Row` 동일) |
| 컬럼 수 가변 방식 | visibility 토글 — 빌더가 필요한 컬럼만 visible=true |
| 각 _SkeletonCell instance 기본값 | Size=md / Placeholder Length=Fill |
| Cell.Size 일괄 변경 | _Row + _Cell 운영 방식과 동일 — 빌더가 multi-select로 일괄 Size 변경 |
| Per-cell Placeholder Length | 각 cell instance에서 독립적으로 enum 선택 — 서비스별 가변 콘텐츠 길이 표현 |

##### 미운영 항목 (의도적 단순화)
- Mode Property (Data 표현만 — Header/Edit 없음)
- Availability Property (Loading 중 Disabled 무의미)
- _Leading / _Trailing Element (불필요)
- Shimmer animation (v1.8+ 별도 라운드)

##### Closed Topic 정합
- `_Row` Property 매트릭스 변경 0건 — _SkeletonRow는 `_Row`의 *상태 표현 변종*이며 본체 매트릭스에 영향 없음
- `_SkeletonRow` Size Variant 미운영 — *Cell.Size는 _Row Property 분리 X* (v1.3.4 Closed Topic) 정합

---

## 7. 사용 가이드

### 7-1. Mode 선택 기준 + 행 시각 적용

| 케이스 | Cell.Mode | Slot | Row | Row 상태 시각 |
|---|---|---|---|---|
| 헤더 셀 (컬럼명) | Header | _Cell Content 고정 | `_HeaderRow` (단일 컴포넌트, v1.3.1) | Hover는 **셀 책임** — Row variant 없음 |
| 일반 데이터 셀 | Data | Data Slot = _Cell Content | `_Row` | ✅ 전체 적용 |
| **인라인 편집 — boxed input** ⭐ | Data | Data Slot에 boxed 폼 컨트롤 swap | `_Row` | ✅ 전체 적용 (시각 충돌 없음) |
| 인라인 편집 — borderless (대안) | Edit | Edit Slot = Borderless TextInput | `_Row` | ❌ 시각 차단 (§6-4) |
| Drag and Drop 행 | Data | Data Slot = _Cell Content | `_DnDRow` | (v1.4 명세) |

⭐ **인라인 편집의 기본 패턴**: Cell.Mode=Data + boxed input swap. 사용 사례 가장 많음.

### 7-2. Simple Table vs Data Table

분류 기준은 *행 인터랙션 중심성*. 셀의 콘텐츠 종류가 아님.

### 7-3. 인라인 편집 패턴 선택 가이드 (v1.3)

| 패턴 | 사용 | Cell.Mode | 인풋 시각 | 행 상태 시각 |
|---|---|---|---|---|
| **B. boxed input swap** ⭐ 기본 | 사용 사례 가장 많음 | Data | boxed (자체 bg/border) | 적용 OK |
| C. borderless | 대안 — 엑셀시트형 인라인 편집 시 | Edit | borderless (셀이 인풋) | 차단 |

→ 인라인 편집 시 **패턴 B를 우선 고려**. 패턴 C는 *엑셀시트형 셀 자체 편집 UI*가 필요한 경우만.

### 7-4. 좌·우 헤더 표 운영 룰 (v1.5 신설 / v1.6 우측 케이스 보강)

비교 표·속성 표 등 좌측 컬럼이 헤더 역할인 케이스:

```
운영 가이드 (v1.7 Show Header Property 정합):
1. `Table.State` = Loaded
2. `Table.Show Header` = **False** (Header Slot 숨김 — v1.5/1.6의 visibility OFF 메커니즘 대체)
3. `_Row` × N (Body Slot에 추가)
4. 각 행의 **첫 _Cell.Mode = Header** (Cell.Mode 혼용 — §6-4 정합)
5. 첫 cell의 width = Fixed (예: 120px) — 헤더 컬럼 폭 고정
6. 나머지 cells = 기본 Data Mode + width Fill

시각 자동:
- 첫 cell만 brand normal bg (Header 시각, v1.5.2)
- 행 상태 시각 (Hover/Selected 등) = _Row 정합 (정상 발현)
- 외곽 상·하 stroke = Table 컨테이너 책임
```

**Cell 단일 추상화 정합** — 새 컴포넌트 신설 0건. `_Cell.Mode` 혼용으로 모든 케이스 처리.

#### 우측 헤더 표 (B' 케이스, v1.6 신규) — 좌측 mirror

```
운영 가이드 (v1.7 Show Header Property 정합):
1. `Table.State` = Loaded
2. `Table.Show Header` = **False** (Header Slot 숨김 — v1.5/1.6의 visibility OFF 메커니즘 대체)
3. `_Row` × N (Body Slot에 추가)
4. 각 행의 **마지막 _Cell.Mode = Header** (Cell.Mode 혼용 — §6-4 정합)
5. 마지막 cell의 width = Fixed (예: 120px) — 헤더 컬럼 폭 고정
6. 마지막 cell의 Align = **Right** (v1.6 환수 — Header.Align=Right)
7. 나머지 cells = 기본 Data Mode + width Fill

시각 자동:
- 마지막 cell만 brand normal bg (Header 시각, v1.5.2)
- 행 상태 시각 (Hover/Selected 등) = _Row 정합 (정상 발현)
- 외곽 상·하 stroke = Table 컨테이너 책임 (Top Line + 하단 Inside)
```

→ **좌·우 헤더 표는 mirror 관계**. 신규 컴포넌트 0건. `_Cell.Mode` 혼용 + Header.Align Right 환수로 처리.

### 7-5. 다단 헤더 운영 가이드 (v1.5)

colspan/rowspan 병합 헤더 (비교 표·계층 헤더 등):

#### Cell 조립 패턴 (Auto Layout 중첩)

**Colspan (가로 병합)** — 수직 Auto Layout:
```
[Vertical Auto Layout]
├── _Cell (Mode=Header, width: Fill)         ← 상위 헤더
└── [Horizontal Auto Layout]
    ├── _Cell (Mode=Header, width: Fill)     ← 하위 1
    ├── _Cell (Mode=Header, width: Fill)     ← 하위 2
    └── _Cell (Mode=Header, width: Fill)     ← 하위 3
```

**Rowspan (세로 병합)** — 수평 Auto Layout:
```
[Horizontal Auto Layout]
├── _Cell (Mode=Header, height: Fill)        ← 좌측 병합 (세로 Fill)
└── [Vertical Auto Layout]
    ├── _Cell (Mode=Header, width: Fill)     ← 우측 상
    └── _Cell (Mode=Header, width: Fill)     ← 우측 하
```

#### 운영 정책

- **`_ComplexHeaderBlock` 헬퍼 컴포넌트 = v1.5 미신설** (Anna 결정 R안)
- 디자이너가 *Cell 직접 조립* (위 패턴 가이드 사용)
- `Table.Header Slot`에 **Instance Swap**으로 끼워 넣음
- 향후 *자주 쓰이는 패턴* 발견 시 헬퍼 컴포넌트 사후 신설 검토

→ Cell atomic 단일 추상화 정합. 새 컴포넌트 추가 0건.

### 7-6. Table.State 사용 가이드 (v1.7 신설)

데이터 상태별 Table.State 선택 결정 기준:

| 상태 | Table.State | Body Slot 자동 채움 | 사용 시점 |
|---|---|---|---|
| 데이터 정상 표시 | **`Loaded`** | (빌더가 `_Row × N` 채움) | API 응답 성공 후, 빈 배열이 아닐 때 |
| 빈 결과 | **`Empty`** | `_TableMessage` (State=Empty) | API 응답 성공이나 결과가 0건 / 검색 결과 없음 |
| 로딩 중 (α 스피너) | **`Loading`** | `_TableMessage` (State=Loading, spinner) | API 호출 진행 중 / 빠른 로딩 예상 / 작은 테이블 |
| 로딩 중 (β 스켈레톤) | **`Loading`** + Body Slot swap | `_SkeletonRow × N` 명시 교체 | 큰 테이블 / SSR placeholder / 긴 로딩 예상 / 데이터 형태 미리 보여주기 |

#### Loading α vs β 선택 기준

| 선택 | 기준 |
|---|---|
| **α 스피너** (default) | 짧은 로딩(<1초), 작은 테이블, 데이터 형태 추정 불요 |
| **β 스켈레톤** | 긴 로딩(>1초), 큰 테이블, 페이지 초기 SSR placeholder, 사용자가 데이터 형태를 미리 인지할 때 시각 안정감 필요 |

#### AI / 코드 매핑 가이드

```ts
// 의사 코드 — 데이터 fetch 상태와 Table.State 매핑
const tableState =
  isLoading ? "Loading" :
  data.length === 0 ? "Empty" :
  "Loaded";

// β 스켈레톤이 필요한 경우 (큰 테이블 등)
if (isLoading && shouldUseSkeleton) {
  // Body Slot을 _SkeletonRow × N으로 swap
}
```

→ Table.State 단일 Property로 *데이터 상태와 시각 1:1 매핑*. AI 학습 친화성 + 빌더 UX 단순화.

#### Show Header (v1.7) — State와 직교

Show Header는 *Header 노출 여부* 결정 — State와 무관하게 독립 결정:
- A 케이스(상단 헤더 표): Show Header=True (default)
- B/B' 케이스(좌·우 헤더 표): Show Header=False (첫/마지막 cell이 Header 역할)
- D 케이스(Headerless 표): Show Header=False

State와 Show Header를 *직교 운영*하면 6 variants가 모든 케이스 커버.

---

## 8. 토큰 매핑 (v1.2 본격 등재 — 2026-05-19)

### 8-0. 단일 책임 패턴 — **Size가 패딩의 단일 결정자**

Align(Left/Center/Right)은 *content 정렬*만 결정. Padding은 **Size로만 변별**.

| Size | px | py | gap (Auto Layout) |
|---|---|---|---|
| **md** | `spacing/sm` (10) | `spacing/2xs` (6) | `spacing/xs` (8) |
| **lg** | `spacing/md` (12) | `spacing/xs` (8) | `spacing/sm` (10) |

→ Header / Data Cell 본체 패딩 + Edit Slot 내부 Input Area 패딩 모두 동일 패턴 정합.

### 8-1. `_Cell` 본체 매핑 (Office Brand)

| Mode·Interaction·State | bg | stroke | min-height※ | padding | inner gap |
|---|---|---|---|---|---|
| **Header · Rest** (v1.8 정정) | `office/bg/brand/subtle/default` (#e6eff9) | — | 34(md)/40(lg) | §8-0 (md/lg) | `spacing/3xs` (4) |
| **Header · Hover** (v1.8 정정) | `office/bg/brand/subtle/active` (#d7ebfc) | — | 동일 | 동일 | 동일 |
| **Data · Rest** | — | — | 동일 | 동일 | 동일 |
| **Edit · En · Rest** | — | — | 동일 | 0 (Slot 책임) | 동일 |
| **Edit · En · Hover · None** | — | `stroke/neutral/subtle/active` | 동일 | 0 | 동일 |
| **Edit · En · Pressed · None** ⭐ | — | `office/stroke/brand/normal/default` (service) | 동일 | 0 | 동일 |
| **Edit · En · Hover · Error** | — | `stroke/alert/normal/default` | 동일 | 0 | 동일 |
| **Edit · Disabled · Rest** | `bg/neutral/subtle/disabled` + `sys/elevation/none` | — | 동일 | 0 | 동일 |
| **Edit · ReadOnly · Rest** | `bg/neutral/subtle/disabled` | — | 동일 | 0 | 동일 |

공통 토큰: `border/width/thin` (1) · `radius/none` (0)

**우측 stroke (v1.3.3 추가)** — 모든 Mode 공통 (Header / Data / Edit):
- 토큰: `sys/stroke/neutral/subtle/default`
- 두께: `border/width/thin` (1)
- Position: Inside
- 책임: 컬럼 사이 세로 분리선 (Row family 차원에서 마지막 컬럼만 override 제거)

※ **min-height(34/40)는 토큰 미바인딩 — 픽셀 hardcoded 유지**. 토큰화 여부는 v1.3 별도 안건 (정책방 영향 평가 필요).

### 8-2. `_Cell Content` 매핑 (Mode 무관, Weight default + Availability v1.3.5)

#### Availability=Enabled (기본)

| 사용처 | Weight | typography 토큰 | text color |
|---|---|---|---|
| Header (default SemiBold) | SemiBold | `sys/typo/label/md/semibold` (14/600/18) | `sys/text/neutral/normal/default` |
| Data (default Regular) | Regular | `sys/typo/body/md/regular` (14/400/21) | `sys/text/neutral/normal/default` |
| Data 강조 (자유 선택) | SemiBold | `sys/typo/label/md/semibold` | `sys/text/neutral/normal/default` |

#### Availability=Disabled (v1.3.5)

| Data Format | text color | nested 컴포넌트 |
|---|---|---|
| Text / Number (Regular·SemiBold) | `sys/text/neutral/normal/disabled` (#aeaeae) | — |
| Avatar+Text (Regular·SemiBold) | `sys/text/neutral/normal/disabled` | Avatar 컴포넌트 자체 Availability=Disabled override |
| Badge (Regular·SemiBold) | (Badge 자체 시각) | Badge 컴포넌트 자체 Availability=Disabled override |

**신규 토큰 0건** — 기존 sys-tokens.json의 `sys/text/neutral/normal/disabled` 활용.

### 8-3. Edit Slot 기본값 = TextInput (Instance Swap 자유)

Cell.Size에 따라 TextInput height·padding 자동 정합 (§8-0 패턴 동일):

| Cell.Size | Slot TextInput height | Input Area padding | gap | InputContent (실 텍스트) |
|---|---|---|---|---|
| md | 34 | `px=spacing/sm(10)` | `spacing/xs(8)` | `sys/typo/body/md/regular` (14px) |
| lg | 40 | `px=spacing/md(12)` | `spacing/sm(10)` | `sys/typo/body/md/regular` (14px) |

Placeholder color: `text/neutral/muted/default` · Text color: `text/neutral/normal/default`.

Align(Left/Right)에 따른 padding 비대칭 **해소** (Anna 2026-05-19 재정렬).

### 8-4. 무결성 검사 (4항목)

| 항목 | 결과 |
|---|---|
| Global 팔레트 직접 사용 | ✅ 0건 |
| 계층 건너뜀 (Sys→Raw, Service→Global) | ✅ 0건 |
| 역방향 참조 (Sys→Service) | ✅ 0건 — brand intent 모두 `office/*` (service) |
| 옛 용어 잔존 (Editing/Active/Locked 등) | ✅ 0건 |

### 8-5. 신규 토큰 — **0건**

기존 sys/service 토큰만으로 정의 충족. 추가 등재·tokens/*.json 변경 없음.

### 8-6. `_Row` 본체 토큰 매핑 (v1.3.6 본격 등재)

#### Enabled 16 variants 시각 매핑

| Property 조합 | bg | stroke (상하 border) | 비고 |
|---|---|---|---|
| **Rest 기본 (Validation=None, Selected=F, Highlight=F)** | — (transparent) | — | 행 분리선 sys/stroke/neutral/subtle/default |
| **Hover** | `sys/bg/neutral/faint/active` (#f7f7f7) | — | Hover=Active 통합 정책 |
| **Highlight=True** | `sys/bg/highlight/subtle/default` (#fffbed) | — | v1.3.6 신규 토큰 |
| **Highlight=True · Hover** | `sys/bg/highlight/subtle/active` (#fff7dc) | — | v1.3.6 신규 토큰 |
| **Selected=True (Rest)** (v1.8 정정) | `office/bg/brand/faint/default` (#f6fbfe) | — | **brand faint 카테고리로 하향** (v1.5.1 `subtle/default` #e6eff9 → `faint/default`). Header가 subtle로 옅어지면서 *위계(Header>Selected) 유지* 위해 Selected도 한 칸 하향. 카테고리 내 default/active 진행 유지 |
| **Selected=True · Hover** (v1.8 정정) | `office/bg/brand/faint/active` (#ecf7fe) | — | **brand faint 카테고리 내 `.default → .active` 1:1 진행** — Selected.Rest(#f6fbfe) → Selected.Hover(#ecf7fe). v1.5.1 `subtle/active`(#d7ebfc)에서 하향. ⚠️ faint는 near-white라 선택 신호 약화 가능 — 사후 시각 검수 권고 |
| **Validation=Error** | `sys/bg/alert/subtle/default` (#fbeded) | — | 합의 §8-7 *border 표현* → **bg 표현으로 정정** (Figma 실측 정합) |
| **Error · Hover** | `sys/bg/alert/subtle/active` (#f7d7d7) | — | v1.3.6 신규 토큰 |

#### Disabled 1 variant 시각 매핑

| Property | bg | text | 비고 |
|---|---|---|---|
| Availability=Disabled (Validation/Selected/Highlight/Interaction 무관) | `sys/bg/neutral/faint/disabled` (#eaeaea) | _Cell Content.Availability=Disabled 자동 전파 (v1.3.5) | Disabled가 모든 시각 흡수 |

#### v1.3.6 신규 sys 토큰 (Hiworks-DS-Guide Part 8 동기 등재)

| 토큰 | 값 | 용도 |
|---|---|---|
| `sys/bg/positive/subtle/active` | `{global.color.green.95}` (#dbf0da) | Hover=Active 공유 (positive subtle 활성) |
| `sys/bg/warning/subtle/active` | `{global.color.orange.95}` (#fde5cd) | Hover=Active 공유 (warning subtle 활성) |
| `sys/bg/informative/subtle/active` | `{global.color.blue.95}` (#c8def3) | Hover=Active 공유 (informative subtle 활성) |
| `sys/bg/alert/subtle/active` | `{global.color.red.95}` (#f7d7d7) | Row.Error.Hover 등 |
| `sys/bg/highlight/subtle/default` | `{global.color.yellow.100}` (#fffbed) | **신규 카테고리 highlight** — Row.Highlight=True |
| `sys/bg/highlight/subtle/active` | `{global.color.yellow.95}` (#fff7dc) | Row.Highlight=True.Hover |

**참조 레이어**: 모두 sys (brand 무관 시멘틱 카테고리)

#### v1.5.1 service 토큰 영향 (2026-05-21 정합 동기화)

| 토큰 | 변경 | Selected.Rest/Hover 시각 변동 |
|---|---|---|
| `office/bg/brand/subtle/default` | (불변) `{global.color.blue.100}` (#e6eff9) | Selected.Rest 신규 점유 (v1.3.6 neutral.faint.active #f7f7f7 → brand.subtle.default #e6eff9) |
| `office/bg/brand/subtle/active` | **값 재정렬** — blue.95 (#c8def3) → **light_blue.80 (#d7ebfc)** | Selected.Hover 시각 한 톤 옅어짐. *시각 변별 미세화* — Figma 빌드 후 시각 검수 권고 |

**참조 레이어**: service (Office brand 변종 — 정책 명분 원칙 #1 정합)
**근거**: 2026-05-21 *Hover=Active 통합 정책의 *.active 슬롯 룰 명문화* 정책방 결정. LNB Hover의 *.faint emphasis 분리*와 동시 산출.

> **v1.8 갱신 (2026-06-01)**: 위 v1.5.1 표는 *당시* 점유 기록. v1.8에서 Header가 `subtle/*` 슬롯으로 복귀하고 Selected는 `faint/*`로 하향 → **슬롯 점유 주체 변경**: `subtle/default`·`subtle/active` = Selected → **Header**, `faint/default`·`faint/active` = (미사용) → **Selected**. `subtle/active`(#d7ebfc) 값은 불변(여전히 light_blue.80, DnD DragOver·LNB와 공유). **토큰 값 변경 0건** — 매핑 재배치만.

### 8-7. Row family 분리선 토큰 매핑 (v1.3.2 등재 / v1.3.3 정정 — 세로 분리선 기본 운영화)

| 분리선 | 토큰 | 두께 | 적용 위치 |
|---|---|---|---|
| `_Row` 하단 (기본 행 분리선) | `sys/stroke/neutral/subtle/default` | `border/width/thin` (1) | bottom border |
| `_HeaderRow` 하단 (헤더 하단 분리선) | `sys/stroke/neutral/subtle/default` | `border/width/thin` (1) | bottom border (Row와 동일 톤, 통일감) |
| `_Row.Validation=Error` bg 강조 (v1.3.6 정정) | `sys/bg/alert/subtle/default` (default) / `sys/bg/alert/subtle/active` (Hover) | — | bg fill (border 미운영 — Figma 실측 정합) |
| **세로 분리선 (기본 운영, v1.3.3)** | `sys/stroke/neutral/subtle/default` | `border/width/thin` (1) | `_Cell` 본체 **우측** stroke (모든 Mode 공통) — Inside |
| **마지막 컬럼 stroke 제거** | — | — | `_Row`/`_HeaderRow` 내부 마지막 `_Cell` 인스턴스 stroke right override 제거 (빌더 운영 룰) |
| **`Table` 외곽 상·하 stroke (v1.5 / v1.6 Top Line 명문화)** | `sys/stroke/neutral/subtle/default` | `border/width/thin` (1) | 상단 = 별도 `Top Line` 1px 레이어 (v1.6) · 하단 = Frame Inside stroke. 모든 표 케이스 일관 처리 |

**신규 토큰 0건** — 기존 sys 토큰만으로 충족.

**외곽 border**: Table 컨테이너 책임 (Row family 책임 외, v1.5+ 명세).

### 8-8. `Table` 컨테이너 토큰 매핑 (v1.5 신설 / v1.6 Top Line 명문화)

| Slot | 토큰 |
|---|---|
| 외곽 stroke (top) | `sys/stroke/neutral/subtle/default` (별도 `Top Line` 1px 레이어, v1.6 — Layer Panel 가시성) |
| 외곽 stroke (bottom) | `sys/stroke/neutral/subtle/default` (Frame Inside, 1px) |
| 외곽 stroke (left·right) | — (미운영, clean UI) |
| Header Slot bg | (default `_HeaderRow` 자체 시각) |
| Body Slot bg | (default `_Row` 자체 시각) |
| width | Fill (외부 컨테이너 따라감) |

**신규 토큰 0건** — 기존 `sys/stroke/neutral/subtle/default` 재사용 (행 분리선과 동일 톤, 시각 1줄 흡수).

### 8-9. v1.7 신규 PSC 토큰 매핑 (2026-05-26 등재)

#### `_TableMessage` 매핑

| 항목 | 토큰 | 값 |
|---|---|---|
| bg | `sys/bg/neutral/faint/default` | #ffffff |
| 좌·우 stroke | `sys/stroke/neutral/subtle/default` + `border/width/thin` (1) Inside | #d6d6d6 |
| headline color | `sys/text/neutral/muted/default` | #909090 |
| headline typo | `sys/typo/body/md/regular` | 14/400/21 |
| Leading icon (Loading variant only) | `sys/icon/neutral/faint/default` | #aeaeae |
| Leading icon size | 16 (hardcoded) | — |
| padding | px=`sys/spacing/sm` (10) / py=`sys/spacing/lg` (16) | — |
| gap (icon ↔ text) | `sys/spacing/xs` (8) | — |
| min-height | 53 (v1.7 토큰 바인딩 적용 — Anna 2026-05-26 추가) | — |

#### `_SkeletonCell` 매핑

| 항목 | 토큰 | 값 |
|---|---|---|
| 외곽 bg | (transparent) | — |
| 우측 stroke | `sys/stroke/neutral/subtle/default` + `border/width/thin` (1) Inside | #d6d6d6 |
| padding | `_Cell.Mode=Data` 동형 §8-0 (md: px `spacing/sm` × py `spacing/2xs` / lg: px `spacing/md` × py `spacing/xs`) | — |
| min-height (Size=md) | 34 (hardcoded — `_Cell` 트랙 정합) | — |
| min-height (Size=lg) | 40 (hardcoded — `_Cell` 트랙 정합) | — |
| Placeholder bg | `sys/bg/neutral/subtle/default` | #eaeaea |
| Placeholder radius | `sys/radius/sm` | 4 |
| Placeholder height | 16 (hardcoded — 텍스트 1줄 가정) | — |
| Placeholder width | Property `Placeholder Length` 결정 (Short / Medium / Long / Fill) | — |

#### `_SkeletonRow` 매핑

| 항목 | 토큰 | 값 |
|---|---|---|
| bg | `sys/bg/neutral/faint/default` | #ffffff |
| 행 단위 stroke | `border/width/none` (0) | — |
| 내부 cell stroke | (각 `_SkeletonCell` 우측 stroke가 분리선 담당) | — |
| 내부 cell 개수 | 15 (visibility 토글) | — |
| 단일 컴포넌트 — Variant 0개 | `_Row` Cell.Size cell-level 결정 패턴 정합 (v1.3.4) | — |

#### 무결성 검사 (v1.7)

| 항목 | 결과 |
|---|---|
| Global 팔레트 직접 사용 | ✅ 0건 |
| 계층 건너뜀 | ✅ 0건 |
| 역방향 참조 | ✅ 0건 |
| 옛 용어 잔존 (Active / Default / Has Slot 등) | ✅ 0건 |
| **신규 sys/* 토큰 등재 필요** | ✅ **0건** — 모두 기존 토큰만 사용 |

> v1.7 모든 토큰은 v1.6 이전에 이미 등재된 기존 sys/* 토큰. tokens/*.json 파일 변경 0건.

---

## 9. 결정 이력

| 버전 | 날짜 | 내용 | 상태 |
|---|---|---|---|
| v0.1~v0.11 | 2026-05-14~05-18 | archive 격리 | ⚪ Superseded |
| v1.0 | 2026-05-18 | 봉인 — Role/Data Cell/Slot 단일 추상화 + Editing enum | ⚪ Superseded |
| v1.1 | 2026-05-18 | 정정 — Mode rename / Slot 2개 분리 / Size md/lg / Data Cell 폐기 | ⚪ Superseded (v1.1.1로 정정) |
| v1.1.1 | 2026-05-18 | 정정 — Editing → **Pressed** rename / Edit Mode _Leading/_Trailing 비활성 / Header Align Left 추가 / Validation Hover 매트릭스 | ⚪ Superseded (v1.2로 진전) |
| v1.1.1+ | 2026-05-19 | 표기 정정 — `docs/policy/borderless-policy-spec.md` 인지 누락 발견. 정책 내용 변경 0건, 표기만 *신설* → *인용·정합 등재* | ⚪ Superseded (v1.2로 진전) |
| v1.2 | 2026-05-19 | 본격 등재 — 토큰 매핑 §8 + 패딩 Size 단일 책임 패턴 + Edit Slot Left/Right 비대칭 해소 + Header/Data px 토큰 재정렬 (xs→sm, sm→md) | 🟢 Active (Cell 정책) |
| v1.3 | 2026-05-19 | Row family 매트릭스 명문화 — `_Row`/`_HeaderRow`/`_DnDRow` 분리 + 6상태 4축 분해 + 시각 우선순위 패턴 + Cell.Mode 혼용 운영 룰 | 🟢 Active (부분 정정 v1.3.1) |
| v1.3.1 | 2026-05-19 | 정정 — `_HeaderRow` Property variant 제거 (단일 컴포넌트). Hover는 Cell.Mode=Header가 셀 단위로 책임 (Row 차원 중복 회피) | 🟢 Active (Row 정책) |
| v1.3.2 | 2026-05-19 | 보강 — Row family 분리선 토큰 매핑 (§6-6 / §8-7). 가로 행 분리선 `sys/stroke/neutral/subtle/default`. 세로 분리선 대기 슬롯. 외곽 = Table 컨테이너 책임 명문화 | ⚪ Superseded (v1.3.3 — 세로선 기본 운영화) |
| v1.3.3 | 2026-05-19 | 정정 — 세로 분리선 기본 운영화. `_Cell` 본체 모든 Mode 우측 1px stroke. 마지막 컬럼 = 인스턴스 override. wrapper Frame 패턴 폐기 | 🟢 Active (Row+Cell 정책) |
| v1.3.4 | 2026-05-19 | 등재 — Max Cell 전략. `_Row` 마스터 안에 15개 `_Cell` + visibility 토글. 기본값 Mode=Data/Size=md/Align=Left. width Fill. Nested Expose OFF. Cell.Size는 _Row Property 분리 X | 🟢 Active (Row 운영 정책) |
| v1.3.5 | 2026-05-19 | 등재 — `_Cell Content.Availability: Enabled/Disabled` Property 신설. Disabled 시각 매핑. 3단계 자동 전파 운영. variants 8 → 16. 신규 토큰 0건 | 🟢 Active (Cell Content 정책) |
| v1.3.6 | 2026-05-19 | 정정 + 본격 등재. _Row 32 → 17 + Error/Selected/Highlight 매핑 + sys 토큰 6건 신설 | ⚪ Superseded (v1.5.1 — Selected.Rest neutral 합의 폐기) |
| v1.3.7 | 2026-05-19 | 정정 — Selected.Hover = brand 강조. Hover=Active 통합 정책의 Selected 한정 변종 패턴 신규 | ⚪ Superseded (v1.5.1 — 변종 패턴 폐기, 카테고리 내 1:1 통일) |
| v1.4 | 2026-05-20 | 등재 — `_DnDRow` Property 매트릭스 본격 명세. DnDMode + DragState = 4 variants | 🟢 Active (_DnDRow 매트릭스) |
| v1.4.1 | 2026-05-20 | 정정+등재 — _DnDRow 시각 매핑 + opacity/overlay 카테고리 신설 + 신규 토큰 4건 | 🟢 Active (_DnDRow 시각 매핑) |
| v1.4.2 | 2026-05-20 | 보강 — 체크박스 cell 운영 패턴 명문화 | 🟢 Active (Max Cell 운영 정책) |
| **v1.5** | **2026-05-20** | **등재 — `_Table` 컨테이너 컴포넌트 신설 (Header Slot Optional + Body Slot Auto Layout 가변). 좌측 헤더 표 운영 룰 (§7-4) + 다단 헤더 운영 가이드 (§7-5, Cell 조립 패턴). 외곽 책임 환원 — Anna 통찰(v1.4.x _HeaderRow 상단 stroke) 부분 철회 → Table 컨테이너 책임. `_ComplexHeaderBlock` 헬퍼 미신설(R안). 신규 토큰 0건** | ⚪ Superseded by v1.6 (Table rename) |
| **v1.5.1** | **2026-05-21** | **토큰 매핑 정합 정정** — Selected.Rest/Hover 매핑 brand subtle 카테고리 통일 (v1.3.6 neutral 합의 + v1.3.7 변종 패턴 폐기). `office/bg/brand/subtle/active` 값 light_blue.80 재정렬. §8-6 v1.5.1 service 토큰 영향 표 + §10-0a 안건 4건 등재. 재개 트리거 ② (Figma 실측 충돌). | ⚪ Superseded by v1.6 (Table rename) |
| **v1.5.2** | **2026-05-21** | **정정 등재** — Cell.Mode=Header bg 카테고리 이동 (`brand/subtle/*` → `brand/normal/*`, Selected.Rest와 시각 위계 차등) + §6-3 hex 표기 오타 정정 (#d8e9fb → #d7ebfc) + Anna Figma 정정 잔존 3건 완료 등재 (_Row 일반 Hover drift 해소 / _HeaderRow 하단 border 신설 / _DnDRow Inactive bg 일반행 정합). 신규 토큰 0건. 재개 트리거 ② (Figma 실측 정합). | ⚪ Superseded by v1.6 (Table rename) |
| **v1.6** | **2026-05-21** | **등재 — `_Table` → `Table` rename 정합 정정 (policy v3.4 Part 4 명명 룰 적용 누락 정정, PSC들은 `_` 접두 유지) + `Top Line` 레이어 운영 명문화 (§6-7, Frame Inside stroke 대신 별도 1px Line 레이어) + B' 우측 헤더 표 케이스 신규 (§7-4, 좌측 mirror) + Header.Align=Right 환수 (§3-2, *Header Right 미운영* 부분 철회). 신규 토큰 0건. 재개 트리거 ② (Figma 실측 상단 닫힘 누락) + ④ (B' 새 표현)** | 🟢 **Active (전체 정합)** |
| **v1.7** | **2026-05-26** | **등재 — Table.State Variant 신설 (Loaded/Empty/Loading 3축, *Table variant 없는 단일 컴포넌트* Closed Topic 부분 철회) + Show Header Boolean 신설 (State와 직교) + `_TableMessage` PSC 신설 (State=Empty/Loading 2 variants) + `_SkeletonCell` PSC 신설 (Size × Length = 8 variants) + `_SkeletonRow` PSC 신설 (`_Row` 동형 단일 컴포넌트, Cell.Size cell-level 정합) + Loading α 스피너 default · β 스켈레톤 사용자 swap. min-height 토큰 바인딩 (Anna 추가). 신규 sys/* 토큰 0건. 재개 트리거 ④ (새 컴포넌트 표현 — Empty/Loading Slot 차원 불가)** | 🟢 **Active (Table family 상태 표현 완성)** |
| **v1.8** | **2026-06-01** | **정정 — 실적용 색 과진 피드백(재개 트리거 ②). Header bg 한 칸 옅게 `office/bg/brand/normal/*`(#d8e9fb/#badbf8) → `office/bg/brand/subtle/*`(#e6eff9/#d7ebfc), 위계(Header>Selected) 유지 위해 Selected bg `office/bg/brand/subtle/*`(#e6eff9/#d7ebfc) → `office/bg/brand/faint/*`(#f6fbfe/#ecf7fe) 동반 하향. 위계 순서·원리 불변·brand emphasis 슬롯만 재레벨. v1.5.1(Selected)·v1.5.2(Header) 슬롯 결정 supersede. §8-1/§8-6/§10-0e/Drift 갱신. 신규 토큰 0건. ⚠️ Selected=faint near-white 사후 시각 검수** | 🟢 **Active (매핑 최신)** |

### 9-1. v1.1.1이 v1.1과 다른 4건

1. **Cell.Interaction: Editing → Pressed rename** — Mode=Edit이 *모드 책임*을 가지므로 Interaction은 *순수 인터랙션*만. 외부 인풋 컴포넌트와 동일 명칭. v1.0의 LNB 패턴 적용 *부분 철회* (Cell의 Edit Mode에 한정)
2. **Edit Mode에서 _Leading/_Trailing 비활성** — Edit Slot의 Input 컴포넌트가 자체 leading/trailing 처리. Cell의 PSC는 Header·Data 한정 운영
3. **Header Align에 Left 추가** — Center + Left (Right 미운영). 컬럼명 좌측 정렬 케이스 흡수
4. **Validation=Error의 Interaction 매트릭스 정정** — Hover에서 운영 (v1.1의 Editing→Pressed에서 운영 안 함)

### 9-2. v1.1.1에서 살아남은 결정 (v1.2에서도 유지)

- Mode enum (Header/Data/Edit) + Mode-Interaction 책임 분리
- Data Slot + Edit Slot 2개 분리 + Mode-Slot 활성 제어
- Size md/lg (외부 시멘틱 정합)
- Cell.Interaction Pressed (Edit Mode 한정) — v1.1.1 환원
- Edit Mode _Leading/_Trailing 비활성 (Header/Data만 운영)
- Header Align Left + Center
- Validation=Error Hover 매트릭스
- Data Cell 래핑 폐기 (Row만 유지)
- Weight 권장 default + 자유 선택
- Data Format 4종 (Text/Number/Avatar+Text/Badge)
- Service Component 분류 + Data Display 카테고리
- Borderless 시각 0 정책 정합 (Edit Mode + Slot 책임 분담)

### 9-3. v1.2가 v1.1.1+와 다른 3건 (Anna 재정렬 2026-05-19)

1. **Header/Data Cell 본체 px 토큰 재정렬** — md: `xs(8)→sm(10)`, lg: `sm(10)→md(12)`. 일관 패턴 확립
2. **Edit Slot Input Area Left/Right 비대칭 해소** — md/lg 모두 단일 variant로 통합 (md=Input Area 5291/5305/5333, lg=5389/5403). Align은 padding 변별 X
3. **Size 단일 책임 패턴 신설** — Align은 *content 정렬*만, Padding은 *Size*만 결정 (§8-0)

### 9-4. v1.3 신규 (Row family 명문화, 2026-05-19)

본 v1.3는 *Row family 명문화* — Cell 정책은 v1.2 그대로 유지. **비파괴적 확장**.

1. **Row family 3 컴포넌트 분리** — `_Row` (일반 데이터 행) / `_HeaderRow` (헤더 전용) / `_DnDRow` (DnD 전용). 컴포넌트 명명 underscore 패턴 정합 (`_Cell` 베이스 동형)
2. **`_Row` 6상태 → 4축 직교 분해** — Availability/Validation/Selected/Highlight/Interaction. 32 variants. 시각 우선순위로 단순화 (Disabled > Error > Selected > Highlight > Hover > Rest)
3. **`Selected: True/False` 채택** — LNB Nav Item 정합. Drift Log의 `Selection` rename은 Checkbox 계열 한정 (Indeterminate 등장 케이스). Row는 영구 선택 패턴 → Selected Boolean
4. **Row.Validation=Error vs Cell.Validation=Error 책임 분리** — 동일 enum 이름, 책임 다름 (Row=행 invalid, Cell=셀 인풋 검증 실패)
5. **Cell.Mode 혼용 운영 룰** — boxed input swap 행은 시각 OK / borderless 행은 시각 차단. *룰 명문화로 처리* (Figma 변종 0건)
6. **`_HeaderRow` 분리 근거 명문화** — 상태 매트릭스 불일치 + Cell.Mode=Header 고정 강제
7. **`_DnDRow` 분리 결정** — Property 추가 시 매트릭스 폭증 회피. 매트릭스 명세는 v1.4 후속

### 9-5. v1.3.1 정정 (2026-05-19, 비파괴)

1. **`_HeaderRow` Property variant 제거** — 2 variants(Interaction Rest/Hover) → **0 variants** (단일 컴포넌트). 근거: Hover 시각은 `_Cell.Mode=Header.Interaction=Hover`가 셀 단위로 처리 — Row 차원 Hover variant는 *시각 중복*
2. **`_HeaderRow` 책임 재정의** — ①Cell.Mode=Header 강제 (빌더 UX 보호) ②행 하단 border (분리선). Property 변별 없음
3. **v1.3 등재본의 Hover variant 결정 부분 철회** — *분리 근거 자체는 유지* (상태 매트릭스 불일치 + Mode 고정 강제). Property 매트릭스만 0개로 정정

### 9-6. v1.3.2 보강 (2026-05-19, 비파괴)

1. **Row family 분리선 토큰 매핑 등재** — §6-6 분리선 책임 표 + §8-7 토큰 매핑. 신규 토큰 0건
2. **가로 행 분리선** — `_Row` / `_HeaderRow` 본체 하단 `sys/stroke/neutral/subtle/default` + `border/width/thin`. Header 하단도 동일 톤 (brand 톤 X — 통일감)
3. **Error 강조 border** — `_Row.Validation=Error` 상하 `sys/stroke/alert/normal/default`
4. **세로 분리선 대기 슬롯** — 기본 미사용 (Cell padding이 시각 분리). 특수 케이스 시 `_Cell` 본체 **우측** border (방향 표준). Property 신설 안 함
5. **외곽 border = Table 컨테이너 책임 명문화** — Row family는 *행 사이 분리선*만 책임. 최외곽(좌/우/상단/하단)은 *Table 컴포넌트 명세 시 결정* (v1.5+)

### 9-7. v1.3.3 정정 (2026-05-19, 비파괴)

세로 분리선 운영 정책 정정. **컬럼 가변 패턴 정합 + 노드 수 폭증 회피**.

1. **세로 분리선 = 기본 운영화** — v1.3.2 *기본 미사용 + 대기 슬롯* 결정 폐기. clean UI 트렌드 우선이 아닌 *Hiworks 사용 패턴 우선* (Anna 결정)
2. **`_Cell` 본체에 우측 1px stroke 추가** — 모든 Mode 공통 (Header/Data/Edit). 토큰 `sys/stroke/neutral/subtle/default`, Inside position
3. **마지막 컬럼 처리 = 인스턴스 override** — `_Row`/`_HeaderRow` 안에서 마지막 `_Cell` 인스턴스 stroke right 제거. Property 신설 X (매트릭스 폭증 회피)
4. **wrapper Frame + border 레이어 패턴 폐기** — Anna 첫 셋팅(`Cell` 슬롯 wrapper + `border` 레이어) 검토 후 폐기. 근거: ①노드 수 폭증 (20컬럼×100행 = +4000 노드) ②Property 노출 복잡도 증가
5. **인스턴스 override 방식 폐기** — 컬럼 가변 시 추가 _Cell마다 수동 stroke 적용 부담 → `_Cell` 본체에 박는 방식이 운영 단순
6. **Edit Mode도 우측 stroke 적용** — Borderless 정책 spec 정합 검토 필요 (§10 안건). Borderless = *외곽 시각 0*에 한정, *컬럼 분리선*은 별도 책임으로 분리

### 9-8. v1.3.4 등재 (2026-05-19, 신규 운영 정책)

`_Row` 마스터 운영 정책 명문화. **Property 매트릭스 변경 0건** — v1.3 32 variants 그대로.

1. **Max Cell 전략 채택** — `_Row` 마스터 안에 **15개** `_Cell` 미리 박음 (Hiworks 실사용 최대 컬럼 수 기준). 컴포넌트 1개로 모든 컬럼 수 케이스 커버
2. **컬럼 수 가변 = visibility 토글** — v1.3.3의 *컬럼 가변* 결정 구체화. 빌더는 필요한 컬럼만 visible=true
3. **width = 모든 cell Fill 기본** — Auto Layout 균등 분배. Mixed width 운영(체크박스 40px, 액션 100px 등)은 *cell 단위 Fixed override*
4. **각 _Cell 기본값** — Mode=Data / Size=md / Align=Left / Slot=`_Cell Content`. 빌더가 사용 시점에 cell 단위 변경
5. **Nested Instance Expose OFF** — _Row 우측 패널이 75개 control로 무거워지는 것 회피. 빌더가 _Row 안 _Cell instance를 *Layer Panel에서 직접 선택*해 Property 컨트롤. Multi-select로 일괄 변경 가능
6. **Cell.Size는 _Row Property로 분리 X** — _Row.Size enum 신설 안 함 (매트릭스 ×2 폭증 회피). 각 cell instance에서 직접 컨트롤
7. **마지막 컬럼 stroke 제거 = 빌더 운영 룰** (v1.3.3 A안 결합) — 마지막 visible cell 선택해 stroke right 제거 override

### 9-9. v1.3.5 등재 (2026-05-19, 신규 Property + 자동 전파)

`_Cell Content`에 Availability Property 신설. Slot에 들어가는 모든 요소가 *자체 Availability를 가지는 일관 패턴* 완성.

1. **`_Cell Content.Availability: Enabled / Disabled` Property 신규** — 매트릭스 8 → 16 variants (Data Format 4 × Weight 2 × Availability 2)
2. **Disabled 시각 매핑** — Text/Number는 `sys/text/neutral/normal/disabled` (#aeaeae), Avatar+Text/Badge는 *nested 컴포넌트 자체 Availability=Disabled override*
3. **3단계 자동 전파 운영** — _Row.Availability=Disabled variant 안에 _Cell Content override 박힘 / _Cell Content.Disabled variant 안에 nested Avatar/Badge override 박힘. 빌더는 _Row.Availability 토글만
4. **발현 범위 = Data Mode 한정** — Header는 Enabled 고정 (Availability 의미 X), Edit Mode는 _Cell Content가 Slot에 안 들어감
5. **책임 분리 완성** — _Row (행 자동 전파 트리거) / _Cell (Edit Mode 한정, v1.1.1) / _Cell Content (콘텐츠 시각, v1.3.5) / nested Avatar·Badge·폼 컨트롤 (자체 책임)
6. **신규 토큰 0건** — 기존 sys-tokens.json `sys/text/neutral/normal/disabled` (#aeaeae) 활용

### 9-10. v1.3.6 정정 + 등재 (2026-05-19)

Figma 실측 검수 결과 *합의-Figma Drift 3건* 발견 + Anna 결정 1건 + 신규 토큰 6건. **본격 _Row 매핑 §8-6 등재**.

1. **_Row 매트릭스 32 → 17 정정** — Disabled 16 variants가 모두 시각 동일(Disabled bg 흡수) → 1 variant로 통합. *Availability-Property 활성 제어* 신규 원칙 등재 (Mode-Property 활성 제어 v1.1.1과 동형 패턴 확장)
2. **Error 시각 정정** — v1.3.2 §8-7의 *stroke/alert/normal/default 상하 border* → *`sys/bg/alert/subtle/{default,active}` bg 표현*으로 정정 (Figma 실측 정합)
3. **Selected 시각 정정** — *brand 시각 적용 위치* → *`sys/bg/neutral/faint/active`* neutral 톤으로 (Figma 실측 정합). Office brand 미사용 결정
4. **Highlight 시각 등재** — `sys/bg/highlight/subtle/{default,active}` 신규 카테고리 토큰 등재
5. **신규 sys 토큰 6건**:
   - `sys/bg/positive/subtle/active` (green.95)
   - `sys/bg/warning/subtle/active` (orange.95)
   - `sys/bg/informative/subtle/active` (blue.95)
   - `sys/bg/alert/subtle/active` (red.95) — Row.Error.Hover 사용처
   - `sys/bg/highlight/subtle/default` (yellow.100) **— 신규 카테고리**
   - `sys/bg/highlight/subtle/active` (yellow.95) **— 신규 카테고리**
6. **§8-6 _Row 본체 토큰 매핑 본격 등재** — Enabled 16 + Disabled 1 시각 매핑표 신설

### 9-11. v1.3.7 정정 (2026-05-19, 비파괴)

Figma 실측 검수에서 Drift 1건 추가 발견 — Selected 행이 Hover 시 brand 시각으로 강조됨.

1. **Selected.Hover 매핑 정정** — v1.3.6의 `sys/bg/neutral/faint/active` 동일 표기 → **`office/bg/brand/subtle/default`** (brand 강조)로 정정. Figma 실측 정합
2. **Hover=Active 통합 정책의 *Selected 한정 변종 패턴* 신규 명문화** — Selected 행은 Hover 시 *다른 카테고리(brand)*로 전환. 일반 Hover=Active 공유와 달리 *Selected 상태가 의미상 active이므로 Hover는 더 강조*
3. **Disabled+Error variant 폐기** — Figma에 있는 별도 variant 삭제 권장 (Anna 결정 b — 합의 17 단순화 유지)
4. **Drift 3 자동 해소** — Disabled/Error variant 제거 시 Selected/Highlight 무의미 식별자 문제도 자동 해소

### 9-12. v1.4 등재 (2026-05-20, _DnDRow 본격 명세)

`_DnDRow` placeholder(v1.3) → 본격 매트릭스 명세로 등재. **Row family 3 컴포넌트 매트릭스 완성**.

1. **`_DnDRow` Property 매트릭스 — 4 variants** (Mode-Property 활성 제어 적용)
   - DnDMode: Active / Inactive
   - DragState: Idle / DragOver / Dragging (Active 한정 발현)
2. **Mode-Property 활성 제어 패턴 확장** — `_Cell.Mode` (v1.1.1) → `_Row.Availability` (v1.3.6) → `_DnDRow.DnDMode` (v1.4). 컴포넌트 가족 전체 일관 패턴
3. **HTML5 DnD spec 어휘 정합** — Idle/DragOver/Dragging은 표준 DnD 어휘 (dragstart/dragover/dragend 정합). React/Web DnD 구현 시 1:1 매핑
4. **_DragHandle 자체 PSC 운영** — `_Cell._Leading Element` 미사용 (행 단위 책임 분리). DnDMode=Active 시 자동 노출
5. **_Row Property 미운영** (Anna 결정 5) — _DnDRow는 DnD 인터랙션 한정. _Row의 Availability/Validation/Selected/Highlight 등은 비운영. Cell.Mode 혼용 차단 룰(§6-4)과 동형
6. **Max Cell 전략 _Row와 정합** (Anna 결정 6) — 15 cell + visibility 토글 + 기본값/Fill width/Expose OFF 모두 동일
7. ~~**시각 매핑은 v1.5 후속**~~ → **v1.4.1에서 본격 등재됨** (§6-3 시각 매핑 표 참조)

### 9-13. v1.4.1 정정+등재 (2026-05-20, 신규 토큰 4건)

`_DnDRow` Figma 빌드(555:10051) 실측 검수 후 시각 매핑 본격 등재.

1. **Inactive 시각 정정** — v1.4 §6-3의 "일반 행 시각" 표기 유지 (Anna 결정 b). bg는 white (일반). DragHandle icon만 `sys/icon/neutral/subtle/disabled`로 dim — *Inactive 신호*는 *DragHandle 색상*이 담당
2. **Opacity 토큰 신규 카테고리 등재** — global/opacity primitive + sys/opacity semantic alias
   - `global/opacity/50 = 0.5` (Figma 50)
   - `global/opacity/40 = 0.4` (Figma 40) — overlay 용
   - `sys/opacity/dragging = {global.opacity.50}` — Dragging variant
3. **Overlay 카테고리 신설** — `sys/bg/overlay/neutral/normal = #00000066` (Modal scrim 표준)
4. **Opacity 값 표기 정책 신설** — lineHeight 패턴 정합 (Figma integer percent / JSON number 0~1)
5. **DragHandle dim 방식 = color 변경 (B안)** — opacity 토큰 신설 없이 기존 `sys/icon/neutral/subtle/disabled` 재사용. 책임 분리: opacity = *동적 효과* / color = *상태 표현*
6. **신규 토큰 4건** (1 primitive opacity + 1 sys opacity + 2 sys color/overlay):
   - `global/opacity/50` · `global/opacity/40`
   - `sys/opacity/dragging`
   - `sys/bg/overlay/neutral/normal`

### 9-14. v1.4.2 보강 (2026-05-20, 비파괴)

체크박스 행 패턴 — Anna Figma 셋팅(550:2771) 검수 결과 + 결정 B 반영. **운영 정책 명문화만**, Property 매트릭스 변경 0건.

1. **Max Cell 15에 체크박스 cell 포함** (Anna 결정 B) — 총 cell 개수 15 유지. 데이터 cell 최대 14개 (체크박스 사용 시)
2. **체크박스 cell 운영 패턴 명문화** — 첫 cell이 체크박스 cell로 운영:
   - `_Leading Element=True` + `Type=Checkbox` swap
   - `Data Slot` hidden / `_Trailing Element` hidden
   - width **Fixed 36px** (Mixed width 운영)
3. **Row.Selected와 Checkbox.Selection sync** — Checkbox.Selection=Checked ↔ Row.Selected=True 빌더가 sync 운영. v1.3 *Selected: T/F* 패턴 정합
4. **Anna Figma 정정 안내** — 현 16 cells → 15 cells로 정정 (마지막 데이터 cell 1개 삭제)
5. **Property 매트릭스 변경 0건** / **신규 토큰 0건**

### 9-15. v1.5 등재 (2026-05-20, `Table` 컨테이너 + 운영 가이드) — *v1.6에서 `_Table` → `Table` rename*

Row family를 *감싸는* 최상위 컴포넌트 — Table 컨테이너 본격 명세. **Hiworks DS v3 Table family 완성**.

1. **`Table` 컨테이너 컴포넌트 신설** (v1.5 명명 `_Table` → v1.6 rename `Table`) — variant 없는 단일 컴포넌트. Header Slot (Instance Swap + Optional) + Body Slot (Auto Layout 가변)
2. **외곽 책임 환원** — Anna 통찰(v1.4.x: _HeaderRow 상단 + _Row 하단 흡수) *부분 철회*. Table 컨테이너에 상·하 stroke 운영. 좌측 헤더 표 / Headerless 표 / 다단 헤더 표 모두 *일관 외곽 처리*
3. **좌측 헤더 표 운영 룰 (§7-4)** — `Table.Header Slot=OFF` + `_Row × N` + *각 행 첫 cell.Mode=Header* (Cell.Mode 혼용). 새 컴포넌트 신설 0건
4. **다단 헤더 운영 가이드 (§7-5)** — Cell 조립 패턴 (Auto Layout 중첩). colspan = 수직 묶음 + Fill / rowspan = 수평 묶음 + Fill (Gemini 가이드 정합)
5. **`_ComplexHeaderBlock` 헬퍼 미신설 (Anna 결정 R)** — 우선 가이드 문서만. Hiworks 실제 사용 빈도 보고 사후 헬퍼화 검토
6. **Body Slot = Auto Layout 가변** — 행 Max Cell 전략 미적용 (Anna 결정 — 캔버스 길이 폭증 회피). 빌더가 _Row 직접 복사 추가
7. **§8-8 `Table` 토큰 매핑 신설** — 외곽 상·하 stroke = `sys/stroke/neutral/subtle/default` 재사용. **신규 토큰 0건**

---

### 9-16. v1.6 등재 (2026-05-21, rename 정합 정정 + 우측 헤더 표 + Top Line 명문화)

policy v3.4 Part 4 *Public Component 접두 금지 / PSC만 `_` 접두 의무* 명명 룰이 v1.5 등재 시점에 누락 적용된 것을 발견 — 정합 정정 라운드.

1. **`_Table` → `Table` rename** — policy v3.4 §Part 4 명명 룰 정합 정정. PSC들(`_Cell`/`_Cell Content`/`_Leading Element`/`_Trailing Element`/`_Row`/`_HeaderRow`/`_DnDRow`/`_DragHandle`)은 *Asset 패널 비공개 + Public Nested only* 정합 — `_` 접두 유지. `Table`만 *빌더 직접 인스턴스화하는 최상위 Public Component* → 접두 제거
2. **`Top Line` 레이어 운영 명문화 (§6-7)** — Frame Inside stroke 대신 *별도 1px Line 레이어*로 운영. Layer Panel 가시성 + B/B'/Headerless 케이스 *상단 닫힘 일관* 보장. 하단은 Frame Inside 유지 (마지막 `_Row` 하단 stroke와 시각 1줄)
3. **B' 우측 헤더 표 케이스 신규 (§6-7, §7-4)** — 좌측 헤더 표 mirror. `Table.Header Slot=OFF` + `_Row × N` + *각 행 마지막 cell.Mode=Header + Header.Align=Right*. Cell.Mode 혼용 + Header.Align Right 환수로 처리. 새 컴포넌트 0건
4. **Header.Align=Right 환수 (§3-2)** — *Header Right 미운영* Closed Topic(v1.1.1~v1.5.2) 부분 철회. 트리거 ④ B' 우측 헤더 표 새 표현 — Left/Center/Right 3축 운영
5. **신규 토큰 0건** — 기존 `sys/stroke/neutral/subtle/default` 재사용

---

### 9-17. v1.7 등재 (2026-05-26, Table family 상태 표현 완성)

v1.6에서 봉인된 Table family에 *데이터 상태 표현*(Empty/Loading) 신설. **Table family 전체 완성**. v1.6의 *Table variant 없는 단일 컴포넌트* Closed Topic 부분 철회 + 신규 PSC 3개 + Property 2개 추가. 신규 sys/* 토큰 0건.

1. **`Table.State` Variant 신설** — Loaded / Empty / Loading 3축 enum
   - Loaded = 정상 데이터 표시 (Body Slot 빈 default, 빌더가 `_Row × N` 채움)
   - Empty = 데이터 0건 / 검색 결과 없음 (Body Slot default = `_TableMessage` State=Empty)
   - Loading = 로딩 중 (Body Slot default = `_TableMessage` State=Loading — α 스피너)
   - β 스켈레톤 표현은 *Body Slot instance swap*으로 `_SkeletonRow × N` 명시 교체
   - 명명 `Loaded` 채택 (`Default` 미사용 — *Active/Default 회피* 패턴 정합)
   - §10-16 Closed Topic — *`Table` variant 없는 단일 컴포넌트* (v1.5 등재) 부분 철회. 트리거 ④ 명확 충족 — Empty/Loading은 Slot 차원으로 표현 불가
2. **`Table.Show Header` Boolean 신설** — State와 직교 운영
   - True = Header Slot 노출 (default — 일반 상단 헤더 표)
   - False = Header Slot 숨김 — v1.5/1.6의 *visibility OFF* 메커니즘 명시화 (B / B' / D 케이스)
   - AI 학습 친화성 + 빌더 UX 개선 (Property 의미 명시)
   - State × Show Header = 3 × 2 = 6 variants
3. **`_TableMessage` PSC 신설** — Empty / Loading 메시지 인라인 표현용
   - State Variant 2축 (Empty / Loading) — Figma 실측 정합 (node 595:2582)
   - HORIZONTAL Auto Layout · min-height 53 (Anna 토큰 바인딩 추가 2026-05-26)
   - 토큰 매핑: bg `sys/bg/neutral/faint/default` / 좌·우 stroke `sys/stroke/neutral/subtle/default` / headline `sys/typo/body/md/regular` · `sys/text/neutral/muted/default` / Loading spinner icon `sys/icon/neutral/faint/default`
   - Boolean Property (Has Leading/Trailing Element) 미운영 — *시각 차이가 State enum 흡수*로 의미 없음. *Has Slot Boolean 폐기* 패턴 정합
4. **`_SkeletonCell` PSC 신설** — β 스켈레톤 atomic placeholder cell
   - Size × Placeholder Length = 2 × 4 = 8 variants (Figma 실측 정합 — node 596:2386)
   - `_Cell` 외곽 동형 (md=34 / lg=40) + 내부 placeholder 1개 (height 16)
   - Placeholder Length enum 4축: Short ≈ 30% / Medium ≈ 60% / Long ≈ 90% / Fill = 100%
   - 토큰 매핑: bg `sys/bg/neutral/subtle/default` / radius `sys/radius/sm` / 우측 stroke `_Cell` 패턴 정합
5. **`_SkeletonRow` PSC 신설** — `_Row` 동형 단일 컴포넌트 (Figma 실측 정합 — node 592:3488)
   - Variant 0개 (단일 컴포넌트) — `_Row`의 *Cell.Size는 _Row Property 분리 X* (v1.3.4 Closed Topic) 정합
   - 내부 `_SkeletonCell × 15` (visibility 토글 — Max Cell 전략 정합)
   - per-cell Length는 각 `_SkeletonCell` instance Variant 값 변경으로 결정 (서비스별 콘텐츠 가변 길이 대응)
6. **min-height 토큰 바인딩 — 부분 적용** — `_TableMessage` min-height 53 토큰 바인딩 적용 (Anna 2026-05-26 추가). `_Cell` md/lg (34/40) 및 `_SkeletonCell` 동상은 v1.7에서 미적용 — §11 #3 *min-height 토큰화* 안건 유지
7. **신규 sys/* 토큰 0건** — 기존 토큰만 사용 (tokens/*.json 변경 없음)
8. **컴포넌트 가족 다이어그램 갱신** (§2) — Body Slot 상태 표현 PSC 3종 + Table Property 2개 명시

---

## 10. 정책 영향 안건

### 10-0d. v1.7 신규 안건 (2026-05-26)

| # | 안건 | 트리거 |
|---|---|---|
| 76 | **`Table.State` Variant 신설** — Loaded / Empty / Loading 3축 enum. *§10-16 `Table` variant 없는 단일 컴포넌트* Closed Topic 부분 철회 | ④ 새 표현 (Empty/Loading은 Slot 차원으로 표현 불가) |
| 77 | **`Table.Show Header` Boolean 신설** — State와 직교. v1.5/1.6의 *visibility OFF* 메커니즘 명시화 | AI 학습 친화성 + 빌더 UX 개선 |
| 78 | **`_TableMessage` PSC 신설** — Empty / Loading 메시지 인라인 표현. State Variant 2축 | ④ 새 컴포넌트 표현 |
| 79 | **`_SkeletonCell` PSC 신설** — β 스켈레톤 atomic cell. Size × Placeholder Length = 8 variants | ④ 새 컴포넌트 표현 |
| 80 | **`_SkeletonRow` PSC 신설** — `_Row` 동형 단일 컴포넌트. Cell.Size cell-level 정합(v1.3.4 Closed Topic) | ④ 새 컴포넌트 표현 |
| 81 | **Loading α 스피너 default · β 스켈레톤 사용자 swap** — AI 학습 단일결정 우선. β는 명시적 opt-in | AI 친화성 + Figma 단순성 |
| 82 | **`_TableMessage` min-height 토큰 바인딩** — Anna 2026-05-26 추가 (53 hardcoded → 토큰 바인딩). `_Cell` md/lg 동상은 §11 #3 안건 유지 | 토큰 무결성 부분 적용 |
| 83 | **`_TableMessage` State enum 채택, Boolean Property 미운영** — 시각 차이가 State enum 흡수로 Boolean 분기 의미 없음 | *Has Slot Boolean 폐기* 패턴 정합 |

### 10-0e. v1.8 매핑 하향 안건 (2026-06-01)

| # | 안건 | 트리거 |
|---|---|---|
| 76 | **Header bg 한 칸 하향** — `office/bg/brand/normal/*`(#d8e9fb/#badbf8) → `office/bg/brand/subtle/*`(#e6eff9/#d7ebfc). 실적용 시 과도하게 진함. v1.5.2 *normal 이동*을 부분 환원(subtle 복귀 = v1.2~v1.5.1 슬롯과 동일) | ② 실측 검수 충돌 — Anna 실적용 피드백 |
| 77 | **Selected bg 동반 하향** — `office/bg/brand/subtle/*`(#e6eff9/#d7ebfc) → `office/bg/brand/faint/*`(#f6fbfe/#ecf7fe). Header가 subtle로 복귀하면 충돌 → 위계(Header>Selected) 유지 위해 한 칸 더 하향 | ② 위계 유지 동반 조정 |
| 78 | **시각 위계 패턴 슬롯 재레벨 (순서 불변)** — Header bg(subtle) > Selected bg(faint) > Highlight(yellow subtle) > Hover(neutral faint) > Rest. v1.5.2 패턴의 *순서·원리* 유지, brand emphasis 슬롯만 한 칸씩 하향 | 패턴 슬롯 갱신 (원리 불변) |
| 79 | **사후 시각 검수 권고** — Selected=`faint/default`(#f6fbfe)는 near-white → 선택 신호 약화 가능. Figma 빌드 후 가독성 검수 필수 | 사후 검수 |

### 10-0a. v1.5.1 토큰 매핑 정합 안건 (2026-05-21)

| # | 안건 | 트리거 |
|---|---|---|
| 64 | **Selected.Rest 매핑 카테고리 전환** — `sys/bg/neutral/faint/active`(#f7f7f7) → `office/bg/brand/subtle/default`(#e6eff9). *v1.3.6 neutral 톤 합의(Closed Topic)* 폐기 | ② Figma 실측 1:1 규칙 정합 (정책방 결정 2026-05-21) |
| 65 | **Selected.Hover 매핑 카테고리 통일** — `office/bg/brand/subtle/default`(#e6eff9) → `office/bg/brand/subtle/active`(#d7ebfc). *v1.3.7 Selected 한정 변종 패턴* 폐기 → 카테고리 내 default/active 1:1 진행 통일 | ② Figma 실측 1:1 규칙 정합 (정책방 결정 2026-05-21) |
| 66 | **`office/bg/brand/subtle/active` 값 재정렬** — blue.95(#c8def3) → light_blue.80(#d7ebfc) | 정책방 — LNB Hover의 faint/active 분리 + light_blue 팔레트 brand 변종 공식 지위 부여 (원칙 #7) |
| 67 | **시각 영향 — Selected.Hover 한 톤 옅음** — Figma 빌드 후 시각 검수 권고 | 사후 검수 |

### 10-0b. v1.5.2 정정 등재 안건 (2026-05-21)

| # | 안건 | 트리거 |
|---|---|---|
| 68 | **Cell.Mode=Header bg 카테고리 이동** — `office/bg/brand/subtle/*` → `office/bg/brand/normal/*` (Rest: #e6eff9 → #d8e9fb, Hover: #d7ebfc → #badbf8). Selected.Rest(brand/subtle/default)와 시각 위계 차등 — Header > Selected | ② Figma 실측 + Anna 정정 (시각 충돌 해소) |
| 69 | **§6-3 hex 표기 오타 정정** — Active.DragOver hex `#d8e9fb` → `#d7ebfc`. 토큰 이름은 정확 (subtle/active), hex만 정합 | 표기 정정 |
| 70 | **잔존 Figma 정정 완료 등재** — _Row 일반 Hover drift 해소 (bg/neutral/faint/active로 환수) / _HeaderRow 하단 border 신설 (sys/stroke/neutral/subtle/default, 1px) / _DnDRow Inactive bg 정정 (disabled → faint/default white) | ② Anna Figma 정정 — 잔존 안건 A 일부 해소 |
| 71 | **시각 위계 명확화 패턴 명문화** — Header bg(normal) > Selected bg(subtle) > Highlight bg(yellow subtle) > Hover bg(neutral faint) > Rest. brand 카테고리 *normal/subtle* 분리 의미 — *상시 강조 vs 임시 선택* 차등 | 패턴 신규 |

### 10-0c. v1.6 신규 안건 (2026-05-21)

| # | 안건 | 트리거 |
|---|---|---|
| 72 | **`_Table` → `Table` rename** — Public Component 명명 룰 정합 정정. PSC들은 `_` 접두 유지 | policy v3.4 §Part 4 *적용 누락 정정* (정책 *내용* 변경 0건) |
| 73 | **`Top Line` 레이어 운영 명문화 (§6-7)** — Frame Inside stroke 대신 별도 1px Line 레이어. Layer Panel 가시성 + 외곽 일관 | ② Figma 실측 상단 닫힘 누락 |
| 74 | **B' 우측 헤더 표 케이스 신규 (§6-7, §7-4)** — 좌측 mirror, Cell.Mode 혼용 | ④ 새 표현 (좌측 헤더 표 mirror) |
| 75 | **Header.Align=Right 환수 (§3-2)** — *Header Right 미운영* Closed Topic 부분 철회 | ④ B' 우측 헤더 표 케이스 대응 |

### 10-0. v1.5 신규 안건 (2026-05-20)

| # | 안건 | 트리거 |
|---|---|---|
| 58 | **`Table` 컨테이너 컴포넌트 신설** (v1.5 등재 명명 `_Table` → v1.6 rename) — Header Slot Optional + Body Slot Auto Layout 가변 | ④ 새 컴포넌트 표현 (Row family 감싸는 최상위) |
| 59 | **외곽 책임 환원** — Row family → Table 컨테이너 (Anna 통찰 부분 철회) | ② Anna 발견 (좌측 헤더 표 케이스) |
| 60 | **좌측 헤더 표 운영 룰** — Cell.Mode 혼용으로 처리 (새 컴포넌트 0건) | ④ |
| 61 | **다단 헤더 운영 가이드** — Cell 조립 패턴 (Auto Layout 중첩) | ④ |
| 62 | **`_ComplexHeaderBlock` 헬퍼 미신설 (R안)** — 가이드 문서만, 사후 검토 | 운영 단순화 우선 |
| 63 | **Body Slot = Auto Layout 가변** (Row Max 전략 미적용) | 캔버스 길이 폭증 회피 |

### 10-2. v1.4.2 보강 안건 (2026-05-20)

| # | 안건 | 트리거 |
|---|---|---|
| 55 | **체크박스 cell 운영 패턴 명문화** — Max Cell 15에 체크박스 포함, 첫 cell이 체크박스 | ② Figma 실측 + Anna 결정 B |
| 56 | **Row.Selected ↔ Checkbox.Selection sync 운영 룰** | 체크박스 컨트롤과 행 선택 상태 정합 |
| 57 | **데이터 cell 최대 14개 (체크박스 사용 시)** — Max Cell 15 총 개수 유지 | 운영 정책 일관성 |

### 10-3. v1.4.1 정정+신규 안건 (2026-05-20)

| # | 안건 | 트리거 |
|---|---|---|
| 50 | **Inactive 시각 정정** — bg 일반행 / DragHandle만 icon disabled dim | ② Figma 실측 + Anna 결정 b |
| 51 | **Dragging opacity 토큰 신설** — `sys/opacity/dragging` + global primitive | ④ 새 컴포넌트 표현 (DnDRow) |
| 52 | **Overlay 카테고리 신설** — `sys/bg/overlay/neutral/normal` (Modal scrim 표준) | ④ 미래 사용처 (Modal/Dropdown) 대비 |
| 53 | **Opacity 값 표기 정책** — lineHeight 패턴 정합 (Figma integer / JSON 0~1) | Figma 한계 — 소수점 입력 불가 |
| 54 | **DragHandle dim = color 변경 (B안)** — opacity 신설 회피, 기존 icon disabled 재사용 | 책임 분리 (opacity 동적 / color 상태) |

### 10-4. v1.4 신규 안건 (2026-05-20)

| # | 안건 | 트리거 |
|---|---|---|
| 45 | **`_DnDRow` Property 매트릭스 4 variants 본격 명세** — DnDMode + DragState | ④ 새 컴포넌트 표현 |
| 46 | **Mode-Property 활성 제어 패턴 — 컴포넌트 가족 전체 확장** — _Cell.Mode / _Row.Availability / _DnDRow.DnDMode 동형 | 패턴 일관성 강화 |
| 47 | **`_DragHandle` 자체 PSC 운영** (_Cell._Leading Element 미사용) | 행 단위 책임 분리 |
| 48 | **_DnDRow는 _Row Property 미운영** — DnD 한정 컴포넌트 (Cell.Mode 혼용 차단 룰과 동형) | 책임 분리 명확 |
| 49 | **HTML5 DnD spec 어휘 정합** — Idle/DragOver/Dragging | AI 친화성 + Web 구현 정합 |

### 10-5. v1.3.7 정정 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 42 | **Selected.Hover 매핑 정정** — neutral → brand subtle | ② Figma 실측 Drift 검수 |
| 43 | **Hover=Active 통합의 Selected 한정 변종 패턴 명문화** | 신규 정책 패턴 |
| 44 | **Disabled+Error variant 폐기** (Figma 정정 안내) — 합의 17 단순화 유지 | ② 실측 검수 + Anna 결정 b |

### 10-6. v1.3.6 정정·신규 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 36 | **_Row 매트릭스 32 → 17 (Disabled 통합)** + *Availability-Property 활성 제어* 원칙 신규 | Figma 실측 + Anna 결정 |
| 37 | **Error 시각 정정** (border → bg) | ② 실측 Drift 검수 |
| 38 | **Selected 시각 정정** (brand → neutral) | ② 실측 Drift 검수 |
| 39 | **Highlight 신규 카테고리 등재** (`sys/bg/highlight/*`) | Anna Figma 셋팅 |
| 40 | **sys 토큰 6건 신설** (subtle/active 4종 + highlight 카테고리 2종) | Anna 토큰 신설 (Hover=Active 공유 정책 확장) |
| 41 | **§8-6 _Row 본체 매핑 본격 등재** | 매트릭스 확정 |

### 10-7. v1.3.5 신규 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 32 | **`_Cell Content.Availability` Property 신규** — Enabled/Disabled. 콘텐츠 자체 시각 책임 | Anna 직관 (Slot 요소 모두 자체 Availability 보유 일관성) |
| 33 | **3단계 자동 전파 운영** — _Row.Disabled → _Cell Content.Disabled → nested Avatar/Badge.Disabled | 빌더 운영 1단계화 (자동 전파) |
| 34 | **Disabled 시각 매핑 = `sys/text/neutral/normal/disabled` (#aeaeae)** + nested 컴포넌트 책임 | 신규 토큰 0건 |
| 35 | **발현 범위 = Data Mode 한정** — Header Enabled 고정, Edit는 Slot 다름 | 책임 분리 명확 |

### 10-8. v1.3.4 신규 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 27 | **Max Cell 전략** — `_Row` 마스터 안 15개 _Cell + visibility 토글 컬럼 가변 운영 | Anna+Gemini 협의 결정 |
| 28 | **Cell 기본값 셋팅** — Mode=Data / Size=md / Align=Left / Slot=_Cell Content | 운영 단순화 |
| 29 | **width = Fill 기본 + Mixed width cell 단위 override** | Auto Layout 표준 패턴 정합 |
| 30 | **Nested Instance Expose OFF** — 빌더 직접 cell 컨트롤 | 우측 패널 무거움 회피 |
| 31 | **Cell.Size는 _Row Property 분리 X — cell 단위 컨트롤** | 매트릭스 ×2 폭증 회피 |

### 10-9. v1.3.3 정정 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 22 | **세로 분리선 기본 운영화** — v1.3.2의 *기본 미사용 + 대기 슬롯* 결정 정정 | Anna 결정 + 컬럼 가변 사용 패턴 정합 |
| 23 | **`_Cell` 본체 모든 Mode에 우측 stroke 추가** — Header/Data/Edit 공통 | 컬럼 가변 시 자동 적용 운영 단순화 |
| 24 | **마지막 컬럼 = 인스턴스 override 운영** | Property 신설 회피 (매트릭스 폭증 X) |
| 25 | **wrapper Frame + border 레이어 패턴 폐기** | 노드 수 폭증 회피 (Gemini 지적 검수 후) |
| 26 | **Edit Mode 우측 stroke 적용 — Borderless 정책 spec 정합 검토 필요** | `docs/policy/borderless-policy-spec.md` 영향 평가 안건 |

### 10-10. v1.3.2 보강 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 19 | **Row family 분리선 토큰 매핑 본격 등재** — 가로 sys neutral subtle / 세로 대기 / 외곽 Table 책임 | 기존 정책 매핑 완료성 |
| 20 | **세로 분리선 대기 슬롯 + 방향 표준** — `_Cell` 본체 **우측** border | clean UI 트렌드 정합 + 특수 케이스 대비 |
| 21 | **외곽 border = Table 컨테이너 책임 명문화** — Row family 책임 외 | v1.5+ Table 컴포넌트 분리 안건 |

### 10-11. v1.3.1 정정 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 18 | **`_HeaderRow` Property variant 제거** — 단일 컴포넌트로 정정. Hover는 Cell 책임 | ② 실측 검수 — 시각 중복 회피 + Anna 지적 |

### 10-12. v1.3 신규 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 11 | **`Selected: True/False` vs `Selection: Unchecked/Checked/Indeterminate` 책임 분리** | ④ 새 컴포넌트 표현. LNB·Row 영구 선택 패턴 vs Checkbox 계열 체크 컨트롤 패턴 |
| 12 | **Row family 3 컴포넌트 분리** — `_Row` / `_HeaderRow` / `_DnDRow` | ④ Header 상태 매트릭스 불일치 + DnD Property 추가 시 매트릭스 폭증 |
| 13 | **Row 상태 시각 적용 범위 룰** — Cell.Mode=Edit 섞인 행은 Row 상태 시각 차단 | ② 실측 검수 — 시각 충돌 회피 |
| 14 | **시각 우선순위 패턴 — 직교 매트릭스 + 시각 우선순위** (Disabled > Error > Selected > Highlight > Hover > Rest) | 운영 단순화 + Variant 폭증 회피 |
| 15 | **Row.Validation vs Cell.Validation 책임 분리** — 동일 enum 이름, 책임 차등 | ④ 새 컴포넌트 표현 |
| 16 | **`Highlight` enum 신규** (Boolean) — Row 임시 강조 상태 | ④ 검색 매칭·임시 포커스 사용 사례 |
| 17 | **인라인 편집 우선 패턴 명문화** — Mode=Data + boxed input swap 기본, Mode=Edit borderless는 대안 | 사용 사례 비중 명시 |

### 10-13. v1.2 신규 안건 (2026-05-19)

| # | 안건 | 트리거 |
|---|---|---|
| 7 | **Size 단일 책임 패턴** — Align이 padding을 가르지 않음. Padding은 Size로만 변별 | Anna 재정렬 + §8-0 명문화 |
| 8 | Edit Slot Input Area Left/Right 비대칭 해소 (정합 클로즈) | Anna 재정렬 |
| 9 | min-height(34/40) 토큰화 여부 — 현재 픽셀 hardcoded 유지, v1.3 별도 안건 | 정책방 영향 평가 필요 |
| 10 | Figma `_Cell` component description Drift — Mode 줄 오타 + Size sm/md + Editing 잔존 | description 갱신 필요 |

### 10-14. v1.1.1 안건 (이력)

| # | 안건 | 트리거 |
|---|---|---|
| 1 | Cell.Interaction `Pressed` 환원 — Editing enum 폐기 | §5-1 ② 실측 충돌. **Mode-Interaction 책임 분리 원칙** 신설 |
| 2 | Edit Mode에서 _Leading/_Trailing 비활성 — Mode-PSC 활성 매트릭스 | 실측 정합 |
| 3 | Header Align Left 추가 | 실측 정합 |
| 4 | Validation=Error의 Interaction 매트릭스 정정 (Editing→Hover) | 실측 정합 |
| 5 | LNB 패턴 적용 부분 철회 — Cell의 Edit Mode 한정 (Mode가 모드 책임 흡수) | §5-1 ② 실측 충돌 |
| 6 | 외부 일관성 우선 원칙 두 번째 적용 (Size에 이어 Interaction 명명) | v1.1 신설 원칙 적용 |

### 10-15. Drift Log

| 옛 용어 / 옛 셋팅 | 현행 용어 / 현행 셋팅 | 변경일 | 변경 근거 |
|---|---|---|---|
| `Editing` enum (Cell.Interaction, Mode=Edit 한정) | `Pressed` (외부 인풋 일관성) | 2026-05-18 v1.1.1 | Mode-Interaction 책임 분리. v1.0 등재 *Pressed→Editing*은 부분 철회 |
| Edit Mode에서 _Leading/_Trailing 운영 | (Edit Mode에서 비활성, Header/Data만 운영) | 2026-05-18 v1.1.1 | Edit Slot Input이 자체 처리 |
| Header Align: Center only | Left + Center | 2026-05-18 v1.1.1 | 컬럼명 좌측 정렬 케이스 |
| Validation=Error: Interaction=Editing에서만 | Interaction=Hover에서 운영 | 2026-05-18 v1.1.1 | 실측 정합 |
| Header/Data md padding `px=xs(8)` | `px=sm(10)` | 2026-05-19 v1.2 | Size 단일 책임 패턴 정합 |
| Header/Data lg padding `px=sm(10)` | `px=md(12)` | 2026-05-19 v1.2 | Size 단일 책임 패턴 정합 |
| Edit Slot Input Area Left/Right 비대칭 (md: 5291/5389, lg: 5389/5403 등 변종) | 단일 variant 통합 (Align은 padding 변별 X) | 2026-05-19 v1.2 | Size 단일 책임 패턴 정합 |
| Row의 행 단위 선택을 `Selection: Checked/Unchecked`으로 명명할 의도 | `Selected: True/False` (LNB 정합) — `Selection` rename은 Checkbox 계열 한정 | 2026-05-19 v1.3 | 영구 선택 vs 체크 컨트롤 책임 분리 |
| Row를 단일 컴포넌트(`Row`)로 묶는 안 | `_Row` / `_HeaderRow` / `_DnDRow` 3 컴포넌트 분리 | 2026-05-19 v1.3 | 상태 매트릭스 불일치 + 매트릭스 폭증 회피 |
| Row 시각이 *모든 Cell.Mode 행에 적용* (Edit 행 포함) | Cell.Mode=Edit 섞인 행은 Row 상태 시각 *차단* (룰 명문화) | 2026-05-19 v1.3 | 시각 충돌 회피 + 빌더 운영 책임 |
| `_HeaderRow` Property variant (Rest/Hover) 2개 운영 | `_HeaderRow` Property variant 0개 (단일 컴포넌트) — Hover는 셀 책임 | 2026-05-19 v1.3.1 | Row Hover와 Cell.Mode=Header.Hover 시각 중복 회피 |
| `_HeaderRow` 하단 border 색을 brand 강조선으로 두는 안 | `sys/stroke/neutral/subtle/default` (Row와 동일 톤, 통일감) | 2026-05-19 v1.3.2 | Anna 결정 — Header bg가 이미 시각 분리, border까지 brand 강조는 과다 |
| 세로 분리선 = 기본 미사용 + 대기 슬롯 (v1.3.2) | **세로 분리선 = 기본 운영, `_Cell` 본체 우측 stroke 모든 Mode** (v1.3.3) | 2026-05-19 v1.3.3 | Anna 결정 — 컬럼 가변 사용 패턴 정합 + Hiworks 사용 패턴 우선 |
| wrapper Frame(`Cell`) + `border` 레이어 패턴 (Anna 첫 셋팅) | `_Cell` 본체 stroke right 직접 적용 (인스턴스 단위 운영 X) | 2026-05-19 v1.3.3 | 노드 수 폭증 회피 + Property 노출 복잡도 회피 (Gemini 검수) |
| 마지막 컬럼 stroke = Property `IsLast` 신설 안 | 인스턴스 override로 stroke right 제거 (Property 신설 X) | 2026-05-19 v1.3.3 | 매트릭스 폭증 회피 |
| Row.Validation=Error 시각 = stroke/alert/normal border (v1.3.2 합의) | `sys/bg/alert/subtle/{default,active}` bg 표현 (v1.3.6 정정) | 2026-05-19 v1.3.6 | Figma 실측 정합 |
| Row.Selected 시각 = brand subtle (합의 표기) | `sys/bg/neutral/faint/active` neutral 톤 (v1.3.6 정정) | 2026-05-19 v1.3.6 | Figma 실측 정합 (Office brand 미사용) |
| Row.Selected.Rest 시각 = `sys/bg/neutral/faint/active` neutral 톤 (v1.3.6, 2026-05-19) | `office/bg/brand/subtle/default` (#e6eff9) brand 카테고리 통일 | 2026-05-21 v1.5.1 | 정책방 결정 — Figma 실측 1:1 규칙 정합 |
| Row.Selected.Hover 시각 = brand subtle/default *Selected 한정 변종* (v1.3.7, 2026-05-19) | `office/bg/brand/subtle/active` (#d7ebfc) — 카테고리 내 .default→.active 1:1 진행 | 2026-05-21 v1.5.1 | 정책방 결정 — 변종 패턴 폐기, 슬롯 룰 정합 |
| Cell.Mode=Header bg = `office/bg/brand/subtle/*` (v1.2~v1.5.1) | `office/bg/brand/normal/*` (Rest #d8e9fb / Hover #badbf8) | 2026-05-21 v1.5.2 | Selected.Rest(brand/subtle/default)와 시각 위계 차등 — Anna Figma 정정 |
| Cell.Mode=Header bg = `office/bg/brand/normal/*` (#d8e9fb/#badbf8, v1.5.2) | `office/bg/brand/subtle/*` (#e6eff9/#d7ebfc) | 2026-06-01 v1.8 | ② 실적용 과진 — Header 옅게(subtle 복귀) |
| _Row Selected bg = `office/bg/brand/subtle/*` (#e6eff9/#d7ebfc, v1.5.1) | `office/bg/brand/faint/*` (#f6fbfe/#ecf7fe) | 2026-06-01 v1.8 | Header subtle 복귀 → 위계 유지 동반 하향 |
| 일반 Hover Figma 셋팅 = `office/bg/brand/subtle/default` (#e6eff9, drift) | `sys/bg/neutral/faint/active` (#f7f7f7) spec 정합 환수 | 2026-05-21 v1.5.2 | Anna Figma 정정 — spec 환수 |
| _DnDRow Inactive bg = disabled (#eaeaea) | `bg/neutral/faint/default` (#ffffff) 일반행 시각 | 2026-05-21 v1.5.2 | Anna Figma 정정 — v1.4.1 합의 b 정합 |
| Disabled 16 variants 직교 운영 (v1.3) | Disabled 1 variant 통합 (Availability-Property 활성 제어) | 2026-05-19 v1.3.6 | Figma 실측 + 시각 동일 변종 단순화 |
| Selected.Hover = neutral 동일 표기 (v1.3.6 §8-6) | `office/bg/brand/subtle/default` brand 강조 (v1.3.7) | 2026-05-19 v1.3.7 | Figma 실측 — Selected 행 Hover 시 brand 강조 의도 |
| 외곽 책임 = Row family 자체 (Anna 통찰 v1.4.x) | Table 컨테이너 책임 (v1.5 환원 — 좌측 헤더 / Headerless 표 케이스 대응) | 2026-05-20 v1.5 | Anna 발견 — 외곽 일관 처리 필요 |

| `_Table` (v1.5~v1.5.2 명명) | `Table` (Public Component, `_` 접두 제거) | 2026-05-21 v1.6 | policy v3.4 §Part 4 *Public Component 접두 금지* 명명 룰 적용 누락 정정. PSC들(`_Cell`/`_Row` 등)은 `_` 접두 유지 |
| Header.Align: Left + Center (Right 미운영, v1.1.1~v1.5.2) | Left + Center + Right (B' 우측 헤더 표 케이스 대응) | 2026-05-21 v1.6 | 트리거 ④ — 좌측 헤더 표 mirror 신규 |
| Table 외곽 상단 stroke = Frame Inside (v1.5) | 별도 `Top Line` 1px 레이어 (Layer Panel 가시성, Frame Inside는 하단만) | 2026-05-21 v1.6 | Figma 실측 상단 닫힘 누락 정합 + 운영 명료화 |
| `Table`은 variant 없는 단일 컴포넌트 (v1.5) | `Table.State` Variant 3축 (Loaded/Empty/Loading) + `Show Header` Boolean (직교). 6 variants | 2026-05-26 v1.7 | 트리거 ④ — Empty/Loading은 Slot 차원으로 표현 불가 (새 표현) |
| Body Slot 단일 default = `_Row × N` (v1.5) | State variant별 default 분기 — Loaded=빈 슬롯 / Empty=`_TableMessage`(Empty) / Loading=`_TableMessage`(Loading α 스피너). β 스켈레톤은 사용자 instance swap → `_SkeletonRow × N` | 2026-05-26 v1.7 | State enum 자동 fill — AI 학습 친화성 + 빌더 UX 단순화 |
| Header Slot visibility OFF 메커니즘 (B/B'/D 케이스, v1.5/1.6) | `Show Header` Boolean Property로 명시화 (Show Header=False) | 2026-05-26 v1.7 | Property 의미 명시 + AI 학습 친화성 |
| Loading 표현 단일 (v1.5~v1.6 미존재) | α 스피너 default + β 스켈레톤 사용자 swap — 2-tier 운영 | 2026-05-26 v1.7 | Q4 결정 — 둘 다 required, AI 학습 단일결정 우선으로 α default |
| `_TableMessage` min-height 53 hardcoded (v1.7 초기 빌드) | min-height 53 토큰 바인딩 (Anna 추가) | 2026-05-26 v1.7 | 토큰 무결성 부분 적용. `_Cell` md/lg 토큰화는 §11 #3 안건 유지 |

### 10-16. Closed Topics 갱신

- Mode-Interaction 책임 분리 원칙 → §4-2 등재 (v1.1.1)
- Cell.Interaction Pressed 환원 (Edit Mode 한정) → §4-1 + §4-4 Superseded 갱신 (v1.1.1)
- Edit Mode _Leading/_Trailing 비활성 → §4-2 (v1.1.1)
- Header Align Left 운영 → §4-1 (v1.1.1)
- **Size 단일 책임 패턴 (Align ≠ padding 변별자)** → §4-1 신규 (v1.2)
- **Edit Slot Left/Right 비대칭 해소** → §4-2 신규 (v1.2)
- **`_Cell` 토큰 매핑 본격 등재 (신규 토큰 0건)** → §1-7 신규 (v1.2)
- **`Selected: T/F` vs `Selection: Checked/Unchecked/Indeterminate` 책임 분리** → §4-1 신규 (v1.3)
- **Row family 3 컴포넌트 분리 (`_Row`/`_HeaderRow`/`_DnDRow`)** → §1-7 / §4-2 신규 (v1.3)
- **Cell.Mode 혼용 행 시각 차단 룰** → §4-2 신규 (v1.3)
- **시각 우선순위 패턴** (직교 매트릭스 + 시각 우선순위) → §4-2 신규 (v1.3)
- **Row.Validation vs Cell.Validation 책임 분리** → §4-2 신규 (v1.3)
- **`Highlight` Boolean enum 신규 (Row)** → §1-7 신규 (v1.3)
- **인라인 편집 기본 패턴 = Mode=Data + boxed input swap** → §1-7 신규 (v1.3)
- **`_HeaderRow` Property variant 0개 — 단일 컴포넌트** → §1-7 정정 (v1.3.1)
- **Row family 가로 분리선 매핑 = `sys/stroke/neutral/subtle/default`** (Header 포함 통일 톤) → §1-7 / §4-2 (v1.3.2)
- **세로 분리선 대기 슬롯 + 방향 표준 = `_Cell` 우측 border** → §4-3 (v1.3.2)
- **외곽 border = Table 컨테이너 책임 (Row family 외)** → §4-2 (v1.3.2)
- **세로 분리선 기본 운영화 — `_Cell` 본체 모든 Mode 우측 stroke** → §1-7 / §4-2 정정 (v1.3.3)
- **마지막 컬럼 = 인스턴스 override 운영 (Property 신설 X)** → §4-2 (v1.3.3)
- **wrapper Frame + border 레이어 패턴 폐기** → §4-2 (v1.3.3)
- **Edit Mode 우측 stroke 적용 — Borderless 정책 spec 정합 검토 별도 안건** → §10 안건 (v1.3.3)
- **Max Cell 전략 — `_Row` 마스터 15개 _Cell + visibility 토글** → §1-7 / §4-2 신규 (v1.3.4)
- **Cell 기본값 = Mode=Data/Size=md/Align=Left/Slot=_Cell Content** → §4-2 (v1.3.4)
- **width Fill 기본 + Mixed width cell 단위 override** → §4-2 (v1.3.4)
- **Nested Instance Expose OFF — 빌더 직접 cell 컨트롤** → §4-2 (v1.3.4)
- **Cell.Size는 _Row Property 분리 X** → §1-7 / §4-2 (v1.3.4)
- **`_Cell Content.Availability` Property 신규 — Enabled/Disabled** → §1-7 / §4-2 (v1.3.5)
- **3단계 자동 전파 — _Row.Disabled → _Cell Content → nested** → §1-7 / §4-2 (v1.3.5)
- **Disabled 시각 매핑 — `sys/text/neutral/normal/disabled` + nested 컴포넌트 책임** → §1-7 (v1.3.5)
- **_Row 매트릭스 32 → 17 + *Availability-Property 활성 제어* 원칙** → §1-7 / §4-2 (v1.3.6)
- **Error 시각 = `sys/bg/alert/subtle/{default,active}` bg 표현** (border → bg 정정) → §1-7 (v1.3.6)
- **Selected 시각 = `sys/bg/neutral/faint/active` neutral 톤** (Office brand 미사용) → §1-7 (v1.3.6)
- **Highlight 시각 = `sys/bg/highlight/subtle/{default,active}` 신규 카테고리** → §1-7 / Guide Part 8 (v1.3.6)
- **sys 토큰 6건 신설** (subtle/active 4종 + highlight 카테고리 2종) → Guide Part 8 (v1.3.6)
- **Selected.Hover = `office/bg/brand/subtle/default` brand 강조** (Selected.Rest는 neutral 유지) → §8-6 (v1.3.7)
- **Hover=Active 통합 정책의 *Selected 한정 변종 패턴* — Hover 시 다른 카테고리(brand)로 전환** → §1-7 / §4 신규 (v1.3.7)
- **`_DnDRow` Property 매트릭스 = DnDMode + DragState (4 variants)** → §1-7 (v1.4)
- **Mode-Property 활성 제어 패턴 — 컴포넌트 가족 전체 확장 (_Cell.Mode / _Row.Availability / _DnDRow.DnDMode)** → §4-2 (v1.4)
- **`_DragHandle` 자체 PSC (Cell PSC 미사용)** → §1-7 (v1.4)
- **_DnDRow는 _Row Property 미운영 — DnD 한정** → §4-2 (v1.4)
- **Opacity 토큰 카테고리 신설** (`sys/opacity/dragging` + global primitive) → §1-7 / Guide Part 8 (v1.4.1)
- **Overlay 카테고리 신설** (`sys/bg/overlay/neutral/normal`) → §1-7 / Guide Part 8 (v1.4.1)
- **Opacity 값 표기 정책 — Figma integer / JSON 0~1** (lineHeight 패턴 정합) → §4-3 (v1.4.1)
- **DragHandle dim = color 변경 (icon subtle/disabled)** — opacity 신설 회피, 책임 분리 (opacity 동적 / color 상태) → §4-2 (v1.4.1)
- **체크박스 cell 운영 패턴 — Max Cell 15에 체크박스 포함 (데이터 cell 최대 14)** → §1-7 / §4-2 (v1.4.2)
- **Row.Selected ↔ Checkbox.Selection sync 운영 룰** → §4-2 (v1.4.2)
- **`Table` 컨테이너 컴포넌트 신설** (Header Slot Optional + Body Slot 가변, v1.5 명명 `_Table` → v1.6 rename) → §1-7 / §4-2 (v1.5 / v1.6)
- **외곽 책임 환원 — Table 컨테이너** (Row family 자체 책임 부분 철회) → §1-7 / §4-2 (v1.5)
- **좌측 헤더 표 = Cell.Mode 혼용** (새 컴포넌트 0건) → §1-7 (v1.5)
- **다단 헤더 = Cell 조립 패턴** (헬퍼 R안 미신설) → §1-7 (v1.5)
- **Body Slot = Auto Layout 가변** (Row Max 전략 미적용) → §4-2 (v1.5)
- **`Table` rename — Public Component** (PSC들은 `_` 접두 유지) → §1-7 / policy v3.4 §Part 4 정합 정정 (v1.6)
- **`Top Line` 레이어 운영** (Frame Inside stroke 대신, 상단만 별도 1px Line 레이어) → §6-7 / §8-8 (v1.6)
- **B' 우측 헤더 표 케이스 — `_Row` 마지막 cell.Mode=Header + Header.Align=Right** → §6-7 / §7-4 (v1.6)
- **Header.Align=Right 환수** (좌측 헤더 표 mirror 대응, *Header Right 미운영* 부분 철회) → §3-2 (v1.6)
- **`Table.State` Variant 신설** (Loaded/Empty/Loading 3축, *Table variant 없는 단일 컴포넌트* 부분 철회) → §6-7 / §9-17 (v1.7)
- **`Table.Show Header` Boolean 신설** (State와 직교, *visibility OFF* 메커니즘 명시화) → §6-7 / §7-4 (v1.7)
- **`_TableMessage` PSC 신설** (Empty/Loading State enum 2축, Boolean Property 미운영 — *Has Slot Boolean 폐기* 정합) → §6-8-1 / §8-9 (v1.7)
- **`_SkeletonCell` PSC 신설** (Size × Placeholder Length = 8 variants, _Cell 동형) → §6-8-2 / §8-9 (v1.7)
- **`_SkeletonRow` PSC 신설** (`_Row` 동형 단일 컴포넌트, *Cell.Size는 _Row Property 분리 X* 정합) → §6-8-3 / §8-9 (v1.7)
- **Loading α 스피너 default · β 스켈레톤 사용자 swap** (AI 학습 단일결정 우선, β는 명시적 opt-in) → §6-7 / §7-6 (v1.7)
- **State variant별 Body Slot default 분기 운영** (Loaded=빈 슬롯 / Empty=`_TableMessage`(Empty) / Loading=`_TableMessage`(Loading)) → §6-7 (v1.7)
- **`_TableMessage` min-height 토큰 바인딩** (Anna 2026-05-26 추가, `_Cell` md/lg 토큰화는 §11 #3 안건 유지) → §6-8-1 / §8-9 (v1.7)
- **`Loaded` 명명 채택** (`Default` 미사용 — Active/Default 회피 패턴 정합) → §6-7 / §9-17 (v1.7)

---

## 11. 다음 라운드 작업

1. **Highlight 색상 토큰 미세조정** — v1.3.6에서 `sys/bg/highlight/subtle/{default,active}` 신설 완료. Figma 실측 후 hex 미세조정 가능성 잔존 (trigger ②)
2. **`_HeaderRow` 매트릭스 확장** — 컬럼 정렬 Active 등 추가 시 trigger ④
3. **min-height 토큰화 여부 결정** — Cell 픽셀 hardcoded 34/40, 정책방 영향 평가 필요
4. **Figma `_Cell` component description 일괄 작성** — `_Cell` v1.5.2 권장안 별건 작성 완료(archive 격리). 후속 `_Cell Content` · `_Leading/_Trailing` · `_Row` · `_HeaderRow` · `_DnDRow` · `Table` · `_DragHandle` 일괄 작성 안건
5. ~~**`$extensions.bound` 메타 Table 토큰 일괄 적용**~~ → ✅ **종결 (2026-05-21)** — tier+bound 메타 5개 JSON 파일 일괄 마이그레이션 완료 (global 243 + sys 149 + service 36 = 428 토큰). 무결성 검사 0 issues. 백업: `tokens/*.json.bak-bound-20260521-084101`
6. **HR 브랜드 분기 빌드** — 현재 Office 중심, HR 별도 복제 필요
7. **외부 일관성 우선 원칙 적용 점검** — 다른 컴포넌트 Size·Interaction 시멘틱 (계속)
8. ~~TextInput / Select / DatePicker borderless variant 신설~~ → 진행 중 (별도 작업방, `docs/policy/borderless-policy-spec.md` 단일 기준)
9. ~~**항목 4 — Table State Variant + `_TableMessage` PSC 신설**~~ → ✅ **종결 (2026-05-26 v1.7)** — Loaded/Empty/Loading 3-variant 운영 (Default 미채택, Loaded 채택). `_TableMessage` PSC + `_SkeletonCell` / `_SkeletonRow` PSC 추가 신설. Show Header Boolean 직교. §10-16 *variant 없는 단일 컴포넌트* 부분 철회 등재. 신규 sys/* 토큰 0건. min-height 부분 토큰 바인딩 적용

> *2026-05-21 §11 정정*: 옛 #1(`_Row` 토큰 매핑) · 옛 #4(`_DnDRow` Property 매트릭스) 종결 — 본문 §8-6/§8-7 (v1.5.1) 및 §6-3 (v1.4)에 일괄 박힘으로 다음 라운드 안건 아님.
>
> *2026-05-21 §11 #5 종결*: `$extensions.bound` 메타 Table 토큰 일괄 적용 — tier+bound 일괄 마이그레이션 완료 (5개 JSON / 428 토큰). 신규 토큰은 동일 패턴 의무. [[project_bound_meta]]
>
> *2026-05-26 §11 #9 종결 (v1.7)*: 항목 4 — Table State Variant + `_TableMessage` / `_SkeletonCell` / `_SkeletonRow` PSC 본격 등재. Show Header Boolean 직교 추가. 신규 sys/* 토큰 0건. min-height 토큰 바인딩 부분 적용 (Anna `_TableMessage`만 추가).

### v1.7 후속 안건 (신규)

10. **Figma 마스터 컴포넌트 description 일괄 갱신 (v1.7 신규 PSC 3종 + Table.State Property 추가분)** — 후속 안건 #4와 동시 처리 권장
11. **`_TableMessage` 일러스트 사이즈 정책방 안건** — 인라인 메시지(현행 53px) vs 일러스트 포함 큰 empty state — 별도 컴포넌트 신설 검토 (v1.8+ 트리거 ④ 후보)
12. **Shimmer animation spec (`_SkeletonRow` 동작)** — Figma는 정적 placeholder만, React 구현 시 shimmer 효과 정합 spec 필요 (v1.8+)
13. **`_Cell` md/lg min-height 토큰화 마무리** — §11 #3 잔존 (v1.7에서 `_TableMessage`만 부분 적용. `_Cell` 34/40 hardcoded 유지)
14. **`_SkeletonCell.Placeholder Length` enum의 size 토큰화 검토** — 현재 Short/Medium/Long/Fill = 30/60/90/100% hardcoded. [[project_size_token_precedent]] 패턴 적용 가능성 — `size/skeleton-placeholder/{short,medium,long,fill}` sys 토큰 신설 검토 (v1.8+)

---

*v1.7 봉인 — 2026-05-26 — Hiworks DS v3 Table family **상태 표현 완성** + Body Slot 상태 표현 PSC 3종 (`_TableMessage` / `_SkeletonCell` / `_SkeletonRow`) + Table.State Variant 3축 + Show Header Boolean 직교 + min-height 토큰 바인딩 부분 적용. 신규 sys/* 토큰 0건.*
*v1.0 → ... → v1.4.2 → v1.5 (`Table` 컨테이너 신설, v1.5 명명 `_Table`) → v1.5.1 (Selected.Rest/Hover brand subtle 카테고리 통일) → v1.5.2 (Cell.Mode=Header bg brand/normal 이동 + Anna Figma 정정 잔존 4건 해소) → v1.6 (`_Table`→`Table` rename + Top Line 명문화 + B' 우측 헤더 표 + Header.Align=Right 환수) → **v1.7** (Table.State Variant + Show Header Boolean + `_TableMessage` · `_SkeletonCell` · `_SkeletonRow` PSC 신설 + min-height 부분 토큰 바인딩) → **v1.8** (실적용 과진 → Header bg normal→subtle / Selected bg subtle→faint 위계 유지 한 칸 하향, 토큰 값 0건)*
*v1.2 (Cell) + v1.3.x (Row) + v1.3.5 (Cell Content) + v1.4 / v1.4.1 (_DnDRow) + v1.4.2 (Max Cell 운영) + v1.5 (Table) + v1.5.1·v1.5.2 (토큰 매핑·시각 위계 정정) + v1.6 (Table rename + 우측 헤더 표 + Top Line) + **v1.7 (Table.State Variant + Show Header Boolean + Body Slot 상태 표현 PSC 3종)** + **v1.8 (Header/Selected bg 위계 유지 한 칸 하향 — 실적용 과진 정정)** Active 병행 운영*
*archive v0.1~v0.11 ⚪ Superseded (별도 격리) + `_Cell-figma-description-v1.5.2.md` (2026-05-21 폐기 회차 격리, table.md §11 #4 안건으로 후속 일괄 처리)*
