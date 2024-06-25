import { useMutation } from 'react-query';

import { W3blockAPI } from '../../../shared';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../../shared/hooks/usePrivateQuery';

interface Params {
  erc20ContractAddress?: string;
  erc20ChainId?: string;
  erc20ContractId?: string;
  fromWalletAddress: string;
  amount: string;
  withdrawAccountId: string;
  memo: string;
  userId?: string;
}

export const useRequestWithdraw = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation([PixwayAPIRoutes.REQUEST_WITHDRAW], (params: Params) =>
    axios.post(
      PixwayAPIRoutes.REQUEST_WITHDRAW.replace('{companyId}', companyId),
      params
    )
  );
};

export const useGetSpecificWithdrawAdmin = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN],
    () =>
      axios.get(
        PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW_ADMIN.replace(
          '{companyId}',
          companyId
        ).replace('{id}', id)
      ),
    { enabled: !!id }
  );
};

export const useGetSpecificWithdraw = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW],
    () =>
      axios.get(
        PixwayAPIRoutes.GET_SPECIFIC_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', id)
      ),
    { enabled: !!id }
  );
};

export const useConcludeWithdraw = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.CONCLUDE_WITHDRAW],
    (params: { receiptAssetId: string; id: string }) =>
      axios.patch(
        PixwayAPIRoutes.CONCLUDE_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', params.id),
        { receiptAssetId: params.receiptAssetId }
      )
  );
};

export const useEscrowWithdraw = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.ESCROW_WITHDRAW],
    (params: { id: string }) =>
      axios.patch(
        PixwayAPIRoutes.ESCROW_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', params.id)
      )
  );
};

export const useRefuseWithdraw = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.REFUSE_WITHDRAW],
    (params: { reason: string; id: string }) =>
      axios.patch(
        PixwayAPIRoutes.REFUSE_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', params.id),
        { reason: params.reason }
      )
  );
};
