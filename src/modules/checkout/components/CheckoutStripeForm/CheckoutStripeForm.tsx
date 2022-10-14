import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';

export const CheckoutStripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { appBaseUrl } = useCompanyConfig();
  const router = useRouter();
  const submitPayment = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: appBaseUrl + PixwayAppRoutes.CHECKOUT_COMPLETED,
      },
    });
    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      // eslint-disable-next-line no-console
      console.log(result.error.message);
    } else {
      router.push(PixwayAppRoutes.CHECKOUT_COMPLETED);
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <div className="pw-container pw-mx-auto pw-px-4 sm:pw-px-0 pw-max-w-[600px] pw-pt-[60px]">
      <form className="pw-w-full ">
        <div className="pw-p-4 sm:pw-p-6 pw-bg-white pw-rounded-2xl pw-shadow-2xl">
          <p className="pw-text-[18px] pw-font-bold pw-font-roboto pw-text-[#35394C] pw-mb-4">
            Insira as Informações de pagamento
          </p>
          <PaymentElement />
        </div>
        <div className="pw-flex pw-justify-end">
          <WeblockButton
            onClick={submitPayment}
            className="pw-mt-6 pw-text-white"
          >
            Enviar
          </WeblockButton>
        </div>
      </form>
    </div>
  );
};
