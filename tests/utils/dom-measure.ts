import type { Page } from '@playwright/test';

export interface DomTokens {
  background?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
}

export interface DomNumericTokens {
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  cornerRadius?: string;
  borderWidth?: string;
}

export interface DomMetric {
  qaId: string;
  found: boolean;
  width: number;
  height: number;
  backgroundColor: string;
  color: string;
  borderTopColor: string;
  borderTopWidth: number;
  borderRadius: string;
  padding: { top: number; right: number; bottom: number; left: number };
  fontSize: number | null;
  fontWeight: number | null;
  lineHeight: string;
  letterSpacing: string;
  hasLabel: boolean;
  /** className의 Tailwind v4 단축 문법(`bg-(--xxx)` 등)에서 추출한 CSS 변수명. 없으면 필드 없음 */
  tokens?: DomTokens;
  /** className의 Tailwind utility(`p-xl`, `rounded-sm`, `border` 등)에서 추출한 수치 토큰 */
  numericTokens?: DomNumericTokens;
  /** className의 typography @utility(`label-md-regular`)에서 추출한 토큰명 */
  typographyToken?: string;
}

export async function measureAll(page: Page, qaIds: string[]): Promise<Record<string, DomMetric>> {
  return page.evaluate((ids: string[]) => {
    const parsePx = (v: string): number => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };

    /**
     * className 문자열에서 Tailwind v4 단축 문법으로 박힌 CSS 변수명을 추출.
     * 지원 형태:
     *   bg-(--xxx)  text-(--xxx)  border-(--xxx)  outline-(--xxx)
     *   bg-[var(--xxx)] 도 지원 (Tailwind arbitrary value 문법)
     * 상태 변형(hover:/focus-visible:/disabled:)도 캡처.
     * disabled 상태인 element는 `disabled:` 변형 토큰을 base보다 우선 사용.
     */
    const extractTokens = (
      className: string,
      isDisabled: boolean
    ): DomTokens => {
      const props: Array<keyof DomTokens> = ['background', 'borderColor', 'textColor', 'iconColor'];
      const utilByProp: Record<keyof DomTokens, RegExp[]> = {
        background: [
          /(?:^|\s)(disabled:)?bg-\(--([a-zA-Z0-9-]+)\)/g,
          /(?:^|\s)(disabled:)?bg-\[var\(--([a-zA-Z0-9-]+)\)\]/g,
        ],
        textColor: [
          /(?:^|\s)(disabled:)?text-\(--([a-zA-Z0-9-]+)\)/g,
          /(?:^|\s)(disabled:)?text-\[var\(--([a-zA-Z0-9-]+)\)\]/g,
        ],
        borderColor: [
          /(?:^|\s)(disabled:)?border-\(--([a-zA-Z0-9-]+)\)/g,
          /(?:^|\s)(disabled:)?border-\[var\(--([a-zA-Z0-9-]+)\)\]/g,
        ],
        iconColor: [
          // iconColor는 별도 utility가 없음. button.color (text-)와 동일하게 작동하므로
          // ButtonIconOnly 등의 className은 text- utility로 추출됨 → 아래에서 textColor를 복제
        ],
      };

      const result: DomTokens = {};
      for (const prop of props) {
        if (prop === 'iconColor') continue;
        let base: string | undefined;
        let disabled: string | undefined;
        for (const re of utilByProp[prop]) {
          re.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = re.exec(className)) !== null) {
            const varName = `--${m[2]}`;
            if (m[1] === 'disabled:') disabled = varName;
            else base = varName;
          }
        }
        const picked = isDisabled ? (disabled ?? base) : base;
        if (picked) result[prop] = picked;
      }

      // iconColor: 컴포넌트 패턴상 button.color(text-)와 동일 (SVG fill="currentColor")
      if (result.textColor) result.iconColor = result.textColor;
      return result;
    };

    /** Tailwind utility 토큰 사이즈 키 → CSS 변수명 접미사 매핑은 사실상 동일하므로 그대로 사용 */
    const SPACING_KEYS = new Set([
      'none', '4xs', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl',
    ]);
    const RADIUS_KEYS = new Set([
      'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full',
    ]);
    const TYPO_ROLES = new Set(['display', 'heading', 'body', 'label', 'caption']);

    const extractNumericTokens = (className: string): DomNumericTokens => {
      const result: DomNumericTokens = {};

      // padding utility — 마지막에 선언된 것 우선 (Tailwind 동작 일치)
      // 매칭 순서: p- > px-/py- > pt-/pr-/pb-/pl-
      type Sides = { top?: string; right?: string; bottom?: string; left?: string };
      const pad: Sides = {};
      const setSides = (sides: ('top' | 'right' | 'bottom' | 'left')[], value: string): void => {
        for (const s of sides) pad[s] = value;
      };
      // 토큰: prefix-key 형태. 마지막 occurrence가 이김 → split해서 순회
      const tokens = className.split(/\s+/);
      for (const tok of tokens) {
        const m = /^(p|px|py|pt|pr|pb|pl)-([\w-]+)$/.exec(tok);
        if (!m || !SPACING_KEYS.has(m[2])) continue;
        const cssVar = `--sys-spacing-${m[2]}`;
        switch (m[1]) {
          case 'p':
            setSides(['top', 'right', 'bottom', 'left'], cssVar);
            break;
          case 'px':
            setSides(['left', 'right'], cssVar);
            break;
          case 'py':
            setSides(['top', 'bottom'], cssVar);
            break;
          case 'pt':
            pad.top = cssVar;
            break;
          case 'pr':
            pad.right = cssVar;
            break;
          case 'pb':
            pad.bottom = cssVar;
            break;
          case 'pl':
            pad.left = cssVar;
            break;
        }
      }
      if (pad.top) result.paddingTop = pad.top;
      if (pad.right) result.paddingRight = pad.right;
      if (pad.bottom) result.paddingBottom = pad.bottom;
      if (pad.left) result.paddingLeft = pad.left;

      // rounded utility
      for (const tok of tokens) {
        const m = /^rounded-([\w-]+)$/.exec(tok);
        if (m && RADIUS_KEYS.has(m[1])) {
          result.cornerRadius = `--sys-radius-${m[1]}`;
        }
      }

      // border width
      // `border` 단독 → 1px; `border-N` (N ∈ 0..5) → N px;
      // 색상 utility (border-(--xxx), border-[#xxx])는 제외, 방향성도 제외
      let borderWidth: string | undefined;
      for (const tok of tokens) {
        if (tok === 'border') borderWidth = '--global-border-width-1';
        else {
          const m = /^border-(\d)$/.exec(tok);
          if (m) borderWidth = `--global-border-width-${m[1]}`;
        }
      }
      if (borderWidth) result.borderWidth = borderWidth;

      return result;
    };

    const extractTypographyToken = (className: string): string | undefined => {
      const tokens = className.split(/\s+/);
      // 마지막 매칭 우선 (Tailwind 마지막 클래스가 우선이지만 typography는 보통 1개만 사용)
      let found: string | undefined;
      for (const tok of tokens) {
        const m = /^(display|heading|body|label|caption)-([\w-]+?)-(bold|semibold|medium|regular)$/.exec(tok);
        if (m && TYPO_ROLES.has(m[1])) {
          found = `--sys-typo-${m[1]}-${m[2]}-${m[3]}`;
        }
      }
      return found;
    };

    return Object.fromEntries(
      ids.map((qaId) => {
        const el = document.querySelector<HTMLElement>(`[data-qa-id="${qaId}"]`);
        if (!el) {
          return [
            qaId,
            {
              qaId,
              found: false,
              width: 0,
              height: 0,
              backgroundColor: '',
              color: '',
              borderTopColor: '',
              borderTopWidth: 0,
              borderRadius: '',
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              fontSize: null,
              fontWeight: null,
              lineHeight: '',
              letterSpacing: '',
              hasLabel: false,
            } satisfies DomMetric,
          ];
        }

        const rect = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);

        // 라벨 span: aria-hidden 아닌 직계 span
        const labelSpan = Array.from(el.children).find(
          (c) => c.tagName === 'SPAN' && c.getAttribute('aria-hidden') !== 'true'
        ) as HTMLElement | undefined;

        const typoSource = labelSpan ?? el;
        const tcs = window.getComputedStyle(typoSource);

        const fontWeightRaw = parseInt(tcs.fontWeight, 10);

        const isDisabled =
          el.hasAttribute('disabled') ||
          el.getAttribute('aria-disabled') === 'true' ||
          (el as HTMLButtonElement).disabled === true;
        const tokens = extractTokens(el.className, isDisabled);
        const numericTokens = extractNumericTokens(el.className);
        const typographyToken = extractTypographyToken(el.className);

        return [
          qaId,
          {
            qaId,
            found: true,
            width: rect.width,
            height: rect.height,
            backgroundColor: cs.backgroundColor,
            color: cs.color,
            borderTopColor: cs.borderTopColor,
            borderTopWidth: parsePx(cs.borderTopWidth),
            borderRadius: cs.borderRadius,
            padding: {
              top: parsePx(cs.paddingTop),
              right: parsePx(cs.paddingRight),
              bottom: parsePx(cs.paddingBottom),
              left: parsePx(cs.paddingLeft),
            },
            fontSize: parsePx(tcs.fontSize),
            fontWeight: Number.isFinite(fontWeightRaw) ? fontWeightRaw : null,
            lineHeight: tcs.lineHeight,
            letterSpacing: tcs.letterSpacing,
            hasLabel: Boolean(labelSpan),
            tokens: Object.keys(tokens).length > 0 ? tokens : undefined,
            numericTokens: Object.keys(numericTokens).length > 0 ? numericTokens : undefined,
            typographyToken,
          } satisfies DomMetric,
        ];
      })
    ) as Record<string, DomMetric>;
  }, qaIds);
}
