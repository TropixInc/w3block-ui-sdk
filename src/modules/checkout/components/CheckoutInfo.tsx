/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useDebounce,
  useInterval,
  useLocalStorage,
} from 'react-use';

import _ from 'lodash';

import ValueChangeIcon from '../../shared/assets/icons/icon-up-down.svg';

import { ModalBase } from '../../shared/components/ModalBase';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { CurrencyEnum } from '../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useGetStorageData } from '../../shared/hooks/useGetStorageData';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { useLocale } from '../../shared/hooks/useLocale';
import { useModalController } from '../../shared/hooks/useModalController';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useGetRightWallet } from '../../shared/utils/getRightWallet';
import { useTrack } from '../../storefront/hooks/useTrack';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useUtms } from '../../shared/hooks/useUtms';
import { useDynamicApi } from '../../storefront/provider/DynamicApiProvider';
import { ProductInfo } from '../../shared/components/ProductInfo';
import { useQuery } from '../../shared/hooks/useQuery';
import useTranslation from '../../shared/hooks/useTranslation';
import { PRODUCT_CART_INFO_KEY, ORDER_COMPLETED_INFO_KEY, PRODUCT_VARIANTS_INFO_KEY, PRACTITIONER_DATA_INFO_KEY } from '../config/keys/localStorageKey';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { useCheckoutConfig } from '../hooks/useCheckoutConfig';
import { ProductErrorInterface, OrderPreviewCache, PaymentMethodsAvaiable, CreateOrderResponse, OrderPreviewResponse } from '../interface/interface';
import { analyzeCurrenciesInCart } from '../utils/analyzeCurrenciesInCart';
import {
  getPriceByCurrency,
  getVariantIdsForProduct,
  sortCart,
  sortProductIds,
} from '../utils/checkoutHelpers';
import { CheckoutConfirmationContent } from './CheckoutInfo/CheckoutConfirmationContent';
import { CheckoutFinishedContent } from './CheckoutInfo/CheckoutFinishedContent';
import { useCheckoutCurrencyAllowance } from './CheckoutInfo/useCheckoutCurrencyAllowance';
import { useCheckoutProductManagement } from './CheckoutInfo/useCheckoutProductManagement';
import { useCheckoutStatusPolling } from './CheckoutInfo/useCheckoutStatusPolling';
import { useErc20PaymentInput } from './CheckoutInfo/useErc20PaymentInput';
import { useGiftCardShare } from './CheckoutInfo/useGiftCardShare';
import { ConfirmCryptoBuy } from './ConfirmCryptoBuy';
import { IncreaseCurrencyAllowance } from './IncreaseCurrencyAllowance';
import { ProductError } from './ProductError';

export enum CheckoutStatus {
  CONFIRMATION = 'CONFIRMATION',
  FINISHED = 'FINISHED',
  MY_ORDER = 'MY_ORDER',
}

