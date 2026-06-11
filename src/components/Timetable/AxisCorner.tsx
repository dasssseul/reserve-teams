import type { AxisCornerProps } from './Timetable.types';

// _AxisCorner (§4c)
// - 너비 100px (axis column 너비 정합)
// - 높이: 42 (header only) 또는 140 (header 42 + photo 98)
// - bg neutral/faint/default, border-bottom subtle

export default function AxisCorner({ hasPhoto = false, qaId }: AxisCornerProps) {
  return (
    <div
      className={[
        'w-[100px] shrink-0 flex flex-col',
        'bg-(--sys-bg-neutral-faint-default)',
        'border-r border-solid border-(--sys-stroke-neutral-subtle-default)',
      ].join(' ')}
      data-qa-id={qaId}
    >
      {/* ResourceHeader 높이(42px) 정합 — 헤더 이름 row */}
      <div className="h-[42px] shrink-0 border-b border-solid border-(--sys-stroke-neutral-normal-default)" />
      {/* 사진 row (98px) — hasPhoto=false면 미표시 */}
      {hasPhoto && <div className="h-[98px] shrink-0" />}
    </div>
  );
}
