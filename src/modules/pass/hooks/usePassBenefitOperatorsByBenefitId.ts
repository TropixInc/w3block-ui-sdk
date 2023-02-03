import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { OrderByEnum } from '../enums/OrderByEnum';
import { PassBenefitOperatorsByBenefitIdDTO } from '../interfaces/PassBenefitOperatorsDTO';

interface Response {
  items: PassBenefitOperatorsByBenefitIdDTO[];
}

const usePassBenefitOperatorsByBenefitId = (
  benefitId: string,
  orderBy?: OrderByEnum
) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_OPERATORS_BY_BENEFITID],
    () =>
      axios.get<Response>(
        PixwayAPIRoutes.PASS_BENEFIT_OPERATORS_BY_BENEFITID.replace(
          '{tenantId}',
          tenantId ?? ''
        ).replace('{benefitId}', benefitId ?? '') + `?orderBy=${orderBy}`
      ),
    {
      enabled: validator.isUUID(tenantId),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default usePassBenefitOperatorsByBenefitId;
