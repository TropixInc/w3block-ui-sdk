import { useContext } from 'react';
import { UserWalletsContext } from '../../providers/userWalletsProvider';




export function useUserWallet() {
  const context = useContext(UserWalletsContext);
  return { ...context };
}
