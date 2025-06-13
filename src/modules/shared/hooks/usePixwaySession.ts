import { useContext } from 'react';
import { PixwaySessionContext } from '../../auth/context/PixwaySessionContext';



export const usePixwaySession = () => {
  return useContext(PixwaySessionContext);
};
