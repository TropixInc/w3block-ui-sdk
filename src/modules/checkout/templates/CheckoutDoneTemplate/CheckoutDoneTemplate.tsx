import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
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
  const { isAuthorized, isLoading } = usePrivateRoute();
  return !isAuthorized || isLoading ? null : (
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
