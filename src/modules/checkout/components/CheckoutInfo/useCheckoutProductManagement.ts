import { useCallback, useMemo } from 'react';

import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { Product } from '../../../shared/interfaces/Product';
import { useTrack } from '../../../storefront/hooks/useTrack';
import { CurrencyResponse, Variants } from '../../../storefront/interfaces/Product';
import { OrderPreviewResponse } from '../../interface/interface';
import { Cart } from '../../providers/cartProvider';
import {
  areProductsEqual,
  getPriceByCurrency,
  getVariantIds,
  sortCart,
  sortProductIds,
} from '../../utils/checkoutHelpers';

interface UseCheckoutProductManagementProps {
  orderPreview: OrderPreviewResponse | null;
  productIds: string[] | undefined;
  setProductIds: (ids: string[]) => void;
  currencyIdState: string | undefined;
  cart: Cart[];
  setCart: (cart: Cart[]) => void;
  cartCurrencyId: CurrencyResponse | undefined;
  isCart: boolean;
}

export function useCheckoutProductManagement({
  orderPreview,
  productIds,
  setProductIds,
  currencyIdState,
  cart,
  setCart,
  cartCurrencyId,
  isCart,
}: UseCheckoutProductManagementProps) {
  const router = useRouterConnect();
  const track = useTrack();

  const variantIdsStr = useCallback(
    (v?: Variants[]) =>
      v?.map((res) => res.values.map((r) => r.id)).toString() ?? '',
    []
  );

  const differentProducts = useMemo<Array<Product>>(() => {
    if (!orderPreview?.products?.length) return [];

    const uniqueProduct: Product[] = [];
    orderPreview.products.forEach((p) => {
      if (
        !uniqueProduct.some((prod) => areProductsEqual(p, prod, currencyIdState))
      ) {
        uniqueProduct.push(p);
      }
    });

    return uniqueProduct.sort((a, b) => {
      const aKey = getVariantIds(a);
      const bKey = getVariantIds(b);
      if (aKey > bKey) return -1;
      if (aKey < bKey) return 1;
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    });
  }, [orderPreview, currencyIdState]);

  const changeQuantity = (
    add: boolean | null,
    id: string,
    variants?: Variants[],
    quantity?: number
  ) => {
    if (add != null) {
      let newArray: Array<string> = [];
      if (
        productIds &&
        productIds?.filter((filteredId) => filteredId == id)?.length <
          productIds?.filter((filteredId) => filteredId == id)?.length +
            (add ? 1 : -1)
      ) {
        newArray = [...productIds, id];
      } else {
        productIds?.forEach((idProd) => {
          if (
            id != idProd ||
            newArray.filter((idNew) => idNew == idProd)?.length <
              productIds?.filter((filteredId) => filteredId == idProd)?.length +
                (add ? 1 : -1)
          ) {
            newArray.push(idProd);
          }
        });
      }
      const firstProduct = orderPreview?.products?.[0];
      const currencyIdForRoute = isCart
        ? cartCurrencyId?.id
        : firstProduct &&
          getPriceByCurrency(firstProduct, currencyIdState)?.currencyId;

      router.pushConnect(
        isCart
          ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
          : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
        {
          productIds: newArray.join(','),
          currencyId: currencyIdForRoute,
        }
      );

      if (isCart) {
        const variantStr = variantIdsStr(variants);
        if (add) {
          const newCart = cart.filter(
            (val) =>
              val.id === id &&
              (val.variantIds ?? []).toString() === variantStr
          );
          if (newCart[0]) {
            setCart(sortCart([...cart, newCart[0]]));
          }
        } else {
          const newCart = cart.find(
            (val) =>
              val.id === id &&
              (val.variantIds ?? []).toString() === variantStr
          );
          if (newCart) {
            const ind = cart.indexOf(newCart);
            const newValue = [...cart];
            newValue.splice(ind, 1);
            setCart(sortCart(newValue));
          }
        }
      }

      setProductIds(sortProductIds(newArray));
    } else if (quantity) {
      const firstProduct = orderPreview?.products?.[0];
      const currencyIdForRoute =
        (firstProduct &&
          getPriceByCurrency(firstProduct, currencyIdState)?.currencyId) ??
        cartCurrencyId?.id;

      if (!isCart) {
        const newArray = [...Array(quantity).fill(id)];
        router.pushConnect(PixwayAppRoutes.CHECKOUT_CONFIRMATION, {
          productIds: newArray.join(','),
          currencyId: currencyIdForRoute,
        });
        setProductIds(sortProductIds(newArray));
      } else {
        const variantStr = variantIdsStr(variants);
        const filteredProds = cart.filter(
          (val) =>
            val.id === id && (val.variantIds ?? []).toString() === variantStr
        );

        if (productIds?.includes(id)) {
          const ind = productIds.indexOf(id);
          const newIds = [...productIds];
          newIds.splice(ind, filteredProds?.length);
          const newArray = [...newIds, ...Array(quantity).fill(id)];
          router.pushConnect(PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION, {
            productIds: newArray.join(','),
            currencyId: currencyIdForRoute,
          });
          setProductIds(sortProductIds(newArray));
        }

        const newCart = cart.find(
          (val) =>
            val.id === id && (val.variantIds ?? []).toString() === variantStr
        );
        if (newCart) {
          const ind = cart.indexOf(newCart);
          const newValue = [...cart];
          newValue.splice(ind, filteredProds?.length);
          setCart(sortCart([...newValue, ...Array(quantity).fill(newCart)]));
        }
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteProduct = (id: string, amount: string, variants?: Variants[]) => {
    const filteredProds = cart.filter((prod) => {
      if (prod.id == id) {
        if (
          prod.prices.find((price) => price.currencyId == currencyIdState)
            ?.amount != amount ||
          prod.variantIds.toString() !==
            variants?.map((res) => res.values.map((res) => res.id)).toString()
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    const firstProduct = orderPreview?.products?.[0];
    const currencyIdForRoute = isCart
      ? cartCurrencyId?.id
      : firstProduct &&
        getPriceByCurrency(firstProduct, currencyIdState)?.currencyId;

    router.pushConnect(
      isCart
        ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
        : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
      {
        productIds: filteredProds?.map((p) => p.id).join(','),
        currencyId: currencyIdForRoute,
      }
    );

    if (isCart) {
      setCart(sortCart(filteredProds));
    }

    setProductIds(sortProductIds(filteredProds?.map((p) => p.id) ?? []));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteProduct = (id: string, prod: any, variants?: Variants[]) => {
    try {
      track('remove_from_cart', {
        value: parseFloat(
          prod?.prices?.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (price: any) => price?.currencyId == currencyIdState
          )?.amount ?? '0'
        ).toString(),
        currency: prod?.prices?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prodI: any) => prodI?.currencyId == currencyIdState
        )?.currency?.code,
        items: [{ item_id: id, item_name: prod.name }],
      });
    } catch (err) {
      console.log('Erro ao salvar o track: ', err);
    }

    deleteProduct(
      id,
      prod?.prices?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (price: any) => price?.currencyId == currencyIdState
      )?.amount ?? '0',
      variants
    );
  };

  return {
    differentProducts,
    changeQuantity,
    deleteProduct,
    handleDeleteProduct,
    variantIdsStr,
  };
}
