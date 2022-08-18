import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios/useAxios';

interface Payload {
  email: string;
}

export const useRequestPasswordChange = (companyId: string) => {
  const axios = useAxios(W3blockAPI.ID);
  return useMutation((payload: Payload) =>
    axios.post(PixwayAPIRoutes.REQUEST_PASSWORD_CHANGE, {
      ...payload,
      companyId,
    })
  );
};
