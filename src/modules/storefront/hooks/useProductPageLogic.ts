/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce, useInterval, useLocalStorage } from 'react-use';

import {
  GIFT_DATA_INFO_KEY,
  PRODUCT_VARIANTS_INFO_KEY,
} from '../../checkout/config/keys/localStorageKey';
import { useCart } from '../../checkout/hooks/useCart';
import { useCheckout } from '../../checkout/hooks/useCheckout';
import { OrderPreviewResponse } from '../../checkout/interface/interface';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useCreateIntegrationToken } from '../../shared/hooks/useCreateIntegrationToken';
import { useGetTenantInfoByHostname } from '../../shared/hooks/useGetTenantInfoByHostname';
import { useGetTenantInfoById } from '../../shared/hooks/useGetTenantInfoById';
import { useGetUserIntegrations } from '../../shared/hooks/useGetUserIntegrations';
import useRouter from '../../shared/hooks/useRouter';
import { useSessionUser } from '../../shared/hooks/useSessionUser';
import { generateRandomUUID } from '../../shared/utils/generateRamdomUUID';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useUtms } from '../../shared/hooks/useUtms';
import useGetProductBySlug from './useGetProductBySlug';
import { useTrack } from './useTrack';
import type { CurrencyResponse, Product } from '../interfaces/Product';

const DEFAULT_CURRENCY_ID = '65fe1119-6ec0-4b78-8d30-cb989914bdcb';

const openNewWindow = (path: string) => {
  setTimeout(() => {
    window.open(path, '_blank', 'left=600,resizable,width=1440,height=900');
  });
};

interface UseProductPageLogicParams {
  slug?: string;
  buttonText?: string;
}

