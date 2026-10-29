import { useMutation } from '@tanstack/react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { Withdraw } from '../interfaces';

/**
 * Reconsulta o Pix no provedor e atualiza o saque
 * (`PATCH /{companyId}/withdraws/admin/{id}/transfer/reconcile`, PR #697).
 */
export const useReconcileWithdrawTransfer = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.RECONCILE_WITHDRAW_TRANSFER],
    (params: { id: string }) =>
      axios.patch<Withdraw>(
        PixwayAPIRoutes.RECONCILE_WITHDRAW_TRANSFER.replace(
          '{companyId}',
          companyId
        ).replace('{id}', params.id)
      )
  );
};
