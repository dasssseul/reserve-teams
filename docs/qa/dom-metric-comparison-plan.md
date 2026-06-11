# DOM 수치 비교 QA 도입 계획

## Context

현재 QA 시스템은 `tests/button-qa.spec.ts`에서 Figma export PNG와 브라우저 스크린샷을 `pixelmatch`로 비교한다. 이 방식은 다음 문제를 안고 있다.

1. **폰트 렌더링 차이로 인한 false positive** — `tests/QA-REPORT.md`의 QA-002 케이스(`82px vs 65px`)처럼 코드가 스펙대로인데 fail 처리됨.
2. **불일치 원인을 수치로 보고하지 못함** — "불일치 픽셀 14.5%"만 알려줄 뿐, "배경색이 ΔE=8 만큼 다르다" / "너비가 17px 부족하다" 같은 구체 진단이 없다.
3. **`tests/figma-baseline/` 디렉토리가 비어 있어 현재 사실상 비활성** 상태.

**목표**: Figma REST API로 노드 메타데이터(`absoluteBoundingBox`, `fills`, `cornerRadius`, `style.*`)를 가져와, Playwright `getBoundingClientRect()` + `getComputedStyle()`로 측정한 DOM 값과 **수치 단위로 직접 비교**한다. 픽셀 스크린샷에 의존하지 않으므로 폰트 렌더링 차이의 영향을 받지 않고, "어떤 속성이 얼마나 다른지"를 정량 리포트로 출력한다.

기존 `button-qa.spec.ts`는 baseline PNG가 채워질 미래를 대비해 그대로 유지하고, DOM 비교는 별도 spec으로 추가한다.

---

## 결정 사항 (기본값 — 작업 시작 시 변경 가능)

| 항목                     | 결정                                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Figma API 토큰           | 환경변수 `FIGMA_TOKEN`만 사용. `.env` 파일 생성 금지(`CLAUDE.md` 정책). 실행 시 `FIGMA_TOKEN=xxx pnpm test:dom-qa`. 토큰 미설정 시 `fetch-figma-metadata.ts`는 발급 가이드 URL을 안내하고 즉시 종료. |
| Figma 메타데이터 캐시    | `tests/fixtures/figma-metadata.json`에 저장, **commit 함**. 매 테스트 실행마다 API 호출하지 않음. 노드 갱신은 `pnpm fetch:figma`로 수동.                                                             |
| Figma API 일괄 조회      | `ids=` 쿼리 1회당 최대 **50개 노드**로 chunk 분할(URL 길이/안정성 마진). 112개 → 3회 요청.                                                                                                           |
| 결과 리포트              | `tests/dom-qa-report.json`은 매 실행마다 갱신되는 산출물이므로 **`.gitignore`에 추가**. 캐시(`figma-metadata.json`)는 commit, report는 untracked.                                                    |
| 어설션 정책              | strict 비교는 `expect`(실패 → test fail), warn은 어설션 없이 콘솔/리포트에만 기록(`expect.soft` 미사용). 폰트 렌더링 영향 항목(text 너비, letterSpacing)은 warn 채널로만 흘려보냄.                   |
| 색상 비교 단위           | ΔE2000 (`delta-e` npm). 임계값 **< 2.0** PASS, 2.0~5.0 WARN, ≥5.0 FAIL.                                                                                                                              |
| 픽셀 tolerance 해석      | `±1px`은 `Math.abs(figma − dom) <= 1`. `getBoundingClientRect()` 소수점 그대로 사용(반올림 X).                                                                                                       |
| 기존 `button-qa.spec.ts` | 유지. DOM 비교는 별도 `tests/dom-qa.spec.ts`.                                                                                                                                                        |
| 적용 범위                | Phase 1: Button + ButtonIconOnly (`figma-qa-map.ts` 등록 완료된 항목, 총 **112개**). Phase 2: Input은 `figma-qa-map.ts`에 노드 매핑 추가 후.                                                         |

---

## 변경할 파일

### 신규 (디렉토리 포함 신규 생성 필요: `scripts/`, `tests/fixtures/`, `tests/utils/`)

