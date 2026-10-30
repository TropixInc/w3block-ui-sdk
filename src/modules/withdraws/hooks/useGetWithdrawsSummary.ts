/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import {
  Withdraw,
  WithdrawAutomationDecision,
  WithdrawOrigin,
  WithdrawStatus,
  WithdrawsAdminResponse,
  WithdrawsSummary,
  WITHDRAW_PROCESSING_STATUSES,
} from '../interfaces';
import {
  isMissingEndpoint,
  mockSummary,
  withWithdrawExtras,
  WITHDRAWS_MOCK_FALLBACK,
} from '../utils/mock';
import { serializeWithdrawParams } from './useGetWithdrawsAdmin';

interface Params {
  /** Início do período do card "Pago nesta rodada" (ISO). Default: últimos 7 dias. */
  from?: string;
  to?: string;
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Cards da lista (api-faltante §4). A rota `GET /withdraws/admin/summary` não
 * existe ainda. Fallback: contagens reais via a lista filtrada (limit=1 e
 * `meta.totalItems`) e valor pago somado dos concluídos no período; só o
 * número de compras repassadas vem do mock (`isMock: true`).
 */
export const useGetWithdrawsSummary = (
  { from, to }: Params = {},
  options?: QueryConfig<WithdrawsSummary, any, WithdrawsSummary>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const periodFrom = from ?? new Date(Date.now() - 7 * DAY).toISOString();
  const periodTo = to ?? new Date().toISOString();

  const listCount = async (params: Record<string, unknown>) => {
    const query = serializeWithdrawParams({ ...params, page: 1, limit: 1 });
    const response = await axios.get<WithdrawsAdminResponse>(
      `${PixwayAPIRoutes.WITHDRAWS_ADMIN.replace(
        '{companyId}',
        companyId
      )}?${query}`
    );
    return response.data?.meta?.totalItems ?? 0;
  };

  return usePrivateQuery<WithdrawsSummary, any, WithdrawsSummary>(
    [
      PixwayAPIRoutes.WITHDRAWS_ADMIN_SUMMARY,
      companyId,
      periodFrom.slice(0, 10),
      periodTo.slice(0, 10),
    ],
    async () => {
      try {
        const response = await axios.get<WithdrawsSummary>(
          PixwayAPIRoutes.WITHDRAWS_ADMIN_SUMMARY.replace(
            '{companyId}',
            companyId
          ),
          { params: { from: periodFrom, to: periodTo } }
        );
        return response.data;
      } catch (err) {
        // A rota colide com `GET /admin/:id` (summary vira id inválido): aceita 400 também.
        const status = (err as any)?.response?.status;
        if (
          !WITHDRAWS_MOCK_FALLBACK ||
          !(isMissingEndpoint(err) || status === 400)
        )
          throw err;
      }

      const openStatuses = [
        WithdrawStatus.PENDING,
        WithdrawStatus.ESCROWING_RESOURCES,
        WithdrawStatus.READY_TO_TRANSFER_FUNDS,
      ];
      const [failed, declined, manualReady, processingTotal, concludedPage] =
        await Promise.all([
          listCount({ status: [WithdrawStatus.FAILED] }),
          listCount({
            status: openStatuses,
            automaticTransferState: [WithdrawAutomationDecision.DECLINED],
          }),
          listCount({
            status: [WithdrawStatus.READY_TO_TRANSFER_FUNDS],
            origin: [WithdrawOrigin.USER, WithdrawOrigin.ON_BEHALF],
          }),
          listCount({ status: WITHDRAW_PROCESSING_STATUSES }),
          axios.get<WithdrawsAdminResponse>(
            `${PixwayAPIRoutes.WITHDRAWS_ADMIN.replace(
              '{companyId}',
              companyId
            )}?${serializeWithdrawParams({
              status: [WithdrawStatus.CONCLUDED],
              page: 1,
              limit: 100,
              sortBy: 'createdAt',
              orderBy: 'DESC',
            })}`
          ),
        ]);

      const paid = (concludedPage.data?.items ?? [])
        .map((item: Withdraw) => withWithdrawExtras(item))
        .filter((item) => {
          const at = item.concludedAt ?? item.updatedAt ?? item.createdAt ?? '';
          return at >= periodFrom && at <= periodTo;
        });
      const awaitingAction = failed + declined + manualReady;

      return mockSummary({
        seed: companyId,
        awaitingAction,
        processing: Math.max(0, processingTotal - declined - manualReady),
        paidInPeriod: {
          count: paid.length,
          amount: paid
            .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
            .toFixed(2),
          ordersCount: paid.reduce(
            (acc, item) => acc + (item.ordersCount ?? 0),
            0
          ),
        },
        nextExecutionAt: null,
      });
    },
    {
      enabled: Boolean(companyId),
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      ...options,
    }
  );
};
