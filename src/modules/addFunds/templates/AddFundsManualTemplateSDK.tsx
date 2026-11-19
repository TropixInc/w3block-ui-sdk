import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { AddFundsManualContainer } from '../components/AddFundsManualContainer';

const _AddFundsManualTemplateSDK = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  return (
    <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
      <PageHeader
        title={translate('addFunds>type>manualType')}
        subtitle={translate('addFunds>type>manualDescription')}
        back={{
          label: translate('wallet>page>addFunds'),
          href: router.routerToHref(PixwayAppRoutes.ADD_FUNDS_TYPE),
        }}
      />
      <AddFundsManualContainer />
    </div>
  );
};

/**
 * Same chrome as the add-funds type page: internal layout (menu + drawer)
 * instead of the checkout header and the FAQ column.
 */
export const AddFundsManualTemplateSDK = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_AddFundsManualTemplateSDK />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
