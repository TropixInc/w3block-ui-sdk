import { ReactNode, createContext, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

import { Product } from '../../shared';

export interface CartContext {
  cart: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCart?: any;
}

export const CartContext = createContext<CartContext>({ cart: [] });

const CART_KEY_CACHE = 'cart_cache';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCache, setCartCache] = useLocalStorage<Product[]>(
    CART_KEY_CACHE,
    []
  );
  const contextValue = useMemo<CartContext>(() => {
    return { cart: cartCache ?? [], setCart: setCartCache };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCache]);
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
