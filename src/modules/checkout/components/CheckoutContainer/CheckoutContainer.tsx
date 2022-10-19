import { FAQ } from '../../../shared/components/FAQ';
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
    <div className="pw-flex pw-flex-col pw-h-full pw-px-4 lg:pw-px-0">
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
        <div className="lg:pw-h-[370px] lg:pw-w-[2px] pw-w-full pw-h-[2px] pw-bg-[#DCDCDC] pw-mt-[24px] lg:pw-mt-0" />
        <div className="flex-  pw-mt-[24px] lg:pw-mt-0">
          <FAQ
            name={
              checkoutStatus === CheckoutStatus.FINISHED
                ? 'post_sale'
                : 'pre_sale'
            }
          />
        </div>
      </div>
    </div>
  );
};
