/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';

import { Disclosure, Tab } from '@headlessui/react';
import { UserContextStatus } from '@w3block/sdk-id';

import ArrowIcon from '../../../shared/assets/icons/arrowDown.svg?react';
import CopyIcon from '../../../shared/assets/icons/copyIcon.svg?react';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useDeleteProductResale } from '../../hooks/useDeleteProductResale/useDeleteProductResale';
import { useGetContextByUserId } from '../../hooks/useGetContextByUserId/useGetContextByUserId';
import { useGetProductsForResale } from '../../hooks/useGetProductsForResale';
import { useGetUserForSaleErc20 } from '../../hooks/useGetUserForSaleErc20/useGetUserForSaleErc20';
import { useGetUserResaleSummary } from '../../hooks/useGetUserResaleSummary/useGetUserResaleSummary';
import { Alert } from '../Alert';
import { BaseButton } from '../Buttons';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import { PageHeader } from '../ui/PageHeader';
import { KpiCard, KpiRow } from '../ui/KpiCard';
import { formatAmount } from '../../utils/formatAmount';
import { Spinner } from '../Spinner';
import { ContextsResale } from './ContextsResale';
import { MySalesListComponent } from './MySalesListComponent';
import { useGetUserContextId } from '../../../shared/hooks/useGetUserContextId';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useUserWallet } from '../../../shared/hooks/useUserWallet/useUserWallet';
import { useThemeConfig } from '../../../storefront/hooks/useThemeConfig';

