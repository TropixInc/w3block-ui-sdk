import { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

interface FormItemContainerTheme {
  default?: string;
  invalid?: string;
  valid?: string;
  disabled?: string;
}
interface FormItemContainerProps {
  children?: ReactNode;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
  theme?: FormItemContainerTheme;
  disableClasses?: boolean;
}

const defaultTheme: FormItemContainerTheme = {
  invalid: 'pw-outline-[#FF0505] pw-outline-2',
  disabled: '!pw-bg-[#EEEEEE] !pw-outline-[#C1C1C1]',
  default: 'pw-outline-[#94B8ED]',
};

export const FormItemContainer = forwardRef<
  HTMLDivElement,
  FormItemContainerProps
>(
  (
    {
      children,
      className = '',
      invalid = false,
      disabled = false,
      theme = {},
      disableClasses,
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
                'pw-rounded-lg pw-outline pw-transition-all pw-duration-200',
                theme.default ?? defaultTheme.default ?? '',
                className,
                invalid
                  ? theme.invalid ?? defaultTheme.invalid ?? ''
                  : 'pw-outline-[#94B8ED] pw-outline-1',
                disabled ? theme.disabled ?? defaultTheme.disabled : ''
              )
        }
      >
        {children}
      </div>
    );
  }
);

FormItemContainer.displayName = 'TokenizationFormItemContainer';