| 경로                                 | 역할                                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `scripts/fetch-figma-metadata.ts`    | Figma REST API 호출 → `figma-metadata.json` 캐시 생성. 50개 chunk로 분할 요청.                                          |
| `tests/fixtures/figma-metadata.json` | `{ _version: 1, data: { [qaId]: NormalizedNode } }` 캐시. 스키마 변경 추적용 버전 필드 포함.                            |
| `tests/utils/color.ts`               | `parseCssColor()`, `figmaColorToRgb()`, `rgbToLab()`, `deltaE2000()`                                                    |
| `tests/utils/dom-measure.ts`         | `measureAll(page, qaIds)` — 한 번의 `page.evaluate`로 모든 qa-id의 rect/computed style을 일괄 수집                      |
| `tests/utils/compare.ts`             | `compareSpec(figmaMeta, domMeta) → DiffReport[]`                                                                        |
| `tests/dom-qa.spec.ts`               | **단일 test** 내에서 `page.goto('/qa')` 1회 후 112개 qa-id를 loop. strict 항목은 `expect`, warn 항목은 리포트에만 기록. |
| `tests/types/delta-e.d.ts`           | `@types/delta-e` 부재 시 ambient declaration (필요 여부는 설치 후 확인)                                                 |

### 수정

| 경로                    | 변경 내용                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `package.json`          | devDependencies에 `delta-e`, `tsx` 추가; scripts에 `"fetch:figma"`, `"test:dom-qa"` 추가 |
| `tests/figma-qa-map.ts` | (선택) Input용 노드 매핑 섹션 추가 — Phase 2에서                                         |
| `.gitignore`            | `tests/dom-qa-report.json` 추가. `figma-metadata.json`은 그대로 추적.                    |

### 참고만 (수정 없음)

- `src/qa/ButtonQAPage.tsx` — `data-qa-id` 라벨이 이미 `figma-qa-map.ts` 키와 1:1 매칭됨 (조사 결과 확인)
- `src/components/Button/Button.tsx:16-66` (VARIANT_MAP), `:70-108` (HEIGHT/PADDING_MAP) — 비교 대상 속성의 코드 측 진실
- `tests/figma-qa-map.ts` — `FILE_KEY = '7FyrA0Olbv6B7SicSvVTZN'`, **112개** 노드 매핑(Button 64 + ButtonIconOnly 48) 그대로 활용
- `src/styles/index.css:1-2` — `@import '@gabia-inc/hiworks-ui-components/tokens.css'` 로 CSS 변수 공급됨, `getComputedStyle`이 정상 resolve
- 라우트 `/qa` → `ButtonQAPage` 매핑은 기존 `button-qa.spec.ts`가 이미 사용 중이라 동일 경로 그대로 활용

---

## 핵심 비교 매트릭스

| 속성                 | Figma source                                  | DOM source                                                 | 비교    | 채널            | tolerance |
| -------------------- | --------------------------------------------- | ---------------------------------------------------------- | ------- | --------------- | --------- |
| 높이                 | `absoluteBoundingBox.height`                  | `getBoundingClientRect().height`                           | numeric | strict          | ±1px      |
| 너비 (텍스트 버튼)   | `absoluteBoundingBox.width`                   | `getBoundingClientRect().width`                            | numeric | **warn-only**   | ±1px      |
| 너비 (IconOnly)      | `absoluteBoundingBox.width`                   | `getBoundingClientRect().width`                            | numeric | strict          | ±1px      |
| 배경색               | fills 정규화 → Lab                            | `getComputedStyle.backgroundColor` → Lab                   | ΔE2000  | strict          | <2.0      |
| 텍스트 색            | TEXT 자식 fills 정규화 → Lab                  | `getComputedStyle.color` → Lab                             | ΔE2000  | strict          | <2.0      |
| 아이콘 색 (IconOnly) | VECTOR 자식 fills 정규화 → Lab                | `getComputedStyle(button).color` → Lab (currentColor 가정) | ΔE2000  | strict          | <2.0      |
| 테두리 색            | strokes 정규화 → Lab                          | `getComputedStyle.borderTopColor` → Lab                    | ΔE2000  | strict (조건부) | <2.0      |
| 테두리 두께          | `strokeWeight`                                | `getComputedStyle.borderTopWidth`                          | numeric | strict          | exact     |
| 모서리 둥글기        | `cornerRadius` 또는 `rectangleCornerRadii[0]` | `getComputedStyle.borderRadius` 첫 값                      | numeric | strict          | exact     |
| 폰트 크기            | `style.fontSize`                              | `getComputedStyle.fontSize`                                | numeric | strict          | exact     |
| 폰트 굵기            | `style.fontWeight`                            | `parseInt(getComputedStyle.fontWeight)`                    | numeric | strict          | exact     |
| 줄간격               | `style.lineHeightPx`                          | `getComputedStyle.lineHeight`                              | numeric | strict (조건부) | exact     |
| 자간                 | `style.letterSpacing`                         | `getComputedStyle.letterSpacing`                           | numeric | **warn-only**   | ±0.1px    |
| padding              | auto-layout `paddingLeft/Right/Top/Bottom`    | `getComputedStyle.padding*`                                | numeric | strict (조건부) | exact     |

