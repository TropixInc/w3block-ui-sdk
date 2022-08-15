import { useContext } from 'react';

import { W3blockAPIContext } from '../../providers/W3blockApiProvider/W3blockApiProvider';

export const usePixwayAPIURL = () => {
  return useContext(W3blockAPIContext);
};
