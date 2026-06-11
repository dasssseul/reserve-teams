import type React from 'react';

// ─── 공통 타입 ───────────────────────────────────────────────────────────────

export type SlotAvailability = 'enabled' | 'disabled' | 'readOnly';

// ─── TimeAxisCell (§4-2) ─────────────────────────────────────────────────────

export type TimeAxisFormat = 'Hour' | 'HalfHour';

export interface TimeAxisCellProps {
  /** 시간 레이블 (예: "09:00") — Hour에서만 표시 */
  label?: string;
  format: TimeAxisFormat;
  qaId?: string;
}

// ─── DateAxisCell (§4b-2) ────────────────────────────────────────────────────

export type DayType = 'Weekday' | 'Saturday' | 'Holiday';

export interface DateAxisCellProps {
  label: string;
  dayType?: DayType;
  qaId?: string;
}

// ─── TimeSlotCell (§6) ──────────────────────────────────────────────────────

export interface TimeSlotCellProps extends React.HTMLAttributes<HTMLDivElement> {
  format: TimeAxisFormat;
  availability?: SlotAvailability;
  selected?: boolean;
  qaId?: string;
}

// ─── DateSlotCell (§6b) ─────────────────────────────────────────────────────

export interface DateSlotCellProps extends React.HTMLAttributes<HTMLDivElement> {
  availability?: SlotAvailability;
  selected?: boolean;
  qaId?: string;
}

// ─── ResourceHeader (§5-2) ──────────────────────────────────────────────────

export interface ResourceHeaderProps {
  name: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  qaId?: string;
}

// ─── ResourcePhoto (§5-3) ───────────────────────────────────────────────────

export interface ResourcePhotoProps {
  src: string;
  alt?: string;
  qaId?: string;
}

// ─── AxisCorner (§4c) ───────────────────────────────────────────────────────

export interface AxisCornerProps {
  hasPhoto?: boolean;
  qaId?: string;
}

// ─── EventBlock (§7) ────────────────────────────────────────────────────────

export type EventStatus = 'Confirmed' | 'Tentative' | 'Cancelled';

export interface EventBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 예약 제목 */
  title: string;
  /** 내 예약 여부 */
  isMine?: boolean;
  /** 예약 상태 */
  status?: EventStatus;
  /** 시간 표시 (예: "10:00 - 11:00") */
  time?: string;
  /** 예약자명 */
  author?: string;
  qaId?: string;
}

// ─── SelectionBox (§8) ──────────────────────────────────────────────────────

export interface SelectionBoxProps {
  style?: React.CSSProperties;
  className?: string;
  qaId?: string;
}

// ─── NowIndicator (§8c) ─────────────────────────────────────────────────────

export interface NowIndicatorProps {
  style?: React.CSSProperties;
  className?: string;
  qaId?: string;
}

// ─── ResourceColumn (§5-1) ──────────────────────────────────────────────────

export type ResourceColumnMode = 'Time' | 'Date';

export interface ResourceColumnProps {
  mode: ResourceColumnMode;
  header: React.ReactNode;
  photo?: React.ReactNode;
  children: React.ReactNode;
  /** 마지막 컬럼 여부 — 우측 border 제거 (table v1.3.3 패턴) */
  isLast?: boolean;
}

// ─── Timetable 컨테이너 (§3) ────────────────────────────────────────────────

export interface TimetableProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

// ─── Datetable 컨테이너 (§3b) ───────────────────────────────────────────────

export interface DatetableProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
