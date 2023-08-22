import { ReactNode, createContext } from 'react';

import { useGetCompanyLoyalties } from '../../hooks/useGetCompanyLoyalties';
import { LoyaltyInterface } from '../../interface/loyalty';

interface BusinessProviderContextInterface {
  loyalties: LoyaltyInterface[];
}

export const BusinessProviderContext =
  createContext<BusinessProviderContextInterface>({ loyalties: [] });

export const BusinessProviderSDK = ({ children }: { children: ReactNode }) => {
  const { data } = useGetCompanyLoyalties();

  return (
    <BusinessProviderContext.Provider value={{ loyalties: data ?? [] }}>
      {children}
    </BusinessProviderContext.Provider>
  );
};
