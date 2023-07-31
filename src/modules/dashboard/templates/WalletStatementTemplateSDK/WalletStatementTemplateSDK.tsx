import { InternalPagesLayoutBase } from '../../../shared';
import { StatementComponentSDK } from '../../../shared/components/StatementComponentSDK/StatementComponentSDK';
import { WalletFilterSDK } from '../../../shared/components/WalletFilterSDK/WalletFilterSDK';
import { WalletHeaderSDK } from '../../../shared/components/WalletHeaderSDK';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { StatementStatusType } from '../../../shared/interface/Statement/Statement';

export const WalletStatementTemplateSDK = () => {
  const { wallets } = useUserWallet();
  return (
    <InternalPagesLayoutBase>
      <WalletHeaderSDK />
      <WalletFilterSDK className="pw-mt-4" wallets={wallets ?? []} />
      <div className="pw-mt-[20px] pw-flex pw-flex-col pw-gap-[20px]">
        <StatementComponentSDK
          statement={{
            id: '1',
            createdAt: new Date(),
            type: StatementStatusType.APPROVED,
            amount: 10,
            description: 'Teste',
          }}
        />
      </div>
    </InternalPagesLayoutBase>
  );
};
