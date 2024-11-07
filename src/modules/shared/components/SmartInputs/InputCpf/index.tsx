import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { BaseInput } from '../../BaseInput';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputCPFProps {
  label: string;
  name: string;
  hidenValidations?: boolean;
  profilePage?: boolean;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  required?: boolean;
  readonly?: boolean;
}

const InputCpf = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations,
  profilePage,
  required,
  readonly,
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
    <div className="pw-mb-4 pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <BaseInput
        disableClasses={readonly}
        invalid={fieldState.invalid}
        valid={!!field?.value && !fieldState.invalid}
        disabled={
          (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
        }
      >
        <ReactInputMask
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            profilePage ||
            readonly
          }
          mask={'999.999.999-99'}
          maskChar={''}
          name={name}
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder="Digite apenas números"
          className={`pw-w-full pw-h-full focus:pw-outline-none`}
          inputMode="numeric"
        />
      </BaseInput>
      {!hidenValidations && (
        <p className="pw-mt-[5px] pw-h-[16px]">
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
