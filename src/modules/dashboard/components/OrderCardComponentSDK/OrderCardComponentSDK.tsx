/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useMemo, useState } from 'react';

import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

import { CheckoutStatus } from '../../../checkout';
import { useGetEspecificOrder } from '../../../checkout/hooks/useGetEspecificOrder';
import { useRouterConnect } from '../../../shared';
import ArrowIcon from '../../../shared/assets/icons/arrowDown.svg?react';
import CheckIcon from '../../../shared/assets/icons/checkOutlined.svg?react';
// import CopyIcon from '../../../shared/assets/icons/copy.svg?react';
import InfoIcon from '../../../shared/assets/icons/informationCircled.svg?react';
import XIcon from '../../../shared/assets/icons/x-circle.svg?react';
import { PixwayButton } from '../../../shared/components/PixwayButton';
import { CurrencyEnum } from '../../../shared/enums/Currency';
import { useLocale } from '../../../shared/hooks/useLocale';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useGetApi } from '../../hooks/useGetApi';
import { PriceComponent } from '../PriceComponent/PriceComponent';
import { ReceiptQRCode } from '../ReceiptQRCode/ReceiptQRCode';

const ProductInfo = lazy(() =>
  import('../../../shared/components/ProductInfo/ProductInfo').then((mod) => ({
    default: mod.ProductInfo,
  }))
);

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

interface OrderCardComponentSDKProps {
  id: string;
  status: OrderStatusEnum;
  createdAt: string;
  expiresIn?: string;
  paymentProvider?: string;
  productsRes?: any[];
  startOpened?: boolean;
  deliverId?: string;
}

