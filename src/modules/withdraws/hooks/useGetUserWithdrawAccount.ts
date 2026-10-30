/* eslint-disable @typescript-eslint/no-explicit-any */
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import {
  QueryConfig,
  usePrivateQuery,
} from '../../shared/hooks/usePrivateQuery';
import { WithdrawAccount } from '../interfaces';

/** Contas de recebimento de um usuário (Identity: `/users/{tenantId}/withdraw-accounts/{userId}`). */
export const useGetUserWithdrawAccounts = (
  userId: string,
  options?: QueryConfig<WithdrawAccount[], any, WithdrawAccount[]>
) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery<WithdrawAccount[], any, WithdrawAccount[]>(
    [PixwayAPIRoutes.WITHDRAWS_METHODS, tenantId, userId],
    async () => {
      const response = await axios.get(
        PixwayAPIRoutes.WITHDRAWS_METHODS.replace(
          '{tenantId}',
          tenantId
        ).replace('{userId}', userId)
      );
      const data = response.data;
      return (
        Array.isArray(data) ? data : data?.items ?? []
      ) as WithdrawAccount[];
    },
    {
      enabled: Boolean(userId) && Boolean(tenantId),
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      ...options,
    }
  );
};

/** A conta de destino de um saque (pelo `withdrawAccountId`). */
export const useGetUserWithdrawAccount = (
  userId: string,
  withdrawAccountId?: string | null
) => {
  const query = useGetUserWithdrawAccounts(userId, {
    enabled: Boolean(userId) && Boolean(withdrawAccountId),
  });
  const account = (query.data ?? []).find(
    (item) => item.id?.toLowerCase() === (withdrawAccountId ?? '').toLowerCase()
  );
  return { ...query, account };
};

/** Texto curto da conta: "Pix · CPF 123…" ou "Banco 033 · ag 1234 · cc 56789-0". */
export const describeWithdrawAccount = (
  account?: WithdrawAccount,
  pixLabel = 'Pix',
  bankLabel = 'Banco'
) => {
  if (!account) return '';
  const info = account.accountInfo ?? {};
  if (account.type === 'pix') {
    return [
      pixLabel,
      info.keyType
        ? `${String(info.keyType).toUpperCase()} ${info.key ?? ''}`
        : info.key,
      info.ownerName,
    ]
      .filter(Boolean)
      .join(' · ');
  }
  return [
    `${bankLabel} ${info.bank ?? info.bankCode ?? ''}`.trim(),
    info.agency ? `ag ${info.agency}` : undefined,
    info.accountNumber
      ? `cc ${info.accountNumber}${
          info.verificationNumber ? `-${info.verificationNumber}` : ''
        }`
      : undefined,
    info.ownerName,
  ]
    .filter(Boolean)
    .join(' · ');
};
