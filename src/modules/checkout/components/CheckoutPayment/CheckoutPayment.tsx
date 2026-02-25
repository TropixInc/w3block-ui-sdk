import { useEffect, useMemo } from 'react';
import { useDebounce, useLocalStorage } from 'react-use';

import Loading from '../../../shared/assets/icons/loading.svg';
import { WeblockButton } from '../../../shared/components/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useThemeConfig } from '../../../storefront/hooks/useThemeConfig';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { PaymentMethod } from '../../enum';
import { OrderPreviewCache, OrderPreviewResponse } from '../../interface/interface';
import {
  INPUTS_POSSIBLE,
  CheckoutPaymentComponent,
} from '../CheckoutPaymentComponent';
import { CheckouResume } from '../CheckoutResume';
import { ErrorMessage } from '../ErrorMessage';
import { FREE_ORDER_DEBOUNCE_MS } from './constants';
import { isStripeCacheValid, isStripeCacheMatchingProducts } from './utils';
import { useOrderPreview } from './useOrderPreview';
import { usePixPolling } from './usePixPolling';
import { usePaymentProcessor } from './usePaymentProcessor';
import { PixPaymentView } from './PixPaymentView';
import { FreeOrderView } from './FreeOrderView';
import { IframePaymentView } from './IframePaymentView';
import { StripePaymentView } from './StripePaymentView';

