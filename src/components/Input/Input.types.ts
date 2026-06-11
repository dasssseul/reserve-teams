import type React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputAvailability = 'enabled' | 'disabled' | 'readOnly';
export type InputValidation = 'none' | 'error' | 'success' | 'warning';
export type InputAlignment = 'left' | 'right';
export type InputTrailingType = 'clear' | 'reveal' | 'custom';

// HTMLInputElement의 'size'(column width)와 구분하기 위해 Omit 처리
export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  // Visual / 3축 State (docs/components/input.md §3-1)
  size?: InputSize;
  availability?: InputAvailability;
  validation?: InputValidation;
  alignment?: InputAlignment;

  // Has Label (label 문자열 유무 = hasLabel)
  label?: string;

  // Has Supporting Text (supportingText 문자열 유무 = hasSupportingText)
  supportingText?: string;

  // _Leading Element (leadingIcon 유무 = _Leading Element boolean)
  leadingIcon?: React.ReactNode;

  // _Trailing Element
  trailingType?: InputTrailingType;
  trailingIcon?: React.ReactNode; // trailingType='custom' 전용
  onClear?: () => void; // trailingType='clear' 전용
}
