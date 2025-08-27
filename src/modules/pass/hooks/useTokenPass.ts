import { useQueryClient } from '@tanstack/react-query';
import { ChainScan } from '../../shared/enums/ChainId';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

export interface TokenPassDTO {
  items: {
    tokenName: string;
    contractAddress: string;
    chainId: ChainScan;
    name: string;
    description: string;
    rules: string;
    imageUrl: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const useGetTokenPass = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();
  const queryClient = useQueryClient();

  return usePrivateQuery(
    [PixwayAPIRoutes.TOKEN_PASS],
    () =>
      axios.get<TokenPassDTO>(
        PixwayAPIRoutes.TOKEN_PASS.replace('{tenantId}', tenantId ?? '')
      ),
    {
      enabled: tenantId != undefined && tenantId != '',
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [PixwayAPIRoutes.TOKEN_EDITIONS]});
      },
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    }
  );
};

export default useGetTokenPass;
