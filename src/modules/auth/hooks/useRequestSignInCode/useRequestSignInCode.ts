import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';

interface Payload {
  email: string;
  tenantId: string;
}

export const useRequestSignInCode = () => {
  const axios = useAxios(W3blockAPI.ID);
  return useMutation(
    [PixwayAPIRoutes.REQUEST_SIGNIN_CODE],
    async (payload: Payload) => {
      return axios.post(PixwayAPIRoutes.REQUEST_SIGNIN_CODE, payload);
    }
  );
};
