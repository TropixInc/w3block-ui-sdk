import { useContext } from 'react';

import { UserWalletsContext } from '../../providers';

export function useUserWallet() {
  const context = useContext(UserWalletsContext);
  return { ...context };
}
