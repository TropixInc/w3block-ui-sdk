/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../shared/interfaces/Product';
import { Variants } from '../../storefront/interfaces/Product';

export interface WalletWithBalance {
  type?: string;
  balance?: string;
  currency?: string;
  pointsPrecision?: string;
}

/** Extrai o preço de um produto pela currencyId */
export function getPriceByCurrency(
  product: Product | { prices?: Array<{ currencyId?: string; amount?: string; originalAmount?: string; currency?: any; anchorCurrencyId?: string; anchorCurrencyAmount?: string; anchorCurrency?: any }> } | null | undefined,
  currencyId: string | undefined
) {
  return product?.prices?.find((p) => p?.currencyId === currencyId);
}

/** Extrai os IDs das variantes de um produto (formato string para comparação) */
export function getVariantIds(product: { variants?: Variants[] }): string {
  return (
    product?.variants
      ?.map((res) => res?.values?.map((v) => v?.id))
      .toString() ?? ''
  );
}

/** Retorna a carteira de loyalty com saldo do array organizado */
export function getLoyaltyWalletWithBalance(
  wallets: WalletWithBalance[] | undefined
): WalletWithBalance | undefined {
  return wallets?.find(
    (w) =>
      w?.type === 'loyalty' &&
      w?.balance &&
      parseFloat(w?.balance ?? '0') > 0
  );
}

/** Formata o saldo da carteira loyalty */
export function formatLoyaltyBalance(wallet: WalletWithBalance | undefined): string {
  if (!wallet?.balance) return '0';
  return wallet.pointsPrecision === 'decimal'
    ? parseFloat(wallet.balance).toFixed(2)
    : parseFloat(wallet.balance).toFixed(0);
}

/** Ordena array de IDs de produtos (descendente) */
export function sortProductIds(ids: string[] | undefined): string[] {
  if (!ids) return [];
  return [...ids].sort((a, b) => {
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  });
}

/** Ordena cart por id e variantIds */
export function sortCart<T extends { id: string; variantIds?: unknown[] }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aKey = `${a.id}-${(a.variantIds ?? []).toString()}`;
    const bKey = `${b.id}-${(b.variantIds ?? []).toString()}`;
    if (aKey > bKey) return -1;
    if (aKey < bKey) return 1;
    return 0;
  });
}

/** Mapeia variantes do produto para IDs no productVariants */
export function getVariantIdsForProduct(
  productVariants: Record<string, unknown> | undefined,
  productId: string
): string[] {
  if (!productVariants) return [];
  return Object.values(productVariants)
    .filter((v: any) => v?.productId === productId)
    .map((v: any) => v?.id)
    .filter(Boolean);
}

/** Verifica se dois produtos são iguais (id, preço e variantes) */
export function areProductsEqual(
  p: Product,
  prod: Product,
  currencyId: string | undefined
): boolean {
  const pPrice = getPriceByCurrency(p, currencyId)?.amount;
  const prodPrice = getPriceByCurrency(prod, currencyId)?.amount;
  const pVariants = getVariantIds(p);
  const prodVariants = getVariantIds(prod);
  return (
    p?.id === prod?.id &&
    pPrice === prodPrice &&
    pVariants === prodVariants
  );
}
