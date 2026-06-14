# figma-qa-map 자동 매핑 도입 작업 로그

**날짜**: 2026-06-14  
**작업자**: dskim  

---

## 배경

`tests/figma-qa-map.ts`는 Playwright DOM QA 테스트에서 `data-qa-id` → Figma node-id를 매핑하는 파일이다.  
기존에는 185개 항목 전체를 **수동으로 관리**하고 있었고, 아래 두 가지 문제가 있었다.

1. **누락 항목 발생**: TextInput lg size, NavItem/SectionHeader `dragging`·`dragover` 상태가 Figma에 variant로 존재하지만 매핑에 빠져 있었음
2. **Figma 변경 대응 어려움**: Figma 파일이 업데이트되어 node-id가 바뀌면 수동으로 전부 찾아야 했음

Figma Component Set의 variant 이름이 `"Role=Brand, Style=Solid, Size=xs, ..."` 형식으로 완전히 구조화되어 있어, 파싱 → qaId 변환 → 자동 생성이 가능하다는 것을 확인하고 자동화를 도입했다.

---

## 변경 사항

### 1. 파일 구조 분리

기존의 단일 `figma-qa-map.ts`를 **자동 생성 파일**과 **수동 관리 파일**로 분리했다.

```
tests/
  figma-qa-map.ts          ← entry point (자동+수동 합산 export)
  figma-qa-map.auto.ts     ← 자동 생성 (generate:qa-map으로 갱신)
```

`figma-qa-map.ts` 내부:
```typescript
import { AUTO_GENERATED_QA_MAP } from './figma-qa-map.auto';

export const FIGMA_QA_MAP = {
  ...AUTO_GENERATED_QA_MAP, // 자동 생성 (Button, ButtonIconOnly, TextInput, LNB)
  ...MANUAL_QA_MAP,         // 수동 관리 (Timetable, Table, Modal, Divider)
};
```

### 2. 자동 생성 스크립트 추가

`scripts/generate-qa-map.ts` 신규 작성.  
Figma REST API로 각 Component Set의 children을 가져와 variant name을 파싱하고 qaId로 변환한다.

```bash
FIGMA_TOKEN=figd_xxxx pnpm generate:qa-map
```

또는 `.env` 파일에 `FIGMA_TOKEN=figd_xxxx`를 설정 후:

```bash
pnpm generate:qa-map
```

### 3. 누락 매핑 추가 (총 185 → 201개)

| 컴포넌트 | 추가된 항목 | node-id |
|---|---|---|
| TextInput sm | `input-sm-enabled-error` | 216:4760 |
| TextInput sm | `input-sm-enabled-success` | 278:3162 |
| TextInput sm | `input-sm-readonly-none` | 263:331 |
| TextInput lg | `input-lg-enabled-error` | 263:511 |
| TextInput lg | `input-lg-enabled-success` | 278:3208 |
| TextInput lg | `input-lg-readonly-none` | 263:525 |
| NavItem | `lnb-nav-l{1,2,3}-dragging` | 338:2051, 346:433, 346:577 |
| NavItem | `lnb-nav-l{1,2,3}-dragover` | 338:2137, 346:439, 346:583 |
| SectionHeader | `lnb-section-l{1,2}-dragging` | 338:2496, 349:200 |
| SectionHeader | `lnb-section-l{1,2}-dragover` | 338:2502, 349:206 |

---

## 컴포넌트별 자동화 가능 여부

### ✅ 자동화 가능 (figma-qa-map.auto.ts로 관리)

Figma Component Set variant가 `Key=Value` 구조화 형식이라 파싱 가능.

| 컴포넌트 | Component Set | 필터 조건 | qaId 패턴 |
|---|---|---|---|
| Button | `205:2273` | `Interaction=Rest, Icon Position=none` | `btn-{role}-{style}-{size}[-disabled]` |
| ButtonIconOnly | `232:1354` | `Interaction=Rest` | `btn-icon-{role}-{style}-{size}[-disabled]` |
| TextInput | `216:4816` | `Interaction=Rest, Style=Boxed, Alignment=Left` | `input-{size}-{availability}-{validation}` |
| NavItem | `338:1126` | `Interaction=Rest` | `lnb-nav-l{level}-{stateLabel}` |
| SectionHeader | `338:2489` | `Interaction=Rest` | `lnb-section-l{level}-{stateLabel}` |
| ActionButton | `363:721` | `Interaction=Rest` | `lnb-action-rest[-disabled]` |

**NavItem stateLabel 우선순위** (`NavItem.tsx:127` 기준):  
`dragging` > `dragover` > `disabled` > `selected` > `rest`

**SectionHeader 주의사항**:  
`expanded`와 `collapsed`는 Figma에서 동일 base variant (chevron만 CSS 회전). 두 qaId가 같은 node-id를 가리킨다.

### ❌ 자동화 불가 (figma-qa-map.ts의 MANUAL_QA_MAP으로 유지)

| 컴포넌트 | 이유 | 현황 |
|---|---|---|
| Modal Shell/Footer | Figma Boolean Component Property(`Has Supporting Text` 등)는 `get_metadata`에서 variant로 노출되지 않음 | 의도적 부분 매핑 (Size별 default 조합만) |
| Table | 수동 qaId prop 구조. Edit mode·DnDRow 등은 QA 페이지에서 사용하지 않아 의도적 제외 | 의도적 부분 매핑 (기본 조합만) |
| Timetable | 수동 qaId prop 구조 | 완전 매핑 완료 |
| Divider | 단일 COMPONENT (variant 없음) | 단일 매핑 |

---

## 디자이너에게 요청할 Figma 수정 사항

현재 코드에는 구현됐으나 Figma에 variant가 없어 QA 비교가 불가능한 항목들.

| 요청 | 이유 |
|---|---|
| `TextInput` — `Validation=Warning` variant 추가 | 코드에 구현됨(`Input.tsx`), Figma Component Set `216:4816`에 없음 |
| `Modal` — Boolean Property를 Variant 축으로 전환 (선택) | 현재 Boolean Property는 자동 추출 불가. variant 전환 시 자동 매핑 가능하나 조합 수 증가 (6 sizes × 4 조합 = 24개) |

---

## 매핑 갱신 방법

### Figma node-id가 변경된 경우

```bash
# FIGMA_TOKEN 필요 (Figma Personal Access Token)
pnpm generate:qa-map
```

생성되는 파일: `tests/figma-qa-map.auto.ts`  
수동 관리 파일(`figma-qa-map.ts`의 `MANUAL_QA_MAP`)은 변경되지 않는다.

### 자동화 불가 컴포넌트(Modal, Table 등) node-id 변경 시

`tests/figma-qa-map.ts`의 `MANUAL_QA_MAP` 섹션을 직접 수정한다.

---

## 관련 파일

| 파일 | 설명 |
|---|---|
| `tests/figma-qa-map.ts` | entry point. MANUAL_QA_MAP + AUTO_GENERATED_QA_MAP 합산 export |
| `tests/figma-qa-map.auto.ts` | 자동 생성 파일. 직접 수정 금지 |
| `scripts/generate-qa-map.ts` | 자동 생성 스크립트 (Figma REST API 사용) |
| `scripts/fetch-figma-metadata.ts` | 기존 스펙 데이터 fetch 스크립트 (별도) |
| `tests/dom-qa.spec.ts` | Playwright QA 테스트 (REST API 방식) |
| `tests/dom-qa-mcp.spec.ts` | Playwright QA 테스트 (MCP 토큰 변수 비교 방식) |
