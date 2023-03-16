import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

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
import { OrderPreviewCache } from '../../interface/interface';
import { CheckoutStripeForm } from '../CheckoutStripeForm/CheckoutStripeForm';

export const CheckoutPayment = () => {
  const { createOrder: createOrderHook } = useCheckout();
  const [isStripe, setIsStripe] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  const iframeRef = useRef(null);
  const router = useRouterConnect();
  const [loading, setLoading] = useState<boolean>(true);
  const [translate] = useTranslation();
  const shouldLock = useRef(true);
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
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (shouldLock.current) {
      shouldLock.current = false;
      createOrder();
    }
    setTimeout(() => {
      setQuery(window.location.search);
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  ...orderInfo?.choosedPayment?.inputs?.reduce((acc, val) => {
                    (acc as any)[val as string] = orderInfo.cpfCnpj
                      ?.replaceAll('.', '')
                      .replaceAll('-', '')
                      .replaceAll('/', '');
                    return { ...acc };
                  }, {}),
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
          onSuccess: (data: any) => {
            setLoading(false);
            if (data.paymentProvider == PaymentMethod.STRIPE) {
              setIsStripe(data.paymentInfo.clientSecret ?? '');
              setStripeKey(data.paymentInfo.publicKey ?? '');
            } else {
              setIframeLink(data.paymentInfo.paymentUrl ?? '');
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

  const stripePromise = useMemo(() => {
    if (isStripe != '' && stripeKey != '') {
      return loadStripe(stripeKey);
    } else return null;
  }, [isStripe, stripeKey]);

  const WichPaymentMethod = () => {
    if (productCache?.choosedPayment?.paymentMethod == 'pix' && iframeLink) {
      return (
        <div className="pw-container pw-mx-auto pw-h-full">
          <div className="pw-flex pw-justify-center pw-items-center pw-h-full">
            <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10 sm:pw-mt-15 pw-px-4">
              <p className="pw-text-center pw-max-w-[450px] pw-text-slate-700 pw-text-sm pw-font-[600] pw-mx-auto pw-mt-4">
                Após a conclusão do pagamento, em alguns minutos você poderá
                visualizar os itens comprados em sua carteira.
              </p>
              <p className="pw-text-center pw-font-semibold pw-text-black pw-mt-6">
                Clique no link abaixo para efetuar o pagamento
              </p>
              <a
                className="pw-mt-2 pw-text-center pw-font-bold pw-text-brand-primary pw-underline"
                target="_blank"
                href={iframeLink}
                rel="noreferrer"
              >
                {iframeLink}
              </a>
            </div>
          </div>
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
    <div className="pw-min-h-[95vh] pw-bg-[#F7F7F7]">
      {requestError ? (
        <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
          <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center pw-mx-auto">
            <p className="pw-font-bold pw-text-black pw-text-center pw-mb-6">
              Houve um erro de comunicação com o servidor, entre em contato com
              nosso suporte.
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
  );
};
