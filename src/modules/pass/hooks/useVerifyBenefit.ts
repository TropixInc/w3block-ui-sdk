import validator from 'validator';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { BenefitStatus } from '../enums/BenefitStatus';
import {
  BenefitAddress,
  TokenPassBenefitOperators,
  TokenPassBenefitUsesDTO,
} from '../interfaces/PassBenefitDTO';
import {
  TokenPassBenefitType,
  TokenPassEntity,
} from '../interfaces/PassBenefitOperatorsDTO';

interface VerifyBenefit {
  benefitId: string;
  userId: string;
  editionNumber: string;
  secret: string;
  enabled?: boolean;
}

export interface VerifyBenefitResponse {
  id: string;
  tokenPassId: string;
  tokenPass: TokenPassEntity;
  tokenPassBenefitUsage: TokenPassBenefitUsesDTO;
  status: BenefitStatus;
  name: string;
  description: string;
  rules: string;
  type: TokenPassBenefitType;
  useLimit: number;
  eventStartsAt: string;
  eventEndsAt: string;
  checkInStartsAt: string;
  checkInEndsAt: string;
  linkUrl: string;
  linkRules: string;
  dynamicQrCode: boolean;
  tokenPassBenefitAddresses: BenefitAddress[];
  tokenPassBenefitOperators: TokenPassBenefitOperators[];
  createdAt: string;
  updatedAt: string;
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
