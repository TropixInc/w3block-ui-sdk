/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInterval, useLocalStorage } from 'react-use';

import { PriceAndGasInfo, Product, ProductInfo } from '../../../shared';
import { ReactComponent as ValueChangeIcon } from '../../../shared/assets/icons/icon-up-down.svg';
import { ModalBase } from '../../../shared/components/ModalBase';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { CurrencyEnum } from '../../../shared/enums/Currency';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useModalController } from '../../../shared/hooks/useModalController';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useUtms } from '../../../shared/hooks/useUtms/useUtms';
import { Variants } from '../../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
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
import { ConfirmCryptoBuy } from '../ConfirmCryptoBuy/ConfirmCryptoBuy';
import { PaymentMethodsComponent } from '../PaymentMethodsComponent/PaymentMethodsComponent';
import { ProductError } from '../ProductError/ProductError';
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
  const router = useRouterConnect();
  const { isOpen, openModal, closeModal } = useModalController();
  const [requestError, setRequestError] = useState(false);
  const { getOrderPreview } = useCheckout();
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
                  variantIds: p.variantIds,
                };
                return payload;
              })
            : productIds.map((p) => {
                const payload = {
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
            setOrderPreview(data);
            setIsLoadingPreview(false);
            setCart(
              data.products.map((val) => {
                return {
                  id: val.id,
                  variantIds: val?.variants?.map((val) => val.id),
                  prices: val.prices,
                };
              })
            );
            if (data.products.map((p) => p.id).length != productIds.length) {
              setProductIds(data.products.map((p) => p.id));
            }
          },
          onError: () => {
            setRequestError(true);
          },
        }
      );
    }
  };

  useEffect(() => {
    getOrderPreviewFn(couponCodeInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds, currencyIdState, token]);

  useInterval(() => {
    getOrderPreviewFn(couponCodeInput);
  }, 30000);

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
    variants?: Variants[]
  ) => {
    if (add != null) {
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
          }
        }
      }

      setProductIds(newArray);
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
    }

    setProductIds(filteredProds?.map((p) => p.id));
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
      uniqueProduct.sort();
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

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              name={
                orderPreview?.products && orderPreview?.products.length
                  ? orderPreview?.products[0]?.prices.find(
                      (price) => price.currency.id == currencyIdState
                    )?.currency.name
                  : 'BRL'
              }
              currency={
                orderPreview?.products && orderPreview?.products.length
                  ? orderPreview?.products[0]?.prices.find(
                      (price) => price.currency.id == currencyIdState
                    )?.currency.symbol
                  : 'R$'
              }
              totalPrice={orderPreview?.totalPrice || '0'}
              service={orderPreview?.clientServiceFee || '0'}
              loading={isLoading || isLoadingPreview}
              className="pw-mt-4"
              price={
                parseFloat(orderPreview?.cartPrice || '0').toString() || '0'
              }
              gasFee={
                parseFloat(orderPreview?.gasFee?.amount || '0').toString() ||
                '0'
              }
              originalPrice={orderPreview?.originalCartPrice ?? ''}
              originalService={orderPreview?.originalClientServiceFee ?? ''}
              originalTotalPrice={orderPreview?.originalTotalPrice ?? ''}
            />
            <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
              Cupom
            </p>
            <div className="pw-mb-8">
              <div className="pw-flex pw-gap-3">
                <input
                  name="couponCode"
                  id="couponCode"
                  placeholder="Código do cupom"
                  className="pw-p-2 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-flex-[0.3]"
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
            {parseFloat(orderPreview?.totalPrice ?? '0') !== 0 && (
              <PaymentMethodsComponent
                loadingPreview={isLoadingPreview}
                methodSelected={
                  choosedPayment ?? ({} as PaymentMethodsAvaiable)
                }
                methods={orderPreview?.providersForSelection ?? []}
                onSelectedPayemnt={setChoosedPayment}
              />
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
                disabled={!orderPreview || isLoadingPreview}
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
                        price.currencyId == (router.query.currencyId as string)
                    )?.currency.name
                  : 'BRL'
              }
              currency={
                productCache?.products && productCache?.products.length
                  ? productCache?.products[0].prices.find(
                      (price) =>
                        price.currencyId == (router.query.currencyId as string)
                    )?.currency.symbol
                  : 'R$'
              }
              totalPrice={orderPreview?.totalPrice || '0'}
              service={orderPreview?.clientServiceFee || '0'}
              loading={isLoading}
              className="pw-mt-4"
              price={
                parseFloat(orderPreview?.cartPrice || '0').toString() || '0'
              }
              gasFee={
                parseFloat(orderPreview?.gasFee?.amount || '0').toString() ||
                '0'
              }
              originalPrice={
                orderResponse !== undefined
                  ? orderResponse.originalCurrencyAmount
                  : orderPreview?.originalCartPrice ?? ''
              }
              originalService={orderPreview?.originalClientServiceFee ?? ''}
              originalTotalPrice={
                orderResponse !== undefined
                  ? orderResponse.originalTotalAmount
                  : orderPreview?.originalTotalPrice ?? ''
              }
            />
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
  }, [orderPreview, choosedPayment, currencyIdState, isLoadingPreview]);

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
          <div className="pw-border pw-bg-white pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl pw-overflow-hidden">
            {differentProducts.map((prod, index) => (
              <ProductInfo
                loadingPreview={isLoadingPreview}
                isCart={isCart}
                className="pw-border-b pw-border-[rgba(0,0,0,0.1)] "
                currency={
                  prod.prices.find(
                    (prodI) => prodI.currencyId == currencyIdState
                  )?.currency.symbol
                }
                quantity={
                  orderPreview?.products.filter(
                    (p) =>
                      p.id == prod.id &&
                      prod.prices.find(
                        (price) => price.currencyId == currencyIdState
                      )?.amount ==
                        p.prices.find(
                          (price) => price.currencyId == currencyIdState
                        )?.amount &&
                      p.variants
                        ?.map((res) => {
                          return res.values.map((res) => {
                            return res.id;
                          });
                        })
                        .toString() ==
                        prod.variants
                          ?.map((res) => {
                            return res.values.map((res) => {
                              return res.id;
                            });
                          })
                          .toString()
                  ).length ?? 1
                }
                stockAmount={prod.stockAmount}
                canPurchaseAmount={prod.canPurchaseAmount}
                changeQuantity={changeQuantity}
                loading={isLoading}
                status={checkoutStatus}
                deleteProduct={(id, variants) =>
                  deleteProduct(
                    id,
                    prod.prices.find(
                      (price) => price.currencyId == currencyIdState
                    )?.amount ?? '0',
                    variants
                  )
                }
                id={prod.id}
                key={index}
                image={prod.images[0].thumb}
                name={prod.name}
                price={parseFloat(
                  prod.prices.find(
                    (price) => price.currencyId == currencyIdState
                  )?.amount ?? '0'
                ).toString()}
                originalPrice={parseFloat(
                  prod.prices.find(
                    (price) => price.currencyId == currencyIdState
                  )?.originalAmount ?? '0'
                ).toString()}
                variants={prod.variants}
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
                <ValueChangeIcon className="pw-mt-1" />
                <p className="pw-text-xs  pw-font-medium pw-text-[#777E8F]">
                  *O valor do produto em{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod.prices.find(
                          (price) => price.currencyId == currencyIdState
                        )
                      )
                      ?.prices.find(
                        (price) => price.currencyId == currencyIdState
                      )?.currency.symbol
                  }{' '}
                  pode variar de acordo com a cotação desta moeda em{' '}
                  {
                    orderPreview?.products
                      .find((prod) =>
                        prod.prices.some(
                          (price) => price.currencyId == anchorCurrencyId
                        )
                      )
                      ?.prices.find(
                        (price) => price.currencyId == anchorCurrencyId
                      )?.currency.symbol
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
