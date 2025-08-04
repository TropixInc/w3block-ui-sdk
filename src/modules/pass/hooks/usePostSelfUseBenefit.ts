/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { VerifyBenefitResponse } from '../interfaces/PassBenefitDTO';

interface Payload {
  body: {
    userId: string;
    editionNumber: string;
  };
  benefitId: string;
}

const usePostSelfUseBenefit = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.PASS_BENEFIT_SELF_USE],
    async ({ body, benefitId }: Payload) => {
      try {
        const response = await axios.post<VerifyBenefitResponse>(
          PixwayAPIRoutes.PASS_BENEFIT_SELF_USE.replace(
            '{tenantId}',
            tenantId ?? ''
          ).replace('{id}', benefitId),
          body
        );
        return response;
      } catch (error) {
        throw handleNetworkException(error);
      }
    }
  );
};
export default usePostSelfUseBenefit;
