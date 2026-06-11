import type { TableMessageProps } from './Table.types';

// _TableMessage (§6-8-1)
// - Empty: "조회된 데이터가 없습니다"
// - Loading: spinner + "불러오는 중..."
// - min-height 53px

export default function TableMessage({
  state = 'empty',
  message,
  qaId,
}: TableMessageProps) {
  const text =
    message ??
    (state === 'empty' ? '조회된 데이터가 없습니다' : '불러오는 중...');

  return (
    <tr data-qa-id={qaId}>
      <td
        colSpan={100}
        className={[
          'text-center py-lg',
          'body-md-regular text-(--sys-text-neutral-muted-default)',
        ].join(' ')}
        style={{ minHeight: 53 }}
      >
        {text}
      </td>
    </tr>
  );
}
