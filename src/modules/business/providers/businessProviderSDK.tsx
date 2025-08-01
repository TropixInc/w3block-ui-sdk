import { ReactNode } from 'react';
import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';
import { LoyaltyInterface } from '../../shared/interfaces/ILoyalty';
import { useGetCompanyLoyalties } from '../hooks/useGetCompanyLoyalties';

interface BusinessProviderContextInterface {
  loyalties: LoyaltyInterface[];
}

export const BusinessProviderContext = createSymlinkSafeContext<BusinessProviderContextInterface>(
  '__BUSINESS_PROVIDER_CONTEXT__',
  { loyalties: [] }
);

export const BusinessProviderSDK = ({ children }: { children: ReactNode }) => {
  const { data } = useGetCompanyLoyalties();

  return (
    <BusinessProviderContext.Provider value={{ loyalties: data ?? [] }}>
      {children}
    </BusinessProviderContext.Provider>
  );
};
