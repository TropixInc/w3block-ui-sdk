import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import { isValidUrl } from '../../utils/validators';
import { validateIfStatusKycIsReadonly } from '../../utils/validReadOnlyKycStatus';
import { BaseInput } from '../BaseInput';
import LabelWithRequired from '../LabelWithRequired';
import { InputError } from '../SmartInputsController';
import InputStatus from './InputStatus';
interface InputUrlProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  required?: boolean;
  readonly?: boolean;
}

const InputUrl = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  required,
  readonly,
}: InputUrlProps) => {
  const { field, fieldState } = useController({ name });
  const error = fieldState?.error as unknown as InputError;
  const [url, setUrl] = useState('');

  const onChangeUrl = (value: string) => {
    if (value) {
      setUrl(value);
      field.onChange({ inputId: name, value: value });
    } else {
      setUrl('');
      field.onChange({ inputId: undefined, value: undefined });
    }
  };

  useEffect(() => {
    if (
      docValue &&
      isValidUrl(docValue) &&
      docStatus !== UserDocumentStatus.RequiredReview
    ) {
      setUrl(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-w-full">
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
        name={name}
        readOnly={
          (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
        }
        type="text"
        value={url}
        onChange={(e) => onChangeUrl(e.target.value)}
      />
      {!hidenValidations && (
        <p className="pw-mt-[5px]">
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

export default InputUrl;
