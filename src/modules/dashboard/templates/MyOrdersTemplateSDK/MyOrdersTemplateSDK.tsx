import { InternalPagesLayoutBase } from '../../../shared';
import { InternalpageHeaderWithFunds } from '../../../shared/components/InternalPageHeaderWithFunds/InternalPageHeaderWithFunds';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { OrderListComponentSDK } from '../../components';

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
