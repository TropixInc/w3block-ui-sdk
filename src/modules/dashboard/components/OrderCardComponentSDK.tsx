/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import ArrowIcon from '../../shared/assets/icons/arrowDown.svg';
import InfoIcon from '../../shared/assets/icons/informationCircled.svg';
import { CheckoutStatus } from '../../checkout/components/CheckoutInfo';
import { useGetEspecificOrder } from '../../checkout/hooks/useGetEspecificOrder';
import { BaseButton } from '../../shared/components/Buttons';
import { ProductInfo } from '../../shared/components/ProductInfo';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { Tone, UI } from '../../shared/components/ui/tokens';
import { CurrencyEnum } from '../../shared/enums/Currency';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { formatAmount } from '../../shared/utils/formatAmount';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useGetApi } from '../hook/useGetApi';
import { PriceComponent } from './PriceComponent';
import { ReceiptQRCode } from './ReceiptQRCode';

export enum OrderStatusEnum {
  PENDING = 'pending',
  EXPIRED = 'expired',
  CONFIRMING_PAYMENT = 'confirming_payment',
  CONCLUDED = 'concluded',
  FAILED = 'failed',
  DELIVERING = 'delivering',
  WAITING_DELIERY = 'waiting_delivery',
  CANCELLED = 'cancelled',
}

/** Statuses that still move; everything else is final. */
export const ORDER_IN_PROGRESS_STATUSES: readonly string[] = [
  OrderStatusEnum.PENDING,
  OrderStatusEnum.CONFIRMING_PAYMENT,
  OrderStatusEnum.DELIVERING,
  OrderStatusEnum.WAITING_DELIERY,
];

interface OrderCardComponentSDKProps {
  id: string;
  status: OrderStatusEnum;
  createdAt: string;
  expiresIn?: string;
  paymentProvider?: string;
  paymentMethod?: string;
  productsRes?: any[];
  startOpened?: boolean;
  deliverId?: string;
  /** Establishment or product shown as the row title. */
  title?: string;
  /** Total paid, as the list returns it (string amount + currency symbol). */
  totalAmount?: string;
  currencySymbol?: string;
}

const PAYMENT_LABEL_KEYS: Record<string, string> = {
  pix: 'dashboardOrderCardComponentSDK>payment>pix',
  credit_card: 'dashboardOrderCardComponentSDK>payment>card',
  debit_card: 'dashboardOrderCardComponentSDK>payment>card',
  card: 'dashboardOrderCardComponentSDK>payment>card',
  crypto: 'dashboardOrderCardComponentSDK>payment>balance',
  loyalty: 'dashboardOrderCardComponentSDK>payment>balance',
  transfer: 'dashboardOrderCardComponentSDK>payment>transfer',
  boleto: 'dashboardOrderCardComponentSDK>payment>boleto',
};

