import { useTranslation } from 'react-i18next';

import { useProfile } from '../../../shared';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { useQuery } from '../../../shared/hooks/useQuery';
import { CheckoutEmptyCart } from '../../components/CheckoutEmptyCart/CheckoutEmptyCart';
import { CheckoutForm } from '../../components/CheckoutForm';
import { useCart } from '../../hooks/useCart';

interface CheckoutFormTemplateProps {
  productId?: string[];
  currencyId?: string;
  cart?: boolean;
}

export const CheckoutFormTemplate = ({
  productId,
  currencyId,
  cart,
}: CheckoutFormTemplateProps) => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const [translate] = useTranslation();
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
          {translate('checkout>checkoutConfirmationTemplate>userCantPurchase')}
        </div>
      ) : (
        <div className="pw-flex pw-flex-col pw-h-full pw-min-h-[72.4vh] pw-px-4 lg:pw-px-0 pw-bg-[#F7F7F7]">
          <div className="pw-container pw-mx-auto pw-h-full lg:pw-flex pw-w-full pw-pt-[0px] sm:pw-pt-[60px] pw-pb-[140px]">
            <div className="pw-w-[100%] lg:pw-w-[80%]">
              <CheckoutForm
                isCart={cart}
                productId={productId}
                currencyId={currencyId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
