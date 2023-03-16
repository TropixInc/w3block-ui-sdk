import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { BenefitsByEditionNumberDTO } from '../interfaces/PassBenefitDTO';

interface Props {
  tokenPassId: string;
  editionNumber: number;
}
const useGetBenefitsByEditionNumber = ({
  tokenPassId,
  editionNumber,
}: Props) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFITS_BY_EDITION],
    () =>
      axios.get<BenefitsByEditionNumberDTO[]>(
        PixwayAPIRoutes.PASS_BENEFITS_BY_EDITION.replace(
          '{tenantId}',
          tenantId ?? ''
        )
          .replace('{id}', tokenPassId)
          .replace('{editionNumber}', editionNumber.toString())
      ),
    {
      enabled:
        !validator.isEmpty(String(tokenPassId)) &&
        !validator.isEmpty(String(editionNumber)),
    }
  );
};

export default useGetBenefitsByEditionNumber;
