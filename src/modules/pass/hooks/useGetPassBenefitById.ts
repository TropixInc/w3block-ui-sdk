import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

const useGetPassBenefitById = (benefitId: string) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_BY_ID],
    () =>
      axios.get<PassBenefitDTO>(
        PixwayAPIRoutes.PASS_BENEFIT_BY_ID.replace(
          '{tenantId}',
          tenantId ?? ''
        ).replace('{benefitId}', benefitId)
      ),
    {
      enabled: validator.isUUID(tenantId) && validator.isUUID(benefitId ?? ''),
    }
  );
};

export default useGetPassBenefitById;
