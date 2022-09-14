import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutHeader } from '../../components/CheckoutHeader';

interface CheckoutDoneTemplateProps {
  returnTo?: () => void;
  productId?: string[];
  currencyId?: string;
}

export const CheckoutDoneTemplate = ({
  returnTo,
  productId,
  currencyId,
}: CheckoutDoneTemplateProps) => {
  const router = useRouter();
  return (
    <>
      <CheckoutHeader
        onClick={returnTo ? returnTo : () => router.push(PixwayAppRoutes.HOME)}
      />
      <CheckoutContainer
        productId={productId}
        currencyId={currencyId}
        returnAction={returnTo}
        checkoutStatus={CheckoutStatus.FINISHED}
      />
    </>
  );
};