export const OrderCardComponentSDK = ({
  id,
  status,
  createdAt,
  expiresIn,
  paymentProvider,
  productsRes,
  deliverId,
  startOpened = false,
}: OrderCardComponentSDKProps) => {
  const [opened, setOpened] = useState(startOpened);
  const { pushConnect } = useRouterConnect();
  const { data: order } = useGetEspecificOrder(id, opened);
  const locale = useLocale();
  const [translate] = useTranslation();
  const products = order?.data.products;
  const [infoOpened, setInfoOpened] = useState(false);
  const { data } = useGetApi({
    address: order?.data?.destinationWalletAddress,
    enabled: opened,
  });
  const { defaultTheme } = UseThemeConfig();
  const router = useRouter();
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

  const getStatusText = (status: OrderStatusEnum) => {
    switch (status) {
      case OrderStatusEnum.CANCELLED:
        return {
          title: translate('checkout>orderCardComponentSDK>cancel'),
          color: '#ED4971',
          icon: <XIcon />,
        };
      case OrderStatusEnum.CONCLUDED:
        return {
          title: translate('checkout>orderCardComponentSDK>completed'),
          color: '#295BA6',
          icon: <CheckIcon className="pw-stroke-blue-700" />,
        };
      case OrderStatusEnum.CONFIRMING_PAYMENT:
        return {
          title: translate('checkout>orderCardComponentSDK>waitingPayment'),
          color: '#295BA6',
        };
      case OrderStatusEnum.DELIVERING:
        return {
          title: translate('checkout>orderCardComponentSDK>delivering'),
          color: '#295BA6',
        };
      case OrderStatusEnum.WAITING_DELIERY:
        return {
          title: translate('checkout>orderCardComponentSDK>delivering'),
          color: '#295BA6',
        };
      case OrderStatusEnum.EXPIRED:
        return {
          title: translate('checkout>orderCardComponentSDK>expired'),
          color: '#ED4971',
          icon: <XIcon className="pw-stroke-[#ED4971]" />,
        };
      case OrderStatusEnum.FAILED:
        return {
          title: translate('checkout>orderCardComponentSDK>fail'),
          color: '#ED4971',
          icon: <XIcon />,
        };
      case OrderStatusEnum.PENDING:
        return {
          title: translate('checkout>orderCardComponentSDK>pendentPayment'),
          color: '#353945',
        };
      default:
        break;
    }
  };

  const statusObj = getStatusText(status);

  return (
    <div className="pw-p-6 pw-bg-white pw-rounded-xl pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-w-full">
      <div className="pw-flex pw-justify-between">
        <div>
          <div className="">
            <p
              style={{ color: statusObj?.color }}
              className="pw-text-sm pw-font-bold pw-flex pw-gap-1 pw-items-center"
            >
              {statusObj?.icon && <span>{statusObj?.icon}</span>}

              {statusObj?.title}
              {paymentProvider == 'crypto' &&
                status == OrderStatusEnum.PENDING && (
                  <>
                    <div
                      onMouseEnter={() => {
                        if (!infoOpened) setInfoOpened(true);
                      }}
                      onMouseLeave={() => {
                        if (infoOpened) setInfoOpened(false);
                      }}
                    >
                      <InfoIcon className="pw-w-[14px] pw-h-[14px]" />
                      <div className="pw-relative">
                        {infoOpened && (
                          <div className="pw-absolute pw-z-10 pw-bg-white pw-p-2 pw-rounded-lg pw-shadow-md pw-w-[150px]">
                            <p className="pw-text-xs pw-text-slate-600 pw-font-normal">
                              {translate(
                                'dashboardOrderCardComponentSDK>yourPurchaseWaitingProcess'
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
            </p>
            {status === OrderStatusEnum.PENDING && expiresIn && (
              <div className="pw-flex pw-gap-1">
                <p className="pw-text-xs pw-text-slate-500 pw-font-medium">
                  {translate('dashboardOrderCardComponentSDK>expiresAs')}:{' '}
                </p>
                <p className="pw-text-xs pw-text-slate-500">
                  {format(new Date(expiresIn ?? ''), 'H:mm d MMM, yyyy ')}
                </p>
              </div>
            )}
            <p className="pw-text-xs pw-font-[500] pw-text-black pw-flex pw-gap-x-1">
              ID: {id}{' '}
              {/* <span>
              <CopyIcon className="pw-fill-[#295BA6] pw-text-xs pw-w-[12px] pw-h-[12px] pw-cursor-pointer" />
            </span> */}
            </p>
            {deliverId && (
              <p className="pw-text-xs pw-font-[500] pw-text-black pw-flex pw-gap-x-1">
                {translate('dashboardOrderCardComponentSDK>purchase')}:{' '}
                <span className="pw-font-[700]">{deliverId}</span>{' '}
                {/* <span>
                <CopyIcon className="pw-fill-[#295BA6] pw-text-xs pw-w-[12px] pw-h-[12px] pw-cursor-pointer" />
              </span> */}
              </p>
            )}
            {deliverId && showCoinPaymentReceiptButton && (
              <PixwayButton
                onClick={() => setOpenReceipt(true)}
                className="pw-mt-1 !pw-py-[2px] !pw-px-[10px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl"
              >
                {translate('dashboardOrderCardComponentSDK>receiptCode')}
              </PixwayButton>
            )}
          </div>
          {status === OrderStatusEnum.CONFIRMING_PAYMENT ? (
            <PixwayButton
              onClick={() => pushConnect(`/checkout/pay/${id}`)}
              className="pw-mt-1 !pw-py-[2px] !pw-px-[10px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl"
            >
              {translate('dashboardOrderCardComponentSDK>receiptCode')}
            </PixwayButton>
          ) : null}
        </div>
        <div className="pw-flex pw-items-center pw-gap-x-2 pw-justify-end">
          {createdAt && (
            <div className="">
              <p className="pw-text-xs pw-font-[500] pw-text-[#353945] pw-text-right">
                {translate('auth>withdrawAdminActions>requestMade')}:
              </p>
              <p className="pw-text-xs pw-font-[500] pw-text-[#353945]  pw-text-right">
                {format(new Date(createdAt ?? ''), 'PPpp', {
                  locale: locale === 'pt-BR' ? ptBR : enUS,
                })}
              </p>
            </div>
          )}
          <div
            onClick={() => setOpened(!opened)}
            className="pw-w-[30px] pw-h-[30px] pw-flex  pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-rounded-full pw-cursor-pointer"
          >
            <ArrowIcon style={{ stroke: statusObj?.color }} />
          </div>
        </div>
      </div>

      {opened && products && products.length && (
        <div>
          <div className="pw-border pw-border-slate-300 pw-rounded-lg pw-overflow-hidden pw-mt-6">
            {products && products.length
              ? products
                  .reduce((acc: any, current: any) => {
                    const x = acc.some((item: any) => {
                      if (item?.variantIds) {
                        return (
                          item.productToken.product.id ==
                            current.productToken.product.id &&
                          item?.variantIds?.toString() ==
                            current?.variantIds?.toString()
                        );
                      } else {
                        return (
                          item.productToken.product.id ==
                          current.productToken.product.id
                        );
                      }
                    });
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                  }, [])
                  .map((prod: any, index: number) => (
                    <ProductInfo
                      currency={
                        order?.data?.payments?.length > 1
                          ? order?.data?.payments?.find(
                              (res: { currencyId: string }) =>
                                res.currencyId !== coinPaymentCurrencyId
                            )?.currency?.symbol ?? CurrencyEnum.BRL
                          : order?.data?.payments?.[0]?.currency?.symbol ??
                            CurrencyEnum.BRL
                      }
                      image={
                        data?.data?.data?.length > 0 &&
                        data?.data?.data?.[0]?.attributes?.image
                          ? 'https://cms.foodbusters.com.br' +
                            data?.data?.data?.[0]?.attributes?.image?.data
                              ?.attributes?.formats?.thumbnail?.url
                          : prod?.productToken?.product?.images?.length
                          ? prod?.productToken?.product?.images?.[0]?.thumb
                          : prod?.productToken?.metadata?.media?.[0]?.cached
                              .smallSizeUrl ?? ''
                      }
                      name={prod?.productToken?.product?.name ?? ''}
                      id={prod?.productToken?.product.id ?? ''}
                      price={
                        typeof prod?.currencyAmount === 'string'
                          ? prod?.currencyAmount
                          : prod?.currencyAmount?.[0]?.amount
                      }
                      status={CheckoutStatus.MY_ORDER}
                      quantity={
                        products.filter((pr: any) => {
                          if (pr.variantIds) {
                            return (
                              pr?.productToken?.product?.id ==
                                prod?.productToken?.product?.id &&
                              pr?.variantIds?.toString() ==
                                prod?.variantIds?.toString()
                            );
                          } else {
                            return (
                              pr?.productToken?.product?.id ==
                              prod?.productToken?.product?.id
                            );
                          }
                        }).length
                      }
                      stockAmount={1}
                      key={prod?.productToken?.id + index}
                      originalPrice={prod?.originalCurrencyAmount}
                      variants={
                        productsRes?.find(
                          (val) =>
                            val?.productToken?.id == prod?.productToken?.id
                        )?.variants
                      }
                      anchorCurrencyAmount="0"
                      metadata={prod?.metadata}
                      subtitle={prod?.subtitle ?? prod?.productToken?.subtitle}
                    />
                  ))
              : null}
          </div>
          {data?.data?.data?.[0]?.attributes?.name ? (
            <div className="pw-flex pw-justify-between pw-mt-6 pw-mb-2">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('checkout>checkoutResume>recipient')}
              </p>
              <p className="pw-text-sm pw-font-[600] pw-text-[#35394C]">
                {' '}
                {data?.data?.data?.[0]?.attributes?.name}
              </p>
            </div>
          ) : null}
          <PriceComponent
            payments={order?.data?.payments}
            name={order?.data?.currency?.code ?? CurrencyEnum.BRL}
            className={`${
              data?.data?.data?.[0]?.attributes?.name ? '' : 'pw-mt-6'
            }`}
          />
        </div>
      )}
      <ReceiptQRCode
        isOpen={openReceipt}
        onClose={() => setOpenReceipt(false)}
        deliverId={deliverId}
        profile
      />
    </div>
  );
};
