import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import useAxios from '../../../shared/hooks/useAxios/useAxios';

interface Payload {
  email: string;
}

export const useRequestPasswordChange = (companyId: string) => {
  const axios = useAxios();
  return useMutation((payload: Payload) =>
    axios.post(PixwayAPIRoutes.REQUEST_PASSWORD_CHANGE, {
      ...payload,
      companyId,
    })
  );
};
