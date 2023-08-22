import { CSSProperties, useState } from 'react';

import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as EyeIcon } from '../../../shared/assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { useUserWallet } from '../../hooks/useUserWallet';
import { generateRandomUUID } from '../../utils/generateRamdomUUID';
import { WalletCard } from '../WalletCard/WalletCard';
export const WalletHeaderSDK = () => {
  const { mainWallet, wallets, loyaltyWallet } = useUserWallet();
  const [showValue, setShowValue] = useState(true);
  const toggleShowValue = () => setShowValue(!showValue);

  return (
    <div className="pw-p-[20px] pw-mx-[22px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
      <div className="pw-flex pw-justify-between">
        <div>
          <p className="pw-text-[23px] pw-font-[600]">Carteira</p>
          <p className="pw-text-[#777E8F] pw-text-xs">{mainWallet?.address}</p>
        </div>

        <div
          className="pw-w-[33px] pw-h-[33px] pw-border-2 pw-border-[#353945] pw-rounded-full pw-cursor-pointer pw-flex pw-justify-center pw-items-center"
          onClick={() => toggleShowValue()}
        >
          {showValue ? (
            <EyeIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
          ) : (
            <EyeCrossedIcon className="pw-stroke-brand-primary pw-w-4 sm:pw-w-auto" />
          )}
        </div>
      </div>
      <div className="pw-mt-[24px] pw-max-w-[98%]">
        <Swiper
          slidesPerView={'auto'}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            horizontalClass: '!-pw-bottom-[20px]',
          }}
          spaceBetween={16}
          autoplay={false}
          //breakpoints={{ ...slicedBreakPoints }}
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
          {loyaltyWallet?.map((wallet) => (
            <SwiperSlide style={{ width: 'auto' }} key={generateRandomUUID()}>
              <WalletCard
                balance={wallet.balance}
                type="loyalty"
                currency={wallet.currency}
              />
            </SwiperSlide>
          ))}
          {wallets?.map((wallet) => (
            <SwiperSlide style={{ width: 'auto' }} key={generateRandomUUID()}>
              <WalletCard
                chainId={wallet.chainId}
                balance={wallet.balance}
                type={wallet.type}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
