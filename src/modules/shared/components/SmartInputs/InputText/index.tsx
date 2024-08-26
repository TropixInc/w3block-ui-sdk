import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputText {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  required?: boolean;
  readonly?: boolean;
}

const InputText = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  required,
  readonly,
}: InputText) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;

  const handleTextChange = (value: string) => {
    if (value) {
      setInputValue(value);
      field.onChange({ inputId: name, value: value });
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
    <div className="pw-mb-3 pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <FormItemContainer invalid={fieldState.invalid}>
        <input
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
          }
          onChange={(e) => handleTextChange(e.target.value)}
          value={inputValue}
          className="pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full !pw-rounded-lg pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent focus:pw-outline-none"
        />
      </FormItemContainer>
      {!hidenValidations && (
        <div className="pw-mt-[5px]">
          {field.value && (
            <InputStatus
              invalid={fieldState.invalid}
              errorMessage={error?.value?.message}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputText;
