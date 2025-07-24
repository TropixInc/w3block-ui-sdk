import { createContext, ReactNode } from 'react';

interface CompanyIdProviderProps {
  companyId: string;
  children: ReactNode;
}

// Check if context already exists (for symlink development)
const globalKey = '__COMPANY_ID_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<string>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<string>('');
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const CompanyIdContext = context;

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
