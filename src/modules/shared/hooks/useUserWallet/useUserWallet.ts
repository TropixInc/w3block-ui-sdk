import { useContext } from 'react';

import { UserWalletsContext } from '../../providers/UserWalletsProvider/userWalletsProvider';

export function useUserWallet() {
  const context = useContext(UserWalletsContext);
  return { ...context };
}
