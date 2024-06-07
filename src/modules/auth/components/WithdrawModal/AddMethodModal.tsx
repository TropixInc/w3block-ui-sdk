import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { WithdrawAccountTypeEnum } from '@w3block/sdk-id';

import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import { useCreateWithdrawMethod } from '../../hooks/useCreateWithdrawMethod/useCreateWithdrawMethod';

interface PayloadDTO {
  type: WithdrawAccountTypeEnum;
  accountInfo: any;
}

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

  const { mutate, isSuccess } = useCreateWithdrawMethod();

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

  console.log(payload, 'payload');

  const renderContentModal = () => {
    if (typeMethod === 'pix') {
      return (
        <div>
          <div className="pw-mt-3">
            <p>Nome</p>
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
            <p>CPF ou CNPJ</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="number"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Pix,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerSsn: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>Chave</p>
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
            <p>Nome</p>
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
            <p>CPF ou CNPJ</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="number"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    ownerSsn: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-mt-3">
            <p>Tipo</p>
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
              <option value="">Selecione...</option>
              <option value="checking">Conta corrente</option>
              <option value="saving">Conta poupança</option>
              <option value="payment">Conta de pagamentos</option>
            </select>
          </div>
          <div className="pw-mt-3">
            <p>Banco</p>
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
            <p>Agência</p>
            <input
              className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
              type="number"
              onChange={(e) =>
                setPayload({
                  ...payload,
                  type: WithdrawAccountTypeEnum.Bank,
                  accountInfo: {
                    ...payload.accountInfo,
                    agency: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="pw-flex pw-w-full pw-gap-x-3">
            <div className="pw-mt-3 pw-w-full">
              <p>Número da conta</p>
              <input
                className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
                type="number"
                maxLength={10}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    type: WithdrawAccountTypeEnum.Bank,
                    accountInfo: {
                      ...payload.accountInfo,
                      accountNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="pw-mt-3">
              <p>Dígito</p>
              <input
                className="pw-w-[64px] pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
                type="number"
                maxLength={2}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    type: WithdrawAccountTypeEnum.Bank,
                    accountInfo: {
                      ...payload.accountInfo,
                      verificationNumber: e.target.value,
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
        Cadastrar novo método de saque
      </p>
      <div className="pw-mt-5">
        <p>Tipo</p>
        <select
          name="methodType"
          onChange={(e) =>
            setTypeMethod(e.target.value as WithdrawAccountTypeEnum)
          }
          className="pw-w-full pw-h-10 pw-outline-none pw-border pw-border-blue-200 pw-rounded-md pw-bg-white pw-px-3"
        >
          <option value="">Selecione...</option>
          <option value="pix">Pix</option>
          <option value="bank">Conta bancária</option>
        </select>
      </div>

      {renderContentModal()}

      <div className="pw-mt-5 pw-flex pw-gap-3">
        <OffpixButtonBase
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="outlined"
          onClick={() => onChangeModalType('withdraw')}
        >
          Cancelar
        </OffpixButtonBase>
        <OffpixButtonBase
          className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
          variant="filled"
          disabled={!isValidPayload}
          onClick={() => onCreateMethod()}
        >
          Confirmar
        </OffpixButtonBase>
      </div>
    </div>
  );
};

export default AddMethodModal;
