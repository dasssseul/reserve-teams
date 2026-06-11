# Hiworks Office — 프로젝트 컨텍스트

## 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- 디자인 토큰: Hiworks DS v3 (Global → Sys → Service 3단계)

---

## 컴포넌트 구조

```
src/
  components/
    Button/
      Button.tsx          ← 메인 컴포넌트
      Button.types.ts     ← Props 타입 정의
      index.ts            ← re-export
    Input/
      ...
```

### 컴포넌트 Props 설계 원칙 (`docs/policy/component-property-policy.md`)

Button · Input · Checkbox 등 인터랙티브 컴포넌트는 **3축 분리 정책** 적용:

| Prop | 타입 | 설명 |
|------|------|------|
| `availability` | `'enabled' \| 'disabled'` | 사용 가능 여부 (구조적 상태) |
| `interaction` | `'rest' \| 'hover'` | 일시적 인터랙션 상태 (CSS로 처리, prop은 Figma 대응용) |
| `role` | 컴포넌트별 | 시각 역할 (Brand / Neutral / ...) |
| `style` | 컴포넌트별 | 외형 스타일 (Solid / Outline / ...) |
| `size` | 컴포넌트별 | xs / sm / md / lg |

> `disabled`는 HTML `disabled` attribute + `availability='disabled'` 병행 사용.
> `validation`(None/Error/Warning/Success)은 Form 입력 컴포넌트 전용 — Button은 미사용.

---

## 포커스 링 (FocusVisible)

`:focus-visible` 시 outline 방식으로 처리. Tailwind v4 CSS 변수 단축 문법 사용:

```tsx
// 모든 인터랙티브 컴포넌트 공통 패턴
className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--office-bg-brand-strong-default)"
```

