import { CheckoutConfirmation } from './templates';

interface CheckoutControllerProps {
  className?: string;
}

export const CheckoutController = ({ className }: CheckoutControllerProps) => {
  return (
    <div
      className={`pw-w-screen pw-h-full pw-flex pw-flex-1 pw-flex-col pw-bg-[#F7F7F7] ${className}`}
    >
      <CheckoutConfirmation />
    </div>
  );
};
