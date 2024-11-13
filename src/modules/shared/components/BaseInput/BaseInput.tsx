import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import ReactInputMask, { Props } from 'react-input-mask';

import classNames from 'classnames';

import PasswordIconShow from '../../assets/icons/eyeIcon.svg?react';
import PasswordIconHide from '../../assets/icons/eyeIconCrossed.svg?react';
import SearchIcon from '../../assets/icons/searchOutlined.svg?react';
import { BaseButton } from '../Buttons';

interface BaseInputTheme {
  default?: string;
  invalid?: string;
  valid?: string;
  disabled?: string;
  small?: string;
  medium?: string;
  large?: string;
}
export interface BaseInputProps extends Partial<Props> {
  className?: string;
  invalid?: boolean;
  valid?: boolean;
  disabled?: boolean;
  theme?: BaseInputTheme;
  disableClasses?: boolean;
  variant?: 'small' | 'medium' | 'large';
  button?: {
    text: string;
    onClick(): void;
  };
  searchIcon?: boolean;
  onBlur?: () => void;
}
interface BaseInputLayoutProps extends Partial<BaseInputProps> {
  children?: ReactNode;
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

export const BaseInputLayout = ({
  className = '',
  valid = false,
  invalid = false,
  disabled = false,
  theme = {},
  disableClasses,
  variant = 'medium',
  children,
}: BaseInputLayoutProps) => {
  return (
    <div
      className={
        disableClasses
          ? classNames(className)
          : classNames(
              'pw-rounded-lg pw-outline pw-transition-all pw-duration-200 focus:!pw-outline-[#9EC5FE] pw-p-[7px_12px_6px_12px] pw-flex pw-items-center pw-justify-between relative',
              theme.default ?? defaultTheme.default ?? '',
              valid ? theme.valid ?? defaultTheme.valid ?? '' : '',
              className,
              invalid
                ? theme.invalid ?? defaultTheme.invalid ?? ''
                : 'pw-outline-[#94B8ED] pw-outline-1',
              disabled ? theme.disabled ?? defaultTheme.disabled : '',
              variant === 'large' ? defaultTheme.large : '',
              variant === 'medium' ? defaultTheme.medium : '',
              variant === 'small' ? defaultTheme.small : ''
            )
      }
    >
      {children}
    </div>
  );
};

const RenderRevealPasswordButton = ({
  isShowingPassword,
  setIsShowingPassword,
}: {
  isShowingPassword: boolean;
  setIsShowingPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button
      onClick={() => setIsShowingPassword(!isShowingPassword)}
      className="pr-5 bg-transparent absolute right-0 top-1/2 -translate-y-1/2"
      type="button"
    >
      {isShowingPassword ? (
        <PasswordIconShow className="w-4 !stroke-black" />
      ) : (
        <PasswordIconHide className="w-4 !stroke-black" />
      )}
    </button>
  );
};

export const BaseInput = ({
  className = '',
  valid = false,
  invalid = false,
  disabled = false,
  theme = {},
  disableClasses,
  variant = 'medium',
  button,
  searchIcon,
  mask,
  type = 'text',
  ...props
}: BaseInputProps) => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  return (
    <BaseInputLayout
      className={className}
      valid={valid}
      invalid={invalid}
      disableClasses={disableClasses}
      theme={theme}
      disabled={disabled}
      variant={variant}
    >
      <div className="pw-flex pw-items-center pw-gap-2">
        {searchIcon ? (
          <SearchIcon className="pw-stroke-black pw-w-5 pw-pb-[2px]" />
        ) : null}
        {mask ? (
          <ReactInputMask
            className={`pw-w-full pw-h-full focus:pw-outline-none pw-flex`}
            mask={mask}
            {...props}
          />
        ) : (
          <input
            className="pw-w-full pw-flex pw-h-full focus:pw-outline-none pw-outline-none"
            type={
              type === 'password' ? (!isShowingPassword ? type : 'text') : type
            }
            {...props}
          />
        )}
      </div>
      {type === 'password' ? (
        <RenderRevealPasswordButton
          isShowingPassword={isShowingPassword}
          setIsShowingPassword={setIsShowingPassword}
        />
      ) : null}
      {button ? (
        <BaseButton size="small" onClick={button.onClick}>
          {button.text}
        </BaseButton>
      ) : null}
    </BaseInputLayout>
  );
};
