import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps, ModalSize, ModalSurfaceProps } from './Modal.types';

// ─── 사이즈 → width 매핑 (modal.md §5) ───────────────────────────────────────
// Figma 실측 6단계 (v1.1 정합). sys/sizing/modal/* 토큰 미존재 → arbitrary 사용.

const WIDTH_MAP: Record<ModalSize, string> = {
  xs: 'w-[400px]',
  sm: 'w-[520px]',
  md: 'w-[640px]',
  lg: 'w-[800px]',
  xl: 'w-[1000px]',
  '2xl': 'w-[1200px]',
};

// ─── Close 아이콘 (Input ClearIcon과 동일한 X 형태) ──────────────────────────

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4L4 12M4 4l8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── ModalSurface — Portal/Backdrop 없는 Shell 본체 ──────────────────────────
// QA 페이지·테스트에서 인라인 렌더용으로 사용. 사용자 API는 <Modal>이 표준.

export function ModalSurface({
  size = 'md',
  title,
  supportingText,
  showCloseButton = true,
  onClose,
  footer,
  qaId,
  className,
  children,
  ...rest
}: ModalSurfaceProps) {
  const titleId = useId();

  const shellClasses = [
    'flex flex-col',
    WIDTH_MAP[size],
    'bg-(--sys-bg-neutral-faint-default)',
    'border border-(--sys-stroke-neutral-subtle-default)',
    'rounded-sm',
    'shadow-lv4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={shellClasses}
      data-qa-id={qaId}
      {...rest}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2xl pt-2xl pb-3xl px-2xl">
        <h2
          id={titleId}
          className="heading-sm-semibold text-(--sys-text-neutral-normal-default) flex-1 min-w-0"
        >
          {title}
        </h2>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            data-qa-id={qaId ? `${qaId}-close` : undefined}
            className={[
              'inline-flex items-center justify-center shrink-0',
              'size-[26px] rounded-sm',
              'bg-transparent border-0 cursor-pointer',
              'text-(--sys-icon-neutral-subtle-default)',
              'hover:bg-(--sys-bg-neutral-subtle-default)',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--office-bg-brand-strong-default)',
            ].join(' ')}
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-xl px-2xl pb-2xl">
        {supportingText && (
          <p className="body-md-regular text-(--sys-text-neutral-normal-default)">
            {supportingText}
          </p>
        )}
        {children != null && <div className="flex flex-col">{children}</div>}
      </div>

      {/* Footer */}
      {footer}
    </div>
  );
}

// ─── Modal — Portal + Backdrop + ESC/scroll-lock 래퍼 ────────────────────────

export default function Modal({
  open,
  onClose,
  size = 'md',
  title,
  supportingText,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  footer,
  qaId,
  className,
  children,
  ...rest
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const handleBackdropClick = closeOnBackdropClick ? onClose : undefined;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      data-qa-id={qaId ? `${qaId}-overlay` : undefined}
    >
      {/* Backdrop — sys/overlay/neutral/normal/default × sys/opacity/scrim(40%) */}
      <div
        className="absolute inset-0 bg-(--sys-overlay-neutral-normal-default) opacity-40"
        onClick={handleBackdropClick}
        data-qa-id={qaId ? `${qaId}-backdrop` : undefined}
        aria-hidden="true"
      />

      {/* Shell — backdrop 위에 띄움 */}
      <div className="relative z-10">
        <ModalSurface
          size={size}
          title={title}
          supportingText={supportingText}
          showCloseButton={showCloseButton}
          onClose={onClose}
          footer={footer}
          qaId={qaId}
          className={className}
          {...rest}
        >
          {children}
        </ModalSurface>
      </div>
    </div>,
    document.body,
  );
}
