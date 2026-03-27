import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

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

export { useGetSpecificWithdrawAdmin } from './useGetSpecificWithdrawAdmin';
export { useGetSpecificWithdraw } from './useGetSpecificWithdraw';
export { useConcludeWithdraw } from './useConcludeWithdraw';
export { useEscrowWithdraw } from './useEscrowWithdraw';
export { useRefuseWithdraw } from './useRefuseWithdraw';
