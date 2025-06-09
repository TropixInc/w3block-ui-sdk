import { useTranslation } from "react-i18next";
import { useHasWallet } from "../../shared/hooks/useHasWallet";
import { usePrivateRoute } from "../../shared/hooks/usePrivateRoute";
import { useProfile } from "../../shared/hooks/useProfile";
import { useRouterConnect } from "../../shared/hooks/useRouterConnect";
import { CheckoutCompletePayment } from "../components/CheckoutCompletePayment";
import { CheckoutStatus } from "../components/CheckoutInfo";


export const CheckoutCompleteOrderTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const orderId = router?.query?.orderId as string;
  const status =
    (router?.query?.checkoutStatus as CheckoutStatus) ??
    CheckoutStatus.CONFIRMATION;
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isCommerceReceiver = Boolean(
    userRoles.find((e: string) => e === 'commerce.orderReceiver')
  );
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }

  return (
    <>
      {isCommerceReceiver ? (
        <div className="pw-w-full pw-h-[63.5vh] pw-flex pw-justify-center pw-items-center pw-font-bold pw-text-2xl pw-text-black">
          {translate('checkout>checkoutConfirmationTemplate>userCantPurchase')}
        </div>
      ) : (
        <div className="pw-flex pw-flex-col pw-h-full pw-min-h-[72.4vh] pw-px-4 lg:pw-px-0 pw-bg-[#F7F7F7]">
          <div className="pw-container pw-mx-auto pw-h-full lg:pw-flex pw-w-full pw-pt-[0px] sm:pw-pt-[60px] pw-pb-[140px]">
            <div className="pw-w-[100%] lg:pw-w-[80%]">
              <CheckoutCompletePayment
                orderDataId={orderId}
                checkoutStatus={status}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
