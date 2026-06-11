# Sys Text Style — Line Height px 계산표

> Figma Variables에서 line-height는 % 바인딩 불가 → Text Style 작성 시 px 직접 입력
> 계산식: `font-size(px) × line-height 비율 = 입력값(px)`, 소수점은 반올림
> **2026-05-13 갱신** — Figma 실측 기준으로 전면 정정 (32개 토큰)

---

## Display (4)

| Token | Font Size | **LH (px)** | LH 카테고리 | 실제 비율 | LS |
|-------|-----------|-------------|-------------|-----------|-----|
| `sys/typo/display/2xl/bold` | 48 | **58** | tight | 120.8% | -2% |
| `sys/typo/display/xl/bold` | 40 | **48** | tight | 120.0% | -2% |
| `sys/typo/display/lg/semibold` | 36 | **43** | tight | 119.4% | -2% |
| `sys/typo/display/md/semibold` | 32 | **38** | tight | 118.8% | -2% |

## Heading (6)

| Token | Font Size | **LH (px)** | LH 카테고리 | 실제 비율 | LS |
|-------|-----------|-------------|-------------|-----------|-----|
| `sys/typo/heading/xxl/semibold` | 28 | **34** | tight | 121.4% | 0% |
| `sys/typo/heading/xl/semibold` | 24 | **29** | tight | 120.8% | 0% |
| `sys/typo/heading/lg/semibold` | 20 | **24** | tight | 120.0% | 0% |
| `sys/typo/heading/md/semibold` | 18 | **25** | compact | 138.9% | 0% |
| `sys/typo/heading/sm/semibold` | 16 | **22** | compact | 137.5% | 0% |
| `sys/typo/heading/xs/semibold` | 14 | **20** | compact | 142.9% | 0% |

## Body (5)

| Token | Font Size | **LH (px)** | LH 카테고리 | 실제 비율 | LS |
|-------|-----------|-------------|-------------|-----------|-----|
| `sys/typo/body/lg/regular` | 16 | **24** | normal | 150.0% | 0% |
| `sys/typo/body/lg/semibold` | 16 | **24** | normal | 150.0% | 0% |
| `sys/typo/body/md/regular` ★ | 14 | **21** | normal | 150.0% | 0% |
| `sys/typo/body/md/semibold` | 14 | **21** | normal | 150.0% | 0% |
| `sys/typo/body/sm/regular` | 13 | **20** | normal | 153.8% | 0% |

★ = 전체 UI 기본값

## Label (8)

| Token | Font Size | **LH (px)** | LH 카테고리 | 실제 비율 | LS |
|-------|-----------|-------------|-------------|-----------|-----|
| `sys/typo/label/lg/semibold` | 18 | **25** | compact | 138.9% | 0% |
| `sys/typo/label/lg/regular` | 18 | **25** | compact | 138.9% | 0% |
| `sys/typo/label/md/semibold` | 14 | **18** | compact ⚠️ | 128.6% | 0% |
| `sys/typo/label/md/regular` | 14 | **18** | compact ⚠️ | 128.6% | 0% |
| `sys/typo/label/sm/semibold` | 13 | **17** | compact ⚠️ | 130.8% | 0% |
| `sys/typo/label/sm/regular` | 13 | **17** | compact ⚠️ | 130.8% | 0% |
| `sys/typo/label/xs/semibold` | 12 | **17** | compact | 141.7% | 0% |
| `sys/typo/label/xs/medium` | 12 | **17** | compact | 141.7% | 0% |

⚠️ = compact 의도 비율(140%)과 실제 비율 간 ~10%p 차이. 디자이너 의도 확인 필요 (정수 px 보정인지, 실측 수정 필요인지)

## Caption (4)

| Token | Font Size | **LH (px)** | LH 카테고리 | 실제 비율 | LS |
|-------|-----------|-------------|-------------|-----------|-----|
| `sys/typo/caption/md/regular` | 12 | **18** | normal | 150.0% | 0% |
| `sys/typo/caption/md/medium` | 12 | **18** | normal | 150.0% | 0% |
| `sys/typo/caption/sm/medium` | 11 | **17** | normal | 154.5% | 0% |
| `sys/typo/caption/xs/medium` | 10 | **15** | normal | 150.0% | +2% |

