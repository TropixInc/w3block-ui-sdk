/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, lazy, useState } from 'react';

import { useCopyToClipboard } from 'react-use';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useUserWallet } from '../hooks/useUserWallet/useUserWallet';
import { generateRandomUUID } from '../utils/generateRamdomUUID';
import { useGetRightWallet } from '../utils/getRightWallet';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import CopyIcon from '../assets/icons/copyIcon.svg';
import { WalletCard } from './WalletCard';
import useTranslation from '../hooks/useTranslation';



export const WalletHeaderSDK = ({ title = 'Carteira' }: { title?: string }) => {
  const { mainWallet } = useUserWallet();
  const [translate] = useTranslation();
  const organizedLoyalties = useGetRightWallet();
  const { defaultTheme } = useThemeConfig();
  const [copied, setCopied] = useState<boolean>(false);
  const [_, setCopy] = useCopyToClipboard();
  const copyAddress = (address: string) => {
    setCopied(true);
    setCopy(address || '');
    setTimeout(() => setCopied(false), 5000);
  };
  const hideLoyaltyAuthentication =
    defaultTheme?.configurations?.contentData?.hideLoyaltyAuthentication;
  const hideWallet =
    defaultTheme?.configurations?.contentData?.hideWalletAddress;
  const showTransferButton =
    defaultTheme?.configurations?.contentData?.walletTransfer?.enabled;
  return (
    <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
      <div className="pw-flex pw-justify-between">
        <div>
          <p className="pw-text-[23px] pw-font-[600]">{title}</p>
          {!hideWallet ? (
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
          ) : null}
        </div>
      </div>
      {organizedLoyalties.length > 0 &&
      organizedLoyalties.filter(
        (wallet) =>
          (wallet.balance && parseFloat(wallet?.balance ?? '0') > 0) ||
          (wallet.type !== 'vault' && wallet.type !== 'metamask')
      ).length > 0 ? (
        <div className="pw-mt-[24px] pw-max-w-[98%]">
          <Swiper
            pagination={{
              clickable: true,
              dynamicBullets: true,
              horizontalClass: '!-pw-bottom-[20px]',
            }}
            spaceBetween={16}
            autoplay={false}
            breakpoints={{
              0: { slidesPerView: 1 },
              440: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
              1306: { slidesPerView: 5 },
            }}
            modules={[Pagination]}
            style={
              {
                // '--swiper-pagination-color': '#F5F9FF',
                // '--swiper-navigation-color': '#F5F9FF',
                // '--swiper-pagination-bullet-inactive-color': '#F5F9FF4D',

                height: '100%',
                maxWidth: '100%',
                overflowX: 'hidden',
                overflow: 'visible',
                justifyContent: 'flex-start',
                '&.swiper-slide': {
                  width: 'auto',
                },
              } as CSSProperties
            }
          >
            {organizedLoyalties
              ?.filter(
                (wallet) =>
                  (wallet.balance && parseFloat(wallet?.balance ?? '0') > 0) ||
                  (wallet.type !== 'vault' && wallet.type !== 'metamask')
              )
              .map((wallet) => (
                <SwiperSlide
                  style={{ width: 'auto' }}
                  key={generateRandomUUID()}
                >
                  <WalletCard
                    address={wallet.address}
                    pointsPrecision={wallet?.pointsPrecision}
                    image={wallet?.image}
                    balance={wallet?.balance ?? '0'}
                    type={wallet?.type as any}
                    currency={wallet?.currency}
                    chainId={wallet?.chainId}
                    hideLoyaltyAuthentication={hideLoyaltyAuthentication}
                    showTransferButton={showTransferButton}
                  />{' '}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      ) : null}
    </div>
  );
};
