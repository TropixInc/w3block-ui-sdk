import { useMutation } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

export const useIncreaseCurrencyAllowance = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [],
    ({
      currencyId,
      walletAddress,
      targetAmount,
    }: {
      currencyId: string;
      walletAddress: string;
      targetAmount: string;
    }) => {
      return axios.patch(
        PixwayAPIRoutes.INCREASE_CURRENCY_ALLOWANCE.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{currencyId}', currencyId),
        { walletAddress, targetAmount }
      );
    }
  );
};
