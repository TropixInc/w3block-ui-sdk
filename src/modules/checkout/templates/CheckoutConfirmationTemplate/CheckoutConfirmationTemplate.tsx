import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutHeader } from '../../components/CheckoutHeader';

interface CheckoutConfirmationTemplateProps {
  returnTo?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutConfirmationTemplate = ({
  returnTo,
  proccedAction,
  productId,
  currencyId,
}: CheckoutConfirmationTemplateProps) => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  return !isAuthorized || isLoading ? null : (
    <>
      <CheckoutHeader onClick={returnTo} />
      <CheckoutContainer
        productId={productId}
        currencyId={currencyId}
        proccedAction={proccedAction}
        returnAction={returnTo}
        checkoutStatus={CheckoutStatus.CONFIRMATION}
      />
    </>
  );
};
