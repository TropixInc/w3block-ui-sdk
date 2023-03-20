import { InternalPagesLayoutBase } from '../../../shared';
import { InternalpageHeaderWithFunds } from '../../../shared/components/InternalPageHeaderWithFunds/InternalPageHeaderWithFunds';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { OrderListComponentSDK } from '../../components';

const _MyOrdersTemplateSDK = () => {
  return (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds title="Minhas compras" />
        <OrderListComponentSDK />
      </InternalPagesLayoutBase>
    </div>
  );
};

export const MyOrdersTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <_MyOrdersTemplateSDK />
    </TranslatableComponent>
  );
};
