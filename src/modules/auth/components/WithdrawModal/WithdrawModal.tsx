import { useState } from 'react';

import { useGetErcTokensHistory } from '../../../dashboard/hooks/useGetErcTokensHistory';
import { useProfile } from '../../../shared';
import Trash from '../../../shared/assets/icons/trash.svg?react';
import { ModalBase } from '../../../shared/components/ModalBase';
import { Spinner } from '../../../shared/components/Spinner';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import useGetWithdrawsMethods from '../../hooks/useGetWithdrawsMethods/useGetWithdrawsMethods';
import AddMethodModal from './AddMethodModal';
import DeleteMethodModal from './DeleteMethodModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const WithdrawModal = ({ isOpen, onClose }: ModalProps) => {
  const { data } = useProfile();
  const [modalType, setModalType] = useState<'add' | 'withdraw' | 'delete'>(
    'withdraw'
  );
  const [deleteItem, setDeleteItem] = useState<any | undefined>();
  const [accountValue, setAccountValue] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loyaltyWallet, mainWallet } = useUserWallet();

  const [{ data: withdrawsMethods, isLoading }] = useGetWithdrawsMethods(
    data?.data?.id ?? '',
    modalType
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: erc20, isLoading: isLoadingErc20 } = useGetErcTokensHistory(
    loyaltyWallet.length ? loyaltyWallet[0].contractId : undefined,
    { page: 1 }
  );

  const onHandleDeleteItem = (item: unknown) => {
    setDeleteItem(item);
    setModalType('delete');
  };

  const NewWithdraw = () => {
    return (
      <div className="pw-w-full pw-text-slate-900 pw-px-4">
        <div className="pw-w-full">
          <p className="pw-text-center pw-text-xl pw-font-medium">
            Realizar saque
          </p>
          <div className="pw-mt-5 pw-flex pw-gap-3 pw-w-full">
            <div className="pw-w-full">
              <input
                className="pw-h-10 pw-px-3 pw-w-full pw-outline-none pw-border pw-border-slate-300 pw-rounded-md focus:pw-border-slate-500"
                type="text"
              />
              <p className="mt-1 pw-text-xs">
                Saldo:{' '}
                {`${loyaltyWallet[0].balance} ${loyaltyWallet[0].currency}`}
              </p>
            </div>
            <OffpixButtonBase className="pw-px-3 pw-w-[150px] pw-h-10 pw-flex pw-items-center pw-justify-center pw-text-base">
              Sacar tudo
            </OffpixButtonBase>
          </div>
        </div>
        <div className="pw-mt-5 ">
          <div className="pw-flex pw-justify-between pw-items-center">
            <p>Métodos cadastrados</p>
            <button
              onClick={() => setModalType('add')}
              className="pw-px-3 pw-py-2 pw-bg-blue-400 pw-rounded-md pw-text-white"
            >
              Novo método
            </button>
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
            <div className="pw-mt-6 pw-w-full pw-px-3 pw-py-2 pw-bg-blue-400 pw-font-medium pw-rounded-md pw-text-white">
              <p className="pw-text-center">
                Não há métodos de pagamento cadastrados
              </p>
            </div>
          )}
        </div>
        <div className="pw-mt-5 pw-flex pw-gap-3">
          <OffpixButtonBase
            className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
            variant="outlined"
          >
            Cancelar
          </OffpixButtonBase>
          <OffpixButtonBase
            className="pw-text-base pw-w-full pw-h-12 pw-flex pw-justify-center pw-items-center"
            variant="filled"
            disabled={!withdrawsMethods?.data?.items.length}
          >
            Confirmar
          </OffpixButtonBase>
        </div>
      </div>
    );
  };

  const onRenderModalType = () => {
    if (modalType === 'withdraw') {
      return <NewWithdraw />;
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
    <ModalBase
      isOpen={isOpen}
      classes={{ dialogCard: 'pw-w-[320px] sm:!pw-w-[720px]' }}
      onClose={onClose}
    >
      {onRenderModalType()}
    </ModalBase>
  );
};

export default WithdrawModal;
