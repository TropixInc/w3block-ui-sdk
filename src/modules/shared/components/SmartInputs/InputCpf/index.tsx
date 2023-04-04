import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';
import { ReactComponent as CheckIcon } from '../../../assets/icons/checkCircledOutlined.svg';
import { ReactComponent as ErrorIcon } from '../../../assets/icons/x-circle.svg';
import { FormItemContainer } from '../../Form/FormItemContainer';

interface InputCPFProps {
  label: string;
  name: string;

  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputCpf = ({ label, name, docValue, docStatus }: InputCPFProps) => {
  const { field, fieldState } = useController({ name });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  const renderStatus = () => {
    if (field.value) {
      if (fieldState.invalid) {
        return (
          <p className="pw-flex pw-items-center pw-gap-x-1">
            <ErrorIcon className="pw-stroke-[#ED4971] pw-w-3 pw-h-3" />
          </p>
        );
      } else {
        return <CheckIcon className="pw-stroke-[#18ee4d] pw-w-3 pw-h-3" />;
      }
    }
  };

  return (
    <div className="pw-mb-3">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer invalid={fieldState.invalid}>
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
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </FormItemContainer>
      <p className="mt-5">{renderStatus()}</p>
    </div>
  );
};

export default InputCpf;
