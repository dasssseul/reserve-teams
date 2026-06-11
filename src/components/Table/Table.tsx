import type { TableProps } from './Table.types';
import Cell from './Cell';
import HeaderRow from './HeaderRow';
import Row from './Row';
import TableMessage from './TableMessage';

// Table 컨테이너 (§6-7)
// - Top Line: 1px stroke/neutral/subtle/default (v1.6)
// - 좌·우 외곽 없음 (clean UI, 패턴 D)
// - State: loaded / empty / loading

function TableRoot({
  state = 'loaded',
  showHeader = true,
  children,
  qaId,
  className,
  ...rest
}: TableProps) {
  const classes = [
    'w-full border-collapse',
    'border-t border-b border-solid border-(--sys-stroke-neutral-subtle-default)',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <table className={classes} data-qa-id={qaId} {...rest}>
      {children}
    </table>
  );
}

const Table = Object.assign(TableRoot, {
  Cell,
  HeaderRow,
  Row,
  TableMessage,
});

export default Table;
