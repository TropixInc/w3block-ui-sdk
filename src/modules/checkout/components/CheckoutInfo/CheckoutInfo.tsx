/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { IMaskInput } from 'react-imask';
import {
  useCopyToClipboard,
  useDebounce,
  useInterval,
  useLocalStorage,
} from 'react-use';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import _ from 'lodash';
import { QRCodeSVG } from 'qrcode.react';

import { SharedOrder } from '../../../pass';
import { BaseSelect, useProfile } from '../../../shared';
import ValueChangeIcon from '../../../shared/assets/icons/icon-up-down.svg?react';
import { Alert } from '../../../shared/components/Alert';
import { Shimmer } from '../../../shared/components/Shimmer';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { CurrencyEnum } from '../../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetStorageData } from '../../../shared/hooks/useGetStorageData/useGetStorageData';
import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import { useLocale } from '../../../shared/hooks/useLocale';
import { useModalController } from '../../../shared/hooks/useModalController';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { Product } from '../../../shared/interface/Product';
import { useGetRightWallet } from '../../../shared/utils/getRightWallet';
import { ThemeContext } from '../../../storefront';
import { Selector } from '../../../storefront/components/Selector';
import { Variants } from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useTrack } from '../../../storefront/hooks/useTrack/useTrack';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import {
  ORDER_COMPLETED_INFO_KEY,
  PRACTITIONER_DATA_INFO_KEY,
  PRODUCT_CART_INFO_KEY,
  PRODUCT_VARIANTS_INFO_KEY,
} from '../../config/keys/localStorageKey';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import {
  CreateOrderResponse,
  OrderPreviewCache,
  OrderPreviewResponse,
  PaymentMethodsAvaiable,
  ProductErrorInterface,
} from '../../interface/interface';
import { analyzeCurrenciesInCart } from '../../utils/analyzeCurrenciesInCart';
import { CoinPaymentResume } from '../CoinPaymentResume/CoinPaymentResume';
import { IncreaseCurrencyAllowance } from '../IncreaseCurrencyAllowance';

const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({
      default: m.WeblockButton,
    })
  )
);

const ModalBase = lazy(() =>
  import('../../../shared/components/ModalBase').then((m) => ({
    default: m.ModalBase,
  }))
);

const PixwayButton = lazy(() =>
  import('../../../shared/components/PixwayButton').then((m) => ({
    default: m.PixwayButton,
  }))
);

const PriceAndGasInfo = lazy(() =>
  import('../../../shared/components/PriceAndGasInfo').then((m) => ({
    default: m.PriceAndGasInfo,
  }))
);

const ProductInfo = lazy(() =>
  import('../../../shared/components/ProductInfo').then((m) => ({
    default: m.ProductInfo,
  }))
);

const ConfirmCryptoBuy = lazy(() =>
  import('../ConfirmCryptoBuy/ConfirmCryptoBuy').then((m) => ({
    default: m.ConfirmCryptoBuy,
  }))
);

const PaymentMethodsComponent = lazy(() => {
  return import('../PaymentMethodsComponent/PaymentMethodsComponent').then(
    (m) => ({
      default: m.PaymentMethodsComponent,
    })
  );
});

