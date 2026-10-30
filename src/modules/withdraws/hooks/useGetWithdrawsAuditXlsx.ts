/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useTranslation from '../../shared/hooks/useTranslation';
import { WithdrawsAdminFilters, WithdrawsAdminResponse } from '../interfaces';
import { downloadBlob } from '../utils/download';
import {
  isMissingEndpoint,
  mockAuditXlsxBlob,
  withWithdrawExtras,
  WITHDRAWS_MOCK_FALLBACK,
} from '../utils/mock';
import {
  getLastProviderTransfer,
  getWithdrawOriginLabel,
  getWithdrawPaymentPresentation,
  getWithdrawStatusPresentation,
} from '../utils/presentation';
import {
  buildWithdrawsAdminParams,
  serializeWithdrawParams,
} from './useGetWithdrawsAdmin';

/**
 * Relatório de auditoria (XLS) da lista de saques. Rota ainda inexistente:
 * no 404, monta um CSV com até 500 saques da lista atual (filtros aplicados).
 */
export const useGetWithdrawsAuditXlsx = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const [translate] = useTranslation();

  return useMutation(
    [PixwayAPIRoutes.WITHDRAWS_AUDIT_XLSX, companyId],
    async (filters: WithdrawsAdminFilters) => {
      const params = buildWithdrawsAdminParams({
        ...filters,
        page: 1,
        limit: 500,
      });
      const queryString = serializeWithdrawParams(params);
      let blob: Blob;
      let isMock = false;
      try {
        const response = await axios.get(
          `${PixwayAPIRoutes.WITHDRAWS_AUDIT_XLSX.replace(
            '{companyId}',
            companyId
          )}?${queryString}`,
          { responseType: 'blob' }
        );
        blob = response.data as Blob;
      } catch (err) {
        if (!WITHDRAWS_MOCK_FALLBACK || !isMissingEndpoint(err)) throw err;
        isMock = true;
        const list = await axios.get<WithdrawsAdminResponse>(
          `${PixwayAPIRoutes.WITHDRAWS_ADMIN.replace(
            '{companyId}',
            companyId
          )}?${queryString}`
        );
        const items = (list.data?.items ?? []).map(withWithdrawExtras);
        blob = mockAuditXlsxBlob(
          items,
          [
            translate('withdraws>xlsx>withdrawId'),
            translate('withdraws>xlsx>establishment'),
            translate('withdraws>xlsx>email'),
            translate('withdraws>list>requestedAt'),
            translate('withdraws>xlsx>period'),
            translate('withdraws>list>orders'),
            translate('withdraws>xlsx>amount'),
            translate('withdraws>list>origin'),
            translate('withdraws>list>payment'),
            translate('withdraws>xlsx>status'),
            translate('withdraws>xlsx>endToEndId'),
            translate('withdraws>detail>concludedAt'),
            translate('withdraws>actions>refuseReason'),
          ],
          (withdraw) => {
            const status = getWithdrawStatusPresentation(withdraw, translate);
            const payment = getWithdrawPaymentPresentation(withdraw, translate);
            return [
              withdraw.id,
              withdraw.user?.name ?? '',
              withdraw.user?.email ?? '',
              withdraw.createdAt ?? '',
              withdraw.period
                ? `${withdraw.period.from.slice(
                    0,
                    10
                  )} - ${withdraw.period.to.slice(0, 10)}`
                : '',
              withdraw.ordersCount ?? '',
              withdraw.amount,
              getWithdrawOriginLabel(withdraw.origin, translate),
              payment
                ? [payment.label, payment.detail].filter(Boolean).join(' · ')
                : '',
              [status.label, status.detail].filter(Boolean).join(' · '),
              getLastProviderTransfer(withdraw)?.endToEndId ?? '',
              withdraw.concludedAt ?? '',
              withdraw.reason ?? '',
            ];
          }
        );
      }
      const ext = blob.type.includes('csv') ? 'csv' : 'xlsx';
      downloadBlob(
        blob,
        `saques-auditoria-${new Date().toISOString().slice(0, 10)}.${ext}`
      );
      return { blob, isMock };
    }
  );
};
