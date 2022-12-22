import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';

interface RequestWalletConnectDTO {
  chainId: number;
  address: string;
  uri: string;
}

export const useRequestWalletConnect = () => {
  const axios = useAxios(W3blockAPI.ID);

  const _requestWalletConnect = ({
    chainId,
    address,
    uri,
  }: RequestWalletConnectDTO) => {
    return axios.post(PixwayAPIRoutes.WALLET_CONNECT, {
      chainId,
      address,
      uri,
    });
  };

  const requestWalletConnect = useMutation(_requestWalletConnect);
  return requestWalletConnect;
};
