import { useState, useId } from 'react';
import type {
  TextInputProps,
  InputSize,
  InputAvailability,
  InputValidation,
} from './Input.types';

// ─── 내장 아이콘 (SVG 인라인) ─────────────────────────────────────────────────

function ClearIcon({ size }: { size: number }) {
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

function EyeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2L14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.4 6.5A2 2 0 0 0 9.5 9.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.5 3.7C2 5 1 8 1 8C1 8 3.5 13 8 13C9.3 13 10.4 12.6 11.3 12M5.5 3.2C6.3 3.1 7.1 3 8 3C12.5 3 15 8 15 8C15 8 14.2 9.5 12.9 10.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── 사이즈 매핑 (docs/components/input.md §5) ────────────────────────────────

const HEIGHT_MAP: Record<InputSize, string> = {
  sm: 'h-[26px]',
  md: 'h-[34px]',
  lg: 'h-[40px]',
};

const WRAPPER_GAP_MAP: Record<InputSize, string> = {
  sm: 'gap-xs',
  md: 'gap-sm',
  lg: 'gap-md',
};

const BOX_PADDING_MAP: Record<InputSize, string> = {
  sm: 'px-xs',
  md: 'px-sm',
  lg: 'px-md',
};

const BOX_GAP_MAP: Record<InputSize, string> = {
  sm: 'gap-2xs',
  md: 'gap-xs',
  lg: 'gap-sm',
};

const TYPO_MAP: Record<InputSize, string> = {
  sm: 'body-sm-regular',
  md: 'body-md-regular',
  lg: 'body-md-regular',
};

const ICON_SIZE_PX: Record<InputSize, number> = {
  sm: 14,
  md: 16,
  lg: 16,
};

// ─── 상태별 클래스 빌더 (docs/components/input.md §4-2) ───────────────────────

function getBoxBorderClasses(
  availability: InputAvailability,
  validation: InputValidation,
): string {
  if (availability === 'disabled' || availability === 'readOnly') {
    return 'border-(--sys-stroke-neutral-subtle-default)';
  }
  if (validation === 'error') {
    return 'border-(--sys-stroke-alert-normal-default)';
  }
  // none / success / warning + enabled → 인터랙션 반응
  return [
    'border-(--sys-stroke-neutral-subtle-default)',
    'hover:border-(--sys-stroke-neutral-subtle-active)',
    'focus-within:border-(--sys-stroke-neutral-strong-default)',
  ].join(' ');
}

function getBoxBgClass(availability: InputAvailability): string {
  return availability === 'enabled'
    ? 'bg-(--sys-bg-neutral-faint-default)'
    : 'bg-(--sys-bg-neutral-subtle-disabled)';
}

function getLabelClass(availability: InputAvailability): string {
  return availability === 'disabled'
    ? 'text-(--sys-text-neutral-normal-disabled)'
    : 'text-(--sys-text-neutral-normal-default)';
}

function getSupportingTextClass(
  availability: InputAvailability,
  validation: InputValidation,
): string {
  if (availability === 'disabled')
    return 'text-(--sys-text-neutral-subtle-disabled)';
  if (validation === 'error') return 'text-(--sys-text-alert-normal-default)';
  if (validation === 'success')
    return 'text-(--sys-text-positive-normal-default)';
  if (validation === 'warning')
    return 'text-(--sys-text-warning-normal-default)';
  return 'text-(--sys-text-neutral-subtle-default)';
}

function getIconColorClass(availability: InputAvailability): string {
  return availability === 'disabled'
    ? 'text-(--sys-icon-neutral-normal-disabled)'
    : 'text-(--sys-icon-neutral-normal-default)';
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function TextInput({
  size = 'md',
  availability = 'enabled',
  validation = 'none',
  alignment = 'left',
  label,
  supportingText,
  leadingIcon,
  trailingType,
  trailingIcon,
  onClear,
  id: idProp,
  type,
  className,
  ...rest
}: TextInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const supportingTextId = `${inputId}-supporting`;

  const isDisabled = availability === 'disabled';
  const isReadOnly = availability === 'readOnly';
  const iconSizePx = ICON_SIZE_PX[size];
  const computedType =
    trailingType === 'reveal'
      ? passwordVisible
        ? 'text'
        : 'password'
      : (type ?? 'text');

  const wrapperClasses = [
    'flex flex-col w-full',
    WRAPPER_GAP_MAP[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const boxClasses = [
    'flex items-center shrink-0 w-full overflow-hidden',
    'border border-solid rounded-sm',
    HEIGHT_MAP[size],
    BOX_PADDING_MAP[size],
    BOX_GAP_MAP[size],
    getBoxBgClass(availability),
    getBoxBorderClasses(availability, validation),
    // Focus Ring — keyboard-only (:focus-visible). Pressed stroke는 focus-within:으로 분리
    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--office-bg-brand-strong-default)',
  ].join(' ');

  const iconColorClass = getIconColorClass(availability);

  const inputClasses = [
    'flex-1 min-w-0 bg-transparent outline-none border-none',
    TYPO_MAP[size],
    alignment === 'right' ? 'text-right' : 'text-left',
    'text-(--sys-text-neutral-normal-default)',
    'placeholder:text-(--sys-text-neutral-muted-default)',
    'disabled:text-(--sys-text-neutral-faint-default)',
    'disabled:placeholder:text-(--sys-text-neutral-faint-default)',
  ].join(' ');

  const trailingBtnClasses = [
    'flex items-center justify-center shrink-0 bg-transparent border-none p-0',
    iconColorClass,
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');

  const qaId = `input-${size}-${availability}-${validation}`;

  return (
    <div className={wrapperClasses} data-qa-id={qaId}>
      {label && (
        <label
          htmlFor={inputId}
          className={[
            'label-md-regular shrink-0',
            getLabelClass(availability),
          ].join(' ')}
        >
          {label}
        </label>
      )}

      <div className={boxClasses}>
        {leadingIcon && (
          <span
            className={[
              'shrink-0 flex items-center justify-center',
              iconColorClass,
            ].join(' ')}
            style={{ width: iconSizePx, height: iconSizePx }}
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          type={computedType}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={validation === 'error' || undefined}
          aria-describedby={supportingText ? supportingTextId : undefined}
          className={inputClasses}
          {...rest}
        />

        {trailingType === 'clear' && (
          <button
            type="button"
            onClick={onClear}
            disabled={isDisabled}
            aria-label="지우기"
            className={trailingBtnClasses}
            style={{ width: iconSizePx, height: iconSizePx }}
          >
            <ClearIcon size={iconSizePx} />
          </button>
        )}

        {trailingType === 'reveal' && (
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            disabled={isDisabled}
            aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            className={trailingBtnClasses}
            style={{ width: iconSizePx, height: iconSizePx }}
          >
            {passwordVisible ? (
              <EyeOffIcon size={iconSizePx} />
            ) : (
              <EyeIcon size={iconSizePx} />
            )}
          </button>
        )}

        {trailingType === 'custom' && trailingIcon && (
          <span
            className={[
              'shrink-0 flex items-center justify-center',
              iconColorClass,
            ].join(' ')}
            style={{ width: iconSizePx, height: iconSizePx }}
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}
      </div>

      {supportingText && (
        <p
          id={supportingTextId}
          className={[
            'caption-md-regular shrink-0',
            getSupportingTextClass(availability, validation),
          ].join(' ')}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
}
