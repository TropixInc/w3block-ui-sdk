import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';

interface Payload {
  toAddress: string;
  editionId: string[];
}

const useTransferMultipleTokens = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.TRANSFER_MULTIPLE_TOKENS],
    (payload: Payload) =>
      axios.patch(
        PixwayAPIRoutes.TRANSFER_MULTIPLE_TOKENS.replace(
          '{companyId}',
          companyId ?? ''
        ),
        payload
      )
  );
};

export default useTransferMultipleTokens;
