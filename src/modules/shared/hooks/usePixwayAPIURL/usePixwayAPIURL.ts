import { useContext } from 'react';

import { W3blockAPIContext } from '../../../core/providers/W3blockApiProvider/W3blockApiProvider';

export const usePixwayAPIURL = () => {
  return useContext(W3blockAPIContext);
};
