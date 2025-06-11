/* eslint-disable i18next/no-literal-string */
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { CriptoValueComponent } from '../../shared/components/CriptoValueComponent';
import { Shimmer } from '../../shared/components/Shimmer';
import { PaymentsResponse } from '../interface/interface';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import useTranslation from '../../shared/hooks/useTranslation';



interface CoinPaymentResume {
  payments?: PaymentsResponse[];
  loading?: boolean;
  currency?: string;
}

export const CoinPaymentResume = ({
  payments,
  loading,
  currency,
}: CoinPaymentResume) => {
  const { defaultTheme } = useThemeConfig();
  const router = useRouter();
  const [translate] = useTranslation();
  const coinPaymentCurrencyId = useMemo(() => {
    return (
      router.query?.cryptoCurrencyId ??
      defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId
    );
  }, [
    defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId,
    router.query?.cryptoCurrencyId,
  ]);

  const coinPayment = () => {
    return payments?.filter((e) => e?.currencyId === coinPaymentCurrencyId)[0];
  };

  const payment = () => {
    return payments?.filter((e) => e?.currencyId !== coinPaymentCurrencyId)[0];
  };
  return (
    <div className="pw-mb-8">
      <h1 className="pw-font-normal pw-text-base pw-mb-4 pw-text-black">
        {translate('checkout>coinPaymentResume>paymentForm')}
      </h1>
      <div className="pw-flex pw-justify-between pw-px-5">
        <p className="pw-text-base pw-text-[#35394C] pw-font-[400]">
          {currency}:
        </p>
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
              fontClass="pw-text-base pw-text-black pw-font-[600] pw-text-[#35394C]"
            />
          </div>
        )}
      </div>
      <div className="pw-flex pw-justify-between pw-px-5 pw-font-semibold pw-text-black">
        <p className="pw-text-base pw-text-[#35394C">
          {translate('checkout>coinPaymentResume>complement')}:
        </p>
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
