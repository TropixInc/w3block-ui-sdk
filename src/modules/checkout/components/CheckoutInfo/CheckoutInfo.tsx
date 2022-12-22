import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage, useTimeoutFn } from 'react-use';

import { PriceAndGasInfo, ProductInfo } from '../../../shared';
import { ReactComponent as CreditCardIcon } from '../../../shared/assets/icons/creditCard.svg';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';
import { useCheckout } from '../../hooks/useCheckout';
import {
  OrderPreviewCache,
  OrderPreviewResponse,
} from '../../interface/interface';

export enum CheckoutStatus {
  CONFIRMATION = 'CONFIRMATION',
  FINISHED = 'FINISHED',
}

interface CheckoutInfoProps {
  checkoutStatus?: CheckoutStatus;
  returnAction?: (query: string) => void;
  proccedAction?: (query: string) => void;
  productId?: string[];
  currencyId?: string;
}

const _CheckoutInfo = ({
  checkoutStatus = CheckoutStatus.FINISHED,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutInfoProps) => {
  const router = useRouterConnect();
  const { getOrderPreview } = useCheckout();
  const [translate] = useTranslation();
  const [productCache, setProductCache, deleteKey] =
    useLocalStorage<OrderPreviewCache>(PRODUCT_CART_INFO_KEY);
  const query = useQuery();
  const [productIds, setProductIds] = useState<string[] | undefined>(productId);
  const [currencyIdState, setCurrencyIdState] = useState<string | undefined>(
    currencyId
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(
    null
  );
  const { companyId } = useCompanyConfig();

  const { data: session } = usePixwaySession();

  const token = session ? (session.accessToken as string) : null;

  useEffect(() => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION) {
      deleteKey();
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
      if (preview) {
        setOrderPreview({
          products: [preview.product],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const getOrderPreviewFn = () => {
    if (
      productIds &&
      currencyIdState &&
      token &&
      checkoutStatus === CheckoutStatus.CONFIRMATION
    ) {
      getOrderPreview.mutate(
        {
          productIds,
          currencyId: currencyIdState,
          companyId,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: any) => setOrderPreview(data),
        }
      );
    }
  };

  useEffect(() => {
    getOrderPreviewFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds, currencyIdState, token]);

  useTimeoutFn(() => {
    getOrderPreviewFn();
  }, 30000);

  const isLoading = orderPreview == null;

  const UnderCreditText = useMemo(() => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return ''; //translate('checkout>components>checkoutInfo>redirectInfo');
      case CheckoutStatus.FINISHED:
        return translate(
          'checkout>components>checkoutInfo>proccessingBlockchain'
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus]);

  const beforeProcced = () => {
    if (checkoutStatus == CheckoutStatus.CONFIRMATION && orderPreview) {
      const orderProducts = orderPreview.products?.map((pID) => {
        return {
          productId: pID.id,
          expectedPrice: pID.prices[0].amount,
        };
      });
      setProductCache({
        product: orderPreview.products[0],
        orderProducts,
        currencyId: currencyIdState || '',
        signedGasFee: orderPreview?.gasFee?.signature || '',
      });
    }
    if (proccedAction) {
      proccedAction(query);
    } else {
      router.pushConnect(PixwayAppRoutes.CHECKOUT_PAYMENT + '?' + query);
    }
  };

  const _ButtonsToShow = () => {
    switch (checkoutStatus) {
      case CheckoutStatus.CONFIRMATION:
        return (
          <>
            <PriceAndGasInfo
              currency={orderPreview?.products[0]?.prices[0]?.currency?.name}
              totalPrice={orderPreview?.totalPrice || '0'}
              service={orderPreview?.serviceFee || '0'}
              loading={isLoading}
              className="pw-mt-4"
              price={
                parseFloat(orderPreview?.cartPrice || '0').toFixed(2) || '0'
              }
              gasFee={
                parseFloat(orderPreview?.gasFee?.amount || '0').toFixed(2) ||
                '0'
              }
            />
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
                disabled={!orderPreview}
                onClick={beforeProcced}
                className="!pw-py-3 !pw-px-[42px] !pw-bg-[#295BA6] !pw-text-xs !pw-text-[#FFFFFF] pw-border pw-border-[#295BA6] !pw-rounded-full hover:pw-bg-[#295BA6] hover:pw-shadow-xl disabled:pw-bg-[#A5A5A5] disabled:pw-text-[#373737] active:pw-bg-[#EFEFEF]"
              >
                {translate('shared>continue')}
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
              {translate('shared>exit')}
            </PixwayButton>
          </div>
        );
    }
  };

  return (
    <div className="pw-w-full xl:pw-max-w-[80%] lg:pw-px-[80px] pw-px-6">
      <p className="pw-text-[18px] pw-font-[700]">Checkout</p>
      <div className="pw-flex pw-mt-3 pw-items-center pw-gap-x-2">
        <CreditCardIcon />
        <p className=" pw-font-[700] pw-text-lg pw-text-[#35394C]">
          {translate('checkout>components>checkoutInfo>payment')}
        </p>
      </div>
      <p className="pw-font-[700] pw-text-2xl">
        {translate('checkout>components>checkoutInfo>creditCard')}
      </p>
      <p className="pw-font-[600] pw-text-[#35394C] pw-text-[15px] pw-mt-3">
        {UnderCreditText}
      </p>
      <p className="pw-font-[700] pw-text-lg pw-mt-4">
        {translate('shared>product')}
      </p>
      <ProductInfo
        currency={orderPreview?.products[0]?.prices[0]?.currency?.name}
        loading={isLoading}
        status={checkoutStatus}
        className="pw-mt-3"
        image={orderPreview?.products[0]?.images[0]?.thumb || ''}
        id={orderPreview?.products[0]?.contractAddress || ''}
        name={orderPreview?.products[0]?.name || ''}
        price={
          parseFloat(
            orderPreview?.products[0]?.prices[0].amount || '0'
          ).toFixed(2) || ''
        }
      />
      <_ButtonsToShow />
    </div>
  );
};

export const CheckoutInfo = ({
  checkoutStatus,
  returnAction,
  proccedAction,
  productId,
  currencyId,
}: CheckoutInfoProps) => {
  return (
    <TranslatableComponent>
      <_CheckoutInfo
        proccedAction={proccedAction}
        returnAction={returnAction}
        checkoutStatus={checkoutStatus}
        productId={productId}
        currencyId={currencyId}
      />
    </TranslatableComponent>
  );
};
