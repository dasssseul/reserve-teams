import type { CellProps, CellMode, CellSize, CellAlign } from './Table.types';

// _Cell (§3, §8-0)
// - Mode=Header: brand subtle bg, semibold text
// - Mode=Data: faint bg, regular text
// - Size md: h-[34px] px-sm py-2xs / lg: h-[40px] px-md py-xs
// - 우측 stroke 1px (마지막 컬럼 제외)

const SIZE_MAP: Record<CellSize, string> = {
  md: 'h-[34px] px-sm py-2xs',
  lg: 'h-[40px] px-md py-xs',
};

const TYPO_MAP: Record<CellMode, string> = {
  header: 'label-md-semibold',
  data: 'body-md-regular',
};

const ALIGN_MAP: Record<CellAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function Cell({
  mode = 'data',
  size = 'md',
  align = 'left',
  isLast = false,
  children,
  qaId,
  className,
  ...rest
}: CellProps) {
  const isHeader = mode === 'header';
  const Tag = isHeader ? 'th' : 'td';

  const classes = [
    SIZE_MAP[size],
    TYPO_MAP[mode],
    ALIGN_MAP[align],
    isHeader
      ? 'bg-(--office-bg-brand-subtle-default) text-(--sys-text-neutral-normal-default)'
      : 'bg-(--sys-bg-neutral-faint-default) text-(--sys-text-neutral-normal-default)',
    !isLast
      ? 'border-r border-solid border-(--sys-stroke-neutral-subtle-default)'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} data-qa-id={qaId} {...rest}>
      {children}
    </Tag>
  );
}
