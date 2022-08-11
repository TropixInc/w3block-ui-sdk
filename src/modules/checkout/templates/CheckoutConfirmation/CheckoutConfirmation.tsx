import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutHeader } from '../../components/CheckoutHeader';

interface CheckoutConfirmationProps {
  returnTo?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutConfirmation = ({
  returnTo,
  proccedAction,
  productId,
  currencyId,
}: CheckoutConfirmationProps) => {
  return (
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
