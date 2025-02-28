import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';

export const useGetUserByCode = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  return useMutation(async (code: string) => {
    try {
      const response = await axios.get(
        PixwayAPIRoutes.GET_TEMPORARY_CODE.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{userId}', code)
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar usuário por código:', err);
      throw handleNetworkException(err);
    }
  });
};
