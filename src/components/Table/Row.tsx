import type { RowProps } from './Table.types';

// _Row (§6-1)
// - 행 하단 border
// - Hover: bg neutral/faint/active
// - Selected: bg brand/faint/default
// - Disabled: 텍스트 muted

export default function Row({
  availability = 'enabled',
  selected = false,
  children,
  qaId,
  className,
  ...rest
}: RowProps) {
  const isDisabled = availability === 'disabled';

  const classes = [
    'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
    selected
      ? 'bg-(--office-bg-brand-faint-default)'
      : 'bg-(--sys-bg-neutral-faint-default)',
    !isDisabled && !selected ? 'hover:bg-(--sys-bg-neutral-faint-active)' : '',
    isDisabled ? 'text-(--sys-text-neutral-normal-disabled)' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={classes} data-qa-id={qaId} {...rest}>
      {children}
    </tr>
  );
}
