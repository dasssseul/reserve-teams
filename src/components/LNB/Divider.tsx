import type { DividerProps } from './LNB.types';

// _Divider (lnb.md §3-4)
// Stroke 1px · color: office.stroke.brand.faint.default
// 시안 정합: 좌우 패딩 없음 (scroll area 자체 padding 24px), 위아래 spacing/xs (8px)
export default function Divider({ className, ...rest }: DividerProps) {
  const classes = ['flex items-center w-full py-xs', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} data-qa-id="lnb-divider" {...rest}>
      <i
        role="separator"
        className="block flex-1 h-px bg-(--office-stroke-brand-faint-default)"
      />
    </div>
  );
}
