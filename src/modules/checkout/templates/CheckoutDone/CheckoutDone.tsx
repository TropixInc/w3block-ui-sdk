import useRouter from '../../../shared/hooks/useRouter/';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutHeader } from '../../components/CheckoutHeader';

interface CheckoutDoneProps {
  returnTo?: () => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutDone = ({
  returnTo,
  productId,
  currencyId,
}: CheckoutDoneProps) => {
  const router = useRouter();
  return (
    <>
      <CheckoutHeader onClick={returnTo ? returnTo : () => router.push('/')} />
      <CheckoutContainer
        productId={productId}
        currencyId={currencyId}
        returnAction={returnTo}
        checkoutStatus={CheckoutStatus.FINISHED}
      />
    </>
  );
};
