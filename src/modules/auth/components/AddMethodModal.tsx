/* eslint-disable i18next/no-literal-string */
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { WithdrawAccountTypeEnum } from '@w3block/sdk-id';

import { useCreateWithdrawMethod } from '../hooks/useCreateWithdrawMethod';
import { BaseButton } from '../../shared/components/Buttons';
import { getNumbersFromString } from '../../tokens/utils/getNumbersFromString';
import useTranslation from '../../shared/hooks/useTranslation';

interface PayloadDTO {
  type: WithdrawAccountTypeEnum;
  accountInfo: any;
}

interface MappedDTO {
  [key: string]: string;
}

const mappedKeys: MappedDTO = {
  'accountInfo.key': 'Chave PIX',
  'accountInfo.ownerSsn': 'CPF ou CNPJ',
  'accountInfo.type': 'Tipo de conta',
  'accountInfo.bank': 'Banco',
  'accountInfo.agency': 'Agência',
  'accountInfo.accountNumber': 'Número da conta',
  'accountInfo.verificationNumber': 'Dígito',
};

const mapMessage = (message: string) => {
  // Encontrar a chave correspondente no objeto mappedKeys
  const key = Object.keys(mappedKeys).find((k) => message.includes(k));

  if (key) {
    const value = mappedKeys[key];
    if (message.includes('is not a valid')) {
      return `${value} - campo invalido`;
    } else {
      return message.replace(key, value);
    }
  } else {
    return message;
  }
};

interface AddModalProps {
  onChangeModalType: (value: 'add' | 'withdraw' | 'delete') => void;
}

interface FieldConfig {
  key: string;
  label: string;
  subtitle?: string;
  placeholder?: string;
  numberOnly?: boolean;
  maxLength?: number;
  inputClassName?: string;
  select?: { options: Array<{ value: string; label: string }> };
  row?: FieldConfig[];
}

const inputClassName =
  'pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3';

