import type React from 'react';

// ─── Table 컨테이너 (§6-7) ──────────────────────────────────────────────────

export type TableState = 'loaded' | 'empty' | 'loading';

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: TableState;
  showHeader?: boolean;
  children?: React.ReactNode;
  qaId?: string;
}

// ─── HeaderRow (§6-2) ───────────────────────────────────────────────────────

export interface HeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  qaId?: string;
}

// ─── Row (§6-1) ─────────────────────────────────────────────────────────────

export type RowAvailability = 'enabled' | 'disabled';

export interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  availability?: RowAvailability;
  selected?: boolean;
  children?: React.ReactNode;
  qaId?: string;
}

// ─── Cell (§3) ──────────────────────────────────────────────────────────────

export type CellMode = 'header' | 'data';
export type CellSize = 'md' | 'lg';
export type CellAlign = 'left' | 'center' | 'right';

export interface CellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  mode?: CellMode;
  size?: CellSize;
  align?: CellAlign;
  /** 마지막 컬럼 여부 — 우측 border 제거 */
  isLast?: boolean;
  children?: React.ReactNode;
  qaId?: string;
}

// ─── TableMessage (§6-8-1) ──────────────────────────────────────────────────

export type TableMessageState = 'empty' | 'loading';

export interface TableMessageProps {
  state?: TableMessageState;
  message?: string;
  qaId?: string;
}
