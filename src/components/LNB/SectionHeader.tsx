import type {
  SectionHeaderProps,
  LnbSectionLevel,
  LnbAvailability,
} from './LNB.types';

// Section Header — Level별 좌측 padding (시안: L1=8px, L2=32px)
const PADDING_LEFT_MAP: Record<LnbSectionLevel, string> = {
  1: 'pl-xs',
  2: 'pl-3xl',
};

// 상시 semibold (lnb.md §3-2 v1.3)
const TYPO_MAP: Record<LnbSectionLevel, string> = {
  1: 'label-md-semibold',
  2: 'label-sm-semibold',
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
        transition: 'transform 0.15s ease-out',
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ColorSet {
  text: string;
  icon: string;
}

interface StateInput {
  availability: LnbAvailability;
  dragOver: boolean;
  dragging: boolean;
}

function getColors(s: StateInput): ColorSet {
  if (s.availability === 'disabled') {
    return {
      text: 'text-(--sys-text-neutral-normal-disabled)',
      icon: 'text-(--sys-icon-neutral-subtle-disabled)',
    };
  }
  // v1.3: text=neutral.normal.default, icon=neutral.muted.default
  return {
    text: 'text-(--sys-text-neutral-normal-default)',
    icon: 'text-(--sys-icon-neutral-muted-default)',
  };
}

function getBg(s: StateInput): string {
  if (s.dragging)
    return 'bg-(--office-bg-brand-subtle-default) opacity-50 shadow-lv2';
  if (s.availability === 'disabled') return 'bg-transparent';
  if (s.dragOver) return 'bg-(--office-bg-brand-faint-active)';
  return 'bg-transparent hover:bg-(--office-bg-brand-faint-active)';
}

export default function SectionHeader({
  label,
  level = 1,
  availability = 'enabled',
  expanded = true,
  leading,
  trailing,
  dragOver = false,
  dragging = false,
  onToggle,
  className,
  ...rest
}: SectionHeaderProps) {
  const isDisabled = availability === 'disabled';
  const colors = getColors({ availability, dragOver, dragging });
  const bg = getBg({ availability, dragOver, dragging });

  let stateLabel: string;
  if (dragging) stateLabel = 'dragging';
  else if (isDisabled) stateLabel = 'disabled';
  else if (dragOver) stateLabel = 'dragover';
  else stateLabel = expanded ? 'expanded' : 'collapsed';
  const qaId = `lnb-section-l${level}-${stateLabel}`;

  const classes = [
    'flex items-center w-full gap-xs',
    'h-[38px] pr-3xs',
    PADDING_LEFT_MAP[level],
    'border-0 select-none text-left',
    'transition-colors',
    bg,
    colors.text,
    TYPO_MAP[level],
    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--office-bg-brand-strong-default)',
    isDisabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-expanded={expanded}
      onClick={onToggle}
      className={classes}
      data-qa-id={qaId}
      {...rest}
    >
      <span
        className={[
          'shrink-0 inline-flex items-center justify-center',
          colors.icon,
        ].join(' ')}
        style={{ width: 16, height: 16 }}
      >
        <ChevronIcon expanded={expanded} />
      </span>
      {leading != null && (
        <span
          className={['shrink-0 inline-flex items-center', colors.icon].join(
            ' ',
          )}
          aria-hidden="true"
        >
          {leading}
        </span>
      )}
      <span className="flex-1 min-w-0 truncate text-left">{label}</span>
      {trailing != null && (
        <span
          className={['shrink-0 inline-flex items-center', colors.icon].join(
            ' ',
          )}
          aria-hidden="true"
        >
          {trailing}
        </span>
      )}
    </button>
  );
}
