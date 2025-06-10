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
          ? `https://cms.zuca.ai/api/restaurantes?populate[image][*]&filters[active]=true&sort[1]=name&sort[0]=weight:desc&pagination[pageSize]=100&filters[walletAddress]=${address}`
          : 'https://cms.zuca.ai/api/restaurantes?populate[image][*]&filters[active]=true&sort[1]=name&sort[0]=weight:desc&pagination[pageSize]=100'
      );
    },
    { enabled: enabled }
  );
};
