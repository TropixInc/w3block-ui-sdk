import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';

interface Payload {
  email: string;
  editionId: string;
}

const useTransferTokenWithEmail = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.TRANSFER_TOKEN_EMAIL],
    (payload: Payload) =>
      axios.patch(
        PixwayAPIRoutes.TRANSFER_TOKEN_EMAIL.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{id}', payload.editionId),
        {
          email: payload.email,
        }
      )
  );
};

export default useTransferTokenWithEmail;
