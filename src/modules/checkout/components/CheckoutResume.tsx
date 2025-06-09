import { useTranslation } from "react-i18next";
import { PriceAndGasInfo } from "../../shared/components/PriceAndGasInfo";
import { ProductInfo } from "../../shared/components/ProductInfo";
import { Product } from "../../shared/interfaces/Product";
import { OrderPreviewCache, PaymentsResponse } from "../interface/interface";


interface CheckoutResumeProps {
  products: Product[];
  currencyId: string;
  price: string;
  gasFee: string;
  service: string;
  totalPrice: string;
  loading?: boolean;
  originalPrice?: string;
  originalService?: string;
  originalTotalPrice?: string;
  isCoinPayment?: boolean;
  destinationUser?: string;
  payments?: PaymentsResponse[];
  currency?: string;
  convertedPrice?: string;
  productPreview?: OrderPreviewCache;
}

export const CheckouResume = ({
  products,
  currencyId,
  price,
  gasFee,
  service,
  totalPrice,
  loading,
  originalPrice,
  originalService,
  originalTotalPrice,
  isCoinPayment,
  destinationUser,
  payments,
  currency,
  convertedPrice,
  productPreview,
}: CheckoutResumeProps) => {
  const [translate] = useTranslation();
  return (
    <div>
      {!isCoinPayment ? (
        products?.map((product: Product) => (
          <ProductInfo
            className="pw-bg-white pw-rounded-lg pw-border pw-border-slate-200"
            key={product?.id}
            quantity={
              product?.quantity ? parseFloat(product?.quantity) : undefined
            }
            image={product?.images[0]?.thumb}
            name={product?.name}
            id={product?.id}
            currency={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.currency?.symbol ?? 'R$'
            }
            price={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.amount ??
              productPreview?.orderProducts.find(
                (val) => val.productId === product.id
              )?.expectedPrice ??
              '0'
            }
            stockAmount={0}
            originalPrice={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.originalAmount ?? '0'
            }
            variants={product?.variants}
            subtitle={product?.subtitle}
            anchorCurrencyAmount={parseFloat(
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.anchorCurrencyAmount ?? '0'
            ).toString()}
            anchorCurrencySymbol={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.anchorCurrency?.symbol ?? ''
            }
            metadata={product?.metadata}
            disableQuantity
          />
        ))
      ) : (
        <div className="pw-flex pw-justify-between pw-px-4">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
            {translate('checkout>checkoutResume>recipient')}
          </p>
          <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">
            {destinationUser}
          </p>
        </div>
      )}
      <PriceAndGasInfo
        className={`pw-px-4 ${isCoinPayment ? 'pw-mt-2' : 'pw-mt-4'}`}
        price={price}
        gasFee={gasFee}
        service={service}
        totalPrice={totalPrice}
        loading={loading}
        originalPrice={originalPrice}
        originalService={originalService}
        originalTotalPrice={originalTotalPrice}
        payments={payments}
        currency={currency}
        convertedPrice={convertedPrice}
        name={currency}
        isErc20={products?.[0]?.type === 'erc20'}
      />
    </div>
  );
};
