import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { useProfile } from '../../../hooks';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { BaseInput } from '../../BaseInput';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputEmailProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  autofill?: boolean;
  required?: boolean;
  readonly?: boolean;
}

const InputEmail = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  autofill = false,
  required,
  readonly,
}: InputEmailProps) => {
  const { field, fieldState } = useController({ name });
  const error = fieldState?.error as unknown as InputError;
  const [inputValue, setInputValue] = useState<string | undefined>();
  const profile = useProfile();

  useEffect(() => {
    if (autofill && profile?.data?.data)
      handleChange(profile?.data?.data?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autofill]);

  const handleChange = (value: string) => {
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
    <div className="pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      {autofill ? (
        <div
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[48px] pw-text-black pw-leading-4 pw-w-full pw-py-[15px]'
          )}
        >
          {inputValue}
        </div>
      ) : (
        <BaseInput
          disableClasses={readonly}
          invalid={fieldState.invalid}
          valid={!!field?.value && !fieldState.invalid}
          disabled={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            readonly ||
            autofill
          }
          name={name}
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
          }
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          type="email"
        />
      )}
      {!hidenValidations && (
        <p className={`pw-mt-[5px] ${!autofill && 'pw-h-[16px]'}`}>
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

export default InputEmail;
