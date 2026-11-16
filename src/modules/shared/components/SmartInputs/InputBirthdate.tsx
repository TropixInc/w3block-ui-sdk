import { useEffect, useMemo } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import { InputError } from '../SmartInputsController';
import { validateIfStatusKycIsReadonly } from '../../utils/validReadOnlyKycStatus';
import { CustomDatePicker } from '../CustomDatePicker';
import LabelWithRequired from '../LabelWithRequired';
import InputStatus from './InputStatus';
import useTranslation from '../../hooks/useTranslation';

interface InputBirthdate {
  label: string;
  name: string;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  profilePage?: boolean;
  required?: boolean;
  readonly?: boolean;
  hidenValidations?: boolean;
}

const InputBirthdate = ({
  label,
  name,
  docValue,
  docStatus,
  profilePage,
  required,
  readonly,
  hidenValidations,
}: InputBirthdate) => {
  const { field, fieldState } = useController({ name });
  const [translate, i18n] = useTranslation();
  const error = fieldState?.error as unknown as InputError;

  // Converte string (YYYY-MM-DD) para Date
  const stringToDate = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Converte Date para string (YYYY-MM-DD)
  const dateToString = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Valor atual como Date para o CustomDatePicker
  const selectedDate = useMemo(() => {
    const value = field?.value?.value || docValue;
    return stringToDate(value);
  }, [field?.value?.value, docValue]);

  const handleDateChange = (date: Date | [Date | null, Date | null] | null) => {
    const singleDate = date as Date | null;
    const dateString = dateToString(singleDate);
    field.onChange({ inputId: name, value: dateString });
  };

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div>
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>

      <CustomDatePicker
        type="unique"
        selectedDate={selectedDate}
        onChangeSelectedDate={handleDateChange}
        language={i18n.language || 'pt-BR'}
        invalid={fieldState.invalid}
        valid={!!field?.value && !fieldState.invalid}
        disabled={
          (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
        }
        readonly={
          (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
          profilePage ||
          readonly
        }
        className='pw-max-w-[460px]'
      />
      {!hidenValidations && (
        <p className="pw-mt-[5px] pw-h-[16px]">
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

export default InputBirthdate;
