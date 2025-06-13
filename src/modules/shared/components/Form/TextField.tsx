import { ChangeEvent, useState } from 'react';
import { useController } from 'react-hook-form';

import classNames from 'classnames';

import PasswordIconShow from '../../../shared/assets/icons/eyeIcon.svg';
import PasswordIconHide from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { FormItemContainer } from './FormItemContainer';

interface TextFieldProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onBlur?: () => void;
  type?: 'text' | 'password';
  classes?: {
    root?: string;
    rootDisabled?: string;
    input?: string;
  };
  readOnly?: boolean;
  autoComplete?: string;
}

export const TextField = ({
  name,
  placeholder,
  disabled,
  onChange: onChangeProps,
  className = '',
  classes = {},
  onBlur: _onBlur,
  type = 'text',
  readOnly = false,
  autoComplete,
}: TextFieldProps) => {
  const { field, fieldState } = useController({ name });
  const { onChange, onBlur, ...rest } = field;
  const [isShowingPassword, setIsShowwingPassword] = useState(false);

  const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeProps ? onChangeProps(event) : onChange(event);
  };

  const onInputBlur = () => {
    _onBlur && _onBlur();
    onBlur();
  };

  const renderRevealPasswordButton = () => (
    <button
      onClick={() => setIsShowwingPassword(!isShowingPassword)}
      className="pw-pr-5 pw-bg-transparent pw-absolute pw-right-0 pw-top-1/2 -pw-translate-y-1/2"
      type="button"
    >
      {isShowingPassword ? (
        <PasswordIconShow className={'pw-w-4 !pw-stroke-[#353945]'} />
      ) : (
        <PasswordIconHide className={`pw-w-4 !pw-stroke-[#353945]`} />
      )}
    </button>
  );

  return (
    <FormItemContainer
      invalid={fieldState.invalid}
      className={classNames(
        disabled
          ? classes.rootDisabled ??
              '!pw-bg-[#EEEEEE] !pw-outline-[#C1C1C1] pw-flex'
          : 'pw-flex ',
        className,
        classes.root ?? 'pw-relative'
      )}
    >
      <input
        disabled={disabled}
        id={name}
        type={!isShowingPassword ? type : 'text'}
        readOnly={readOnly}
        className={classNames(
          'pw-text-base pw-leading-4 pw-font-normal pw-w-full pw-outline-none pw-bg-transparent pw-py-4 pw-px-[18px] autofill:pw-bg-transparent,',
          type == 'password' ? '!pw-pr-12' : '',
          'placeholder:pw-text-[#c4c4c4]',
          disabled ? 'pw-opacity-40' : '',
          classes.input ?? '',
          'focus:pw-outline-none'
        )}
        placeholder={!disabled ? placeholder : undefined}
        {...rest}
        onChange={onTextFieldChange}
        onBlur={onInputBlur}
        autoComplete={autoComplete}
      />
      {type == 'password' ? renderRevealPasswordButton() : null}
    </FormItemContainer>
  );
};
