/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

import PendingIcon from '../../shared/assets/icons/clock.svg';
import { useLocale } from '../../shared/hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { ModalBase } from '../../shared/components/ModalBase';
import { Spinner } from '../../shared/components/Spinner';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useGetPublicOrder } from '../../shared/hooks/useGetPublicOrder';

export const ReceiptQRCode = ({
  isOpen,
  onClose,
  deliverId,
  profile = false,
}: {
  isOpen: boolean;
  onClose(): void;
  deliverId?: string;
  profile?: boolean;
}) => {
  const locale = useLocale();
  const [translate] = useTranslation();
  const { data: receipt, isLoading } = useGetPublicOrder(
    deliverId ?? '',
    isOpen
  );

  const { companyId } = useCompanyConfig();
  const value = useMemo(() => {
    const payments = receipt?.data?.payments;
    if (companyId === 'ef41dc3f-d9e4-4ca4-8270-673d68f4f490') {
      const values = payments?.map((res: any) => parseFloat(res.amount));
      const total = values?.reduce(function (acc: any, cur: any) {
        return acc + cur;
      }, 0);
      return 'R$' + total?.toFixed(2);
    }
    const arr: any[] = [];
    payments?.forEach((res: any) => {
      if (res.amount !== '0') {
        const val = res.currency.symbol + parseFloat(res.amount).toFixed(2);
        arr.push(val);
      }
    });
    const finalValue = arr.join(' + ');
    return finalValue;
  }, [companyId, receipt?.data?.payments]);
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{ classComplement: 'sm:!pw-p-8 !pw-p-4 !pw-min-w-[330px]' }}
    >
      {isLoading ? (
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10">
          <Spinner className="pw-h-13 pw-w-13" />
        </div>
      ) : (
        <div>
          <div className="pw-text-black pw-text-center pw-mt-5 pw-max-w-[350px] pw-mx-auto">
            <div>
              <p className="pw-text-base pw-font-normal">
                {translate('checkout>checkoutInfo>paymentFor')}
              </p>
              <p className="pw-text-base pw-font-semibold">
                {receipt?.data?.destinationUserName}
              </p>
            </div>
            <div className="pw-mt-5">
              <p className="pw-text-base pw-font-normal">
                {translate('checkout>checkoutInfo>WhoPaid')}
              </p>
              <p className="pw-text-base pw-font-semibold">
                {receipt?.data?.userFirstName}
              </p>
            </div>
            <div className="pw-mt-5">
              <p className="pw-text-base pw-font-normal">
                {translate('checkout>checkoutInfo>valuePaid')}
              </p>
              <p className="pw-text-base pw-font-semibold">{value}</p>
            </div>
            <div className="pw-mt-5">
              <p className="pw-text-base pw-font-normal">
                {translate('checkout>checkoutInfo>cashbackEarned')}
              </p>
              <p className="pw-text-base pw-font-semibold">
                {receipt?.data?.cashback?.currency?.symbol}{' '}
                {parseFloat(receipt?.data?.cashback?.cashbackAmount).toFixed(2)}
              </p>
            </div>
            <div className="pw-mt-5">
              <p className="pw-text-base pw-font-normal">
                {translate('checkout>checkoutInfo>purchaseMadeOn')}
              </p>
              <p className="pw-text-base pw-font-semibold">
                {receipt?.data?.createdAt
                  ? format(
                      new Date(receipt?.data?.createdAt ?? Date.now()),
                      'PPpp',
                      {
                        locale: locale === 'pt-BR' ? ptBR : enUS,
                      }
                    )
                  : null}
              </p>
            </div>
            {profile ? (
              <div className="pw-mt-3">
                <p className="pw-text-[#777E8F] pw-text-xs pw-flex pw-gap-1 pw-mt-2 pw-items-center pw-justify-center">
                  <PendingIcon className="pw-stroke-[#777E8F] pw-w-[15px] pw-h-[15px]" />
                  <p className="pw-max-w-[250px]">
                    {translate('dashboard>receiptQRCode>creditsTakeTwoHors')}
                  </p>
                </p>
              </div>
            ) : null}
            <div className="pw-mt-5">
              <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
                <QRCodeSVG
                  value={`${window?.location?.origin}/order/${receipt?.data?.deliverId}`}
                  size={84}
                />
                <p className="pw-text-[20px] pw-font-semibold">
                  {receipt?.data?.deliverId ?? ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalBase>
  );
};
