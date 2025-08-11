import { InternalpageHeaderWithFunds } from "../../shared/components/InternalPageHeaderWithFunds";
import { InternalPagesLayoutBase } from "../../shared/components/InternalPagesLayoutBase";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { usePrivateRoute } from "../../shared/hooks/usePrivateRoute";
import { useRouterConnect } from "../../shared/hooks/useRouterConnect";
import { OrderListComponentSDK } from "../components/OrderListComponentSDK";

const _MyOrdersTemplateSDK = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const router = useRouterConnect();
  const orderId = router?.query?.orderId;
  return isAuthorized && !isLoading ? (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds
          title={`${orderId ? 'Detalhes da compra' : 'Minhas compras'}`}
        />
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