- width: 2px
- offset: 2px
- color: `var(--office-bg-brand-strong-default)` (#1c7fd3)
- CSS pseudo-class: `:focus-visible` (`:focus` 사용 금지)

> Figma의 `🎯 Focus Ring 가이드` Frame 기준. Variant matrix에 포함되지 않는 별도 레이어.

---

## 컴포넌트 스펙 문서 (docs/)

컴포넌트 구현 전 반드시 해당 스펙 문서를 먼저 읽을 것.

| 문서 | 내용 |
|------|------|
| `docs/policy/component-property-policy.md` | Props 3축 분리 정책, 명명 규칙 전체 |
| `docs/components/button-office.md` | Button 토큰 매핑, 사이즈 스펙, 유효 조합 |

---

## 디자인 토큰 시스템

### 파일 위치

```
tokens/
  global-tokens.json   ← 팔레트 원자값 (hex, px 등)
  sys-tokens.json      ← 역할 기반 시맨틱 토큰 (전 서비스 공통)
  service-tokens.json  ← 서비스별 브랜드 토큰 (office, hr)
  typography_sys.json  ← 타이포그래피 복합 토큰 (32개)
```

토큰 JSON 수정 후 반드시 실행:
```bash
pnpm build:tokens
```

생성 결과: `src/styles/generated/tokens.css` (git-ignored, 자동 생성)

---

## CSS 변수 네이밍 규칙

피그마 인스펙터 출력과 1:1 대응.

| 피그마 토큰 경로 | CSS 변수 |
|----------------|---------|
| `service/office/bg/brand/strong/default` | `--office-bg-brand-strong-default` |
| `service/office/bg/brand/strong/active` | `--office-bg-brand-strong-active` |
| `service/office/text/brand/strong/default` | `--office-text-brand-strong-default` |
| `sys/bg/neutral/subtle/default` | `--sys-bg-neutral-subtle-default` |
| `sys/text/neutral/inverse/default` | `--sys-text-neutral-inverse-default` |
| `sys/stroke/neutral/subtle/default` | `--sys-stroke-neutral-subtle-default` |
| `sys/icon/neutral/normal/default` | `--sys-icon-neutral-normal-default` |
| `global/color/blue/50` | `--global-color-blue-50` |

**변환 규칙:**
- `service/` 레이어 제거, 서비스명 유지 → `office-*`, `hr-*`
- `sys/bg|text|stroke|icon|overlay` → `sys-` 프리픽스 유지
- `/` → `-` 치환, 계층 전체 포함

---

## Tailwind 클래스 사용법

### 색상 — CSS 변수 단축 문법 (Tailwind v4)

Tailwind v4에서 CSS 변수는 `(--variable-name)` 단축 문법을 사용한다.

```tsx
// ✅ 올바른 방법 — Tailwind v4 단축 문법
<button className="bg-(--office-bg-brand-strong-default) text-(--sys-text-neutral-inverse-default)">
  저장
</button>

// ✅ 상태 변형
<button className="
  bg-(--office-bg-brand-strong-default)
  hover:bg-(--office-bg-brand-strong-active)
  disabled:bg-(--office-bg-brand-strong-disabled)
">

// ❌ raw 값 직접 사용 금지
<button style={{ background: '#1c7fd3' }}>
<button className="bg-[#1c7fd3]">
```

> `bg-(--foo)`는 `bg-[var(--foo)]`와 동일. Tailwind v4 정식 단축 문법.

### Spacing — Tailwind 유틸리티 클래스

`sys/spacing/*` 토큰이 `@theme`에 등록되어 있다.

```
--spacing-none → p-none, m-none, gap-none
--spacing-5xs  → p-5xs, px-5xs  (1px)
--spacing-4xs  → p-4xs          (2px)
--spacing-3xs  → p-3xs          (4px)
--spacing-2xs  → p-2xs          (6px)
--spacing-xs   → p-xs, px-xs    (8px)
--spacing-sm   → p-sm, px-sm    (10px)
--spacing-md   → p-md, px-md    (12px)
--spacing-lg   → p-lg           (16px)
--spacing-xl   → p-xl           (20px)
--spacing-2xl  → p-2xl          (24px)
--spacing-3xl  → p-3xl          (32px)
--spacing-4xl  → p-4xl          (40px)
--spacing-5xl  → p-5xl          (48px)
--spacing-6xl  → p-6xl          (64px)
```

### Border Radius — Tailwind 유틸리티 클래스

`sys/radius/*` 토큰이 `@theme`에 등록되어 있다.

```
rounded-none → 0px
rounded-xs   → 2px
rounded-sm   → 4px
rounded-md   → 6px
rounded-lg   → 8px
rounded-xl   → 12px
rounded-2xl  → 16px
rounded-3xl  → 20px
rounded-4xl  → 24px
rounded-full → 9999px
```

### Shadow — Tailwind 유틸리티 클래스

`sys/elevation/*` 토큰이 `@theme`에 등록되어 있다.

```
shadow-lv0 → 그림자 없음
shadow-lv1 → 미세 부상감 (카드 hover 등)
shadow-lv2 → 카드 기본
shadow-lv3 → 드롭다운/팝오버
shadow-lv4 → 모달/사이드패널
shadow-lv5 → 풀스크린 오버레이
```

### Typography — @utility 클래스

`sys/typo/*` 토큰이 `@utility`로 등록되어 있다. 클래스명: `{role}-{size}-{weight}`.

```
display-2xl-bold       48px / 700 / lh 58px / ls -2%
display-xl-bold        40px / 700 / lh 48px / ls -2%
display-lg-semibold    36px / 600 / lh 43px / ls -2%
display-md-semibold    32px / 600 / lh 38px / ls -2%

heading-xxl-semibold   28px / 600 / lh 34px
heading-xl-semibold    24px / 600 / lh 29px
heading-lg-semibold    20px / 600 / lh 24px
heading-md-semibold    18px / 600 / lh 25px
heading-sm-semibold    16px / 600 / lh 22px
heading-xs-semibold    14px / 600 / lh 20px

body-lg-regular        16px / 400 / lh 24px
body-lg-semibold       16px / 600 / lh 24px
body-md-regular        14px / 400 / lh 21px  ★ 기본값
body-md-semibold       14px / 600 / lh 21px
body-sm-regular        13px / 400 / lh 20px

label-lg-semibold      18px / 600 / lh 25px
label-lg-regular       18px / 400 / lh 25px
label-md-semibold      14px / 600 / lh 18px  ★ 버튼 기본
label-md-regular       14px / 400 / lh 18px
label-sm-semibold      13px / 600 / lh 17px
label-sm-regular       13px / 400 / lh 17px
label-xs-semibold      12px / 600 / lh 17px
label-xs-medium        12px / 500 / lh 17px

caption-md-regular     12px / 400 / lh 18px
caption-md-medium      12px / 500 / lh 18px
caption-sm-medium      11px / 500 / lh 17px
caption-xs-medium      10px / 500 / lh 15px / ls +2%
```

---

## 컴포넌트 작성 예시

```tsx
// CTA 버튼 (Office 브랜드 solid)
<button
  className="
    inline-flex items-center gap-xs
    px-xl py-2xs
    rounded-sm
    bg-(--office-bg-brand-strong-default)
    hover:bg-(--office-bg-brand-strong-active)
    disabled:bg-(--office-bg-brand-strong-disabled)
    text-(--sys-text-neutral-inverse-default)
    label-md-regular
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--office-bg-brand-strong-default)
    border-none cursor-pointer
  "
>
  저장
</button>

// Input 기본
<input
  className="
    w-full px-md py-xs
    rounded-sm
    bg-(--sys-bg-neutral-faint-default)
    border border-(--sys-stroke-neutral-subtle-default)
    focus:border-(--sys-stroke-neutral-strong-default)
    text-(--sys-text-neutral-normal-default)
    placeholder:text-(--sys-text-neutral-muted-default)
    body-md-regular
    outline-none
  "
/>

// 에러 메시지
<p className="caption-md-medium text-(--sys-text-alert-normal-default)">
  필수 입력 항목입니다.
</p>
```

---

## 주요 토큰 빠른 참조

### Office 브랜드 컬러 (CTA 버튼)

| 용도 | CSS 변수 |
|------|---------|
| 버튼 배경 기본 | `--office-bg-brand-strong-default` (#1c7fd3) |
| 버튼 배경 hover | `--office-bg-brand-strong-active` (#0062c1) |
| 버튼 배경 disabled | `--office-bg-brand-strong-disabled` (#b0ceec) |
| 버튼 위 텍스트 | `--sys-text-neutral-inverse-default` (#ffffff) |
| 텍스트/아이콘 기본 | `--office-text-brand-normal-default` (#1c7fd3) |
| 텍스트/아이콘 강조 | `--office-text-brand-strong-default` (#0062c1) |
| 아이콘 기본 | `--office-icon-brand-normal-default` (#1c7fd3) |
| 테두리 기본 | `--office-stroke-brand-normal-default` (#1c7fd3) |

### 중립 UI 컬러 (공통)

| 용도 | CSS 변수 |
|------|---------|
| 기본 텍스트 | `--sys-text-neutral-normal-default` (#333333) |
| 보조 텍스트 | `--sys-text-neutral-subtle-default` (#676767) |
| 비활성 텍스트 | `--sys-text-neutral-muted-default` (#909090) |
| 기본 아이콘 | `--sys-icon-neutral-normal-default` (#333333) |
| 일반 보더 | `--sys-stroke-neutral-subtle-default` (#d6d6d6) |
| 기본 배경 | `--sys-bg-neutral-faint-default` (#ffffff) |
| subtle 배경 | `--sys-bg-neutral-subtle-default` (#eaeaea) |
| muted 배경 | `--sys-bg-neutral-muted-default` (#f7f7f7) |

### 시맨틱 컬러

| 역할 | 배경 강조 | 텍스트 | 테두리 |
|------|----------|--------|--------|
| positive (성공) | `--sys-bg-positive-strong-default` | `--sys-text-positive-normal-default` | `--sys-stroke-positive-normal-default` |
| warning (경고) | `--sys-bg-warning-strong-default` | `--sys-text-warning-normal-default` | `--sys-stroke-warning-normal-default` |
| alert (오류) | `--sys-bg-alert-strong-default` | `--sys-text-alert-normal-default` | `--sys-stroke-alert-normal-default` |
| informative (정보) | `--sys-bg-informative-strong-default` | `--sys-text-informative-normal-default` | `--sys-stroke-informative-normal-default` |

---

## 토큰 수정 흐름

1. `tokens/*.json` 수정
2. `pnpm build:tokens` 실행
3. `src/styles/generated/tokens.css` 자동 갱신
4. 코드에서 CSS 변수명 그대로 사용