interface CheckoutInfoProps {
  checkoutStatus?: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
  isCart?: boolean;
}

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  returnAction,
  proccedAction,
  currencyId,
  productId,
  isCart = false,
}: CheckoutInfoProps) => {
  const { datasource } = useDynamicApi();
  const isMobile = useIsMobile();
  const {
    hideCoupon,
    editableDestination,
    automaxLoyalty,
    actionButton,
    message: checkoutMessage,
  } = useCheckoutConfig();
  const organizedLoyalties = useGetRightWallet();
  const router = useRouterConnect();
  const profile = useProfile();
  const { isOpen, openModal, closeModal } = useModalController();
  const [requestError, setRequestError] = useState('');
  const [requestErrorCode, setRequestErrorCode] = useState('');
  const { getOrderPreview, getStatus } = useCheckout();
  const [translate] = useTranslation();
  const { setCart, cart, setCartCurrencyId, cartCurrencyId } = useCart();
  const [productErros, setProductErros] = useState<ProductErrorInterface[]>([]);
  const [productCache, setProductCache, deleteKey] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [orderResponse, , deleteOrderKey] =
    useLocalStorage<CreateOrderResponse>(ORDER_COMPLETED_INFO_KEY);
  const [productVariants] = useLocalStorage<any>(PRODUCT_VARIANTS_INFO_KEY);
  const query = useQuery();
  const destinationUser = router.query.destination;
  const [productIds, setProductIds] = useState<string[] | undefined>(productId);
  const [currencyIdState, setCurrencyIdState] = useState<string | undefined>(
    currencyId
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { data: session } = usePixwaySession();
  const token = session ? (session.accessToken as string) : null;
  const batchSize = router?.query?.batchSize as string;
  const quantity = router?.query?.quantity as string;
  const { companyId } = useCompanyConfig();
  const locale = useLocale();
  const track = useTrack();
  const storageData = useGetStorageData(
    PRACTITIONER_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );

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

  const acceptMultipleCurrenciesPurchase = useMemo(() => {
    return (
      orderPreview?.products?.filter(
        (res) => res?.settings?.acceptMultipleCurrenciesPurchase
      )?.length === orderPreview?.products?.length
    );
  }, [orderPreview?.products]);

  const acceptCryptoPayment = useMemo(() => {
    return (
      orderPreview?.products?.filter(
        (res) => res?.prices?.some((res) => res?.currency?.crypto)
      )?.length === orderPreview?.products?.length
    );
  }, [orderPreview?.products]);

  const isCoinPayment =
    (router.query.coinPayment?.includes('true') ? true : false) ||
    (acceptMultipleCurrenciesPurchase && acceptCryptoPayment);

  const isErc20 = orderPreview?.products?.[0]?.type === 'erc20';

  const paymentComplement = useMemo(() => {
    return (
      parseFloat(
        orderPreview?.payments?.filter(
          (e) => e?.currencyId !== coinPaymentCurrencyId
        )[0]?.totalPrice ?? ''
      ) !== 0
    );
  }, [coinPaymentCurrencyId, orderPreview?.payments]);

  // --- Extracted hooks ---

  const {
    paymentAmount,
    setPaymentAmount,
    coinAmountPayment,
    setCoinAmountPayment,
    coinError,
    payWithCoin,
    Erc20Input,
  } = useErc20PaymentInput({
    orderPreview,
    isCoinPayment,
    isErc20,
    automaxLoyalty,
    organizedLoyalties,
    translate,
  });

  const { statusResponse, codeQr, error } = useCheckoutStatusPolling({
    orderId: orderResponse?.id ?? '',
    isCoinPayment,
    hasPassShareCode: !!orderResponse?.passShareCodeInfo,
    companyId,
    getStatus,
  });

  const { onRenderGiftsCard } = useGiftCardShare({
    orderResponse,
    statusResponse,
    productCache,
    profileName: profile?.data?.data?.name,
    profileEmail: profile?.data?.data?.email,
    isMobile,
    translate,
  });

  const { differentProducts, changeQuantity, handleDeleteProduct } =
    useCheckoutProductManagement({
      orderPreview,
      productIds,
      setProductIds,
      currencyIdState,
      cart,
      setCart,
      cartCurrencyId,
      isCart,
    });

  // --- UTM / coupon state ---
  const [checkUtm, setCheckUtm] = useState(true);
  const utms = useUtms();

  const [couponCodeInput, setCouponCodeInput] = useState<string | undefined>(
    utms.utm_campaign &&
      utms?.expires &&
      new Date().getTime() < utms?.expires &&
      orderPreview?.appliedCoupon !== null
      ? utms.utm_campaign
      : ''
  );

  // --- getOrderPreviewFn ---
  const getOrderPreviewFn = (
    couponCode?: string,
    onSuccess?: (data: OrderPreviewResponse) => void,
    changeCart?: boolean
  ) => {
    setRequestErrorCode('');
    setRequestError('');
    const coupon = () => {
      if (couponCode) {
        return couponCode;
      } else if (
        utms.utm_campaign &&
        utms?.expires &&
        new Date().getTime() < utms?.expires &&
        couponCodeInput === ''
      ) {
        return utms.utm_campaign;
      } else return '';
    };
    if (
      productIds &&
      currencyIdState &&
      token &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      setIsLoadingPreview(true);
      getOrderPreview.mutate(
        {
          productIds: isCart
            ? cart.map((p) => {
                const payload = {
                  productId: p.id,
                  variantIds: p.variantIds ?? [],
                };
                return payload;
              })
            : productIds.map((p) => {
                const tokenId = storageData?.products?.find(
                  (res: any) => res.productId === p
                )?.tokenId;
                const variantIds = getVariantIdsForProduct(productVariants, p);
                const qty =
                  paymentAmount !== '' ? parseFloat(paymentAmount) : 1;
                return tokenId
                  ? {
                      quantity: qty,
                      productId: p,
                      productTokenId: tokenId,
                      selectBestPrice: true,
                      variantIds,
                    }
                  : {
                      quantity: qty,
                      productId: p,
                      selectBestPrice: true,
                      variantIds,
                    };
              }),
          payments:
            isCoinPayment && coinAmountPayment != ''
              ? [
                  {
                    currencyId: currencyIdState,
                    amountType: 'all_remaining',
                    paymentMethod: choosedPayment?.paymentMethod,
                  },
                  {
                    currencyId: coinPaymentCurrencyId,
                    paymentMethod: 'crypto',
                    amountType: 'fixed',
                    amount: coinAmountPayment,
                  },
                ]
              : [
                  {
                    currencyId: currencyIdState,
                    amountType: 'percentage',
                    amount: '100',
                    paymentMethod: choosedPayment?.paymentMethod,
                  },
                ],
          currencyId: currencyIdState,
          companyId,
          couponCode: coupon(),
        },
        {
          onSuccess: (data: OrderPreviewResponse) => {
            onSuccess && onSuccess(data);
            if (data && data?.providersForSelection?.length && !choosedPayment) {
              setChoosedPayment(data.providersForSelection[0]);
            }
            if (data.productsErrors && data.productsErrors?.length > 0) {
              setProductErros(data.productsErrors ?? []);
            }
            if (
              choosedPayment &&
              choosedPayment.paymentMethod == 'credit_card'
            ) {
              setChoosedPayment({
                ...choosedPayment,
                availableInstallments: data.providersForSelection?.find(
                  (val) =>
                    val.paymentMethod == choosedPayment.paymentMethod &&
                    val.paymentProvider == choosedPayment.paymentProvider
                )?.availableInstallments,
              });
            }
            setOrderPreview(data);
            setIsLoadingPreview(false);
            if (
              isCart &&
              (changeCart ||
                !hasCommonCurrencies ||
                commonCurrencies.length === 1)
            ) {
              const newCartItems = data.products.map((val) => ({
                id: val?.id,
                variantIds: val?.variants?.map(
                  (v: { values: { id: any }[] }) => v?.values?.[0]?.id
                ),
                prices: val?.prices,
                name: val?.name,
              }));
              setCart(sortCart(newCartItems));
            }
            if (
              data?.products?.map((p) => p?.id)?.length !== productIds?.length
            ) {
              setProductIds(
                sortProductIds(data?.products?.map((p) => p?.id) ?? [])
              );
            }
          },
          onError: (e: any) => {
            setRequestErrorCode(
              e?.response?.data?.errorCode ?? e?.response?.data?.error
            );
            setRequestError(e?.response?.data?.message);
          },
        }
      );
    }
  };

  const {
    poolCurrencyAllowanceStatus,
    setPoolCurrencyAllowanceStatus,
    currencyAllowanceState,
    canBuy,
    timestamp,
    setTimestamp,
    resetError,
  } = useCheckoutCurrencyAllowance({
    orderPreview,
    couponCodeInput,
    getOrderPreviewFn,
  });

  // --- Effects ---

  useEffect(() => {
    if (
      checkUtm &&
      utms.utm_campaign &&
      utms?.expires &&
      new Date().getTime() < utms?.expires &&
      orderPreview?.appliedCoupon === null
    ) {
      const val = document.getElementById('couponCode') as HTMLInputElement;
      if (val) {
        val.value = '';
        setCheckUtm(false);
        setCouponCodeInput('');
        getOrderPreviewFn(couponCodeInput);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPreview?.appliedCoupon, utms?.expires, utms.utm_campaign]);

  useEffect(() => {
    if (batchSize) {
      if (quantity) {
        setPaymentAmount(quantity + ',00');
      } else {
        setPaymentAmount(batchSize + ',00');
      }
    }
  }, [batchSize, quantity, setPaymentAmount]);

  useEffect(() => {
    if (checkoutStatus === CheckoutStatus.CONFIRMATION) {
      deleteKey();
      deleteOrderKey();
    }
  }, [checkoutStatus, deleteKey, deleteOrderKey]);

  useEffect(() => {
    if (
      (!productIds || !currencyIdState) &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      const productIdsFromQueries = router?.query?.productIds as string;
      const currencyIdFromQueries = router?.query?.currencyId as string;
      if (productIdsFromQueries) {
        setProductIds(productIdsFromQueries?.split(','));
      }
      if (currencyIdFromQueries && !isCart) {
        setCurrencyIdState(currencyIdFromQueries);
      }
      if (isCart && cartCurrencyId) {
        setCurrencyIdState(cartCurrencyId.id);
      }
    } else {
      const preview = productCache;
      const currencyIdFromQueries = router?.query?.currencyId as string;
      if (preview) {
        setCurrencyIdState(preview?.currencyId);
      } else if (currencyIdFromQueries && !isCart) {
        setCurrencyIdState(currencyIdFromQueries);
      }
      if (preview && preview?.products?.length > 0) {
        setOrderPreview({
          ...orderPreview,
          products: [...preview.products],
          totalPrice: preview.totalPrice,
          clientServiceFee: preview.clientServiceFee,
          gasFee: {
            amount: preview.gasFee?.amount ?? '0',
            signature: preview.gasFee?.signature ?? '',
          },
          cartPrice: preview.cartPrice,
        });
      } else if (preview && preview?.products?.length == 0 && isCart) {
        setCart([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, productIds]);

  useEffect(() => {
    const params = new URLSearchParams(query);
    const currencyIdFromQueries = params.get('currencyId');
    if (currencyIdFromQueries && !isCart) {
      setCurrencyIdState(currencyIdFromQueries);
    }
  }, [query]);

  useEffect(() => {
    if (
      checkoutStatus == CheckoutStatus.CONFIRMATION &&
      choosedPayment?.paymentMethod
    )
      getOrderPreviewFn(couponCodeInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosedPayment?.paymentMethod]);

  useDebounce(
    () => {
      getOrderPreviewFn(couponCodeInput);
    },
    300,
    [productIds, currencyIdState, token]
  );

  useInterval(() => {
    if (payWithCoin() && !isCoinPayment) getOrderPreviewFn(couponCodeInput);
  }, 30000);

  useDebounce(
    () => {
      if (payWithCoin()) getOrderPreviewFn();
    },
    400,
    [paymentAmount, coinAmountPayment]
  );

  const isLoading = orderPreview == null;

  // --- Actions ---

  const onSubmitCupom = () => {
    const val = document.getElementById('couponCode') as HTMLInputElement;
    setCouponCodeInput(val?.value !== '' ? val?.value : undefined);
    getOrderPreviewFn(val?.value);
  };

  const beforeProcced = () => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION && orderPreview) {
      const orderProducts = isCart
        ? cart.map((p) => {
            return {
              productId: p.id,
              variantIds: p.variantIds,
              expectedPrice:
                p.prices.find((price) => price.currencyId == currencyIdState)
                  ?.amount ?? '0',
            };
          })
        : orderPreview.products?.map((pID) => {
            const tokenId = storageData?.products?.find(
              (res: any) => res.productId === pID.id
            )?.tokenId;
            return tokenId
              ? {
                  selectBestPrice: pID?.type === 'erc20' ? true : undefined,
                  quantity: paymentAmount != '' ? parseFloat(paymentAmount) : 1,
                  productId: pID.id,
                  productTokenId: tokenId,
                  expectedPrice:
                    pID.prices.find(
                      (price: { currencyId: string | undefined }) =>
                        price.currencyId == currencyIdState
                    )?.amount ?? '0',
                  variantIds: productVariants
                    ? Object.values(productVariants).map((value) => {
                        if ((value as any).productId === pID.id)
                          return (value as any).id;
                      })
                    : [],
                }
              : {
                  selectBestPrice: pID?.type === 'erc20' ? true : undefined,
                  quantity: paymentAmount != '' ? parseFloat(paymentAmount) : 1,
                  productId: pID.id,
                  expectedPrice: isErc20
                    ? orderPreview?.totalPrice ?? '0'
                    : pID.prices.find(
                        (price: { currencyId: string | undefined }) =>
                          price.currencyId == currencyIdState
                      )?.amount ?? '0',
                  variantIds: productVariants
                    ? Object.values(productVariants).map((value) => {
                        if ((value as any).productId === pID.id)
                          return (value as any).id;
                      })
                    : [],
                };
          });
      setProductCache({
        payments: orderPreview.payments,
        products:
          orderPreview.products.length == 1
            ? [
                {
                  ...orderPreview.products?.[0],
                  quantity: paymentAmount ?? '1',
                },
              ]
            : orderPreview.products,
        orderProducts,
        currencyId: currencyIdState || '',
        signedGasFee: orderPreview?.gasFee?.signature || '',
        totalPrice: orderPreview?.totalPrice ?? '',
        clientServiceFee: orderPreview?.clientServiceFee || '0',
        gasFee: {
          amount:
            parseFloat(orderPreview?.gasFee?.amount || '0').toString() || '0',
          signature: orderPreview.gasFee?.signature ?? '',
        },
        cartPrice:
          parseFloat(orderPreview?.cartPrice || '0').toString() || '0',
        choosedPayment: choosedPayment,
        couponCode: orderPreview.appliedCoupon,
        originalCartPrice: orderPreview?.originalCartPrice ?? '',
        originalClientServiceFee: orderPreview?.originalClientServiceFee ?? '',
        originalTotalPrice: orderPreview?.originalTotalPrice ?? '',
        destinationUser: {
          walletAddress: datasource?.master?.data?.filter(
            (e: { attributes: { slug: string | null } }) =>
              e.attributes.slug === destinationUser
          )[0]?.attributes?.walletAddress,
          name: datasource?.master?.data?.filter(
            (e: { attributes: { slug: string | null } }) =>
              e.attributes.slug === destinationUser
          )[0]?.attributes?.name,
        },
        isCoinPayment,
        acceptMultipleCurrenciesPurchase,
        cryptoCurrencyId: orderPreview?.payments?.find(
          (res) => res?.currency?.crypto
        )?.currencyId,
        cashback: orderPreview.cashback?.cashbackAmount,
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      if (
        orderPreview?.products[0].prices.find(
          (price: { currencyId: string | undefined }) =>
            price.currencyId == currencyIdState
        )?.currency.crypto
      ) {
        openModal();
        return;
      } else {
        try {
          if (
            orderPreview?.products[0].type === 'erc20' &&
            Boolean(
              _.get(orderPreview, 'products[0].draftData.keyErc20LoyaltyId')
            )
          ) {
            track('view_item', {
              currency: orderPreview?.currency?.code,
              value: orderPreview.totalPrice,
              items: orderPreview?.products.map((res) => {
                return {
                  item_id: res.id,
                  item_variant: destinationUser,
                  item_name: 'Zuca',
                  quantity: 1,
                  prices: orderPreview.totalPrice,
                  value: orderPreview.totalPrice,
                  destination: destinationUser,
                  payment_info: choosedPayment?.paymentMethod,
                };
              }),
            });
          } else {
            track('begin_checkout', {
              value: orderPreview?.totalPrice,
              currency: orderPreview?.currency?.code,
              coupon: orderPreview?.appliedCoupon,
              items: orderPreview?.products.map((res) => {
                return { item_id: res.id, item_name: res.name };
              }),
            });
          }
        } catch (err) {
          console.log('erro ao salvar o track', err);
        }

        router.pushConnect(
          PixwayAppRoutes.CHECKOUT_PAYMENT +
            '?' +
            query +
            (isCart ? '&cart=true' : '')
        );
      }
    }
  };

  const onClickButton = () => {
    if (error !== '' && statusResponse?.status === 'failed') {
      router.pushConnect(PixwayAppRoutes.CHECKOUT_CONFIRMATION, query);
    } else if (actionButton?.link) {
      router.pushConnect(actionButton.link);
    } else if (returnAction) {
      returnAction(query);
    } else {
      router.pushConnect(PixwayAppRoutes.MY_TOKENS);
    }
  };

  const buttonText = () => {
    if (error !== '' && statusResponse?.status === 'failed') {
      return translate('components>walletIntegration>tryAgain');
    } else if (actionButton?.label) {
      return actionButton.label;
    } else {
      return translate('tokens>tokenTransferController>goToMyTokens');
    }
  };

  // --- Memos ---

  const {
    commonCurrencies,
    hasCommonCurrencies,
    productsWithoutCommonCurrencies,
  } = useMemo(() => analyzeCurrenciesInCart(cart), [cart]);

  const [currVal, setCurrVal] = useState(cartCurrencyId?.id);

  const anchorCurrencyId = useMemo(() => {
    return orderPreview?.products && orderPreview?.products?.length
      ? orderPreview?.products
          .find((prod) =>
            prod?.prices?.some((price) => price?.anchorCurrencyId)
          )
          ?.prices?.find((price) => price?.anchorCurrencyId)?.anchorCurrencyId
      : '';
  }, [orderPreview]);

  // --- Status-based content ---

  const _ButtonsToShow = (() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <CheckoutConfirmationContent
            orderPreview={orderPreview}
            currencyIdState={currencyIdState}
            isCoinPayment={isCoinPayment}
            isErc20={isErc20}
            isLoading={isLoading}
            isLoadingPreview={isLoadingPreview}
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            batchSize={batchSize}
            Erc20Input={Erc20Input}
            acceptMultipleCurrenciesPurchase={acceptMultipleCurrenciesPurchase}
            hideCoupon={hideCoupon}
            couponCodeInput={couponCodeInput}
            appliedCoupon={orderPreview?.appliedCoupon}
            onSubmitCupom={onSubmitCupom}
            translate={translate}
            isCart={isCart}
            hasCommonCurrencies={hasCommonCurrencies}
            commonCurrencies={commonCurrencies}
            currVal={currVal}
            setCurrVal={setCurrVal}
            setCurrencyIdState={setCurrencyIdState}
            setCartCurrencyId={setCartCurrencyId}
            choosedPayment={choosedPayment}
            setChoosedPayment={setChoosedPayment}
            automaxLoyalty={automaxLoyalty}
            organizedLoyalties={organizedLoyalties}
            coinAmountPayment={coinAmountPayment}
            setCoinAmountPayment={setCoinAmountPayment}
            paymentComplement={paymentComplement}
            payWithCoin={payWithCoin}
            coinError={coinError}
            returnAction={returnAction}
            query={query}
            onNavigateHome={() => router.pushConnect(PixwayAppRoutes.HOME)}
            beforeProcced={beforeProcced}
            requestError={requestError}
            requestErrorCode={requestErrorCode}
            datasourceMasterData={datasource?.master?.data}
            destinationUser={destinationUser}
            editableDestination={editableDestination}
            onDestinationChange={(e) =>
              router.pushConnect(PixwayAppRoutes.CHECKOUT_CONFIRMATION, {
                ...router.query,
                destination: e,
              })
            }
          />
        );
      case CheckoutStatus.FINISHED:
        return (
          <CheckoutFinishedContent
            hasPassShareCode={!!orderResponse?.passShareCodeInfo}
            passShareStatusGenerated={
              statusResponse?.passShareCodeInfo?.status === 'generated'
            }
            renderGiftsCard={onRenderGiftsCard}
            error={error}
            statusResponse={statusResponse}
            productCache={productCache}
            isCoinPayment={isCoinPayment}
            acceptMultipleCurrenciesPurchase={acceptMultipleCurrenciesPurchase}
            translate={translate}
            profileName={profile?.data?.data?.name}
            orderResponse={orderResponse}
            locale={locale}
            codeQr={codeQr}
            checkoutMessage={checkoutMessage}
            payments={orderResponse?.payments}
            productCachePayments={productCache?.payments}
            productCacheProducts={productCache?.products}
            currencyIdFromQuery={router?.query?.currencyId as string}
            isLoading={isLoading}
            onActionButton={onClickButton}
            actionButtonLabel={buttonText()}
            isCoinPaymentLayout={isCoinPayment || !!productCache?.isCoinPayment}
          />
        );
      default:
        return null;
    }
  })();

  // --- Early returns ---

  if (productsWithoutCommonCurrencies.length && isCart)
    return (
      <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
        <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
          <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
            {translate('checkout>currencyAnalyze>cantBuy')}
          </p>
          {productsWithoutCommonCurrencies.map((product) => {
            return <p key={product.id}>{`- ${product.name}`}</p>;
          })}
          <WeblockButton
            className="pw-text-white pw-mt-6"
            onClick={() => {
              router.pushConnect(PixwayAppRoutes.HOME);
              setCart([]);
            }}
          >
            {translate('checkout>currencyAnalyze>emptyCart')}
          </WeblockButton>
        </div>
      </div>
    );
  else if (isCoinPayment && !organizedLoyalties.length)
    return (
      <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-6">
        <Spinner />
      </div>
    );

  return requestError !== '' &&
    requestErrorCode !== 'resale-purchase-batch-size-error' &&
    requestErrorCode !== 'Not Found' ? (
    <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
      <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
        <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
          {requestError ??
            translate('checkout>checkoutInfo>errorContactSuport')}
        </p>
        <WeblockButton
          className="pw-text-white pw-mt-6"
          onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
        >
          {translate('checkout>checkoutInfo>goBackHome')}
        </WeblockButton>
      </div>
    </div>
  ) : (
    <>
      <div className="pw-flex pw-flex-col sm:pw-flex-row">
        <div className="pw-w-full lg:pw-px-[60px] pw-px-0 pw-mt-6 sm:pw-mt-0">
          {isCoinPayment ||
          productCache?.isCoinPayment ||
          orderResponse?.passShareCodeInfo ? null : (
            <>
              <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
                {translate('business>buySumarySDK>purchaseResume')}
              </p>

              {checkoutStatus == CheckoutStatus.FINISHED && (
                <p className="pw-font-[700] pw-text-[#295BA6] pw-text-2xl pw-mb-6 pw-mt-2">
                  {productCache?.choosedPayment?.paymentMethod === 'transfer'
                    ? translate('checkout>checkoutInfo>paymentAnalysis')
                    : translate(
                        'checkout>components>checkoutInfo>proccessingBlockchain'
                      )}
                </p>
              )}
            </>
          )}

          {(isCoinPayment && !acceptMultipleCurrenciesPurchase) ||
          (productCache?.isCoinPayment && !acceptMultipleCurrenciesPurchase) ||
          isErc20 ||
          orderResponse?.passShareCodeInfo ? null : (
            <div className="pw-border pw-bg-white pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl pw-overflow-hidden">
              {differentProducts.map((prod, index) => (
                <ProductInfo
                  metadata={prod?.metadata}
                  subtitle={prod?.subtitle}
                  disableQuantity={storageData?.products?.length}
                  index={index}
                  loadingPreview={isLoadingPreview}
                  isCart={isCart}
                  className="pw-border-b pw-border-[rgba(0,0,0,0.1)] "
                  currency={
                    prod?.prices?.find(
                      (prodI: { currencyId: string | undefined }) =>
                        prodI?.currencyId == currencyIdState
                    )?.currency?.symbol
                  }
                  quantity={
                    orderPreview?.products?.filter(
                      (p) =>
                        p?.id == prod?.id &&
                        prod?.prices?.find(
                          (price: { currencyId: string | undefined }) =>
                            price?.currencyId == currencyIdState
                        )?.amount ==
                          p?.prices?.find(
                            (price: { currencyId: string | undefined }) =>
                              price?.currencyId == currencyIdState
                          )?.amount &&
                        p?.variants
                          ?.map((res: { values: any[] }) => {
                            return res?.values?.map((res: { id: any }) => {
                              return res?.id;
                            });
                          })
                          .toString() ==
                          prod?.variants
                            ?.map((res: { values: any[] }) => {
                              return res?.values?.map((res: { id: any }) => {
                                return res?.id;
                              });
                            })
                            .toString()
                    ).length ?? 1
                  }
                  stockAmount={prod?.stockAmount}
                  canPurchaseAmount={prod?.canPurchaseAmount}
                  changeQuantity={changeQuantity}
                  loading={isLoading}
                  status={checkoutStatus}
                  deleteProduct={(id, variants) =>
                    handleDeleteProduct(id, prod, variants)
                  }
                  id={prod?.id}
                  key={index}
                  image={prod?.images[0]?.thumb}
                  name={prod?.name}
                  price={parseFloat(
                    prod?.prices?.find(
                      (price: { currencyId: string | undefined }) =>
                        price?.currencyId == currencyIdState
                    )?.amount ??
                      productCache?.orderProducts?.find(
                        (val) => val?.productId === prod?.id
                      )?.expectedPrice ??
                      '0'
                  ).toString()}
                  originalPrice={parseFloat(
                    prod?.prices?.find(
                      (price: { currencyId: string | undefined }) =>
                        price?.currencyId == currencyIdState
                    )?.originalAmount ?? '0'
                  ).toString()}
                  variants={prod?.variants}
                  anchorCurrencyAmount={parseFloat(
                    prod?.prices?.find(
                      (price: { currencyId: string | undefined }) =>
                        price?.currencyId == currencyIdState
                    )?.anchorCurrencyAmount ?? '0'
                  ).toString()}
                  anchorCurrencySymbol={
                    prod?.prices?.find(
                      (price: { currencyId: string | undefined }) =>
                        price?.currencyId == currencyIdState
                    )?.anchorCurrency?.symbol ?? ''
                  }
                  promotionDescription={
                    prod?.promotions?.[0]?.publicDescription
                  }
                />
              ))}
            </div>
          )}
          <div>
            {productErros.length > 0 && !isCoinPayment && (
              <ProductError
                className="pw-mt-4"
                productsErrors={productErros.reduce(
                  (
                    acc: ProductErrorInterface[],
                    prod: ProductErrorInterface
                  ) => {
                    if (acc.some((p) => p.productId == prod.productId))
                      return acc;
                    else return [...acc, prod];
                  },
                  []
                )}
              />
            )}
          </div>
          {_ButtonsToShow}
          <div>
            {anchorCurrencyId && (
              <div className="pw-flex pw-gap-2 pw-mt-2 pw-items-center">
                <ValueChangeIcon />
                <p className="pw-text-xs pw-font-medium pw-text-[#777E8F]">
                  *{translate('checkout>checkoutInfo>valueOfProductOn')}{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod?.prices?.find(
                          (price: { currencyId: string | undefined }) =>
                            price?.currencyId == currencyIdState
                        )
                      )
                      ?.prices?.find(
                        (price: { currencyId: string | undefined }) =>
                          price?.currencyId == currencyIdState
                      )?.currency?.symbol
                  }{' '}
                  {translate('checkout>checkoutInfo>varyAcordingExchange')}{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod?.prices?.some(
                          (price: { currencyId: string | undefined }) =>
                            price?.currencyId == currencyIdState
                        )
                      )
                      ?.prices?.find(
                        (price: { currencyId: string | undefined }) =>
                          price?.currencyId == currencyIdState
                      )?.anchorCurrency?.symbol
                  }
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalBase
        classes={{ dialogCard: 'pw-min-w-[400px] pw-max-w-[450px]' }}
        onClose={closeModal}
        isOpen={isOpen}
      >
        {(currencyAllowanceState === 'required' ||
          currencyAllowanceState === 'processing') &&
        canBuy ? (
          <IncreaseCurrencyAllowance
            onClose={closeModal}
            onContinue={() => setTimestamp(Date.now())}
            onSuccess={() => setPoolCurrencyAllowanceStatus(true)}
            resetError={resetError}
            currencyAllowanceState={currencyAllowanceState}
            currencyId={currencyIdState ?? ''}
            targetAmount={orderPreview?.totalPrice ?? '0'}
          />
        ) : (
          <ConfirmCryptoBuy
            orderInfo={productCache}
            onClose={closeModal}
            totalPrice={orderPreview?.totalPrice ?? '0'}
            gasPrice={orderPreview?.gasFee?.amount ?? '0'}
            serviceFee={orderPreview?.clientServiceFee ?? ''}
            code={
              orderPreview?.products && orderPreview?.products.length
                ? (orderPreview?.products[0].prices.find(
                    (price: { currencyId: string | undefined }) =>
                      price.currencyId == currencyIdState
                  )?.currency?.code as CurrencyEnum)
                : CurrencyEnum.BRL
            }
          />
        )}
      </ModalBase>
    </>
  );
};

export const CheckoutInfo = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
  isCart,
}: CheckoutInfoProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutInfo
        proccedAction={proccedAction}
        returnAction={returnAction}
        checkoutStatus={checkoutStatus}
        productId={productId}
        currencyId={currencyId}
        isCart={isCart}
      />
    </TranslatableComponent>
  );
};
