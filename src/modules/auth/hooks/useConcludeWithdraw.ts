import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

export const useConcludeWithdraw = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.CONCLUDE_WITHDRAW],
    // PR #697: além do comprovante, aceita confirmProviderTransfer (marca o
    // último Pix do provedor como pagamento) e agreeAutomaticTransfer
    // ("Pagar via Pix": paga pelo provedor do tenant, sem comprovante).
    (params: {
      id: string;
      receiptAssetId?: string;
      confirmProviderTransfer?: boolean;
      agreeAutomaticTransfer?: boolean;
    }) =>
      axios.patch(
        PixwayAPIRoutes.CONCLUDE_WITHDRAW.replace(
          '{companyId}',
          companyId
        ).replace('{id}', params.id),
        {
          receiptAssetId: params.receiptAssetId,
          confirmProviderTransfer: params.confirmProviderTransfer,
          agreeAutomaticTransfer: params.agreeAutomaticTransfer,
        }
      )
  );
};
