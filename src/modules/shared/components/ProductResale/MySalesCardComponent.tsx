/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

import ArrowIcon from '../../assets/icons/arrowDown.svg';
import CheckIcon from '../../assets/icons/checkOutlined.svg';
import InfoIcon from '../../assets/icons/informationCircled.svg';
import XIcon from '../../assets/icons/x-circle.svg';
import { CurrencyEnum } from '../../enums/Currency';
import { useLocale } from '../../hooks/useLocale';
import { MySalesPriceComponent } from './MySalePriceComponent';

import { Currency } from '../../interfaces/Currency';

import { Product } from '../../../storefront/hooks/useGetProductBySlug';
import useTranslation from '../../hooks/useTranslation';

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

interface MySalesCardComponentProps {
  id: string;
  status: OrderStatusEnum;
  createdAt: string;
  expiresIn?: string;
  paymentProvider?: string;
  productsRes?: Product;
  startOpened?: boolean;
  deliverId?: string;
  quantity?: string;
  price?: string;
  receipts?: {
    currency: Currency;
    currencyId: string;
    fees: string;
    netValue: string;
    receiveDate: string;
    status: string;
    withdrawDate: string;
  };
}

export const MySalesCardComponent = ({
  id,
  status,
  createdAt,
  expiresIn,
  paymentProvider,
  productsRes,
  deliverId,
  startOpened = false,
  quantity,
  price,
  receipts,
}: MySalesCardComponentProps) => {
  const [opened, setOpened] = useState(startOpened);
  const locale = useLocale();
  const [translate] = useTranslation();
  const [infoOpened, setInfoOpened] = useState(false);

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
      <div
        onClick={() => setOpened(!opened)}
        className="pw-flex pw-justify-between max-sm:pw-flex-col pw-flex-row pw-gap-3"
      >
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
            <p className="pw-text-lg pw-font-[700] !pw-text-[#35394C]">
              {translate('pages>mysales>resale>total') + ': R$'}
              {parseFloat(receipts?.netValue ?? '').toFixed(2)}
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
          </div>
        </div>
        <div className="pw-flex pw-items-center pw-gap-x-2 pw-justify-end max-sm:pw-justify-between">
          {createdAt && (
            <div className="">
              <p className="pw-text-xs pw-font-[500] pw-text-[#353945] pw-text-right max-sm:pw-text-left">
                Criado em:
              </p>
              <p className="pw-text-xs pw-font-[500] pw-text-[#353945]  pw-text-right max-sm:pw-text-left">
                {format(new Date(createdAt ?? ''), 'PPpp', {
                  locale: locale === 'pt-BR' ? ptBR : enUS,
                })}
              </p>
            </div>
          )}
          <div className="pw-w-[30px] pw-h-[30px] pw-flex  pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-rounded-full pw-cursor-pointer">
            <ArrowIcon style={{ stroke: statusObj?.color }} />
          </div>
        </div>
      </div>

      {opened ? (
        <div className="pw-max-w-[550px]">
          <div className="pw-mt-4">
            <p className="pw-font-[600] pw-text-sm pw-text-black">
              {productsRes?.name ?? ''}
            </p>
            <div className="pw-flex pw-justify-between">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('pages>mysales>resale>value')}
              </p>
              <p className="pw-text-sm pw-font-[600] pw-text-black">
                R$ {parseFloat(price ?? '0').toFixed(2)}
              </p>
            </div>
            <div className="pw-flex pw-justify-between">
              <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                {translate('pages>productResale>quantity')}
              </p>
              <p className="pw-text-sm pw-font-[600] pw-text-black">
                x {quantity}
              </p>
            </div>
          </div>
          <MySalesPriceComponent
            receipts={receipts}
            name={receipts?.currency?.code ?? CurrencyEnum.BRL}
            className="pw-mt-2"
          />
        </div>
      ) : null}
    </div>
  );
};
