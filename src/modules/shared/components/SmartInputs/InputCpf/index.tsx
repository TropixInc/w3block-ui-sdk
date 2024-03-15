import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

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

  const error = fieldState?.error as unknown as InputError;

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

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-mb-2 pw-w-full">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer invalid={fieldState.invalid || !field.value}>
        <ReactInputMask
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            profilePage
          }
          mask={'999.999.999-99'}
          maskChar={''}
          name={name}
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder="Digite apenas números"
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-11 pw-text-[#969696] pw-leading-4 pw-w-full pw-px-[10px] pw-outline-none'
          )}
          inputMode="numeric"
        />
      </FormItemContainer>
      <p className="mt-5 pw-h-[16px]">
        {!hidenValidations && field.value && (
          <InputStatus
            invalid={fieldState.invalid}
            errorMessage={error?.value?.message}
          />
        )}
      </p>
    </div>
  );
};

export default InputCpf;
