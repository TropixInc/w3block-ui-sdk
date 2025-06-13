import {
  ChangeEventHandler,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { InputMask } from '@react-input/mask';

import classNames from "classnames";

import PasswordIconShow from "../assets/icons/eyeIcon.svg";
import PasswordIconHide from "../assets/icons/eyeIconCrossed.svg";
import SearchIcon from "../assets/icons/searchOutlined.svg";
import { BaseButton } from "./Buttons";


interface BaseInputTheme {
  default?: string;
  invalid?: string;
  valid?: string;
  disabled?: string;
  small?: string;
  medium?: string;
  large?: string;
}
export interface BaseInputProps
  extends Partial<React.InputHTMLAttributes<HTMLInputElement>> {
  className?: string;
  invalid?: boolean;
  valid?: boolean;
  disabled?: boolean;
  theme?: BaseInputTheme;
  disableClasses?: boolean;
  variant?: "small" | "medium" | "large";
  button?: {
    text: string;
    onClick(): void;
  };
  searchIcon?: boolean;
  onBlur?: () => void;
  mask?: string | Array<string | RegExp>;
  maskChar?: string | null | undefined;
  maskPlaceholder?: string | null | undefined;
  alwaysShowMask?: boolean | undefined;
  readonly?: boolean;
  textarea?: boolean;
  fullWidth?: boolean;
  textareaHeight?: number;
}
interface BaseInputLayoutProps extends Partial<BaseInputProps> {
  children?: ReactNode;
}

const defaultTheme: BaseInputTheme = {
  invalid: "!pw-outline-[#DC3545]",
  valid: "!pw-outline-[#198754]",
  disabled: "pw-bg-[#E9ECEF] pw-outline-[#CED4DA]",
  default: "pw-outline-[#CED4DA]",
  small: "pw-h-[24px] pw-text-[14px]",
  medium: "pw-h-[32px] pw-text-[16px]",
  large: "pw-h-[48px] pw-text-[20px]",
};

export const BaseInputLayout = ({
  className = "",
  valid = false,
  invalid = false,
  disabled = false,
  theme = {},
  disableClasses,
  variant = "medium",
  children,
  readonly,
  textarea,
  fullWidth,
}: BaseInputLayoutProps) => {
  return (
    <div
      className={
        disableClasses
          ? classNames(className)
          : classNames(
              "pw-rounded-lg pw-transition-all pw-duration-200 pw-p-[7px_12px_6px_12px] pw-flex pw-items-center pw-justify-between relative pw-bg-white pw-text-black",
              fullWidth ? "pw-w-full" : "",
              theme.default ?? defaultTheme.default ?? "",
              valid ? theme.valid ?? defaultTheme.valid ?? "" : "",
              className,
              invalid
                ? theme.invalid ?? defaultTheme.invalid ?? ""
                : "pw-outline-[#94B8ED] pw-outline-1",
              disabled ? theme.disabled ?? defaultTheme.disabled : "",
              variant === "large"
                ? textarea
                  ? "pw-text-[14px]"
                  : defaultTheme.large
                : "",
              variant === "medium"
                ? textarea
                  ? "pw-text-[16px]"
                  : defaultTheme.medium
                : "",
              variant === "small"
                ? textarea
                  ? "pw-text-[20px]"
                  : defaultTheme.small
                : "",
              readonly
                ? "!pw-outline-none focus:!pw-outline-none"
                : "!pw-outline focus:!pw-outline-[#9EC5FE]"
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
  className = "",
  valid = false,
  invalid = false,
  disabled = false,
  theme = {},
  disableClasses,
  variant = "medium",
  button,
  searchIcon,
  mask,
  type = "text",
  readonly = false,
  textarea,
  fullWidth,
  textareaHeight,
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
      readonly={readonly}
      textarea={textarea}
      fullWidth={fullWidth}
    >
      <div className="pw-flex pw-items-center pw-gap-2 pw-w-full pw-h-full pw-bg-white pw-text-black">
        {searchIcon ? (
          <SearchIcon className="pw-stroke-black pw-w-5 pw-pb-[2px]" />
        ) : null}
        {mask ? (
          <InputMask
            className={`pw-w-full pw-h-full focus:pw-outline-none pw-flex`}
            mask={mask as string}
            {...props}
          />
        ) : textarea ? (
          <textarea
            name={props.name}
            id={props.id}
            disabled={disabled}
            readOnly={readonly}
            onChange={
              props.onChange as unknown as ChangeEventHandler<HTMLTextAreaElement>
            }
            style={{ height: `${textareaHeight}px` }}
            className="pw-w-full pw-flex pw-h-full pw-bg-white focus:pw-outline-none pw-outline-none"
          />
        ) : (
          <input
            className="pw-w-full pw-flex pw-h-full focus:pw-outline-none pw-outline-none"
            type={
              type === "password" ? (!isShowingPassword ? type : "text") : type
            }
            {...props}
          />
        )}
      </div>
      {type === "password" ? (
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
