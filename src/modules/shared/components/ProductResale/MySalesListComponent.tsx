/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useGetUserResales,
  UserResaleResponse,
} from '../../hooks/useGetUserResales';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { Spinner } from '../Spinner';
import { MySalesCardComponent, OrderStatusEnum } from './MySalesCardComponent';

export const MySalesListComponent = () => {
  const { data, isFetching } = useGetUserResales();
  const [translate] = useTranslation();
  if (isFetching) {
    return (
      <div className="pw-flex pw-justify-center pw-items-center pw-mt-7 sm:pw-px-4 pw-px-0">
        <div className="pw-gap-6 pw-flex pw-flex-col">
          <Spinner className="pw-w-10 pw-h-10" />
        </div>
      </div>
    );
  }
  if (data?.data?.items.length) {
    return (
      <div className="sm:pw-px-4 pw-px-0">
        <div className="pw-gap-6 pw-flex pw-flex-col">
          {(data?.data as UserResaleResponse)?.items?.map((res) => {
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
          })}
        </div>
      </div>
    );
  } else {
    return (
      <Alert variant="information">
        {translate('dashboard>MySalesListComponent>salesNotFound')}
      </Alert>
    );
  }
};
