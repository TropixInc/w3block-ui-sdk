"use client";

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import { ReactNode } from 'react';

import { Alert } from '../../../shared/components/Alert';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import { PriceAndGasInfo } from '../../../shared/components/PriceAndGasInfo';
import { Spinner } from '../../../shared/components/Spinner';
import { CreateOrderResponse } from '../../interface/interface';
import { OrderPreviewCache } from '../../interface/interface';

export interface CheckoutFinishedContentProps {
  /** Fluxo de gift card (pass share): conteúdo já renderizado pelo parent */
  hasPassShareCode?: boolean;
  passShareStatusGenerated?: boolean;
  renderGiftsCard: () => ReactNode;
  /** Fluxo normal (coin payment ou pagamento tradicional) */
  error: string;
  statusResponse?: CreateOrderResponse;
  productCache?: OrderPreviewCache | null;
  isCoinPayment: boolean;
  acceptMultipleCurrenciesPurchase: boolean;
  translate: (key: string) => string;
  profileName?: string;
  orderResponse?: CreateOrderResponse | null;
  locale: string;
  codeQr: string;
  checkoutMessage?: string;
  payments?: CreateOrderResponse['payments'] | OrderPreviewCache['payments'];
  productCachePayments?: OrderPreviewCache['payments'];
  productCacheProducts?: OrderPreviewCache['products'];
  currencyIdFromQuery?: string;
  isLoading: boolean;
  onActionButton: () => void;
  actionButtonLabel: string;
  isCoinPaymentLayout?: boolean;
}

export function CheckoutFinishedContent({
  hasPassShareCode,
  passShareStatusGenerated,
  renderGiftsCard,
  error,
  statusResponse,
  productCache,
  isCoinPayment,
  acceptMultipleCurrenciesPurchase,
  translate,
  profileName,
  orderResponse,
  locale,
  codeQr,
  checkoutMessage,
  payments,
  productCachePayments,
  productCacheProducts,
  currencyIdFromQuery,
  isLoading,
  onActionButton,
  actionButtonLabel,
  isCoinPaymentLayout,
}: CheckoutFinishedContentProps) {
  if (hasPassShareCode) {
    if (passShareStatusGenerated) return <>{renderGiftsCard()}</>;
    return (
      <div>
        <Spinner className="pw-h-10 pw-w-10" />
      </div>
    );
  }

  const showCoinPaymentSummary =
    (productCache?.isCoinPayment || isCoinPayment) &&
    (!productCache?.acceptMultipleCurrenciesPurchase ||
      !acceptMultipleCurrenciesPurchase);

  return (
    <div className="pw-mt-4">
      {showCoinPaymentSummary ? (
        <>
          {error !== '' && statusResponse?.status === 'failed' ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <>
              {statusResponse?.deliverId ? (
                <p className="pw-text-base pw-font-semibold pw-text-center pw-max-w-[350px] pw-text-black sm:pw-mx-0 pw-mx-auto">
                  {productCache?.choosedPayment?.paymentMethod === 'transfer'
                    ? translate('checkout>checkoutInfo>paymentAnalysis')
                    : translate('checkout>checkoutInfo>sucessPayment')}
                </p>
              ) : null}
              <div className="pw-rounded-xl pw-p-5 pw-border pw-border-[#DCDCDC] pw-text-black pw-text-center pw-mt-5 pw-max-w-[350px] sm:pw-mx-0 pw-mx-auto">
                <div>
                  <p className="pw-text-sm pw-font-normal">
                    {translate('checkout>checkoutInfo>paymentFor')}
                  </p>
                  <p className="pw-text-sm pw-font-semibold">
                    {productCache?.destinationUser?.name}
                  </p>
                </div>
                <div className="pw-mt-5">
                  <p className="pw-text-sm pw-font-normal">
                    {translate('checkout>checkoutInfo>WhoPaid')}
                  </p>
                  <p className="pw-text-sm pw-font-semibold">{profileName}</p>
                </div>
                <div className="pw-mt-5">
                  <p className="pw-text-sm pw-font-normal">
                    {translate('checkout>checkoutInfo>valuePaid')}
                  </p>
                  <p className="pw-text-sm pw-font-semibold">
                    {'R$'}
                    {orderResponse?.totalAmount?.[0]?.amount
                      ? parseFloat(
                          orderResponse?.totalAmount?.[0]?.amount
                        ).toFixed(2)
                      : parseFloat(
                          (orderResponse?.totalAmount as unknown as string) ?? '0'
                        ).toFixed(2)}
                  </p>
                </div>
                <div className="pw-mt-5">
                  <p className="pw-text-sm pw-font-normal">
                    {translate('checkout>checkoutInfo>cashbackEarned')}
                  </p>
                  <p className="pw-text-sm pw-font-semibold">
                    {'R$'}
                    {parseFloat(productCache?.cashback ?? '').toFixed(2)}
                  </p>
                </div>
                <div className="pw-mt-5">
                  <p className="pw-text-sm pw-font-normal">
                    {translate('checkout>checkoutInfo>purchaseMadeOn')}
                  </p>
                  <p className="pw-text-sm pw-font-semibold">
                    {orderResponse?.createdAt
                      ? format(
                          new Date(
                            orderResponse?.createdAt ?? Date.now()
                          ),
                          'PPpp',
                          {
                            locale: locale === 'pt-BR' ? ptBR : enUS,
                          }
                        )
                      : null}
                  </p>
                </div>
                <div className="pw-mt-5">
                  {statusResponse?.deliverId ? (
                    <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
                      <QRCodeSVG value={String(codeQr)} size={84} />
                      <p className="pw-text-[20px] pw-font-semibold">
                        {statusResponse?.deliverId ?? ''}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="pw-text-base pw-font-semibold pw-text-center pw-text-black">
                        {translate(
                          'checkout>checkoutInfo>waitConfirmationPayment'
                        )}
                      </p>
                      <div className="pw-mt-5">
                        <Spinner className="pw-mx-auto" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="pw-text-xs pw-text-[#353945] ">
            {typeof checkoutMessage === 'string'
              ? checkoutMessage
              : productCache?.choosedPayment?.paymentMethod === 'transfer'
                ? translate('checkout>checkoutInfo>infoAboutAnalysis')
                : translate(
                    'checkout>components>checkoutInfo>infoAboutProcessing'
                  )}
          </p>
          <PriceAndGasInfo
            name={
              productCacheProducts && productCacheProducts?.length
                ? productCacheProducts[0]?.prices?.find(
                    (price: { currencyId: string }) =>
                      price?.currencyId === currencyIdFromQuery
                  )?.currency?.name
                : 'BRL'
            }
            loading={isLoading}
            className="pw-mt-4"
            payments={payments ?? productCachePayments}
          />
        </>
      )}
      <div
        className={`pw-flex ${
          isCoinPaymentLayout
            ? 'sm:pw-justify-start pw-justify-center'
            : 'pw-justify-start'
        }`}
      >
        <PixwayButton
          onClick={onActionButton}
          className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
        >
          {actionButtonLabel}
        </PixwayButton>
      </div>
    </div>
  );
}
