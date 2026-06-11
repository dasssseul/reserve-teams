import type React from 'react';

export type ButtonRole = 'Brand' | 'Neutral' | 'Destructive' | 'Critical';
export type ButtonBtnStyle = 'Solid' | 'Outline' | 'Ghost' | 'Text';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonAvailability = 'enabled' | 'disabled';
export type ButtonIconPosition = 'none' | 'leading' | 'trailing';

// HTMLButtonElement의 'role'(ARIA role)과 구분하기 위해 Omit 처리
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  label: string;
  role?: ButtonRole;
  btnStyle?: ButtonBtnStyle;
  size?: ButtonSize;
  availability?: ButtonAvailability;
  iconPosition?: ButtonIconPosition;
  icon?: React.ReactNode;
}

// lg 미지원 (§5-1: IconOnly는 툴바·테이블 보조 용도)
export interface ButtonIconOnlyProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  icon: React.ReactNode;
  'aria-label': string;
  role?: ButtonRole;
  btnStyle?: ButtonBtnStyle;
  size?: 'xs' | 'sm' | 'md';
  availability?: ButtonAvailability;
}