const ProductError = lazy(() => {
  return import('../ProductError/ProductError').then((m) => ({
    default: m.ProductError,
  }));
});

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
  const context = useContext(ThemeContext);
  const hideCoupon =
    context?.defaultTheme?.configurations?.contentData?.checkoutConfig
      ?.hideCoupon;
  const editableDestination =
    context?.defaultTheme?.configurations?.contentData?.checkoutConfig
      ?.editableDestination;
  const automaxLoyalty =
    context?.defaultTheme?.configurations?.contentData?.checkoutConfig
      ?.automaxLoyalty;
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
  const acceptMultipleCurrenciesPurchase = useMemo(() => {
    return (
      orderPreview?.products?.filter(
        (res) => res?.settings?.acceptMultipleCurrenciesPurchase
      )?.length === orderPreview?.products?.length
    );
  }, [orderPreview?.products]);
  const isCoinPayment =
    (router.query.coinPayment?.includes('true') ? true : false) ||
    acceptMultipleCurrenciesPurchase;
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const utms = useUtms();
  const [checkUtm, setCheckUtm] = useState(true);
  const [couponCodeInput, setCouponCodeInput] = useState<string | undefined>(
    utms.utm_campaign &&
      utms?.expires &&
      new Date().getTime() < utms?.expires &&
      orderPreview?.appliedCoupon !== null
      ? utms.utm_campaign
      : ''
  );
  const isErc20 = orderPreview?.products?.[0]?.type === 'erc20';
  const { companyId } = useCompanyConfig();
  const [isCopied, setIsCopied] = useState(false);
  const [__, copyToClipboard] = useCopyToClipboard();

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
  const [paymentAmount, setPaymentAmount] = useState('');
  const [coinAmountPayment, setCoinAmountPayment] = useState('');
  const { data: session } = usePixwaySession();
  const token = session ? (session.accessToken as string) : null;
  const batchSize = router?.query?.batchSize as string;

  useEffect(() => {
    if (batchSize) {
      setPaymentAmount(batchSize + ',00');
    }
  }, [batchSize]);

  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
      deleteOrderKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  useEffect(() => {
    if (
      (!productIds || !currencyIdState) &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      const productIdsFromQueries = router?.query?.productIds as string;
      const currencyIdFromQueries = router?.query?.currencyId as string;
      if (productIdsFromQueries) {
        setProductIds(productIdsFromQueries.split(','));
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

  const storageData = useGetStorageData(
    PRACTITIONER_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );

  const { defaultTheme } = UseThemeConfig();
  const coinPaymentCurrencyId = useMemo(() => {
    return (
      router.query?.cryptoCurrencyId ??
      defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId
    );
  }, [
    defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId,
    router.query?.cryptoCurrencyId,
  ]);
  const paymentComplement = useMemo(() => {
    return (
      parseFloat(
        orderPreview?.payments?.filter(
          (e) => e?.currencyId !== coinPaymentCurrencyId
        )[0].totalPrice ?? ''
      ) !== 0
    );
  }, [coinPaymentCurrencyId, orderPreview?.payments]);
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
                const payload = tokenId
                  ? {
                      quantity:
                        paymentAmount != '' ? parseFloat(paymentAmount) : 1,
                      productId: p,
                      productTokenId: tokenId,
                      selectBestPrice: true,
                      variantIds: productVariants
                        ? Object.values(productVariants).map((value) => {
                            if ((value as any).productId === p)
                              return (value as any).id;
                          })
                        : [],
                    }
                  : {
                      quantity:
                        paymentAmount != '' ? parseFloat(paymentAmount) : 1,
                      productId: p,
                      selectBestPrice: true,
                      variantIds: productVariants
                        ? Object.values(productVariants).map((value) => {
                            if ((value as any).productId === p)
                              return (value as any).id;
                          })
                        : [],
                    };
                return payload;
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: OrderPreviewResponse) => {
            onSuccess && onSuccess(data);
            if (data && data.providersForSelection?.length && !choosedPayment) {
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
                commonCurrencies.length == 1)
            ) {
              setCart(
                data.products.map((val) => {
                  return {
                    id: val.id,
                    variantIds: val?.variants?.map((val) => val.values[0].id),
                    prices: val.prices,
                    name: val.name,
                  };
                })
              );
              cart.sort((a, b) => {
                if (a.id > b.id) return -1;
                if (a.id < b.id) return 1;
                return 0;
              });
            }
            if (data.products.map((p) => p.id)?.length != productIds?.length) {
              setProductIds(data.products.map((p) => p.id));
              productIds?.sort((a, b) => {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
              });
            }
          },
          onError: (e: any) => {
            console.log('error', e);
            setRequestErrorCode(e?.response?.data?.errorCode);
            setRequestError(e?.response?.data?.message);
          },
        }
      );
    }
  };

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

  const [coinError, setCoinError] = useState('');
  const payWithCoin = () => {
    if (parseFloat(coinAmountPayment) > parseFloat(paymentAmount)) {
      setCoinError(translate('checkout>checkoutInfo>coinError'));
      return false;
    }
    if (
      parseFloat(coinAmountPayment) >
      parseFloat(
        organizedLoyalties?.filter((wallet) => wallet.type == 'loyalty')?.[0]
          ?.balance
      )
    ) {
      setCoinError(translate('business>userCard>insufficientFunds'));
      return false;
    } else {
      setCoinError('');
      return true;
    }
  };

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
  const track = useTrack();
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
                      (price) => price.currencyId == currencyIdState
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
                        (price) => price.currencyId == currencyIdState
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
        cartPrice: parseFloat(orderPreview?.cartPrice || '0').toString() || '0',
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
          (price) => price.currencyId == currencyIdState
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

  const changeQuantity = (
    add: boolean | null,
    id: string,
    variants?: Variants[],
    quantity?: number
  ) => {
    if (add != null) {
      productIds?.sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });
      let newArray: Array<string> = [];
      if (
        productIds &&
        productIds?.filter((filteredId) => filteredId == id)?.length <
          productIds?.filter((filteredId) => filteredId == id)?.length +
            (add ? 1 : -1)
      ) {
        newArray = [...productIds, id];
      } else {
        productIds?.forEach((idProd) => {
          if (
            id != idProd ||
            newArray.filter((idNew) => idNew == idProd)?.length <
              productIds?.filter((filteredId) => filteredId == idProd)?.length +
                (add ? 1 : -1)
          ) {
            newArray.push(idProd);
          }
        });
      }
      router.pushConnect(
        isCart
          ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
          : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
        {
          productIds: newArray.join(','),
          currencyId: isCart
            ? cartCurrencyId?.id
            : orderPreview?.products[0].prices.find(
                (price) => price.currencyId == currencyIdState
              )?.currencyId,
        }
      );
      if (isCart) {
        cart.sort((a, b) => {
          if (a.id > b.id || a.variantIds.toString() > b.variantIds.toString())
            return -1;
          if (a.id < b.id || a.variantIds.toString() < b.variantIds.toString())
            return 1;
          return 0;
        });
        if (add) {
          const newCart = cart.filter(
            (val) =>
              val.id === id &&
              val.variantIds.toString() ===
                variants
                  ?.map((res) => res.values.map((res) => res.id))
                  .toString()
          );
          setCart([...cart, newCart[0]]);
          cart.sort((a, b) => {
            if (
              a.id > b.id ||
              a.variantIds.toString() > b.variantIds.toString()
            )
              return -1;
            if (
              a.id < b.id ||
              a.variantIds.toString() < b.variantIds.toString()
            )
              return 1;
            return 0;
          });
        } else {
          const newCart = cart.find(
            (val) =>
              val.id === id &&
              val.variantIds.toString() ===
                variants
                  ?.map((res) => res.values.map((res) => res.id))
                  .toString()
          );
          if (newCart) {
            const ind = cart.indexOf(newCart);
            const newValue = [...cart];
            newValue.splice(ind, 1);
            setCart(newValue);
            cart.sort((a, b) => {
              if (
                a.id > b.id ||
                a.variantIds.toString() > b.variantIds.toString()
              )
                return -1;
              if (
                a.id < b.id ||
                a.variantIds.toString() < b.variantIds.toString()
              )
                return 1;
              return 0;
            });
          }
        }
      }

      setProductIds(newArray);
      productIds?.sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });
    } else if (quantity) {
      if (!isCart) {
        let newArray: Array<string> = [];
        newArray = [...Array(quantity).fill(id)];
        router.pushConnect(PixwayAppRoutes.CHECKOUT_CONFIRMATION, {
          productIds: newArray.join(','),
          currencyId: orderPreview?.products[0].prices.find(
            (price) => price.currencyId == currencyIdState
          )?.currencyId,
        });
        setProductIds(newArray);
        productIds?.sort((a, b) => {
          if (a > b) return -1;
          if (a < b) return 1;
          return 0;
        });
      } else {
        cart.sort((a, b) => {
          if (a.id > b.id || a.variantIds.toString() > b.variantIds.toString())
            return -1;
          if (a.id < b.id || a.variantIds.toString() < b.variantIds.toString())
            return 1;
          return 0;
        });
        const filteredProds = cart.filter(
          (val) =>
            val.id === id &&
            val.variantIds.toString() ===
              variants?.map((res) => res.values.map((res) => res.id)).toString()
        );

        if (productIds) {
          productIds.sort((a, b) => {
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
          });
          const filteredIds = productIds.find((val) => val === id);
          if (filteredIds) {
            const ind = productIds.indexOf(filteredIds);
            const newIds = [...productIds];
            newIds.splice(ind, filteredProds?.length);
            let newArray: Array<string> = [];
            newArray = [...newIds, ...Array(quantity).fill(id)];
            router.pushConnect(PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION, {
              productIds: newArray.join(','),
              currencyId: isCart
                ? cartCurrencyId?.id
                : orderPreview?.products[0].prices.find(
                    (price) => price.currencyId == currencyIdState
                  )?.currencyId,
            });
            setProductIds(newArray);
            productIds?.sort((a, b) => {
              if (a > b) return -1;
              if (a < b) return 1;
              return 0;
            });
          }
        }
        cart.sort((a, b) => {
          if (a.id > b.id || a.variantIds.toString() > b.variantIds.toString())
            return -1;
          if (a.id < b.id || a.variantIds.toString() < b.variantIds.toString())
            return 1;
          return 0;
        });
        const newCart = cart.find(
          (val) =>
            val.id === id &&
            val.variantIds.toString() ===
              variants?.map((res) => res.values.map((res) => res.id)).toString()
        );
        if (newCart) {
          const ind = cart.indexOf(newCart);
          const newValue = [...cart];
          newValue.splice(ind, filteredProds?.length);
          setCart([...newValue, ...Array(quantity).fill(newCart)]);
          cart.sort((a, b) => {
            if (
              a.id > b.id ||
              a.variantIds.toString() > b.variantIds.toString()
            )
              return -1;
            if (
              a.id < b.id ||
              a.variantIds.toString() < b.variantIds.toString()
            )
              return 1;
            return 0;
          });
        }
      }
    }
  };

  const deleteProduct = (id: string, amount: string, variants?: Variants[]) => {
    const filteredProds = cart.filter((prod) => {
      if (prod.id == id) {
        if (
          prod.prices.find((price) => price.currencyId == currencyIdState)
            ?.amount != amount ||
          prod.variantIds.toString() !==
            variants?.map((res) => res.values.map((res) => res.id)).toString()
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    router.pushConnect(
      isCart
        ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
        : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
      {
        productIds: filteredProds?.map((p) => p.id).join(','),
        currencyId: isCart
          ? cartCurrencyId?.id
          : orderPreview?.products[0].prices.find(
              (price) => price.currencyId == currencyIdState
            )?.currencyId,
      }
    );
    if (isCart) {
      setCart(filteredProds);
      cart.sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      });
    }

    setProductIds(filteredProds?.map((p) => p.id));
    productIds?.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
  };

  const differentProducts = useMemo<Array<Product>>(() => {
    if (orderPreview && orderPreview?.products?.length) {
      const uniqueProduct: Product[] = [];
      orderPreview?.products?.forEach((p) => {
        if (
          !uniqueProduct.some(
            (prod) =>
              p?.id == prod?.id &&
              prod?.prices?.find(
                (price) => price?.currencyId == currencyIdState
              )?.amount ==
                p?.prices?.find((price) => price?.currencyId == currencyIdState)
                  ?.amount &&
              p?.variants
                ?.map((res) => {
                  return res?.values?.map((res) => {
                    return res?.id;
                  });
                })
                .toString() ==
                prod?.variants
                  ?.map((res) => {
                    return res?.values?.map((res) => {
                      return res?.id;
                    });
                  })
                  .toString()
          )
        ) {
          uniqueProduct.push(p);
        }
      });
      uniqueProduct.sort((a, b) => {
        if (
          (a?.variants
            ?.map((res) => {
              return res.values.map((res) => {
                return res.id;
              });
            })
            .toString() ?? []) >
          (b?.variants
            ?.map((res) => {
              return res.values.map((res) => {
                return res.id;
              });
            })
            .toString() ?? [])
        )
          return -1;
        if (
          (a?.variants
            ?.map((res) => {
              return res.values.map((res) => {
                return res.id;
              });
            })
            .toString() ?? []) <
          (b?.variants
            ?.map((res) => {
              return res.values.map((res) => {
                return res.id;
              });
            })
            .toString() ?? [])
        )
          return 1;
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      });
      return uniqueProduct;
    } else {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPreview]);

  const onSubmitCupom = () => {
    const val = document.getElementById('couponCode') as HTMLInputElement;
    setCouponCodeInput(val?.value !== '' ? val?.value : undefined);
    getOrderPreviewFn(val?.value);
  };

  const [poolStatus, setPoolStatus] = useState(true);
  const [countdown, setCountdown] = useState(true);
  const orderId = orderResponse?.id ?? '';
  const [statusResponse, setStatusResponse] = useState<CreateOrderResponse>();
  const [codeQr, setCodeQr] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (
      poolStatus &&
      orderId !== '' &&
      (isCoinPayment || orderResponse?.passShareCodeInfo)
    ) {
      validateOrderStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolStatus, isCoinPayment, orderResponse?.passShareCodeInfo]);

  const validateOrderStatus = async () => {
    if (
      poolStatus &&
      orderId &&
      (isCoinPayment || orderResponse?.passShareCodeInfo)
    ) {
      const interval = setInterval(() => {
        getStatus.mutate(
          { companyId, orderId },
          {
            onSuccess: (data: CreateOrderResponse) => {
              if (isCoinPayment) {
                if (data.status === 'pending' && countdown) {
                  setCountdown(false);
                } else if (data.status === 'failed') {
                  setCountdown(false);
                  clearInterval(interval);
                  setPoolStatus(false);
                  setStatusResponse(data);
                  setError(data?.failReason ?? '');
                } else if (
                  data.status == 'concluded' ||
                  data.status == 'delivering'
                ) {
                  clearInterval(interval);
                  setPoolStatus(false);
                  setStatusResponse(data);
                  setCodeQr(
                    `${window?.location?.origin}/order/${data.deliverId}`
                  );
                }
              } else {
                if (data?.passShareCodeInfo?.status == 'generated') {
                  clearInterval(interval);
                  setPoolStatus(false);
                  setStatusResponse(data);
                }
              }
            },
          }
        );
      }, 3000);
    }
  };

  const onClickButton = () => {
    if (error !== '' && statusResponse?.status === 'failed') {
      router.pushConnect(PixwayAppRoutes.CHECKOUT_CONFIRMATION, query);
    } else if (
      context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.link
    ) {
      router.pushConnect(
        context?.defaultTheme?.configurations?.contentData?.checkoutConfig
          ?.actionButton?.link
      );
    } else if (returnAction) {
      returnAction(query);
    } else {
      router.pushConnect(PixwayAppRoutes.MY_TOKENS);
    }
  };

  const buttonText = () => {
    if (error !== '' && statusResponse?.status === 'failed') {
      return translate('components>walletIntegration>tryAgain');
    } else if (
      context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.label
    ) {
      return context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.label;
    } else {
      return translate('tokens>tokenTransferController>goToMyTokens');
    }
  };

  const shareMessage = `${translate('checkout>checkoutInfo>hello')} ${
    orderResponse?.passShareCodeInfo?.data?.destinationUserName
  } ${translate('pass>sharedOrder>yourFriendSendGift', {
    friendName: profile?.data?.data?.name ?? '',
  })}, ${orderResponse?.passShareCodeInfo?.data?.message ?? ''} {sharedLink}`;

  const handleShared = (code: string) => {
    if (shareMessage) {
      copyToClipboard(
        shareMessage.replace(
          '{sharedLink}',
          `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code}`
        )
      );
    } else {
      copyToClipboard('link');
    }
    setTimeout(() => setIsCopied(false), 3000);
  };

  const onRenderGiftsCard = () => {
    if (
      orderResponse?.passShareCodeInfo?.data?.destinationUserEmail ===
      profile?.data?.data?.email
    )
      return (
        <div className="pw-flex pw-flex-col pw-gap-2">
          {statusResponse?.passShareCodeInfo?.codes?.map((code) => (
            <SharedOrder
              key={code?.code}
              initialStep={2}
              shareCode={code?.code}
            />
          ))}
        </div>
      );
    else
      return (
        <div className="pw-my-5 pw-flex pw-flex-wrap pw-gap-8">
          <div className="pw-w-full pw-max-w-[500px] pw-shadow-lg pw-flex pw-flex-col pw-items-center pw-p-6 pw-rounded-xl pw-border pw-border-[#E6E8EC]">
            <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
              {productCache?.choosedPayment?.paymentMethod === 'transfer'
                ? translate('checkout>checkoutInfo>paymentAnalysis')
                : translate('checkout>checkoutInfo>purchaseSucess')}
            </p>
            <div className="pw-w-full pw-max-w-[386px] pw-mt-5 pw-flex pw-flex-col pw-items-center pw-text-black">
              {statusResponse?.passShareCodeInfo?.codes?.map((code) => (
                <div
                  key={code?.code}
                  className="pw-w-full pw-max-w-[386px] pw-mt-5 pw-flex pw-flex-col pw-items-center pw-border pw-border-[#E6E8EC] pw-p-5 pw-rounded-[20px]"
                >
                  <img
                    className="pw-mt-6 pw-w-[250px] pw-h-[250px] pw-object-contain pw-rounded-lg sm:pw-w-[300px] sm:pw-h-[300px]"
                    src={
                      statusResponse?.products?.[0]?.productToken?.product
                        ?.images?.[0]?.thumb
                    }
                    alt=""
                  />
                  <p className="pw-mt-3 pw-font-semibold">{'Gift Card'}</p>
                  <p className="pw-mt-1 pw-text-[32px] pw-font-bold pw-mb-5">
                    {'R$'}
                    {(
                      parseFloat(orderResponse?.totalAmount) /
                      (statusResponse?.passShareCodeInfo?.codes?.length ?? 1)
                    ).toFixed(2) ?? ''}
                  </p>
                  <div className="pw-w-full pw-flex pw-flex-col pw-gap-[15px]">
                    <p className="pw-mt-4 pw-font-bold pw-text-center">
                      {translate('checkout>checkoutInfo>sendToFriend')}
                    </p>
                    <a
                      target="_blank"
                      className="pw-text-center !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
                      href={
                        isMobile
                          ? `whatsapp://send?text=${encodeURIComponent(
                              `${shareMessage.replace(
                                '{sharedLink}',
                                `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code?.code}`
                              )}`
                            )}`
                          : `https://api.whatsapp.com/send?text=${encodeURIComponent(
                              `${shareMessage.replace(
                                '{sharedLink}',
                                `${window?.location?.protocol}//${window?.location?.hostname}/pass/share/${code?.code}`
                              )}`
                            )}`
                      }
                      data-action="share/whatsapp/share"
                      rel="noreferrer"
                    >
                      {'Whatsapp'}
                    </a>
                    <PixwayButton
                      onClick={() => {
                        setIsCopied(true);
                        handleShared(code?.code ?? '');
                      }}
                      style={{
                        backgroundColor: '#0050FF',
                        color: 'white',
                      }}
                      className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
                    >
                      {isCopied
                        ? translate('components>menu>copied')
                        : translate('affiliates>referrakWidget>shared')}
                    </PixwayButton>
                  </div>
                </div>
              ))}
              <p className="pw-mt-3 pw-font-bold pw-text-base pw-text-center">{`Olá, ${orderResponse?.passShareCodeInfo?.data?.destinationUserName}`}</p>
              <p className="pw-font-semibold pw-text-base pw-text-center">
                {translate('pass>sharedOrder>yourFriendSendGift', {
                  friendName: profile?.data?.data?.name ?? '',
                })}
              </p>
              <p className="pw-mt-3 pw-text-base pw-text-center pw-h-[72px]">
                {orderResponse?.passShareCodeInfo?.data?.message}
              </p>
            </div>
          </div>
        </div>
      );
  };

  const changeValue = useCallback(
    (value: string) => {
      setPaymentAmount(value as string);
      if (automaxLoyalty) {
        if (
          organizedLoyalties &&
          organizedLoyalties?.length > 0 &&
          organizedLoyalties?.some(
            (wallet) =>
              wallet?.type == 'loyalty' &&
              wallet?.balance &&
              parseFloat(wallet?.balance ?? '0') > 0
          )
        ) {
          const balance = parseFloat(
            organizedLoyalties.find(
              (wallet) =>
                wallet?.type == 'loyalty' &&
                wallet?.balance &&
                parseFloat(wallet?.balance ?? '0') > 0
            )?.balance ?? '0'
          );
          if (balance < parseFloat(value))
            setCoinAmountPayment(balance.toFixed(2));
          else if (balance > parseFloat(value) || balance == parseFloat(value))
            setCoinAmountPayment(value);
        } else setCoinAmountPayment('');
      }
    },
    [automaxLoyalty, organizedLoyalties]
  );

  const decimals = (orderPreview?.products?.[0] as any)?.requirements
    ?.erc20Decimals;
  const erc20decimals = useMemo(() => {
    if (decimals === undefined) return 'currencyMask';
    if (decimals === 0) return 'integer';
    if (decimals === 1 || decimals >= 3) return 'decimal';
    else return 'currencyMask';
  }, [decimals]);

  const Erc20Input = useMemo(() => {
    if (erc20decimals === 'decimal') {
      return (
        <IMaskInput
          inputMode="numeric"
          radix="."
          mask={Number}
          scale={decimals}
          value={paymentAmount}
          onAccept={(e) => changeValue(e)}
          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
          placeholder={'0.0'}
        />
      );
    } else if (erc20decimals === 'integer') {
      return (
        <IMaskInput
          inputMode="numeric"
          type="number"
          mask={/^\d+$/}
          radix="."
          value={paymentAmount}
          onAccept={(e) => changeValue(e)}
          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
          placeholder={'0'}
        />
      );
    } else {
      return (
        <CurrencyInput
          onChangeValue={(_, value) => {
            if (value) {
              changeValue(value as string);
            }
          }}
          value={paymentAmount}
          hideSymbol={isErc20 && !isCoinPayment}
          InputElement={
            <input
              inputMode="numeric"
              className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
              placeholder={isErc20 && !isCoinPayment ? '0.00' : 'R$ 0,00'}
            />
          }
        />
      );
    }
  }, [
    changeValue,
    decimals,
    erc20decimals,
    isCoinPayment,
    isErc20,
    paymentAmount,
  ]);

  const {
    commonCurrencies,
    hasCommonCurrencies,
    productsWithoutCommonCurrencies,
  } = useMemo(() => analyzeCurrenciesInCart(cart), [cart]);

  const [currVal, setCurrVal] = useState(cartCurrencyId?.id);

  const locale = useLocale();
  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            {!isCoinPayment && !isErc20 && (
              <PriceAndGasInfo
                payments={orderPreview?.payments}
                name={
                  orderPreview?.products && orderPreview?.products?.length
                    ? orderPreview?.products[0]?.prices.find(
                        (price) => price?.currency?.id == currencyIdState
                      )?.currency?.name
                    : 'BRL'
                }
                loading={isLoading || isLoadingPreview}
                className="pw-mt-4"
              />
            )}
            {(isCoinPayment || isErc20) && (
              <>
                {datasource?.master?.data && destinationUser && (
                  <Selector
                    disabled={!editableDestination}
                    data={datasource?.master?.data}
                    title={translate('checkout>checkoutInfo>youPayFor')}
                    initialValue={
                      datasource?.master?.data.filter(
                        (e: { attributes: { slug: string | null } }) =>
                          e?.attributes?.slug === destinationUser
                      )[0]?.id
                    }
                    onChange={(e) =>
                      router.pushConnect(
                        PixwayAppRoutes.CHECKOUT_CONFIRMATION,
                        { ...router.query, destination: e }
                      )
                    }
                    classes={{
                      title: '!pw-font-[400] pw-font-poppins',
                      value: '!pw-font-[700] pw-font-poppins',
                    }}
                  />
                )}
                <p className="pw-font-[400] pw-text-base pw-text-[#35394C] pw-mt-5 pw-mb-2">
                  {acceptMultipleCurrenciesPurchase
                    ? null
                    : isErc20 && !isCoinPayment
                    ? translate('checkout>checkoutInfo>valueOfPay2') +
                      ' ' +
                      orderPreview?.products?.[0]?.name
                    : translate('checkout>checkoutInfo>valueOfPay')}
                </p>
                <div className="pw-mb-8">
                  {acceptMultipleCurrenciesPurchase ? null : (
                    <div>
                      <div className="pw-flex pw-gap-3">
                        <div>{Erc20Input}</div>
                        {batchSize ? (
                          <div className="pw-flex pw-gap-2">
                            <button
                              onClick={() =>
                                setPaymentAmount(
                                  (
                                    parseFloat(paymentAmount) -
                                    parseFloat(batchSize)
                                  ).toString() + ',00'
                                )
                              }
                              className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[42px]"
                              disabled={parseFloat(paymentAmount) === 0}
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                setPaymentAmount(
                                  (
                                    parseFloat(paymentAmount) +
                                    parseFloat(batchSize)
                                  ).toString() + ',00'
                                )
                              }
                              className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[42px]"
                            >
                              +
                            </button>
                          </div>
                        ) : null}
                      </div>
                      {batchSize ? (
                        <p className="pw-text-gray-500 pw-text-xs pw-mt-2">
                          {translate('pages>checkout>batchSize', { batchSize })}
                        </p>
                      ) : null}
                    </div>
                  )}
                  {automaxLoyalty ? (
                    <p className="pw-text-sm pw-text-[#35394C] pw-font-[400] pw-mt-2 pw-font-poppins">
                      {translate('wallet>page>balance')}{' '}
                      {organizedLoyalties?.[0]?.currency}:{' '}
                      {organizedLoyalties &&
                      organizedLoyalties?.length > 0 &&
                      organizedLoyalties?.some(
                        (wallet) =>
                          wallet?.type == 'loyalty' &&
                          wallet?.balance &&
                          parseFloat(wallet?.balance ?? '0') > 0
                      ) ? (
                        <>
                          {organizedLoyalties.find(
                            (wallet) =>
                              wallet?.type == 'loyalty' &&
                              wallet?.balance &&
                              parseFloat(wallet?.balance ?? '0') > 0
                          )?.pointsPrecision == 'decimal'
                            ? parseFloat(
                                organizedLoyalties.find(
                                  (wallet) =>
                                    wallet?.type == 'loyalty' &&
                                    wallet?.balance &&
                                    parseFloat(wallet?.balance ?? '0') > 0
                                )?.balance ?? '0'
                              ).toFixed(2)
                            : parseFloat(
                                organizedLoyalties.find(
                                  (wallet) =>
                                    wallet?.type == 'loyalty' &&
                                    wallet?.balance &&
                                    parseFloat(wallet?.balance ?? '0') > 0
                                )?.balance ?? '0'
                              ).toFixed(0)}
                        </>
                      ) : (
                        '0'
                      )}
                    </p>
                  ) : null}
                </div>
                {paymentAmount === '' ||
                parseFloat(paymentAmount) === 0 ||
                !isCoinPayment ? null : (
                  <CoinPaymentResume
                    payments={orderPreview?.payments}
                    loading={isLoading || isLoadingPreview}
                    currency={organizedLoyalties?.[0]?.currency}
                  />
                )}
              </>
            )}
            {hideCoupon ? null : (
              <>
                <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
                  {translate('checkout>checkoutInfo>coupon')}
                </p>
                <div className="pw-mb-8">
                  <div className="pw-flex pw-gap-3">
                    <input
                      name="couponCode"
                      id="couponCode"
                      placeholder={translate(
                        'checkout>checkoutInfo>couponCode'
                      )}
                      className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-flex-[0.3] focus:pw-outline-none"
                      defaultValue={couponCodeInput}
                    />
                    <PixwayButton
                      onClick={onSubmitCupom}
                      className="!pw-py-3 sm:!pw-px-[42px] !pw-px-0 sm:pw-flex-[0.1] pw-flex-[1] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] !pw-border !pw-border-[#DCDCDC] !pw-rounded-full hover:pw-shadow-xl disabled:hover:pw-shadow-none"
                    >
                      {translate('checkout>checkoutInfo>applyCoupon')}
                    </PixwayButton>
                  </div>
                  {orderPreview?.appliedCoupon && (
                    <p className="pw-text-gray-500 pw-text-xs pw-mt-2">
                      {translate('checkout>checkoutInfo>coupon')}{' '}
                      <b>&apos;{orderPreview?.appliedCoupon}&apos;</b>{' '}
                      {translate('checkout>checkoutInfo>couponAppliedSucces')}
                    </p>
                  )}
                  {orderPreview?.appliedCoupon === null &&
                    couponCodeInput !== '' &&
                    couponCodeInput !== undefined && (
                      <p className="pw-text-red-500 pw-text-xs pw-mt-2">
                        {translate('checkout>checkoutInfo>invalidCoupon')}
                      </p>
                    )}
                </div>
              </>
            )}
            {!isCoinPayment && isErc20 && (
              <PriceAndGasInfo
                isErc20
                payments={orderPreview?.payments}
                name={
                  orderPreview?.products && orderPreview?.products?.length
                    ? orderPreview?.products[0]?.prices.find(
                        (price) => price?.currency?.id == currencyIdState
                      )?.currency?.name
                    : 'BRL'
                }
                loading={isLoading || isLoadingPreview}
                className="pw-my-4"
              />
            )}
            {isCart && hasCommonCurrencies && commonCurrencies.length > 1 ? (
              <div className="pw-container pw-mx-auto pw-mb-8">
                <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-start">
                  <p className="pw-font-bold pw-text-black pw-text-left pw-mb-4">
                    {translate('checkout>currencyAnalyze>chooseCurrency')}
                  </p>
                  <div className="">
                    <form className="pw-flex pw-gap-4" action="submit">
                      <BaseSelect
                        options={commonCurrencies.map((res) => {
                          return { value: res.id, label: res.symbol };
                        })}
                        value={currVal}
                        onChangeValue={(e) => {
                          setCurrVal(e);
                          setCurrencyIdState(e as string);
                          setCartCurrencyId?.(
                            commonCurrencies.find((res) => res.id === e)
                          );
                        }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
            {parseFloat(
              orderPreview?.payments?.filter(
                (e) => e.currencyId === currencyIdState
              )[0]?.totalPrice ?? '0'
            ) === 0 ||
            (isCoinPayment &&
              (paymentAmount === '' ||
                parseFloat(paymentAmount) === 0)) ? null : (
              <PaymentMethodsComponent
                loadingPreview={isLoadingPreview}
                methodSelected={
                  choosedPayment ?? ({} as PaymentMethodsAvaiable)
                }
                methods={
                  orderPreview?.payments?.filter(
                    (e) => e.currencyId === currencyIdState
                  )[0]?.providersForSelection ?? []
                }
                onSelectedPayemnt={setChoosedPayment}
                title={
                  isCoinPayment
                    ? translate('checkout>checkoutInfo>howCompletePayment')
                    : translate('checkout>checkoutInfo>paymentMethod')
                }
                titleClass={
                  isCoinPayment
                    ? '!pw-font-[400] pw-font-poppins !pw-text-base'
                    : ''
                }
              />
            )}
            {isCoinPayment && (
              <>
                {!automaxLoyalty ? (
                  <>
                    <p className="pw-font-[600] pw-text-sm pw-font-poppins pw-text-[#35394C] pw-mt-5 pw-mb-2">
                      {organizedLoyalties?.[0]?.currency} ({' '}
                      {translate('wallet>page>balance')}:{' '}
                      {organizedLoyalties &&
                      organizedLoyalties?.length > 0 &&
                      organizedLoyalties?.some(
                        (wallet) =>
                          wallet?.type == 'loyalty' &&
                          wallet?.balance &&
                          parseFloat(wallet?.balance ?? '0') > 0
                      ) ? (
                        <>
                          {organizedLoyalties.find(
                            (wallet) =>
                              wallet?.type == 'loyalty' &&
                              wallet?.balance &&
                              parseFloat(wallet?.balance ?? '0') > 0
                          ).pointsPrecision == 'decimal'
                            ? parseFloat(
                                organizedLoyalties.find(
                                  (wallet) =>
                                    wallet?.type == 'loyalty' &&
                                    wallet?.balance &&
                                    parseFloat(wallet?.balance ?? '0') > 0
                                )?.balance ?? '0'
                              ).toFixed(2)
                            : parseFloat(
                                organizedLoyalties.find(
                                  (wallet) =>
                                    wallet?.type == 'loyalty' &&
                                    wallet?.balance &&
                                    parseFloat(wallet?.balance ?? '0') > 0
                                )?.balance ?? '0'
                              ).toFixed(0)}
                        </>
                      ) : (
                        '0'
                      )}
                      )
                    </p>
                    <div className="pw-mb-8">
                      <div className="pw-flex pw-gap-3">
                        <CurrencyInput
                          hideSymbol
                          onChangeValue={(_, value) => {
                            if (value) {
                              setCoinAmountPayment(value as string);
                            }
                          }}
                          defaultValue={coinAmountPayment}
                          InputElement={
                            <input
                              disabled={
                                (paymentAmount === '' || automaxLoyalty) &&
                                !acceptMultipleCurrenciesPurchase
                              }
                              className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none pw-font-poppins"
                              placeholder="0,0"
                            />
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : null}
                {acceptMultipleCurrenciesPurchase ? (
                  <>
                    <CoinPaymentResume
                      payments={orderPreview?.payments}
                      loading={isLoading || isLoadingPreview}
                      currency={organizedLoyalties?.[0]?.currency}
                    />
                    {paymentComplement ? (
                      <PaymentMethodsComponent
                        loadingPreview={isLoadingPreview}
                        methodSelected={
                          choosedPayment ?? ({} as PaymentMethodsAvaiable)
                        }
                        methods={
                          orderPreview?.payments?.filter(
                            (e) => e.currencyId === currencyIdState
                          )[0]?.providersForSelection ?? []
                        }
                        onSelectedPayemnt={setChoosedPayment}
                        title={
                          isCoinPayment
                            ? translate(
                                'checkout>checkoutInfo>howCompletePayment'
                              )
                            : translate('checkout>checkoutInfo>paymentMethod')
                        }
                        titleClass={
                          isCoinPayment
                            ? '!pw-font-[400] pw-font-poppins !pw-text-base'
                            : ''
                        }
                      />
                    ) : null}
                  </>
                ) : null}
                {!payWithCoin() ? (
                  <Alert variant="atention" className="pw-mt-3">
                    {coinError}
                  </Alert>
                ) : null}
                {paymentAmount === '' ||
                parseFloat(paymentAmount) === 0 ? null : (
                  <>
                    <Alert
                      variant="success"
                      className="!pw-text-black !pw-font-normal pw-mt-4 pw-font-poppins"
                    >
                      {translate('checkout>checkoutInfo>youWin')}{' '}
                      <b className="pw-mx-[4px]">
                        {isLoading || isLoadingPreview ? (
                          <Shimmer />
                        ) : (
                          'R$' + orderPreview?.cashback?.cashbackAmount
                        )}
                      </b>{' '}
                      {translate('checkout>checkoutInfo>inZucas')}
                    </Alert>
                  </>
                )}
              </>
            )}
            <div className="pw-flex pw-mt-4 pw-gap-x-4">
              <PixwayButton
                onClick={
                  returnAction
                    ? () => returnAction(query)
                    : () => {
                        router.pushConnect(PixwayAppRoutes.HOME);
                      }
                }
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>cancel')}
              </PixwayButton>
              <PixwayButton
                disabled={
                  !orderPreview ||
                  isLoadingPreview ||
                  !payWithCoin() ||
                  (isCoinPayment &&
                    (paymentAmount === '' || parseFloat(paymentAmount) === 0) &&
                    !acceptMultipleCurrenciesPurchase)
                }
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {parseFloat(orderPreview?.totalPrice ?? '0') !== 0
                  ? translate('shared>continue')
                  : 'Finalizar pedido'}
              </PixwayButton>
            </div>
            {requestError !== '' &&
            requestErrorCode === 'resale-purchase-batch-size-error' ? (
              <Alert className="pw-mt-3" variant="error">
                {requestError}
              </Alert>
            ) : null}
          </>
        );
      case CheckoutStatus.FINISHED:
        if (orderResponse?.passShareCodeInfo) {
          if (statusResponse?.passShareCodeInfo?.status == 'generated')
            return onRenderGiftsCard();
          else
            return (
              <div>
                <Spinner className="pw-h-10 pw-w-10" />
              </div>
            );
        }
        return (
          <div className="pw-mt-4">
            {(productCache?.isCoinPayment || isCoinPayment) &&
            (!productCache?.acceptMultipleCurrenciesPurchase ||
              !acceptMultipleCurrenciesPurchase) ? (
              <>
                {error !== '' && statusResponse?.status === 'failed' ? (
                  <Alert variant="error">{error}</Alert>
                ) : (
                  <>
                    {statusResponse?.deliverId ? (
                      <p className="pw-text-base pw-font-semibold pw-text-center pw-max-w-[350px] pw-text-black sm:pw-mx-0 pw-mx-auto">
                        {productCache?.choosedPayment?.paymentMethod ===
                        'transfer'
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
                        <p className="pw-text-sm pw-font-semibold">
                          {profile?.data?.data?.name}
                        </p>
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
                            : parseFloat(orderResponse?.totalAmount).toFixed(2)}
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
                  {typeof context?.defaultTheme?.configurations?.contentData
                    ?.checkoutConfig?.message === 'string'
                    ? context?.defaultTheme?.configurations?.contentData
                        ?.checkoutConfig?.message
                    : productCache?.choosedPayment?.paymentMethod === 'transfer'
                    ? translate('checkout>checkoutInfo>infoAboutAnalysis')
                    : translate(
                        'checkout>components>checkoutInfo>infoAboutProcessing'
                      )}
                </p>
                <PriceAndGasInfo
                  name={
                    productCache?.products && productCache?.products?.length
                      ? productCache?.products[0]?.prices?.find(
                          (price) =>
                            price?.currencyId ==
                            (router?.query?.currencyId as string)
                        )?.currency?.name
                      : 'BRL'
                  }
                  loading={isLoading}
                  className="pw-mt-4"
                  payments={
                    orderResponse
                      ? orderResponse?.payments
                      : productCache?.payments
                  }
                />
              </>
            )}
            <div
              className={`pw-flex ${
                isCoinPayment || productCache?.isCoinPayment
                  ? 'sm:pw-justify-start pw-justify-center'
                  : 'pw-justify-start'
              }`}
            >
              <PixwayButton
                onClick={onClickButton}
                className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {buttonText()}
              </PixwayButton>
            </div>
          </div>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderPreview,
    erc20decimals,
    decimals,
    choosedPayment,
    currencyIdState,
    isLoadingPreview,
    codeQr,
    statusResponse?.deliverId,
    coinError,
    organizedLoyalties,
    isCopied,
    paymentComplement,
    requestError,
    requestErrorCode,
  ]);

  const anchorCurrencyId = useMemo(() => {
    return orderPreview?.products && orderPreview?.products?.length
      ? orderPreview?.products
          .find((prod) =>
            prod?.prices?.some((price) => price?.anchorCurrencyId)
          )
          ?.prices.find((price) => price?.anchorCurrencyId)?.anchorCurrencyId
      : '';
  }, [orderPreview]);

  const [poolCurrencyAllowanceStatus, setPoolCurrencyAllowanceStatus] =
    useState(false);
  const [currencyAllowanceCountdown, setCurrencyAllowanceCountdown] =
    useState(true);
  const [currencyAllowanceStatusResponse, setCurrencyAllowanceStatusResponse] =
    useState<OrderPreviewResponse>();
  const [timestamp, setTimestamp] = useState(0);
  const [resetError, setResetError] = useState(false);
  const currencyAllowanceState = useMemo(() => {
    if (currencyAllowanceStatusResponse) {
      return currencyAllowanceStatusResponse?.currencyAllowanceState;
    } else {
      return orderPreview?.currencyAllowanceState;
    }
  }, [currencyAllowanceStatusResponse, orderPreview?.currencyAllowanceState]);

  useEffect(() => {
    if (poolCurrencyAllowanceStatus) {
      validateCurrencyAllowanceStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCurrencyAllowanceStatus]);

  const validateCurrencyAllowanceStatus = async () => {
    if (poolCurrencyAllowanceStatus) {
      const interval = setInterval(() => {
        getOrderPreviewFn(couponCodeInput, (data) => {
          if (
            Date.now() - timestamp > 30 * 1000 &&
            (data?.currencyAllowanceState === 'required' ||
              data?.currencyAllowanceState === 'processing')
          ) {
            setResetError(true);
            clearInterval(interval);
            setPoolCurrencyAllowanceStatus(false);
            setCurrencyAllowanceCountdown(false);
          } else if (
            data?.currencyAllowanceState === 'processing' &&
            currencyAllowanceCountdown
          ) {
            setCurrencyAllowanceCountdown(false);
          } else if (data?.currencyAllowanceState === 'allowed') {
            clearInterval(interval);
            setPoolCurrencyAllowanceStatus(false);
            setCurrencyAllowanceStatusResponse(data);
            setCurrencyAllowanceCountdown(false);
          }
        });
      }, 6000);
    }
  };

  const { mainWallet: wallet } = useUserWallet();

  const canBuy = useMemo(
    () =>
      parseFloat(wallet?.balance ?? '0') <
      parseFloat(orderPreview?.totalPrice ?? '0'),
    [orderPreview?.totalPrice, wallet]
  );

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
    requestErrorCode !== 'resale-purchase-batch-size-error' ? (
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
          isErc20 ||
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
                      (prodI) => prodI?.currencyId == currencyIdState
                    )?.currency?.symbol
                  }
                  quantity={
                    orderPreview?.products?.filter(
                      (p) =>
                        p?.id == prod?.id &&
                        prod?.prices?.find(
                          (price) => price?.currencyId == currencyIdState
                        )?.amount ==
                          p?.prices?.find(
                            (price) => price?.currencyId == currencyIdState
                          )?.amount &&
                        p?.variants
                          ?.map((res) => {
                            return res?.values?.map((res) => {
                              return res?.id;
                            });
                          })
                          .toString() ==
                          prod?.variants
                            ?.map((res) => {
                              return res?.values?.map((res) => {
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
                  deleteProduct={(id, variants) => {
                    try {
                      track('remove_from_cart', {
                        value: parseFloat(
                          prod?.prices?.find(
                            (price) => price?.currencyId == currencyIdState
                          )?.amount ?? '0'
                        ).toString(),
                        currency: prod?.prices?.find(
                          (prodI) => prodI?.currencyId == currencyIdState
                        )?.currency?.code,
                        items: [{ item_id: id, item_name: prod.name }],
                      });
                    } catch (err) {
                      console.log('Erro ao salvar o track: ', err);
                    }

                    deleteProduct(
                      id,
                      prod?.prices?.find(
                        (price) => price?.currencyId == currencyIdState
                      )?.amount ?? '0',
                      variants
                    );
                  }}
                  id={prod?.id}
                  key={index}
                  image={prod?.images[0]?.thumb}
                  name={prod?.name}
                  price={parseFloat(
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
                    )?.amount ??
                      productCache?.orderProducts?.find(
                        (val) => val?.productId === prod?.id
                      )?.expectedPrice ??
                      '0'
                  ).toString()}
                  originalPrice={parseFloat(
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
                    )?.originalAmount ?? '0'
                  ).toString()}
                  variants={prod?.variants}
                  anchorCurrencyAmount={parseFloat(
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
                    )?.anchorCurrencyAmount ?? '0'
                  ).toString()}
                  anchorCurrencySymbol={
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
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
                <p className="pw-text-xs  pw-font-medium pw-text-[#777E8F]">
                  *{translate('checkout>checkoutInfo>valueOfProductOn')}{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod?.prices?.find(
                          (price) => price?.currencyId == currencyIdState
                        )
                      )
                      ?.prices?.find(
                        (price) => price?.currencyId == currencyIdState
                      )?.currency?.symbol
                  }{' '}
                  {translate('checkout>checkoutInfo>varyAcordingExchange')}{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod?.prices?.some(
                          (price) => price?.currencyId == currencyIdState
                        )
                      )
                      ?.prices?.find(
                        (price) => price?.currencyId == currencyIdState
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
                    (price) => price.currencyId == currencyIdState
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