> "조건부"는 아래 정규화 규칙 §1, §3, §5, §7 참조.

### 정규화 규칙

**§1. fills/strokes 정규화** (배경색·텍스트색·아이콘색·테두리색 공통)

Figma 노드의 `fills[]` / `strokes[]` 배열에서 다음 조건을 만족하는 첫 요소만 사용:

- `type === 'SOLID'`
- `visible !== false`

위 조건의 요소가 없으면 `transparent`(`rgba(0,0,0,0)`)로 간주. 비교 대상은 DOM의 같은 속성도 transparent 또는 alpha 0이어야 PASS, 그 외는 FAIL.

alpha 처리: `color.a × (opacity ?? 1)`로 최종 alpha 산출. alpha < 1이면 ΔE 비교 전에 흰색 배경 위 합성(`out = src * a + bg * (1 - a)`) 후 Lab 변환. DOM `rgba(...)`도 동일 합성.

**§2. 텍스트/아이콘 색상 추출 경로**

- Button (라벨 있음): 노드 트리를 DFS로 순회해 `type === 'TEXT'`인 첫 노드의 fills를 §1로 정규화.
- ButtonIconOnly (라벨 없음): DFS로 `type === 'VECTOR'` 또는 `INSTANCE` 내부 vector fills의 첫 SOLID 요소. DOM 측은 `getComputedStyle(button).color` 사용 (CircleIcon이 `fill="currentColor"`이므로 부모 color가 진실).

**§3. 테두리 비교 조건**

`getComputedStyle(button).borderTopWidth > 0` AND Figma `strokeWeight > 0 && strokes`에 SOLID 요소 존재 — 두 조건이 모두 참일 때만 색·두께 비교. 한쪽만 참이면 즉시 FAIL("테두리 유무 불일치"). 둘 다 거짓이면 비교 skip.

**§4. cornerRadius 분기**

Figma 노드가 균일하면 `cornerRadius: number`, 모서리별 다르면 `rectangleCornerRadii: [tl, tr, br, bl]`. 둘 중 존재하는 쪽을 사용하되 본 컴포넌트들은 균일 가정이므로 **첫 값만** 비교. DOM `borderRadius` 반환값(`"4px"` 또는 `"4px 4px 4px 4px"`)도 첫 px 값만 추출.

**§5. lineHeight 처리**

DOM `getComputedStyle.lineHeight`가 `'normal'`이면 비교 skip(리포트에 `n/a` 표기). Button 라벨 `<span>`은 `leading-none`이 적용되어 px 반환이 정상 경로이지만, 미적용 케이스도 안전하게 처리.

**§6. padding 처리**

Figma 노드에 `paddingLeft/Right/Top/Bottom` 키가 모두 부재하면(auto-layout 아님) 비교 skip. 본 컴포넌트들은 모두 auto-layout 가정이며, fetch 단계에서 부재가 감지되면 경고 로그.

**§7. 소수점 비교**

`±1px` = `Math.abs(figma − dom) <= 1`. 반올림하지 않음. Figma 0.5px, DOM 33.984 같은 부동소수를 그대로 비교.

**§8. fontWeight 정규화**

DOM은 `'400'` 문자열로 반환되므로 `parseInt`. CSS 키워드(`'normal'`, `'bold'`) 매핑은 본 컴포넌트에선 사용하지 않으므로 생략.

> CSS 색상은 `getComputedStyle`이 항상 `rgb(...)` 또는 `rgba(...)`로 resolve (CSS 변수도 풀어줌).

---

## dom-qa.spec.ts 출력 예시 (목표)

각 항목 앞 마커:

- `✅` PASS (strict 통과 또는 warn-only 통과)
- `⚠️` WARN (warn-only 채널에서 차이 검출, test는 통과)
- `❌` FAIL (strict 채널에서 차이 검출, test 실패로 잡힘)
- `⏭` SKIP (정규화 규칙에 따라 비교 대상 아님)

```
btn-brand-solid-md
  ✅ height        34px == 34px
  ⚠️ width         65px vs 82px (−17px · warn-only: 폰트 렌더링 차이)
  ✅ background    ΔE=0.4 (rgb(28,127,211) ≈ #1c7fd3)
  ✅ color         ΔE=0.0 (rgb(255,255,255))
  ⏭ border         테두리 없음 (양쪽 일치)
  ✅ borderRadius  4px == 4px
  ✅ fontSize      14px == 14px
  ✅ fontWeight    400 == 400

btn-icon-neutral-solid-md
  ✅ height        34px == 34px
  ✅ width         34px == 34px
  ❌ icon color    ΔE=8.2 (rgb(51,51,51) vs rgb(103,103,103))
                  → 코드 #333333 (sys.icon.neutral.normal.default)
                  → Figma #676767 (sys.icon.neutral.subtle.default)
                  → QA-001 재현 확인
```

콘솔 표 + `tests/dom-qa-report.json`(머신리더블, `.gitignore`)로 저장.

---

## 단계별 작업 순서

1. **의존성 & 스크립트 등록**
   - `pnpm add -D delta-e tsx`
   - `@types/delta-e`는 DefinitelyTyped에 없을 가능성 높음 → 설치 시도 실패하면 `tests/types/delta-e.d.ts`에 ambient declaration 작성
   - `package.json` scripts에 `"fetch:figma": "tsx scripts/fetch-figma-metadata.ts"`, `"test:dom-qa": "playwright test tests/dom-qa.spec.ts"`
   - `.gitignore`에 `tests/dom-qa-report.json` 추가

2. **`scripts/fetch-figma-metadata.ts` 작성**
   - 시작 시 `FIGMA_TOKEN` 환경변수 검증 — 없으면 발급 가이드(figma.com/developers/api#access-tokens) 안내 후 exit 1
   - 입력: `tests/figma-qa-map.ts`의 `FIGMA_QA_MAP`
   - Figma API: `GET /v1/files/:file_key/nodes?ids=<id1>,<id2>,...` — **50개씩 chunk 분할 (112개 → 3회)**
   - 노드별로 정규화 규칙 §1~§4 적용해 `{ _version: 1, data: { [qaId]: NormalizedNode } }` 형태로 출력
   - 추출 항목: `width, height, fills(normalized), strokes(normalized), strokeWeight, cornerRadius, padding{T,R,B,L}, style{fontSize, fontWeight, lineHeightPx, letterSpacing}, textColor, iconColor`
   - padding 키 부재 감지 시 경고 로그
   - `tests/fixtures/figma-metadata.json`에 저장

3. **`tests/utils/color.ts`**
   - `parseCssColor(str: string): {r,g,b,a}` — `rgb(28, 127, 211)` / `rgba(28, 127, 211, 0.5)` 파싱
   - `figmaColorToRgba({r,g,b,a}: {r:0-1}, opacity?): {r:0-255, a:0-1}`
   - `flattenOnWhite({r,g,b,a}): {r,g,b}` — alpha < 1인 경우 흰 배경 합성
   - `rgbToLab({r,g,b}): {L,a,b}` — sRGB → linear → XYZ → Lab (D65)
   - `deltaE2000(lab1, lab2): number` — `delta-e` 라이브러리 wrapping

4. **`tests/utils/dom-measure.ts`**
   - `measureAll(page, qaIds: string[]): Promise<Record<string, DomMetric>>` — **한 번의 `page.evaluate`**로 모든 qa-id 일괄 측정 (성능 핵심)
   - 추출할 computed style: `backgroundColor`, `color`, `borderTopColor`, `borderTopWidth`, `borderRadius`, `paddingTop/Right/Bottom/Left`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`
   - 라벨 span에 한해 텍스트 typography(`fontSize/Weight/lineHeight/letterSpacing`) 별도 측정 (Button 라벨은 자식 span)
   - 아이콘 색상: ButtonIconOnly의 경우 `getComputedStyle(button).color` (CircleIcon이 currentColor)

5. **`tests/utils/compare.ts`**
   - `compareSpec(figma: NormalizedNode, dom: DomMetric): DiffItem[]`
   - `DiffItem = { property, status: 'pass'|'warn'|'fail'|'skip', channel: 'strict'|'warn-only', figmaValue, domValue, delta?, note? }`
   - 비교 매트릭스 + 정규화 규칙 §1~§8 그대로 구현

6. **`tests/dom-qa.spec.ts`** (단일 test 구조)

   ```
   test('DOM vs Figma 수치 비교', async ({ page }) => {
     await page.goto('/qa');
     await page.waitForLoadState('networkidle');
     await page.evaluate(() => document.fonts.ready);

     const figmaMeta = JSON.parse(readFileSync('tests/fixtures/figma-metadata.json'));
     const qaIds = Object.keys(figmaMeta.data);
     const domMeta = await measureAll(page, qaIds);

     const report: Record<string, DiffItem[]> = {};
     for (const qaId of qaIds) {
       report[qaId] = compareSpec(figmaMeta.data[qaId], domMeta[qaId]);
     }

     writeFileSync('tests/dom-qa-report.json', JSON.stringify(report, null, 2));
     printConsoleTable(report); // 출력 예시 형식

     // strict 채널에서 fail이 있으면 test 실패
     const fails = collectFails(report);
     expect(fails, formatFailMessage(fails)).toEqual([]);
   });
   ```

   - warn-only 항목은 어설션 X, 콘솔/리포트에만 기록
   - strict 항목 중 status === 'fail'인 것이 하나라도 있으면 `expect`로 fail

7. **검증 (사용자가 실행)** — Verification 섹션 참조

8. **(Phase 2)** Input용 노드 매핑을 `figma-qa-map.ts`에 추가 → `pnpm fetch:figma` 재실행 → 같은 spec으로 자동 커버 (Input은 placeholder/validation icon 등 자식 구조가 다르므로 측정 path 보강 가능성 있음)

---

## Verification

```bash
# 1. Figma 메타데이터 한 번 수집 (FIGMA_TOKEN은 사용자 본인 토큰)
FIGMA_TOKEN=xxx pnpm fetch:figma
# → tests/fixtures/figma-metadata.json 생성 확인

# 2. DOM 비교 테스트 실행
pnpm test:dom-qa
# → 콘솔에 qa-id별 항목 상태 표 출력
# → tests/dom-qa-report.json 생성 확인

# 3. 검증 포인트
#    - QA-001(ButtonIconOnly Neutral 아이콘 색상)이 strict 채널에서 'fail' (ΔE>5)로 검출되어 test 자체가 fail 처리되는지
#    - QA-002(Button 텍스트 너비 차이)는 warn-only 채널에서 'warn'으로만 표시되고 test는 통과(strict fail 없음)하는지
#    - QA-003(Brand IconOnly 1px)이 'pass' (±1px tolerance 내)로 잡히는지
#    - 정상 variant 100여 개가 모두 strict pass 처리되는지
#    - report JSON 구조: { [qaId]: DiffItem[] }, channel 필드로 strict/warn-only 식별 가능한지
```

성공 기준: 기존 QA-REPORT.md의 진단 결과 3건이 자동 비교로 동일하게 재현되며, 각 속성의 정확한 수치(픽셀 차이, ΔE 값)가 리포트에 출력된다.
