/* eslint-disable prettier/prettier */
import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

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
  return classNames(width === 'full'
    ? ' pw-w-full pw-text-center pw-py-[11px] '
    : width === 'big'
      ? ' pw-px-[48px] pw-py-[11px] '
      : ' pw-px-[24px] pw-py-[7.5px] ')
}

type GetButtonClassNameArgs = Pick<ButtonProps, 'className' | 'width' | 'model'>;

const getPrimaryButtonClassNames = ({
  className,
  width,
  model,
}: GetButtonClassNameArgs) => {
  return classNames(
    'pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px]',
    className ? className :
      model === 'primary' ?
        'pw-text-[#FFFFFF]  !pw-bg-[#295BA6] hover:!pw-bg-[#4194CD] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] pw-border-b pw-border-[#FFFFFF] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] '
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
}: GetButtonClassNameArgs) => {
  return classNames(
    className ? className : 'pw-text-[#383857] pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px] !pw-bg-[#EFEFEF] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] active:pw-text-[#295BA6] pw-border pw-border-[#295BA6] disabled:pw-border-[#777E8F] hover:pw-shadow-[0px_4px_20px_rgba(0,0,0,0.25)] ',
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