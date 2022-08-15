import { useContext } from 'react';

import { W3blockAuthenticationContext } from '../../contexts';

export const usePixwayAuthentication = () => {
  return useContext(W3blockAuthenticationContext);
};
