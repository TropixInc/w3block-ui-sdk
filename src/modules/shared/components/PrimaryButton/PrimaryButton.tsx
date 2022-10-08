/* eslint-disable prettier/prettier */
import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type PrimaryButtonSize = 'small' | 'big' | 'full';

export interface PrimaryButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  width?: PrimaryButtonSize;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
}

type GetButtonClassNameArgs = Pick<PrimaryButtonProps, 'className' | 'width'>;

export const getButtonClassNames = ({
  className,
  width,
}: GetButtonClassNameArgs) => {
  return classNames(
    ' pw-text-[#FFFFFF] pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px] ',
    width === 'full'
      ? ' pw-w-full pw-text-center pw-py-[11px] '
      : width === 'big'
        ? ' pw-px-[48px] pw-py-[11px] '
        : ' pw-px-[24px] pw-py-[7.5px] ',
    ' !pw-bg-[#295BA6] hover:!pw-bg-[#4194CD] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] ',
    ' pw-border-b pw-border-[#FFFFFF] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] ',
    className
  );
};

export const PrimaryButton = ({
  className = '',
  type = 'button',
  children,
  width = 'big',
  ...props
}: PrimaryButtonProps) => (
  <button
    className={getButtonClassNames({ className, width })}
    type={type}
    {...props}
  >
    {children}
  </button>
);
