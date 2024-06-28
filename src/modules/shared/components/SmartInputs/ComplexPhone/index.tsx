import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

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
  complexValue?: any;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
}

interface moreFones {
  name: string;
  value: string;
}

const ComplexPhone = ({
  label,
  name,
  docStatus,
  docValue,
  hidenValidations,
  complexValue,
}: InputPhoneProps) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;
  const [morePhones, setMorePhones] = useState<Array<moreFones>>([]);

  const handleChange = (value: string) => {
    setInputValue(value);
    if (!morePhones.length) {
      field.onChange({ inputId: name, value: [value] });
    }
  };

  useEffect(() => {
    if (complexValue) {
      setInputValue(complexValue[0]);
      const phones = complexValue.map((item: string, idx: number) => {
        if (idx === 0) {
          return;
        } else {
          return {
            name: 'phone' + idx,
            value: item,
          };
        }
      });

      setMorePhones(phones.filter((item: any) => item !== undefined));
    }
  }, [complexValue]);

  useEffect(() => {
    if (morePhones.length) {
      const morePhonesValues = morePhones.map((item) => item.value);
      const phonesValues = [inputValue, ...morePhonesValues];

      field.onChange({
        inputId: name,
        value: phonesValues,
      });
    } else {
      field.onChange({ inputId: name, value: field?.value?.value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morePhones, inputValue]);

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      setInputValue(docValue);
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  const onAddMorePhones = () => {
    setMorePhones([
      ...morePhones,
      { name: 'phones' + (Number(morePhones.length) + 1), value: '' },
    ]);
  };

  const onRemovePhoneItem = (name: string) => {
    const phones = morePhones;
    const remnantsPhones = phones.filter((item) => item.name !== name);

    setMorePhones(remnantsPhones);
    field.onChange({ inputId: name, value: remnantsPhones });
  };

  const onChangeMorePhones = (item: moreFones, value: string) => {
    setMorePhones((prevMorePhones) =>
      prevMorePhones.map((i) => {
        if (i.name === item.name) return { ...i, value };
        else return i;
      })
    );
  };

  const renderMorePhones = () => {
    return (
      <div className="pw-w-full ">
        {morePhones.map((item, idx) => (
          <div
            key={item.name + idx}
            className="pw-w-full pw-flex pw-gap-2 pw-mb-3"
          >
            <FormItemContainer className="pw-w-full">
              <ReactInputMask
                readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
                name={item.name}
                value={item.value}
                onChange={(e) => onChangeMorePhones(item, e.target.value)}
                placeholder="+XX XX XXXXX XXXX"
                mask={
                  inputValue && inputValue?.length <= 16
                    ? '+99 99 9999-99999'
                    : '+99 99 99999-9999'
                }
                maskChar={''}
                className={classNames(
                  'pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
                )}
              />
            </FormItemContainer>
            <button
              onClick={() => onRemovePhoneItem(item.name)}
              className="pw-px-5 pw-h-[50px] pw-mt-[2px] pw-text-base pw-font-medium pw-rounded-lg pw-border pw-border-slate-500"
            >
              -
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="pw-mb-2 pw-w-full">
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
          {label}
        </p>
        <FormItemContainer invalid={!morePhones.length && fieldState.invalid}>
          <ReactInputMask
            readOnly={docStatus && validateIfStatusKycIsReadonly(docStatus)}
            name={name}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="+XX XX XXXXX XXXX"
            mask={
              inputValue && inputValue?.length <= 16
                ? '+99 99 9999-99999'
                : '+99 99 99999-9999'
            }
            maskChar={''}
            className={classNames(
              'pw-mt-1 pw-text-base pw-h-[48px] pw-text-[#969696] pw-leading-4 pw-w-full pw-shadow-[0_4px_15px_#00000012] !pw-rounded-lg pw-outline-none pw-bg-transparent pw-px-[10px] autofill:pw-bg-transparent'
            )}
          />
        </FormItemContainer>
        <p className="mt-1 pw-h-[16px]">
          {!morePhones.length && !hidenValidations && field.value && (
            <InputStatus
              invalid={fieldState.invalid}
              errorMessage={error?.value?.message}
            />
          )}
        </p>
      </div>
      <div className="pw-w-full">{renderMorePhones()}</div>
      <button
        onClick={() => onAddMorePhones()}
        className="pw-px-4 pw-py-2 pw-flex pw-items-center pw-border pw-border-[#0050FF] pw-rounded-lg pw-text-sm pw-font-semibold pw-gap-2"
      >
        <span>+</span>
        <span>Adicionar telefone</span>
      </button>
    </div>
  );
};

export default ComplexPhone;
