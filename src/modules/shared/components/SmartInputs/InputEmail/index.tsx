import { useState } from 'react';

import classNames from 'classnames';
import isEmail from 'validator/lib/isEmail';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';

interface InputCPFProps {
  label: string;
  name: string;
}

const InputEmail = ({ label, name }: InputCPFProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(true);
  const handleChange = (value: string) => {
    if (value) {
      setInputValue(value);
    } else {
      setInputValue('');
    }
  };

  const validEmail = () => {
    if (inputValue) {
      setIsValid(isEmail(inputValue));
    }
  };

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <input
          onChange={(e) => handleChange(e.target.value)}
          onBlur={validEmail}
          value={inputValue}
          type="email"
          className={classNames(
            '!pw-px-[10px] !pw-py-[14px] !pw-text-[13px] pw-rounded-md  pw-text-fill-[#353945] pw-text-base pw-leading-4 pw-font-normal pw-w-full pw-border-[#94B8ED] pw-border pw-outline-none pw-bg-transparent placeholder:!pw-text-[#777E8F]',
            isValid ? 'pw-border-[#94B8ED]' : 'pw-border-[#C63535]'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputEmail;
