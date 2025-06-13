

import { useQuery } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

const useGetPassBenefitById = (benefitId: string) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_BY_ID, benefitId],
    async () => {
      try {
        const response = await axios.get<PassBenefitDTO>(
          PixwayAPIRoutes.PASS_BENEFIT_BY_ID.replace(
            '{tenantId}',
            tenantId ?? ''
          ).replace('{benefitId}', benefitId)
        );
        return response;
      } catch (error) {
        console.error('Erro ao buscar benefício pelo ID:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled:
        tenantId != undefined &&
        tenantId != '' &&
        benefitId != undefined &&
        benefitId != '',
    }
  );
};

export default useGetPassBenefitById;
