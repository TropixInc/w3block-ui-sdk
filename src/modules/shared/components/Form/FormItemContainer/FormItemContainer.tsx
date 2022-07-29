import { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

interface FormItemContainerProps {
  children?: ReactNode;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
}

export const FormItemContainer = forwardRef<
  HTMLDivElement,
  FormItemContainerProps
>(({ children, className = '', invalid = false, disabled = false }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'pw-rounded-lg pw-outline pw-outline-[#94B8ED] pw-transition-all pw-duration-200',
      className,
      invalid
        ? 'pw-outline-[#FF0505] pw-outline-2'
        : 'pw-outline-[#94B8ED] pw-outline-1',
      disabled ? '!pw-bg-[#EEEEEE] !pw-outline-[#C1C1C1]' : ''
    )}
  >
    {children}
  </div>
));

FormItemContainer.displayName = 'TokenizationFormItemContainer';
