import { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

interface BaseInputTheme {
  default?: string;
  invalid?: string;
  valid?: string;
  disabled?: string;
  small?: string;
  medium?: string;
  large?: string;
}
interface BaseInputProps {
  children?: ReactNode;
  className?: string;
  invalid?: boolean;
  valid?: boolean;
  disabled?: boolean;
  theme?: BaseInputTheme;
  disableClasses?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const defaultTheme: BaseInputTheme = {
  invalid: '!pw-outline-[#DC3545]',
  valid: '!pw-outline-[#198754]',
  disabled: 'pw-bg-[#E9ECEF] pw-outline-[#CED4DA]',
  default: 'pw-outline-[#CED4DA]',
  small: 'pw-h-[24px] pw-text-[14px]',
  medium: 'pw-h-[32px] pw-text-[16px]',
  large: 'pw-h-[48px] pw-text-[20px]',
};

export const BaseInput = forwardRef<HTMLDivElement, BaseInputProps>(
  (
    {
      children,
      className = '',
      valid = false,
      invalid = false,
      disabled = false,
      theme = {},
      disableClasses,
      size = 'medium',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={
          disableClasses
            ? ''
            : classNames(
                'pw-rounded-lg pw-outline pw-transition-all pw-duration-200 focus:!pw-outline-[#9EC5FE] pw-p-[7px_12px_6px_12px]',
                theme.default ?? defaultTheme.default ?? '',
                valid ? theme.valid ?? defaultTheme.valid ?? '' : '',
                className,
                invalid
                  ? theme.invalid ?? defaultTheme.invalid ?? ''
                  : 'pw-outline-[#94B8ED] pw-outline-1',
                disabled ? theme.disabled ?? defaultTheme.disabled : '',
                size === 'large' ? defaultTheme.large : '',
                size === 'medium' ? defaultTheme.medium : '',
                size === 'small' ? defaultTheme.small : ''
              )
        }
      >
        {children}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';
