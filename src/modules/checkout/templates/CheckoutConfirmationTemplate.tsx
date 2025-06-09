import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHasWallet } from '../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../shared/hooks/usePrivateRoute';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { CheckoutContainer } from '../components/CheckoutContainer';
import { CheckoutEmptyCart } from '../components/CheckoutEmptyCart';
import { CheckoutStatus } from '../components/CheckoutInfo';
import { useCart } from '../hooks/useCart';



interface CheckoutConfirmationTemplateProps {
  returnTo?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
  cart?: boolean;
}

export const CheckoutConfirmationTemplate = ({
  returnTo,
  proccedAction,
  productId,
  currencyId,
  cart,
}: CheckoutConfirmationTemplateProps) => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const [translate] = useTranslation();
  const { cart: productsCart } = useCart();
  const router = useRouterConnect();
  const productIdsFromQueries = useMemo(() => {
    if (router?.query?.productIds) return router?.query?.productIds;
    else return '';
  }, [router?.query?.productIds]);
  const isEmpty = !productIdsFromQueries;
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isCommerceReceiver = Boolean(
    userRoles.find((e: string) => e === 'commerce.orderReceiver')
  );
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }
  return (cart && !productsCart.length) || isEmpty ? (
    <>
      {/* <CheckoutHeader onClick={returnTo} /> */}
      <CheckoutEmptyCart />
    </>
  ) : (
    <>
      {/* <CheckoutHeader onClick={returnTo} /> */}
      {isCommerceReceiver ? (
        <div className="pw-w-full pw-h-[63.5vh] pw-flex pw-justify-center pw-items-center pw-font-bold pw-text-2xl pw-text-black">
          {translate('checkout>checkoutConfirmationTemplate>userCantPurchase')}
        </div>
      ) : (
        <CheckoutContainer
          cart={cart}
          productId={productId}
          currencyId={currencyId}
          proccedAction={proccedAction}
          returnAction={returnTo}
          checkoutStatus={CheckoutStatus.CONFIRMATION}
        />
      )}
    </>
  );
};
