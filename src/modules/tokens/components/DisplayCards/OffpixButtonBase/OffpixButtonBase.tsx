import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type OffpixButtonVariant = 'filled' | 'outlined';

export interface OffpixButtonBaseProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  fullWidth?: boolean;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: OffpixButtonVariant;
  styleClass?: any;
}

type GetButtonClassNameArgs = Pick<
  OffpixButtonBaseProps,
  'className' | 'fullWidth' | 'variant'
>;

export const getButtonClassNames = ({
  className,
  fullWidth,
  variant,
}: GetButtonClassNameArgs) => {
  return classNames(
    className,
    'text-center py-4 rounded-lg font-semibold text-[24px] leading-[28px] disabled:hover:shadow-none',
    fullWidth ? 'w-full' : '',
    variant === 'filled'
      ? 'text-white bg-[#5682C3] hover:bg-[#5682C3] hover:shadow-xl disabled:bg-[#A5A5A5] disabled:text-[#373737] active:bg-[#3663A6]'
      : 'outline outline-1 outline-[#5682c3] bg-[transparent] text-[#5682C3] hover:bg-[transparent] hover:text-[#5682C3] hover:shadow-xl transition-all duration-200 disabled:bg-[transparent] disabled:text-[#A5A5A5] disabled:outline-[#A5A5A5] active:bg-[#E9F0FB] active:text-[#3B68AB] active:outline-[#3B68AB]'
  );
};

export const OffpixButtonBase = ({
  className = '',
  type = 'button',
  children,
  fullWidth = false,
  variant = 'filled',
  styleClass = {},
  ...props
}: OffpixButtonBaseProps) => (
  <button
    style={styleClass}
    className={getButtonClassNames({ className, fullWidth, variant })}
    type={type}
    {...props}
  >
    {children}
  </button>
);
