import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { useProfile } from '../../shared/hooks/useProfile';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

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
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isAdmin = Boolean(
    userRoles?.includes('admin') ||
      userRoles?.includes('superAdmin') ||
      userRoles?.includes('operator')
  );

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BY_USER],
    async () => {
      try {
        const response = await axios.get<Response>(
          PixwayAPIRoutes.PASS_BY_USER.replace(
            '{tenantId}',
            tenantId ?? ''
          ).replaceAll('{userId}', profile?.data?.id ?? '')
        );
        return response;
      } catch (err) {
        console.error('Erro ao buscar passes do usuário:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: isAdmin,
    }
  );
};

export default useGetPassByUser;
