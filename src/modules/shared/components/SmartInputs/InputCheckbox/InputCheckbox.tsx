import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';

import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputCheckbox {
  label: string;
  name: string;
  docValue?: boolean;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  configData?: object;
}

const InputCheckbox = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  configData,
}: InputCheckbox) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<boolean | undefined>();
  const error = fieldState?.error as unknown as InputError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (configData as any)?.checkbox;
  const handleValueChange = (value: boolean) => {
    if (value) {
      setInputValue(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setInputValue(false);
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
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer
        invalid={fieldState.invalid || !field.value}
        className="!pw-outline-none pw-flex pw-gap-2"
      >
        <input
          type="checkbox"
          readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
          onChange={(e) => handleValueChange(e.target.checked)}
          checked={inputValue}
        />
        <a
          href={data?.link}
          target="_blank"
          className="pw-underline pw-text-blue-500"
          rel="noreferrer"
        >
          {data?.text}
        </a>
      </FormItemContainer>
      {!hidenValidations && (
        <div className="mt-5">
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

export default InputCheckbox;
