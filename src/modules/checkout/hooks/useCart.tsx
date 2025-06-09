import { useContext } from 'react';

import { CartContext } from '../providers/cartProvider';

export const useCart = () => {
  const cart = useContext(CartContext);
  return cart;
};
