import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';

interface Payload {
  email: string;
  code: string;
}

export const useSignInWithCode = () => {
  const axios = useAxios(W3blockAPI.ID);
  return useMutation(
    [PixwayAPIRoutes.SIGNIN_WITH_CODE],
    async (payload: Payload) => {
      return axios.post(PixwayAPIRoutes.SIGNIN_WITH_CODE, payload);
    }
  );
};
