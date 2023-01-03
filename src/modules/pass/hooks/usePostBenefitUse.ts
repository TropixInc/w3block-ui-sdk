import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export interface payload {
  userId: string;
  editionNumber?: string;
  secret: string;
}

const usePostBenefitUse = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useMutation([PixwayAPIRoutes.PASS_BENEFIT_USE], (body: payload) =>
    axios.post<any>(
      PixwayAPIRoutes.PASS_BENEFIT_USE.replace('{tenantId}', tenantId ?? ''),
      body
    )
  );
};

export default usePostBenefitUse;
