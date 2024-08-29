import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

import { UserDocumentStatus } from '@w3block/sdk-id';
import classNames from 'classnames';

import { getNumbersFromString } from '../../../../tokens/utils/getNumbersFromString';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { FormItemContainer } from '../../Form/FormItemContainer';
import LabelWithRequired from '../../LabelWithRequired';
import { InputError } from '../../SmartInputsController';
import InputStatus from '../InputStatus';

interface InputCPFProps {
  label: string;
  name: string;
  hidenValidations?: boolean;
  profilePage?: boolean;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  required?: boolean;
  readonly?: boolean;
}

const InputCpf = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations,
  profilePage,
  required,
  readonly,
}: InputCPFProps) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();

  const error = fieldState?.error as unknown as InputError;

  const handleChange = (value: string | undefined) => {
    if (value) {
      setInputValue(getNumbersFromString(value, false));
      field.onChange({
        inputId: name,
        value: getNumbersFromString(value, false),
      });
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
    <div className="pw-mb-2 pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <FormItemContainer disableClasses={readonly} invalid={fieldState.invalid}>
        <ReactInputMask
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
            profilePage ||
            readonly
          }
          mask={'999.999.999-99'}
          maskChar={''}
          name={name}
          onChange={(e) => handleChange(e.target.value)}
          value={inputValue}
          placeholder="Digite apenas números"
          className={classNames(
            'pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full pw-px-[10px] pw-outline-none'
          )}
          inputMode="numeric"
        />
      </FormItemContainer>
      {!hidenValidations && field.value && (
        <p className="pw-mt-[5px] pw-h-[16px]">
          <InputStatus
            invalid={fieldState.invalid}
            errorMessage={error?.value?.message}
          />
        </p>
      )}
    </div>
  );
};

export default InputCpf;
