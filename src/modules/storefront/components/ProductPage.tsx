/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useClickAway,
  useDebounce,
  useInterval,
  useLocalStorage,
} from 'react-use';

import { PRODUCT_VARIANTS_INFO_KEY } from '../../checkout/config/keys/localStorageKey';
import { useCart } from '../../checkout/hooks/useCart';
import { useCheckout } from '../../checkout/hooks/useCheckout';
import { OrderPreviewResponse } from '../../checkout/interface/interface';
import { useRouterConnect } from '../../shared';
// import { ReactComponent as BackButton } from '../../shared/assets/icons/arrowLeftOutlined.svg';
import { Alert } from '../../shared/components/Alert';
import { CheckboxAlt } from '../../shared/components/CheckboxAlt/CheckboxAlt';
import { CriptoValueComponent } from '../../shared/components/CriptoValueComponent/CriptoValueComponent';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { ModalBase } from '../../shared/components/ModalBase';
import { Shimmer } from '../../shared/components/Shimmer';
import { Spinner } from '../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import useAdressBlockchainLink from '../../shared/hooks/useAdressBlockchainLink/useAdressBlockchainLink';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useCreateIntegrationToken } from '../../shared/hooks/useCreateIntegrationToken';
import { useGetTenantInfoByHostname } from '../../shared/hooks/useGetTenantInfoByHostname';
import { useGetTenantInfoById } from '../../shared/hooks/useGetTenantInfoById';
import { useGetUserIntegrations } from '../../shared/hooks/useGetUserIntegrations';
import useRouter from '../../shared/hooks/useRouter';
import { useSessionUser } from '../../shared/hooks/useSessionUser';
import useTranslation from '../../shared/hooks/useTranslation';
import { useUtms } from '../../shared/hooks/useUtms/useUtms';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useGetCollectionMetadata } from '../../tokens/hooks/useGetCollectionMetadata';
import useGetProductBySlug, {
  CurrencyResponse,
} from '../hooks/useGetProductBySlug/useGetProductBySlug';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { ProductPageData } from '../interfaces';
import { ProductVariants } from './ProductVariants';

interface ProductPageProps {
  data: ProductPageData;
  params?: string[];
  hasCart?: boolean;
}

