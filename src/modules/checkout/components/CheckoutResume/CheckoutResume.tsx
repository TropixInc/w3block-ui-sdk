import { PriceAndGasInfo, Product, ProductInfo } from '../../../shared';

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
}: CheckoutResumeProps) => {
  return (
    <div>
      {products.map((product: Product) => (
        <ProductInfo
          className="pw-bg-white pw-rounded-lg pw-border pw-border-slate-200"
          key={product.id}
          image={product.images[0].thumb}
          name={product.name}
          id={product.id}
          currency={
            product.prices.find((price) => price.currencyId == currencyId)
              ?.currency.symbol ?? 'R$'
          }
          price={
            product.prices.find((price) => price.currencyId == currencyId)
              ?.amount ?? '0'
          }
          stockAmount={0}
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
