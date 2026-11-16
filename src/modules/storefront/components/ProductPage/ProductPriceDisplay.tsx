/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import { generateInstallmentText } from '../../utils/productPageUtils';
import type { CurrencyResponse, Product } from '../../interfaces/Product';
import type { OrderPreviewResponse } from '../../../checkout/interface/interface';
import { Shimmer } from '../../../shared/components/Shimmer';

interface ProductPriceDisplayProps {
  product: Product | undefined;
  currencyId: CurrencyResponse | undefined;
  onCurrencyChange: (currency: CurrencyResponse) => void;
  orderPreview: OrderPreviewResponse | null;
  isLoadingValue: boolean;
  soldOut: boolean;
  priceTextColor?: string;
  isErc20?: boolean;
}

export const ProductPriceDisplay = ({
  product,
  currencyId,
  onCurrencyChange,
  orderPreview,
  isLoadingValue,
  soldOut,
  priceTextColor,
  isErc20 = false,
}: ProductPriceDisplayProps) => {
  const [translate] = useTranslation();

  const selectedPrice = useMemo(
    () =>
      product?.prices?.find(
        (p) =>
          (p.currencyId ?? p.currency?.id) ===
          (currencyId as { id?: string })?.id
      ),
    [product?.prices, currencyId]
  );

  const providerWithInstallments = orderPreview?.providersForSelection?.find(
    (res) => !!res.availableInstallments
  );

  const hasDiscount =
    orderPreview &&
    orderPreview?.productsErrors?.length === 0 &&
    parseFloat(orderPreview.originalCartPrice ?? '0') >
      parseFloat(orderPreview.cartPrice ?? '0');

  const useOrderPreviewPrice =
    orderPreview &&
    orderPreview?.productsErrors?.length === 0 &&
    (parseFloat(orderPreview.originalCartPrice ?? '0') >
      parseFloat(orderPreview.cartPrice ?? '0') ||
      parseFloat(orderPreview.cartPrice ?? '0') >
        parseFloat(selectedPrice?.amount ?? '0') ||
      parseFloat(orderPreview.cartPrice ?? '0') <
        parseFloat(selectedPrice?.amount ?? '0'));

  const displayValue = useOrderPreviewPrice
    ? orderPreview?.products?.length > 1
      ? orderPreview?.products?.[0]?.prices?.[0]?.amount ?? '0'
      : orderPreview.cartPrice ?? '0'
    : selectedPrice?.amount ?? '0';

  const originalDisplayValue =
    Number(orderPreview?.products?.length) > 1
      ? orderPreview?.products?.[0]?.prices?.[0]?.originalAmount ?? '0'
      : orderPreview?.originalCartPrice ?? '0';

  const dontShow =
    !isErc20 && parseFloat(selectedPrice?.amount ?? '0') === 0;

  const lastInstallment =
    providerWithInstallments?.availableInstallments?.[
      (providerWithInstallments?.availableInstallments?.length ?? 1) - 1
    ];

  const hasMultiplePrices =
    product?.prices != null && product.prices.length > 1;

  if (!product) return null;

  const priceContent = soldOut ? (
    translate('storefront>productPage>soldOut')
  ) : isLoadingValue ? (
    <Shimmer className="!pw-w-[100px] !pw-h-[32px]" />
  ) : (
    <>
      {hasDiscount && (
        <CriptoValueComponent
          size={12}
          fontClass="pw-ml-1 pw-text-sm pw-line-through pw-opacity-50"
          crypto={selectedPrice?.currency?.crypto}
          code={selectedPrice?.currency?.name}
          value={originalDisplayValue}
        />
      )}
      <CriptoValueComponent
        dontShow={dontShow}
        showFree
        size={24}
        fontClass="pw-ml-1"
        crypto={selectedPrice?.currency?.crypto}
        code={selectedPrice?.currency?.name}
        value={displayValue}
      />
      {lastInstallment && (
        <p className="pw-text-sm pw-text-slate-700 pw-w-full pw-ml-1">
          {generateInstallmentText(
            lastInstallment,
            providerWithInstallments?.currency?.code ?? 'BRL'
          )}
        </p>
      )}
    </>
  );

  return (
    <>
      {hasMultiplePrices && (
        <div className="">
          <p className="pw-text-sm pw-text-black pw-font-[700] pw-mb-2">
            {translate('storefront>productPage>payIn')}:
          </p>
          <form className="pw-flex pw-gap-4" action="submit">
            {product?.prices.map((price: any) => (
              <div key={price.currencyId} className="pw-flex pw-gap-2">
                <input
                  onChange={() => onCurrencyChange(price?.currency)}
                  checked={
                    (price.currencyId ?? price.currency?.id) ===
                    (currencyId as { id?: string })?.id
                  }
                  name="currency"
                  value={price.currencyId}
                  type="radio"
                />
                <p className="pw-text-xs pw-text-slate-600 pw-font-[600]">
                  {price?.currency?.symbol}
                </p>
              </div>
            ))}
          </form>
        </div>
      )}
      <p
        style={{ color: priceTextColor ?? 'black' }}
        className="pw-text-2xl pw-mt-4 pw-font-[700]"
      >
        {priceContent}
      </p>
    </>
  );
};
