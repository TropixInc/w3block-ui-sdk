/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard, useInterval, useLocalStorage } from 'react-use';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useProfile } from '../../../shared';
import { ReactComponent as CopyIcon } from '../../../shared/assets/icons/copyIcon.svg';
import { ReactComponent as Loading } from '../../../shared/assets/icons/loading.svg';
import { Alert } from '../../../shared/components/Alert';
import { Spinner } from '../../../shared/components/Spinner';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import {
  ORDER_COMPLETED_INFO_KEY,
  PRODUCT_CART_INFO_KEY,
} from '../../config/keys/localStorageKey';
import { PaymentMethod } from '../../enum';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import {
  AvailableInstallmentInfo,
  CreateOrderResponse,
  OrderPreviewCache,
  OrderPreviewResponse,
} from '../../interface/interface';
import {
  CheckoutPaymentComponent,
  INPUTS_POSSIBLE,
} from '../CheckoutPaymentComponent/CheckoutPaymentComponent';
import { CheckouResume } from '../CheckoutResume/CheckoutResume';
import { CheckoutStripeForm } from '../CheckoutStripeForm/CheckoutStripeForm';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export const CheckoutPayment = () => {
  const {
    createOrder: createOrderHook,
    getOrderPreview,
    getStatus,
  } = useCheckout();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setInputsValue] = useState<any>({});
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
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const [requestError, setRequestError] = useState<string>();
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
  const { setCart } = useCart();
  const { data: session } = usePixwaySession();
  const [query] = useState('');
  const [installment, setInstallment] = useState<AvailableInstallmentInfo>();
  const [orderResponse, setOrderResponse] =
    useLocalStorage<CreateOrderResponse>(ORDER_COMPLETED_INFO_KEY);
  useEffect(() => {
    if (myOrderPreview) {
      if (
        productCache?.choosedPayment?.paymentProvider == PaymentMethod.ASAAS &&
        parseFloat(productCache.totalPrice) !== 0
      ) {
        if (!installment) {
          setInstallment(
            productCache.choosedPayment?.availableInstallments?.[0]
          );
        }

        setLoading(false);
      } else {
        setStayPooling(false);
        createOrder({});
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
                clearInterval(interval);
                setPoolStatus(false);
                router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
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
            const payload = {
              productId: p.productId,
              variantIds: p.variantIds,
            };
            return payload;
          }),
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
              cartPrice: data.cartPrice,
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

  const isFree = useMemo(() => {
    if (orderResponse !== undefined)
      return parseFloat(orderResponse.totalAmount) === 0;
    else return parseFloat(productCache?.totalPrice ?? '') === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderResponse]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createOrder = (val: any) => {
    setLoading(true);
    const orderInfo = productCache;
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

      createOrderHook.mutate(
        {
          companyId,
          createOrder: {
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
            destinationWalletAddress:
              profile.data?.data.mainWallet?.address ?? '',
            successUrl:
              appBaseUrl +
              PixwayAppRoutes.MY_TOKENS +
              '?' +
              query.split('?')[0],
            couponCode: orderInfo.couponCode,
          },
        },
        {
          onSuccess: (data: CreateOrderResponse) => {
            setOrderResponse(data);
            setStayPooling(false);
            setLoading(false);
            if (data.paymentProvider == PaymentMethod.STRIPE) {
              setIsStripe(data.paymentInfo.clientSecret ?? '');
              setStripeKey(data.paymentInfo.publicKey ?? '');
            } else {
              if (
                productCache.choosedPayment?.paymentMethod == 'credit_card' ||
                isFree
              ) {
                router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
              } else {
                if ('pix' in data.paymentInfo) {
                  setPixImage(data.paymentInfo.pix?.encodedImage ?? '');
                  setPixPayload(data.paymentInfo.pix?.payload ?? '');
                  setPoolStatus(true);
                  setOrderId(data.id);
                }

                setIframeLink(data.paymentInfo.paymentUrl ?? '');
              }
            }
            setSending(false);
            if (router.query.cart && router.query.cart == 'true') {
              setCart([]);
            }
          },
          onError: (err: any) => {
            setSending(false);
            setLoading(false);
            setRequestError(
              err.message
                .toString()
                .includes('Informe o endereço do titular do cartão.')
                ? 'Por favor, insira um CEP válido.'
                : err.message.toString()
            );
          },
        }
      );
    } else if (!session || !profile) {
      router.pushConnect(PixwayAppRoutes.SIGN_IN + query);
    }
  };

  const [_, copyClp] = useCopyToClipboard();

  const stripePromise = useMemo(() => {
    if (isStripe != '' && stripeKey != '') {
      return loadStripe(stripeKey);
    } else return null;
  }, [isStripe, stripeKey]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const concluded = (val: any) => {
    createOrder(val);
  };

  const WichPaymentMethod = () => {
    if (isFree) {
      return !requestError ? (
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10">
          <Spinner className="pw-h-13 pw-w-13" />
          <h1 className="pw-text-2xl pw-text-black pw-mt-4">
            Finalizando Pedido
          </h1>
        </div>
      ) : (
        <div className="pw-h-screen pw-flex pw-items-center pw-justify-center">
          <ErrorMessage
            title={requestError.toString()}
            message="Caso o problema persista entre em contato com o suporte"
          />
        </div>
      );
    } else if (productCache?.choosedPayment?.paymentProvider == 'asaas') {
      return (
        <div className="pw-container pw-mx-auto pw-h-full pw-px-0 sm:pw-px-4">
          {!iframeLink ? (
            <CheckoutPaymentComponent
              currency={
                productCache.products[0].prices.find(
                  (price) => price.currencyId == productCache.currencyId
                )?.currency.name ?? 'BRL'
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
              onConcluded={(val: any) => {
                setInputsValue(val);
                concluded(val);
              }}
              title="Informações para pagamento"
              inputs={productCache.choosedPayment.inputs as INPUTS_POSSIBLE[]}
              buttonLoadingText={
                productCache.choosedPayment.paymentMethod == 'pix'
                  ? 'Gerando pagamento'
                  : 'Finalizando compra'
              }
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
                        Após a conclusão do pagamento, em alguns minutos você
                        poderá visualizar os itens comprados em sua carteira.
                      </p>
                      {isActive && (
                        <div className="pw-flex pw-gap-2 pw-text-black pw-font-bold pw-mt-6">
                          <p>Essa compra expira em:</p>
                          {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                        </div>
                      )}
                      <p className="pw-text-center pw-font-normal pw-text-black pw-mt-6">
                        Escaneie o QR Code abaixo para realizar o pagamento
                      </p>
                      {pixImage && (
                        <img src={`data:image/png;base64, ${pixImage}`} />
                      )}
                      {pixPayload && (
                        <>
                          <p className="pw-text-center pw-text-xs pw-text-slate-600">
                            Caso prefira copie o código abaixo
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
                              Código copiado!
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
                  Após a conclusão do pagamento, em alguns minutos você poderá
                  visualizar os itens comprados em sua carteira.
                </p>
              )}

              <iframe
                onLoad={(e: SyntheticEvent<HTMLIFrameElement>) => {
                  if (
                    e.currentTarget.contentWindow?.location.hostname ===
                    window?.location.hostname
                  ) {
                    router.pushConnect(
                      PixwayAppRoutes.CHECKOUT_COMPLETED + query
                    );
                  }
                }}
                ref={iframeRef}
                className="pw-w-full pw-min-h-screen"
                src={iframeLink}
              />
              {isActive && (
                <div className="pw-flex pw-gap-2 pw-text-black pw-font-bold pw-mt-6">
                  <p>Essa compra expira em:</p>
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

  return (
    <div className="pw-min-h-[95vh] pw-bg-[#F7F7F7] pw-pt-6 sm:pw-pt-10 pw-pb-10">
      <div className="pw-container pw-mx-auto">
        <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-6 pw-px-4 sm:pw-px-0">
          <div className="pw-order-1 sm:pw-order-2 pw-w-full sm:pw-w-[40%]">
            <CheckouResume
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
              products={productCache?.products ?? []}
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
                  ? orderResponse.totalAmount
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
                    Houve um erro de comunicação com o servidor, entre em
                    contato com nosso suporte.
                  </p>
                  <ErrorMessage
                    title={requestError.toString()}
                    message="Caso o problema persista entre em contato com o suporte"
                  />
                  <WeblockButton
                    className="pw-text-white pw-mt-4"
                    onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
                  >
                    Voltar para a home
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
