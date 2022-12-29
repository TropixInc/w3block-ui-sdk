import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

export interface BenefitsResponse {
  items: PassBenefitDTO[];
}

interface Props {
  collectionId?: string;
  editionNumber?: string;
}

const useGetPassBenefitsByContractToken = ({
  collectionId = '',
  editionNumber = '',
}: Props) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_BY_EDITION_NUMBER],
    () =>
      axios.get<BenefitsResponse>(
        PixwayAPIRoutes.PASS_BENEFIT_BY_EDITION_NUMBER.replace(
          '{tenantId}',
          tenantId ?? ''
        )
          .replace('{collectionId}', collectionId ?? '')
          .replace('{editionNumber}', editionNumber ?? '')
      ),
    {
      enabled:
        Boolean(tenantId) && Boolean(collectionId) && Boolean(editionNumber),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetPassBenefitsByContractToken;
