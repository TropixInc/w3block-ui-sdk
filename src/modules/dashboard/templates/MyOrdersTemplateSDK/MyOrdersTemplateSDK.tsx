const InternalpageHeaderWithFunds = lazy(() =>
  import(
    '../../../shared/components/InternalPageHeaderWithFunds/InternalPageHeaderWithFunds'
  ).then((mod) => ({ default: mod.InternalpageHeaderWithFunds }))
);
import { lazy } from 'react';

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
const OrderListComponentSDK = lazy(() =>
  import('../../components/OrderListComponentSDK/OrderListComponentSDK').then(
    (mod) => ({ default: mod.OrderListComponentSDK })
  )
);

const _MyOrdersTemplateSDK = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  return isAuthorized && !isLoading ? (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds title="Minhas compras" />
        <OrderListComponentSDK />
      </InternalPagesLayoutBase>
    </div>
  ) : null;
};

export const MyOrdersTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <_MyOrdersTemplateSDK />
    </TranslatableComponent>
  );
};
