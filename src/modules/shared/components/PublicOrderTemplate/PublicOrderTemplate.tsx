/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

import { useRouterConnect } from '../../hooks';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { useGetPublicOrder } from '../../hooks/useGetPublicOrder/useGetPublicOrder';
import { useLocale } from '../../hooks/useLocale';
import useTranslation from '../../hooks/useTranslation';
import { Spinner } from '../Spinner';

export const PublicOrderTemplate = () => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { data, isLoading, isError } = useGetPublicOrder(
    router?.query?.id as string,
    true
  );
  const { companyId } = useCompanyConfig();
  const locale = useLocale();
  const value = useMemo(() => {
    const payments = data?.data?.payments;
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
  }, [companyId, data?.data?.payments]);
  if (isLoading)
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10 pw-h-[80vh]">
        <Spinner className="pw-h-13 pw-w-13" />
      </div>
    );
  else if (isError)
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-10 pw-h-[80vh] pw-text-lg pw-font-medium">
        {translate('shared>publicOrderTemplate>purchaseNotFound', {
          purchase: router?.query?.id,
        })}
      </div>
    );
  else
    return (
      <div className="pw-w-full pw-h-[80vh]">
        <div className="pw-rounded-xl pw-p-5 pw-border pw-border-[#DCDCDC] pw-text-black pw-text-center pw-mt-5 pw-max-w-[350px] pw-mx-auto">
          <div>
            <p className="pw-text-base pw-font-normal">
              {translate('checkout>checkoutInfo>paymentFor')}
            </p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.destinationUserName}
            </p>
          </div>
          <div className="pw-mt-5">
            <p className="pw-text-base pw-font-normal">
              {translate('checkout>checkoutInfo>WhoPaid')}
            </p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.userFirstName}
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
              {data?.data?.cashback?.currency?.symbol}{' '}
              {parseFloat(data?.data?.cashback?.cashbackAmount).toFixed(2)}
            </p>
          </div>
          <div className="pw-mt-5">
            <p className="pw-text-base pw-font-normal">
              {translate('checkout>checkoutInfo>purchaseMadeOn')}
            </p>
            <p className="pw-text-base pw-font-semibold">
              {data?.data?.createdAt
                ? format(
                    new Date(data?.data?.createdAt ?? Date.now()),
                    'PPpp',
                    {
                      locale: locale === 'pt-BR' ? ptBR : enUS,
                    }
                  )
                : null}
            </p>
          </div>
          <div className="pw-mt-5">
            <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
              <QRCodeSVG
                value={`${window?.location?.origin}/order/${data?.data?.deliverId}`}
                size={84}
              />
              <p className="pw-text-[20px] pw-font-semibold">
                {data?.data?.deliverId ?? ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};
