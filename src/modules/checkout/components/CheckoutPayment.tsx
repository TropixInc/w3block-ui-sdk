/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SyntheticEvent,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useCopyToClipboard,
  useDebounce,
  useInterval,
  useLocalStorage,
} from 'react-use';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import _ from 'lodash';
import { QRCodeSVG } from 'qrcode.react';

import CopyIcon from '../../shared/assets/icons/copyIcon.svg';
import Loading from '../../shared/assets/icons/loading.svg';

import { Alert } from '../../shared/components/Alert';
import { Spinner } from '../../shared/components/Spinner';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import useCountdown from '../../shared/hooks/useCountdown';
import { useGetStorageData } from '../../shared/hooks/useGetStorageData';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { ThemeContext } from '../../storefront/contexts/ThemeContext';
import { useTrack } from '../../storefront/hooks/useTrack';
import { PRODUCT_CART_INFO_KEY, STRIPE_ORDER_CACHE, GIFT_DATA_INFO_KEY, ORDER_COMPLETED_INFO_KEY } from '../config/keys/localStorageKey';
import { PaymentMethod } from '../enum';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { OrderPreviewResponse, OrderPreviewCache, StripeCache, AvailableInstallmentInfo, CreateOrderResponse } from '../interface/interface';
import { INPUTS_POSSIBLE, CheckoutPaymentComponent } from './CheckoutPaymentComponent';
import { CheckouResume } from './CheckoutResume';
import { CheckoutStripeForm } from './CheckoutStripeForm';
import { ErrorMessage } from './ErrorMessage';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useLogError } from '../../shared/hooks/useLogError';
import useTranslation from '../../shared/hooks/useTranslation';


