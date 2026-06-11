import type { HeaderRowProps } from './Table.types';

// _HeaderRow (§6-2)
// - variant 없는 단일 컴포넌트
// - 행 하단 border (분리선)

export default function HeaderRow({
  children,
  qaId,
  className,
  ...rest
}: HeaderRowProps) {
  const classes = [
    'border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
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
