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
}

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
      axios
        .get<UserWithdrawsResponse>(
          PixwayAPIRoutes.REQUEST_WITHDRAW.replace('{companyId}', companyId),
          { params: { page, limit, status: status ? [...status] : undefined } }
        )
        .then((response) => response.data),
    {
      enabled: Boolean(companyId) && enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
