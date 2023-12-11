import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type OffpixButtonVariant = 'filled' | 'outlined';

export interface PixwayButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  fullWidth?: boolean;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: OffpixButtonVariant;
  placeholder?: string;
}

type GetButtonClassNameArgs = Pick<
  PixwayButtonProps,
  'className' | 'fullWidth' | 'variant'
>;

export const getButtonClassNames = ({
  className,
  fullWidth,
  variant,
}: GetButtonClassNameArgs) => {
  return classNames(
    'pw-text-center pw-py-4 pw-rounded-lg pw-font-semibold pw-text-[24px] pw-leading-[28px] disabled:hover:pw-shadow-none',
    fullWidth ? 'pw-w-full' : '',
    variant === 'filled'
      ? 'pw-text-white pw-bg-[#5682C3] hover:pw-bg-[#5682C3] hover:pw-shadow-xl disabled:!pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#3663A6]'
      : 'pw-outline pw-outline-1 pw-outline-[#5682c3] pw-bg-[transparent] pw-text-[#5682C3] hover:pw-bg-[transparent] hover:pw-text-[#5682C3] hover:pw-shadow-xl pw-transition-all pw-duration-200 disabled:pw-bg-[transparent] disabled:pw-text-[#A5A5A5] disabled:pw-outline-[#A5A5A5] active:pw-bg-[#E9F0FB] active:pw-text-[#3B68AB] active:pw-outline-[#3B68AB]',
    className
  );
};

export const PixwayButton = ({
  className = '',
  type = 'button',
  children,
  fullWidth = false,
  variant = 'filled',
  ...props
}: PixwayButtonProps) => (
  <button
    className={getButtonClassNames({ className, fullWidth, variant })}
    type={type}
    {...props}
  >
    {children}
  </button>
);
