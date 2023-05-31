import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard, useInterval, useLocalStorage } from 'react-use';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { ErrorMessage, useProfile } from '../../../shared';
import { ReactComponent as Loading } from '../../../shared/assets/icons/loading.svg';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { PaymentMethod } from '../../enum';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import {
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

export const CheckoutPayment = () => {
  const { createOrder: createOrderHook, getOrderPreview } = useCheckout();
  const [inputsValue, setInputsValue] = useState<any>({});
  const [pixImage, setPixImage] = useState<string>();
  const [pixPayload, setPixPayload] = useState<string>();
  const [myOrderPreview, setMyOrderPreview] =
    useState<OrderPreviewResponse | null>();
  const [stayPooling, setStayPooling] = useState<boolean>(true);
  const [isStripe, setIsStripe] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  const iframeRef = useRef(null);
  const router = useRouterConnect();
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const [requestError, setRequestError] = useState(false);
  const profile = useProfile();
  const [sending, setSending] = useState<boolean>(false);
  const { companyId, appBaseUrl } = useCompanyConfig();
  const [iframeLink, setIframeLink] = useState('');
  const [productCache] = useLocalStorage<OrderPreviewCache>(
    PRODUCT_CART_INFO_KEY
  );
  const { setCart } = useCart();
  const { data: session } = usePixwaySession();
  const [query] = useState('');

  useEffect(() => {
    if (myOrderPreview && productCache) {
      if (
        productCache?.choosedPayment?.paymentProvider == PaymentMethod.ASAAS
      ) {
        setLoading(false);
      } else {
        setStayPooling(false);
        createOrder();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myOrderPreview, productCache]);

  useEffect(() => {
    if (productCache) {
      orderPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCache]);

  const orderPreview = () => {
    if (productCache && stayPooling) {
      getOrderPreview.mutate(
        {
          productIds: productCache.orderProducts.map((p) => p.productId),
          currencyId: productCache.currencyId,
          companyId,
        },
        {
          onSuccess(data, _, __) {
            setMyOrderPreview(data);
          },
        }
      );
    }
  };

  useInterval(() => {
    orderPreview();
  }, 20000);

  const createOrder = () => {
    setLoading(true);
    const orderInfo = productCache;
    if (orderInfo && !iframeLink && !sending && session && profile) {
      setSending(true);
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
                  ...inputsValue,
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
          },
        },
        {
          onSuccess: (data: CreateOrderResponse) => {
            setLoading(false);
            if (data.paymentProvider == PaymentMethod.STRIPE) {
              setIsStripe(data.paymentInfo.clientSecret ?? '');
              setStripeKey(data.paymentInfo.publicKey ?? '');
            } else {
              if (productCache.choosedPayment?.paymentMethod == 'credit_card') {
                router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
              } else {
                if ('pix' in data.paymentInfo) {
                  setPixImage(data.paymentInfo.pix?.encodedImage ?? '');
                  setPixPayload(data.paymentInfo.pix?.payload ?? '');
                }

                setIframeLink(data.paymentInfo.paymentUrl ?? '');
              }
            }
            setSending(false);
            if (router.query.cart && router.query.cart == 'true') {
              setCart([]);
            }
          },
          onError: () => {
            setRequestError(true);
          },
        }
      );
    } else setRequestError(true);
  };

  const [_, copyClp] = useCopyToClipboard();

  const stripePromise = useMemo(() => {
    if (isStripe != '' && stripeKey != '') {
      return loadStripe(stripeKey);
    } else return null;
  }, [isStripe, stripeKey]);

  const concluded = () => {
    createOrder();
  };

  const WichPaymentMethod = () => {
    if (productCache?.choosedPayment?.paymentProvider == 'asaas') {
      return (
        <div className="pw-container pw-mx-auto pw-h-full pw-px-0 sm:pw-px-4">
          {!iframeLink ? (
            <CheckoutPaymentComponent
              loading={loading}
              buttonText={
                productCache.choosedPayment.paymentMethod == 'pix'
                  ? 'Gerar link'
                  : 'Finalizar compra'
              }
              onChange={setInputsValue}
              onConcluded={() => concluded()}
              title="Informações para pagamento"
              inputs={productCache.choosedPayment.inputs as INPUTS_POSSIBLE[]}
            />
          ) : (
            <div className="pw-bg-white pw-p-4 sm:pw-p-6 pw-flex pw-justify-center pw-items-center pw-shadow-brand-shadow pw-rounded-lg">
              <div className="pw-flex pw-justify-center pw-items-center pw-h-full">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10 sm:pw-mt-15 sm:pw-mb-15 pw-mb-10 pw-px-4">
                  <p className="pw-text-center pw-max-w-[450px] pw-text-slate-500 pw-text-sm pw-font-[500] pw-mx-auto pw-mt-4">
                    Após a conclusão do pagamento, em alguns minutos você poderá
                    visualizar os itens comprados em sua carteira.
                  </p>

                  <p className="pw-text-center pw-font-semibold pw-text-black pw-mt-6">
                    Escaneie o QR Code abaixo para realizar o pagamento
                  </p>
                  {pixImage && (
                    <img src={`data:image/png;base64, ${pixImage}`} />
                  )}
                  {pixPayload && (
                    <p
                      onClick={() => copyClp(pixPayload)}
                      className="pw-text-center pw-text-brand-primary pw-text-xs pw-cursor-pointer pw-px-6 pw-mb-8 hover:pw-font-[900] pw-break-all"
                    >
                      {pixPayload}
                    </p>
                  )}
                  <p className="pw-text-center pw-text-xs pw-text-slate-600">
                    Caso não consiga visualizar o QR code acima acesse o link
                    abaixo para finalizar o pagamento
                  </p>
                  <a
                    className="pw-mt-2 pw-text-xs pw-text-center pw-font-bold pw-text-brand-primary pw-underline"
                    target="_blank"
                    href={iframeLink}
                    rel="noreferrer"
                  >
                    {iframeLink}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (iframeLink) {
      return (
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
                router.pushConnect(PixwayAppRoutes.CHECKOUT_COMPLETED + query);
              }
            }}
            ref={iframeRef}
            className="pw-w-full pw-min-h-screen"
            src={iframeLink}
          />
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
              price={productCache?.cartPrice ?? '0'}
              currencyId={productCache?.currencyId ?? ''}
              products={productCache?.products ?? []}
              gasFee={myOrderPreview?.gasFee?.amount ?? '0'}
              service={myOrderPreview?.clientServiceFee ?? '0'}
              totalPrice={myOrderPreview?.totalPrice ?? '0'}
            />
          </div>
          <div className="pw-order-2 sm:pw-order-1 pw-flex-1">
            {requestError ? (
              <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center pw-mx-auto">
                  <p className="pw-font-bold pw-text-black pw-text-center pw-mb-6">
                    Houve um erro de comunicação com o servidor, entre em
                    contato com nosso suporte.
                  </p>
                  <WeblockButton
                    className="pw-text-white"
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
