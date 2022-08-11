import { useContext } from 'react';

import { CompanyIdContext } from '../../providers';

export const useCompanyId = () => {
  const companyId = useContext(CompanyIdContext);
  return companyId;
};
