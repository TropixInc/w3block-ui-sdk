import { useEffect, useState } from 'react';

import { useGetOrders } from '../../../checkout/hooks/useGetOrders';
import { Pagination } from '../../../shared/components/Pagination';
import { OrderCardComponentSDK } from '../OrderCardComponentSDK/OrderCardComponentSDK';

export const OrderListComponentSDK = () => {
  const [actualPage, setActualPage] = useState(1);
  const { data, refetch } = useGetOrders({ page: actualPage });
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
