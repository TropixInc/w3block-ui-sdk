/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useState } from 'react';

import { useGetOrders } from '../../../checkout/hooks/useGetOrders';
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
  const { data, refetch } = useGetOrders({
    page: actualPage,
    search: 'a2101ec6-f297-4ea3-9d05-e15de23d3f51',
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPage]);
  const orders = data?.data?.items ?? [];
  return (
    <div className="pw-mt-7 pw-px-4">
      <div className="pw-gap-6 pw-flex pw-flex-col">
        {orders.map((order: any) => (
          <OrderCardComponentSDK
            status={order.status}
            id={order.id}
            key={order.id}
            createdAt={order.createdAt}
            expiresIn={order.expiresIn}
            paymentProvider={order.paymentProvider}
            productsRes={order.products}
          />
        ))}
        <Pagination
          pagesQuantity={data?.data.meta.totalPages ?? 1}
          currentPage={actualPage}
          onChangePage={(n) => {
            setActualPage(n);
          }}
        />
      </div>
    </div>
  );
};
