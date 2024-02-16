import { useQuery } from 'react-query';

import axios from 'axios';

export const useGetApi = (address: string, enabled: boolean) => {
  return useQuery(
    [address],
    () => {
      return axios.get(
        `https://cms.foodbusters.com.br/api/restaurante-fas?populate[image][*]&filters[walletAddress]=${address}`
      );
    },
    { enabled: enabled }
  );
};
