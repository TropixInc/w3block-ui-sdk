import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { usePrivateQuery } from '../usePrivateQuery';

export const useIntegrations = () => {
  const axios = useAxios(W3blockAPI.ID);
  return usePrivateQuery(PixwayAPIRoutes.WALLET_INTEGRATIONS, () =>
    axios.get(PixwayAPIRoutes.WALLET_INTEGRATIONS)
  );
};
