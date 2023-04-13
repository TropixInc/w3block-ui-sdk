import { ReactNode, createContext, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

import { Product } from '../../shared';
import { CurrencyResponse } from '../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';

export interface CartContext {
  cart: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCart?: any;
  cartCurrencyId?: CurrencyResponse | undefined;
  setCartCurrencyId?: (currencyId: CurrencyResponse | undefined) => void;
}

export const CartContext = createContext<CartContext>({ cart: [] });

const CART_KEY_CACHE = 'cart_cache';
const CURRENCY_ID_CACHE = 'currency_id_cache';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCurrencyId, setCartCurrencyId] = useLocalStorage<
    CurrencyResponse | undefined
  >(CURRENCY_ID_CACHE);
  const [cartCache, setCartCache] = useLocalStorage<Product[]>(
    CART_KEY_CACHE,
    []
  );
  const contextValue = useMemo<CartContext>(() => {
    return {
      cart: cartCache ?? [],
      setCart: setCartCache,
      cartCurrencyId,
      setCartCurrencyId,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCache, cartCurrencyId]);
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
