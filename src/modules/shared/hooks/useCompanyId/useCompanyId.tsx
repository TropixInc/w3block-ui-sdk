import { useContext } from 'react';

import { CompanyIdContext } from '../../providers';

export const useCompanyId = (): string => {
  const companyId = useContext(CompanyIdContext);
  return companyId;
};
