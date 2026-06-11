import type { LnbProps } from './LNB.types';
import NavItem from './NavItem';
import SectionHeader from './SectionHeader';
import SectionGroup from './SectionGroup';
import ActionButton from './ActionButton';
import Divider from './Divider';

// LNB 컨테이너 (lnb.md §2 + 예약시스템 시안)
// - W 276px 고정, H Fill
// - 컨테이너 배경 brand subtle (#e6eff9) — 시안 정합
// - Top Header / Footer: shrink-0 (slot)
// - Scroll Area: Overflow Vertical
// - 좌우 24px (spacing-2xl), 상하 20px (spacing-xl) 시안 정합
function LNBRoot({
  header,
  footer,
  children,
  className,
  ...rest
}: LnbProps) {
  const classes = [
    'flex flex-col shrink-0',
    'w-[276px] h-full',
    'bg-(--office-bg-brand-subtle-default)',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classes} aria-label="주 메뉴" {...rest}>
      {header != null && (
        <div className="shrink-0 px-2xl pt-xl pb-xl flex items-center">
          {header}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto px-2xl pb-xl">
        {children}
      </div>
      {footer != null && <div className="shrink-0 px-2xl pb-xl">{footer}</div>}
    </nav>
  );
}

// 컴파운드 패턴 — LNB.NavItem 형태로도 사용 가능
const LNB = Object.assign(LNBRoot, {
  NavItem,
  SectionHeader,
  SectionGroup,
  ActionButton,
  Divider,
});

export default LNB;
