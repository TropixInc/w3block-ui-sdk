import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import { InputError } from '../SmartInputsController';
import { validateIfStatusKycIsReadonly } from '../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../Form/FormItemContainer';
import LabelWithRequired from '../LabelWithRequired';
import InputStatus from './InputStatus';

interface InputCheckbox {
  label: string;
  name: string;
  docValue?: boolean;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  configData?: object;
  required?: boolean;
  readonly?: boolean;
}

const InputCheckbox = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  configData,
  required,
  readonly,
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
      if (docValue) {
        field.onChange({
          inputId: name,
          value: "false",
        });
      }
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
    <div className={`${label === ' ' ? '-pw-mt-2' : ''} pw-mb-2 pw-w-full pw-flex pw-gap-5 pw-items-center`}>

      <FormItemContainer
        invalid={fieldState.invalid}
        className="!pw-outline-none pw-flex pw-gap-2"
      >
        <input
          type="checkbox"
          readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
          onChange={(e) => handleValueChange((configData as any)?.invertInputValue ? !e.target.checked : e.target.checked)}
          disabled={readonly}
          checked={(configData as any)?.invertInputValue ? !inputValue : inputValue}
        />
        <a
          href={data?.link}
          target="_blank"
          className="pw-underline pw-text-blue-500"
          rel="noreferrer"
        >
          {data?.text}
        </a>
        <LabelWithRequired haveColon={false} name={name} required={required}>
          {label}
        </LabelWithRequired>
      </FormItemContainer>
      {!hidenValidations && (
        <div className="pw-mt-[5px] pw-h-[16px]">
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
