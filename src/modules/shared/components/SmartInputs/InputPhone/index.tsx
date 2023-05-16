import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import Input from 'react-phone-number-input/input';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputPhoneProps {
  label: string;
  name: string;

  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
}

const InputPhone = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
}: InputPhoneProps) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;

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
    <div className="pw-mb-3 pw-w-full">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      <FormItemContainer invalid={fieldState.invalid || !field.value}>
        <Input
          readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder="+XX XX XXXXX XXXX"
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[46px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
          )}
        />
      </FormItemContainer>
      {!hidenValidations && (
        <p className="mt-5">
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

export default InputPhone;
