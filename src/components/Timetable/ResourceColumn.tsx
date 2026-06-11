import type { ResourceColumnProps } from './Timetable.types';

// _ResourceColumn (§5-1)
// - Mode=Time: header + photo(Optional) + TimeSlotCell × N
// - Mode=Date: header + photo(Optional) + DateSlotCell × N
// - right border 1px solid stroke/neutral/subtle/default (세로 분리선)
// - 마지막 컬럼: isLast=true → 우측 border 제거

export default function ResourceColumn({
  header,
  photo,
  children,
  isLast = false,
}: ResourceColumnProps) {
  const classes = [
    'flex flex-col shrink-0 flex-1 min-w-[120px]',
    !isLast
      ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {header}
      {photo}
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
