import { useContext } from 'react';

import { PixwayAPIContext } from '../../providers/PixwayAPIProvider/PixwayAPIProvider';

export const usePixwayAPIURL = () => {
  return useContext(PixwayAPIContext);
};
