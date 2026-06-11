import type {
  ButtonIconOnlyProps,
  ButtonBtnStyle,
  ButtonRole,
} from './Button.types';

// ─── 사이즈 매핑 (docs/components/button-office.md §5-4) ─────────────────────
// lg 미지원 — xs/sm/md만 운영

interface IconOnlySize {
  box: string;
  iconPx: number;
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md', IconOnlySize> = {
  xs: { box: 'size-[24px]', iconPx: 12 },
  sm: { box: 'size-[26px]', iconPx: 14 },
  md: { box: 'size-[34px]', iconPx: 18 },
};

// ─── 토큰 매핑 (button-office.md §5-3: 표준 Button §3과 동일, text 제외) ────

interface IconOnlyVariant {
  base: string;
  hover: string;
  disabled: string;
}

const VARIANT_MAP: Record<string, IconOnlyVariant> = {
  'Brand-Solid': {
    base: 'bg-(--office-bg-brand-strong-default) border-0',
    hover: 'hover:bg-(--office-bg-brand-strong-active)',
    disabled: 'disabled:bg-(--office-bg-brand-strong-disabled)',
  },
  'Brand-Outline': {
    base: 'bg-(--sys-bg-neutral-faint-default) border border-solid border-(--sys-stroke-neutral-subtle-default)',
    hover: 'hover:border-(--office-stroke-brand-normal-default)',
    disabled: 'disabled:border-(--sys-stroke-neutral-subtle-default)',
  },
  'Brand-Text': {
    base: 'bg-transparent border-0',
    hover: 'hover:bg-(--sys-bg-neutral-subtle-default)',
    disabled: 'disabled:bg-transparent',
  },
  'Neutral-Solid': {
    base: 'bg-(--sys-bg-neutral-subtle-default) border-0',
    hover: 'hover:bg-(--sys-bg-neutral-subtle-active)',
    disabled: 'disabled:bg-(--sys-bg-neutral-subtle-disabled)',
  },
  'Neutral-Outline': {
    base: 'bg-(--sys-bg-neutral-faint-default) border border-solid border-(--sys-stroke-neutral-subtle-default)',
    hover: 'hover:bg-(--sys-bg-neutral-faint-active)',
    disabled: 'disabled:bg-(--sys-bg-neutral-faint-default)',
  },
  'Neutral-Ghost': {
    base: 'bg-transparent border-0',
    hover: 'hover:bg-(--sys-bg-neutral-subtle-default)',
    disabled: 'disabled:bg-transparent',
  },
  'Destructive-Solid': {
    base: 'bg-(--sys-bg-neutral-strong-default) border-0',
    hover: 'hover:bg-(--sys-bg-neutral-strong-active)',
    disabled: 'disabled:bg-(--sys-bg-neutral-strong-disabled)',
  },
  'Critical-Solid': {
    base: 'bg-(--sys-bg-alert-strong-default) border-0',
    hover: 'hover:bg-(--sys-bg-alert-strong-active)',
    disabled: 'disabled:bg-(--sys-bg-alert-strong-disabled)',
  },
};

// 아이콘 색상 — SVG currentColor 기반
const ICON_COLOR_MAP: Record<string, { normal: string; disabled: string }> = {
  'Brand-Solid': {
    normal: 'text-(--sys-icon-neutral-inverse-default)',
    disabled: 'text-(--sys-icon-neutral-inverse-default)',
  },
  'Brand-Outline': {
    normal: 'text-(--office-icon-brand-normal-default)',
    disabled: 'text-(--office-icon-brand-normal-disabled)',
  },
  'Brand-Text': {
    normal: 'text-(--office-icon-brand-normal-default)',
    disabled: 'text-(--office-icon-brand-normal-disabled)',
  },
  'Neutral-Solid': {
    normal: 'text-(--sys-icon-neutral-normal-default)',
    disabled: 'text-(--sys-icon-neutral-normal-disabled)',
  },
  'Neutral-Outline': {
    normal: 'text-(--sys-icon-neutral-normal-default)',
    disabled: 'text-(--sys-icon-neutral-normal-disabled)',
  },
  'Neutral-Ghost': {
    normal: 'text-(--sys-icon-neutral-normal-default)',
    disabled: 'text-(--sys-icon-neutral-normal-disabled)',
  },
  'Destructive-Solid': {
    normal: 'text-(--sys-icon-neutral-inverse-default)',
    disabled: 'text-(--sys-icon-neutral-inverse-default)',
  },
  'Critical-Solid': {
    normal: 'text-(--sys-icon-neutral-inverse-default)',
    disabled: 'text-(--sys-icon-neutral-inverse-default)',
  },
};

function getVariantKey(role: ButtonRole, style: ButtonBtnStyle): string {
  return `${role}-${style}`;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function ButtonIconOnly({
  icon,
  role = 'Brand',
  btnStyle = 'Solid',
  size = 'md',
  availability = 'enabled',
  className,
  onClick,
  ...rest
}: ButtonIconOnlyProps) {
  const isDisabled = availability === 'disabled';
  const variantKey = getVariantKey(role, btnStyle);
  const variant = VARIANT_MAP[variantKey];
  const iconColor = ICON_COLOR_MAP[variantKey];
  const sizeConfig = SIZE_MAP[size];
  const qaId = `btn-icon-${role.toLowerCase()}-${btnStyle.toLowerCase()}-${size}${isDisabled ? '-disabled' : ''}`;

  const classes = [
    'inline-flex items-center justify-center select-none',
    'rounded-sm',
    sizeConfig.box,
    variant.base,
    variant.hover,
    variant.disabled,
    isDisabled ? iconColor.disabled : iconColor.normal,
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--office-bg-brand-strong-default)',
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={classes}
      {...rest}
      data-qa-id={qaId}
    >
      <span
        className="shrink-0 flex items-center justify-center"
        style={{ width: sizeConfig.iconPx, height: sizeConfig.iconPx }}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
}
