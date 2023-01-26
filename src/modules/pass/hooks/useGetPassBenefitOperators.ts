import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { PassBenefitOperatorsDTO } from '../interfaces/PassBenefitOperatorsDTO';

const usePassBenefitOperators = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_OPERATORS],
    () =>
      axios.get<PassBenefitOperatorsDTO>(
        PixwayAPIRoutes.PASS_BENEFIT_OPERATORS.replace(
          '{tenantId}',
          tenantId ?? ''
        )
      ),
    {
      enabled: validator.isUUID(tenantId),
    }
  );
};

export default usePassBenefitOperators;
