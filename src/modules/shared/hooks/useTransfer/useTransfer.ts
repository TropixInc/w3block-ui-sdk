import { useMutation } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

export const useTransfer = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.TRANSFER_COIN, companyId as string],
    ({
      to,
      from,
      amount,
      id,
      description,
    }: {
      to: string;
      from: string;
      amount: string;
      id: string;
      description: string;
    }) =>
      axios
        .patch(
          PixwayAPIRoutes.TRANSFER_COIN.replace(
            '{companyId}',
            companyId ?? ''
          ).replace('{id}', id ?? ''),
          { to, from, amount, metadata: { description } }
        )
        .then((data) => data.data)
  );
};
