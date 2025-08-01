import { ReactNode } from 'react';
import { createSymlinkSafeContext } from '../utils/createSymlinkSafeContext';

interface CompanyIdProviderProps {
  companyId: string;
  children: ReactNode;
}

export const CompanyIdContext = createSymlinkSafeContext<string>(
  '__COMPANY_ID_CONTEXT__',
  ''
);

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
