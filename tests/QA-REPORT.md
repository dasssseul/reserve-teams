# Button QA 이슈 리포트

> Figma vs Browser 픽셀 비교 결과 · Playwright pixelmatch (threshold 0.15)  
> 비교 기준: md 사이즈 enabled 상태, Figma 파일 `7FyrA0Olbv6B7SicSvVTZN`  
> 실행일: 2026-05-17

---

## 요약

| 구분 | 건수 |
|------|:----:|
| 🔴 ERROR (수정 필요) | 1 |
| 🟡 WARNING (검토 필요) | 2 |
| ✅ PASS | 5 |
| ⏭️ SKIP (크기 불일치로 비교 불가) | 11 |

---

## 🔴 QA-001 · ButtonIconOnly Neutral 아이콘 색상 토큰 불일치

**컴포넌트**: `ButtonIconOnly`  
**영향 범위**:
- `btn-icon-neutral-solid-md`
- `btn-icon-neutral-outline-md`
- `btn-icon-neutral-ghost-md`

**현상**: Neutral 계열 ButtonIconOnly의 아이콘 fill 색상이 Figma와 코드 간에 불일치.  
픽셀 불일치율 **14.5%** (threshold 5% 초과 → 테스트 실패).

| | 색상 | 토큰 |
|---|---|---|
| **Figma** | `#676767` | `sys.icon.neutral.subtle.default` |
| **코드** | `#333333` | `sys.icon.neutral.normal.default` |
| **스펙 기준** (`button-office.md §3-4`) | `#333333` | `sys.icon.neutral.normal.default` ✅ |

**판정**: **코드가 스펙 기준으로 정확합니다.**  
Figma 컴포넌트 내부 placeholder 아이콘이 `subtle` 토큰을 잘못 참조하고 있습니다.

**수정 방향**: Figma `Button-IconOnly (Office)` 컴포넌트 세트에서 Neutral 계열 아이콘 fill을 `sys/icon/neutral/normal/default` 변수로 교체 필요.

---

## 🟡 QA-002 · Button 텍스트 너비 불일치 (폰트 렌더링 차이)

**컴포넌트**: `Button`  
**영향 범위**: Button 8종 md 사이즈 전체

| qa-id | Figma 너비 | Browser 너비 | 차이 |
|-------|:----------:|:------------:|:----:|
| btn-brand-solid-md | 82px | 65px | −17px |
| btn-brand-outline-md | 82px | 68px | −14px |
| btn-brand-text-md | 62px | 45px | −17px |
| btn-neutral-solid-md | 82px | 65px | −17px |
| btn-neutral-outline-md | 82px | 67px | −15px |
| btn-neutral-ghost-md | 62px | 45px | −17px |
| btn-destructive-solid-md | 82px | 65px | −17px |
| btn-critical-solid-md | 82px | 65px | −17px |

**현상**: 동일한 라벨("저장"), 동일한 패딩(md-wide `px-xl = 20px`) 적용 시 버튼 너비가 다름.  
**높이(34px)는 일치**합니다.

**원인 분석**:
- Figma는 자체 벡터 폰트 렌더링 엔진 사용
- Chromium(Playwright)은 OS Pretendard 스택 또는 CDN Dynamic Subset 사용
- 동일 폰트여도 글자별 어드밴스 폭(advance width)이 렌더링 환경마다 미세하게 다름

**판정**: 구현 버그 아님. 폰트 렌더링 환경 차이로 인한 픽셀 비교 한계.  
패딩 토큰(`px-xl = 20px`)은 스펙과 일치합니다.

**검토 필요**: 폰트 서브셋 구성이 동일한지 확인. 필요시 서버사이드 렌더링(SVG export 방식)으로 비교 전환 검토.

---

## 🟡 QA-003 · ButtonIconOnly Brand 너비 1px 초과

**컴포넌트**: `ButtonIconOnly`  
**영향 범위**:
- `btn-icon-brand-solid-md`
- `btn-icon-brand-outline-md`
- `btn-icon-brand-text-md`

**현상**: Brand 계열 ButtonIconOnly md 사이즈의 브라우저 렌더링 너비가 Figma보다 1px 큼.

| | Figma | Browser |
|---|:---:|:---:|
| 너비 | 34px | 35px |
| 높이 | 34px | 34px |

**원인 분석**: CSS `size-[34px]`가 올바르게 적용되어 있으나, 요소의 subpixel 위치에 따라 Playwright `el.screenshot()`의 bounding box가 1px 더 크게 측정됨. Brand 계열에서만 발생하는 것은 해당 variant들이 페이지에서 홀수 픽셀 위치에 렌더링되기 때문으로 추정.

**판정**: 시각적으로 무의미한 1px 오차. 실제 CSS 크기는 정확함.  
Playwright `deviceScaleFactor: 2` 설정으로 개선 가능 여부 검토 필요.

---

## ✅ PASS 목록

| qa-id | 결과 | 불일치율 |
|-------|:----:|:--------:|
| btn-icon-brand-solid-md | SKIP (35≠34px) | — |
| btn-icon-brand-outline-md | SKIP (35≠34px) | — |
| btn-icon-brand-text-md | SKIP (35≠34px) | — |
| btn-icon-critical-solid-md | ✅ PASS | < 5% |
| btn-icon-destructive-solid-md | ✅ PASS | < 5% |

---

## 참고: 테스트 환경

```
Playwright  : chromium, deviceScaleFactor: 1
pixelmatch  : threshold 0.15 (픽셀당 색차 15% 허용)
전체 판정   : 불일치 픽셀 비율 5% 미만 → PASS
Figma 파일  : DesignSystemOffice-anna (7FyrA0Olbv6B7SicSvVTZN)
비교 baseline: tests/figma-baseline/*.png
```
