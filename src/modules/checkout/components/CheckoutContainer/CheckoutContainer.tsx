import { CheckoutInfo, CheckoutStatus } from '../CheckoutInfo';

interface CheckoutContainerProps {
  checkoutStatus: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutContainer = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutContainerProps) => {
  return (
    <div className="pw-flex pw-flex-col pw-h-full">
      <div className="pw-container pw-mx-auto pw-h-full lg:pw-flex pw-w-full pw-pt-[60px] pw-pb-[140px]">
        <div className="pw-w-[100%] lg:pw-w-[60%]">
          <CheckoutInfo
            productId={productId}
            currencyId={currencyId}
            returnAction={returnAction}
            proccedAction={proccedAction}
            checkoutStatus={checkoutStatus}
          />
        </div>
        <div className="pw-h-[370px] pw-w-[2px] pw-bg-[#DCDCDC] pw-hidden lg:pw-block"></div>
        <div className="flex-1 pw-mt-[180px] lg:pw-mt-0">container 2</div>
      </div>
    </div>
  );
};
