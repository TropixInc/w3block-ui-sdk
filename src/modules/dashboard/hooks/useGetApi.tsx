import { useQuery } from 'react-query';

import axios from 'axios';

interface Params {
  address?: string;
  enabled?: boolean;
}

export const useGetApi = ({ address, enabled }: Params) => {
  return useQuery(
    [address],
    () => {
      return axios.get(
        address
          ? `https://cms.foodbusters.com.br/api/restaurante-fas?populate[image][*]&filters[walletAddress]=${address}`
          : 'https://cms.foodbusters.com.br/api/restaurante-fas?populate[image][*]'
      );
    },
    { enabled: enabled }
  );
};
