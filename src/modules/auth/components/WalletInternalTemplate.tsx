import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { WalletOverview } from '../../shared/components/wallet/WalletOverview';
import { useHasWallet } from '../../shared/hooks/useHasWallet';
import useTranslation from '../../shared/hooks/useTranslation';
import { TokensListTemplate } from '../../tokens/components/TokensListTemplate';

const _WalletInternalTemplate = () => {
  useHasWallet({});
  const [translate] = useTranslation();

  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <WalletOverview />
      <SectionCard title={translate('connectTokens>tokensList>pageTitle')}>
        <TokensListTemplate withLayout={false} />
      </SectionCard>
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