export const ProductPage = ({
  data,
  params,
  hasCart = true,
}: ProductPageProps) => {
  const { styleData, mobileStyleData } = data;
  const router = useRouter();
  const requiredModalPending = router.query.requiredModalPending?.includes(
    'true'
  )
    ? true
    : false;
  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    actionButton,
    backBackgroundColor,
    // backTextColor,
    backgroundColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blockchainInfoBackgroundColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blockchainInfoTextColor,
    buttonColor,
    buttonText,
    buttonTextColor,
    // categoriesTagBackgroundColor,
    // categoriesTagTextColor,
    categoriesTextColor,
    descriptionTextColor,
    margin,
    nameTextColor,
    padding,
    priceTextColor,
    showBlockchainInfo,
    showCategory,
    showDescription,
    showProductName,
    showValue,
    // textColor,
  } = mergedStyleData;

  const [translate] = useTranslation();
  const { pushConnect } = useRouterConnect();
  const { setCart, cart, setCartCurrencyId } = useCart();
  const [currencyId, setCurrencyId] = useState<CurrencyResponse>();
  const refToClickAway = useRef<HTMLDivElement>(null);
  useClickAway(refToClickAway, () => {
    if (quantityOpen) {
      setQuantityOpen(false);
    }
  });
  const [variants, setVariants] = useState<any>();
  const [_, setProductVariants] = useLocalStorage<any>(
    PRODUCT_VARIANTS_INFO_KEY
  );
  const [quantity, setQuantity] = useState(1);
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const [quantityOpen, setQuantityOpen] = useState(false);
  const {
    data: product,
    isSuccess,
    refetch,
    isLoading,
  } = useGetProductBySlug(params?.[params.length - 1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const categories: any[] = [];

  const openModal =
    router.query.openModal?.includes('true') && !product?.canPurchase
      ? true
      : false;
  const [isOpenRefresh, setIsOpenRefresh] = useState(requiredModalPending);
  const [isOpen, setIsOpen] = useState(openModal);
  const [cartOpen, setCartOpen] = useState(false);
  const addToCart = () => {
    setCartOpen(true);
    setProductVariants({ ...variants });
    setCartCurrencyId?.(currencyId);
    const cartPreview =
      orderPreview?.products.map((val) => {
        return {
          id: product?.id,
          variantIds: Object.values(variants).map((value) => {
            if ((value as any).productId === product?.id)
              return (value as any).id;
          }),
          prices: val.prices,
        };
      }) ?? [];
    setCart([...cart, ...cartPreview]);
  };

  useEffect(() => {
    if (isSuccess) setCurrencyId(product?.prices[0]?.currency ?? undefined);
  }, [product, isSuccess]);

  const tokensSold =
    product?.tokensAmount && product?.stockAmount
      ? product?.tokensAmount - product?.stockAmount
      : 0;

  const addresBlockchainLink = useAdressBlockchainLink(
    product?.chainId,
    product?.contractAddress
  );

  const { data: tokenData } = useGetCollectionMetadata({
    id: product?.draftData?.keyCollectionId ?? '',
    query: { limit: 1 },
  });

  const chain = () => {
    switch (product?.chainId) {
      case 137:
        return 'Polygon';
      case 4:
        return 'Rinkeby';
      case 1:
        return 'Ethereum';
      default:
        return 'Mumbai';
    }
  };

  const { mutate: createIntegrationToken } = useCreateIntegrationToken();
  const { data: currentTenant } = useGetTenantInfoByHostname();
  const { data: userIntegrations } = useGetUserIntegrations();
  const user = useSessionUser();
  const { data: toTenant } = useGetTenantInfoById(
    product?.requirements?.companyId ?? ''
  );

  const userHasIntegration = userIntegrations?.data?.items?.some(
    (val) => val.toTenantId === product?.requirements?.companyId
  );

  const openNewWindow = (path: string) => {
    setTimeout(() => {
      window.open(path, '_blank', 'left=600,resizable,width=1440,height=900');
    });
  };

  const handleTenantIntegration = ({
    toTenantName,
    toTenantId,
    host,
  }: {
    toTenantName: string;
    toTenantId: string;
    host: string;
  }) => {
    if (userHasIntegration) {
      openNewWindow(
        `https://${host}/redirectPage?productId=${
          product?.requirements?.productId
        }${
          product?.requirements?.purchaseRequiredModalContent
            ? '&purchaseRequiredModalContent=' +
              product?.requirements?.purchaseRequiredModalContent
            : ''
        }`
      );
      if (!openNewWindow) {
        setTimeout(() => {
          window.open(
            `https://${host}/redirectPage?productId=${
              product?.requirements?.productId
            }${
              product?.requirements?.purchaseRequiredModalContent
                ? '&purchaseRequiredModalContent=' +
                  product?.requirements?.purchaseRequiredModalContent
                : ''
            }`,
            '_blank'
          );
        });
      }
    } else {
      createIntegrationToken(toTenantId ?? '', {
        onSuccess(data) {
          openNewWindow(
            `https://${host}/linkAccount?token=${data.token}&fromEmail=${
              user?.email
            }&fromTentant=${
              currentTenant?.name
            }&toTenant=${toTenantName}&toTenantId=${toTenantId}&productId=${
              product?.requirements?.productId
            }&collectionId=${product?.requirements?.keyCollectionId}${
              product?.requirements?.autoCloseOnSuccess
                ? '&autoCloseOnSuccess=' +
                  product?.requirements?.autoCloseOnSuccess
                : ''
            }${
              product?.requirements?.linkMessage
                ? '&linkMessage=' + product?.requirements?.linkMessage
                : ''
            }${
              product?.requirements?.purchaseRequiredModalContent
                ? '&purchaseRequiredModalContent=' +
                  product?.requirements?.purchaseRequiredModalContent
                : ''
            }`
          );
          if (!openNewWindow) {
            setTimeout(() => {
              window.open(
                `https://${host}/linkAccount?token=${data.token}&fromEmail=${
                  user?.email
                }&fromTentant=${
                  currentTenant?.name
                }&toTenant=${toTenantName}&toTenantId=${toTenantId}&productId=${
                  product?.requirements?.productId
                }&collectionId=${product?.requirements?.keyCollectionId}${
                  product?.requirements?.autoCloseOnSuccess
                    ? '&autoCloseOnSuccess=' +
                      product?.requirements?.autoCloseOnSuccess
                    : ''
                }${
                  product?.requirements?.linkMessage
                    ? '&linkMessage=' + product?.requirements?.linkMessage
                    : ''
                }${
                  product?.requirements?.purchaseRequiredModalContent
                    ? '&purchaseRequiredModalContent=' +
                      product?.requirements?.purchaseRequiredModalContent
                    : ''
                }`,
                '_blank'
              );
            });
          }
        },
      });
    }
  };

  const handleClick = () => {
    if (product?.requirements) {
      if (user) {
        setIsOpen(true);
      } else {
        pushConnect(PixwayAppRoutes.SIGN_IN, {
          callbackPath: window.location.href + '?openModal=true',
        });
      }
    } else {
      pushConnect(PixwayAppRoutes.SIGN_IN, {
        callbackPath: window.location.href,
      });
    }
  };

  const handleRefresh = () => {
    setIsOpenRefresh(true);
    pushConnect(
      PixwayAppRoutes.PRODUCT_PAGE.replace('{slug}', product?.slug ?? ''),
      {
        requiredModalPending: 'true',
      }
    );
  };

  useEffect(() => {
    if (product?.canPurchase === true) {
      setIsOpen(false);
      setIsOpenRefresh(false);
    }
  }, [product]);

  useInterval(() => {
    if (isOpenRefresh) {
      refetch();
    }
  }, 3000);

  const handleMessage = useCallback(
    (e: MessageEvent<any>) => {
      if (e.data === 'user_linked_no_required_product_found') {
        setIsOpenRefresh(false);
        setIsOpen(true);
        pushConnect(
          PixwayAppRoutes.PRODUCT_PAGE.replace('{slug}', product?.slug ?? ''),
          {
            openModal: 'true',
          }
        );
      }
    },
    [product]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const utms = useUtms();
  const { companyId } = useCompanyConfig();
  const { getOrderPreview } = useCheckout();
  const [isLoadingValue, setIsLoading] = useState(false);
  const getOrderPreviewFn = () => {
    if (product?.id && currencyId) {
      setIsLoading(true);
      getOrderPreview.mutate(
        {
          productIds: [
            ...Array(quantity).fill({
              productId: product.id,
              variantIds: variants
                ? Object.values(variants).map((value) => {
                    if ((value as any).productId === product.id)
                      return (value as any).id;
                  })
                : [],
            }),
          ],
          currencyId: currencyId.id ?? '',
          companyId,
          couponCode:
            utms.utm_campaign &&
            utms?.expires &&
            new Date().getTime() < utms?.expires
              ? utms.utm_campaign
              : '',
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: OrderPreviewResponse) => {
            setIsLoading(false);
            setOrderPreview(data);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (product?.id) {
      const variant = {} as any;
      product.variants?.map((val) => {
        variant[val.id as any] = {
          name: val.values[0].name,
          label: val.name,
          id: val.values[0].id,
          productId: product?.id,
          variantId: val.id,
        };
      });
      setVariants({ ...variant });
    }
  }, [product?.id]);

  useEffect(() => {
    if (product?.id && currencyId) {
      getOrderPreviewFn();
    }
  }, [currencyId, product?.id, variants]);

  useDebounce(
    () => {
      getOrderPreviewFn();
    },
    300,
    [quantity]
  );

  useInterval(() => setCartOpen(false), 5000);
  const [termsChecked, setTermsChecked] = useState(true);
  useEffect(() => {
    if (product?.terms) {
      setTermsChecked(false);
    }
  }, [product]);
  const [error, setError] = useState('');
  const onChangeCheckbox = () => {
    const termsAria = product?.terms
      ?.map(
        (val) =>
          (document.getElementById(val.title) as HTMLInputElement)?.checked
      )
      .every((val) => val);
    setTermsChecked(termsAria ?? true);
  };

  return (
    <div
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div
        style={{
          backgroundColor: backBackgroundColor ?? 'white',
        }}
      >
        {/* <div
          onClick={() => back()}
          className="pw-container pw-mx-auto pw-flex pw-items-center pw-gap-6 pw-py-4 pw-cursor-pointer pw-px-4 sm:pw-px-0"
        >
          <BackButton
            style={{
              stroke: backTextColor ?? textColor ? textColor : '#777E8F',
            }}
          />
          <p
            style={{
              color: backTextColor ?? textColor ? textColor : '#777E8F',
            }}
            className="pw-text-sm"
          >
            Voltar
          </p>
        </div> */}
      </div>
      {cartOpen && (
        <Alert variant="success" className="!pw-gap-3 pw-sticky pw-top-0">
          <Alert.Icon />
          Produto adicionado ao carrinho!
        </Alert>
      )}
      <ModalBase isOpen={isOpenRefresh} onClose={() => setIsOpenRefresh(false)}>
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          <Spinner className="pw-mb-4" />
          <div
            style={{
              color: descriptionTextColor ?? 'black',
            }}
            className="pw-text-[13px] pw-mt-6"
            dangerouslySetInnerHTML={{
              __html:
                product?.requirements?.requirementModalPendingContent ??
                'Estamos aguardando a confirmação do vinculo. <br/><br/> Esse processo pode levar até 5 minutos após a compra do título.',
            }}
          ></div>
        </div>
      </ModalBase>
      <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {product?.requirements?.productId === '' && userHasIntegration ? (
              <div
                style={{
                  color: descriptionTextColor ?? 'black',
                }}
                className="pw-text-[13px] pw-pb-8 pw-mt-10"
                dangerouslySetInnerHTML={{
                  __html:
                    product?.requirements
                      ?.requirementModalNoPurchaseAvailable ?? '',
                }}
              ></div>
            ) : (
              <div
                style={{
                  color: descriptionTextColor ?? 'black',
                }}
                className="pw-text-[13px] pw-pb-8 pw-mt-10"
                dangerouslySetInnerHTML={{
                  __html: product?.requirements?.requirementModalContent ?? '',
                }}
              ></div>
            )}
            <div className="pw-flex sm:pw-flex-row pw-flex-col pw-justify-around">
              {product?.requirements?.productId === '' &&
              userHasIntegration ? null : (
                <button
                  style={{
                    backgroundColor: '#0050FF',
                    color: 'white',
                  }}
                  className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[160px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)] pw-mr-4"
                  onClick={() => {
                    handleRefresh();
                    handleTenantIntegration({
                      host:
                        toTenant?.hosts.find((value) => value.isMain === true)
                          ?.hostname ?? '',
                      toTenantName: toTenant?.name ?? '',
                      toTenantId: toTenant?.id ?? '',
                    });
                    setIsOpen(false);
                  }}
                >
                  Continuar
                </button>
              )}
              <button
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                }}
                className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[160px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </ModalBase>
      <div
        className="pw-min-h-[95vh]"
        style={{ backgroundColor: backgroundColor ?? '#EFEFEF' }}
      >
        <div className="pw-container pw-mx-auto pw-px-4 sm:pw-px-0 pw-py-6">
          <div className="pw-w-full pw-rounded-[14px] pw-bg-white pw-p-[40px_47px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]">
            <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-12">
              <ImageSDK
                className="xl:pw-w-[500px] sm:pw-w-[400px] pw-w-[347px] pw-max-h-[437px] pw-rounded-[14px] pw-object-cover pw-object-center"
                src={product?.images?.[0]?.original ?? ''}
                width={1200}
                quality="best"
              />
              <div className="pw-w-full">
                {showProductName && (
                  <>
                    <p
                      style={{ color: nameTextColor ?? 'black' }}
                      className="sm:pw-text-[36px] pw-text-2xl pw-font-[600]"
                    >
                      {product?.name}
                    </p>
                  </>
                )}
                {showCategory && (
                  <p
                    style={{
                      color: categoriesTextColor ?? '#C63535',
                    }}
                    className="pw-mt-4 pw-font-[700] pw-text-lg"
                  >
                    {product?.tags?.map((tag) => tag.name).join('/')}
                  </p>
                )}
                {showValue && (
                  <>
                    {product?.prices != undefined &&
                      product?.prices?.length > 1 && (
                        <div className="">
                          <p className="pw-text-sm pw-text-black pw-font-[700] pw-mb-2">
                            Pagar em:
                          </p>
                          <form className="pw-flex pw-gap-4" action="submit">
                            {product?.prices.map((price: any) => (
                              <div
                                key={price.currencyId}
                                className="pw-flex pw-gap-2"
                              >
                                <input
                                  onChange={() =>
                                    setCurrencyId?.(price?.currency)
                                  }
                                  checked={price.currencyId === currencyId?.id}
                                  name="currency"
                                  value={price.currencyId}
                                  type="radio"
                                />
                                <p className="pw-text-xs pw-text-slate-600 pw-font-[600]">
                                  {price.currency.symbol}
                                </p>
                              </div>
                            ))}
                          </form>
                        </div>
                      )}

                    <p
                      style={{ color: priceTextColor ?? 'black' }}
                      className="pw-text-2xl pw-mt-4 pw-font-[700]"
                    >
                      {product?.stockAmount == 0 ? (
                        'Esgotado'
                      ) : product ? (
                        isLoadingValue ? (
                          <Shimmer className="!pw-w-[100px] !pw-h-[32px]" />
                        ) : (
                          <>
                            {orderPreview &&
                            orderPreview?.productsErrors?.length === 0 &&
                            parseFloat(orderPreview.originalCartPrice ?? '0') >
                              parseFloat(orderPreview.cartPrice ?? '0') ? (
                              <CriptoValueComponent
                                size={12}
                                fontClass="pw-ml-1 pw-text-sm pw-line-through pw-opacity-50"
                                crypto={
                                  product?.prices.find(
                                    (price: any) =>
                                      price.currencyId == currencyId?.id
                                  )?.currency.crypto
                                }
                                code={
                                  product?.prices.find(
                                    (price: any) =>
                                      price.currencyId == currencyId?.id
                                  )?.currency.name
                                }
                                value={
                                  orderPreview?.products?.length > 1
                                    ? orderPreview?.products?.[0]?.prices?.[0]
                                        ?.originalAmount ?? '0'
                                    : orderPreview.originalCartPrice ?? '0'
                                }
                              ></CriptoValueComponent>
                            ) : null}
                            <CriptoValueComponent
                              dontShow={
                                parseFloat(
                                  product?.prices.find(
                                    (price: any) =>
                                      price.currencyId == currencyId?.id
                                  )?.amount ?? '0'
                                ) === 0
                              }
                              showFree
                              size={24}
                              fontClass="pw-ml-1"
                              crypto={
                                product?.prices.find(
                                  (price: any) =>
                                    price.currencyId == currencyId?.id
                                )?.currency.crypto
                              }
                              code={
                                product?.prices.find(
                                  (price: any) =>
                                    price.currencyId == currencyId?.id
                                )?.currency.name
                              }
                              value={
                                orderPreview &&
                                orderPreview?.productsErrors?.length === 0 &&
                                (parseFloat(
                                  orderPreview.originalCartPrice ?? '0'
                                ) > parseFloat(orderPreview.cartPrice ?? '0') ||
                                  parseFloat(orderPreview.cartPrice ?? '0') >
                                    parseFloat(
                                      product?.prices.find(
                                        (price: any) =>
                                          price.currencyId == currencyId?.id
                                      )?.amount ?? '0'
                                    ) ||
                                  parseFloat(orderPreview.cartPrice ?? '0') <
                                    parseFloat(
                                      product?.prices.find(
                                        (price: any) =>
                                          price.currencyId == currencyId?.id
                                      )?.amount ?? '0'
                                    ))
                                  ? orderPreview?.products?.length > 1
                                    ? orderPreview?.products?.[0]?.prices?.[0]
                                        ?.amount ?? '0'
                                    : orderPreview.cartPrice ?? '0'
                                  : product?.prices.find(
                                      (price: any) =>
                                        price.currencyId == currencyId?.id
                                    )?.amount ?? '0'
                              }
                            ></CriptoValueComponent>
                          </>
                        )
                      ) : (
                        ''
                      )}
                    </p>
                  </>
                )}
                <div className="pw-flex pw-flex-col pw-gap-1 sm:pw-w-[250px] pw-w-full">
                  {product?.variants
                    ? product?.variants.map((val) => (
                        <ProductVariants
                          key={val.id}
                          variants={val}
                          onClick={(e) => {
                            setVariants({
                              ...variants,
                              [val.id]: Object.values(e)[0],
                            });
                          }}
                          productId={product?.id}
                        />
                      ))
                    : null}
                </div>

                {actionButton &&
                product?.stockAmount &&
                product?.stockAmount > 0 &&
                product?.canPurchase &&
                !currencyId?.crypto ? (
                  <>
                    <div className="pw-mt-6 pw-flex pw-gap-3 pw-items-end">
                      <div className="pw-flex pw-flex-col pw-gap-x-4 pw-items-start pw-justify-center">
                        <p className="pw-text-sm pw-text-black pw-mb-1">
                          Quantidade
                        </p>
                        <div className="pw-flex pw-gap-4 pw-justify-center pw-items-center">
                          <p
                            onClick={() => {
                              if (quantity > 1) {
                                setQuantity(quantity - 1);
                              }
                            }}
                            className={`pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                              quantity && quantity > 1
                                ? 'pw-text-[#353945] pw-border-brand-primary pw-cursor-pointer'
                                : 'pw-text-[rgba(0,0,0,0.3)] pw-border-[rgba(0,0,0,0.3)] pw-cursor-default'
                            }`}
                          >
                            -
                          </p>
                          <div>
                            <input
                              type="number"
                              id="quantityValue"
                              value={quantity}
                              onChange={() => {
                                const inputValue = parseFloat(
                                  (
                                    document.getElementById(
                                      'quantityValue'
                                    ) as HTMLInputElement
                                  ).value
                                );
                                if (
                                  product.canPurchaseAmount &&
                                  inputValue > product.canPurchaseAmount
                                ) {
                                  setError(
                                    `Limite máximo de ${product.canPurchaseAmount} unidades`
                                  );
                                  setQuantity(product.canPurchaseAmount);
                                } else if (inputValue > 0) {
                                  setError('');
                                  setQuantity(inputValue);
                                } else if (inputValue < 1) {
                                  setQuantity(1);
                                }
                              }}
                              className="pw-text-sm pw-font-[600] pw-text-[#353945] pw-text-center pw-w-[30px]"
                            ></input>
                          </div>
                          <p
                            className={`pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                              product?.canPurchaseAmount &&
                              product?.stockAmount &&
                              quantity < product?.canPurchaseAmount &&
                              quantity < product?.stockAmount
                                ? 'pw-border-brand-primary pw-text-[#353945] pw-cursor-pointer'
                                : 'pw-border-[rgba(0,0,0,0.3)] pw-text-[rgba(0,0,0,0.3)] pw-cursor-default'
                            }`}
                            onClick={() => {
                              if (
                                product?.canPurchaseAmount &&
                                product?.stockAmount &&
                                quantity < product?.canPurchaseAmount &&
                                quantity < product?.stockAmount
                              ) {
                                setQuantity(quantity + 1);
                              }
                            }}
                          >
                            +
                          </p>
                        </div>
                      </div>
                      {orderPreview && orderPreview?.products?.length > 1 ? (
                        isLoadingValue ? (
                          <Shimmer className="!pw-w-[56px] !pw-h-[20px]" />
                        ) : (
                          <CriptoValueComponent
                            size={12}
                            fontClass="pw-text-sm pw-font-[600] pw-text-[#353945] pw-opacity-50"
                            crypto={
                              product?.prices.find(
                                (price: any) =>
                                  price.currencyId == currencyId?.id
                              )?.currency.crypto
                            }
                            code={
                              product?.prices.find(
                                (price: any) =>
                                  price.currencyId == currencyId?.id
                              )?.currency.name
                            }
                            value={orderPreview?.cartPrice ?? '0'}
                          ></CriptoValueComponent>
                        )
                      ) : null}
                    </div>
                    <p className="pw-text-sm pw-font-[600] pw-text-[#93949b] pw-text-left ">
                      {error}
                    </p>
                  </>
                ) : null}

                {/* {showCategory && product?.tags?.length ? (
                  <>
                    <p
                      style={{ color: textColor ?? 'black' }}
                      className="pw-mt-4 pw-text-sm"
                    >
                      Categoria/subcategoria:
                    </p>
                    <div className="pw-flex pw-items-center pw-gap-4 pw-mt-6">
                      {categories.map((cat) => (
                        <div
                          key={cat.name}
                          style={{
                            backgroundColor:
                              categoriesTagBackgroundColor ?? 'white',
                            color: categoriesTagTextColor ?? 'black',
                          }}
                          className="pw-py-2 pw-px-6 pw-text-sm pw-font-[600] pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null} */}

                {product?.hasWhitelistBlocker && product?.stockAmount != 0 ? (
                  product?.requirements?.requirementCTALabel ? (
                    <div className="pw-flex pw-flex-col pw-justify-center pw-items-start pw-w-full pw-mt-5">
                      <p className="pw-text-sm pw-font-poppins pw-font-medium pw-text-black">
                        {product.requirements.requirementDescription}
                      </p>
                      <button
                        onClick={handleClick}
                        disabled={user && !product?.requirements ? true : false}
                        style={{
                          backgroundColor:
                            user && !product?.requirements
                              ? '#DCDCDC'
                              : '#0050FF',
                          color:
                            user && !product?.requirements
                              ? '#777E8F'
                              : buttonTextColor ?? 'white',
                        }}
                        className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                      >
                        {product?.requirements?.requirementCTALabel}
                      </button>
                    </div>
                  ) : (
                    <div className="pw-flex pw-flex-col">
                      {!currencyId?.crypto && hasCart ? (
                        <button
                          onClick={handleClick}
                          disabled={
                            user && !product?.requirements ? true : false
                          }
                          style={{
                            backgroundColor: 'none',
                            borderColor:
                              user && !product?.requirements
                                ? '#DCDCDC'
                                : buttonColor ?? '#0050FF',
                            color:
                              user && !product?.requirements
                                ? '#DCDCDC'
                                : buttonColor ?? '#0050FF',
                          }}
                          className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full "
                        >
                          Adicionar ao carrinho
                        </button>
                      ) : null}
                      <button
                        onClick={handleClick}
                        disabled={
                          product?.hasWhitelistBlocker &&
                          user &&
                          !product?.requirements
                            ? true
                            : false
                        }
                        style={{
                          backgroundColor:
                            product?.hasWhitelistBlocker &&
                            user &&
                            !product?.requirements
                              ? '#DCDCDC'
                              : buttonColor ?? '#0050FF',
                          color:
                            product?.hasWhitelistBlocker &&
                            user &&
                            !product?.requirements
                              ? '#777E8F'
                              : buttonTextColor ?? 'white',
                        }}
                        className="pw-py-[10px] pw-px-[60px] pw-font-[700] pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                      >
                        {parseFloat(
                          product?.prices.find(
                            (price: any) => price.currencyId == currencyId?.id
                          )?.amount ?? '0'
                        ) === 0
                          ? 'Quero!'
                          : buttonText
                          ? buttonText
                          : 'Comprar agora'}
                      </button>
                    </div>
                  )
                ) : (
                  actionButton && (
                    <div className="pw-flex pw-flex-col">
                      {!currencyId?.crypto && hasCart ? (
                        <button
                          disabled={
                            product?.stockAmount == 0 ||
                            product?.canPurchaseAmount == 0 ||
                            currencyId?.crypto ||
                            !termsChecked
                          }
                          onClick={addToCart}
                          style={{
                            backgroundColor: 'none',
                            borderColor:
                              product &&
                              (product?.stockAmount == 0 ||
                                product?.canPurchaseAmount == 0 ||
                                !termsChecked)
                                ? '#DCDCDC'
                                : buttonColor
                                ? buttonColor
                                : '#0050FF',
                            color:
                              product &&
                              (product?.stockAmount == 0 ||
                                product?.canPurchaseAmount == 0 ||
                                !termsChecked)
                                ? '#777E8F'
                                : buttonColor ?? '#0050FF',
                          }}
                          className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full "
                        >
                          {'Adicionar ao carrinho'}
                        </button>
                      ) : null}
                      <button
                        disabled={
                          product?.stockAmount == 0 ||
                          product?.canPurchaseAmount == 0 ||
                          !termsChecked
                        }
                        onClick={() => {
                          if (product?.id && product.prices) {
                            setProductVariants({ ...variants });
                            pushConnect(
                              PixwayAppRoutes.CHECKOUT_CONFIRMATION +
                                `?productIds=${Array(quantity)
                                  .fill(product.id)
                                  .join(',')}&currencyId=${currencyId?.id}`
                            );
                          }
                        }}
                        style={{
                          backgroundColor:
                            product &&
                            (product.stockAmount == 0 ||
                              product?.canPurchaseAmount == 0 ||
                              !termsChecked)
                              ? '#DCDCDC'
                              : buttonColor
                              ? buttonColor
                              : '#0050FF',
                          color:
                            product &&
                            (product.stockAmount == 0 ||
                              product?.canPurchaseAmount == 0 ||
                              !termsChecked)
                              ? '#777E8F'
                              : buttonTextColor ?? 'white',
                        }}
                        className="pw-py-[10px] pw-px-[60px] pw-font-[700] pw-font pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)]"
                      >
                        {parseFloat(
                          product?.prices.find(
                            (price: any) => price.currencyId == currencyId?.id
                          )?.amount ?? '0'
                        ) === 0
                          ? 'Quero!'
                          : buttonText
                          ? buttonText
                          : 'Comprar agora'}
                      </button>
                      {product?.canPurchaseAmount === 0 &&
                        !product?.hasWhitelistBlocker && (
                          <p className="pw-text-sm pw-text-gray-500 pw-font-medium pw-mt-4">
                            * Limite de compra por usuário atingido
                          </p>
                        )}
                    </div>
                  )
                )}
                {product?.prices.find(
                  (price: any) => price.currencyId == currencyId?.id
                )?.anchorCurrencyId && (
                  <p className="pw-text-xs pw-mt-2 pw-font-medium pw-text-[#777E8F]">
                    *O valor do produto em{' '}
                    {
                      product?.prices.find(
                        (price: any) => price.currencyId == currencyId?.id
                      )?.currency.symbol
                    }{' '}
                    pode variar de acordo com a cotação desta moeda em{' '}
                    {
                      product.prices.find(
                        (priceF) =>
                          priceF.currencyId ==
                          product?.prices.find(
                            (price: any) => price.currencyId == currencyId?.id
                          )?.anchorCurrencyId
                      )?.currency.symbol
                    }
                    .
                  </p>
                )}
                <div className="pw-mt-8">
                  {product?.terms
                    ? product.terms.map((val) => (
                        <CheckboxAlt
                          id={val.title}
                          onChange={() => onChangeCheckbox()}
                          key={val.title}
                          label={val.title}
                          description={val.description}
                          className="pw-mt-3"
                        />
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-11 pw-w-full pw-mt-6">
            {showDescription && (
              <div
                className={`${
                  showBlockchainInfo ? 'pw-flex-[2]' : 'pw-w-full'
                } pw-rounded-[14px] pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]`}
              >
                <p
                  style={{
                    color: descriptionTextColor ?? 'black',
                  }}
                  className="pw-text-[15px] pw-font-[600]"
                >
                  {translate('commerce>productPage>description')}
                </p>
                {product?.htmlContent && product?.htmlContent != '' ? (
                  <div
                    style={{
                      color: descriptionTextColor ?? 'black',
                    }}
                    className="pw-text-[13px] pw-pb-8 pw-mt-6"
                    dangerouslySetInnerHTML={{
                      __html: product?.htmlContent ?? '',
                    }}
                  ></div>
                ) : (
                  <p
                    style={{
                      color: descriptionTextColor ?? 'black',
                    }}
                    className="pw-text-[13px] pw-pb-8 pw-mt-6"
                  >
                    {product?.description}
                  </p>
                )}
              </div>
            )}
            {showBlockchainInfo && (
              <div
                className={`${
                  showDescription
                    ? 'pw-flex-[1.5] lg:pw-flex-[1.3]'
                    : 'pw-w-full'
                } pw-max-h-[295px] pw-text-black pw-rounded-[14px] pw-bg-white pw-p-[25px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]`}
              >
                <p className="pw-text-[15px] pw-font-[600] pw-mb-4">
                  {translate('commerce>productPage>tokenDetails')}
                </p>
                <span className="pw-border-[#E6E8EC] pw-block pw-border pw-border-solid pw-w-full pw-mx-auto" />
                <div className="pw-mt-7 pw-text-[13px] pw-flex pw-justify-between">
                  <div>
                    <p>Contract Address</p>
                    {tokenData?.items?.[0]?.tokenCollection?.quantity && (
                      <p className="pw-mt-[10px]">
                        {translate('commerce>productPage>totalTokens')}
                      </p>
                    )}
                    <p className="pw-mt-[10px]">
                      {translate('commerce>productPage>totalAvailable')}
                    </p>
                    <p className="pw-mt-[10px]">
                      {translate('commerce>productPage>soldTokens')}
                    </p>
                    <p className="pw-mt-[10px]">Token Standard</p>
                    <p className="pw-mt-[10px]">Chain</p>
                  </div>
                  <div
                    className={`pw-text-right ${
                      showDescription
                        ? 'sm:pw-max-w-[150px] pw-max-w-[100px]'
                        : 'pw-max-w-[100px] sm:pw-max-w-[295px]'
                    }`}
                  >
                    <p className="pw-truncate pw-underline pw-text-[#4194CD]">
                      <a
                        href={addresBlockchainLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {product?.contractAddress}
                      </a>
                    </p>
                    {tokenData?.items?.[0]?.tokenCollection?.quantity && (
                      <p className="pw-mt-[10px]">
                        {tokenData?.items?.[0]?.tokenCollection?.quantity}
                      </p>
                    )}
                    <p className="pw-mt-[10px]">{product?.stockAmount}</p>
                    <p className="pw-mt-[10px]">{tokensSold}</p>
                    <p className="pw-mt-[10px]">ERC-721</p>
                    <p className="pw-mt-[10px]">{chain()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
