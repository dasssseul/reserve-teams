import type React from 'react';
import type {
  NavItemProps,
  LnbNavLevel,
  LnbAvailability,
} from './LNB.types';

// ─── Level 별 좌측 padding (LNB 시안 정합) ───────────────────────────────────
// L1 = 8px (spacing-xs), L2 = 32px (spacing-3xl), L3 = 56px (직접값)
const PADDING_LEFT_MAP: Record<LnbNavLevel, string> = {
  1: 'pl-xs',
  2: 'pl-3xl',
  3: 'pl-[56px]',
};

// ─── 상태별 클래스 빌더 ───────────────────────────────────────────────────────

interface NavItemClassSet {
  bg: string;
  text: string;
  icon: string;
  weight: string;
  hoverBg: string;
  extra: string;
}

interface StateInput {
  selected: boolean;
  availability: LnbAvailability;
  dragOver: boolean;
  dragging: boolean;
}

// 상태 우선순위: dragging > disabled > dragOver > selected > rest
function getNavItemClasses(s: StateInput): NavItemClassSet {
  if (s.dragging) {
    return {
      bg: 'bg-(--office-bg-brand-subtle-default)',
      text: 'text-(--sys-text-neutral-normal-default)',
      icon: 'text-(--sys-icon-neutral-faint-default)',
      weight: 'body-md-regular',
      hoverBg: '',
      extra: 'opacity-50 shadow-lv2',
    };
  }

  if (s.availability === 'disabled') {
    return {
      bg: 'bg-transparent',
      text: 'text-(--sys-text-neutral-normal-disabled)',
      icon: 'text-(--sys-icon-neutral-subtle-disabled)',
      weight: 'body-md-regular',
      hoverBg: '',
      extra: '',
    };
  }

  if (s.dragOver) {
    return {
      bg: 'bg-(--office-bg-brand-faint-active)',
      text: 'text-(--sys-text-neutral-normal-default)',
      icon: 'text-(--sys-icon-neutral-muted-default)',
      weight: 'body-md-regular',
      hoverBg: '',
      extra: '',
    };
  }

  if (s.selected) {
    return {
      bg: 'bg-(--office-bg-brand-normal-default)',
      text: 'text-(--office-text-brand-strong-default)',
      icon: 'text-(--office-icon-brand-strong-default)',
      weight: 'body-md-semibold',
      hoverBg: '', // Selected는 Hover 영향 안 받음 (Anna 결정 C-2)
      extra: '',
    };
  }

  // Selected=False · Enabled · Rest
  return {
    bg: 'bg-transparent',
    text: 'text-(--sys-text-neutral-normal-default)',
    icon: 'text-(--sys-icon-neutral-faint-default)',
    weight: 'body-md-regular',
    hoverBg:
      'hover:bg-(--office-bg-brand-faint-active) hover:[&_.lnb-nav-icon]:text-(--sys-icon-neutral-muted-default)',
    extra: '',
  };
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function NavItem(props: NavItemProps) {
  const {
    label,
    level = 1,
    availability = 'enabled',
    selected = false,
    leading,
    hasChevron = false,
    expanded = true,
    trailing,
    trailingAction,
    badge,
    dragOver = false,
    dragging = false,
    className,
    as = 'a',
    ...rest
  } = props as NavItemProps & { as?: 'a' | 'button' };

  const isDisabled = availability === 'disabled';
  const variant = getNavItemClasses({
    selected,
    availability,
    dragOver,
    dragging,
  });

  let stateLabel: string;
  if (dragging) stateLabel = 'dragging';
  else if (isDisabled) stateLabel = 'disabled';
  else if (dragOver) stateLabel = 'dragover';
  else if (selected) stateLabel = 'selected';
  else stateLabel = 'rest';
  const qaId = `lnb-nav-l${level}-${stateLabel}`;

  const classes = [
    'flex items-center w-full gap-xs',
    'h-[38px] pr-3xs',
    PADDING_LEFT_MAP[level],
    'border-0 no-underline select-none text-left',
    'transition-colors',
    variant.bg,
    variant.text,
    variant.weight,
    variant.hoverBg,
    variant.extra,
    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--office-bg-brand-strong-default)',
    isDisabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span
        className={['flex items-center gap-3xs shrink-0', variant.icon].join(
          ' ',
        )}
      >
        {hasChevron && (
          <span
            className={[
              'shrink-0 inline-flex items-center justify-center',
              'text-(--sys-icon-neutral-subtle-default)',
              'transition-transform',
              expanded ? '' : '-rotate-90',
            ].join(' ')}
            style={{ width: 16, height: 16 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        {leading != null && (
          <span
            className="lnb-nav-icon shrink-0 inline-flex items-center justify-center"
            style={{ width: 16, height: 16 }}
            aria-hidden="true"
          >
            {leading}
          </span>
        )}
      </span>

      <span className="flex-1 min-w-0 flex items-center gap-2xs overflow-hidden">
        <span className="flex-1 min-w-0 truncate">{label}</span>
        {badge != null && (
          <span
            className={[
              'shrink-0 inline-flex items-center justify-center',
              'min-w-[16px] h-[16px] px-[5px]',
              'rounded-full',
              'bg-(--sys-bg-alert-strong-default)',
              'text-(--sys-text-neutral-inverse-default)',
              'text-[11px] font-semibold leading-[16px] text-center',
            ].join(' ')}
          >
            {badge}
          </span>
        )}
      </span>

      {trailing != null && (
        <span
          className={['shrink-0 inline-flex items-center', variant.icon].join(
            ' ',
          )}
          aria-hidden="true"
        >
          {trailing}
        </span>
      )}

      {trailingAction != null && (
        <span
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label={trailingAction.ariaLabel}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!isDisabled) trailingAction.onClick(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              e.preventDefault();
              if (!isDisabled)
                trailingAction.onClick(
                  e as unknown as React.MouseEvent<HTMLSpanElement>,
                );
            }
          }}
          className={[
            'shrink-0 inline-flex items-center justify-center',
            'w-[26px] h-[26px] rounded-sm',
            'text-(--sys-icon-neutral-muted-default)',
            isDisabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:bg-(--office-bg-brand-faint-active)',
            'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--office-bg-brand-strong-default)',
          ].join(' ')}
        >
          <span
            className="inline-flex"
            style={{ width: 14, height: 14 }}
            aria-hidden="true"
          >
            {trailingAction.icon}
          </span>
        </span>
      )}
    </>
  );

  if (as === 'button') {
    return (
      <button
        type="button"
        disabled={isDisabled}
        aria-current={selected ? 'page' : undefined}
        className={classes}
        data-qa-id={qaId}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      aria-current={selected ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      className={classes}
      data-qa-id={qaId}
      {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {content}
    </a>
  );
}