export const useProductPageLogic = ({
  slug,
  buttonText,
}: UseProductPageLogicParams) => {
  const router = useRouter();
  const { pushConnect } = useRouterConnect();
  const user = useSessionUser();
  const { companyId } = useCompanyConfig();
  const { setCart, cart, setCartCurrencyId } = useCart();
  const { getOrderPreview } = useCheckout();
  const utms = useUtms();
  const track = useTrack();

  const { mutate: createIntegrationToken } = useCreateIntegrationToken();
  const { data: currentTenant } = useGetTenantInfoByHostname();
  const { data: userIntegrations } = useGetUserIntegrations();

  const {
    data: product,
    isSuccess,
    refetch,
    isFetching,
    error: errorProduct,
  } = useGetProductBySlug(slug);

  const [currencyId, setCurrencyId] = useState<CurrencyResponse>();
  const [variants, setVariants] = useState<Record<string, unknown>>();
  const [, setProductVariants] = useLocalStorage<Record<string, unknown>>(
    PRODUCT_VARIANTS_INFO_KEY
  );
  const [quantity, setQuantity] = useState(1);
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const [isLoadingValue, setIsLoadingValue] = useState(false);
  const [termsChecked, setTermsChecked] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [giftData, setGiftData, deleteGiftKey] =
    useLocalStorage<unknown>(GIFT_DATA_INFO_KEY);

  const requiredModalPending =
    router.query.requiredModalPending?.includes('true');
  const openModal =
    router.query.openModal?.includes('true') && !product?.canPurchase;
  const [isOpenRefresh, setIsOpenRefresh] = useState(requiredModalPending);
  const [isOpen, setIsOpen] = useState(openModal);
  const [isSendGift, setIsSendGift] = useState(true);

  const isErc20 = product?.type === 'erc20';
  const batchSize = product?.settings?.resaleConfig?.batchSize;
  const productKycRequirement = product?.requirements?.requireKycContext?.slug;
  const isPossibleSend =
    product?.settings?.passShareCodeConfig?.enabled ?? false;

  const userHasIntegration = useMemo(
    () =>
      userIntegrations?.data?.items?.some(
        (val) => val.toTenantId === product?.requirements?.companyId
      ) ?? false,
    [userIntegrations?.data?.items, product?.requirements?.companyId]
  );

  const toTenantData = useGetTenantInfoById(
    product?.requirements?.companyId ?? ''
  );

  useEffect(() => {
    if (isSuccess && product?.prices?.[0]) {
      setCurrencyId(product.prices[0]?.currency ?? DEFAULT_CURRENCY_ID);
    }
  }, [product, isSuccess]);

  useEffect(() => {
    if (product?.canPurchase === true) {
      setIsOpen(false);
      setIsOpenRefresh(false);
    }
  }, [product?.canPurchase]);

  useEffect(() => {
    if (product?.id) {
      const variantMap: Record<string, unknown> = {};
      product.variants?.forEach((val) => {
        variantMap[val.id] = {
          name: val.values[0].name,
          label: val.name,
          id: val.values[0].id,
          productId: product.id,
          variantId: val.id,
          keyLabel: val.keyLabel,
          keyValue: val.values[0].keyValue,
        };
      });
      setVariants(variantMap);
    }
  }, [product?.id]);

  useEffect(() => {
    if (batchSize) setQuantity(batchSize);
  }, [batchSize]);

  useEffect(() => {
    if (
      product?.minPurchaseAmount &&
      product?.stockAmount &&
      parseFloat(product.minPurchaseAmount) <= product.stockAmount
    ) {
      setQuantity(parseFloat(product.minPurchaseAmount));
    }
  }, [product?.minPurchaseAmount, product?.stockAmount]);

  useEffect(() => {
    if (product?.terms) setTermsChecked(false);
  }, [product?.terms]);

  const getOrderPreviewFn = useCallback(() => {
    if (!product?.id || !currencyId) return;

    const currencyIdValue =
      (currencyId as CurrencyResponse & { id?: string }).id ??
      (currencyId as unknown as string) ??
      '';

    const order = {
      productIds: [
        ...Array(isErc20 ? 1 : quantity).fill({
          productId: product.id,
          quantity: isErc20 ? (quantity ?? 1) : 1,
          selectBestPrice: product?.type === 'erc20' ? true : undefined,
          variantIds: variants
            ? Object.values(variants)
                .filter(
                  (v) => (v as { productId?: string })?.productId === product.id
                )
                .map((v) => (v as { id?: string })?.id)
            : [],
        }),
      ],
      currencyId: currencyIdValue,
      passShareCodeData: giftData,
      payments: [
        {
          currencyId: currencyIdValue,
          amountType: 'percentage',
          amount: '100',
        },
      ],
      companyId,
      couponCode:
        utms.utm_campaign &&
        utms?.expires &&
        new Date().getTime() < utms?.expires
          ? utms.utm_campaign
          : '',
    };

    setIsLoadingValue(true);
    getOrderPreview.mutate(order as any, {
      onSuccess: (data: OrderPreviewResponse) => {
        setIsLoadingValue(false);
        setOrderPreview(data);
      },
    });
  }, [
    product?.id,
    product?.type,
    currencyId,
    quantity,
    variants,
    giftData,
    companyId,
    utms,
    isErc20,
  ]);

  useEffect(() => {
    if (product?.id && currencyId) {
      getOrderPreviewFn();
    }
  }, [currencyId, product?.id, variants]);

  useDebounce(getOrderPreviewFn, 300, [quantity]);

  useInterval(() => {
    if (isOpenRefresh) refetch();
  }, 3000);

  useInterval(() => setCartOpen(false), 5000);

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data === 'user_linked_no_required_product_found') {
        setIsOpenRefresh(false);
        setIsOpen(true);
        pushConnect(
          PixwayAppRoutes.PRODUCT_PAGE.replace('{slug}', product?.slug ?? ''),
          { openModal: 'true' }
        );
      }
    },
    [product?.slug, pushConnect]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const handleTenantIntegration = useCallback(
    ({
      toTenantName,
      toTenantId,
      host,
    }: {
      toTenantName: string;
      toTenantId: string;
      host: string;
    }) => {
      const req = product?.requirements;
      if (!req) return;

      if (userHasIntegration) {
        const url = `https://${host}/redirectPage?productId=${req.productId}${
          req.purchaseRequiredModalContent
            ? `&purchaseRequiredModalContent=${req.purchaseRequiredModalContent}`
            : ''
        }`;
        openNewWindow(url);
      } else {
        createIntegrationToken(toTenantId ?? '', {
          onSuccess(data) {
            const url = `https://${host}/linkAccount?token=${data.token}&fromEmail=${
              user?.email
            }&fromTentant=${currentTenant?.name}&toTenant=${toTenantName}&toTenantId=${toTenantId}&productId=${
              req.productId
            }&collectionId=${req.keyCollectionId}${
              req.autoCloseOnSuccess
                ? `&autoCloseOnSuccess=${req.autoCloseOnSuccess}`
                : ''
            }${req.linkMessage ? `&linkMessage=${req.linkMessage}` : ''}${
              req.purchaseRequiredModalContent
                ? `&purchaseRequiredModalContent=${req.purchaseRequiredModalContent}`
                : ''
            }`;
            openNewWindow(url);
          },
        });
      }
    },
    [
      product?.requirements,
      userHasIntegration,
      createIntegrationToken,
      user?.email,
      currentTenant?.name,
    ]
  );

  const handleClick = useCallback(() => {
    if (product?.requirements) {
      if (user) {
        if (product.requirements.requirementCTAAction) {
          pushConnect(product.requirements.requirementCTAAction);
        } else {
          setIsOpen(true);
        }
      } else {
        const callbackPath = product.requirements.requirementCTAAction
          ? window.location.href
          : window.location.href + '?openModal=true';
        pushConnect(PixwayAppRoutes.SIGN_IN, { callbackPath });
      }
    } else {
      pushConnect(PixwayAppRoutes.SIGN_IN, {
        callbackPath: window.location.href,
      });
    }
  }, [product?.requirements, user, pushConnect]);

  const handleRefresh = useCallback(() => {
    setIsOpenRefresh(true);
    pushConnect(
      PixwayAppRoutes.PRODUCT_PAGE.replace('{slug}', product?.slug ?? ''),
      { requiredModalPending: 'true' }
    );
  }, [product?.slug, pushConnect]);

  const addToCart = useCallback(() => {
    setCartOpen(true);
    setProductVariants({ ...variants });
    setCartCurrencyId?.(currencyId);
    const cartPreview =
      orderPreview?.products.map(() => ({
        id: product?.id,
        name: product?.name,
        variantIds: Object.values(variants ?? {})
          .filter(
            (v) => (v as { productId?: string })?.productId === product?.id
          )
          .map((v) => (v as { id?: string })?.id),
        prices: product?.prices,
      })) ?? [];
    setCart([...cart, ...cartPreview]);
    try {
      track('add_to_cart', {
        items: [{ item_id: product?.id, item_name: product?.name }],
        currency: product?.prices?.[0]?.currency?.code,
        value: orderPreview?.totalPrice,
      });
    } catch (err) {
      console.log('Erro ao salvar o track: ', err);
    }
  }, [
    variants,
    currencyId,
    orderPreview,
    product,
    cart,
    setCart,
    setCartCurrencyId,
    setProductVariants,
    track,
  ]);

  const handleBuyClick = useCallback(() => {
    if (!product?.id || !product.prices) return;

    setProductVariants({ ...variants });
    const currencyIdValue =
      (currencyId as CurrencyResponse & { id?: string })?.id ??
      (currencyId as unknown as string) ??
      '';
    const productIds = Array(isErc20 ? 1 : quantity)
      .fill(product.id)
      .join(',');
    const baseParams = `productIds=${productIds}&currencyId=${currencyIdValue}`;

    if (productKycRequirement) {
      pushConnect(
        `${PixwayAppRoutes.CHECKOUT_FORM}?${baseParams}&contextSlug=${productKycRequirement}`
      );
      return;
    }

    if (giftData) {
      const id = generateRandomUUID();
      setGiftData({
        [id]: giftData === 'selfBuy' ? giftData : { ...(giftData as object) },
      });
      pushConnect(
        `${PixwayAppRoutes.CHECKOUT_CONFIRMATION}?${baseParams}&sessionId=${id}`
      );
      return;
    }

    const cryptoPrice = product.prices.find((p) => p?.currency?.crypto);
    if (product?.settings?.acceptMultipleCurrenciesPurchase && cryptoPrice) {
      pushConnect(
        `${PixwayAppRoutes.CHECKOUT_CONFIRMATION}?${baseParams}&cryptoCurrencyId=${cryptoPrice.currencyId}`
      );
      return;
    }

    if (batchSize) {
      const batchParams =
        quantity > batchSize
          ? `${baseParams}&batchSize=${batchSize}&quantity=${quantity}`
          : `${baseParams}&batchSize=${batchSize}`;
      pushConnect(`${PixwayAppRoutes.CHECKOUT_CONFIRMATION}?${batchParams}`);
      return;
    }

    pushConnect(`${PixwayAppRoutes.CHECKOUT_CONFIRMATION}?${baseParams}`);
  }, [
    product,
    variants,
    currencyId,
    quantity,
    isErc20,
    productKycRequirement,
    giftData,
    batchSize,
    setProductVariants,
    setGiftData,
    pushConnect,
  ]);

  const onChangeCheckbox = useCallback(() => {
    const allChecked = product?.terms
      ?.map(
        (val) =>
          (document.getElementById(val.title) as HTMLInputElement)?.checked
      )
      .every(Boolean);
    setTermsChecked(allChecked ?? true);
  }, [product?.terms]);

  const reachStock = useMemo(
    () =>
      !!(
        product?.canPurchaseAmount &&
        product?.stockAmount &&
        quantity + (batchSize ?? 0) > product.canPurchaseAmount &&
        quantity + (batchSize ?? 0) > product.stockAmount
      ),
    [product?.canPurchaseAmount, product?.stockAmount, quantity, batchSize]
  );

  const notEnoughStock = useMemo(
    () =>
      product?.minPurchaseAmount === null ||
      !!(
        product?.stockAmount &&
        parseFloat(product?.minPurchaseAmount ?? '0') > product.stockAmount
      ),
    [product?.minPurchaseAmount, product?.stockAmount]
  );

  const minCartItemPriceBlock = useMemo(
    () =>
      !!(
        orderPreview?.cartPrice &&
        product?.settings?.minCartItemPrice &&
        parseFloat(orderPreview.cartPrice ?? '') <
          product.settings.minCartItemPrice
      ),
    [orderPreview?.cartPrice, product?.settings?.minCartItemPrice]
  );

  const soldOut = useMemo(() => {
    if (isErc20 && batchSize) {
      return (
        product?.stockAmount === 0 ||
        product?.canPurchaseAmount === 0 ||
        (product?.stockAmount && product.stockAmount < batchSize) ||
        (product?.canPurchaseAmount && product.canPurchaseAmount < batchSize) ||
        notEnoughStock
      );
    }
    return product?.stockAmount === 0 || product?.canPurchaseAmount === 0;
  }, [
    isErc20,
    batchSize,
    product?.stockAmount,
    product?.canPurchaseAmount,
    notEnoughStock,
  ]);

  const selectedPrice = useMemo(
    () =>
      product?.prices?.find(
        (p) =>
          (p.currencyId ?? p.currency?.id) ===
          (currencyId as { id?: string })?.id
      ),
    [product?.prices, currencyId]
  );

  const handleButtonText = useCallback(() => {
    const priceAmount = parseFloat(selectedPrice?.amount ?? '0');
    const previewTotal = parseFloat(
      orderPreview?.payments?.[0]?.totalPrice ?? '0'
    );
    if (priceAmount === 0 && previewTotal === 0) return 'Quero';
    if (productKycRequirement) return 'Tenho interesse!';
    return buttonText ?? 'Comprar agora';
  }, [selectedPrice, orderPreview, productKycRequirement, buttonText]);

  const isPageLoading = useMemo(() => {
    if (slug && isFetching && !product) return true;
    if (
      product &&
      currencyId &&
      (product.prices?.length ?? 0) > 0 &&
      (isLoadingValue || !orderPreview)
    )
      return true;
    return false;
  }, [slug, isFetching, product, currencyId, isLoadingValue, orderPreview]);

  return {
    product,
    errorProduct,
    isFetching,
    currencyId,
    setCurrencyId,
    variants,
    setVariants,
    quantity,
    setQuantity,
    orderPreview,
    isLoadingValue,
    termsChecked,
    error,
    setError,
    cartOpen,
    giftData,
    setGiftData,
    deleteGiftKey,
    isOpenRefresh,
    setIsOpenRefresh,
    isOpen,
    setIsOpen,
    isSendGift,
    setIsSendGift,
    isErc20,
    batchSize,
    productKycRequirement,
    isPossibleSend,
    userHasIntegration,
    toTenant: toTenantData.data,
    user,
    soldOut,
    reachStock,
    minCartItemPriceBlock,
    selectedPrice,
    handleTenantIntegration,
    handleClick,
    handleRefresh,
    addToCart,
    handleBuyClick,
    handleButtonText,
    onChangeCheckbox,
    isPageLoading,
  };
};
