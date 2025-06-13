import { useContext } from 'react';
import { PixwayRouterContext } from '../../core/context/PixwayRouterContext';



const useRouter = () => {
  return useContext(PixwayRouterContext);
};

export default useRouter;
