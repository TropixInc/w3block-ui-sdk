import { useCart } from '../../../checkout/hooks/useCart';
import CartIcon from '../../assets/icons/shoppingCart.svg?react';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
interface CartButtonProps {
  iconColor?: string;
  className?: string;
  borderColor?: string;
}

export const CartButton = ({
  iconColor,
  className = '',
  borderColor,
}: CartButtonProps) => {
  const { cart, cartCurrencyId } = useCart();
  const { pushConnect } = useRouterConnect();
  const quantity = cart.length;
  const currencyId = cart.length
    ? cartCurrencyId?.id ?? cart[0].prices[0].currencyId
    : '';
  return (
    <div
      style={{ borderColor: borderColor ?? 'black' }}
      onClick={() =>
        pushConnect(
          PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION +
            `?productIds=${cart
              .map((p) => p.id)
              .join(',')}&currencyId=${currencyId}`
        )
      }
      className={`pw-px-6 pw-order-2 pw-flex pw-cursor-pointer ${className}`}
    >
      <CartIcon
        style={{
          stroke: iconColor ?? 'black',
        }}
      />
      {quantity > 0 && (
        <div className="pw-relative">
          <div className="pw-absolute -pw-top-1 -pw-left-2">
            <div className="pw-p-1 pw-bg-brand-primary pw-rounded-full pw-text-white pw-flex pw-justify-center pw-items-center pw-w-[15px] pw-h-[15px] pw-text-[12px]">
              {quantity}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
