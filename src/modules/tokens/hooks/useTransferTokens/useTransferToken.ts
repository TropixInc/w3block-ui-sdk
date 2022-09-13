import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';

interface Payload {
  toAddress: string;
  editionId: string;
}

const useTransferToken = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation([PixwayAPIRoutes.TRANSFER_TOKEN], (payload: Payload) =>
    axios.patch(
      PixwayAPIRoutes.TRANSFER_TOKEN.replace(
        '{companyId}',
        companyId ?? ''
      ).replace('{id}', payload.editionId),
      {
        toAddress: payload.toAddress,
      }
    )
  );
};

export default useTransferToken;
