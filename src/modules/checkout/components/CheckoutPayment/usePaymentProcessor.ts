/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { ThemeContext } from '../../../storefront/contexts/ThemeContext';
import { useTrack } from '../../../storefront/hooks/useTrack';
import { useLogError } from '../../../shared/hooks/useLogError';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';
import { useGetStorageData } from '../../../shared/hooks/useGetStorageData';
import {
  GIFT_DATA_INFO_KEY,
  ORDER_COMPLETED_INFO_KEY,
  STRIPE_ORDER_CACHE,
} from '../../config/keys/localStorageKey';
import {
  AvailableInstallmentInfo,
  CreateOrderResponse,
  OrderPreviewCache,
  StripeCache,
} from '../../interface/interface';
import { PaymentMethod } from '../../enum';
import { INPUTS_POSSIBLE } from '../CheckoutPaymentComponent';
import {
  buildProviderInputs,
  buildOrderPayments,
  buildTrackPurchaseData,
  findBrlPayment,
} from './utils';

interface UsePaymentProcessorParams {
  productCache: OrderPreviewCache | undefined;
  coinPaymentCurrencyId: string;
  isFree: boolean;
  isCoinPayment: boolean;
  onPixReady: (orderId: string) => void;
}

export function usePaymentProcessor({
  productCache,
  coinPaymentCurrencyId,
  isFree,
  isCoinPayment,
  onPixReady,
}: UsePaymentProcessorParams) {
  const { createOrder: createOrderHook, completeOrderPayment } = useCheckout();
  const context = useContext(ThemeContext);
  const router = useRouterConnect();
  const profile = useProfile();
  const { data: session } = usePixwaySession();
  const { companyId, appBaseUrl } = useCompanyConfig();
  const track = useTrack();
  const [translate] = useTranslation();
  const { logError } = useLogError();
  const { setCart } = useCart();
  const giftData = useGetStorageData(
    GIFT_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );

  const [stripeOrderCache, setStripeOrderCache, deleteStripeCache] =
    useLocalStorage<StripeCache>(STRIPE_ORDER_CACHE);
  const [orderResponse, setOrderResponse] =
    useLocalStorage<CreateOrderResponse>(ORDER_COMPLETED_INFO_KEY);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const [errorCode, setErrorCode] = useState('');
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [pixImage, setPixImage] = useState<string>();
  const [pixPayload, setPixPayload] = useState<string>();
  const [iframeLink, setIframeLink] = useState('');
  const [installment, setInstallment] = useState<AvailableInstallmentInfo>();

  const clearRequestError = () => setRequestError('');

  const handleTrackAndRedirect = (
    data: CreateOrderResponse,
    paymentLabel: string
  ) => {
    if (!productCache) return;
    try {
      const trackData = buildTrackPurchaseData({
        productCache,
        orderData: data,
        paymentLabel,
      });
      track('purchase', trackData);
    } catch {
      /* tracking não-crítico */
    }
    router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED, router.query);
  };

  const handlePixPayment = (data: CreateOrderResponse) => {
    const payment = findBrlPayment(data.payments);
    if (payment?.paymentMethod === 'pix') {
      setPixImage(payment?.publicData?.pix?.encodedImage ?? '');
      setPixPayload(payment?.publicData?.pix?.payload ?? '');
      onPixReady(data.id);
    }
    setLoading(false);
    setIframeLink(
      payment?.publicData?.paymentUrl ??
        payment?.publicData?.pix?.payload ??
        ''
    );
  };

  const clearCartIfNeeded = () => {
    if (router.query.cart && router.query.cart === 'true') {
      setCart([]);
    }
  };

  const handleCompleteOrderSuccess = (data: CreateOrderResponse) => {
    setLoading(true);
    setOrderResponse(data);

    if (data.paymentProvider === PaymentMethod.STRIPE) {
      setStripeClientSecret(data.paymentInfo.clientSecret ?? '');
      setStripePublicKey(data.paymentInfo.publicKey ?? '');
    } else if (
      productCache?.choosedPayment?.paymentMethod === 'credit_card' ||
      isFree
    ) {
      handleTrackAndRedirect(data, 'Cartão de credito');
    } else {
      handlePixPayment(data);
    }

    setSending(false);
    clearCartIfNeeded();
  };

  const handleCreateOrderSuccess = (data: CreateOrderResponse) => {
    setLoading(true);
    setOrderResponse(data);
    deleteStripeCache();

    if (data.paymentProvider === PaymentMethod.STRIPE) {
      setStripeOrderCache({
        productData: productCache!.products,
        amount: data.currencyAmount,
        stripe: {
          clientSecret: data.paymentInfo.clientSecret ?? '',
          publicKey: data.paymentInfo.publicKey ?? '',
        },
        timestamp: new Date(),
      });
      setStripeClientSecret(data.paymentInfo.clientSecret ?? '');
      setStripePublicKey(data.paymentInfo.publicKey ?? '');
      setLoading(false);
    } else if (
      productCache?.choosedPayment?.paymentMethod === 'credit_card' ||
      isFree ||
      productCache?.choosedPayment?.paymentMethod === 'transfer'
    ) {
      handleTrackAndRedirect(data, 'Cartão de credito');
    } else {
      handlePixPayment(data);
    }

    setSending(false);
    clearCartIfNeeded();
  };

  const handleOrderError = (err: any) => {
    if (err.errorCode === 'similar-order-not-accepted') {
      setErrorCode(err.errorCode);
    } else if (
      err.errorCode === 'braza-email-already-attached-to-other-cpf-error'
    ) {
      setRequestError(
        translate('checkout>checkoutPayment>brazaEmailAttachedToOtherCpf')
      );
    } else if (
      err.errorCode === 'braza-phone-already-attached-to-other-cpf-error'
    ) {
      setRequestError(
        translate('checkout>checkoutPayment>brazaPhoneAttachedToOtherCpf')
      );
    } else {
      const msg = err.message?.toString() ?? '';
      setRequestError(
        msg.includes('Informe o endereço do titular do cartão.')
          ? translate('checkout>checkoutPayment>pleaseInsertValidZipcode')
          : msg
      );
    }
    logError?.(err);
    setSending(false);
    setLoading(false);
  };

  const resolveDestinationWallet = (orderInfo: OrderPreviewCache): string => {
    const contentData =
      context?.defaultTheme?.configurations?.contentData;
    if (contentData?.productsReturnToWallet && contentData?.tenantWallet) {
      return contentData.tenantWallet;
    }
    if (orderInfo?.destinationUser?.walletAddress) {
      return orderInfo.destinationUser.walletAddress;
    }
    return profile.data?.data.mainWallet?.address ?? '';
  };

  const processPayment = (val: any, allowSimilarPayment?: boolean) => {
    setLoading(true);
    const orderInfo = productCache;
    const queryOrderId = router?.query?.orderId as string;
    const isCompletePayment =
      router?.query?.completePayment?.includes('true') ?? false;

    if (!orderInfo || iframeLink || sending || !session || !profile) {
      if (!session || !profile) {
        router.pushConnect(PixwayAppRoutes.SIGN_IN);
      }
      return;
    }

    setSending(true);

    const inputs = { ...val };
    if (
      !(INPUTS_POSSIBLE.installments in val) &&
      productCache?.choosedPayment?.inputs.includes(
        INPUTS_POSSIBLE.installments
      )
    ) {
      inputs[INPUTS_POSSIBLE.installments] = installment?.amount ?? 1;
    }

    const coinPayment = orderInfo?.payments?.filter(
      (e) => e.currencyId === coinPaymentCurrencyId
    );

    if (queryOrderId && isCompletePayment) {
      completeOrderPayment.mutate(
        {
          companyId,
          completeOrder: {
            successUrl: appBaseUrl + PixwayAppRoutes.MY_TOKENS,
            payments: [
              {
                currencyId: orderInfo.currencyId,
                paymentMethod: orderInfo.choosedPayment?.paymentMethod,
                paymentProvider: orderInfo.choosedPayment?.paymentProvider,
                providerInputs: buildProviderInputs(
                  orderInfo.choosedPayment?.inputs,
                  inputs
                ),
                amountType: 'percentage',
                amount: '100',
              },
            ],
          },
          orderId: queryOrderId,
        },
        {
          onSuccess: handleCompleteOrderSuccess,
          onError: handleOrderError,
        }
      );
    } else {
      createOrderHook.mutate(
        {
          companyId,
          createOrder: {
            acceptSimilarOrderInShortPeriod: allowSimilarPayment,
            orderProducts: orderInfo.orderProducts,
            signedGasFee: orderInfo.signedGasFee,
            currencyId: orderInfo.currencyId,
            paymentMethod: orderInfo.choosedPayment?.paymentMethod,
            providerInputs: buildProviderInputs(
              orderInfo.choosedPayment?.inputs,
              inputs
            ),
            destinationWalletAddress: resolveDestinationWallet(orderInfo),
            successUrl: appBaseUrl + PixwayAppRoutes.MY_TOKENS,
            couponCode: orderInfo.couponCode,
            passShareCodeData:
              orderInfo?.products?.[0]?.settings?.passShareCodeConfig
                ?.enabled && giftData
                ? giftData === 'selfBuy'
                  ? {
                      destinationUserName: profile?.data?.data?.name ?? '',
                      destinationUserEmail: profile?.data?.data?.email ?? '',
                    }
                  : giftData
                : {},
            payments: buildOrderPayments({
              orderInfo,
              inputs,
              isCoinPayment,
              isFree,
              coinPaymentCurrencyId,
              coinPayment,
            }),
          },
        },
        {
          onSuccess: handleCreateOrderSuccess,
          onError: handleOrderError,
        }
      );
    }
  };

  return {
    loading,
    setLoading,
    sending,
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
  };
}
