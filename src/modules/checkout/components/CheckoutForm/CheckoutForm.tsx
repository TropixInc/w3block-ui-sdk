/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce, useLocalStorage } from 'react-use';

import _ from 'lodash';

import { FormCompleteKYCWithoutLayout } from '../../../auth';
import { PriceAndGasInfo, useProfile } from '../../../shared';
import ValueChangeIcon from '../../../shared/assets/icons/icon-up-down.svg?react';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetStorageData } from '../../../shared/hooks/useGetStorageData/useGetStorageData';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { Product } from '../../../shared/interface/Product';
import { ThemeContext } from '../../../storefront';
import { Variants } from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
import { useTrack } from '../../../storefront/hooks/useTrack/useTrack';
import {
  PRACTITIONER_DATA_INFO_KEY,
  PRODUCT_VARIANTS_INFO_KEY,
} from '../../config/keys/localStorageKey';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import {
  OrderPreviewResponse,
  PaymentMethodsAvaiable,
  ProductErrorInterface,
} from '../../interface/interface';
import { CheckoutStatus } from '../CheckoutInfo';

const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({
      default: m.WeblockButton,
    })
  )
);

const ProductInfo = lazy(() =>
  import('../../../shared/components/ProductInfo').then((m) => ({
    default: m.ProductInfo,
  }))
);

const ProductError = lazy(() => {
  return import('../ProductError/ProductError').then((m) => ({
    default: m.ProductError,
  }));
});

interface CheckoutFormProps {
  productId?: string[];
  currencyId?: string;
  isCart?: boolean;
}

const _CheckoutForm = ({
  productId,
  currencyId,
  isCart = false,
}: CheckoutFormProps) => {
  const { data: profile } = useProfile();
  const [translate] = useTranslation();
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>(
    CheckoutStatus.CONFIRMATION
  );
  const context = useContext(ThemeContext);
  const hideCoupon =
    context?.defaultTheme?.configurations?.contentData?.checkoutConfig
      ?.hideCoupon;
  const router = useRouterConnect();
  const [requestError, setRequestError] = useState(false);
  const { getOrderPreview } = useCheckout();
  const { setCart, cart } = useCart();
  const [productErros, setProductErros] = useState<ProductErrorInterface[]>([]);
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [productVariants] = useLocalStorage<any>(PRODUCT_VARIANTS_INFO_KEY);
  const query = useQuery();
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
      if (val) {
        val.value = '';
        setCheckUtm(false);
        setCouponCodeInput('');
        getOrderPreviewFn(couponCodeInput);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPreview?.appliedCoupon, utms?.expires, utms.utm_campaign]);
  const { data: session } = usePixwaySession();
  const token = session ? (session.accessToken as string) : null;

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

  const storageData = useGetStorageData(
    PRACTITIONER_DATA_INFO_KEY,
    router?.query?.sessionId as string
  );

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
                const tokenId = storageData?.products?.find(
                  (res: any) => res.productId === p
                )?.tokenId;
                const payload = tokenId
                  ? {
                      quantity: 1,
                      productId: p,
                      productTokenId: tokenId,
                      variantIds: productVariants
                        ? Object.values(productVariants).map((value) => {
                            if ((value as any).productId === p)
                              return (value as any).id;
                          })
                        : [],
                    }
                  : {
                      quantity: 1,
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
          payments: [
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
                  name: val.name,
                };
              })
            );
            cart.sort((a, b) => {
              if (a.id > b.id) return -1;
              if (a.id < b.id) return 1;
              return 0;
            });
            if (data.products.map((p) => p.id)?.length != productIds?.length) {
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

  const isLoading = orderPreview == null;
  const track = useTrack();
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
            contextSlug: router?.query?.contextSlug ?? '',
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
            contextSlug: router?.query?.contextSlug ?? '',
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
            newIds.splice(ind, filteredProds?.length);
            let newArray: Array<string> = [];
            newArray = [...newIds, ...Array(quantity).fill(id)];
            router.push(PixwayAppRoutes.CHECKOUT_CART_CONFIRMATION, {
              query: {
                productIds: newArray.join(','),
                currencyId: orderPreview?.products[0].prices.find(
                  (price) => price.currencyId == currencyIdState
                )?.currencyId,
                contextSlug: router?.query?.contextSlug ?? '',
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
          contextSlug: router?.query?.contextSlug ?? '',
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

  const _ButtonsToShow = useMemo(() => {
    return (
      <div>
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
                  placeholder={translate('checkout>checkoutInfo>couponCode')}
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
                  {translate('checkout>checkoutForm>successApply')}!
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
        <FormCompleteKYCWithoutLayout
          userId={profile?.data?.id ?? ''}
          formFooter=" "
          formTitle=" "
          productForm
          handleProductForm={() => setCheckoutStatus(CheckoutStatus.FINISHED)}
          handleProductFormError={() => setRequestError(true)}
          product={{
            productId: productIds?.[0] ?? '',
            quantity: productIds?.length ?? 1,
          }}
        />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    couponCodeInput,
    currencyIdState,
    hideCoupon,
    isLoading,
    isLoadingPreview,
    orderPreview?.appliedCoupon,
    orderPreview?.payments,
    orderPreview?.products,
    profile?.data?.id,
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

  if (checkoutStatus === CheckoutStatus.FINISHED) {
    return (
      <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
        <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
          <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
            {translate('checkout>checkoutForm>successSendForm')}
          </p>
          <WeblockButton
            className="pw-text-white pw-mt-6"
            onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
          >
            {translate('checkout>checkoutInfo>goBackHome')}
          </WeblockButton>
        </div>
      </div>
    );
  }

  return requestError ? (
    <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
      <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
        <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
          {translate('checkout>checkoutInfo>errorContactSuport')}
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
          <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
            {translate('business>buySumarySDK>purchaseResume')}
          </p>

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
                  )?.amount ?? '0'
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
              />
            ))}
          </div>
          <div>
            {productErros.length > 0 && (
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
                  {'*'}
                  {translate('checkout>checkoutInfo>valueOfProductOn')}{' '}
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
    </>
  );
};

export const CheckoutForm = ({
  productId,
  currencyId,
  isCart,
}: CheckoutFormProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutForm
        productId={productId}
        currencyId={currencyId}
        isCart={isCart}
      />
    </TranslatableComponent>
  );
};
