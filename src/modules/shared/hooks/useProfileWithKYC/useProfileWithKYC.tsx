import { useContext } from 'react';

import { UserContext } from '../../providers/UserProvider/userProvider';

export const useProfileWithKYC = () => {
  const context = useContext(UserContext);
  return { ...context };
};
