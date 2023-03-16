import { InternalPagesLayoutBase } from '../../../shared';
import { InternalpageHeaderWithFunds } from '../../../shared/components/InternalPageHeaderWithFunds/InternalPageHeaderWithFunds';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';

const _MyOrdersTemplateSDK = () => {
  return (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds title="Minhas compras" />
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
