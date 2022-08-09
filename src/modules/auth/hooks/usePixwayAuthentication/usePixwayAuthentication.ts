import { useContext } from 'react';

import { PixwayAuthenticationContext } from '../../contexts';

export const usePixwayAuthentication = () => {
  return useContext(PixwayAuthenticationContext);
};