---

## 한눈에 보기 — Figma 입력값 요약 (32개)

| Role | Size | Weight | Font Size | Line Height | Letter Spacing |
|------|------|--------|-----------|-------------|----------------|
| display | 2xl | bold | 48 | **58** | -2% |
| display | xl | bold | 40 | **48** | -2% |
| display | lg | semibold | 36 | **43** | -2% |
| display | md | semibold | 32 | **38** | -2% |
| heading | xxl | semibold | 28 | **34** | 0% |
| heading | xl | semibold | 24 | **29** | 0% |
| heading | lg | semibold | 20 | **24** | 0% |
| heading | md | semibold | 18 | **25** | 0% |
| heading | sm | semibold | 16 | **22** | 0% |
| heading | xs | semibold | 14 | **20** | 0% |
| body | lg | regular | 16 | **24** | 0% |
| body | lg | semibold | 16 | **24** | 0% |
| body | md | regular | 14 | **21** | 0% |
| body | md | semibold | 14 | **21** | 0% |
| body | sm | regular | 13 | **20** | 0% |
| label | lg | regular | 18 | **25** | 0% |
| label | lg | semibold | 18 | **25** | 0% |
| label | md | regular | 14 | **18** | 0% |
| label | md | semibold | 14 | **18** | 0% |
| label | sm | regular | 13 | **17** | 0% |
| label | sm | semibold | 13 | **17** | 0% |
| label | xs | medium | 12 | **17** | 0% |
| label | xs | semibold | 12 | **17** | 0% |
| caption | md | regular | 12 | **18** | 0% |
| caption | md | medium | 12 | **18** | 0% |
| caption | sm | medium | 11 | **17** | 0% |
| caption | xs | medium | 10 | **15** | +2% |

---

## LH 카테고리 의도 (어휘)

- **tight (~120%)**: display 전체, heading xxl~lg
- **compact (~140%)**: heading md~xs, label 전체
- **normal (~150%)**: body 전체, caption 전체

> 카테고리는 디자이너 의도. 실제 비율은 정수 px 반올림으로 어휘 비율과 차이 가능 (특히 작은 사이즈).

---

## Letter Spacing 변수 매핑 (Figma)

| 토큰 | Figma Variable | 값 |
|---|---|---|
| `-2%` | `font/letterSpacing/tight` | -2 |
| `0%` | `font/letterSpacing/normal` | 0 |
| `+2%` | `font/letterSpacing/wide` | 2 |

→ JSON 토큰에서는 % 표기, Figma Variable bind 시 단위 없는 숫자.

---

## Figma 실측 검증

2026-05-13: Anna + Claude가 `mcp__Figma__get_variable_defs`로 sys/typo 32개 Text Style 모두 실측. 각 Text Style의 family/size/weight/letterSpacing은 global Variables alias로 bind됨. lineHeight만 raw px 입력 (Figma % bind 한계).

당시 발견된 sys 부정합 3건은 Anna가 즉시 Figma에서 수정 완료:
- `sys/typo/label/sm/regular`: family raw + letterSpacing 0 raw → Variable alias로 재바인딩
- `sys/typo/label/xs/semibold`: letterSpacing 0 raw → Variable alias로 재바인딩
- `sys/typo/label/xs/medium`: letterSpacing 0 raw → Variable alias로 재바인딩

---

## 관련 문서

- `tokens/typography_sys.json` — sys 원본 JSON
- `docs/policy/token-override-policy.md` — service 측 오버라이드 정책

---

## 갱신 이력

- **2026-05-13**: Figma 실측 기준 전면 정정
  - heading: 5단계 → **6단계로 확장** (xxl 추가)
  - label: 사이즈/weight 옵션 정정 (medium → regular, 사이즈 1~4px 조정)
  - caption: sm/xs weight 정정 (regular → medium)
  - 총 32개 토큰 반영
- (이전 버전): heading 5단계, label 사이즈 14/13/12 기준 — outdated
