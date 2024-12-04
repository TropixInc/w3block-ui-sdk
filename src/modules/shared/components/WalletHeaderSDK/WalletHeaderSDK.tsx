/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, lazy } from 'react';

import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useUserWallet } from '../../hooks/useUserWallet';
import { generateRandomUUID } from '../../utils/generateRamdomUUID';
import { useGetRightWallet } from '../../utils/getRightWallet';
const WalletCard = lazy(() =>
  import('../WalletCard/WalletCard').then((module) => ({
    default: module.WalletCard,
  }))
);

export const WalletHeaderSDK = ({ title = 'Carteira' }: { title?: string }) => {
  const { mainWallet } = useUserWallet();
  const organizedLoyalties = useGetRightWallet();
  const { defaultTheme } = UseThemeConfig();
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
            <p className="pw-text-[#777E8F] pw-text-xs">
              {mainWallet?.address}
            </p>
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
