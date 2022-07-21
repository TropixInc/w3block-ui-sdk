import { useContext } from 'react';

import { PixwayRouterContext } from '../../../core/context/Router';

const useRouter = () => {
  return useContext(PixwayRouterContext);
};

export default useRouter;
