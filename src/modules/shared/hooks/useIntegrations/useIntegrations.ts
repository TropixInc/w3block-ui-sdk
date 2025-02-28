import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios';
import { usePrivateQuery } from '../usePrivateQuery';

export const useIntegrations = () => {
  const axios = useAxios(W3blockAPI.ID);

  return usePrivateQuery([PixwayAPIRoutes.WALLET_INTEGRATIONS], async () => {
    try {
      const response = await axios.get(PixwayAPIRoutes.WALLET_INTEGRATIONS);
      return response;
    } catch (err) {
      console.error('Erro ao buscar integrações:', err);
      throw handleNetworkException(err);
    }
  });
};
