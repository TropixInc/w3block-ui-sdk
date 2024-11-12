import { useEffect, useMemo } from 'react';
import { useController } from 'react-hook-form';

import { UserContextStatus, UserDocumentStatus } from '@w3block/sdk-id';

import useTranslation from '../../../hooks/useTranslation';
import { validateIfStatusKycIsReadonly } from '../../../utils/validReadOnlyKycStatus';
import { BaseInput } from '../../BaseInput';
import { BaseButton } from '../../Buttons';
import InputStatus from '../InputStatus';

interface InputPhoneProps {
  label: string;
  name: string;
  docValue?: string;
  complexValue?: any;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  statusContext?: UserContextStatus;
  hideAddButton?: boolean;
  readonly?: boolean;
}

const ComplexPhone = ({
  label,
  name,
  docStatus,
  docValue,
  hidenValidations,
  complexValue,
  statusContext,
  hideAddButton = false,
  readonly,
}: InputPhoneProps) => {
  const { field, fieldState } = useController({ name });
  const [translate] = useTranslation();
  const error = fieldState?.error;

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  useEffect(() => {
    if (complexValue) {
      field.onChange({ inputId: name, value: complexValue });
    } else {
      if (docValue) {
        field.onChange({ inputId: name, value: [docValue] });
      } else {
        field.onChange({ inputId: name, value: [''] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexValue]);

  const onAddMorePhones = () => {
    const newValues = field?.value?.value;
    if (newValues) {
      field.onChange({ ...field?.value, value: [...newValues, ''] });
    } else {
      field.onChange({ ...field?.value, value: [''] });
    }
  };

  const onRemovePhoneItem = (idx: number) => {
    const newPhones = field.value.value.filter(
      (_item: any, index: number) => index !== idx
    );

    field.onChange({ inputId: name, value: newPhones });
  };

  const onChangeMorePhones = (idx: number, value: string) => {
    const newPhones = [...field.value.value];
    newPhones[idx] = value;
    field.onChange({ inputId: name, value: newPhones });
  };

  const hiddenButtons = useMemo(() => {
    if (statusContext) {
      return Boolean(
        statusContext === UserContextStatus.Approved ||
          statusContext === UserContextStatus.Denied
      );
    } else {
      return false;
    }
  }, [statusContext]);

  return (
    <div className="pw-mb-4 pw-w-full">
      <div className="pw-w-full pw-mb-2">
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold">
          {label}
        </p>
        {field?.value?.value?.map((item: string, idx: number) => (
          <div key={idx} className="pw-mb-3">
            <div className="pw-w-full pw-flex pw-gap-2">
              <BaseInput
                disableClasses={readonly}
                invalid={fieldState.invalid}
                valid={!!field?.value && !fieldState.invalid}
                disabled={
                  (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
                  readonly
                }
                readOnly={
                  (docStatus && validateIfStatusKycIsReadonly(docStatus)) ||
                  readonly
                }
                name={item}
                value={item}
                onChange={(e) => onChangeMorePhones(idx, e.target.value)}
                placeholder="+XX XX XXXXX XXXX"
                mask={
                  item && item?.length <= 16
                    ? '+99 99 9999-99999'
                    : '+99 99 99999-9999'
                }
                maskChar={''}
              />
              {idx === 0 ? null : !hiddenButtons ? (
                <button
                  onClick={() => onRemovePhoneItem(idx)}
                  className="pw-px-5 pw-h-[50px] pw-mt-[2px] pw-text-base pw-font-medium pw-rounded-lg pw-border pw-border-slate-500"
                >
                  -
                </button>
              ) : null}
            </div>

            {!hidenValidations && (
              <p className="pw-mt-[5px] pw-h-[16px]">
                {field.value && (
                  <InputStatus
                    invalid={Boolean((error as any)?.value[idx]?.message)}
                    errorMessage={(error as any)?.value[idx]?.message}
                  />
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {hiddenButtons || hideAddButton ? null : (
        <BaseButton
          onClick={(e) => {
            e.preventDefault();
            onAddMorePhones();
          }}
        >
          <span>+</span>
          <span>{translate('shared>complexPhone>addPhone')}</span>
        </BaseButton>
      )}
    </div>
  );
};

export default ComplexPhone;
