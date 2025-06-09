/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';

import _ from 'lodash';

import { useTranslation } from 'react-i18next';
import { PixwayButton } from '../../shared/components/PixwayButton';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';

import { useDynamicApi } from '../../storefront/provider/DynamicApiProvider';
import { PRODUCT_CART_INFO_KEY, PRODUCT_VARIANTS_INFO_KEY, ORDER_COMPLETED_INFO_KEY } from '../config/keys/localStorageKey';
import { useCheckout } from '../hooks/useCheckout';
import { OrderPreviewCache, PaymentMethodsAvaiable, OrderPreviewResponse, CreateOrderResponse } from '../interface/interface';
import { CheckoutStatus } from './CheckoutInfo';
import { PaymentMethodsComponent } from './PaymentMethodsComponent';
import { useQuery } from '../../shared/hooks/useQuery';
import { useTrack } from '../../storefront/hooks/useTrack';
import { PriceAndGasInfo } from '../../shared/components/PriceAndGasInfo';
import { ProductInfo } from '../../shared/components/ProductInfo';
import { Product } from '../../shared/interfaces/Product';


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
  const [, setProductCache, deleteKey] = useLocalStorage<OrderPreviewCache>(
    PRODUCT_CART_INFO_KEY
  );
  const [choosedPayment, setChoosedPayment] = useState<
    PaymentMethodsAvaiable | undefined
  >();
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [productVariants] = useLocalStorage<any>(PRODUCT_VARIANTS_INFO_KEY);
  const [, , deleteOrderKey] = useLocalStorage<CreateOrderResponse>(
    ORDER_COMPLETED_INFO_KEY
  );
  const query = useQuery();
  const destinationUser = router.query.destination;
  const [requestError, setRequestError] = useState(false);
  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
      deleteOrderKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage]);

  const getOrderPreviewFn = () => {
    setIsLoadingPreview(true);
    const productIds =
      orderData?.products.map((val: { productToken: { product: { id: any; }; }; }) => {
        return val?.productToken?.product?.id;
      }) || [];
    getOrderPreview.mutate(
      {
        productIds: productIds.map((p: any) => {
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
            setChoosedPayment(
              (
                orderData?.providersForSelection?.find(
                  (val: any) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                ) as any
              )?.providers?.[0]
            );
          }
          if (choosedPayment && choosedPayment.paymentMethod == 'credit_card') {
            setChoosedPayment({
              ...choosedPayment,
              availableInstallments: (
                orderData?.providersForSelection?.find(
                  (val: any) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                ) as any
              ).providers?.find(
                (val: any) =>
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
      const orderProducts = orderData.products?.map((pID: { productToken: { product: { id: any; prices: any[]; }; }; }) => {
        return {
          quantity: 1,
          productId: pID.productToken?.product?.id,
          expectedPrice:
            pID.productToken?.product?.prices.find(
              (price: { currencyId: any; }) =>
                price.currencyId == orderData?.totalAmount?.[0]?.currencyId
            )?.amount ??
            orderData?.products.find(
              (val: { productToken: { product: { id: any; }; }; }) =>
                val?.productToken?.product?.id === pID.productToken?.product?.id
            )?.currencyAmount ??
            '0',
          variantIds: productVariants
            ? Object.values(productVariants).map((value) => {
                if ((value as any).productId === pID.productToken?.product?.id)
                  return (value as any).id;
              })
            : [],
        };
      });
      setProductCache({
        payments: [
          {
            currency: orderPreview.currency,
            gasFee: (orderData?.gasFee as any)?.find(
              (val: any) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            amount: orderData?.currencyAmount?.find(
              (val: { currencyId: any; }) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            originalAmount: orderData?.originalCurrencyAmount?.find(
              (val: { currencyId: any; }) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            totalPrice: orderData?.totalAmount?.[0]?.amount,
            originalTotalPrice: orderData?.originalTotalAmount?.find(
              (val: { currencyId: any; }) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            clientServiceFee: (orderData?.clientServiceFee as any)?.find(
              (val: any) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            originalClientServiceFee: (
              orderData?.originalClientServiceFee as any
            )?.find(
              (val: any) =>
                val.currencyId === orderData?.totalAmount?.[0]?.currencyId
            )?.amount,
            cartPrice: '0',
            originalCartPrice: '0',
          },
        ],
        products: orderData.products.map((prod: { productToken: { product: any; }; }) => prod.productToken.product),
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
        cartPrice:
          parseFloat(orderData?.totalAmount?.[0]?.amount || '0').toString() ||
          '0',
        choosedPayment: choosedPayment,
        couponCode: orderPreview.appliedCoupon,
        originalCartPrice: orderData?.originalTotalAmount?.[0]?.amount ?? '',
        originalClientServiceFee:
          (orderData?.originalClientServiceFee as any)?.find(
            (val: any) =>
              val.currencyId === orderData?.totalAmount?.[0]?.currencyId
          )?.amount ?? '',
        originalTotalPrice:
          orderData?.originalTotalAmount?.find(
            (val: { currencyId: any; }) => val.currencyId === orderData?.totalAmount?.[0]?.currencyId
          )?.amount ?? '',
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
          (price: { currencyId: any; }) => price.currencyId == orderData?.totalAmount?.[0]?.currencyId
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
              items: orderData?.products.map((res: { id: any; name: any; }) => {
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
      orderData?.products?.forEach((p: { productToken: { product: Product; }; }) => {
        if (
          !uniqueProduct.some(
            (prod) =>
              p?.productToken?.product?.id == prod?.id &&
              prod?.prices?.find(
                (price) =>
                  price?.currencyId == orderData?.totalAmount?.[0]?.currencyId
              )?.amount ==
                p?.productToken?.product?.prices?.find(
                  (price: any) =>
                    price?.currencyId == orderData?.totalAmount?.[0]?.currencyId
                )?.amount &&
              p?.productToken?.product?.variants
                ?.map((res: { values: any[]; }) => {
                  return res?.values?.map((res: { id: any; }) => {
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

  const _ButtonsToShow = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              currency={orderData?.totalAmount?.[0]?.currencyId}
              gasFee={
                (orderData?.gasFee as any)?.find(
                  (val: any) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              price={
                orderData?.currencyAmount?.find(
                  (val: { currencyId: any; }) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              originalPrice={
                orderData?.originalCurrencyAmount?.find(
                  (val: { currencyId: any; }) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              totalPrice={orderData?.totalAmount?.[0]?.amount}
              originalTotalPrice={
                orderData?.originalTotalAmount?.find(
                  (val: { currencyId: any; }) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              service={
                (orderData?.clientServiceFee as any)?.find(
                  (val: any) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              originalService={
                (orderData?.originalClientServiceFee as any)?.find(
                  (val: any) =>
                    val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                )?.amount
              }
              name={
                orderData?.products && orderData?.products?.length
                  ? orderData?.products[0]?.productToken?.product?.prices.find(
                      (price: { currency: { id: any; }; }) =>
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
                (
                  orderData?.providersForSelection?.find(
                    (val: any) =>
                      val.currencyId === orderData?.totalAmount?.[0]?.currencyId
                  ) as any
                )?.providers ?? []
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
                {translate(
                  'checkout>checkoutCompleteOrderTemplate>finalizedPurshase'
                )}
              </PixwayButton>
            </div>
          </>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosedPayment]);

  if (orderData?.status === 'expired') {
    return (
      <div className="pw-container pw-mx-auto pw-pt-10 sm:pw-pt-15">
        <div className="pw-max-w-[600px] pw-flex pw-flex-col pw-justify-center pw-items-center">
          <p className="pw-font-bold pw-text-black pw-text-center pw-px-4">
            {translate(
              'checkout>checkoutCompletePayment>orderExpiredPleaseFormAgain'
            )}
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
  return requestError || isError ? (
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
          <>
            <p className="pw-text-[18px] pw-font-[700] pw-text-[#35394C]">
              {translate('business>buySumarySDK>purchaseResume')}
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
                    (p: { productToken: { product: { id: string; prices: any[]; variants: { map: (arg0: (res: any) => any) => { (): any; new(): any; toString: { (): string | undefined; new(): any; }; }; }; }; }; }) =>
                      p?.productToken?.product?.id == prod?.id &&
                      prod?.prices?.find(
                        (price) =>
                          price?.currencyId ==
                          orderData?.totalAmount?.[0]?.currencyId
                      )?.amount ==
                        p?.productToken?.product?.prices?.find(
                          (price: { currencyId: any; }) =>
                            price?.currencyId ==
                            orderData?.totalAmount?.[0]?.currencyId
                        )?.amount &&
                      p?.productToken?.product?.variants
                        ?.map((res: { values: any[]; }) => {
                          return res?.values?.map((res: { id: any; }) => {
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
                  )?.amount ??
                    orderData?.products.find(
                      (val: { productToken: { product: { id: string; }; }; }) => val?.productToken?.product?.id === prod.id
                    )?.currencyAmount ??
                    '0'
                ).toString()}
                originalPrice={parseFloat(
                  prod?.prices?.find(
                    (price) =>
                      price?.currencyId ==
                      orderData?.totalAmount?.[0]?.currencyId
                  )?.originalAmount ??
                    orderData?.products.find((val: { id: string; }) => val.id === prod.id)
                      ?.originalCurrencyAmount ??
                    '0'
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
