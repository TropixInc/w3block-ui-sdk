import { ReactNode, createContext } from 'react';
import { LoyaltyInterface } from '../../shared/interfaces/ILoyalty';
import { useGetCompanyLoyalties } from '../hooks/useGetCompanyLoyalties';

interface BusinessProviderContextInterface {
  loyalties: LoyaltyInterface[];
}

// Check if context already exists (for symlink development)
const globalKey = '__BUSINESS_PROVIDER_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<BusinessProviderContextInterface>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<BusinessProviderContextInterface>({ loyalties: [] });
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const BusinessProviderContext = context;

export const BusinessProviderSDK = ({ children }: { children: ReactNode }) => {
  const { data } = useGetCompanyLoyalties();

  return (
    <BusinessProviderContext.Provider value={{ loyalties: data ?? [] }}>
      {children}
    </BusinessProviderContext.Provider>
  );
};
