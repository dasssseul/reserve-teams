# dom-qa-mcp 단일 테스트 통합

## 배경

`test:dom-qa`와 `test:dom-qa-mcp` 두 개를 따로 돌리던 구조에서 발생한 문제:

- `dom-qa`: Figma REST API → RGB 역매핑으로 토큰명을 추정 → 토큰 비교 정확도 낮음
- `dom-qa-mcp`: MCP 직접 토큰 비교로 정확하지만, height/width/lineHeight/letterSpacing 비교 없음

**목표**: `dom-qa-mcp`를 베이스로 삼아 비변수 px 비교를 추가 → 단일 테스트로 통합.

---

## 비교 로직 분기

```
토큰이 있는 속성 (색상, spacing, radius, typography composite)
  → figma-mcp-variables.json (MCP) 기반 토큰명 직접 비교
  → comparisonMode: 'token'

토큰이 없는 속성 (height, width, lineHeight, letterSpacing)
  → figma-metadata.json (REST API) 기반 px 값 비교
  → comparisonMode: 'value'
```

### width 조건부 비교

버튼 내부 텍스트에 따라 width가 달라지므로, 텍스트가 일치할 때만 비교합니다.

| 조건 | 처리 |
|------|------|
| iconOnly (양쪽 text 모두 undefined) | strict ±1px 비교 |
| Figma 텍스트 == DOM 텍스트 | strict ±1px 비교 |
| Figma 텍스트 ≠ DOM 텍스트 | skip + note에 양쪽 텍스트 표시 |
| 텍스트 정보 한쪽 없음 | skip |

### 심각도 채널

| status | 의미 |
|--------|------|
| `pass` | 일치 |
| `fail` | 불일치 (token 비교, height, width, iconOnly width) |
| `warn` | 허용 범위 초과지만 soft fail (lineHeight, letterSpacing) |
| `skip` | 비교 불가 (데이터 없음, 텍스트 불일치, modal height 등) |

---

## 변경 파일

| 파일 | 변경 내용 |
|------|---------|
| `scripts/fetch-figma-metadata.ts` | `FigmaNode.characters`, `NormalizedNode.text` 필드 추가; `extractText()` 함수 추가 |
| `tests/utils/dom-measure.ts` | `DomMetric.text` 필드 추가; labelSpan textContent 수집 |
| `tests/utils/compare-mcp.ts` | `McpDiffStatus`에 `'warn'` 추가; `McpDiffItem`에 `figmaValue`, `delta` 추가; px 비교 함수 4개(`compareHeight`, `compareWidth`, `compareLineHeight`, `compareLetterSpacing`) 추가; `compareMcp()` 3번째 인자 `figma?: NormalizedNode` 추가; `summarizeMcp()` warn 카운터 추가; `printMcpFailures()` warn 출력 추가 |
| `tests/dom-qa-mcp.spec.ts` | `figma-metadata.json` 조건부 로드; `compareMcp()` 호출에 figma 인자 전달 (modal은 undefined) |

---

## 실행 방법

```bash
# 1. Figma 메타데이터 갱신 (text 필드 추가됐으므로 재실행 필요)
FIGMA_TOKEN=figd_xxxx pnpm fetch:figma

# 2. MCP 변수 파일은 별도 수집 (figma-mcp-variables.json)
# → Figma MCP 툴로 수동 수집 후 tests/fixtures/ 에 배치

# 3. 테스트 실행
pnpm test:dom-qa-mcp
```

---

## 리포트 읽는 법 (`tests/dom-qa-mcp-report.json`)

```jsonc
{
  "btn-brand-solid-md": [
    {
      "category": "background",
      "status": "pass",
      "comparisonMode": "token",        // 토큰 직접 비교
      "matchedToken": "office/bg/brand/strong/default",
      "domToken": "--office-bg-brand-strong-default"
    },
    {
      "category": "height",
      "status": "pass",
      "comparisonMode": "value",        // px 비교
      "figmaValue": "36px",
      "domValue": "36px",
      "delta": 0
    },
    {
      "category": "width",
      "status": "skip",
      "comparisonMode": "value",
      "note": "텍스트 불일치 (figma='저장' dom='BUTTON') — width 비교 생략"
    },
    {
      "category": "lineHeight",
      "status": "warn",                 // warn: 불일치지만 soft
      "comparisonMode": "value",
      "figmaValue": "21px",
      "domValue": "20px",
      "delta": -1
    }
  ]
}
```

---

## 알려진 제약

- **modal height**: 콘텐츠 크기에 따라 가변 → `modal-*` qaId는 figma 인자 `undefined` 전달로 height/width skip
- **width 텍스트 불일치**: QA 페이지의 버튼 label과 Figma 디자인 텍스트가 다르면 자동 skip. QA 페이지 텍스트를 Figma에 맞추면 비교 가능
- **figma-metadata.json 없을 때**: px 비교 전체 생략, 토큰 비교만 동작 (기존 동작과 동일)
- **fetch:figma 재실행 필요**: `text` 필드가 이번 작업으로 추가됐으므로 기존 `figma-metadata.json`에는 없음 → 반드시 재실행
