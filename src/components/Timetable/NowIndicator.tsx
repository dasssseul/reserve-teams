import type { NowIndicatorProps } from './Timetable.types';

// _NowIndicator (§8c)
// - Line: 1px solid sys/stroke/calendar/now-indicator (#d84a49)
// - Dot: 좌측 8x8 원형 동일 색
// - Overlay Slot 거주, 시간 시나리오 전용

export default function NowIndicator({
  style,
  className,
  qaId,
}: NowIndicatorProps) {
  const classes = [
    'absolute flex items-center pointer-events-none',
    'left-0 right-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} data-qa-id={qaId} aria-label="현재 시각">
      {/* Dot */}
      <div
        className="shrink-0 rounded-full bg-(--sys-stroke-calendar-now-indicator)"
        style={{ width: 8, height: 8, marginLeft: -4 }}
      />
      {/* Line */}
      <div className="flex-1 h-px bg-(--sys-stroke-calendar-now-indicator)" />
    </div>
  );
}
