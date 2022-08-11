import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useRouter from '../../../shared/hooks/useRouter/';
import { CheckoutStatus } from '../../components';
import { CheckoutContainer } from '../../components/CheckoutContainer';
import { CheckoutHeader } from '../../components/CheckoutHeader';

interface CheckoutDoneProps {
  returnTo?: () => void;
}

export const CheckoutDone = ({ returnTo }: CheckoutDoneProps) => {
  const router = useRouter();
  return (
    <>
      <CheckoutHeader onClick={returnTo ? returnTo : () => router.push('/')} />
      <CheckoutContainer
        returnAction={
          returnTo ? returnTo : () => router.push(PixwayAppRoutes.HOME)
        }
        checkoutStatus={CheckoutStatus.FINISHED}
      />
    </>
  );
};