export const MySales = () => {
  const { mainWallet } = useUserWallet();
  const { data: productsResale } = useGetProductsForResale({});
  const { data: summary, isFetching } = useGetUserResaleSummary();
  const { data: forSaleErc20 } = useGetUserForSaleErc20();
  const { mutate: deleteSale } = useDeleteProductResale();
  const [translate] = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [_, setCopy] = useCopyToClipboard();
  const copyAddress = (address: string) => {
    setCopied(true);
    setCopy(address || '');
    setTimeout(() => setCopied(false), 5000);
  };

  const profile = useProfile();

  const { data: context } = useGetContextByUserId({
    userId: profile?.data?.data?.id ?? '',
    queryOptions: { limit: 50 },
  });
  const hasBankDetails = useMemo(() => {
    return context?.data?.items?.find(
      (res: any) => res.context?.slug === 'bankdetails'
    );
  }, [context?.data?.items]);

  const activeKycContexts = useMemo(() => {
    if (context?.data?.items?.length) {
      const contexts = context?.data?.items?.filter((res: any) => {
        if (res?.context?.slug === 'bankdetails')
          return res.status === UserContextStatus.RequiredReview;
        else return res?.context?.slug.includes('resale-user-documents-asaas');
      });
      return contexts.filter(
        (res: any) =>
          res?.status === UserContextStatus.Draft ||
          res?.status === UserContextStatus.RequiredReview
      );
    }
    return [];
  }, [context?.data?.items]);

  const bankDetailsContext = useMemo(() => {
    return context?.data?.items?.find(
      (res: any) => res?.context?.slug === 'bankdetails'
    );
  }, [context?.data?.items]);

  const { data: userContext } = useGetUserContextId({
    userId: profile?.data?.data?.id ?? '',
    userContextId: bankDetailsContext?.id ?? '',
  });

  const { defaultTheme } = useThemeConfig();

  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

  const erc20Product = productsResale?.items?.find(
    (res) => res.type === 'erc20'
  );

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });

  if (isFetching) {
    return (
      <InternalPagesLayoutBase>
        <div className="pw-w-full pw-flex pw-justify-center pw-items-center">
          <Spinner className="pw-w-15 pw-h-15" />
        </div>
      </InternalPagesLayoutBase>
    );
  }
  return (
    <InternalPagesLayoutBase>
      {activeKycContexts?.length ? (
        <div className="pw-flex pw-flex-col pw-justify-between pw-gap-3 pw-mb-5 pw-items-center">
          {activeKycContexts?.map((res: any) => {
            return (
              <ContextsResale
                key={res.id}
                id={res?.id}
                slug={res?.context?.slug ?? ''}
              />
            );
          })}
        </div>
      ) : null}
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <PageHeader
          title={translate('pages>mysales>mysales')}
          subtitle={
            !hideWallet && mainWallet?.address ? (
              <button
                type="button"
                onClick={() => copyAddress(mainWallet?.address || '')}
                className="pw-inline-flex pw-items-center pw-gap-1 pw-text-[12px] pw-text-[#6B7280]"
                title={mainWallet?.address}
              >
                <span className="pw-tabular-nums">
                  {mainWallet.address.substring(0, 6)}…
                  {mainWallet.address.substring(mainWallet.address.length - 4)}
                </span>
                <CopyIcon />
                {copied ? (
                  <span className="pw-text-[11px] pw-font-semibold">
                    {translate('components>menu>copied')}
                  </span>
                ) : null}
              </button>
            ) : undefined
          }
        />
        <KpiRow>
          <KpiCard
            variant="accent"
            label={translate('pages>mysales>resale>totalSold')}
            value={formatAmount(
              summary?.data?.saleSummaryByCurrency?.[0]?.netValue ?? '0'
            )}
            unit="R$"
          />
          <KpiCard
            label={translate('pages>mysales>resale>totalWaiting')}
            value={formatAmount(
              parseFloat(
                summary?.data?.saleSummaryByCurrency?.[0]?.waitingWithdraw ??
                  '0'
              ) +
                parseFloat(
                  summary?.data?.saleSummaryByCurrency?.[0]?.pendingSplit ?? '0'
                )
            )}
            unit="R$"
            hint={translate('pages>mysales>resale>info')}
          />
        </KpiRow>
      </div>
      {bankDetailsContext ? (
        <div className="pw-mt-5 pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[24px] sm:pw-pb-[20px] pw-bg-white pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)] pw-rounded-[10px] pw-overflow-hidden">
          <Disclosure>
            <Disclosure.Button className="pw-flex pw-w-full pw-items-center pw-justify-between">
              <div className="pw-flex max-sm:pw-flex-col pw-flex-row pw-text-left pw-gap-1">
                <p className="pw-text-black">
                  <b>{translate('pages>mysales>resale>bankDetails')}</b> -{' '}
                </p>
                <p className="pw-text-black">
                  {userContext?.data?.documents?.find(
                    (res: any) =>
                      res?.input?.attributeName === 'resalePixAddressKey'
                  )?.input?.label +
                    ': ' +
                    userContext?.data?.documents?.find(
                      (res: any) =>
                        res?.input?.attributeName === 'resalePixAddressKey'
                    )?.simpleValue}
                </p>
              </div>
              <div className="pw-w-[30px] pw-h-[30px] pw-flex  pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-rounded-full pw-cursor-pointer">
                <ArrowIcon style={{ stroke: 'black' }} />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel>
              <>
                <div className="pw-mt-2 pw-text-sm pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full">
                  {userContext?.data?.documents?.map((res: any) => {
                    return (
                      <div
                        key={res.id}
                        className="pw-text-sm pw-font-poppins pw-text-black pw-text-left pw-flex pw-flex-col pw-items-start pw-justify-center pw-w-full"
                      >
                        <h3 className="pw-font-semibold pw-mt-[14px]">
                          {res?.input?.label}
                        </h3>
                        <p className="pw-font-normal pw-break-all">
                          {res?.simpleValue
                            ? res?.simpleValue
                            : res?.complexValue?.home}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <BaseButton
                    link={{
                      href:
                        PixwayAppRoutes.COMPLETE_KYC +
                        `?contextSlug=bankdetails&userContextId=${userContext?.data?.id}` +
                        `${
                          userContext?.data?.status ===
                          UserContextStatus.Created
                            ? '&step=2'
                            : ''
                        }`,
                    }}
                    className="pw-mt-4 pw-w-max"
                  >
                    {translate('pages>mysales>resale>editDetails')}
                  </BaseButton>
                </div>
              </>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      ) : null}
      <div className="pw-text-black pw-mb-2">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="pw-mt-5 -pw-mb-[0.6px] pw-px-[20px] sm:pw-px-0">
            <Tab
              className={({ selected }) =>
                selected
                  ? 'pw-shadow-[0_-4px_6px_-2px_rgb(0_0_0_/_.1)] pw-p-2 pw-bg-white pw-rounded-t-lg pw-z-20 pw-border-b-0 pw-outline-none'
                  : 'pw-p-2 pw-outline-none pw-z-20 pw-opacity-50'
              }
            >
              {translate('pages>mysales>resale>sales')}
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? 'pw-shadow-[0_-4px_6px_-2px_rgb(0_0_0_/_.1)] pw-p-2 pw-bg-white pw-rounded-t-lg pw-z-20 pw-border-b-0 pw-outline-none'
                  : 'pw-p-2 pw-outline-none pw-z-20 pw-opacity-50'
              }
            >
              {translate('pages>mysales>resale>concludedSales')}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white sm:pw-shadow-md pw-shadow-[0_-4px_6px_-2px_rgb(0_0_0_/_.1)] pw-rounded-b-lg pw-rounded-r-lg pw-overflow-hidden">
              <div>
                {forSaleErc20?.data?.items?.length ? (
                  <div className="pw-flex pw-flex-col pw-gap-3">
                    <div>
                      {forSaleErc20?.data?.items?.map((res) => {
                        return (
                          <div
                            key={res?.id}
                            className="pw-flex pw-flex-col pw-gap-1 pw-max-w-[380px] pw-justify-center pw-items-center pw-border pw-border-[#c0c2c4] pw-rounded-lg pw-py-3 pw-px-4"
                          >
                            <div className="pw-flex pw-w-full pw-gap-x-3 pw-text-black">
                              <div className="pw-flex pw-flex-col pw-gap-1 pw-justify-center pw-w-[220px] pw-h-[76px] pw-border pw-border-[#B9D1F3] pw-rounded-lg pw-py-3 pw-px-4">
                                <p className="pw-text-sm pw-opacity-80 pw-whitespace-nowrap">
                                  {translate(
                                    'pages>mysales>resale>totalForSale'
                                  )}
                                </p>
                                {res?.tokenData?.currency?.symbol}{' '}
                                {res?.tokenData?.amount}
                              </div>
                              <div className="pw-flex pw-flex-col pw-gap-1 pw-justify-center pw-w-[220px] pw-h-[76px] pw-border pw-border-[#B9D1F3] pw-rounded-lg pw-py-3 pw-px-4">
                                <p className="pw-text-sm pw-opacity-80 pw-whitespace-nowrap">
                                  {translate('pages>mysales>resale>value')}
                                </p>
                                {'R$'}{' '}
                                {parseFloat(res?.prices?.[0]?.amount).toFixed(
                                  2
                                )}
                              </div>
                            </div>
                            <div className="pw-w-full pw-flex pw-justify-between pw-items-start pw-mt-6 pw-gap-4 pw-text-black">
                              <BaseButton
                                link={{
                                  href: `${PixwayAppRoutes.RESALE}?id=${erc20Product?.id}&edit=true`,
                                }}
                              >
                                {translate('pages>mysales>resale>editSale')}
                              </BaseButton>
                              {res?.tokenData?.amount !== '0' ? (
                                <BaseButton
                                  onClick={() =>
                                    deleteSale({
                                      productId: erc20Product?.id ?? '',
                                    })
                                  }
                                  variantType="secondary"
                                >
                                  {translate('pages>mysales>resale>removeSale')}
                                </BaseButton>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!hasBankDetails ? (
                      <Alert
                        className="pw-flex-col !pw-p-5 !pw-justify-start !pw-items-start pw-gap-3 pw-mt-1"
                        variant="warning"
                      >
                        <p>
                          {translate('pages>mysales>resale>fillBankDetails')}
                        </p>
                        <BaseButton
                          link={{
                            href:
                              PixwayAppRoutes.COMPLETE_KYC +
                              `?contextSlug=bankdetails`,
                          }}
                        >
                          {translate('pages>mysales>resale>fillData')}
                        </BaseButton>
                      </Alert>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {!hasBankDetails ? (
                      <Alert
                        className="pw-flex-col !pw-p-5 !pw-justify-start !pw-items-start pw-gap-3"
                        variant="warning"
                      >
                        <p>
                          {translate('pages>mysales>resale>fillBankDetails')}
                        </p>
                        <BaseButton
                          link={{
                            href:
                              PixwayAppRoutes.COMPLETE_KYC +
                              `?contextSlug=bankdetails`,
                          }}
                        >
                          {translate('pages>mysales>resale>fillData')}
                        </BaseButton>
                      </Alert>
                    ) : (
                      <BaseButton
                        link={{
                          href: `${PixwayAppRoutes.RESALE}?id=${erc20Product?.id}`,
                        }}
                        className="pw-w-max"
                      >
                        {translate('pages>mysales>resale>newsale')}
                      </BaseButton>
                    )}
                  </>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel className="max-sm:!pw-px-0 pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] sm:pw-bg-white pw-bg-inherit sm:pw-shadow-md pw-shadow-[0_-4px_6px_-2px_rgb(0_0_0_/_.1)] pw-rounded-lg pw-overflow-hidden">
              <MySalesListComponent />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </InternalPagesLayoutBase>
  );
};
