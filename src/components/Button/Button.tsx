import type {
  ButtonProps,
  ButtonBtnStyle,
  ButtonRole,
  ButtonSize,
} from './Button.types';

// ─── 토큰 매핑 (docs/components/button-office.md §3) ─────────────────────────

interface VariantClasses {
  base: string;
  hover: string;
  disabled: string;
}

const VARIANT_MAP: Record<string, VariantClasses> = {
  'Brand-Solid': {
    base: 'bg-(--office-bg-brand-strong-default) text-(--sys-text-neutral-inverse-default) border-0',
    hover: 'hover:bg-(--office-bg-brand-strong-active)',
    disabled: 'disabled:bg-(--office-bg-brand-strong-disabled)',
  },
  'Brand-Outline': {
    base: 'bg-(--sys-bg-neutral-faint-default) text-(--office-text-brand-normal-default) border border-solid border-(--sys-stroke-neutral-subtle-default)',
    hover: 'hover:border-(--office-stroke-brand-normal-default)',
    disabled:
      'disabled:text-(--office-text-brand-normal-disabled) disabled:border-(--sys-stroke-neutral-subtle-default)',
  },
  'Brand-Text': {
    base: 'bg-transparent text-(--office-text-brand-normal-default) border-0',
    hover:
      'hover:bg-(--sys-bg-neutral-subtle-default) hover:text-(--office-text-brand-strong-default)',
    disabled:
      'disabled:bg-transparent disabled:text-(--office-text-brand-normal-disabled)',
  },
  'Neutral-Solid': {
    base: 'bg-(--sys-bg-neutral-subtle-default) text-(--sys-text-neutral-normal-default) border-0',
    hover:
      'hover:bg-(--sys-bg-neutral-subtle-active) hover:text-(--sys-text-neutral-normal-active)',
    disabled:
      'disabled:bg-(--sys-bg-neutral-subtle-disabled) disabled:text-(--sys-text-neutral-normal-disabled)',
  },
  'Neutral-Outline': {
    base: 'bg-(--sys-bg-neutral-faint-default) text-(--sys-text-neutral-normal-default) border border-solid border-(--sys-stroke-neutral-subtle-default)',
    hover:
      'hover:bg-(--sys-bg-neutral-faint-active) hover:text-(--sys-text-neutral-normal-active)',
    disabled:
      'disabled:bg-(--sys-bg-neutral-faint-default) disabled:text-(--sys-text-neutral-normal-disabled)',
  },
  'Neutral-Ghost': {
    base: 'bg-transparent text-(--sys-text-neutral-normal-default) border-0',
    hover:
      'hover:bg-(--sys-bg-neutral-subtle-default) hover:text-(--sys-text-neutral-normal-active)',
    disabled:
      'disabled:bg-transparent disabled:text-(--sys-text-neutral-normal-disabled)',
  },
  'Destructive-Solid': {
    base: 'bg-(--sys-bg-neutral-strong-default) text-(--sys-text-neutral-inverse-default) border-0',
    hover: 'hover:bg-(--sys-bg-neutral-strong-active)',
    disabled: 'disabled:bg-(--sys-bg-neutral-strong-disabled)',
  },
  'Critical-Solid': {
    base: 'bg-(--sys-bg-alert-strong-default) text-(--sys-text-neutral-inverse-default) border-0',
    hover: 'hover:bg-(--sys-bg-alert-strong-active)',
    disabled: 'disabled:bg-(--sys-bg-alert-strong-disabled)',
  },
};

// ─── 사이즈 매핑 (docs/components/button-office.md §4-1) ─────────────────────

const HEIGHT_MAP: Record<ButtonSize, string> = {
  xs: 'h-[24px]',
  sm: 'h-[26px]',
  md: 'h-[34px]',
  lg: 'h-[44px]',
};

const GAP_MAP: Record<ButtonSize, string> = {
  xs: 'gap-3xs',
  sm: 'gap-3xs',
  md: 'gap-2xs',
  lg: 'gap-sm',
};

const TYPO_MAP: Record<ButtonSize, string> = {
  xs: 'label-xs-medium',
  sm: 'label-sm-regular',
  md: 'label-md-regular',
  lg: 'label-lg-regular',
};

// Solid·Outline vs Text·Ghost 가로 패딩 차등 (v11 정책)
const PADDING_MAP: Record<string, string> = {
  'xs-wide': 'px-sm', // 10px
  'sm-wide': 'px-sm', // 10px
  'md-wide': 'px-xl', // 20px
  'lg-wide': 'px-6xl', // 56px
  'xs-narrow': 'px-2xs', // 6px
  'sm-narrow': 'px-xs', // 8px
  'md-narrow': 'px-sm', // 10px
  'lg-narrow': 'px-md', // 12px
};

const ICON_SIZE_PX: Record<ButtonSize, number> = {
  xs: 12,
  sm: 12,
  md: 13,
  lg: 14,
};

function isWideStyle(style: ButtonBtnStyle): boolean {
  return style === 'Solid' || style === 'Outline';
}

function getVariantKey(role: ButtonRole, style: ButtonBtnStyle): string {
  return `${role}-${style}`;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function Button({
  label,
  role = 'Brand',
  btnStyle = 'Solid',
  size = 'md',
  availability = 'enabled',
  iconPosition = 'none',
  icon,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = availability === 'disabled';
  const variantKey = getVariantKey(role, btnStyle);
  const variant = VARIANT_MAP[variantKey];
  const paddingKey = `${size}-${isWideStyle(btnStyle) ? 'wide' : 'narrow'}`;
  const qaId = `btn-${role.toLowerCase()}-${btnStyle.toLowerCase()}-${size}${isDisabled ? '-disabled' : ''}`;

  const classes = [
    'inline-flex items-center justify-center select-none',
    'rounded-sm',
    HEIGHT_MAP[size],
    PADDING_MAP[paddingKey],
    GAP_MAP[size],
    TYPO_MAP[size],
    variant.base,
    variant.hover,
    variant.disabled,
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--office-bg-brand-strong-default)',
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = ICON_SIZE_PX[size];

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={classes}
      {...rest}
      data-qa-id={qaId}
    >
      {iconPosition === 'leading' && icon != null && (
        <span
          className="shrink-0 flex items-center justify-center"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="leading-none">{label}</span>
      {iconPosition === 'trailing' && icon != null && (
        <span
          className="shrink-0 flex items-center justify-center"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </button>
  );
}
