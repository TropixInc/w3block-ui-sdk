import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { AddFundsChoosePaymentContainer } from '../components/AddFundsChoosePaymentContainer';

const _AddFundsTypeChooseTemplateSDK = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('wallet>page>addFunds')}
        subtitle={translate('addFunds>type>subtitle')}
        back={{
          label: translate('components>menu>wallet'),
          href: router.routerToHref(PixwayAppRoutes.WALLET),
        }}
      />
      <AddFundsChoosePaymentContainer />
    </div>
  );
};

/**
 * Lives inside the internal layout now (menu + drawer), like the other
 * wallet pages; the FAQ block that came empty for the tenant is gone.
 */
export const AddFundsTypeChooseTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <_AddFundsTypeChooseTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
