import { ReactNode, createContext } from 'react';
import { LoyaltyInterface } from '../../shared/interfaces/ILoyalty';
import { useGetCompanyLoyalties } from '../hooks/useGetCompanyLoyalties';




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
