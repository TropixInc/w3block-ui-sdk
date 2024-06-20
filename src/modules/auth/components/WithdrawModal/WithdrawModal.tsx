/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';

import { useProfile, useRouterConnect } from '../../../shared';
import Trash from '../../../shared/assets/icons/trash.svg?react';
import { Alert } from '../../../shared/components/Alert';
import { Spinner } from '../../../shared/components/Spinner';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import useGetWithdrawsMethods from '../../hooks/useGetWithdrawsMethods/useGetWithdrawsMethods';
import { useRequestWithdraw } from '../../hooks/useRequestWithdraw';
import AddMethodModal from './AddMethodModal';
import DeleteMethodModal from './DeleteMethodModal';

interface ModalProps {
  onClose: () => void;
  balance: string;
  contractId: string;
  currency: string;
}

export interface WithdrawMethodDTO {
  accountInfo: any;
  createdAt: string;
  id: string;
  tenantId: string;
  type: string;
  updatedAt: string;
  userId: string;
}

const WithdrawModal = ({
  onClose,
  balance,
  contractId,
  currency,
}: ModalProps) => {
  const { data } = useProfile();
  const [modalType, setModalType] = useState<'add' | 'withdraw' | 'delete'>(
    'withdraw'
  );
  const [deleteItem, setDeleteItem] = useState<any | undefined>();
  const [accountValue, setAccountValue] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [{ data: withdrawsMethods, isLoading }] = useGetWithdrawsMethods(
    data?.data?.id ?? '',
    modalType
  );

  const { mutate } = useRequestWithdraw();
  const router = useRouterConnect();
  const handleWithdraw = () => {
    mutate({
      amount: withdrawAmount,
      memo: '',
      fromWalletAddress: data?.data?.mainWallet?.address ?? '',
      erc20ContractId: contractId,
      withdrawAccountId: accountValue,
    });
    onClose();
    router.reload();
  };

  const onHandleDeleteItem = (item: unknown) => {
    setDeleteItem(item);
    setModalType('delete');
  };

  const NewWithdraw = useMemo(() => {
    return (
      <div className="pw-w-full pw-text-slate-900 pw-px-4">
        <div className="pw-w-full">
          <p className="pw-text-center pw-text-xl pw-font-medium">
            Realizar saque
          </p>
          <div className="pw-mt-5 pw-flex pw-gap-3 pw-w-full">
            <div className="pw-w-full">
              <CurrencyInput
                onChangeValue={(_, value) => {
                  if (value) {
                    setWithdrawAmount(value as string);
                  }
                }}
                value={withdrawAmount}
                hideSymbol
                InputElement={
                  <input
                    className="pw-h-10 pw-px-3 pw-w-full pw-outline-none pw-border pw-border-slate-300 pw-rounded-md focus:pw-border-slate-500"
                    placeholder="0,0"
                    type="numeric"
                  />
                }
              />

              <p className="mt-1 pw-text-xs">
                Saldo: {`${balance} ${currency}`}
              </p>
            </div>
            <OffpixButtonBase
              onClick={() => setWithdrawAmount(balance)}
              className="sm:pw-px-3 pw-px-0 pw-w-[150px] pw-h-10 pw-flex pw-items-center pw-justify-center pw-text-base"
            >
              Sacar tudo
            </OffpixButtonBase>
          </div>
        </div>
        <div className="pw-mt-5 ">
          <div className="pw-flex pw-justify-between pw-items-center">
            <p>Métodos de recebimento</p>
            <OffpixButtonBase
              onClick={() => setModalType('add')}
              className="sm:pw-px-3 pw-px-0 pw-w-[150px] pw-h-10 pw-flex pw-items-center pw-justify-center pw-text-base"
            >
              Novo método
            </OffpixButtonBase>
          </div>
          {isLoading ? (
            <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
              <Spinner />
            </div>
          ) : withdrawsMethods?.data?.items.length ? (
            <table className="pw-mt-4 pw-w-full">
              <thead className="pw-w-full">
                <tr className="pw-w-full">
                  <th scope="col" className="pw-text-left">
                    {''}
                  </th>
                  <th scope="col" className="pw-text-left">
                    Tipo
                  </th>
                  <th scope="col" className="pw-text-left">
                    Titular
                  </th>
                  <th scope="col" className="pw-text-left">
                    Conta
                  </th>
                  <th scope="col" className="pw-text-left">
                    {''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawsMethods?.data?.items.map((item) => (
                  <tr key={(item as WithdrawMethodDTO)?.id}>
                    <td>
                      <input
                        type="radio"
                        value={accountValue}
                        onClick={() =>
                          setAccountValue((item as WithdrawMethodDTO)?.id)
                        }
                        className="pw-cursor-pointer"
                      />
                    </td>
                    <td>
                      <label htmlFor={(item as WithdrawMethodDTO)?.id}>
                        {(item as WithdrawMethodDTO)?.type === 'pix'
                          ? 'Pix'
                          : 'Conta bancária'}
                      </label>
                    </td>
                    <td>
                      {(item as WithdrawMethodDTO)?.accountInfo?.ownerName}
                    </td>
                    <td>
                      {(item as WithdrawMethodDTO)?.type === 'bank'
                        ? `${
                            (item as WithdrawMethodDTO)?.accountInfo
                              ?.accountNumber
                          }-${
                            (item as WithdrawMethodDTO)?.accountInfo
                              ?.verificationNumber
                          }`
                        : (item as WithdrawMethodDTO)?.accountInfo?.key}
                    </td>
                    <td>
                      <button
                        onClick={() => onHandleDeleteItem(item)}
                        className="pw-cursor-pointer"
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="pw-mt-6 pw-w-full pw-px-3 pw-py-2 pw-font-medium pw-rounded-md pw-text-black">
              <p className="pw-text-center">
                Não há métodos de recebimento cadastrados
              </p>
            </div>
          )}
        </div>
        <div className="pw-mt-5 pw-flex pw-gap-3 pw-pb-3">
          <OffpixButtonBase
            className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
            variant="outlined"
            onClick={onClose}
          >
            Cancelar
          </OffpixButtonBase>
          <OffpixButtonBase
            className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
            variant="filled"
            disabled={
              !withdrawsMethods?.data?.items.length ||
              withdrawAmount === '' ||
              accountValue === ''
            }
            onClick={handleWithdraw}
          >
            Confirmar
          </OffpixButtonBase>
        </div>
        {!withdrawsMethods?.data?.items.length ? (
          <div className="pw-mt-3">
            <Alert variant="warning" className="pw-text-xs">
              Você precisa ter pelo menos um método de recebimento registrado
              para realizar o saque.
            </Alert>
          </div>
        ) : null}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountValue, isLoading, withdrawAmount, withdrawsMethods?.data?.items]);

  const onRenderModalType = () => {
    if (modalType === 'withdraw') {
      return NewWithdraw;
    } else if (modalType === 'add') {
      return <AddMethodModal onChangeModalType={setModalType} />;
    } else if (modalType === 'delete') {
      return (
        <DeleteMethodModal
          onChangeModalType={setModalType}
          itemForDelete={deleteItem}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="sm:pw-p-[40px] pw-p-0">
      <button
        className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black"
        onClick={onClose}
      >
        {`<`} Voltar
      </button>
      {onRenderModalType()}
    </div>
  );
};

export default WithdrawModal;
