import { useHasWallet } from "../../shared/hooks/useHasWallet";
import { usePrivateRoute } from "../../shared/hooks/usePrivateRoute";
import { CheckoutContainer } from "../components/CheckoutContainer";
import { CheckoutStatus } from "../components/CheckoutInfo";


interface CheckoutDoneTemplateProps {
  returnTo?: () => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutDoneTemplate = ({
  returnTo,
  productId,
  currencyId,
}: CheckoutDoneTemplateProps) => {
  // const router = useRouterConnect();
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet({});
  return !isAuthorized || isLoading ? null : (
    <>
      {/* <CheckoutHeader
        onClick={returnTo ? returnTo : () => router.push(PixwayAppRoutes.HOME)}
      /> */}
      <CheckoutContainer
        productId={productId}
        currencyId={currencyId}
        returnAction={returnTo}
        checkoutStatus={CheckoutStatus.FINISHED}
      />
    </>
  );
};
