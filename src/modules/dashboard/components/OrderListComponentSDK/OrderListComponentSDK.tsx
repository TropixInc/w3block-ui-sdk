/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useState } from 'react';

import { useGetEspecificOrder } from '../../../checkout/hooks/useGetEspecificOrder';
import { useGetOrders } from '../../../checkout/hooks/useGetOrders';
import { useRouterConnect } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import useTranslation from '../../../shared/hooks/useTranslation';
const Pagination = lazy(() =>
  import('../../../shared/components/Pagination').then((mod) => ({
    default: mod.Pagination,
  }))
);

const OrderCardComponentSDK = lazy(() =>
  import('../OrderCardComponentSDK/OrderCardComponentSDK').then((mod) => ({
    default: mod.OrderCardComponentSDK,
  }))
);

export const OrderListComponentSDK = () => {
  const [actualPage, setActualPage] = useState(1);
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const orderId = router?.query?.orderId;
  const { data, refetch } = useGetOrders({
    page: actualPage,
  });
  const { data: order } = useGetEspecificOrder(orderId as string, !!orderId);
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPage]);
  const orders = data?.data?.items ?? [];
  return (
    <div className="pw-mt-7 pw-px-4">
      <div className="pw-gap-6 pw-flex pw-flex-col">
        {orderId ? (
          <OrderCardComponentSDK
            status={order?.data?.status}
            id={order?.data?.id}
            createdAt={order?.data?.createdAt}
            expiresIn={order?.data?.expiresIn}
            paymentProvider={order?.data?.paymentProvider}
            productsRes={order?.data?.products}
            deliverId={order?.data?.deliverId}
            startOpened
          />
        ) : (
          <>
            {!orders.length && (
              <Alert variant="information">
                {translate('dashboard>OrderListComponentSDK>orderNotFound')}
              </Alert>
            )}
            {orders.map((order: any) => (
              <OrderCardComponentSDK
                status={order.status}
                id={order.id}
                key={order.id}
                createdAt={order.createdAt}
                expiresIn={order.expiresIn}
                paymentProvider={order.paymentProvider}
                productsRes={order.products}
                deliverId={order?.deliverId}
              />
            ))}
            {orders.length ? (
              <Pagination
                pagesQuantity={data?.data.meta.totalPages ?? 1}
                currentPage={actualPage}
                onChangePage={(n) => {
                  setActualPage(n);
                }}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
