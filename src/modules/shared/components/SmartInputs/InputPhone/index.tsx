import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';

import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';
import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';

interface InputPhoneProps {
  label: string;
  name: string;
}

const InputPhone = ({ label, name }: InputPhoneProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [invalidNumber, onChangeInvalidNumber] = useState(false);

  const handleChange = (value: string) => {
    if (value) {
      setInputValue(getNumbersFromString(value, false));
    } else {
      setInputValue('');
    }
  };

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <Input
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder="+XX XX XXXXX XXXX"
          onBlur={
            inputValue
              ? isValidPhoneNumber(inputValue)
                ? () => onChangeInvalidNumber(false)
                : () => onChangeInvalidNumber(true)
              : () => onChangeInvalidNumber(false)
          }
          className={classNames(
            'text-base h-[46px] text-[#969696] leading-4 w-full shadow-[0_4px_15px_#00000012] outline-1 rounded-lg outline-none bg-transparent px-[10px] autofill:bg-transparent',
            invalidNumber ? 'outline-[#FF0505]' : 'outline-[#94B8ED]'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputPhone;
