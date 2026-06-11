import type { DateSlotCellProps, SlotAvailability } from './Timetable.types';

// _DateSlotCell (§6b)
// - 셀 높이 40px
// - Format 미운영, border-bottom solid

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

export default function DateSlotCell({
  availability = 'enabled',
  selected = false,
  qaId,
  className,
  ...rest
}: DateSlotCellProps) {
  const isInteractive = availability === 'enabled' && !selected;

  const classes = [
    'h-[40px] shrink-0',
    'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
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
