import { lazy } from 'react';

import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
const CheckoutPayment = lazy(() =>
  import('../../components/CheckoutPayment').then((m) => ({
    default: m.CheckoutPayment,
  }))
);

export const CheckoutPaymentTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet({});
  return !isAuthorized || isLoading ? null : <CheckoutPayment />;
};
