const PriceAndGasInfo = lazy(() =>
  import('../../../shared/components/PriceAndGasInfo/PriceAndGasInfo').then(
    (m) => ({ default: m.PriceAndGasInfo })
  )
);
import { lazy } from 'react';

const ProductInfo = lazy(() =>
  import('../../../shared/components/ProductInfo/ProductInfo').then((m) => ({
    default: m.ProductInfo,
  }))
);

import { Product } from '../../../shared/interface/Product';

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
}: CheckoutResumeProps) => {
  return (
    <div>
      {!isCoinPayment &&
        products.map((product: Product) => (
          <ProductInfo
            className="pw-bg-white pw-rounded-lg pw-border pw-border-slate-200"
            key={product?.id}
            image={product?.images[0]?.thumb}
            name={product?.name}
            id={product?.id}
            currency={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.currency.symbol ?? 'R$'
            }
            price={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.amount ?? '0'
            }
            stockAmount={0}
            originalPrice={
              product?.prices?.find((price) => price?.currencyId == currencyId)
                ?.originalAmount ?? '0'
            }
            variants={product.variants}
          />
        ))}
      <PriceAndGasInfo
        className="pw-px-4 pw-mt-4"
        price={price}
        gasFee={gasFee}
        service={service}
        totalPrice={totalPrice}
        loading={loading}
        originalPrice={originalPrice}
        originalService={originalService}
        originalTotalPrice={originalTotalPrice}
      />
    </div>
  );
};
