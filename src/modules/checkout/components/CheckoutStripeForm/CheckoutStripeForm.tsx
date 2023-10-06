import { SyntheticEvent, lazy, useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

const Spinner = lazy(() =>
  import('../../../shared/components/Spinner').then((m) => ({
    default: m.Spinner,
  }))
);
const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({
      default: m.WeblockButton,
    })
  )
);

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useTranslation from '../../../shared/hooks/useTranslation';

export const CheckoutStripeForm = () => {
  const [translate] = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { appBaseUrl } = useCompanyConfig();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const submitPayment = async (e: SyntheticEvent) => {
    setCardError('');
    setLoading(true);
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: appBaseUrl + PixwayAppRoutes.CHECKOUT_COMPLETED,
      },
    });
    if (result.error) {
      // eslint-disable-next-line no-console
      console.log(result.error.code, result.error.decline_code);
      setCardError(result.error.message ?? 'Erro não identificado');
      setLoading(false);
    }
  };
  return (
    <div className="pw-container pw-mx-auto pw-px-4 sm:pw-px-0 pw-max-w-[600px] pw-pt-[60px]">
      <form className="pw-w-full ">
        <div className="pw-p-4 sm:pw-p-6 pw-bg-white pw-rounded-2xl pw-shadow-2xl">
          <p className="pw-text-[18px] pw-font-bold pw-font-roboto pw-text-[#35394C] pw-mb-4">
            {translate('checkout>payment>PaymentInfo')}
          </p>
          <PaymentElement />
        </div>
        <div className="pw-flex pw-justify-between pw-items-center pw-gap-2">
          <div className="pw-mt-6">
            <p className="pw-text-sm pw-text-red-500">{cardError}</p>
          </div>
          <WeblockButton
            onClick={(e) => submitPayment(e)}
            className="pw-mt-6 pw-text-white pw-accent-brand-primary-500"
          >
            {loading ? (
              <Spinner className="!pw-w-[14px] !pw-h-[14px]" />
            ) : (
              translate('checkout>payment>subimtPayment')
            )}
          </WeblockButton>
        </div>
      </form>
    </div>
  );
};
