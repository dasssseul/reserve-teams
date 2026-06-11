import type { DateAxisCellProps, DayType } from './Timetable.types';

// _DateAxisCell (§4b)
// - 셀 높이 40px
// - Day Type별 텍스트 색 (Calendar 시멘틱)

const DAY_TYPE_TEXT: Record<DayType, string> = {
  Weekday: 'text-(--sys-text-calendar-weekday)',
  Saturday: 'text-(--sys-text-calendar-saturday)',
  Holiday: 'text-(--sys-text-calendar-holiday)',
};

export default function DateAxisCell({
  label,
  dayType = 'Weekday',
  qaId,
}: DateAxisCellProps) {
  const classes = [
    'flex items-center justify-start px-sm',
    'w-[100px] h-[40px] shrink-0',
    'bg-(--sys-bg-neutral-faint-default)',
    'border-r border-solid border-(--sys-stroke-neutral-subtle-default)',
    'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
    'body-md-regular',
    DAY_TYPE_TEXT[dayType],
  ].join(' ');

  return <div className={classes} data-qa-id={qaId}>{label}</div>;
}
