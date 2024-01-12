/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { useTranslation } from 'react-i18next';
import { useDebounce, useInterval, useLocalStorage } from 'react-use';

import { QRCodeSVG } from 'qrcode.react';

import { useProfile } from '../../../shared';
import ValueChangeIcon from '../../../shared/assets/icons/icon-up-down.svg?react';
import { Alert } from '../../../shared/components/Alert';
import { Shimmer } from '../../../shared/components/Shimmer';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { CurrencyEnum } from '../../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useModalController } from '../../../shared/hooks/useModalController';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { Product } from '../../../shared/interface/Product';
import { useGetRightWallet } from '../../../shared/utils/getRightWallet';
import { Selector } from '../../../storefront/components/Selector';
import { Variants } from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import {
  ORDER_COMPLETED_INFO_KEY,
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
  productId,
  currencyId,
  isCart = false,
}: CheckoutInfoProps) => {
  const { datasource } = useDynamicApi();
  const organizedLoyalties = useGetRightWallet();
  const router = useRouterConnect();
  const profile = useProfile();
  const { isOpen, openModal, closeModal } = useModalController();
  const [requestError, setRequestError] = useState(false);
  const { getOrderPreview, getStatus } = useCheckout();
  const [translate] = useTranslation();
  const { setCart, cart } = useCart();
  const [productErros, setProductErros] = useState<ProductErrorInterface[]>([]);
  const [productCache, setProductCache, deleteKey] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [orderResponse, _, deleteOrderKey] =
    useLocalStorage<CreateOrderResponse>(ORDER_COMPLETED_INFO_KEY);
  const [productVariants] = useLocalStorage<any>(PRODUCT_VARIANTS_INFO_KEY);
  const query = useQuery();
  const params = new URLSearchParams(query);
  const isCoinPayment = params.get('coinPayment')?.includes('true')
    ? true
    : false;
  const destinationWalletAddress = params.get('destinationWalletAddress');
  const [productIds, setProductIds] = useState<string[] | undefined>(productId);
  const [currencyIdState, setCurrencyIdState] = useState<string | undefined>(
    currencyId
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
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
  const { companyId } = useCompanyConfig();
  useEffect(() => {
    if (
      checkUtm &&
      utms.utm_campaign &&
      utms?.expires &&
      new Date().getTime() < utms?.expires &&
      orderPreview?.appliedCoupon === null
    ) {
      const val = document.getElementById('couponCode') as HTMLInputElement;
      val.value = '';
      setCheckUtm(false);
      setCouponCodeInput('');
      getOrderPreviewFn(couponCodeInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPreview?.appliedCoupon, utms?.expires, utms.utm_campaign]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [coinAmountPayment, setCoinAmountPayment] = useState('');
  const { data: session } = usePixwaySession();

  const token = session ? (session.accessToken as string) : null;

  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
      deleteOrderKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  useEffect(() => {
    if (
      !productIds &&
      !currencyIdState &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      const params = new URLSearchParams(query);
      const productIdsFromQueries = params.get('productIds');
      const currencyIdFromQueries = params.get('currencyId');
      if (productIdsFromQueries) {
        setProductIds(productIdsFromQueries.split(','));
      }
      if (currencyIdFromQueries) {
        setCurrencyIdState(currencyIdFromQueries);
      }
    } else {
      const preview = productCache;
      setCurrencyIdState(preview?.currencyId);
      if (preview && preview.products.length > 0) {
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
      } else if (preview && preview.products.length == 0 && isCart) {
        setCart([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(query);
    const currencyIdFromQueries = params.get('currencyId');
    if (currencyIdFromQueries) {
      setCurrencyIdState(currencyIdFromQueries);
    }
  }, [query]);

  const getOrderPreviewFn = (couponCode?: string) => {
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
                const payload = {
                  quantity: paymentAmount != '' ? parseFloat(paymentAmount) : 1,
                  productId: p,
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
                  },
                  {
                    currencyId: '6ec75381-dd84-4edc-bedb-1a77fb430e10',
                    paymentMethod: 'crypto',
                    amountType: 'percentage',
                    amount: (
                      (parseFloat(coinAmountPayment) * 100) /
                      parseFloat(paymentAmount)
                    ).toFixed(5),
                  },
                ]
              : [
                  {
                    currencyId: currencyIdState,
                    amountType: 'percentage',
                    amount: '100',
                  },
                ],
          currencyId: currencyIdState,
          companyId,
          couponCode: coupon(),
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: OrderPreviewResponse) => {
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
            setCart(
              data.products.map((val) => {
                return {
                  id: val.id,
                  variantIds: val?.variants?.map((val) => val.values[0].id),
                  prices: val.prices,
                };
              })
            );
            cart.sort((a, b) => {
              if (a.id > b.id) return -1;
              if (a.id < b.id) return 1;
              return 0;
            });
            if (data.products.map((p) => p.id).length != productIds.length) {
              setProductIds(data.products.map((p) => p.id));
              productIds?.sort((a, b) => {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
              });
            }
          },
          onError: () => {
            setRequestError(true);
          },
        }
      );
    }
  };

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
      setCoinError(
        'O quantidade de moedas utilizadas não pode ser maior que o valor a pagar'
      );
      return false;
    }
    if (
      parseFloat(coinAmountPayment) >
      parseFloat(
        organizedLoyalties?.filter((wallet) => wallet.type == 'loyalty')?.[0]
          ?.balance
      )
    ) {
      setCoinError('Você não possui saldo suficiente');
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
            return {
              quantity: paymentAmount != '' ? parseFloat(paymentAmount) : 1,
              productId: pID.id,
              expectedPrice:
                pID.prices.find((price) => price.currencyId == currencyIdState)
                  ?.amount ?? '0',
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
        products: orderPreview.products,
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
          walletAddress: destinationWalletAddress ?? '',
          name: datasource?.master?.data.filter(
            (e: { attributes: { walletAddress: string | null } }) =>
              e.attributes.walletAddress === destinationWalletAddress
          )[0]?.attributes?.name,
        },
        isCoinPayment,
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
        productIds?.filter((filteredId) => filteredId == id).length <
          productIds?.filter((filteredId) => filteredId == id).length +
            (add ? 1 : -1)
      ) {
        newArray = [...productIds, id];
      } else {
        productIds?.forEach((idProd) => {
          if (
            id != idProd ||
            newArray.filter((idNew) => idNew == idProd).length <
              productIds?.filter((filteredId) => filteredId == idProd).length +
                (add ? 1 : -1)
          ) {
            newArray.push(idProd);
          }
        });
      }
      router.push(
        isCart
          ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
          : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
        {
          query: {
            productIds: newArray.join(','),
            currencyId: orderPreview?.products[0].prices.find(
              (price) => price.currencyId == currencyIdState
            )?.currencyId,
          },
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
        router.push(PixwayAppRoutes.CHECKOUT_CONFIRMATION, {
          query: {
            productIds: newArray.join(','),
            currencyId: orderPreview?.products[0].prices.find(
              (price) => price.currencyId == currencyIdState
            )?.currencyId,
          },
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
            newIds.splice(ind, filteredProds.length);
            let newArray: Array<string> = [];
            newArray = [...newIds, ...Array(quantity).fill(id)];
            router.push(PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION, {
              query: {
                productIds: newArray.join(','),
                currencyId: orderPreview?.products[0].prices.find(
                  (price) => price.currencyId == currencyIdState
                )?.currencyId,
              },
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
          newValue.splice(ind, filteredProds.length);
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

    router.push(
      isCart
        ? PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION
        : PixwayAppRoutes.CHECKOUT_CONFIRMATION,
      {
        query: {
          productIds: filteredProds?.map((p) => p.id).join(','),
          currencyId: orderPreview?.products[0].prices.find(
            (price) => price.currencyId == currencyIdState
          )?.currencyId,
        },
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
    if (orderPreview && orderPreview.products.length) {
      const uniqueProduct: Product[] = [];
      orderPreview.products.forEach((p) => {
        if (
          !uniqueProduct.some(
            (prod) =>
              p?.id == prod?.id &&
              prod.prices.find((price) => price.currencyId == currencyIdState)
                ?.amount ==
                p.prices.find((price) => price.currencyId == currencyIdState)
                  ?.amount &&
              p?.variants
                ?.map((res) => {
                  return res.values.map((res) => {
                    return res.id;
                  });
                })
                .toString() ==
                prod?.variants
                  ?.map((res) => {
                    return res.values.map((res) => {
                      return res.id;
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
    setCouponCodeInput(val.value !== '' ? val.value : undefined);
    getOrderPreviewFn(val.value);
  };

  const [poolStatus, setPoolStatus] = useState(true);
  const [countdown, setCountdown] = useState(true);
  const orderId = orderResponse?.id ?? '';
  const [statusResponse, setStatusResponse] = useState<CreateOrderResponse>();
  const [codeQr, setCodeQr] = useState('');
  useEffect(() => {
    if (poolStatus && orderId !== '') {
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
              } else if (
                data.status == 'concluded' ||
                data.status == 'delivering'
              ) {
                clearInterval(interval);
                setPoolStatus(false);
                setStatusResponse(data);
                setCodeQr(data.deliverId);
              }
            },
          }
        );
      }, 3000);
    }
  };

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            {!isCoinPayment && (
              <PriceAndGasInfo
                payments={orderPreview?.payments}
                name={
                  orderPreview?.products && orderPreview?.products.length
                    ? orderPreview?.products[0]?.prices.find(
                        (price) => price.currency.id == currencyIdState
                      )?.currency.name
                    : 'BRL'
                }
                loading={isLoading || isLoadingPreview}
                className="pw-mt-4"
              />
            )}
            {isCoinPayment && (
              <>
                {datasource?.master?.data && (
                  <Selector
                    data={datasource.master.data}
                    title="Restaurante"
                    initialValue={
                      datasource?.master?.data.filter(
                        (e: { attributes: { walletAddress: string | null } }) =>
                          e.attributes.walletAddress ===
                          destinationWalletAddress
                      )[0]?.id
                    }
                    onChange={(e) =>
                      router.pushConnect(
                        `/checkout/confirmation?productIds=36a3eec4-05e1-437d-a2b6-8b830ec84326&currencyId=65fe1119-6ec0-4b78-8d30-cb989914bdcb&coinPayment=true&destinationWalletAddress=${e}`
                      )
                    }
                  />
                )}
                <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
                  Valor do Pagamento
                </p>
                <div className="pw-mb-8">
                  <div className="pw-flex pw-gap-3">
                    <CurrencyInput
                      onChangeValue={(_, value) => {
                        setPaymentAmount(value as string);
                      }}
                      InputElement={
                        <input
                          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none"
                          placeholder="R$ 0,0"
                        />
                      }
                    />
                  </div>
                </div>
              </>
            )}
            <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
              Cupom
            </p>
            <div className="pw-mb-8">
              <div className="pw-flex pw-gap-3">
                <input
                  name="couponCode"
                  id="couponCode"
                  placeholder="Código do cupom"
                  className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-flex-[0.3] focus:pw-outline-none"
                  defaultValue={couponCodeInput}
                />
                <PixwayButton
                  onClick={onSubmitCupom}
                  className="!pw-py-3 sm:!pw-px-[42px] !pw-px-0 sm:pw-flex-[0.1] pw-flex-[1] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] !pw-border !pw-border-[#DCDCDC] !pw-rounded-full hover:pw-shadow-xl disabled:hover:pw-shadow-none"
                >
                  Aplicar cupom
                </PixwayButton>
              </div>
              {orderPreview?.appliedCoupon && (
                <p className="pw-text-gray-500 pw-text-xs pw-mt-2">
                  Cupom <b>&apos;{orderPreview?.appliedCoupon}&apos;</b>{' '}
                  aplicado com sucesso!
                </p>
              )}
              {orderPreview?.appliedCoupon === null &&
                couponCodeInput !== '' &&
                couponCodeInput !== undefined && (
                  <p className="pw-text-red-500 pw-text-xs pw-mt-2">
                    Cupom inválido ou expirado.
                  </p>
                )}
            </div>
            {parseFloat(
              orderPreview?.payments?.filter(
                (e) => e.currencyId === currencyIdState
              )[0]?.totalPrice ?? '0'
            ) !== 0 && (
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
              />
            )}
            {isCoinPayment && (
              <>
                <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
                  Food Coins (Saldo:{' '}
                  {organizedLoyalties &&
                  organizedLoyalties.length > 0 &&
                  organizedLoyalties.some(
                    (wallet) =>
                      wallet.type == 'loyalty' &&
                      wallet?.balance &&
                      parseFloat(wallet?.balance ?? '0') > 0
                  ) ? (
                    <>
                      {organizedLoyalties.find(
                        (wallet) =>
                          wallet.type == 'loyalty' &&
                          wallet?.balance &&
                          parseFloat(wallet?.balance ?? '0') > 0
                      ).pointsPrecision == 'decimal'
                        ? parseFloat(
                            organizedLoyalties.find(
                              (wallet) =>
                                wallet.type == 'loyalty' &&
                                wallet?.balance &&
                                parseFloat(wallet?.balance ?? '0') > 0
                            )?.balance ?? '0'
                          ).toFixed(2)
                        : parseFloat(
                            organizedLoyalties.find(
                              (wallet) =>
                                wallet.type == 'loyalty' &&
                                wallet?.balance &&
                                parseFloat(wallet?.balance ?? '0') > 0
                            )?.balance ?? '0'
                          ).toFixed(0)}
                    </>
                  ) : null}
                  )
                </p>
                <div className="pw-mb-8">
                  <div className="pw-flex pw-gap-3">
                    <CurrencyInput
                      hideSymbol
                      onChangeValue={(_, value) => {
                        setCoinAmountPayment(value as string);
                      }}
                      InputElement={
                        <input
                          disabled={paymentAmount === ''}
                          className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none"
                          placeholder="0,0"
                        />
                      }
                    />
                  </div>
                </div>
                {!payWithCoin() ? (
                  <Alert variant="atention" className="pw-mt-3">
                    {coinError}
                  </Alert>
                ) : null}
                <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C] pw-mt-[40px]">
                  Resumo da compra
                </p>
                <PriceAndGasInfo
                  payments={orderPreview?.payments}
                  name={
                    orderPreview?.products && orderPreview?.products.length
                      ? orderPreview?.products[0]?.prices.find(
                          (price) => price.currency.id == currencyIdState
                        )?.currency.name
                      : 'BRL'
                  }
                  loading={isLoading || isLoadingPreview}
                  className="pw-mt-4"
                />
                <Alert
                  variant="success"
                  className="!pw-text-black !pw-font-normal pw-mt-4"
                >
                  Voce irá ganhar{' '}
                  <b className="pw-mx-[4px]">
                    {isLoading || isLoadingPreview ? (
                      <Shimmer />
                    ) : (
                      'R$' + orderPreview?.cashback?.cashbackAmount
                    )}
                  </b>{' '}
                  em Food Coins.
                </Alert>
              </>
            )}
            <div className="pw-flex pw-mt-4 pw-gap-x-4">
              <PixwayButton
                onClick={
                  returnAction
                    ? () => returnAction(query)
                    : () => {
                        router.push(PixwayAppRoutes.HOME);
                      }
                }
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>cancel')}
              </PixwayButton>
              <PixwayButton
                disabled={!orderPreview || isLoadingPreview || !payWithCoin()}
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {parseFloat(orderPreview?.totalPrice ?? '0') !== 0
                  ? translate('shared>continue')
                  : 'Finalizar pedido'}
              </PixwayButton>
            </div>
          </>
        );
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-mt-4">
            {productCache?.isCoinPayment ? (
              <>
                <p className="pw-text-base pw-font-semibold pw-text-center sm:pw-text-left pw-text-black">
                  Pagamento realizado com sucesso!
                </p>
                <p className="pw-text-sm pw-font-normal pw-text-center sm:pw-text-left pw-text-black">
                  Apresente esse QR CODE ao estabelecimento para comprovar seu
                  pagamento.
                </p>
                <div className="pw-rounded-xl pw-p-5 pw-border pw-border-[#DCDCDC] pw-text-black pw-text-center sm:pw-text-left pw-mt-5">
                  <div>
                    {statusResponse?.deliverId ? (
                      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
                        <QRCodeSVG value={String(codeQr)} size={150} />
                        <p className="pw-text-[32px] pw-font-semibold">
                          {statusResponse?.deliverId ?? ''}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="pw-text-base pw-font-semibold pw-text-center sm:pw-text-left pw-text-black">
                          Aguardando confirmação do pagamento
                        </p>
                        <div className="pw-mt-5">
                          <Spinner className="pw-mx-auto" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="pw-mt-5">
                    <p className="pw-text-xs pw-font-normal">
                      Nome do restaurante
                    </p>
                    <p className="pw-text-xs pw-font-semibold">
                      {productCache?.destinationUser?.name}
                    </p>
                  </div>
                  <div className="pw-mt-5">
                    <p className="pw-text-xs pw-font-normal">Nome do usuário</p>
                    <p className="pw-text-xs pw-font-semibold">
                      {profile?.data?.data?.name}
                    </p>
                  </div>
                  <div className="pw-mt-5">
                    <p className="pw-text-xs pw-font-normal">Valor pago</p>
                    <p className="pw-text-xs pw-font-semibold">
                      R$
                      {orderResponse?.totalAmount?.[0]?.amount ??
                        orderResponse?.totalAmount}
                    </p>
                  </div>
                  <div className="pw-mt-5">
                    <p className="pw-text-xs pw-font-normal">Cashback ganho</p>
                    <p className="pw-text-xs pw-font-semibold">
                      R${productCache?.cashback}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="pw-text-xs pw-text-[#353945] ">
                  {translate(
                    'checkout>components>checkoutInfo>infoAboutProcessing'
                  )}
                </p>
                <PriceAndGasInfo
                  name={
                    productCache?.products && productCache?.products.length
                      ? productCache?.products[0].prices.find(
                          (price) =>
                            price.currencyId ==
                            (router.query.currencyId as string)
                        )?.currency.name
                      : 'BRL'
                  }
                  loading={isLoading}
                  className="pw-mt-4"
                  payments={productCache?.payments}
                />
              </>
            )}
            <PixwayButton
              onClick={
                returnAction
                  ? () => returnAction(query)
                  : () => {
                      router.pushConnect(PixwayAppRoutes.MY_TOKENS);
                    }
              }
              className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
            >
              {translate('tokens>tokenTransferController>goToMyTokens')}
            </PixwayButton>
          </div>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderPreview,
    choosedPayment,
    currencyIdState,
    isLoadingPreview,
    codeQr,
    statusResponse?.deliverId,
    coinError,
  ]);

  const anchorCurrencyId = useMemo(() => {
    return orderPreview?.products && orderPreview.products.length
      ? orderPreview?.products
          .find((prod) => prod.prices.some((price) => price.anchorCurrencyId))
          ?.prices.find((price) => price.anchorCurrencyId)?.anchorCurrencyId
      : '';
  }, [orderPreview]);

  return requestError ? (
    <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
      <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
        <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
          Houve um erro de comunicação com o servidor, entre em contato com
          nosso suporte.
        </p>
        <WeblockButton
          className="pw-text-white pw-mt-6"
          onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
        >
          Voltar para a home
        </WeblockButton>
      </div>
    </div>
  ) : (
    <>
      <div className="pw-flex pw-flex-col sm:pw-flex-row">
        <div className="pw-w-full lg:pw-px-[60px] pw-px-0 pw-mt-6 sm:pw-mt-0">
          {isCoinPayment || productCache?.isCoinPayment ? null : (
            <>
              <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
                Resumo da compra
              </p>

              {checkoutStatus == CheckoutStatus.FINISHED && (
                <p className="pw-font-[700] pw-text-[#295BA6] pw-text-2xl pw-mb-6 pw-mt-2">
                  {translate(
                    'checkout>components>checkoutInfo>proccessingBlockchain'
                  )}
                </p>
              )}
            </>
          )}
          {isCoinPayment || productCache?.isCoinPayment ? null : (
            <div className="pw-border pw-bg-white pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl pw-overflow-hidden">
              {differentProducts.map((prod, index) => (
                <ProductInfo
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
                  deleteProduct={(id, variants) =>
                    deleteProduct(
                      id,
                      prod?.prices?.find(
                        (price) => price?.currencyId == currencyIdState
                      )?.amount ?? '0',
                      variants
                    )
                  }
                  id={prod?.id}
                  key={index}
                  image={prod?.images[0]?.thumb}
                  name={prod?.name}
                  price={parseFloat(
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
                    )?.amount ?? '0'
                  ).toString()}
                  originalPrice={parseFloat(
                    prod?.prices?.find(
                      (price) => price?.currencyId == currencyIdState
                    )?.originalAmount ?? '0'
                  ).toString()}
                  variants={prod?.variants}
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
                <ValueChangeIcon className="pw-mt-1" />
                <p className="pw-text-xs  pw-font-medium pw-text-[#777E8F]">
                  *O valor do produto em{' '}
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
                  pode variar de acordo com a cotação desta moeda em{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod?.prices?.some(
                          (price) => price?.currencyId == anchorCurrencyId
                        )
                      )
                      ?.prices?.find(
                        (price) => price?.currencyId == anchorCurrencyId
                      )?.currency?.symbol
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
                )?.currency.code as CurrencyEnum)
              : CurrencyEnum.BRL
          }
        />
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
