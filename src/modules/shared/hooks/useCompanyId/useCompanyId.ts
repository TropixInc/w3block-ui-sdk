import { useCompanyConfig } from '../useCompanyConfig';

export const useCompanyId = () => {
  const { companyId } = useCompanyConfig();
  return companyId;
};
