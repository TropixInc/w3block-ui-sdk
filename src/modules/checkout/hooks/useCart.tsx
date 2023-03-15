import { useContext } from 'react';

import { CartContext } from '../providers/cartProvider';

export const useCart = () => {
  const { cart, setCart } = useContext(CartContext);
  return { cart, setCart };
};
