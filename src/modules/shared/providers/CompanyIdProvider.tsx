import { createContext, ReactNode } from 'react';

interface CompanyIdProviderProps {
  companyId: string;
  children: ReactNode;
}

export const CompanyIdContext = createContext<string>('');

export const CompanyIdProvider = ({
  companyId,
  children,
}: CompanyIdProviderProps) => {
  return (
    <CompanyIdContext.Provider value={companyId}>
      {children}
    </CompanyIdContext.Provider>
  );
};
