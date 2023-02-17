import { useState } from 'react';

import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';
import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';

interface InputCPFProps {
  label: string;
  name: string;
}

const InputCpf = ({ label, name }: InputCPFProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [isInvalidCpf, setIsInvalidCpf] = useState(false);
  const CPFMask = /^(\d{3})(\d{3})(\d{3})(\d{2})/;

  const handleChange = (value: string) => {
    if (value) {
      setInputValue(getNumbersFromString(value, false));
    } else {
      setInputValue('');
    }
  };

  const formatCpfValue = () => {
    if (inputValue && inputValue.length === 11) {
      setInputValue(inputValue.replace(CPFMask, '$1.$2.$3-$4'));
      setIsInvalidCpf(false);
    } else {
      setIsInvalidCpf(true);
    }
  };

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <input
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder="Digite apenas numeros"
          maxLength={11}
          onBlur={() => formatCpfValue()}
          className={classNames(
            '!pw-px-[10px] !pw-py-[14px] !pw-text-[13px] pw-rounded-md  pw-text-fill-[#353945] pw-text-base pw-leading-4 pw-font-normal pw-w-full pw-border-[#94B8ED] pw-border pw-outline-none pw-bg-transparent placeholder:!pw-text-[#777E8F]',
            !isInvalidCpf ? 'pw-border-[#94B8ED]' : 'pw-border-[#C63535]'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputCpf;
