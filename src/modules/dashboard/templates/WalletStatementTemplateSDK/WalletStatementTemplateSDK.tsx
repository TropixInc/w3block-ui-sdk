import { useMemo, useState } from 'react';

import { InternalPagesLayoutBase } from '../../../shared';
import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { Pagination } from '../../../shared/components/Pagination';
import { StatementComponentSDK } from '../../../shared/components/StatementComponentSDK/StatementComponentSDK';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { generateRandomUUID } from '../../../shared/utils/generateRamdomUUID';
import { useGetErcTokensHistory } from '../../hooks/useGetErcTokensHistory';

export const WalletStatementTemplateSDK = () => {
  const { wallets, loyaltyWallet, mainWallet } = useUserWallet();
  const [actualPage, setActualPage] = useState(1);
  const { data } = useGetErcTokensHistory(
    loyaltyWallet.length ? loyaltyWallet[0].contractId : undefined,
    { page: actualPage }
  );

  const loyaltyWalletDefined = useMemo(() => {
    return loyaltyWallet.length ? loyaltyWallet[0] : undefined;
  }, [loyaltyWallet]);

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });
  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
        <div className="pw-flex pw-justify-between">
          <div>
            <p className="pw-text-[23px] pw-font-[600]">Extrato</p>
            <p className="pw-text-[#777E8F] pw-text-xs">
              {mainWallet?.address}
            </p>
            {loyaltyWalletDefined ? (
              <div className="pw-mt-[14px]">
                <p className="pw-text-black pw-text-lg pw-font-medium pw-leading-[23px]">
                  {loyaltyWalletDefined.currency}
                </p>
                <CriptoValueComponent
                  crypto={true}
                  value={loyaltyWalletDefined.balance}
                  pointsPrecision={loyaltyWalletDefined.pointsPrecision}
                  code={''}
                  fontClass="pw-text-black pw-text-lg pw-font-bold pw-leading-[23px]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="pw-mt-[20px] pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-[20px]">
        {data?.items.map((item: any) => (
          <StatementComponentSDK
            key={generateRandomUUID()}
            statement={{
              pointsPrecision:
                loyaltyWalletDefined?.pointsPrecision ?? 'integer',
              id: item.id,
              createdAt: new Date(item.createdAt),
              type: item.type,
              status: item.status,
              loyaltieTransactions: item.loyaltiesTransactions,
              amount: parseFloat(item.request.amount),
              description: '',
              currency: loyaltyWallet.length ? loyaltyWallet[0].currency : '',
              transactionType: wallets?.some(
                (wallet) => wallet.address == item.request.to
              )
                ? 'receiving'
                : 'sending',
            }}
          />
        ))}
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
