import { useContext } from 'react';

import { routerContext } from '../../../core/context/Router';

const useRouter = () => {
  return useContext(routerContext);
};

export default useRouter;
