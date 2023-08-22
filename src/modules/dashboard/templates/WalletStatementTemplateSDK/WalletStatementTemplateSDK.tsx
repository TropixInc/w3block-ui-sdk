import { useState } from 'react';

import { InternalPagesLayoutBase } from '../../../shared';
import { Pagination } from '../../../shared/components/Pagination';
import { StatementComponentSDK } from '../../../shared/components/StatementComponentSDK/StatementComponentSDK';
import { WalletFilterSDK } from '../../../shared/components/WalletFilterSDK/WalletFilterSDK';
import { WalletHeaderSDK } from '../../../shared/components/WalletHeaderSDK';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { generateRandomUUID } from '../../../shared/utils/generateRamdomUUID';
import { useGetErcTokensHistory } from '../../hooks/useGetErcTokensHistory';

export const WalletStatementTemplateSDK = () => {
  const { wallets, loyaltyWallet } = useUserWallet();
  const [actualPage, setActualPage] = useState(1);
  const { data } = useGetErcTokensHistory(
    loyaltyWallet.length ? loyaltyWallet[0].contractId : undefined,
    { page: actualPage }
  );
  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });
  return (
    <InternalPagesLayoutBase>
      <WalletHeaderSDK />
      <WalletFilterSDK className="pw-mt-4" wallets={loyaltyWallet ?? []} />
      <div className="pw-mt-[20px] pw-flex pw-flex-col pw-gap-[20px]">
        {data?.items.map((item) => (
          <StatementComponentSDK
            key={generateRandomUUID()}
            statement={{
              id: item.id,
              createdAt: new Date(item.createdAt),
              type: item.type,
              status: item.status,
              loyaltieTransactions: item.loyaltiesTransactions,
              amount: parseInt(item.request.amount),
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
        <div className="pw-mt-4">
          <Pagination
            pagesQuantity={data?.meta.totalPages ?? 0}
            currentPage={actualPage}
            onChangePage={setActualPage}
          />
        </div>
      </div>
    </InternalPagesLayoutBase>
  );
};