export const OrderCardComponentSDK = ({
  id,
  status,
  createdAt,
  expiresIn,
  paymentProvider,
  paymentMethod,
  productsRes,
  deliverId,
  startOpened = false,
  title,
  totalAmount,
  currencySymbol,
}: OrderCardComponentSDKProps) => {
  const [opened, setOpened] = useState(startOpened);
  const { pushConnect } = useRouterConnect();
  const { data: order } = useGetEspecificOrder(id, opened);
  const locale = useLocale();
  const [translate] = useTranslation();
  const products = order?.products;
  const [infoOpened, setInfoOpened] = useState(false);
  const { data } = useGetApi({
    address: order?.destinationWalletAddress,
    enabled: opened,
  });
  const { defaultTheme } = useThemeConfig();
  const router = useRouterConnect();
  const coinPaymentCurrencyId = useMemo(() => {
    return (
      router.query?.cryptoCurrencyId ??
      defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId
    );
  }, [
    defaultTheme?.configurations?.contentData?.coinPaymentCurrencyId,
    router.query?.cryptoCurrencyId,
  ]);
  const [openReceipt, setOpenReceipt] = useState(false);
  const showCoinPaymentReceiptButton =
    defaultTheme?.configurations?.contentData?.showCoinPaymentReceiptButton;

  const statusInfo = (s: OrderStatusEnum): { label: string; tone: Tone } => {
    switch (s) {
      case OrderStatusEnum.CANCELLED:
        return {
          label: translate('checkout>orderCardComponentSDK>cancel'),
          tone: 'bad',
        };
      case OrderStatusEnum.CONCLUDED:
        return {
          label: translate('checkout>orderCardComponentSDK>completed'),
          tone: 'ok',
        };
      case OrderStatusEnum.CONFIRMING_PAYMENT:
        return {
          label: translate('checkout>orderCardComponentSDK>waitingPayment'),
          tone: 'warn',
        };
      case OrderStatusEnum.DELIVERING:
      case OrderStatusEnum.WAITING_DELIERY:
        return {
          label: translate('checkout>orderCardComponentSDK>delivering'),
          tone: 'info',
        };
      case OrderStatusEnum.EXPIRED:
        return {
          label: translate('checkout>orderCardComponentSDK>expired'),
          tone: 'grey',
        };
      case OrderStatusEnum.FAILED:
        return {
          label: translate('checkout>orderCardComponentSDK>fail'),
          tone: 'bad',
        };
      case OrderStatusEnum.PENDING:
        return {
          label: translate('checkout>orderCardComponentSDK>pendentPayment'),
          tone: 'warn',
        };
      default:
        return { label: String(s ?? ''), tone: 'grey' };
    }
  };
  const { label: statusLabel, tone } = statusInfo(status);

  const method = (paymentMethod ?? paymentProvider ?? '')
    .toString()
    .toLowerCase();
  const paymentLabel = PAYMENT_LABEL_KEYS[method]
    ? translate(PAYMENT_LABEL_KEYS[method])
    : method
    ? method.charAt(0).toUpperCase() + method.slice(1).replace(/_/g, ' ')
    : '';
  const dateLabel = createdAt
    ? format(new Date(createdAt), 'dd/MM/yyyy HH:mm', {
        locale: locale === 'pt-BR' ? ptBR : enUS,
      })
    : '';
  const meta = [dateLabel, paymentLabel].filter(Boolean).join(' · ');
  const rowTitle =
    title ||
    productsRes?.[0]?.productToken?.product?.name ||
    translate('dashboardOrderCardComponentSDK>purchase');
  const total =
    totalAmount && Number.isFinite(Number(totalAmount))
      ? `${currencySymbol ?? ''} ${formatAmount(totalAmount, locale)}`.trim()
      : null;

  const dedupedProducts = useMemo(() => {
    if (!products?.length) return [];
    return products.reduce((acc: any[], current: any) => {
      const exists = acc.some((item: any) =>
        item?.variantIds
          ? item.productToken.product.id === current.productToken.product.id &&
            item?.variantIds?.toString() === current?.variantIds?.toString()
          : item.productToken.product.id === current.productToken.product.id
      );
      return exists ? acc : acc.concat([current]);
    }, []);
  }, [products]);

  const quantityOf = (prod: any) =>
    (products ?? []).filter((pr: any) =>
      pr.variantIds
        ? pr?.productToken?.product?.id === prod?.productToken?.product?.id &&
          pr?.variantIds?.toString() === prod?.variantIds?.toString()
        : pr?.productToken?.product?.id === prod?.productToken?.product?.id
    ).length;

  const cmsName = data?.data?.data?.[0]?.attributes?.name;
  const cmsImage =
    data?.data?.data?.[0]?.attributes?.image?.data?.attributes?.formats
      ?.thumbnail?.url;

  return (
    <div className={classNames(UI.card, 'pw-p-4 pw-w-full pw-min-w-0')}>
      <div className="pw-flex pw-items-start pw-gap-3">
        <div className="pw-flex-1 pw-min-w-0">
          <div className="pw-flex pw-flex-wrap pw-items-center pw-gap-2">
            <span
              className={classNames(
                'pw-text-[14px] pw-font-semibold pw-truncate pw-max-w-full',
                UI.text
              )}
            >
              {rowTitle}
            </span>
            <StatusPill tone={tone} size="sm">
              {statusLabel}
            </StatusPill>
            {paymentProvider === 'crypto' &&
            status === OrderStatusEnum.PENDING ? (
              <span
                className="pw-relative pw-inline-flex"
                onMouseEnter={() => setInfoOpened(true)}
                onMouseLeave={() => setInfoOpened(false)}
              >
                <InfoIcon className="pw-w-[14px] pw-h-[14px]" />
                {infoOpened ? (
                  <span className="pw-absolute pw-left-0 pw-top-5 pw-z-10 pw-bg-white pw-p-2 pw-rounded-lg pw-shadow-md pw-w-[200px] pw-text-[11.5px] pw-text-[#4A5567]">
                    {translate(
                      'dashboardOrderCardComponentSDK>yourPurchaseWaitingProcess'
                    )}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
          <p
            className={classNames(
              'pw-text-[12px] pw-m-0 pw-mt-0.5 pw-truncate',
              UI.textMuted
            )}
          >
            {meta}
            {deliverId ? (
              <>
                {meta ? ' · ' : ''}
                {translate('dashboardOrderCardComponentSDK>purchase')}{' '}
                <span className="pw-font-semibold pw-text-[#4A5567]">
                  {deliverId}
                </span>
              </>
            ) : null}
          </p>
          {status === OrderStatusEnum.PENDING && expiresIn ? (
            <p className="pw-text-[12px] pw-m-0 pw-mt-0.5 pw-text-[#9A6508]">
              {translate('dashboardOrderCardComponentSDK>expiresAs')}{' '}
              {format(new Date(expiresIn), 'HH:mm d MMM, yyyy', {
                locale: locale === 'pt-BR' ? ptBR : enUS,
              })}
            </p>
          ) : null}
        </div>
        <div className="pw-flex pw-items-center pw-gap-2 pw-shrink-0">
          {total ? (
            <span
              className={classNames(
                'pw-text-[14px] pw-font-semibold pw-tabular-nums pw-whitespace-nowrap',
                UI.text
              )}
            >
              {total}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setOpened(!opened)}
            aria-expanded={opened}
            aria-label={translate('dashboardOrderCardComponentSDK>details')}
            className="pw-w-8 pw-h-8 pw-grid pw-place-items-center pw-bg-[#F1F3F6] pw-rounded-full pw-shrink-0"
          >
            <ArrowIcon
              className={classNames(
                'pw-stroke-[#4A5567] pw-transition-transform',
                opened && 'pw-rotate-180'
              )}
            />
          </button>
        </div>
      </div>

      {status === OrderStatusEnum.CONFIRMING_PAYMENT ||
      (deliverId && showCoinPaymentReceiptButton) ? (
        <div className="pw-flex pw-flex-wrap pw-gap-2 pw-mt-3">
          {status === OrderStatusEnum.CONFIRMING_PAYMENT ? (
            <BaseButton onClick={() => pushConnect(`/checkout/pay/${id}`)}>
              {translate('dashboardOrderCardComponentSDK>pay')}
            </BaseButton>
          ) : null}
          {deliverId && showCoinPaymentReceiptButton ? (
            <button
              type="button"
              onClick={() => setOpenReceipt(true)}
              className={UI.buttonSecondary}
            >
              {translate('dashboardOrderCardComponentSDK>receiptCode')}
            </button>
          ) : null}
        </div>
      ) : null}

      {opened && dedupedProducts.length ? (
        <div className="pw-mt-4 pw-pt-4 pw-border-t pw-border-[#E6E8EC]">
          <div className="pw-border pw-border-[#E6E8EC] pw-rounded-lg pw-overflow-hidden">
            {dedupedProducts.map((prod: any, index: number) => (
              <ProductInfo
                currency={
                  order?.payments?.length > 1
                    ? order?.payments?.find(
                        (res: { currencyId: string }) =>
                          res.currencyId !== coinPaymentCurrencyId
                      )?.currency?.symbol ?? CurrencyEnum.BRL
                    : order?.data?.payments?.[0]?.currency?.symbol ??
                      CurrencyEnum.BRL
                }
                image={
                  cmsImage
                    ? 'https://cms.zuca.ai' + cmsImage
                    : prod?.productToken?.product?.images?.length
                    ? prod?.productToken?.product?.images?.[0]?.thumb
                    : prod?.productToken?.metadata?.media?.[0]?.cached
                        ?.smallSizeUrl ?? ''
                }
                name={prod?.productToken?.product?.name ?? ''}
                id={prod?.productToken?.product.id ?? ''}
                price={
                  typeof prod?.currencyAmount === 'string'
                    ? prod?.currencyAmount
                    : prod?.currencyAmount?.[0]?.amount
                }
                status={CheckoutStatus.MY_ORDER}
                quantity={quantityOf(prod)}
                stockAmount={1}
                key={prod?.productToken?.id + index}
                originalPrice={prod?.originalCurrencyAmount}
                variants={
                  productsRes?.find(
                    (val) => val?.productToken?.id == prod?.productToken?.id
                  )?.variants
                }
                anchorCurrencyAmount="0"
                metadata={prod?.metadata}
                subtitle={prod?.subtitle ?? prod?.productToken?.subtitle}
              />
            ))}
          </div>
          {cmsName ? (
            <div className="pw-flex pw-justify-between pw-mt-4 pw-mb-1 pw-text-[13px]">
              <span className={UI.textSecondary}>
                {translate('checkout>checkoutResume>recipient')}
              </span>
              <span className={classNames('pw-font-semibold', UI.text)}>
                {cmsName}
              </span>
            </div>
          ) : null}
          <PriceComponent
            payments={order?.payments}
            name={order?.currency?.code ?? CurrencyEnum.BRL}
            className={cmsName ? '' : 'pw-mt-4'}
          />
          <p
            className={classNames(
              'pw-text-[11px] pw-m-0 pw-mt-3 pw-break-all',
              UI.textFaint
            )}
          >
            ID {id}
          </p>
        </div>
      ) : null}
      <ReceiptQRCode
        isOpen={openReceipt}
        onClose={() => setOpenReceipt(false)}
        deliverId={deliverId}
        profile
      />
    </div>
  );
};
