import { useContext } from 'react';

import { UserWalletsContext } from '../../providers';

export function useUserWallet() {
  const { wallets, hasWallet, setMainCoin, mainWallet } =
    useContext(UserWalletsContext);
  return { wallets, hasWallet, setMainCoin, mainWallet };
}
