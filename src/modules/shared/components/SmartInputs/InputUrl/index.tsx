import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { isValidUrl } from '../../../utils/validators';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

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
    <div className="pw-mb-3 pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <FormItemContainer
        disableClasses={readonly}
        invalid={fieldState.invalid}
        className="pw-w-full"
      >
        <input
          name={name}
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
          }
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          className={classNames(
            'pw-text-base pw-h-12 pw-text-[#969696] pw-leading-4 pw-w-full !pw-rounded-lg pw-outline-none pw-bg-transparent autofill:pw-bg-transparent',
            `${readonly ? '' : 'pw-px-[10px]'}`
          )}
        />
      </FormItemContainer>
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