export const CheckoutPayment = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const [productCache, setProductCache] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);

  const isCoinPayment =
    router?.query?.coinPayment?.includes('true') ?? false;

  const { defaultTheme } = useThemeConfig();
  const coinPaymentCurrencyId = useMemo(
    () =>
      (router.query?.cryptoCurrencyId ??
        defaultTheme?.configurations?.contentData
          ?.coinPaymentCurrencyId) as string,
    [
      defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId,
      router.query?.cryptoCurrencyId,
    ]
  );

  const isFree = useMemo(
    () =>
      parseFloat(
        productCache?.payments?.filter(
          (e) => e.currencyId !== coinPaymentCurrencyId
        )[0]?.totalPrice ?? ''
      ) === 0,
    [productCache?.payments, coinPaymentCurrencyId]
  );

  const { errorPix, startPolling: startPixPolling, countdown } =
    usePixPolling({ productCache });

  const {
    loading,
    setLoading,
    requestError,
    clearRequestError,
    errorCode,
    stripeClientSecret,
    stripePublicKey,
    setStripeClientSecret,
    setStripePublicKey,
    pixImage,
    pixPayload,
    iframeLink,
    installment,
    setInstallment,
    processPayment,
    orderResponse,
    stripeOrderCache,
    deleteStripeCache,
  } = usePaymentProcessor({
    productCache,
    coinPaymentCurrencyId,
    isFree,
    isCoinPayment,
    onPixReady: startPixPolling,
  });

  const { myOrderPreview, stopPolling } = useOrderPreview({
    productCache,
    onPreviewUpdate: (data: OrderPreviewResponse) => {
      if (!productCache) return;
      setProductCache({
        ...productCache,
        signedGasFee: (data.gasFee as any)?.signature ?? undefined,
        gasFee: data.gasFee,
        clientServiceFee: data.clientServiceFee,
      });
    },
  });

  const handleProcessPayment = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val: any,
    allowSimilarPayment?: boolean
  ) => {
    stopPolling();
    processPayment(val, allowSimilarPayment);
  };

  useEffect(() => {
    if (!myOrderPreview) return;

    const provider = productCache?.choosedPayment?.paymentProvider;

    if (
      provider === PaymentMethod.ASAAS &&
      parseFloat(productCache?.totalPrice ?? '0') !== 0
    ) {
      setLoading(false);
      if (!installment) {
        setInstallment(
          productCache?.choosedPayment?.availableInstallments?.[0]
        );
      }
    } else if (provider === PaymentMethod.BRAZA) {
      setLoading(false);
    } else {
      stopPolling();
      if (provider === PaymentMethod.TRANSFER) {
        handleProcessPayment({});
      } else if (provider === PaymentMethod.STRIPE) {
        if (
          stripeOrderCache &&
          isStripeCacheValid(stripeOrderCache.timestamp) &&
          isStripeCacheMatchingProducts(stripeOrderCache, productCache!)
        ) {
          setLoading(false);
          setStripeClientSecret(stripeOrderCache.stripe.clientSecret);
          setStripePublicKey(stripeOrderCache.stripe.publicKey);
        } else {
          deleteStripeCache();
          handleProcessPayment({});
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myOrderPreview]);

  useDebounce(
    () => {
      if (
        isFree &&
        orderResponse === undefined &&
        (productCache?.totalPrice === '' || productCache?.totalPrice === '0')
      ) {
        handleProcessPayment({});
      }
    },
    FREE_ORDER_DEBOUNCE_MS
  );

  const isErc20 = productCache?.products?.[0]?.type === 'erc20';

  const renderPaymentMethod = () => {
    if (
      isFree ||
      productCache?.choosedPayment?.paymentMethod === 'transfer'
    ) {
      return <FreeOrderView requestError={requestError} />;
    }

    if (
      productCache?.choosedPayment?.paymentProvider === 'asaas' ||
      productCache?.choosedPayment?.paymentProvider === 'braza'
    ) {
      if (!iframeLink) {
        return (
          <div className="pw-container pw-mx-auto pw-h-full pw-px-0 sm:pw-px-4">
            <CheckoutPaymentComponent
              currency={
                productCache?.products?.[0]?.prices?.find(
                  (price: { currencyId: string }) =>
                    price?.currencyId === productCache?.currencyId
                )?.currency?.name ?? 'BRL'
              }
              installments={
                productCache?.choosedPayment?.availableInstallments
              }
              instalment={installment}
              setInstallment={setInstallment}
              loading={loading}
              error={requestError?.replaceAll(';', '\n')}
              buttonText={
                productCache?.choosedPayment?.paymentMethod === 'pix'
                  ? translate('checkout>checkoutPayment>advanceButton')
                  : translate(
                      'checkout>checkoutPayment>finishPurchaseButton'
                    )
              }
              onChange={() => clearRequestError()}
              onConcluded={(val, allowSimilarPayment) =>
                handleProcessPayment(val, allowSimilarPayment)
              }
              title={translate(
                'checkout>checkoutPayment>paymentInfoTitle'
              )}
              inputs={
                productCache?.choosedPayment?.inputs as INPUTS_POSSIBLE[]
              }
              buttonLoadingText={
                productCache?.choosedPayment?.paymentMethod === 'pix'
                  ? translate(
                      'checkout>checkoutPayment>generatePayment'
                    )
                  : translate(
                      'checkout>checkoutPayment>finalizingPurchase'
                    )
              }
              userCreditCards={
                productCache?.choosedPayment?.userCreditCards
              }
              errorCode={errorCode}
              quoteId={
                productCache?.choosedPayment?.providerData?.quoteId
              }
            />
          </div>
        );
      }

      return (
        <div className="pw-container pw-mx-auto pw-h-full pw-px-0 sm:pw-px-4">
          <PixPaymentView
            pixImage={pixImage}
            pixPayload={pixPayload}
            errorPix={errorPix}
            countdown={countdown}
          />
        </div>
      );
    }

    if (iframeLink) {
      return (
        <IframePaymentView
          iframeLink={iframeLink}
          paymentMethod={productCache?.choosedPayment?.paymentMethod}
          errorPix={errorPix}
          countdown={countdown}
        />
      );
    }

    if (stripeClientSecret && stripePublicKey) {
      return (
        <StripePaymentView
          clientSecret={stripeClientSecret}
          publicKey={stripePublicKey}
        />
      );
    }

    if (loading) {
      return (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <Loading className="pw-animate-spin -pw-mt-24 pw-h-15 pw-w-15" />
        </div>
      );
    }

    return (
      <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
        <ErrorMessage
          className="-pw-mt-24"
          message={translate(
            'checkout>components>warning>problemWithCheckout'
          )}
        />
      </div>
    );
  };

  return (
    <div className="pw-min-h-[95vh] pw-bg-[#F7F7F7] pw-pt-6 sm:pw-pt-10 pw-pb-10">
      <div className="pw-container pw-mx-auto">
        <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-6 pw-px-4 sm:pw-px-0">
          <div className="pw-order-1 sm:pw-order-2 pw-w-full sm:pw-w-[40%]">
            <CheckouResume
              payments={
                orderResponse !== undefined
                  ? orderResponse?.payments
                  : productCache?.payments
              }
              isCoinPayment={
                isCoinPayment &&
                !productCache?.acceptMultipleCurrenciesPurchase
              }
              destinationUser={productCache?.destinationUser?.name}
              price={
                orderResponse !== undefined
                  ? orderResponse.currencyAmount
                  : productCache?.cartPrice ?? '0'
              }
              currencyId={
                orderResponse !== undefined
                  ? orderResponse.currencyId
                  : productCache?.currencyId ?? ''
              }
              products={
                orderResponse !== undefined && isErc20
                  ? orderResponse?.products
                  : productCache?.products ?? []
              }
              gasFee={
                orderResponse !== undefined
                  ? orderResponse.gasFee
                  : myOrderPreview?.gasFee?.amount ?? '0'
              }
              service={
                orderResponse !== undefined
                  ? orderResponse.clientServiceFee
                  : myOrderPreview?.clientServiceFee ?? '0'
              }
              totalPrice={
                orderResponse !== undefined
                  ? (orderResponse.totalAmount as string)
                  : myOrderPreview?.totalPrice ?? '0'
              }
              loading={loading}
              originalPrice={
                orderResponse !== undefined
                  ? orderResponse.originalCurrencyAmount
                  : myOrderPreview?.originalCartPrice
              }
              originalService={myOrderPreview?.originalClientServiceFee}
              originalTotalPrice={
                orderResponse !== undefined
                  ? orderResponse.originalTotalAmount
                  : myOrderPreview?.originalTotalPrice
              }
              currency={productCache?.choosedPayment?.currency?.code}
              convertedPrice={
                productCache?.choosedPayment?.providerData?.brlAmount
              }
              productPreview={productCache}
            />
          </div>
          <div className="pw-order-2 sm:pw-order-1 pw-flex-1">
            {productCache?.choosedPayment?.paymentProvider !==
              PaymentMethod.ASAAS &&
            requestError &&
            requestError !== '' ? (
              <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center pw-mx-auto">
                  <p className="pw-font-bold pw-text-black pw-text-center pw-mb-6">
                    {translate(
                      'checkout>checkoutInfo>errorContactSuport'
                    )}
                  </p>
                  <ErrorMessage
                    title={requestError.toString()}
                    message={translate(
                      'checkout>checkoutPayment>contactSupportIfProblemPersists'
                    )}
                  />
                  <WeblockButton
                    className="pw-text-white pw-mt-4"
                    onClick={() =>
                      router.pushConnect(PixwayAppRoutes.HOME)
                    }
                  >
                    {translate('checkout>checkoutInfo>goBackHome')}
                  </WeblockButton>
                </div>
              </div>
            ) : (
              renderPaymentMethod()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
