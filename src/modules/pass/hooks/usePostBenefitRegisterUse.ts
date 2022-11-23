import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

interface Payload {
  userId: string;
  tokenId: string;
  secret: string;
}

const usePostBenefitRegisterUse = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.PASS_BENEFIT_REGISTER_USE],
    (body: Payload) =>
      axios.post<any>(
        PixwayAPIRoutes.PASS_BENEFIT_REGISTER_USE.replace(
          '{tenantId}',
          tenantId ?? ''
        ),
        body
      )
  );
};

export default usePostBenefitRegisterUse;
