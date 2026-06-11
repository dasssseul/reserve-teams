import type { DatetableProps } from './Timetable.types';
import DateAxisCell from './DateAxisCell';
import DateSlotCell from './DateSlotCell';
import ResourceHeader from './ResourceHeader';
import ResourcePhoto from './ResourcePhoto';
import ResourceColumn from './ResourceColumn';
import AxisCorner from './AxisCorner';
import EventBlock from './EventBlock';
import SelectionBox from './SelectionBox';

// Datetable — 날짜 시나리오 Public 컨테이너 (§3b)
// - Timetable과 책임 동형
// - Time축 대신 Date축 사용
// - NowIndicator 미적용 (시간 시나리오 전용)

function DatetableRoot({ children, className, ...rest }: DatetableProps) {
  const classes = [
    'relative flex flex-col',
    'bg-(--sys-bg-neutral-faint-default)',
    // Top Line (v0.4)
    'border-t border-solid border-(--sys-stroke-neutral-subtle-default)',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

const Datetable = Object.assign(DatetableRoot, {
  DateAxisCell,
  DateSlotCell,
  ResourceHeader,
  ResourcePhoto,
  ResourceColumn,
  AxisCorner,
  EventBlock,
  SelectionBox,
});

export default Datetable;
