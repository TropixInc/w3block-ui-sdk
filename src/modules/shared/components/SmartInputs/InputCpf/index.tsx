import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputCPFProps {
  label: string;
  name: string;
  hidenValidations?: boolean;
  profilePage?: boolean;

  docValue?: string;
  docStatus?: UserDocumentStatus;
}

const InputCpf = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations,
  profilePage,
}: InputCPFProps) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [translate] = useTranslation();

  const error = fieldState?.error as unknown as InputError;

  const CPFMask = /^(\d{3})(\d{3})(\d{3})(\d{2})/;

  const handleChange = (value: string | undefined) => {
    if (value) {
      setInputValue(getNumbersFromString(value, false));
      field.onChange({
        inputId: name,
        value: getNumbersFromString(value, false),
      });
    } else {
      setInputValue('');
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
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

  return (
    <div className="pw-mb-3 pw-w-full">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer invalid={fieldState.invalid || !field.value}>
        <input
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            profilePage
          }
          name={name}
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder={translate('auth>inputCpf>placeholder')}
          maxLength={11}
          onBlur={() => formatCpfValue()}
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </FormItemContainer>
      {!hidenValidations && (
        <p className="mt-5">
          {field.value && (
            <InputStatus
              invalid={fieldState.invalid}
              errorMessage={error?.value?.message}
            />
          )}
        </p>
      )}
    </div>
  );
};

export default InputCpf;
