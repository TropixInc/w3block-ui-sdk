/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, lazy } from 'react';

import { isAfter, isBefore } from 'date-fns';

import PendingIcon from '../../../shared/assets/icons/clock.svg?react';
import { Spinner } from '../../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import {
  StatementScreenTransaction,
  getSubtransactions,
} from '../../../shared/utils/getSubtransactions';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useGetErcTokensHistory } from '../../hooks/useGetErcTokensHistory';
import { StatementComponent } from './StatementComponent';

const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((mod) => ({ default: mod.InternalPagesLayoutBase }))
);

const CriptoValueComponent = lazy(() =>
  import(
    '../../../shared/components/CriptoValueComponent/CriptoValueComponent'
  ).then((mod) => ({ default: mod.CriptoValueComponent }))
);

const Pagination = lazy(() =>
  import('../../../shared/components/Pagination').then((mod) => ({
    default: mod.Pagination,
  }))
);

export const WalletStatementTemplateSDK = () => {
  const { loyaltyWallet, mainWallet } = useUserWallet();
  const [actualPage, setActualPage] = useState(1);
  const { data, isLoading } = useGetErcTokensHistory(
    loyaltyWallet.length ? loyaltyWallet[0].contractId : undefined,
    { page: actualPage }
  );
  const [translate] = useTranslation();
  const loyaltyWalletDefined = useMemo(() => {
    return loyaltyWallet.length ? loyaltyWallet[0] : undefined;
  }, [loyaltyWallet]);

  const { defaultTheme } = UseThemeConfig();
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

  const subTransactions = useMemo(() => {
    const arr: StatementScreenTransaction[] = [];
    data?.items?.forEach((i) => {
      const subs = getSubtransactions(i);
      subs.forEach((t) => {
        arr.push(t);
      });
    });
    arr.sort(function (a: any, b: any) {
      const dateA = Date.parse(a?.createdAt);
      const dateB = Date.parse(b?.createdAt);
      if (isBefore(dateA, dateB)) return 1;
      if (isAfter(dateA, dateB)) return -1;
      return 0;
    });
    return arr;
  }, [data?.items]);

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });
  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
        <div className="pw-flex pw-justify-between">
          <div>
            <p className="pw-text-[23px] pw-font-[600]">
              {translate('wallet>page>extract')}
            </p>
            {!hideWallet ? (
              <p className="pw-text-[#777E8F] pw-text-xs">
                {mainWallet?.address}
              </p>
            ) : null}
            {loyaltyWalletDefined ? (
              <div className="pw-mt-[14px]">
                <p className="pw-text-black pw-text-lg pw-font-medium pw-leading-[23px]">
                  {loyaltyWalletDefined.currency}
                </p>
                <CriptoValueComponent
                  crypto={true}
                  value={loyaltyWalletDefined.balance}
                  pointsPrecision={loyaltyWalletDefined.pointsPrecision}
                  code={''}
                  fontClass="pw-text-black pw-text-lg pw-font-bold pw-leading-[23px]"
                />
              </div>
            ) : null}
            <p className="pw-text-[#777E8F] pw-text-xs pw-flex pw-gap-1 pw-mt-2 pw-items-center">
              <PendingIcon className="pw-stroke-[#777E8F] pw-w-[12px] pw-h-[12px]" />
              {translate('dashboard>receiptQRCode>creditsTakeTwoHors')}
            </p>
          </div>
        </div>
      </div>
      <div className="pw-mt-[20px] pw-mx-4 sm:pw-mx-0 pw-flex pw-flex-col pw-gap-[20px]">
        {isLoading ? (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            <Spinner className="pw-h-10 pw-w-10" />
          </div>
        ) : subTransactions?.length ? (
          subTransactions.map((item, index) => (
            <StatementComponent
              key={item?.actionId ? item?.actionId + index : index}
              statement={item}
              currency={loyaltyWallet?.length ? loyaltyWallet[0]?.currency : ''}
            />
          ))
        ) : (
          <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
            {translate('dashboard>walletStatementTemplateSDK>releasesNotFound')}
          </div>
        )}
        {data?.meta && data?.meta?.totalPages > 1 ? (
          <div className="pw-mt-4">
            <Pagination
              pagesQuantity={data?.meta.totalPages ?? 0}
              currentPage={actualPage}
              onChangePage={setActualPage}
            />
          </div>
        ) : null}
      </div>
    </InternalPagesLayoutBase>
  );
};
