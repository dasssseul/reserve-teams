import type { EventBlockProps, EventStatus } from './Timetable.types';

// ─── v0.8 색 스킴: 좌측 3px 막대 + 배경틴트 + 본문 텍스트 ──────────────────

interface VariantStyle {
  bg: string;
  hoverBg: string;
  bar: string;
  text: string;
  cancelled?: boolean;
}

function getVariantKey(isMine: boolean, status: EventStatus): string {
  return `${isMine ? 'Mine' : 'Others'}-${status}`;
}

const VARIANT_MAP: Record<string, VariantStyle> = {
  'Mine-Confirmed': {
    bg: 'bg-(--office-bg-brand-normal-default)',
    hoverBg: 'hover:bg-(--office-bg-brand-normal-active)',
    bar: 'border-l-(--office-stroke-brand-normal-default)',
    text: 'text-(--sys-text-neutral-normal-default)',
  },
  'Mine-Tentative': {
    bg: 'bg-(--office-bg-brand-subtle-default)',
    hoverBg: 'hover:bg-(--office-bg-brand-subtle-active)',
    bar: 'border-l-(--office-stroke-brand-subtle-default)',
    text: 'text-(--sys-text-neutral-subtle-default)',
  },
  'Mine-Cancelled': {
    bg: 'bg-(--sys-bg-neutral-muted-default)',
    hoverBg: 'hover:bg-(--sys-bg-neutral-muted-active)',
    bar: 'border-l-(--sys-stroke-neutral-subtle-default)',
    text: 'text-(--sys-text-neutral-faint-default)',
    cancelled: true,
  },
  'Others-Confirmed': {
    bg: 'bg-(--sys-bg-neutral-muted-default)',
    hoverBg: 'hover:bg-(--sys-bg-neutral-muted-active)',
    bar: 'border-l-(--sys-stroke-neutral-strong-default)',
    text: 'text-(--sys-text-neutral-normal-default)',
  },
  'Others-Tentative': {
    bg: 'bg-(--sys-bg-neutral-muted-default)',
    hoverBg: 'hover:bg-(--sys-bg-neutral-muted-active)',
    bar: 'border-l-(--sys-stroke-neutral-normal-default)',
    text: 'text-(--sys-text-neutral-subtle-default)',
  },
  'Others-Cancelled': {
    bg: 'bg-(--sys-bg-neutral-muted-default)',
    hoverBg: 'hover:bg-(--sys-bg-neutral-muted-active)',
    bar: 'border-l-(--sys-stroke-neutral-subtle-default)',
    text: 'text-(--sys-text-neutral-faint-default)',
    cancelled: true,
  },
};

// ─── 컴포넌트 (§7) ──────────────────────────────────────────────────────────

export default function EventBlock({
  title,
  isMine = false,
  status = 'Confirmed',
  time,
  author,
  qaId,
  className,
  style,
  ...rest
}: EventBlockProps) {
  const variantKey = getVariantKey(isMine, status);
  const variant = VARIANT_MAP[variantKey];

  const classes = [
    // 좌측 3px 막대 (sys/border/width/thick) + radius/sm(4)
    'border-l-[3px] border-solid rounded-sm',
    variant.bar,
    // 배경
    variant.bg,
    variant.hoverBg,
    // 박스 모델: px spacing/sm(10) py spacing/3xs(4)
    'px-sm py-3xs',
    // 레이아웃
    'flex flex-col overflow-hidden cursor-pointer',
    // 제목↔부제 gap spacing/5xs(1px)
    'gap-5xs',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasSubtitle = time != null || author != null;

  return (
    <div className={classes} style={style} data-qa-id={qaId} {...rest}>
      {/* 제목: body/md/semibold */}
      <span
        className={[
          'body-md-semibold truncate',
          variant.text,
          variant.cancelled ? 'line-through' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {title}
      </span>

      {/* 부제: caption/md/regular, flex gap 2xs(6px) */}
      {hasSubtitle && (
        <span
          className={[
            'flex gap-2xs caption-md-regular truncate',
            variant.text,
            variant.cancelled ? 'line-through' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {time != null && <span>{time}</span>}
          {author != null && <span>{author}</span>}
        </span>
      )}
    </div>
  );
}
