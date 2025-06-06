import { useState } from 'react';
import { useDebounce } from 'react-use';
import { useModalController } from '../hooks/useModalController';


import { isEthereumAddress } from 'validator';
import { UserByWalletInput } from './userByWalletInput';
import { SearchItem } from './SearchItem';

interface GenericWalletFilterProps {
  wallet: string;
  onChangeWallet: (value: string) => void;
  placeholder?: string;
}

export const GenericWalletFilter = ({
  onChangeWallet,
  wallet,
  placeholder,
}: GenericWalletFilterProps) => {
  const [walletValid, setWalletValid] = useState(false);

  const {
    closeModal,
    isOpen: isOpenUserModal,
    openModal,
  } = useModalController();

  useDebounce(
    () => {
      if (wallet) {
        setWalletValid(isEthereumAddress(wallet));
      }
    },
    500,
    [wallet]
  );

  return (
    <div>
      <UserByWalletInput
        wallet={wallet}
        onChangeWallet={onChangeWallet}
        openModal={openModal}
        walletValid={walletValid}
        placeholder={placeholder}
      />
      <SearchItem
        isOpen={isOpenUserModal}
        onClose={closeModal}
        handleChangeWallet={onChangeWallet}
        wallet={wallet}
      />
    </div>
  );
};
