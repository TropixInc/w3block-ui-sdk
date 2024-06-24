import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
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
}

const InputBirthdate = ({
  label,
  name,
  docValue,
  docStatus,
  profilePage,
  required,
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
    <div className="pw-mb-2">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>

      <FormItemContainer invalid={fieldState.invalid}>
        <input
          type="date"
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            profilePage
          }
          onChange={(e) => handleTextChange(e.target.value)}
          value={inputValue}
          className="pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full !pw-rounded-lg pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent focus:pw-outline-none"
        />
      </FormItemContainer>
      <p className="mt-5 pw-h-[16px]">
        {field.value && (
          <InputStatus
            invalid={fieldState.invalid}
            errorMessage={error?.value?.message}
          />
        )}
      </p>
    </div>
  );
};

export default InputBirthdate;
