import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { CheckoutPayment } from '../../components';

export const CheckoutPaymentTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet();
  return !isAuthorized || isLoading ? null : <CheckoutPayment />;
};
