import type { ActionButtonProps } from './LNB.types';

// LNB Action Button (lnb.md §3-3 v1.3)
// Style=List 단일, Selected 미운영, Pressed 제외 (정책 §2-2-1)
// CTA 성격: leading icon은 brand 색, hover bg는 faint/active (Nav Item/Section Header 통일)
export default function ActionButton({
  label,
  availability = 'enabled',
  icon,
  className,
  ...rest
}: ActionButtonProps) {
  const isDisabled = availability === 'disabled';
  const qaId = `lnb-action-rest${isDisabled ? '-disabled' : ''}`;

  const classes = [
    'flex items-center w-full gap-xs',
    'h-[38px] pl-xs pr-3xs',
    'bg-transparent border-0',
    'hover:bg-(--office-bg-brand-faint-active)',
    'text-(--sys-text-neutral-normal-default)',
    'disabled:text-(--sys-text-neutral-normal-disabled)',
    'label-md-semibold select-none text-left',
    'transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--office-bg-brand-strong-default)',
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // leading icon 색은 brand (lnb.md v1.3 §3-3)
  const iconColor = isDisabled
    ? 'text-(--office-icon-brand-normal-disabled)'
    : 'text-(--office-icon-brand-normal-default)';

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={classes}
      data-qa-id={qaId}
      {...rest}
    >
      {icon != null && (
        <span
          className={[
            'shrink-0 inline-flex items-center justify-center',
            iconColor,
          ].join(' ')}
          style={{ width: 16, height: 16 }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0 truncate text-left">{label}</span>
    </button>
  );
}
