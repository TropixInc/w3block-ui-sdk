import { useContext } from 'react';
import { UserContext } from '../providers/userProvider';



export const useProfileWithKYC = (): any => {
  const context = useContext(UserContext);
  return { ...context };
};
