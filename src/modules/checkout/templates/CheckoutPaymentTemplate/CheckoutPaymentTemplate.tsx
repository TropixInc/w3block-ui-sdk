import { lazy } from 'react';

import { useProfile } from '../../../shared';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
const CheckoutPayment = lazy(() =>
  import('../../components/CheckoutPayment').then((m) => ({
    default: m.CheckoutPayment,
  }))
);

export const CheckoutPaymentTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  const { data: profile } = useProfile();
  const userRoles = profile?.data.roles || [];
  const isCommerceReceiver = Boolean(
    userRoles.find((e) => e === 'commerce.orderReceiver')
  );
  useHasWallet({});
  return !isAuthorized || isLoading ? null : isCommerceReceiver ? (
    <div className="pw-w-full pw-h-[72.4vh] pw-flex pw-justify-center pw-items-center pw-font-bold pw-text-2xl pw-text-black">
      Esse usuário não possui permissão para realizar uma compra
    </div>
  ) : (
    <CheckoutPayment />
  );
};
