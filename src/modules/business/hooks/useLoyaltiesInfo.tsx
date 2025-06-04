import { useContext } from 'react';
import { BusinessProviderContext } from '../providers/businessProviderSDK';




export const useLoyaltiesInfo = () => {
  const context = useContext(BusinessProviderContext);
  return { ...context };
};
