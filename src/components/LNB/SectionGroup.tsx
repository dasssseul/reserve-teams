import { useState } from 'react';
import type { SectionGroupProps } from './LNB.types';
import SectionHeader from './SectionHeader';

// SectionGroup — Disclosure 패턴
// SectionHeader + children을 한 쌍으로 묶어, expanded=false일 때 children 미렌더.
// HTML 시안의 "aria-expanded=false + group display:none"을 React 식으로 표현.
export default function SectionGroup({
  label,
  level = 1,
  availability = 'enabled',
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  leading,
  trailing,
  children,
  className,
}: SectionGroupProps) {
  const [internal, setInternal] = useState(defaultExpanded);
  const expanded = controlledExpanded ?? internal;

  const handleToggle = () => {
    const next = !expanded;
    if (controlledExpanded === undefined) setInternal(next);
    onExpandedChange?.(next);
  };

  return (
    <div className={className}>
      <SectionHeader
        label={label}
        level={level}
        availability={availability}
        expanded={expanded}
        leading={leading}
        trailing={trailing}
        onToggle={handleToggle}
      />
      {expanded && <div className="overflow-hidden">{children}</div>}
    </div>
  );
}
