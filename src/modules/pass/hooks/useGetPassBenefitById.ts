import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

const useGetPassBenefitById = (benefitId: string) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_BY_ID, benefitId],
    () =>
      axios.get<PassBenefitDTO>(
        PixwayAPIRoutes.PASS_BENEFIT_BY_ID.replace(
          '{tenantId}',
          tenantId ?? ''
        ).replace('{benefitId}', benefitId)
      ),
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
