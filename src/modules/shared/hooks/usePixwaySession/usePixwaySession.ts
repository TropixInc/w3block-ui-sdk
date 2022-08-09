import { useContext } from 'react';

import { PixwaySessionContext } from '../../../auth/contexts/PixwaySessionContext';

export const usePixwaySession = () => {
  return useContext(PixwaySessionContext);
};
