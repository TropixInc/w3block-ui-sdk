
import { CurrencyResponse } from '../../storefront/interfaces/Product';
import { Cart } from '../providers/cartProvider';

export function analyzeCurrenciesInCart(products: Cart[]) {
  if (!products || products.length === 0) {
    return {
      hasCommonCurrencies: false,
      commonCurrencies: [],
      productsWithoutCommonCurrencies: [],
    };
  }

  const currencyMap = new Map<
    string,
    {
      occurrences: number;
      productIds: Set<string>;
      currency: CurrencyResponse;
    }
  >();

  const currenciesByProduct = new Map<string, Set<string>>();

  products.forEach((product) => {
    const currencyIds = new Set<string>();

    product.prices.forEach((price) => {
      const currencyId = price.currencyId || price.currency.id;

      if (!currencyId) return;

      currencyIds.add(currencyId);

      if (currencyMap.has(currencyId)) {
        const currencyData = currencyMap.get(currencyId)!;
        currencyData.productIds.add(product.id);
        currencyData.occurrences = currencyData.productIds.size;
      } else {
        currencyMap.set(currencyId, {
          occurrences: 1,
          productIds: new Set([product.id]),
          currency: price.currency,
        });
      }
    });

    currenciesByProduct.set(product.id, currencyIds);
  });

  const commonCurrencies = Array.from(currencyMap.entries())
    .filter(([_, data]) => data.occurrences === products.length)
    .map(([_, data]) => data.currency);

  const productsWithoutCommonCurrencies: Cart[] = [];

  products.forEach((product) => {
    const thisProductCurrencyIds = currenciesByProduct.get(product.id)!;
    let sharesCurrency = false;

    if (thisProductCurrencyIds.size === 0) {
      productsWithoutCommonCurrencies.push(product);
      return;
    }

    for (const otherProduct of products) {
      if (otherProduct.id === product.id) continue;

      const otherProductCurrencyIds = currenciesByProduct.get(otherProduct.id)!;

      for (const currencyId of thisProductCurrencyIds) {
        if (otherProductCurrencyIds.has(currencyId)) {
          sharesCurrency = true;
          break;
        }
      }

      if (sharesCurrency) break;
    }

    if (!sharesCurrency && products.length > 1) {
      productsWithoutCommonCurrencies.push(product);
    }
  });

  return {
    hasCommonCurrencies: commonCurrencies.length > 0,
    commonCurrencies,
    productsWithoutCommonCurrencies,
  };
}
