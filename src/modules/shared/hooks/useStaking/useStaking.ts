import { useMutation } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { QueryParams } from '../usePaginatedQuery';
import { usePixwaySession } from '../usePixwaySession';
import { usePrivateQuery } from '../usePrivateQuery';
import { useUserWallet } from '../useUserWallet';

export interface SummaryDto {
  actionId: string;
  amount: string;
  companyId: string;
  createdAt: string;
  executeAt: string;
  expiresAt: string;
  fromAddress: string;
  id: string;
  isExpired: boolean;
  isPoolGrouping: boolean;
  isWithdrawal: boolean;
  loyaltyId: string;
  parentMinterId: string;
  parentTransferId: string;
  poolAddress: string;
  rollbackActionId: string;
  sendEmail: boolean;
  stakingRuleId: string;
  status: string;
  toAddress: string;
  updatedAt: string;
  userId: string;
}

export const useStakingSummary = (query?: QueryParams) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { data: session } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  const { loyaltyWallet } = useUserWallet();
  const defaultQuery: QueryParams = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    orderBy: 'DESC',
    ...query,
  };

  const queryString =
    '?' +
    new URLSearchParams(defaultQuery as Record<string, string>).toString();
  return usePrivateQuery(
    [
      companyId,
      loyaltyWallet?.[0]?.loyaltyId,
      PixwayAPIRoutes.STAKING_SUMMARY,
      query,
    ],
    () =>
      axios.get(
        PixwayAPIRoutes.STAKING_SUMMARY.replace('{companyId}', companyId)
          .replace('{userId}', session?.id ?? '')
          .replace(
            '{loyaltyId}',
            loyaltyWallet?.length > 0 ? loyaltyWallet?.[0]?.loyaltyId : ''
          ) + queryString
      ),
    {
      enabled: !!companyId && !!session?.id,
    }
  );
};

export const useRedeemStaking = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { data: session } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  const { loyaltyWallet } = useUserWallet();

  return useMutation(
    [companyId, loyaltyWallet, PixwayAPIRoutes.REDEEM_STAKING],
    () =>
      axios.patch(
        PixwayAPIRoutes.REDEEM_STAKING.replace('{companyId}', companyId)
          .replace('{userId}', session?.id ?? '')
          .replace(
            '{loyaltyId}',
            loyaltyWallet.length > 0 ? loyaltyWallet?.[0]?.loyaltyId : ''
          )
      )
  );
};
