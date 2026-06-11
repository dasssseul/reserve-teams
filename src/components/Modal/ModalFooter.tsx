import type { ModalFooterProps } from './Modal.types';

// ─── Modal._Footer PSC 구현 (modal.md §3-3 / Figma node 311:958) ─────────────
// Variant 1축(Layout) × Boolean 3개(leftCheckbox / leftOptionLink / secondaryButton).
// Layout=centered 시 leftCheckbox · leftOptionLink 무효 (Boolean 값 무관, MD-K04).

export default function ModalFooter({
  layout = 'spaceBetween',
  leftCheckbox,
  leftOptionLink,
  secondaryButton,
  primaryButton,
  qaId,
  className,
  ...rest
}: ModalFooterProps) {
  const isCentered = layout === 'centered';

  const containerClasses = [
    'flex items-center gap-lg',
    'pt-lg pb-2xl px-2xl',
    isCentered ? 'justify-center' : 'justify-between',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Centered 모드에서는 left 슬롯이 무효
  const showLeft = !isCentered && (leftCheckbox != null || leftOptionLink != null);

  return (
    <div className={containerClasses} data-qa-id={qaId} {...rest}>
      {showLeft && (
        <div className="flex items-center gap-lg">
          {leftCheckbox}
          {leftOptionLink}
        </div>
      )}

      <div
        className={[
          'flex items-center gap-lg',
          !isCentered && !showLeft ? 'ml-auto' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {secondaryButton}
        {primaryButton}
      </div>
    </div>
  );
}
