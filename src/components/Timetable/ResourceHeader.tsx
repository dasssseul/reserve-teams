import type { ResourceHeaderProps } from './Timetable.types';

// _ResourceHeader (§5-2)
// - label/md/semibold, bg neutral/faint/default
// - border-bottom stroke/neutral/normal/default (헤더 row 강조 — 본문보다 진함)
// - 높이 42px

export default function ResourceHeader({
  name,
  leading,
  trailing,
  qaId,
}: ResourceHeaderProps) {
  return (
    <div
      className={[
        'flex items-center justify-center gap-2xs px-xs',
        'h-[42px] shrink-0',
        'bg-(--sys-bg-neutral-faint-default)',
        'border-b border-solid border-(--sys-stroke-neutral-normal-default)',
      ].join(' ')}
      data-qa-id={qaId}
    >
      {leading != null && (
        <span className="shrink-0" aria-hidden="true">
          {leading}
        </span>
      )}
      <span className="label-md-semibold text-(--sys-text-neutral-normal-default) truncate">
        {name}
      </span>
      {trailing != null && (
        <span className="shrink-0 text-(--sys-icon-neutral-muted-default)" aria-hidden="true">
          {trailing}
        </span>
      )}
    </div>
  );
}
