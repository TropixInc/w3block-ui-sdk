/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useTranslation from '../../shared/hooks/useTranslation';
import { Withdraw } from '../interfaces';
import { downloadBlob, withdrawFileName } from '../utils/download';
import {
  isMissingEndpoint,
  mockWithdrawXlsxBlob,
  WITHDRAWS_MOCK_FALLBACK,
} from '../utils/mock';
import { getLastProviderTransfer } from '../utils/presentation';

interface Params {
  withdraw: Withdraw;
  admin?: boolean;
  /** Quando true (default) já dispara o download. */
  download?: boolean;
}

/**
 * XLS do saque (api-faltante §2). Enquanto a rota não existir, gera um CSV
 * local com as compras simuladas do saque, para o botão funcionar.
 */
export const useGetWithdrawXlsx = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const [translate] = useTranslation();

  return useMutation(
    [PixwayAPIRoutes.WITHDRAW_XLSX_ADMIN, companyId],
    async ({ withdraw, admin = true, download = true }: Params) => {
      const route = admin
        ? PixwayAPIRoutes.WITHDRAW_XLSX_ADMIN
        : PixwayAPIRoutes.WITHDRAW_XLSX;
      let blob: Blob;
      let isMock = false;
      try {
        const response = await axios.get(
          route.replace('{companyId}', companyId).replace('{id}', withdraw.id),
          { responseType: 'blob' }
        );
        blob = response.data as Blob;
      } catch (err) {
        if (!WITHDRAWS_MOCK_FALLBACK || !isMissingEndpoint(err)) throw err;
        isMock = true;
        const transfer = getLastProviderTransfer(withdraw);
        blob = mockWithdrawXlsxBlob(
          withdraw,
          {
            [translate('withdraws>xlsx>withdrawId')]: withdraw.id,
            [translate('withdraws>xlsx>establishment')]:
              withdraw.user?.name ?? withdraw.user?.email ?? withdraw.userId,
            [translate('withdraws>xlsx>email')]: withdraw.user?.email ?? '',
            [translate('withdraws>xlsx>period')]: withdraw.period
              ? `${withdraw.period.from.slice(
                  0,
                  10
                )} - ${withdraw.period.to.slice(0, 10)}`
              : '',
            [translate('withdraws>xlsx>amount')]: withdraw.amount,
            [translate('withdraws>xlsx>status')]: withdraw.status,
            [translate('withdraws>xlsx>endToEndId')]:
              transfer?.endToEndId ?? '',
            [translate('withdraws>xlsx>mockNotice')]: translate(
              'withdraws>xlsx>mockNoticeText'
            ),
          },
          [
            translate('withdraws>orders>order'),
            translate('withdraws>orders>purchasedAt'),
            translate('withdraws>orders>customer'),
            translate('withdraws>orders>releasedAt'),
            translate('withdraws>orders>gross'),
            translate('withdraws>orders>cashback'),
            translate('withdraws>orders>net'),
          ]
        );
      }
      if (download)
        downloadBlob(blob, withdrawFileName('saque', withdraw.id, blob));
      return { blob, isMock };
    }
  );
};
