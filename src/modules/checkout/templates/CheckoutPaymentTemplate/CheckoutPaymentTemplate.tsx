import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { CheckoutPayment } from '../../components';

export const CheckoutPaymentTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  return !isAuthorized || isLoading ? null : <CheckoutPayment />;
};
