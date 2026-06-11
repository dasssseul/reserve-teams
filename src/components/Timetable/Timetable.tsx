import type { TimetableProps } from './Timetable.types';
import TimeAxisCell from './TimeAxisCell';
import DateAxisCell from './DateAxisCell';
import TimeSlotCell from './TimeSlotCell';
import DateSlotCell from './DateSlotCell';
import ResourceHeader from './ResourceHeader';
import ResourcePhoto from './ResourcePhoto';
import ResourceColumn from './ResourceColumn';
import AxisCorner from './AxisCorner';
import EventBlock from './EventBlock';
import SelectionBox from './SelectionBox';
import NowIndicator from './NowIndicator';

// Timetable — 시간 시나리오 Public 컨테이너 (§3)
// - variant 0개 단일 컴포넌트
// - Top Line: 1px stroke/neutral/subtle/default (Table v1.6 동형)
// - Overlay Slot: absolute 포지셔닝 (EventBlock, SelectionBox, NowIndicator)

function TimetableRoot({ children, className, ...rest }: TimetableProps) {
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

// 컴파운드 패턴 — Timetable.EventBlock 등으로 사용
const Timetable = Object.assign(TimetableRoot, {
  TimeAxisCell,
  DateAxisCell,
  TimeSlotCell,
  DateSlotCell,
  ResourceHeader,
  ResourcePhoto,
  ResourceColumn,
  AxisCorner,
  EventBlock,
  SelectionBox,
  NowIndicator,
});

export default Timetable;
