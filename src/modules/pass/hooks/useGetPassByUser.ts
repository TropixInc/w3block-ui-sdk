import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { useSessionUser } from '../../shared/hooks/useSessionUser';

export interface PassByUser {
  tokenName: string;
  contractAddress: string;
  chainId: string;
  collectionId: string;
  name: string;
  description: string;
  rules: string;
  imageUrl: string;
  tenantId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Response {
  items: PassByUser[];
}

const useGetPassByUser = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();
  const user = useSessionUser();

  return usePrivateQuery([PixwayAPIRoutes.PASS_BY_USER], () =>
    axios.get<Response>(
      PixwayAPIRoutes.PASS_BY_USER.replace(
        '{tenantId}',
        tenantId ?? ''
      ).replaceAll('{userId}', user?.id ?? '')
    )
  );
};

export default useGetPassByUser;
