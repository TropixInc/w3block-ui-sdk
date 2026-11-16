import {
  ChangeEventHandler,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { IMaskInput } from 'react-imask';

import classNames from 'classnames';

import PasswordIconShow from '../assets/icons/eyeIcon.svg';
import PasswordIconHide from '../assets/icons/eyeIconCrossed.svg';
import SearchIcon from '../assets/icons/searchOutlined.svg';
import { BaseButton } from './Buttons';

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
  variant?: 'small' | 'medium' | 'large';
  /**
   * Superfície do campo. `'default'` mantém o fundo branco histórico
   * (compatibilidade). `'filled'` aplica o preenchimento cinza + borda neutra
   * usados na variante de filtros v2 (redesign). Repassado automaticamente
   * pelo `BaseSelect` e pelo `CustomDatePicker`.
   */
  surface?: 'default' | 'filled';
  /**
   * Indica que o campo `filled` está "em uso" (com valor). Aplica o realce da
   * marca (borda/fundo azul). Sem isso, o campo fica no estágio neutro (branco
   * + borda), evitando o aspecto de "desativado". Calculado automaticamente
   * pelo BaseInput a partir do value; BaseSelect calcula a partir do selecionado.
   */
  surfaceActive?: boolean;
  button?: {
    text?: string;
    icon?: ReactNode;
    onClick(): void;
  };
  searchIcon?: boolean;
  customIcon?: ReactNode;
  /** Ícone/elemento renderizado à direita do campo (ex.: calendário discreto
   * na variante filled), sem o estilo de botão do `button`. */
  customTrailingIcon?: ReactNode;
  onBlur?: () => void;
  mask?: string | Array<string | RegExp>;
  radix?: string | null | undefined;
  maskPlaceholder?: string | null | undefined;
  alwaysShowMask?: boolean | undefined;
  readonly?: boolean;
  textarea?: boolean;
  fullWidth?: boolean;
  textareaHeight?: number;
  onChangeValueInput?: (value: string) => void;
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
  surface = 'default',
  surfaceActive = false,
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
              `pw-rounded-lg pw-transition-all pw-duration-200 ${readonly ? '' : 'pw-p-[7px_12px_6px_12px]'} pw-flex pw-items-center pw-justify-between relative pw-text-black`,
              fullWidth ? 'pw-w-full' : '',
              disabled
                ? (theme.disabled ?? defaultTheme.disabled)
                : surface === 'filled'
                  ? surfaceActive
                    ? 'pw-bg-[#eff4ff]'
                    : 'pw-bg-white'
                  : 'pw-bg-white',
              // Variante filled em dois estágios: sem uso = branco + borda
              // neutra (com realce no foco); em uso = borda/realce da marca.
              surface === 'filled'
                ? surfaceActive
                  ? '!pw-outline-[#2563EB]'
                  : '!pw-outline-[#D9DDE3] focus-within:!pw-outline-[#2563EB]'
                : '',
              theme.default ?? defaultTheme.default ?? '',
              valid ? theme.valid ?? defaultTheme.valid ?? '' : '',
              className,
              invalid
                ? theme.invalid ?? defaultTheme.invalid ?? ''
                : 'pw-outline-[#94B8ED] pw-outline-1',
              variant === 'large'
                ? textarea
                  ? 'pw-text-[14px]'
                  : defaultTheme.large
                : '',
              variant === 'medium'
                ? textarea
                  ? 'pw-text-[16px]'
                  : defaultTheme.medium
                : '',
              variant === 'small'
                ? textarea
                  ? 'pw-text-[20px]'
                  : defaultTheme.small
                : '',
              readonly
                ? '!pw-outline-none focus:!pw-outline-none'
                : '!pw-outline focus:!pw-outline-[#9EC5FE]'
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
  surface = 'default',
  button,
  searchIcon,
  customIcon,
  customTrailingIcon,
  mask,
  type = 'text',
  readonly = false,
  textarea,
  fullWidth,
  textareaHeight,
  onChangeValueInput,
  ...props
}: BaseInputProps) => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const filledActive =
    surface === 'filled' &&
    props.value !== undefined &&
    props.value !== null &&
    String(props.value).length > 0;

  return (
    <BaseInputLayout
      className={className}
      valid={valid}
      invalid={invalid}
      disableClasses={disableClasses}
      theme={theme}
      disabled={disabled}
      variant={variant}
      surface={surface}
      surfaceActive={filledActive}
      readonly={readonly}
      textarea={textarea}
      fullWidth={fullWidth}
    >
      <div
        className={classNames(
          'pw-flex pw-items-center pw-gap-2 pw-w-full pw-h-full pw-text-black',
          surface === 'filled' ? 'pw-bg-transparent' : 'pw-bg-white'
        )}
      >
        {searchIcon ? (
          customIcon ? (
            customIcon
          ) : (
            <SearchIcon className="pw-stroke-black pw-w-5 pw-pb-[2px]" />
          )
        ) : null}
        {mask ? (
          <IMaskInput
            className={classNames(
              'pw-w-full pw-h-full focus:pw-outline-none pw-flex',
              surface === 'filled' ? 'pw-bg-transparent' : ''
            )}
            mask={mask as string}
            value={props?.value?.toString()}
            onAccept={(v) => onChangeValueInput && onChangeValueInput(v)}
            {...Object.fromEntries(
              Object.entries(props).filter(
                ([key]) => key !== 'max' && key !== 'min'
              )
            )}
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
            className={classNames(
              'pw-w-full pw-flex pw-h-full focus:pw-outline-none pw-outline-none',
              surface === 'filled' ? 'pw-bg-transparent' : 'pw-bg-white'
            )}
          />
        ) : (
          <input
            className={classNames(
              'pw-w-full pw-flex pw-h-full focus:pw-outline-none pw-outline-none',
              surface === 'filled'
                ? 'pw-bg-transparent pw-text-[14px] placeholder:pw-text-[#8b93a3]'
                : ''
            )}
            type={
              type === 'password' ? (!isShowingPassword ? type : 'text') : type
            }
            {...props}
          />
        )}
      </div>
      {customTrailingIcon ? (
        <div className="pw-flex pw-items-center pw-pl-2">
          {customTrailingIcon}
        </div>
      ) : null}
      {type === 'password' ? (
        <RenderRevealPasswordButton
          isShowingPassword={isShowingPassword}
          setIsShowingPassword={setIsShowingPassword}
        />
      ) : null}
      {button ? (
        <BaseButton size="small" onClick={button.onClick}>
          {button.icon || button.text}
        </BaseButton>
      ) : null}
    </BaseInputLayout>
  );
};
