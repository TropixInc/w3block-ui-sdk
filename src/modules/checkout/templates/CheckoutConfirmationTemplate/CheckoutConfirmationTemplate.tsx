import { useProfile } from '../../../shared';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { useQuery } from '../../../shared/hooks/useQuery';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutEmptyCart } from '../../components/CheckoutEmptyCart/CheckoutEmptyCart';
// import { CheckoutHeader } from '../../components/CheckoutHeader';
import { useCart } from '../../hooks/useCart';

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
  const { cart: productsCart } = useCart();
  const query = useQuery();
  const params = new URLSearchParams(query);
  const productIdsFromQueries = params.get('productIds');
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isCommerceReceiver = Boolean(
    userRoles.find((e) => e === 'commerce.orderReceiver')
  );
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }
  return (cart && !productsCart.length) || !productIdsFromQueries ? (
    <>
      {/* <CheckoutHeader onClick={returnTo} /> */}
      <CheckoutEmptyCart />
    </>
  ) : (
    <>
      {/* <CheckoutHeader onClick={returnTo} /> */}
      {isCommerceReceiver ? (
        <div className="pw-w-full pw-h-[63.5vh] pw-flex pw-justify-center pw-items-center pw-font-bold pw-text-2xl pw-text-black">
          Esse usuário não possui permissão para realizar uma compra
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
