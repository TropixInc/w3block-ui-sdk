import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { usePrivateRoute } from '../../shared/hooks/usePrivateRoute';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { OrderListComponentSDK } from '../components/OrderListComponentSDK';

const _MyOrdersTemplateSDK = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const orderId = router?.query?.orderId;
  return isAuthorized && !isLoading ? (
    <InternalPagesLayoutBase>
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={
            orderId
              ? translate('dashboard>myOrders>detailTitle')
              : translate('header>components>defaultTab>myOrders')
          }
          subtitle={
            orderId ? undefined : translate('dashboard>myOrders>subtitle')
          }
          back={
            orderId
              ? {
                  label: translate('header>components>defaultTab>myOrders'),
                  href: router.routerToHref(PixwayAppRoutes.MY_ORDERS),
                }
              : undefined
          }
        />
        <OrderListComponentSDK />
      </div>
    </InternalPagesLayoutBase>
  ) : null;
};

export const MyOrdersTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <_MyOrdersTemplateSDK />
    </TranslatableComponent>
  );
};