const AddMethodModal = ({ onChangeModalType }: AddModalProps) => {
  const [typeMethod, setTypeMethod] = useState<WithdrawAccountTypeEnum>();
  const [payload, setPayload] = useState<PayloadDTO>({
    type: typeMethod as WithdrawAccountTypeEnum,
    accountInfo: {},
  });
  const [isValidPayload, setIsValidPayload] = useState(false);
  const [translate] = useTranslation();

  useDebounce(
    () => {
      let allFieldsValid = true;
      for (const key in payload.accountInfo) {
        if (
          (payload as any).accountInfo[key] == null ||
          (payload as any).accountInfo[key] === ''
        ) {
          allFieldsValid = false;
          break;
        }
      }
      setIsValidPayload(allFieldsValid);
    },
    500,
    [payload]
  );

  const { mutate, isSuccess, error } = useCreateWithdrawMethod();

  const onCreateMethod = () => {
    if (isValidPayload) {
      try {
        mutate(payload);
      } catch (err) {
        console.log((err as any).message);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onChangeModalType('withdraw');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const updateField = (key: string, value: string, numberOnly?: boolean) => {
    setPayload((prev) => ({
      ...prev,
      type: typeMethod as WithdrawAccountTypeEnum,
      accountInfo: {
        ...prev.accountInfo,
        [key]: numberOnly ? getNumbersFromString(value, false) : value,
      },
    }));
  };

  const pixFields: FieldConfig[] = [
    { key: 'ownerName', label: 'shared>myProfile>name' },
    {
      key: 'ownerSsn',
      label: 'auth>addMethodModal>cpf',
      numberOnly: true,
      placeholder: 'Digite apenas números',
    },
    {
      key: 'key',
      label: 'auth>addMethodModal>pixCode',
      subtitle: 'auth>addMethodModal>keyCPForCNPJ',
    },
  ];

  const bankFields: FieldConfig[] = [
    { key: 'ownerName', label: 'shared>myProfile>name' },
    {
      key: 'ownerSsn',
      label: 'auth>addMethodModal>cpf',
      numberOnly: true,
      placeholder: 'Digite apenas números',
    },
    {
      key: 'type',
      label: 'auth>addMethodModal>type',
      select: {
        options: [
          { value: '', label: 'auth>addMethodModal>select' },
          { value: 'checking', label: 'auth>addMethodModal>checkingAccount' },
          { value: 'saving', label: 'auth>addMethodModal>savingsAccount' },
          { value: 'payment', label: 'auth>addMethodModal>paymentAccount' },
        ],
      },
    },
    { key: 'bank', label: 'auth>addMethodModal>bank' },
    {
      key: 'agency',
      label: 'auth>addMethodModal>agency',
      numberOnly: true,
      placeholder: 'Digite apenas números',
    },
    {
      key: '_accountRow',
      label: '',
      row: [
        {
          key: 'accountNumber',
          label: 'auth>addMethodModal>accountNumber',
          numberOnly: true,
          maxLength: 10,
          placeholder: 'Digite apenas números',
          inputClassName: inputClassName,
        },
        {
          key: 'verificationNumber',
          label: 'auth>addMethodModal>digit',
          maxLength: 2,
          inputClassName:
            'pw-w-[64px] pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3',
        },
      ],
    },
  ];

  const renderField = (field: FieldConfig) => {
    if (field.row) {
      return (
        <div key={field.key} className="pw-flex pw-w-full pw-gap-x-3">
          {field.row.map((col) => (
            <div key={col.key} className="pw-mt-3 pw-w-full">
              <p>{translate(col.label)}</p>
              <input
                className={col.inputClassName ?? inputClassName}
                type="text"
                maxLength={col.maxLength}
                placeholder={col.placeholder}
                value={payload.accountInfo[col.key] ?? ''}
                onChange={(e) =>
                  updateField(col.key, e.target.value, col.numberOnly)
                }
              />
            </div>
          ))}
        </div>
      );
    }

    if (field.select) {
      return (
        <div key={field.key} className="pw-mt-3">
          <p>{translate(field.label)}</p>
          <select
            name={field.key}
            onChange={(e) => updateField(field.key, e.target.value)}
            className={inputClassName}
          >
            {field.select.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {translate(opt.label)}
                {opt.value === '' ? '...' : ''}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.key} className="pw-mt-3">
        <p>{translate(field.label)}</p>
        {field.subtitle && (
          <p className="pw-text-sm pw-text-slate-400">
            {translate(field.subtitle)}
          </p>
        )}
        <input
          className={inputClassName}
          type="text"
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={
            field.numberOnly
              ? (payload.accountInfo[field.key] ?? '')
              : undefined
          }
          onChange={(e) =>
            updateField(field.key, e.target.value, field.numberOnly)
          }
        />
      </div>
    );
  };

  const fieldsByType: Record<string, FieldConfig[]> = {
    pix: pixFields,
    bank: bankFields,
  };

  const renderContentModal = () => {
    const fields = typeMethod ? fieldsByType[typeMethod] : null;
    if (!fields) return <></>;
    return <div>{fields.map(renderField)}</div>;
  };

  return (
    <div className="pw-w-full pw-text-slate-900">
      <p className="pw-text-center pw-text-xl pw-font-medium">
        {translate('auth>addMethodModal>createPaymentMethod')}
      </p>
      <div className="pw-mt-5">
        <p>{translate('auth>addMethodModal>type')}</p>
        <select
          name="methodType"
          onChange={(e) =>
            setTypeMethod(e.target.value as WithdrawAccountTypeEnum)
          }
          className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
        >
          <option value="">{translate('auth>addMethodModal>select')}...</option>
          <option value="pix">Pix</option>
          <option value="bank">
            {translate('auth>addMethodModal>accountBank')}
          </option>
        </select>
      </div>

      {renderContentModal()}

      <div className="pw-mt-4">
        {(error as any)?.response.data.message.map(
          (msg: string, idx: number) => (
            <p
              className="pw-text-sm pw-font-semibold pw-text-red-600"
              key={msg + idx}
            >
              {mapMessage(msg)}
            </p>
          )
        )}
      </div>

      <div className="pw-mt-5 pw-flex pw-gap-3">
        <BaseButton
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="outlined"
          onClick={() => onChangeModalType('withdraw')}
        >
          {translate('components>cancelMessage>cancel')}
        </BaseButton>
        <BaseButton
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="filled"
          disabled={!isValidPayload}
          onClick={() => onCreateMethod()}
        >
          {translate('shared>myProfile>confirm')}
        </BaseButton>
      </div>
    </div>
  );
};

export default AddMethodModal;
