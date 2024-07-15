/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import _ from 'lodash';

import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { Product } from '../../../shared/interface/Product';
import { ThemeContext } from '../../../storefront';
import { useTrack } from '../../../storefront/hooks/useTrack/useTrack';
import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import {
  PRODUCT_CART_INFO_KEY,
  PRODUCT_VARIANTS_INFO_KEY,
} from '../../config/keys/localStorageKey';
import { useCheckout } from '../../hooks/useCheckout';
import {
  OrderPreviewCache,
  OrderPreviewResponse,
  PaymentMethodsAvaiable,
} from '../../interface/interface';
import { CheckoutStatus } from '../CheckoutInfo';

const WeblockButton = lazy(() =>
  import('../../../shared/components/WeblockButton/WeblockButton').then(
    (m) => ({
      default: m.WeblockButton,
    })
  )
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

const PaymentMethodsComponent = lazy(() => {
  return import('../PaymentMethodsComponent/PaymentMethodsComponent').then(
    (m) => ({
      default: m.PaymentMethodsComponent,
    })
  );
});

interface CheckoutCompletePaymentProps {
  checkoutStatus?: CheckoutStatus;
  orderDataId?: string;
  proccedAction?: (query: string) => void;
}

const _CheckoutCompletePayment = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  orderDataId,
  proccedAction,
}: CheckoutCompletePaymentProps) => {
  const { datasource } = useDynamicApi();
  const context = useContext(ThemeContext);
  const router = useRouterConnect();
  const { useGetOrderById, getOrderPreview } = useCheckout();
  const { companyId } = useCompanyConfig();
  const {
    data: orderData,
    isLoading,
    isError,
    isSuccess,
  } = useGetOrderById({
    companyId,
    orderId: orderDataId ?? '',
  });
  const [translate] = useTranslation();
  const [productCache, setProductCache, deleteKey] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [productVariants] = useLocalStorage<any>(PRODUCT_VARIANTS_INFO_KEY);
  const query = useQuery();
  const destinationUser = router.query.destination;
  const [requestError, setRequestError] = useState(false);
  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  const getOrderPreviewFn = () => {
    setIsLoadingPreview(true);
    const productIds =
      orderData?.products.map((val) => {
        return val?.productToken?.product?.id;
      }) || [];
    getOrderPreview.mutate(
      {
        productIds: productIds.map((p) => {
          const payload = {
            quantity: 1,
            productId: p,
            variantIds: productVariants
              ? Object.values(productVariants).map((value) => {
                  if ((value as any).productId === p) return (value as any).id;
                })
              : [],
          };
          return payload;
        }),
        payments: [
          {
            currencyId: orderData?.totalAmount?.[0]?.currencyId,
            amountType: 'percentage',
            amount: '100',
          },
        ],
        currencyId: orderData?.totalAmount?.[0]?.currencyId,
        companyId,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (data: OrderPreviewResponse) => {
          if (data && data.providersForSelection?.length && !choosedPayment) {
            setChoosedPayment(data.providersForSelection[0]);
          }
          if (choosedPayment && choosedPayment.paymentMethod == 'credit_card') {
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
        },
        onError: () => {
          setRequestError(true);
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccess) getOrderPreviewFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const track = useTrack();
  const beforeProcced = () => {
    if (
      checkoutStatus == CheckoutStatus.CONFIRMATION &&
      orderData &&
      orderPreview
    ) {
      const orderProducts = orderData.products?.map((pID) => {
        return {
          quantity: 1,
          productId: pID.productToken?.product?.id,
          expectedPrice:
            pID.productToken?.product?.prices.find(
              (price) =>
                price.currencyId == orderData?.totalAmount?.[0]?.currencyId
            )?.amount ?? '0',
          variantIds: productVariants
            ? Object.values(productVariants).map((value) => {
                if ((value as any).productId === pID.productToken?.product?.id)
                  return (value as any).id;
              })
            : [],
        };
      });
      setProductCache({
        payments: orderPreview.payments,
        products: orderPreview.products,
        orderProducts,
        currencyId: orderData?.totalAmount?.[0]?.currencyId || '',
        signedGasFee: orderPreview?.gasFee?.signature || '',
        totalPrice: orderData?.totalAmount?.[0]?.amount ?? '',
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
          walletAddress: datasource?.master?.data.filter(
            (e: { attributes: { slug: string | null } }) =>
              e.attributes.slug === destinationUser
          )[0]?.attributes?.walletAddress,
          name: datasource?.master?.data.filter(
            (e: { attributes: { slug: string | null } }) =>
              e.attributes.slug === destinationUser
          )[0]?.attributes?.name,
        },
        cashback: orderData.cashback?.cashbackAmount,
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      if (
        orderPreview?.products[0].prices.find(
          (price) => price.currencyId == orderData?.totalAmount?.[0]?.currencyId
        )?.currency.crypto
      ) {
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
              value: orderData?.totalPrice,
              currency: orderData?.currency?.code,
              coupon: orderData?.appliedCoupon,
              items: orderData?.products.map((res) => {
                return { item_id: res.id, item_name: res.name };
              }),
            });
          }
        } catch (err) {
          console.log('erro ao salvar o track', err);
        }
        const queryUse = () => {
          if (query)
            return `?${query}&orderId=${orderDataId}completePayment=true`;
          else return `?orderId=${orderDataId}&completePayment=true`;
        };
        router.pushConnect(PixwayAppRoutes.CHECKOUT_PAYMENT + queryUse());
      }
    }
  };

  const differentProducts = useMemo<Array<Product>>(() => {
    if (orderData && orderData?.products?.length) {
      const uniqueProduct: Product[] = [];
      orderData?.products?.forEach((p) => {
        if (
          !uniqueProduct.some(
            (prod) =>
              p?.productToken?.product?.id == prod?.id &&
              prod?.prices?.find(
                (price) =>
                  price?.currencyId == orderData?.totalAmount?.[0]?.currencyId
              )?.amount ==
                p?.productToken?.product?.prices?.find(
                  (price) =>
                    price?.currencyId == orderData?.totalAmount?.[0]?.currencyId
                )?.amount &&
              p?.productToken?.product?.variants
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
          uniqueProduct.push(p?.productToken?.product);
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
  }, [orderData]);

  const onClickButton = () => {
    if (
      context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.link
    ) {
      router.pushConnect(
        context?.defaultTheme?.configurations?.contentData?.checkoutConfig
          ?.actionButton?.link
      );
    } else {
      router.pushConnect(PixwayAppRoutes.MY_TOKENS);
    }
  };

  const buttonText = () => {
    if (
      context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.label
    ) {
      return context?.defaultTheme?.configurations?.contentData?.checkoutConfig
        ?.actionButton?.label;
    } else {
      return translate('tokens>tokenTransferController>goToMyTokens');
    }
  };

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              payments={orderPreview?.payments}
              name={
                orderData?.products && orderData?.products?.length
                  ? orderData?.products[0]?.productToken?.product?.prices.find(
                      (price) =>
                        price?.currency?.id ==
                        orderData?.totalAmount?.[0]?.currencyId
                    )?.currency?.name
                  : 'BRL'
              }
              loading={isLoading || isLoadingPreview}
              className="pw-mt-4"
            />
            <PaymentMethodsComponent
              loadingPreview={isLoadingPreview}
              methodSelected={choosedPayment ?? ({} as PaymentMethodsAvaiable)}
              methods={
                orderPreview?.payments?.filter(
                  (e) =>
                    e.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )[0]?.providersForSelection ?? []
              }
              onSelectedPayemnt={setChoosedPayment}
              title={'Métodos de pagamento'}
              titleClass={''}
            />
            <div className="pw-flex pw-mt-4 pw-gap-x-4">
              <PixwayButton
                onClick={() => {
                  router.push(PixwayAppRoutes.HOME);
                }}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#EFEFEF] !pw-text-xs !pw-text-[#383857] pw-border pw-border-[#DCDCDC] !pw-rounded-full hover:pw-bg-[#EFEFEF] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>cancel')}
              </PixwayButton>
              <PixwayButton
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                Finalizar pedido
              </PixwayButton>
            </div>
          </>
        );
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-mt-4">
            <p className="pw-text-xs pw-text-[#353945] ">
              {typeof context?.defaultTheme?.configurations?.contentData
                ?.checkoutConfig?.message === 'string'
                ? context?.defaultTheme?.configurations?.contentData
                    ?.checkoutConfig?.message
                : translate(
                    'checkout>components>CheckoutCompletePayment>infoAboutProcessing'
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
              payments={productCache?.payments}
            />
            <div className={`pw-flex pw-justify-start`}>
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
  }, [choosedPayment]);

  if (orderData?.status === 'expired') {
    return (
      <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
        <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
          <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
            Esse pedido de compra está expirado, por favor envie novamente o
            formulário de intenção de compra
          </p>
          <WeblockButton
            className="pw-text-white pw-mt-6"
            onClick={() => router.pushConnect(PixwayAppRoutes.HOME)}
          >
            Voltar para a home
          </WeblockButton>
        </div>
      </div>
    );
  }
  return requestError || isError ? (
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
          <>
            <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
              Resumo da compra
            </p>

            {checkoutStatus == CheckoutStatus.FINISHED && (
              <p className="pw-font-[700] pw-text-[#295BA6] pw-text-2xl pw-mb-6 pw-mt-2">
                {translate(
                  'checkout>components>CheckoutCompletePayment>proccessingBlockchain'
                )}
              </p>
            )}
          </>

          <div className="pw-border pw-bg-white pw-border-[rgba(0,0,0,0.2)] pw-rounded-2xl pw-overflow-hidden">
            {differentProducts.map((prod, index) => (
              <ProductInfo
                metadata={prod?.metadata}
                subtitle={prod?.subtitle}
                disableQuantity={true}
                index={index}
                loadingPreview={isLoadingPreview}
                className="pw-border-b pw-border-[rgba(0,0,0,0.1)] "
                currency={
                  prod?.prices?.find(
                    (prodI) =>
                      prodI?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.currency?.symbol
                }
                quantity={
                  orderData?.products?.filter(
                    (p) =>
                      p?.productToken?.product?.id == prod?.id &&
                      prod?.prices?.find(
                        (price) =>
                          price?.currencyId ==
                          orderData?.totalAmount?.[0]?.currencyId
                      )?.amount ==
                        p?.productToken?.product?.prices?.find(
                          (price) =>
                            price?.currencyId ==
                            orderData?.totalAmount?.[0]?.currencyId
                        )?.amount &&
                      p?.productToken?.product?.variants
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
                loading={isLoading}
                status={checkoutStatus}
                id={prod?.id}
                key={index}
                image={prod?.images?.[0]?.thumb}
                name={prod?.name}
                price={parseFloat(
                  prod?.prices?.find(
                    (price) =>
                      price?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.amount ?? '0'
                ).toString()}
                originalPrice={parseFloat(
                  prod?.prices?.find(
                    (price) =>
                      price?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.originalAmount ?? '0'
                ).toString()}
                variants={prod?.variants}
                anchorCurrencyAmount={parseFloat(
                  prod?.prices?.find(
                    (price) =>
                      price?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.anchorCurrencyAmount ?? '0'
                ).toString()}
                anchorCurrencySymbol={
                  prod?.prices?.find(
                    (price) =>
                      price?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.anchorCurrency?.symbol ?? ''
                }
              />
            ))}
          </div>
          {_ButtonsToShow}
        </div>
      </div>
    </>
  );
};

export const CheckoutCompletePayment = ({
  orderDataId,
  checkoutStatus,
}: CheckoutCompletePaymentProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutCompletePayment
        checkoutStatus={checkoutStatus}
        orderDataId={orderDataId}
      />
    </TranslatableComponent>
  );
};
