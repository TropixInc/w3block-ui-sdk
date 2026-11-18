import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { WithdrawStatus } from '../../shared/utils/withdrawStatus';
import {
  fetchWithdrawList,
  UserWithdrawsResponse,
  UserWithdraw,
} from './useGetUserWithdraws';

export interface AdminWithdraw extends UserWithdraw {
  currency?: string;
  userId?: string;
  user?: { id?: string; name?: string | null; email?: string | null } | null;
}

export interface AdminWithdrawsResponse extends UserWithdrawsResponse {
  items: AdminWithdraw[];
}

interface Params {
  page?: number;
  limit?: number;
  status?: ReadonlyArray<WithdrawStatus>;
  enabled?: boolean;
}

/**
 * Tenant-wide withdraw list for admins (`GET /{companyId}/withdraws/admin`).
 * Same shape as the user list plus the requesting `user`.
 */
export const useGetAdminWithdraws = ({
  page = 1,
  limit = 10,
  status,
  enabled = true,
}: Params = {}) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.WITHDRAWS_ADMIN,
      'list',
      companyId,
      page,
      limit,
      status ? status.join(',') : '',
    ],
    () =>
      fetchWithdrawList<AdminWithdrawsResponse>(
        axios,
        PixwayAPIRoutes.WITHDRAWS_ADMIN.replace('{companyId}', companyId),
        { page, limit, sortBy: 'createdAt', orderBy: 'DESC' },
        status
      ),
    {
      enabled: Boolean(companyId) && enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

/**
 * Counts the items of a page that match `predicate`. When the API applied the
 * status filter (every returned item matches) the server total is used, so
 * the number covers all pages; otherwise only the loaded page is counted.
 */
export const countMatching = (
  data: AdminWithdrawsResponse | undefined,
  predicate: (item: AdminWithdraw) => boolean
) => {
  const items = data?.items ?? [];
  if (!items.length) return 0;
  const matching = items.filter(predicate);
  const serverApplied =
    data?.filteredByServer !== false && matching.length === items.length;
  return serverApplied
    ? data?.meta?.totalItems ?? matching.length
    : matching.length;
};
