import { useContext } from 'react';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';

export function useCheckoutConfig() {
  const context = useContext(ThemeContext);
  const checkoutConfig =
    context?.defaultTheme?.configurations?.contentData?.checkoutConfig;

  return {
    hideCoupon: checkoutConfig?.hideCoupon,
    editableDestination: checkoutConfig?.editableDestination,
    automaxLoyalty: checkoutConfig?.automaxLoyalty,
    actionButton: checkoutConfig?.actionButton,
    message: checkoutConfig?.message,
    context,
  };
}
