import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { usePrivateQuery } from '../usePrivateQuery';
import { Wallet } from '../useProfile';

interface Response {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  document: string;
  countryCode: string;
  theme: {
    headerLogoUrl: null | string;
    headerBackgroundColor: string;
    bodyCardBackgroundColor: string;
  };
  defaultOwnerAddress: string;
  operatorAddress: string;
  wallets: Array<Wallet>;
  transferConfig: null;
  clientId: null;
  platformRoyalty: {
    name: string;
    payee: string;
    share: number;
  };
}

export const useCompanyById = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);

  return usePrivateQuery([PixwayAPIRoutes.COMPANIES, id], () =>
    axios.get<Response>(PixwayAPIRoutes.COMPANIES.replace('{id}', id))
  );
};