export const CheckoutPayment = () => {
  const {
    createOrder: createOrderHook,
    completeOrderPayment,
    getOrderPreview,
    getStatus,
  } = useCheckout();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setInputsValue] = useState<any>({});
  const context = useContext(ThemeContext);
  const [pixImage, setPixImage] = useState<string>();
  const [pixPayload, setPixPayload] = useState<string>();
  const [poolStatus, setPoolStatus] = useState<boolean>(false);
  const [myOrderPreview, setMyOrderPreview] =
    useState<OrderPreviewResponse | null>();
  const [stayPooling, setStayPooling] = useState<boolean>(true);
  const [firstPreview, setFirstPreview] = useState(true);
  const [orderId, setOrderId] = useState<string>();
  const [isStripe, setIsStripe] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  const iframeRef = useRef(null);
  const router = useRouterConnect();
  const isCoinPayment =
    router?.query?.coinPayment && router?.query?.coinPayment.includes('true')
      ? true
      : false;
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const [requestError, setRequestError] = useState<string>();
  const [errorCode, setErrorCode] = useState('');
  const profile = useProfile();
  const [sending, setSending] = useState<boolean>(false);
  const { companyId, appBaseUrl } = useCompanyConfig();
  const [iframeLink, setIframeLink] = useState('');
  const [errorPix, setErrorPix] = useState('');
  const { minutes, seconds, setNewCountdown, isActive } = useCountdown();
  const [countdown, setCountdown] = useState(true);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const [productCache, setProductCache] = useLocalStorage<OrderPreviewCache>(
    PRODUCT_CART_INFO_KEY
  );
  const [stripeOrderCache, setStripeOrderCache, deleteStripeCache] =
    useLocalStorage<StripeCache>(STRIPE_ORDER_CACHE);
  const giftData = useGetStorageData(
    GIFT_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );
  const track = useTrack();
  const { setCart } = useCart();
  const { data: session } = usePixwaySession();
  const [query] = useState('');
  const [installment, setInstallment] = useState<AvailableInstallmentInfo>();
  const [orderResponse, setOrderResponse] =
    useLocalStorage<CreateOrderResponse>(ORDER_COMPLETED_INFO_KEY);

  const compareDates = (date: Date) => {
    const currentDate = new Date();
    const timeDifference = Math.abs(
      Date.parse(currentDate.toString()) - Date.parse(date.toString())
    );
    const minutesDifference = timeDifference / (1000 * 60);

    return minutesDifference < 5;
  };

  useEffect(() => {
    if (myOrderPreview) {
      if (
        productCache?.choosedPayment?.paymentProvider == PaymentMethod.ASAAS &&
        parseFloat(productCache.totalPrice) !== 0
      ) {
        setLoading(false);
        if (!installment) {
          setInstallment(
            productCache.choosedPayment?.availableInstallments?.[0]
          );
        }
      } else if (
        productCache?.choosedPayment?.paymentProvider === PaymentMethod.BRAZA
      ) {
        setLoading(false);
      } else {
        setStayPooling(false);
        if (
          productCache?.choosedPayment?.paymentProvider ===
          PaymentMethod.TRANSFER
        ) {
          createOrder({});
        } else if (
          productCache?.choosedPayment?.paymentProvider === PaymentMethod.STRIPE
        ) {
          if (
            stripeOrderCache &&
            compareDates(stripeOrderCache?.timestamp) &&
            productCache?.products?.map((val) => val?.id).toString() ===
              stripeOrderCache?.productData
                ?.map((val: { id: string }) => val?.id)
                .toString() &&
            productCache.cartPrice === stripeOrderCache.amount
          ) {
            setLoading(false);
            setIsStripe(stripeOrderCache?.stripe?.clientSecret);
            setStripeKey(stripeOrderCache?.stripe?.publicKey);
          } else {
            deleteStripeCache();
            createOrder({});
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myOrderPreview]);

  useEffect(() => {
    if (poolStatus && orderId) {
      validatePixStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolStatus]);
  const validatePixStatus = async () => {
    if (poolStatus && orderId) {
      const interval = setInterval(() => {
        getStatus.mutate(
          { companyId, orderId },
          {
            onSuccess: (data: CreateOrderResponse) => {
              if (data.status === 'pending' && countdown) {
                setCountdown(false);
                setNewCountdown(new Date(data.expiresIn));
              } else if (
                data.status == 'concluded' ||
                data.status == 'delivering' ||
                data.status == 'waiting_delivery'
              ) {
                try {
                  if (
                    productCache?.products[0].type === 'erc20' &&
                    Boolean(
                      _.get(
                        productCache,
                        'products[0].draftData.keyErc20LoyaltyId'
                      )
                    )
                  ) {
                    track('purchase', {
                      currency:
                        productCache?.choosedPayment?.currency?.code ?? '',
                      value: data?.totalAmount,
                      items: productCache?.products.map((res) => {
                        return {
                          item_id: res.id,
                          item_variant: productCache?.destinationUser?.name,
                          item_name: 'Zuca',
                          quantity: 1,
                          prices: productCache.totalPrice,
                          value: data?.totalAmount,
                          destination: productCache?.destinationUser?.name,
                          payment_info: 'Pix',
                        };
                      }),
                    });
                  } else {
                    track('purchase', {
                      value: data?.totalAmount,
                      currency: data?.currency?.code,
                      items: productCache?.products.map((res) => {
                        return { item_id: res.id, item_name: res.name };
                      }),
                    });
                  }
                } catch (err) {
                  console.log('erro ao salvar o track', err);
                }

                clearInterval(interval);
                setPoolStatus(false);
                router.pushConnect(
                  PixwayAppRoutes.CHECKOUT_COMPLETED,
                  router.query
                );
              } else if (
                data.status === 'failed' ||
                data.status === 'cancelled'
              ) {
                clearInterval(interval);
                setPoolStatus(false);
                setErrorPix(
                  'Ocorreu um erro inesperado ao confirmar o seu pagamento. Caso já tenha efetuado o pagamento, por favor entre em contato com o suporte.'
                );
              } else if (data.status === 'expired') {
                clearInterval(interval);
                setPoolStatus(false);
                setErrorPix(
                  'Código PIX expirado. Por favor, refaça sua compra.'
                );
              }
            },
          }
        );
      }, 3000);
    }
  };

  useEffect(() => {
    if (productCache && stayPooling && firstPreview) {
      orderPreview();
      setFirstPreview(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCache]);

  const orderPreview = () => {
    if (productCache && stayPooling) {
      getOrderPreview.mutate(
        {
          productIds: productCache.orderProducts.map((p) => {
            const payload = p?.productTokenId
              ? {
                  productId: p.productId,
                  productTokenId: p?.productTokenId ?? '',
                  variantIds: p.variantIds,
                  quantity: p.quantity,
                  selectBestPrice: p.selectBestPrice,
                }
              : {
                  productId: p.productId,
                  variantIds: p.variantIds,
                  quantity: p.quantity,
                  selectBestPrice: p.selectBestPrice,
                };
            return payload;
          }),
          payments: [
            {
              currencyId: productCache.currencyId,
              amountType: 'percentage',
              amount: '100',
              paymentMethod: productCache?.choosedPayment?.paymentMethod,
            },
          ],
          currencyId: productCache.currencyId,
          companyId,
          couponCode: productCache.couponCode,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess(data: any) {
            setProductCache({
              ...productCache,
              signedGasFee: data.gasFee.signature
                ? data.gasFee.signature
                : undefined,
              gasFee: data.gasFee,
              clientServiceFee: data.clientServiceFee,
            });
            setMyOrderPreview(data);
          },
        }
      );
    }
  };

  useInterval(() => {
    if (stayPooling) {
      orderPreview();
    }
  }, 20000);

  useDebounce(() => {
    if (
      isFree &&
      orderResponse == undefined &&
      (productCache?.totalPrice === '' || productCache?.totalPrice === '0')
    ) {
      createOrder({});
    }
  }, 4000);

  const { defaultTheme } = useThemeConfig();
  const coinPaymentCurrencyId = useMemo(() => {
    return (
      router.query?.cryptoCurrencyId ??
      defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId
    );
  }, [
    defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId,
    router.query?.cryptoCurrencyId,
  ]);

  console.log(coinPaymentCurrencyId, "coinPaymentCurrencyId");
  console.log(defaultTheme, "defaultTheme");
  console.log(router.query.cryptoCurrencyId, "router.query.cryptoCurrencyId");
  console.log(router.query, "router.query");

  const isFree = useMemo(() => {
    // if (orderResponse !== undefined)
    // return parseFloat(orderResponse?.totalAmount as string) === 0;
    // else
    return (
      parseFloat(
        productCache?.payments?.filter(
          (e) => e.currencyId !== coinPaymentCurrencyId
        )[0]?.totalPrice ?? ''
      ) === 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderResponse]);

  const { logError } = useLogError();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createOrder = (val: any, allowSimilarPayment?: boolean) => {
    setLoading(true);
    setStayPooling(false);
    const orderInfo = productCache;
    const orderId = router?.query?.orderId as string;
    const completePayment = router?.query?.completePayment?.includes('true')
      ? true
      : false;
    if (orderInfo && !iframeLink && !sending && session && profile) {
      setSending(true);
      const inputs = { ...val };
      if (
        !(INPUTS_POSSIBLE.installments in val) &&
        productCache.choosedPayment?.inputs.includes(
          INPUTS_POSSIBLE.installments
        )
      ) {
        inputs[INPUTS_POSSIBLE.installments] = installment?.amount ?? 1;
      }
      const coinPayment = orderInfo?.payments?.filter(
        (e) => e.currencyId === coinPaymentCurrencyId
      );
      const destinationWalletAddress = () => {
        if (
          context?.defaultTheme?.configurations?.contentData
            ?.productsReturnToWallet &&
          context?.defaultTheme?.configurations?.contentData?.tenantWallet
        )
          return context?.defaultTheme?.configurations?.contentData
            ?.tenantWallet;
        else if (orderInfo?.destinationUser?.walletAddress)
          return orderInfo?.destinationUser?.walletAddress;
        else return profile.data?.data.mainWallet?.address ?? '';
      };
      if (orderId && completePayment) {
        completeOrderPayment.mutate(
          {
            companyId,
            completeOrder: {
              successUrl:
                appBaseUrl +
                PixwayAppRoutes.MY_TOKENS +
                '?' +
                query?.split('?')[0],
              payments: [
                {
                  currencyId: orderInfo.currencyId,
                  paymentMethod: orderInfo.choosedPayment?.paymentMethod,
                  paymentProvider: orderInfo.choosedPayment?.paymentProvider,
                  providerInputs: orderInfo.choosedPayment?.inputs
                    ? {
                        ...inputs,
                        transparent_checkout:
                          orderInfo.choosedPayment?.inputs?.includes(
                            'transparent_checkout'
                          ),
                      }
                    : undefined,
                  amountType: 'percentage',
                  amount: '100',
                },
              ],
            },
            orderId,
          },
          {
            onSuccess: (data: CreateOrderResponse) => {
              setLoading(true);
              setOrderResponse(data);
              setStayPooling(false);
              if (data.paymentProvider == PaymentMethod.STRIPE) {
                setIsStripe(data.paymentInfo.clientSecret ?? '');
                setStripeKey(data.paymentInfo.publicKey ?? '');
              } else {
                if (
                  productCache.choosedPayment?.paymentMethod == 'credit_card' ||
                  isFree
                ) {
                  try {
                    if (
                      productCache?.products[0].type === 'erc20' &&
                      Boolean(
                        _.get(
                          productCache,
                          'products[0].draftData.keyErc20LoyaltyId'
                        )
                      )
                    ) {
                      track('purchase', {
                        currency:
                          productCache?.choosedPayment?.currency?.code ?? '',
                        value: data?.totalAmount,
                        items: productCache?.products.map((res) => {
                          return {
                            item_id: res.id,
                            item_variant: productCache?.destinationUser?.name,
                            item_name: 'Zuca',
                            quantity: 1,
                            prices: data?.totalAmount,
                            value: data?.totalAmount,
                            destination: productCache?.destinationUser?.name,
                            payment_info: 'Cartão de credito',
                          };
                        }),
                      });
                    } else {
                      track('purchase', {
                        value: data?.totalAmount,
                        currency: data?.currency?.code,
                        items: productCache?.products.map((res) => {
                          return { item_id: res.id, item_name: res.name };
                        }),
                      });
                    }
                  } catch (err) {
                    console.log('erro ao salvar o track', err);
                  }

                  router.pushConnect(
                    PixwayAppRoutes.CHECKOUT_COMPLETED,
                    router.query
                  );
                } else {
                  const payment = data?.payments?.find(
                    (res) =>
                      res?.currency?.id ===
                        '65fe1119-6ec0-4b78-8d30-cb989914bdcb' ||
                      res?.currency?.id ===
                        '8c43ece8-99b0-4877-aed3-2170d2deb4bf'
                  );
                  if (payment?.paymentMethod === 'pix') {
                    setPixImage(payment?.publicData?.pix?.encodedImage ?? '');
                    setPixPayload(payment?.publicData?.pix?.payload ?? '');
                    setPoolStatus(true);
                    setOrderId(data.id);
                  }

                  setLoading(false);
                  setIframeLink(
                    payment?.publicData?.paymentUrl ??
                      payment?.publicData?.pix?.payload ??
                      ''
                  );
                }
              }
              setSending(false);
              if (router.query.cart && router.query.cart == 'true') {
                setCart([]);
              }
            },
            onError: (err: any) => {
              if (err.errorCode === 'similar-order-not-accepted') {
                setErrorCode(err.errorCode);
              } else if (
                err.errorCode ===
                'braza-email-already-attached-to-other-cpf-error'
              ) {
                setRequestError(
                  'Este e-mail já foi vinculado a outro CPF em uma compra anterior. Por favor, utilize o mesmo CPF ou crie uma nova conta.'
                );
              } else if (
                err.errorCode ===
                'braza-phone-already-attached-to-other-cpf-error'
              ) {
                setRequestError(
                  'Este telefone já foi vinculado a outro CPF em uma compra anterior. Por favor, utilize o mesmo CPF ou crie uma nova conta.'
                );
              } else {
                setRequestError(
                  err.message
                    .toString()
                    .includes('Informe o endereço do titular do cartão.')
                    ? 'Por favor, insira um CEP válido.'
                    : err.message.toString()
                );
              }
              logError && logError(err);
              setSending(false);
              setLoading(false);
            },
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
              providerInputs: orderInfo.choosedPayment?.inputs
                ? {
                    ...inputs,
                    transparent_checkout:
                      orderInfo.choosedPayment?.inputs?.includes(
                        'transparent_checkout'
                      ),
                  }
                : undefined,
              destinationWalletAddress: destinationWalletAddress(),
              successUrl:
                appBaseUrl +
                PixwayAppRoutes.MY_TOKENS +
                '?' +
                query?.split('?')[0],
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
              payments: orderInfo.isCoinPayment
                ? coinPayment?.length && coinPayment?.length > 0
                  ? isFree
                    ? [
                        {
                          currencyId: coinPaymentCurrencyId,
                          paymentMethod: 'crypto',
                          amountType: 'percentage',
                          amount: '100',
                        },
                      ]
                    : [
                        {
                          currencyId: orderInfo.currencyId,
                          paymentMethod:
                            orderInfo.choosedPayment?.paymentMethod,
                          paymentProvider:
                            orderInfo.choosedPayment?.paymentProvider,
                          providerInputs: orderInfo.choosedPayment?.inputs
                            ? {
                                ...inputs,
                                transparent_checkout:
                                  orderInfo.choosedPayment?.inputs?.includes(
                                    'transparent_checkout'
                                  ),
                              }
                            : undefined,
                          amountType: 'all_remaining',
                        },
                        {
                          currencyId: coinPaymentCurrencyId,
                          paymentMethod: 'crypto',
                          amountType: 'fixed',
                          amount: coinPayment?.[0]?.totalPrice,
                        },
                      ]
                  : [
                      {
                        currencyId: orderInfo.currencyId,
                        paymentMethod: orderInfo.choosedPayment?.paymentMethod,
                        paymentProvider:
                          orderInfo.choosedPayment?.paymentProvider,
                        providerInputs: orderInfo.choosedPayment?.inputs
                          ? {
                              ...inputs,
                              transparent_checkout:
                                orderInfo.choosedPayment?.inputs?.includes(
                                  'transparent_checkout'
                                ),
                            }
                          : undefined,
                        amountType: 'all_remaining',
                      },
                      {
                        currencyId:
                          orderInfo.cryptoCurrencyId ?? coinPaymentCurrencyId,
                        paymentMethod: 'crypto',
                        amountType: 'fixed',
                        amount: '0',
                      },
                    ]
                : [
                    {
                      currencyId: orderInfo.currencyId,
                      paymentMethod: orderInfo.choosedPayment?.paymentMethod,
                      paymentProvider:
                        orderInfo.choosedPayment?.paymentProvider,
                      providerInputs: orderInfo.choosedPayment?.inputs
                        ? {
                            ...inputs,
                            transparent_checkout:
                              orderInfo.choosedPayment?.inputs?.includes(
                                'transparent_checkout'
                              ),
                          }
                        : undefined,
                      amountType: 'percentage',
                      amount: '100',
                    },
                  ],
            },
          },
          {
            onSuccess: (data: CreateOrderResponse) => {
              setLoading(true);
              setOrderResponse(data);
              setStayPooling(false);
              deleteStripeCache();
              if (data.paymentProvider == PaymentMethod.STRIPE) {
                setStripeOrderCache({
                  productData: productCache.products,
                  amount: data.currencyAmount,
                  stripe: {
                    clientSecret: data.paymentInfo.clientSecret ?? '',
                    publicKey: data.paymentInfo.publicKey ?? '',
                  },
                  timestamp: new Date(),
                });
                setIsStripe(data.paymentInfo.clientSecret ?? '');
                setStripeKey(data.paymentInfo.publicKey ?? '');
                setLoading(false);
              } else {
                if (
                  productCache.choosedPayment?.paymentMethod == 'credit_card' ||
                  isFree ||
                  productCache?.choosedPayment?.paymentMethod === 'transfer'
                ) {
                  try {
                    if (
                      productCache?.products[0].type === 'erc20' &&
                      Boolean(
                        _.get(
                          productCache,
                          'products[0].draftData.keyErc20LoyaltyId'
                        )
                      )
                    ) {
                      track('purchase', {
                        currency:
                          productCache?.choosedPayment?.currency?.code ?? '',
                        value: data?.totalAmount,
                        items: productCache?.products.map((res) => {
                          return {
                            item_id: res.id,
                            item_variant: productCache?.destinationUser?.name,
                            item_name: 'Zuca',
                            quantity: 1,
                            prices: data?.totalAmount,
                            value: data?.totalAmount,
                            destination: productCache?.destinationUser?.name,
                            payment_info: 'Cartão de credito',
                          };
                        }),
                      });
                    } else {
                      track('purchase', {
                        value: data?.totalAmount,
                        currency: data?.currency?.code,
                        items: productCache?.products.map((res) => {
                          return { item_id: res.id, item_name: res.name };
                        }),
                      });
                    }
                  } catch (err) {
                    console.log('erro ao salvar o track', err);
                  }

                  router.pushConnect(
                    PixwayAppRoutes.CHECKOUT_COMPLETED,
                    router.query
                  );
                } else {
                  const payment = data?.payments?.find(
                    (res) =>
                      res?.currency?.id ===
                        '65fe1119-6ec0-4b78-8d30-cb989914bdcb' ||
                      res?.currency?.id ===
                        '8c43ece8-99b0-4877-aed3-2170d2deb4bf'
                  );
                  if (payment?.paymentMethod === 'pix') {
                    setPixImage(payment?.publicData?.pix?.encodedImage ?? '');
                    setPixPayload(payment?.publicData?.pix?.payload ?? '');
                    setPoolStatus(true);
                    setOrderId(data.id);
                  }

                  setLoading(false);
                  setIframeLink(
                    payment?.publicData?.paymentUrl ??
                      payment?.publicData?.pix?.payload ??
                      ''
                  );
                }
              }
              setSending(false);
              if (router.query.cart && router.query.cart == 'true') {
                setCart([]);
              }
            },
            onError: (err: any) => {
              console.log('err', err);
              if (err.errorCode === 'similar-order-not-accepted') {
                setErrorCode(err.errorCode);
              } else if (
                err.errorCode ===
                'braza-email-already-attached-to-other-cpf-error'
              ) {
                setRequestError(
                  'Este e-mail já foi vinculado a outro CPF em uma compra anterior. Por favor, utilize o mesmo CPF ou crie uma nova conta.'
                );
              } else if (
                err.errorCode ===
                'braza-phone-already-attached-to-other-cpf-error'
              ) {
                setRequestError(
                  'Este telefone já foi vinculado a outro CPF em uma compra anterior. Por favor, utilize o mesmo CPF ou crie uma nova conta.'
                );
              } else {
                setRequestError(
                  err.message
                    .toString()
                    .includes('Informe o endereço do titular do cartão.')
                    ? 'Por favor, insira um CEP válido.'
                    : err.message.toString()
                );
              }
              logError && logError(err);
              setSending(false);
              setLoading(false);
            },
          }
        );
      }
    } else if (!session || !profile) {
      router.pushConnect(PixwayAppRoutes.SIGN_IN + query);
    }
  };

  const [, copyClp] = useCopyToClipboard();

  const stripePromise = useMemo(() => {
    if (isStripe != '' && stripeKey != '') {
      return loadStripe(stripeKey);
    } else return null;
  }, [isStripe, stripeKey]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const concluded = (val: any, allowSimilarPayment?: boolean) => {
    createOrder(val, allowSimilarPayment);
  };
  const isErc20 = productCache?.products?.[0]?.type === 'erc20';
  const WichPaymentMethod = () => {
    if (isFree || productCache?.choosedPayment?.paymentMethod === 'transfer') {
      return !requestError ? (
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10">
          <Spinner className="pw-h-13 pw-w-13" />
          <h1 className="pw-text-2xl pw-text-black pw-mt-4">
            {translate('checkout>checkoutPayment>finalizingOrder')}
          </h1>
        </div>
      ) : (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <ErrorMessage
            title={requestError.toString()}
            message={translate('checkout>checkoutInfo>errorContactSuport')}
          />
        </div>
      );
    } else if (
      productCache?.choosedPayment?.paymentProvider == 'asaas' ||
      productCache?.choosedPayment?.paymentProvider == 'braza'
    ) {
      return (
        <div className="pw-container pw-mx-auto pw-h-full pw-px-0 sm:pw-px-4">
          {!iframeLink ? (
            <CheckoutPaymentComponent
              currency={
                productCache.products?.[0]?.prices.find(
                  (price: { currencyId: string; }) => price?.currencyId == productCache?.currencyId
                )?.currency?.name ?? 'BRL'
              }
              installments={productCache.choosedPayment?.availableInstallments}
              instalment={installment}
              setInstallment={(val) => setInstallment(val)}
              loading={loading}
              error={requestError?.replaceAll(';', '\n')}
              buttonText={
                productCache.choosedPayment.paymentMethod == 'pix'
                  ? 'Avançar'
                  : 'Finalizar compra'
              }
              onChange={(val) => {
                setInputsValue(val);
                setRequestError('');
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onConcluded={(val: any, allowSimilarPayment?: boolean) => {
                setInputsValue(val);
                concluded(val, allowSimilarPayment);
              }}
              title="Informações para pagamento"
              inputs={productCache?.choosedPayment?.inputs as INPUTS_POSSIBLE[]}
              buttonLoadingText={
                productCache?.choosedPayment?.paymentMethod == 'pix'
                  ? translate('checkout>checkoutPayment>generatePayment')
                  : translate('checkout>checkoutPayment>finalizingPurchase')
              }
              userCreditCards={productCache?.choosedPayment?.userCreditCards}
              errorCode={errorCode}
              quoteId={productCache?.choosedPayment?.providerData?.quoteId}
            />
          ) : (
            <div className="pw-bg-white pw-p-4 sm:pw-p-6 pw-flex pw-justify-center pw-items-center pw-shadow-brand-shadow pw-rounded-lg">
              <div className="pw-flex pw-justify-center pw-items-center pw-h-full">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10 sm:pw-mt-15 sm:pw-mb-15 pw-mb-10 pw-px-4">
                  {errorPix !== '' ? (
                    <Alert variant="error" className="!pw-gap-3">
                      <Alert.Icon />
                      {errorPix}
                    </Alert>
                  ) : (
                    <>
                      <p className="pw-text-center pw-max-w-[450px] pw-text-slate-500 pw-text-sm pw-font-[500] pw-mx-auto pw-mt-4">
                        {translate(
                          'checkout>checkoutPayment>deliveryItemsExplain'
                        )}
                      </p>
                      {isActive && (
                        <div className="pw-flex pw-gap-2 pw-text-black pw-font-bold pw-mt-6">
                          <p>
                            {translate(
                              'checkout>checkoutPayment>purchaseExpireOn'
                            )}
                            :
                          </p>
                          {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                        </div>
                      )}
                      <p className="pw-text-center pw-font-normal pw-text-black pw-mt-6">
                        {translate('checkout>checkoutPayment>scanCode')}
                      </p>
                      {pixImage ? (
                        <img src={`data:image/png;base64, ${pixImage}`} />
                      ) : (
                        <QRCodeSVG
                          value={String(pixPayload)}
                          size={300}
                          className="pw-my-6"
                        />
                      )}
                      {pixPayload && (
                        <>
                          <p className="pw-text-center pw-text-xs pw-text-slate-600">
                            {translate('checkout>checkoutPayment>copyCode')}
                          </p>
                          <p
                            onClick={() => {
                              setCopied(true);
                              copyClp(pixPayload);
                            }}
                            className="pw-flex pw-gap-2 pw-text-center pw-text-brand-primary pw-text-xs pw-cursor-pointer pw-px-6 pw-mb-8 hover:pw-font-[900] pw-break-all"
                          >
                            {pixPayload}
                            <CopyIcon
                              width={isMobile ? 60 : 35}
                              height={isMobile ? 60 : 35}
                            />
                          </p>
                          {copied && (
                            <Alert variant="success" className="!pw-gap-3">
                              <Alert.Icon />
                              {translate('checkout>checkoutPayment>codeCopied')}
                            </Alert>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (iframeLink) {
      return (
        <>
          {productCache?.choosedPayment?.paymentMethod === 'pix' &&
          errorPix !== '' ? (
            <Alert variant="error" className="!pw-gap-3">
              <Alert.Icon />
              {errorPix}
            </Alert>
          ) : (
            <>
              {productCache?.choosedPayment?.paymentMethod === 'pix' && (
                <p className="pw-text-center pw-max-w-[450px] pw-text-sm pw-mx-auto pw-mt-4">
                  {translate('checkout>checkoutPayment>deliveryItemsExplain')}
                </p>
              )}

              <iframe
                onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
                  if (
                    e.currentTarget.contentWindow?.location.hostname ===
                    window?.location.hostname
                  ) {
                    router.pushConnect(
                      PixwayAppRoutes.CHECKOUT_COMPLETED,
                      router.query
                    );
                  }
                }}
                ref={iframeRef}
                className="pw-w-full pw-min-h-screen"
                src={iframeLink}
              />
              {isActive && (
                <div className="pw-flex pw-gap-2 pw-text-black pw-font-bold pw-mt-6">
                  <p>
                    {translate('checkout>checkoutPayment>purchaseExpireOn')}:
                  </p>
                  {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                </div>
              )}
            </>
          )}
        </>
      );
    } else if (isStripe && stripePromise) {
      return (
        <div>
          <Elements stripe={stripePromise} options={{ clientSecret: isStripe }}>
            <CheckoutStripeForm />
          </Elements>
        </div>
      );
    } else if (loading) {
      return (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <Loading className="pw-animate-spin -pw-mt-24 pw-h-15 pw-w-15" />
        </div>
      );
    } else {
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
    }
  };

  console.log('productCache', productCache);
  console.log(requestError, "requestError");

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
                isCoinPayment && !productCache?.acceptMultipleCurrenciesPurchase
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
            {productCache?.choosedPayment?.paymentProvider !=
              PaymentMethod.ASAAS &&
            requestError &&
            requestError != '' ? (
              <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center pw-mx-auto">
                  <p className="pw-font-bold pw-text-black pw-text-center pw-mb-6">
                    {translate('checkout>checkoutInfo>errorContactSuport')}
                  </p>
                  <ErrorMessage
                    title={requestError.toString()}
                    message="Caso o problema persista entre em contato com o suporte"
                  />
                  <WeblockButton
                    className="pw-text-white pw-mt-4"
                    onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
                  >
                    {translate('checkout>checkoutInfo>goBackHome')}
                  </WeblockButton>
                </div>
              </div>
            ) : (
              WichPaymentMethod()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
