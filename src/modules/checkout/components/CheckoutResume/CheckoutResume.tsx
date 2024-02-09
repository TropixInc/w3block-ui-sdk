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
import { PaymentsResponse } from '../../interface/interface';

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
}: CheckoutResumeProps) => {
  return (
    <div>
      {!isCoinPayment ? (
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
          />
        ))
      ) : (
        <div className="pw-flex pw-justify-between pw-px-4">
          <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
            Destinatário
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
      />
    </div>
  );
};
