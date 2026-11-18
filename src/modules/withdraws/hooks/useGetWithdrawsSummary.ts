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
const CONCLUDED_PAGE_LIMIT = 100;
const CONCLUDED_MAX_PAGES = 5;

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d;
};
const endOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** A rota de summary colide com `GET /admin/:id` ("summary" vira id inválido). */
const isSummaryIdCollision = (err: any) => {
  if (err?.response?.status !== 400) return false;
  const message = err?.response?.data?.message;
  const text = Array.isArray(message)
    ? message.join(' ')
    : String(message ?? '');
  return /uuid|\bid\b/i.test(text);
};

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
  // Arredondado ao dia para a chave do cache e a requisição baterem.
  const periodFrom = from ?? startOfDay(Date.now() - 7 * DAY).toISOString();
  const periodTo = to ?? endOfDay(Date.now()).toISOString();
  const fromMs = Date.parse(periodFrom);
  const toMs = Date.parse(periodTo);

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
    [PixwayAPIRoutes.WITHDRAWS_ADMIN_SUMMARY, companyId, periodFrom, periodTo],
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
        if (
          !WITHDRAWS_MOCK_FALLBACK ||
          !(isMissingEndpoint(err) || isSummaryIdCollision(err))
        )
          throw err;
      }

      const openStatuses = [
        WithdrawStatus.PENDING,
        WithdrawStatus.ESCROWING_RESOURCES,
        WithdrawStatus.READY_TO_TRANSFER_FUNDS,
      ];
      // Concluídos: a lista não filtra por concludedAt, então pagina do mais
      // recente até sair do período (ou até o teto de páginas).
      const concludedInPeriod = async () => {
        const found: Withdraw[] = [];
        for (let page = 1; page <= CONCLUDED_MAX_PAGES; page++) {
          const response = await axios.get<WithdrawsAdminResponse>(
            `${PixwayAPIRoutes.WITHDRAWS_ADMIN.replace(
              '{companyId}',
              companyId
            )}?${serializeWithdrawParams({
              status: [WithdrawStatus.CONCLUDED],
              page,
              limit: CONCLUDED_PAGE_LIMIT,
              sortBy: 'createdAt',
              orderBy: 'DESC',
            })}`
          );
          const items: Withdraw[] = response.data?.items ?? [];
          let olderThanPeriod = false;
          for (const item of items) {
            const at = Date.parse(
              item.concludedAt ?? item.updatedAt ?? item.createdAt ?? ''
            );
            if (!Number.isNaN(at) && at >= fromMs && at <= toMs) {
              found.push(item);
            }
            if (Date.parse(item.createdAt ?? '') < fromMs) {
              olderThanPeriod = true;
            }
          }
          const totalPages = response.data?.meta?.totalPages ?? 1;
          if (olderThanPeriod || page >= totalPages) break;
        }
        return found;
      };

      const [failed, declined, manualReady, processingTotal, concluded] =
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
          concludedInPeriod(),
        ]);

      const paid = concluded.map((item) => withWithdrawExtras(item));
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
