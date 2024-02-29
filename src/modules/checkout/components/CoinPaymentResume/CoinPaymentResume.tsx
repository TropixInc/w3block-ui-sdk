import { PaymentsResponse } from '../../../checkout/interface/interface';
import { CriptoValueComponent } from '../../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { Shimmer } from '../../../shared/components/Shimmer';

interface CoinPaymentResume {
  payments?: PaymentsResponse[];
  loading?: boolean;
}

export const CoinPaymentResume = ({ payments, loading }: CoinPaymentResume) => {
  const coinPayment = () => {
    return payments?.filter(
      (e) => e?.currencyId === '9e5c87cb-22ca-4550-8f09-f2272203410b'
    )[0];
  };

  const payment = () => {
    return payments?.filter(
      (e) => e?.currencyId !== '9e5c87cb-22ca-4550-8f09-f2272203410b'
    )[0];
  };
  return (
    <div className="pw-mb-8 !pw-font-poppins">
      <h1 className="pw-font-normal pw-text-base pw-mb-4">
        Forma de pagamento
      </h1>
      <div className="pw-flex pw-justify-between pw-px-5">
        <p className="pw-text-base pw-text-[#35394C] pw-font-[400]">Zucas:</p>
        {loading ? (
          <Shimmer />
        ) : (
          <div className="pw-flex pw-gap-2">
            <CriptoValueComponent
              pointsPrecision="decimal"
              code={coinPayment()?.currency?.code}
              symbol={coinPayment()?.currency?.symbol}
              value={coinPayment()?.totalPrice ?? ''}
              crypto
              fontClass="pw-text-base pw-font-[600] pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
      <div className="pw-flex pw-justify-between pw-px-5 pw-font-semibold">
        <p className="pw-text-base pw-text-[#35394C">Complemento:</p>
        {loading ? (
          <Shimmer />
        ) : (
          <div className="pw-flex pw-gap-2">
            <CriptoValueComponent
              code={payment()?.currency?.code}
              symbol={payment()?.currency?.symbol}
              value={payment()?.totalPrice ?? ''}
              fontClass="pw-text-base pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinPaymentResume;
