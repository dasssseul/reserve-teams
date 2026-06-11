import type React from 'react';

export type LnbAvailability = 'enabled' | 'disabled';
export type LnbNavLevel = 1 | 2 | 3;
export type LnbSectionLevel = 1 | 2;

// ─── NavItem ─────────────────────────────────────────────────────────────────

export interface NavItemTrailingAction {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  ariaLabel: string;
}

interface NavItemCommonProps {
  label: string;
  level?: LnbNavLevel;
  availability?: LnbAvailability;
  selected?: boolean;
  leading?: React.ReactNode;
  hasChevron?: boolean;
  expanded?: boolean;
  trailing?: React.ReactNode;
  trailingAction?: NavItemTrailingAction;
  badge?: number | string;
  dragOver?: boolean;
  dragging?: boolean;
}

// as='a' (default) — 라우팅 링크 표준
export interface NavItemAnchorProps
  extends NavItemCommonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'role' | 'children'> {
  as?: 'a';
}

// as='button' — 자식 노드를 토글하거나 페이지 외 액션
export interface NavItemButtonProps
  extends NavItemCommonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'children'> {
  as: 'button';
}

export type NavItemProps = NavItemAnchorProps | NavItemButtonProps;

// ─── SectionHeader ───────────────────────────────────────────────────────────

export interface SectionHeaderProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  label: string;
  level?: LnbSectionLevel;
  availability?: LnbAvailability;
  expanded?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  dragOver?: boolean;
  dragging?: boolean;
  onToggle?: () => void;
}

// ─── SectionGroup (Disclosure wrapper) ───────────────────────────────────────

export interface SectionGroupProps {
  label: string;
  level?: LnbSectionLevel;
  availability?: LnbAvailability;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

// ─── ActionButton ────────────────────────────────────────────────────────────

export interface ActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  label: string;
  availability?: LnbAvailability;
  icon?: React.ReactNode;
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export type DividerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>;

// ─── LNB 컨테이너 ────────────────────────────────────────────────────────────

export interface LnbProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
