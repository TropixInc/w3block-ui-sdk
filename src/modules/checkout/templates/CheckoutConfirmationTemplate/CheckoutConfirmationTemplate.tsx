import { useLocalStorage } from 'react-use';

import { useProfile, useRouterConnect } from '../../../shared';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutEmptyCart } from '../../components/CheckoutEmptyCart/CheckoutEmptyCart';
// import { CheckoutHeader } from '../../components/CheckoutHeader';
import { PRODUCT_IDS_INFO_KEY } from '../../config/keys/localStorageKey';
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
  const { query } = useRouterConnect();
  const isCoinPayment = query.coinPayment?.includes('true') ? true : false;
  const productIdsFromQueries = query.productIds;
  const [productIds] = useLocalStorage<string[] | undefined>(
    PRODUCT_IDS_INFO_KEY
  );
  const isEmpty = isCoinPayment ? !productIdsFromQueries : !productIds;
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isCommerceReceiver = Boolean(
    userRoles.find((e) => e === 'commerce.orderReceiver')
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
