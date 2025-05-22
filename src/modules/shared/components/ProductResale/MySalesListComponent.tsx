/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserResales } from '../../hooks/useGetUserResales/useGetUserResales';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { Spinner } from '../Spinner';
import { MySalesCardComponent, OrderStatusEnum } from './MySalesCardComponent';

export const MySalesListComponent = () => {
  const { data, isLoading } = useGetUserResales();
  const [translate] = useTranslation();
  return (
    <div className="pw-mt-7 sm:pw-px-4 pw-px-0">
      <div className="pw-gap-6 pw-flex pw-flex-col">
        {isLoading ? (
          <Spinner className="pw-w-5 pw-h-5" />
        ) : data?.data?.items.length ? (
          data?.data?.items?.map((res) => {
            return (
              <MySalesCardComponent
                key={res?.id}
                status={OrderStatusEnum.CONCLUDED}
                id={res?.id}
                createdAt={res?.createdAt}
                paymentProvider="asaas"
                productsRes={res?.product}
                deliverId={res?.order?.deliverId}
                quantity={res?.itemQuantity}
                price={res?.customPrices?.[0]?.amount}
                receipts={res?.receipts?.[0]}
              />
            );
          })
        ) : (
          <Alert variant="information">
            {translate('dashboard>MySalesListComponent>salesNotFound')}
          </Alert>
        )}
      </div>
    </div>
  );
};
