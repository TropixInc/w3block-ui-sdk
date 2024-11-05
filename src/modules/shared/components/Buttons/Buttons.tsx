import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type OffpixButtonVariant = 'filled' | 'outlined' | 'link';

export interface BaseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: (e: any) => void;
  onBlur?: () => void;
  fullWidth?: boolean;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: OffpixButtonVariant;
  form?: string;
  link?: {
    href: string;
    target?: string;
  };
  placeholder?: string;
}

type GetButtonClassNameArgs = Pick<
  BaseButtonProps,
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
    variant === 'filled' &&
      'text-white bg-blue1 hover:bg-blue2 hover:shadow-[0px_4px_11px_#00000026] disabled:bg-grey1 disabled:hover:bg-grey1 disabled:text-grey2 active:bg-blue3',
    variant === 'outlined' &&
      'outline outline-1 outline-blue1 bg-[transparent] text-blue1 hover:bg-[transparent] hover:text-blue2 hover:outline-blue2 hover:shadow-[0px_4px_11px_#00000026] transition-all duration-200 disabled:bg-[transparent] disabled:hover:bg-[transparent] disabled:text-grey2 disabled:hover:text-grey2 disabled:outline-grey1 disabled:hover:outline-grey1  active:bg-[#E9F0FB] active:text-blue3 active:outline-blue3',
    variant === 'link' &&
      'bg-[transparent] text-blue1 hover:bg-[transparent] hover:text-blue2 transition-all duration-200 disabled:bg-[transparent] disabled:hover:bg-[transparent] disabled:text-grey2 disabled:hover:text-grey2 active:bg-[#E9F0FB] active:text-blue3'
  );
};

export const BaseButton = ({
  className = '',
  type = 'button',
  children,
  fullWidth = false,
  variant = 'filled',
  link,
  ...props
}: BaseButtonProps) =>
  link?.href ? (
    <a
      className={getButtonClassNames({ className, fullWidth, variant })}
      href={link?.href}
      target={link.target}
    >
      {children}
    </a>
  ) : (
    <button
      className={getButtonClassNames({ className, fullWidth, variant })}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
type PrimaryButtonSize = 'small' | 'big' | 'full';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  width?: PrimaryButtonSize;
  type?: 'submit' | 'button' | 'reset';
  model?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

type GetButtonSizeArgs = Pick<ButtonProps, 'width'>;
const getButtonSize = ({ width }: GetButtonSizeArgs) => {
  return classNames(
    width === 'full'
      ? ' pw-w-full pw-text-center pw-py-[11px] '
      : width === 'big'
      ? ' pw-px-[48px] pw-py-[11px] '
      : ' pw-px-[24px] pw-py-[7.5px] '
  );
};

type GetButtonClassNameArgs2 = Pick<
  ButtonProps,
  'className' | 'width' | 'model'
>;

const getPrimaryButtonClassNames = ({
  className,
  width,
  model,
}: GetButtonClassNameArgs2) => {
  return classNames(
    'pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px]',
    className
      ? className
      : model === 'primary'
      ? 'pw-text-[#FFFFFF]  !pw-bg-[#295BA6] hover:!pw-bg-[#4194CD] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] pw-border pw-border-[#FFFFFF] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] '
      : 'pw-text-[#383857] !pw-bg-[#EFEFEF] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] active:pw-text-[#295BA6] pw-border pw-border-[#295BA6] disabled:pw-border-[#777E8F] hover:pw-shadow-[0px_4px_20px_rgba(0,0,0,0.25)] ',
    getButtonSize({ width: width || 'big' })
  );
};

export const Button = ({
  className = '',
  type = 'button',
  children,
  width = 'big',
  model = 'primary',
  ...props
}: ButtonProps) => (
  <button
    className={getPrimaryButtonClassNames({ className, width, model })}
    type={type}
    {...props}
  >
    {children}
  </button>
);

const getSecondaryButtonClassNames = ({
  className,
  width,
}: GetButtonClassNameArgs2) => {
  return classNames(
    className
      ? className
      : 'pw-text-[#383857] pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px] !pw-bg-[#EFEFEF] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] active:pw-text-[#295BA6] pw-border pw-border-[#295BA6] disabled:pw-border-[#777E8F] hover:pw-shadow-[0px_4px_20px_rgba(0,0,0,0.25)] ',
    getButtonSize({ width: width || 'big' })
  );
};

export const SecondaryButton = ({
  className = '',
  type = 'button',
  children,
  width = 'big',
  ...props
}: ButtonProps) => (
  <button
    className={getSecondaryButtonClassNames({ className, width }) + 'active:'}
    type={type}
    {...props}
  >
    {children}
  </button>
);
