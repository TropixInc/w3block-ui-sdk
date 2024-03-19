const CheckoutInfo = lazy(() =>
  import('../CheckoutInfo/CheckoutInfo').then((m) => ({
    default: m.CheckoutInfo,
  }))
);
import { lazy } from 'react';

import { CheckoutStatus } from '../CheckoutInfo';

interface CheckoutContainerProps {
  checkoutStatus: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
  cart?: boolean;
}

export const CheckoutContainer = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
  cart,
}: CheckoutContainerProps) => {
  return (
    <div className="pw-flex pw-flex-col pw-h-full pw-min-h-[72.4vh] pw-px-4 lg:pw-px-0 pw-bg-[#F7F7F7]">
      <div className="pw-container pw-mx-auto pw-h-full lg:pw-flex pw-w-full pw-pt-[0px] sm:pw-pt-[60px] pw-pb-[140px]">
        <div className="pw-w-[100%] lg:pw-w-[80%]">
          <CheckoutInfo
            isCart={cart}
            productId={productId}
            currencyId={currencyId}
            returnAction={returnAction}
            proccedAction={proccedAction}
            checkoutStatus={checkoutStatus}
          />
        </div>
      </div>
    </div>
  );
};
