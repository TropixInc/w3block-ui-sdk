/* eslint-disable @typescript-eslint/no-explicit-any */
import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { CurrencyResponse } from '../../interfaces/Product';
import type { OrderPreviewResponse } from '../../../checkout/interface/interface';
import { Product } from '../../hooks/useGetProductBySlug';

interface ProductQuantitySelectorProps {
  product: Product | undefined;
  currencyId: CurrencyResponse | undefined;
  quantity: number;
  setQuantity: (value: number | ((prev: number) => number)) => void;
  orderPreview: OrderPreviewResponse | null;
  isLoadingValue: boolean;
  reachStock: boolean;
  batchSize?: number;
  isErc20?: boolean;
  error: string;
}

export const ProductQuantitySelector = ({
  product,
  currencyId,
  quantity,
  setQuantity,
  orderPreview,
  isLoadingValue,
  reachStock,
  batchSize,
  isErc20 = false,
  error,
}: ProductQuantitySelectorProps) => {
  const [translate] = useTranslation();

  const selectedPrice = product?.prices?.find(
    (p: any) =>
      (p.currencyId ?? p.currency?.id) === (currencyId as { id?: string })?.id
  );

  const canDecrement =
    quantity > 1 &&
    quantity !== batchSize &&
    !(
      product?.minPurchaseAmount &&
      quantity === parseFloat(product.minPurchaseAmount)
    );

  const canIncrement =
    product?.canPurchaseAmount &&
    product?.stockAmount &&
    quantity < product.canPurchaseAmount &&
    quantity < product.stockAmount &&
    (!(isErc20 && batchSize) ||
      (quantity + (batchSize ?? 0) <= product.canPurchaseAmount &&
        quantity + (batchSize ?? 0) <= product.stockAmount));

  const isMaxReached =
    product?.canPurchaseAmount &&
    product?.stockAmount &&
    quantity + (batchSize ?? 0) > product.canPurchaseAmount &&
    quantity + (batchSize ?? 0) > product.stockAmount;

  const handleDecrement = () => {
    if (!canDecrement) return;
    if (isErc20 && batchSize && quantity > batchSize) {
      setQuantity(quantity - batchSize);
    } else {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    if (isErc20 && batchSize) {
      setQuantity(quantity + batchSize);
    } else {
      setQuantity(quantity + 1);
    }
  };

  return (
    <>
      <div className="pw-mt-6 pw-flex pw-gap-3 pw-items-end">
        <div className="pw-flex pw-flex-col pw-gap-x-4 pw-items-start pw-justify-center">
          <p className="pw-text-sm pw-text-black pw-mb-1">
            {translate('storefront>productPage>quantity')}
          </p>
          <div className="pw-flex pw-gap-4 pw-justify-center pw-items-center">
            <p
              onClick={handleDecrement}
              className={`pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                !canDecrement
                  ? 'pw-text-[rgba(0,0,0,0.3)] !pw-border-[rgba(0,0,0,0.3)] !pw-cursor-default'
                  : 'pw-text-[#353945] pw-border-brand-primary pw-cursor-pointer'
              }`}
            >
              -
            </p>
            <div>
              <input
                type="number"
                disabled
                value={quantity}
                readOnly
                className="pw-text-sm pw-font-[600] pw-text-[#353945] pw-text-center pw-w-[30px]"
              />
            </div>
            <p
              onClick={handleIncrement}
              className={`pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                isMaxReached
                  ? 'pw-text-[rgba(0,0,0,0.3)] !pw-border-[rgba(0,0,0,0.3)] !pw-cursor-default'
                  : canIncrement
                  ? 'pw-border-brand-primary pw-text-[#353945] pw-cursor-pointer'
                  : 'pw-border-[rgba(0,0,0,0.3)] pw-text-[rgba(0,0,0,0.3)] pw-cursor-default'
              }`}
            >
              +
            </p>
          </div>
          {reachStock && (
            <p className="pw-text-[12px] pw-text-gray-500 pw-mt-1">
              {translate('pages>product>reachStock', {
                product: product?.name,
              })}
            </p>
          )}
          {product?.settings?.minCartItemPrice != null && (
            <p className="pw-text-[12px] pw-text-gray-500 pw-mt-1">
              {translate('pages>productPage>minValue', {
                value:
                  (product?.prices?.[0]?.currency?.symbol ??
                    orderPreview?.currency?.symbol) +
                  product.settings.minCartItemPrice.toFixed(2),
              })}
            </p>
          )}
          {batchSize != null && (
            <p className="pw-text-[12px] pw-text-gray-500 pw-mt-1">
              {translate('pages>checkout>batchSize', { batchSize })}
            </p>
          )}
        </div>
        {orderPreview && orderPreview?.products?.length > 1 && (
          isLoadingValue ? (
            <Shimmer className="!pw-w-[56px] !pw-h-[20px]" />
          ) : (
            <CriptoValueComponent
              size={12}
              fontClass="pw-text-sm pw-font-[600] pw-text-[#353945] pw-opacity-50"
              crypto={selectedPrice?.currency?.crypto}
              code={selectedPrice?.currency?.name}
              value={orderPreview?.cartPrice ?? '0'}
            />
          )
        )}
      </div>
      <p className="pw-text-sm pw-font-[600] pw-text-[#93949b] pw-text-left">
        {error}
      </p>
    </>
  );
};
