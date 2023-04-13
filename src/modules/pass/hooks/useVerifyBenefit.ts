import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { VerifyBenefitResponse } from '../interfaces/PassBenefitDTO';

interface VerifyBenefit {
  benefitId: string;
  userId: string;
  editionNumber: string;
  secret: string;
  enabled?: boolean;
}

const useVerifyBenefit = ({
  benefitId,
  userId,
  editionNumber,
  secret,
  enabled = true,
}: VerifyBenefit) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.VERIFY_BENEFIT,
      benefitId,
      userId,
      editionNumber,
      secret,
      tenantId,
    ],
    () =>
      axios.get<VerifyBenefitResponse>(
        PixwayAPIRoutes.VERIFY_BENEFIT.replace(
          '{tenantId}',
          tenantId ?? ''
        ).replace('{benefitId}', benefitId ?? ''),
        {
          params: {
            userId: userId || '',
            editionNumber: editionNumber || '',
            secret: secret || '',
          },
        }
      ),
    {
      enabled:
        validator.isUUID(tenantId ?? '') &&
        !validator.isEmpty(secret ?? '') &&
        enabled,
    }
  );
};

export default useVerifyBenefit;
