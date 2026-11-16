import _ from 'lodash';
import { BRL_CURRENCY_IDS, STRIPE_CACHE_VALIDITY_MINUTES } from './constants';
import {
  CreateOrderResponse,
  OrderPreviewCache,
  StripeCache,
} from '../../interface/interface';

export function isStripeCacheValid(cacheTimestamp: Date): boolean {
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - new Date(cacheTimestamp).getTime());
  return diffMs / (1000 * 60) < STRIPE_CACHE_VALIDITY_MINUTES;
}

export function findBrlPayment(payments: CreateOrderResponse['payments']) {
  return payments?.find((p) =>
    BRL_CURRENCY_IDS.some((id) => p?.currency?.id === id)
  );
}

export function buildProviderInputs(
  inputs: string[] | undefined,
  values: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!inputs) return undefined;
  return {
    ...values,
    transparent_checkout: inputs.includes('transparent_checkout'),
  };
}

interface TrackPurchaseParams {
  productCache: OrderPreviewCache;
  orderData: CreateOrderResponse;
  paymentLabel?: string;
  pricesOverride?: string;
}

export function buildTrackPurchaseData({
  productCache,
  orderData,
  paymentLabel,
  pricesOverride,
}: TrackPurchaseParams) {
  const isErc20Loyalty =
    productCache?.products?.[0]?.type === 'erc20' &&
    Boolean(_.get(productCache, 'products[0].draftData.keyErc20LoyaltyId'));

  if (isErc20Loyalty) {
    return {
      currency: productCache?.choosedPayment?.currency?.code ?? '',
      value: orderData?.totalAmount,
      items: productCache?.products.map((res) => ({
        item_id: res.id,
        item_variant: productCache?.destinationUser?.name,
        item_name: 'Zuca',
        quantity: 1,
        prices: pricesOverride ?? orderData?.totalAmount,
        value: orderData?.totalAmount,
        destination: productCache?.destinationUser?.name,
        payment_info: paymentLabel ?? '',
      })),
    };
  }

  return {
    value: orderData?.totalAmount,
    currency: orderData?.currency?.code,
    items: productCache?.products.map((res) => ({
      item_id: res.id,
      item_name: res.name,
    })),
  };
}

export function isStripeCacheMatchingProducts(
  stripeCache: StripeCache,
  productCache: OrderPreviewCache
): boolean {
  const cacheIds = stripeCache.productData
    ?.map((val: { id: string }) => val?.id)
    .toString();
  const currentIds = productCache.products
    ?.map((val) => val?.id)
    .toString();
  return cacheIds === currentIds && productCache.cartPrice === stripeCache.amount;
}

interface BuildPaymentsParams {
  orderInfo: OrderPreviewCache;
  inputs: Record<string, unknown>;
  isCoinPayment: boolean;
  isFree: boolean;
  coinPaymentCurrencyId: string;
  coinPayment?: { totalPrice?: string }[];
}

export function buildOrderPayments({
  orderInfo,
  inputs,
  isCoinPayment,
  isFree,
  coinPaymentCurrencyId,
  coinPayment,
}: BuildPaymentsParams) {
  const providerInputs = buildProviderInputs(
    orderInfo.choosedPayment?.inputs,
    inputs
  );
  const baseFiatPayment = {
    currencyId: orderInfo.currencyId,
    paymentMethod: orderInfo.choosedPayment?.paymentMethod,
    paymentProvider: orderInfo.choosedPayment?.paymentProvider,
    providerInputs,
  };

  if (!isCoinPayment) {
    return [{ ...baseFiatPayment, amountType: 'percentage', amount: '100' }];
  }

  if (coinPayment?.length && coinPayment.length > 0) {
    if (isFree) {
      return [
        {
          currencyId: coinPaymentCurrencyId,
          paymentMethod: 'crypto',
          amountType: 'percentage',
          amount: '100',
        },
      ];
    }
    return [
      { ...baseFiatPayment, amountType: 'all_remaining' },
      {
        currencyId: coinPaymentCurrencyId,
        paymentMethod: 'crypto',
        amountType: 'fixed',
        amount: coinPayment?.[0]?.totalPrice,
      },
    ];
  }

  return [
    { ...baseFiatPayment, amountType: 'all_remaining' },
    {
      currencyId: orderInfo.cryptoCurrencyId ?? coinPaymentCurrencyId,
      paymentMethod: 'crypto',
      amountType: 'fixed',
      amount: '0',
    },
  ];
}
