import type { TimeSlotCellProps, SlotAvailability } from './Timetable.types';

// _TimeSlotCell (§6)
// - 셀 높이 24px
// - Format × Availability × Selected (Interaction은 CSS hover로 처리)

const BG_MAP: Record<string, string> = {
  'enabled-false': 'bg-(--sys-bg-neutral-faint-default)',
  'enabled-true': 'bg-(--office-bg-brand-normal-default)',
  'disabled-false': 'bg-(--sys-bg-neutral-strong-disabled)',
  'readOnly-false': 'bg-(--sys-bg-neutral-faint-disabled)',
};

function getBgClass(availability: SlotAvailability, selected: boolean): string {
  const key = `${availability}-${selected}`;
  return BG_MAP[key] ?? BG_MAP['enabled-false'];
}

export default function TimeSlotCell({
  format,
  availability = 'enabled',
  selected = false,
  qaId,
  className,
  ...rest
}: TimeSlotCellProps) {
  const isHour = format === 'Hour';
  const isInteractive = availability === 'enabled' && !selected;

  const classes = [
    'h-[24px] shrink-0',
    isHour ? 'border-b border-dashed border-(--sys-stroke-neutral-subtle-default)' : 'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
    getBgClass(availability, selected),
    isInteractive ? 'hover:bg-(--sys-bg-neutral-faint-active) cursor-pointer' : '',
    availability === 'disabled' || availability === 'readOnly'
      ? 'cursor-not-allowed'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} data-qa-id={qaId} {...rest} />;
}
