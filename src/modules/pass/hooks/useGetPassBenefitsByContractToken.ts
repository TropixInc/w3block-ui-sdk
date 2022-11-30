import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

const useGetPassBenefitsByContractToken = (
  chainId: string,
  contractAddress: string,
  tokenId: string
) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT_BY_CHAIN_CONTRACT_TOKEN],
    () =>
      axios.get(
        PixwayAPIRoutes.PASS_BENEFIT_BY_CHAIN_CONTRACT_TOKEN.replace(
          '{tenantId}',
          tenantId ?? ''
        )
          .replace('{chainId}', chainId ?? '')
          .replace('{contractAddress}', contractAddress ?? '')
          .replace('{tokenId}', tokenId ?? '')
      ),
    {
      enabled: Boolean(tenantId),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetPassBenefitsByContractToken;
