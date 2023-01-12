import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { RequestWalletConnectDTO } from '../useRequestWalletConnect';

export const useDisconnectWalletConnect = () => {
  const axios = useAxios(W3blockAPI.ID);

  const _disconnectWalletConnect = ({
    chainId,
    address,
  }: RequestWalletConnectDTO) => {
    return axios.delete(PixwayAPIRoutes.DISCONNECT_WALLET_CONNECT, {
      data: { chainId, address },
    });
  };

  const disconnectWalletConnect = useMutation(_disconnectWalletConnect);
  return disconnectWalletConnect;
};
