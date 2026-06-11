import type React from 'react';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// HTMLDivElement의 'role'(ARIA role)과 string 'title'을 별도로 다루기 위해 Omit
export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title: string;
  supportingText?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  footer?: React.ReactNode;
  qaId?: string;
}

export type ModalFooterLayout = 'spaceBetween' | 'centered';

export interface ModalFooterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  layout?: ModalFooterLayout;
  leftCheckbox?: React.ReactNode;
  leftOptionLink?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  primaryButton: React.ReactNode;
  qaId?: string;
}

// QA / 인라인 렌더용 — Portal/Backdrop 없이 Shell 자체만 렌더
export interface ModalSurfaceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
  size?: ModalSize;
  title: string;
  supportingText?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  qaId?: string;
}
