import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

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
