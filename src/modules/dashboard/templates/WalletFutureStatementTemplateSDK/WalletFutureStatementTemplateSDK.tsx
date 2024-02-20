import { useMemo, useState, lazy } from 'react';

import { useGetDeferredByUserId } from '../../../business/hooks/useGetDeferredByUserId';
import { useProfile } from '../../../shared';
import { Spinner } from '../../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { generateRandomUUID } from '../../../shared/utils/generateRamdomUUID';

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);

const Pagination = lazy(() =>
  import('../../../shared/components/Pagination').then((mod) => ({
    default: mod.Pagination,
  }))
);

const StatementComponentSDK = lazy(() =>
  import(
    '../../../shared/components/StatementComponentSDK/StatementComponentSDK'
  ).then((mod) => ({
    default: mod.StatementComponentSDK,
  }))
);

export const WalletFutureStatementTemplateSDK = () => {
  const { wallets, loyaltyWallet } = useUserWallet();
  const [actualPage, setActualPage] = useState(1);
  const { data: profile } = useProfile();

  const loyaltyWalletDefined = useMemo(() => {
    return loyaltyWallet.length ? loyaltyWallet[0] : undefined;
  }, [loyaltyWallet]);

  const { data, isLoading } = useGetDeferredByUserId(
    profile?.data?.id ?? '',
    {
      page: actualPage,
      sortBy: 'createdAt',
      orderBy: 'DESC',
      loyaltyId: loyaltyWalletDefined?.loyaltyId,
    },
    !!loyaltyWalletDefined
  );

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });
  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
        <p className="pw-text-[23px] pw-font-[600]">Recebimentos futuros</p>
      </div>
      <div className="pw-mt-[20px] pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-[20px]">
        {isLoading ? (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            <Spinner className="pw-h-10 pw-w-10" />
          </div>
        ) : data?.items?.length ? (
          data?.items.map((item: any) => (
            <StatementComponentSDK
              future
              key={generateRandomUUID()}
              statement={{
                deliverId: item?.metadata?.deliverId ?? '',
                buyerName: item?.metadata?.buyerName ?? '',
                buyerEmail: item?.metadata?.buyerEmail ?? '',
                executeAt: item?.executeAt ?? '',
                pointsPrecision:
                  loyaltyWalletDefined?.pointsPrecision ?? 'integer',
                id: item?.id,
                createdAt: new Date(item?.createdAt),
                type: item?.type,
                status: item?.status,
                loyaltieTransactions: item?.loyaltiesTransactions,
                amount: parseFloat(item?.request?.amount ?? item?.amount),
                description: '',
                currency: loyaltyWallet?.length
                  ? loyaltyWallet[0]?.currency
                  : '',
                transactionType: wallets?.some(
                  (wallet) =>
                    wallet?.address == (item?.request?.to ?? item?.toAddress)
                )
                  ? 'receiving'
                  : 'sending',
              }}
            />
          ))
        ) : (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            Nenhum lançamento futuro
          </div>
        )}
        {data?.meta && data?.meta?.totalPages > 1 ? (
          <div className="pw-mt-4">
            <Pagination
              pagesQuantity={data?.meta.totalPages ?? 0}
              currentPage={actualPage}
              onChangePage={setActualPage}
            />
          </div>
        ) : null}
      </div>
    </InternalPagesLayoutBase>
  );
};
