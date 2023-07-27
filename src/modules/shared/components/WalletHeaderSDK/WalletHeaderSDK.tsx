import { CSSProperties, useState } from 'react';

import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as EyeIcon } from '../../../shared/assets/icons/eyeIcon.svg';
import { ReactComponent as EyeCrossedIcon } from '../../../shared/assets/icons/eyeIconCrossed.svg';
import { useUserWallet } from '../../hooks/useUserWallet';
import { WalletCard } from '../WalletCard/WalletCard';
export const WalletHeaderSDK = () => {
  const { mainWallet, wallets } = useUserWallet();
  const [showValue, setShowValue] = useState(true);
  const toggleShowValue = () => setShowValue(!showValue);
  const slicedBreakPoints = [
    { key: 0, value: { slidesPerView: 1, spaceBetween: 20 } },
    { key: 768, value: { slidesPerView: 2, spaceBetween: 20 } },
    { key: 1024, value: { slidesPerView: 3, spaceBetween: 20 } },
    {
      key: 1280,
      value: { slidesPerView: 3, spaceBetween: 20 },
    },
  ]
    .slice(0, 10)
    .reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
  return (
    <div className="pw-p-[20px] pw-mx-[22px] sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
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
      <div className="pw-mt-[24px]">
        <Swiper
          pagination={{
            clickable: true,
            dynamicBullets: true,
            horizontalClass: '!-pw-bottom-[20px]',
          }}
          autoplay={false}
          breakpoints={{ ...slicedBreakPoints }}
          modules={[Pagination]}
          style={
            {
              // '--swiper-pagination-color': '#F5F9FF',
              // '--swiper-navigation-color': '#F5F9FF',
              // '--swiper-pagination-bullet-inactive-color': '#F5F9FF4D',

              height: '100%',
              overflow: 'visible',
            } as CSSProperties
          }
        >
          {wallets?.map((wallet, index) => (
            <SwiperSlide key={index}>
              <WalletCard wallet={wallet} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
