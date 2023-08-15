import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export const useGetUserByCode = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();
  return useMutation((code: string) =>
    axios
      .get(
        PixwayAPIRoutes.GET_TEMPORARY_CODE.replace(
          '{companyId}',
          companyId
        ).replace('{userId}', code)
      )
      .then((response) => response.data)
  );
};
