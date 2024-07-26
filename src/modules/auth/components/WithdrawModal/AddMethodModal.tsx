/* eslint-disable i18next/no-literal-string */
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { WithdrawAccountTypeEnum } from '@w3block/sdk-id';

import useTranslation from '../../../shared/hooks/useTranslation';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import { getNumbersFromString } from '../../../tokens/utils/getNumbersFromString';
import { useCreateWithdrawMethod } from '../../hooks/useCreateWithdrawMethod/useCreateWithdrawMethod';

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

  const renderContentModal = () => {
    if (typeMethod === 'pix') {
      return (
        <div>
          <div className="pw-mt-3">
            <p>{translate('shared>myProfile>name')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Pix,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerName: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>cpf')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              placeholder="Digite apenas números"
              value={payload.accountInfo.ownerSsn}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Pix,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerSsn: getNumbersFromString(e.target.value, false),
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>pixCode')}</p>
            <p className="pw-text-sm pw-text-slate-400">
              {translate('auth>addMethodModal>keyCPForCNPJ')}
            </p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Pix,
                  accountInfo: {
                    ...payload.accountInfo,
                    key: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      );
    } else if (typeMethod === 'bank') {
      return (
        <div>
          <div className="pw-mt-3">
            <p>{translate('shared>myProfile>name')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerName: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>cpf')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              placeholder="Digite apenas números"
              value={payload.accountInfo.ownerSsn}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerSsn: getNumbersFromString(e.target.value, false),
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>type')}</p>
            <select
              name="accountType"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    type: e.target.value,
                  },
                })
              }
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
            >
              <option value="">
                {translate('auth>addMethodModal>select')}...
              </option>
              <option value="checking">
                {translate('auth>addMethodModal>checkingAccount')}
              </option>
              <option value="saving">
                {translate('auth>addMethodModal>savingsAccount')}
              </option>
              <option value="payment">
                {translate('auth>addMethodModal>paymentAccount')}
              </option>
            </select>
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>bank')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="text"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    bank: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>{translate('auth>addMethodModal>agency')}</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              placeholder="Digite apenas números"
              value={payload.accountInfo.agency}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    agency: getNumbersFromString(e.target.value, false),
                  },
                })
              }
            />
          </div>
          <div className="pw-flex pw-w-full pw-gap-x-3">
            <div className="pw-mt-3 pw-w-full">
              <p>{translate('auth>addMethodModal>accountNumber')}</p>
              <input
                className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
                type="text"
                maxLength={10}
                placeholder="Digite apenas números"
                value={payload.accountInfo.accountNumber}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    type: WithdrawAccountTypeEnum.Bank,
                    accountInfo: {
                      ...payload.accountInfo,
                      accountNumber: getNumbersFromString(
                        e.target.value,
                        false
                      ),
                    },
                  })
                }
              />
            </div>
            <div className="pw-mt-3">
              <p>{translate('auth>addMethodModal>digit')}</p>
              <input
                className="pw-w-[64px] pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
                type="text"
                maxLength={2}
                value={payload.accountInfo.verificationNumber}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    type: WithdrawAccountTypeEnum.Bank,
                    accountInfo: {
                      ...payload.accountInfo,
                      verificationNumber: getNumbersFromString(
                        e.target.value,
                        false
                      ),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
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
        <OffpixButtonBase
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="outlined"
          onClick={() => onChangeModalType('withdraw')}
        >
          {translate('components>cancelMessage>cancel')}
        </OffpixButtonBase>
        <OffpixButtonBase
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="filled"
          disabled={!isValidPayload}
          onClick={() => onCreateMethod()}
        >
          {translate('shared>myProfile>confirm')}
        </OffpixButtonBase>
      </div>
    </div>
  );
};

export default AddMethodModal;
