import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { TokenPassEntity } from '../interfaces/PassBenefitDTO';

const useGetPassById = (passId: string) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.PASS_BY_ID, passId],
    () =>
      axios.get<TokenPassEntity>(
        PixwayAPIRoutes.PASS_BY_ID.replace(
          '{tenantId}',
          tenantId ?? ''
        ).replace('{id}', passId ?? '')
      ),
    {
      enabled: passId != undefined && passId != '',
    }
  );
};

export default useGetPassById;
