/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import { WithdrawsAdminFilters, WithdrawsAdminResponse } from '../interfaces';
import { withWithdrawExtras } from '../utils/mock';

export const buildWithdrawsAdminParams = (filters: WithdrawsAdminFilters) => {
  const params: Record<string, unknown> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    sortBy: filters.sortBy ?? 'createdAt',
    orderBy: filters.orderBy ?? 'DESC',
  };
  if (filters.status?.length) params.status = filters.status;
  if (filters.origin?.length) params.origin = filters.origin;
  if (filters.automaticFlowState?.length)
    params.automaticFlowState = filters.automaticFlowState;
  if (filters.automaticTransferState?.length)
    params.automaticTransferState = filters.automaticTransferState;
  if (filters.failureStage?.length) params.failureStage = filters.failureStage;
  // Ainda não aceitos pela API (api-faltante §5); inofensivos até lá.
  if (filters.search) params.search = filters.search;
  if (filters.createdAtFrom) params.createdAtFrom = filters.createdAtFrom;
  if (filters.createdAtTo) params.createdAtTo = filters.createdAtTo;
  return params;
};

/** Serializa arrays como `status=a&status=b` (formato do WithdrawPaginationDto). */
export const serializeWithdrawParams = (params: Record<string, unknown>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value))
      value.forEach((v) => search.append(key, String(v)));
    else search.append(key, String(value));
  });
  return search.toString();
};

/** Lista admin de saques (`GET /{companyId}/withdraws/admin`). */
export const useGetWithdrawsAdmin = (
  filters: WithdrawsAdminFilters,
  options?: QueryConfig<WithdrawsAdminResponse, any, WithdrawsAdminResponse>
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const params = buildWithdrawsAdminParams(filters);
  const queryString = serializeWithdrawParams(params);

  return usePrivateQuery<WithdrawsAdminResponse, any, WithdrawsAdminResponse>(
    [PixwayAPIRoutes.WITHDRAWS_ADMIN, companyId, queryString],
    async () => {
      const response = await axios.get<WithdrawsAdminResponse>(
        `${PixwayAPIRoutes.WITHDRAWS_ADMIN.replace(
          '{companyId}',
          companyId
        )}?${queryString}`
      );
      const data = response.data;
      return { ...data, items: (data?.items ?? []).map(withWithdrawExtras) };
    },
    {
      enabled: Boolean(companyId),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
