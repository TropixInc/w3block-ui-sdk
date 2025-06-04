import { useController } from 'react-hook-form';

import classNames from 'classnames';
import { TextField } from '../../shared/components/Form/TextField';




interface AuthTextFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  type?: 'text' | 'password';
  disabled?: boolean;
  autoComplete?: string;
}

export const AuthTextField = ({
  name,
  className = '',
  placeholder,
  type = 'text',
  disabled = false,
  autoComplete,
}: AuthTextFieldProps) => {
  const getOutlineClassName = () => {
    if (invalid) return '!pw-outline-[#C63535]';
    if (disabled) return '!pw-outline-[#777E8F]';
    return isDirty ? '!pw-outline-[#76DE8D]' : 'pw-outline-brand-primary';
  };
  const { fieldState } = useController({ name });
  const { invalid, isDirty } = fieldState;

  return (
    <TextField
      type={type}
      name={name}
      className={classNames(
        className,
        'pw-rounded-[7px] !pw-font-normal !pw-leading-[18px] pw-mt-1 !pw-outline-1',

        getOutlineClassName()
      )}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      classes={{
        rootDisabled: '!pw-outline-[#676767] pw-bg-transparent',
        input: `!pw-px-[10px] !pw-py-[14px] placeholder:!pw-text-[#777E8F] !pw-leading-[18px] autofill:pw-bg-transparent disabled:pw-text-[#353945] disabled:pw-bg-[#EFEFEF] pw-text-fill-[#353945] autofill:pw-bg-transparent autofill:pw-shadow-[0_0_0_30px_#ffffff_inset] ${
          invalid ? '!pw-text-[#C63535]' : '!pw-text-[#353945]'
        }`,
      }}
    />
  );
};
