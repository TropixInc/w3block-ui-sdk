import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

interface Payload {
  userId: string;
  editionNumber: string;
  benefitId: string;
  secret: string;
}

const usePostBenefitRegisterUse = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.PASS_BENEFIT_REGISTER_USE],
    async (body: Payload) => {
      try {
        const response = await axios.post<any>(
          PixwayAPIRoutes.PASS_BENEFIT_REGISTER_USE.replace(
            '{tenantId}',
            tenantId ?? ''
          ).replace('{id}', body.benefitId),
          body
        );
        return response;
      } catch (err) {
        console.error('Erro ao registrar uso do benefício:', err);
        throw handleNetworkException(err);
      }
    }
  );
};

export default usePostBenefitRegisterUse;
