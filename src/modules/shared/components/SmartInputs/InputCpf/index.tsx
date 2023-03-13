import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import AuthFormController from '../../../../auth/components/AuthFormController/AuthFormController';
import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';

interface InputCPFProps {
  label: string;
  name: string;

  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputCpf = ({ label, name, docValue, docStatus }: InputCPFProps) => {
  const { field } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();

  const CPFMask = /^(\d{3})(\d{3})(\d{3})(\d{2})/;

  const handleChange = (value: string) => {
    if (value) {
      setInputValue(getNumbersFromString(value, false));
      field.onChange({
        inputId: name,
        value: getNumbersFromString(value, false),
      });
    } else {
      setInputValue('');
    }
  };

  const formatCpfValue = () => {
    if (inputValue && inputValue.length === 11) {
      setInputValue(inputValue.replace(CPFMask, '$1.$2.$3-$4'));
    }
  };

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
  }, [docValue]);

  return (
    <div className="pw-mb-3">
      <AuthFormController label={label} name={name}>
        <input
          readOnly={Boolean(
            docValue && docStatus !== UserDocumentStatus.RequiredReview
          )}
          name={name}
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder="Digite apenas numeros"
          maxLength={11}
          onBlur={() => formatCpfValue()}
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] pw-outline-1 pw-outline-brand-primary pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </AuthFormController>
    </div>
  );
};

export default InputCpf;
