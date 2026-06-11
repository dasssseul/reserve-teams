import type { TimeAxisCellProps } from './Timetable.types';

// _TimeAxisCell (§4-2)
// - Hour: text 표시 + border-bottom dashed
// - HalfHour: text transparent + border-bottom solid
// - 셀 높이 24px

export default function TimeAxisCell({ label, format, qaId }: TimeAxisCellProps) {
  const isHour = format === 'Hour';

  const classes = [
    'flex items-start justify-end px-sm',
    'w-[100px] h-[24px] shrink-0',
    'bg-(--sys-bg-neutral-faint-default)',
    'border-r border-solid border-(--sys-stroke-neutral-subtle-default)',
    isHour ? 'border-b border-dashed border-(--sys-stroke-neutral-subtle-default)' : 'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
  ].join(' ');

  return (
    <div className={classes} data-qa-id={qaId}>
      <span
        className={[
          'body-md-regular',
          isHour
            ? 'text-(--sys-text-neutral-normal-default)'
            : 'text-transparent',
        ].join(' ')}
      >
        {isHour ? label : ''}
      </span>
    </div>
  );
}
