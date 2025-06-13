/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useState } from 'react';


import { useGetEspecificOrder } from '../../checkout/hooks/useGetEspecificOrder';
import { useGetOrders } from '../../checkout/hooks/useGetOrders';
import { Alert } from '../../shared/components/Alert';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { OrderCardComponentSDK } from './OrderCardComponentSDK';
import { Pagination } from '../../shared/components/Pagination';
import useTranslation from '../../shared/hooks/useTranslation';



export const OrderListComponentSDK = () => {
  const [actualPage, setActualPage] = useState(1);
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const orderId = router?.query?.orderId;
  const {
    data,
    refetch,
    error: errorOrders,
  } = useGetOrders({
    page: actualPage,
  });
  const { data: order, error: errorOrder } = useGetEspecificOrder(
    orderId as string,
    !!orderId
  );
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPage]);
  const orders = data?.items ?? [];
  return (
    <div className="pw-mt-7 pw-px-4">
      <div className="pw-gap-6 pw-flex pw-flex-col">
        {orderId ? (
          errorOrder ? (
            <ErrorBox customError={errorOrder} />
          ) : (
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
          )
        ) : errorOrders ? (
          <ErrorBox customError={errorOrders} />
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
                pagesQuantity={data?.meta?.totalPages ?? 1}
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
