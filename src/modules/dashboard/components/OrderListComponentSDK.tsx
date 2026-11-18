/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { useGetEspecificOrder } from '../../checkout/hooks/useGetEspecificOrder';
import { useGetOrders } from '../../checkout/hooks/useGetOrders';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { Pagination } from '../../shared/components/Pagination';
import Skeleton from '../../shared/components/Skeleton';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { FilterBar } from '../../shared/components/ui/FilterBar';
import { SegmentedControl } from '../../shared/components/ui/SegmentedControl';
import { UI } from '../../shared/components/ui/tokens';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import {
  OrderCardComponentSDK,
  ORDER_IN_PROGRESS_STATUSES,
  OrderStatusEnum,
} from './OrderCardComponentSDK';

type Filter = 'all' | 'in_progress' | 'concluded';

const orderTitle = (order: any): string | undefined =>
  order?.destinationUser?.name ||
  order?.products?.[0]?.productToken?.product?.name ||
  undefined;

const orderProps = (order: any) => ({
  status: order?.status,
  id: order?.id,
  createdAt: order?.createdAt,
  expiresIn: order?.expiresIn,
  paymentProvider: order?.paymentProvider,
  paymentMethod:
    typeof order?.paymentMethod === 'string'
      ? order.paymentMethod
      : order?.payments?.[0]?.paymentMethod,
  productsRes: order?.products,
  deliverId: order?.deliverId,
  title: orderTitle(order),
  totalAmount:
    typeof order?.totalAmount === 'string'
      ? order.totalAmount
      : order?.currencyAmount && typeof order.currencyAmount === 'string'
      ? order.currencyAmount
      : undefined,
  currencySymbol:
    order?.currency?.symbol ?? order?.payments?.[0]?.currency?.symbol,
});

export const OrderListComponentSDK = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const orderId = router?.query?.orderId;

  const status =
    filter === 'in_progress'
      ? ORDER_IN_PROGRESS_STATUSES
      : filter === 'concluded'
      ? [OrderStatusEnum.CONCLUDED]
      : undefined;

  const {
    data,
    isLoading,
    error: errorOrders,
  } = useGetOrders({ page, status });
  const { data: order, error: errorOrder } = useGetEspecificOrder(
    orderId as string,
    !!orderId
  );

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  const orders: any[] = (data?.items ?? []).filter((o: any) =>
    filter === 'all'
      ? true
      : filter === 'in_progress'
      ? ORDER_IN_PROGRESS_STATUSES.includes(o?.status)
      : o?.status === OrderStatusEnum.CONCLUDED
  );
  const totalPages = data?.meta?.totalPages ?? 1;

  if (orderId) {
    return errorOrder ? (
      <ErrorBox customError={errorOrder} />
    ) : order?.data ? (
      <OrderCardComponentSDK {...orderProps(order.data)} startOpened />
    ) : (
      <div className={`${UI.card} pw-p-4 pw-grid pw-gap-3`}>
        <Skeleton className="pw-h-4 pw-w-1/3 pw-rounded" />
        <Skeleton className="pw-h-3 pw-w-1/2 pw-rounded" />
        <Skeleton className="pw-h-16 pw-w-full pw-rounded" />
      </div>
    );
  }

  if (errorOrders) return <ErrorBox customError={errorOrders} />;

  return (
    <div className="pw-flex pw-flex-col pw-gap-3">
      <FilterBar>
        <SegmentedControl<Filter>
          ariaLabel={translate('token>pass>status')}
          value={filter}
          onChange={changeFilter}
          options={[
            { value: 'all', label: translate('dashboard>myOrders>filterAll') },
            {
              value: 'in_progress',
              label: translate('dashboard>myOrders>filterInProgress'),
            },
            {
              value: 'concluded',
              label: translate('dashboard>myOrders>filterConcluded'),
            },
          ]}
        />
      </FilterBar>
      {isLoading && !data ? (
        <div className="pw-grid pw-gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${UI.card} pw-p-4 pw-grid pw-gap-2`}>
              <Skeleton className="pw-h-4 pw-w-1/3 pw-rounded" />
              <Skeleton className="pw-h-3 pw-w-1/2 pw-rounded" />
            </div>
          ))}
        </div>
      ) : !orders.length ? (
        <EmptyState
          title={
            filter === 'all'
              ? translate('dashboard>OrderListComponentSDK>orderNotFound')
              : translate('dashboard>myOrders>emptyFiltered')
          }
          description={
            filter === 'all'
              ? translate('dashboard>myOrders>emptyDescription')
              : undefined
          }
          action={
            filter === 'all' ? (
              <a href={router.routerToHref('/')} className={UI.buttonSecondary}>
                {translate('dashboard>myOrders>goShopping')}
              </a>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="pw-grid pw-gap-3">
            {orders.map((o: any) => (
              <OrderCardComponentSDK key={o.id} {...orderProps(o)} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="pw-flex pw-justify-end">
              <Pagination
                pagesQuantity={totalPages}
                currentPage={page}
                onChangePage={setPage}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
