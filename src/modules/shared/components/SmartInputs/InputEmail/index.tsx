import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { useProfile } from '../../../hooks';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputEmailProps {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  autofill?: boolean;
}

const InputEmail = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  autofill = false,
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
    <div className="pw-mb-3 pw-w-full">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </p>
      {autofill ? (
        <div
          className={classNames(
            'pw-mt-1 pw-text-base pw-h-[48px] pw-text-black pw-leading-4 pw-w-full pw-py-[15px]'
          )}
        >
          {inputValue}
        </div>
      ) : (
        <FormItemContainer invalid={fieldState.invalid || !field.value}>
          <input
            disabled={autofill}
            name={name}
            readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
            onChange={(e) => handleChange(e.target.value)}
            value={inputValue}
            type="email"
            className={classNames(
              'pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
            )}
          />
        </FormItemContainer>
      )}
      <p className={`mt-5 ${!autofill && 'pw-h-[16px]'}`}>
        {!hidenValidations && field.value && (
          <InputStatus
            invalid={fieldState.invalid}
            errorMessage={error?.value?.message}
          />
        )}
      </p>
    </div>
  );
};

export default InputEmail;
