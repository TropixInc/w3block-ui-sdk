import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { WithdrawStatus } from '../../shared/utils/withdrawStatus';

export interface UserWithdraw {
  id: string;
  amount: string;
  status: WithdrawStatus;
  createdAt: string;
  updatedAt?: string;
  reason?: string | null;
  receiptAsset?: { directLink?: string } | null;
}

export interface UserWithdrawsResponse {
  items: UserWithdraw[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    itemCount: number;
  };
  /**
   * `false` when the API rejected `status[]` and the list came back
   * unfiltered; callers then filter the page on the client.
   */
  filteredByServer?: boolean;
}

/**
 * GETs a withdraw list. Older Key API versions answer 400 to `status[]`;
 * in that case the same page is fetched without the filter and flagged.
 */
export const fetchWithdrawList = async <T extends UserWithdrawsResponse>(
  axios: {
    get: (
      url: string,
      config: { params: Record<string, unknown> }
    ) => Promise<{ data: T }>;
  },
  url: string,
  params: Record<string, unknown>,
  status?: ReadonlyArray<WithdrawStatus>
): Promise<T> => {
  if (!status?.length) {
    const { data } = await axios.get(url, { params });
    return { ...data, filteredByServer: true };
  }
  try {
    const { data } = await axios.get(url, {
      params: { ...params, status: [...status] },
    });
    return { ...data, filteredByServer: true };
  } catch (error) {
    const code = (error as { response?: { status?: number } })?.response
      ?.status;
    if (code !== 400) throw error;
    const { data } = await axios.get(url, { params });
    return { ...data, filteredByServer: false };
  }
};

interface Params {
  page?: number;
  limit?: number;
  status?: ReadonlyArray<WithdrawStatus>;
  enabled?: boolean;
}

/** The logged-in user's own withdraws (`GET /{companyId}/withdraws`). */
export const useGetUserWithdraws = ({
  page = 1,
  limit = 10,
  status,
  enabled = true,
}: Params = {}) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.REQUEST_WITHDRAW,
      'list',
      companyId,
      page,
      limit,
      status ? status.join(',') : '',
    ],
    () =>
      fetchWithdrawList<UserWithdrawsResponse>(
        axios,
        PixwayAPIRoutes.REQUEST_WITHDRAW.replace('{companyId}', companyId),
        { page, limit },
        status
      ),
    {
      enabled: Boolean(companyId) && enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
