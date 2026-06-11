import type { SelectionBoxProps } from './Timetable.types';

// _SelectionBox (§8)
// - bg office/bg/brand/normal/default + opacity/dragging(50%)
// - border office/stroke/brand/normal/default + dashed
// - radius sm(4px)

export default function SelectionBox({
  style,
  className,
  qaId,
}: SelectionBoxProps) {
  const classes = [
    'absolute rounded-sm',
    'border border-dashed border-(--office-stroke-brand-normal-default)',
    'bg-(--office-bg-brand-normal-default) opacity-50',
    'pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} style={style} data-qa-id={qaId} />;
}
