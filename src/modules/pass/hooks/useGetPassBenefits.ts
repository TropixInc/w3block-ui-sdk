import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

interface Response {
  items: PassBenefitDTO[];
}

interface Props {
  tokenPassId?: string;
  chainId?: string;
  contractAddress?: string;
  enabled?: boolean;
}
const useGetPassBenefits = ({
  tokenPassId,
  chainId,
  contractAddress,
  enabled,
}: Props) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFIT],
    async () => {
      try {
        const response = await axios.get<Response>(
          PixwayAPIRoutes.PASS_BENEFIT.replace('{tenantId}', tenantId ?? ''),
          {
            params: {
              tokenPassId: tokenPassId,
              chainId: chainId && +chainId,
              contractAddress: contractAddress,
            },
          }
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar benefícios do passe:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled:
        contractAddress != undefined &&
        contractAddress != '' &&
        chainId != undefined &&
        chainId != '' &&
        enabled,
    }
  );
};

export default useGetPassBenefits;
