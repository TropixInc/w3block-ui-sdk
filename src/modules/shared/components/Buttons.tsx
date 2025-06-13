import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type OffpixButtonVariant = 'filled' | 'outlined' | 'link';

export interface BaseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: (e: any) => void;
  onBlur?: () => void;
  fullWidth?: boolean;
  type?: 'submit' | 'button' | 'reset';
  size?: BaseButtonSize;
  disabled?: boolean;
  className?: string;
  variant?: BaseButtonVariants;
  variantType?: BaseButtonVariantsType;
  form?: string;
  link?: {
    href: string;
    target?: string;
  };
  placeholder?: string;
}

type GetButtonClassNameArgs = Pick<
  BaseButtonProps,
  'className' | 'fullWidth' | 'variant' | 'variantType' | 'size'
>;

type BaseButtonSize = 'small' | 'large' | 'medium';
type BaseButtonVariants = 'filled' | 'outlined';
type BaseButtonVariantsType = 'primary' | 'secondary' | 'terciary';

export const getButtonClassNames = ({
  className,
  fullWidth,
  variant,
  variantType,
  size,
}: GetButtonClassNameArgs) => {
  return classNames(
    className,
    'pw-flex pw-items-center pw-justify-center pw-text-center pw-rounded-[8px] pw-font-[400] pw-p-[6px_18px]',
    fullWidth ? '!pw-w-full !pw-max-w-full' : '',
    size === 'large' && 'pw-text-lg pw-h-[48px]',
    size === 'medium' && 'pw-text-base pw-h-[32px]',
    size === 'small' && 'pw-text-sm pw-h-[24px]',
    variantType === 'primary' &&
      'pw-bg-[#0050FF] pw-outline-[#0050FF] hover:pw-bg-[#0034A3] disabled:pw-opacity-[65%] disabled:hover:pw-bg-[#0050FF]',
    variantType === 'secondary' &&
      'pw-bg-[#FF5500] pw-outline-[#FF5500] hover:pw-bg-[#CC4400] disabled:pw-opacity-[65%] disabled:hover:pw-bg-[#0050FF]',
    variantType === 'terciary' &&
      'pw-bg-gradient-to-r pw-from-[#0050FF] pw-to-[#00E9E7] hover:pw-from-[#00E9E7] hover:pw-to-[#0050FF] disabled:pw-opacity-[65%] disabled:hover:pw-from-[#0050FF] disabled:hover:pw-to-[#00E9E7]',
    variant === 'filled' && 'pw-text-white',
    variant === 'outlined' && 'pw-text-black pw-outline pw-outline-1',
    variant === 'outlined' &&
      variantType === 'primary' &&
      '!pw-bg-white hover:!pw-bg-[#E7F1FF] pw-outline-[#0050FF] hover:pw-outline-[#0034A3]',
    variant === 'outlined' &&
      variantType === 'secondary' &&
      '!pw-bg-white hover:!pw-bg-[#FFE5D0] pw-outline-[#FF5500] hover:pw-outline-[#CC4400]',
    variant === 'outlined' &&
      variantType === 'terciary' &&
      '!pw-outline-none !pw-p-[1px]'
  );
};

export const BaseButton = ({
  className = '',
  type = 'button',
  size = 'medium',
  children,
  fullWidth = false,
  variant = 'filled',
  variantType = 'primary',
  link,
  ...props
}: BaseButtonProps) =>
  link?.href ? (
    <a
      className={getButtonClassNames({
        className,
        fullWidth,
        variant,
        variantType,
        size,
      })}
      href={link?.href}
      target={link.target}
    >
      {variantType === 'terciary' && variant === 'outlined' ? (
        <div className="pw-flex pw-h-full pw-w-full pw-items-center pw-justify-center pw-rounded-[8px] pw-bg-white hover:!pw-bg-[#E7F1FF] pw-p-[5px_11px]">
          {children}
        </div>
      ) : (
        children
      )}
    </a>
  ) : (
    <button
      className={getButtonClassNames({
        className,
        fullWidth,
        variant,
        variantType,
        size,
      })}
      type={type}
      {...props}
    >
      {variantType === 'terciary' && variant === 'outlined' ? (
        <div className="pw-flex pw-h-full pw-w-full pw-items-center pw-justify-center pw-rounded-[8px]">
          {children}
        </div>
      ) : (
        children
      )}
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
