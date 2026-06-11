import type { ResourcePhotoProps } from './Timetable.types';

// _ResourcePhoto (§5-3)
// - 높이 고정 98px (종횡비 박스 금지 — v0.6 정정)
// - border-bottom only
// - image fill cover

export default function ResourcePhoto({ src, alt = '', qaId }: ResourcePhotoProps) {
  return (
    <div
      className={[
        'h-[98px] shrink-0 overflow-hidden',
      ].join(' ')}
      data-qa-id={qaId}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
