import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { BaseInput } from '../../BaseInput';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputBirthdate {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  profilePage?: boolean;
  required?: boolean;
  readonly?: boolean;
  hidenValidations?: boolean;
}

const InputBirthdate = ({
  label,
  name,
  docValue,
  docStatus,
  profilePage,
  required,
  readonly,
  hidenValidations,
}: InputBirthdate) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;

  const handleTextChange = (value: string) => {
    setInputValue(value);
    field.onChange({ inputId: name, value: value });
  };

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-mb-4">
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
        type="date"
        readOnly={
          (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
          profilePage ||
          readonly
        }
        onChange={(e) => handleTextChange(e.target.value)}
        value={inputValue}
      />
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

export default InputBirthdate;
