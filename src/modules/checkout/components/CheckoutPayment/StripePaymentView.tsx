import { useMemo } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { CheckoutStripeForm } from '../CheckoutStripeForm';

interface StripePaymentViewProps {
  clientSecret: string;
  publicKey: string;
}

export const StripePaymentView = ({
  clientSecret,
  publicKey,
}: StripePaymentViewProps) => {
  const stripePromise = useMemo(() => loadStripe(publicKey), [publicKey]);

  if (!stripePromise) return null;

  return (
    <div>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutStripeForm />
      </Elements>
    </div>
  );
};
