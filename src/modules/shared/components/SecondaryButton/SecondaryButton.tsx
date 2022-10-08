/* eslint-disable prettier/prettier */
import { HTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

export type SecondaryButtonSize = 'small' | 'big' | 'full';

export interface SecondaryButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  width?: SecondaryButtonSize;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
}

type GetButtonClassNameArgs = Pick<SecondaryButtonProps, 'className' | 'width'>;

export const getButtonClassNames = ({
  className,
  width,
}: GetButtonClassNameArgs) => {
  return classNames(
    ' pw-text-[#383857] pw-rounded-full pw-font-medium pw-text-[12px] pw-leading-[18px] ',
    width === 'full'
      ? ' pw-w-full pw-text-center pw-py-[11px] '
      : width === 'big'
        ? ' pw-px-[48px] pw-py-[11px] '
        : ' pw-px-[24px] pw-py-[7.5px] ',
    ' !pw-bg-[#EFEFEF] disabled:!pw-bg-[#DCDCDC] disabled:pw-text-[#777E8F] active:pw-text-[#295BA6]',
    ' pw-border pw-border-[#295BA6] disabled:pw-border-[#777E8F] hover:pw-shadow-[0px_4px_20px_rgba(0,0,0,0.25)] ',
    className
  );
};

export const SecondaryButton = ({
  className = '',
  type = 'button',
  children,
  width = 'big',
  ...props
}: SecondaryButtonProps) => (
  <button
    className={getButtonClassNames({ className, width }) + 'active:'}
    type={type}
    {...props}
  >
    {children}
  </button>
);
