import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';

import PendingIcon from '../../../shared/assets/icons/clock.svg?react';
import CopyIcon from '../../../shared/assets/icons/copyIcon.svg?react';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useGetProductsForResale } from '../../hooks/useGetProductsForResale';
import { useGuardPagesWithOptions } from '../../hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { useUserWallet } from '../../hooks/useUserWallet';
import { BaseButton } from '../Buttons';
import { CriptoValueComponent } from '../CriptoValueComponent/CriptoValueComponent';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';

export const MySales = () => {
  const { loyaltyWallet, mainWallet } = useUserWallet();
  const { data: productsResale } = useGetProductsForResale({});
  const [translate] = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);
  const [_, setCopy] = useCopyToClipboard();
  const copyAddress = (address: string) => {
    setCopied(true);
    setCopy(address || '');
    setTimeout(() => setCopied(false), 5000);
  };
  const loyaltyWalletDefined = useMemo(() => {
    return loyaltyWallet.length ? loyaltyWallet[0] : undefined;
  }, [loyaltyWallet]);

  const { defaultTheme } = UseThemeConfig();

  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;

  const hasErc20 = productsResale?.items?.some((res) => res.type === 'erc20');
  const erc20Product = productsResale?.items?.find(
    (res) => res.type === 'erc20'
  );
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
              {translate('pages>mysales>mysales')}
            </p>
            {!hideWallet ? (
              <div className="pw-flex pw-flex-col pw-gap-2">
                <div
                  onClick={() => copyAddress(mainWallet?.address || '')}
                  className="pw-flex pw-gap-x-1 pw-mt-1 pw-cursor-pointer"
                >
                  <p className="pw-text-xs pw-text-[#777E8F] pw-font-[400] pw-cursor-pointer">
                    {mainWallet?.address || '-'}
                  </p>
                  <CopyIcon />
                  {copied ? (
                    <div className="pw-relative">
                      <div className="pw-flex pw-items-center pw-mt-2 pw-gap-x-2 pw-absolute pw-bg-slate-300 pw-shadow-md pw-rounded-md pw-right-0 pw-top-3 pw-p-1">
                        <p className="pw-text-sm pw-text-[#353945]">
                          {translate('components>menu>copied')}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {loyaltyWalletDefined ? (
              <div className="pw-flex pw-flex-col pw-gap-2">
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
                {hasErc20 && erc20Product ? (
                  <BaseButton
                    link={{
                      href: `${PixwayAppRoutes.RESALE}?id=${erc20Product?.id}&batchSize=${erc20Product?.settings?.resaleConfig?.batchSize}`,
                    }}
                  >
                    {translate('pages>mysales>resale')}
                  </BaseButton>
                ) : null}
              </div>
            ) : null}
            <p className="pw-text-[#777E8F] pw-text-xs pw-flex pw-gap-1 pw-mt-2 pw-items-center">
              <PendingIcon className="pw-stroke-[#777E8F] pw-w-[12px] pw-h-[12px]" />
              {translate('dashboard>receiptQRCode>creditsTakeTwoHors')}
            </p>
          </div>
        </div>
      </div>
    </InternalPagesLayoutBase>
  );
};
