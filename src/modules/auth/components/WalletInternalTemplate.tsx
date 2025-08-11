import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { useHasWallet } from '../../shared/hooks/useHasWallet';
import { WalletHeaderSDK } from '../../shared/components/WalletHeaderSDK';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import { TokensListTemplate } from '../../tokens/components/TokensListTemplate';


const _WalletInternalTemplate = () => {
  useHasWallet({});

  return (
    <div className="pw-flex pw-flex-col pw-px-4 sm:pw-px-0">
      <WalletHeaderSDK />
      <div className="pw-mt-6">
        <TokensListTemplate withLayout={false} />
      </div>
    </div>
  );
};

export const WalletInternalTemplate = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WalletInternalTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
