import { CSSProperties } from 'react';

import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useUserWallet } from '../../hooks/useUserWallet';
import { generateRandomUUID } from '../../utils/generateRamdomUUID';
import { useGetRightWallet } from '../../utils/getRightWallet';
import { WalletCard } from '../WalletCard/WalletCard';

export const WalletHeaderSDK = () => {
  const { mainWallet } = useUserWallet();
  const organizedLoyalties = useGetRightWallet();

  return (
    <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
      <div className="pw-flex pw-justify-between">
        <div>
          <p className="pw-text-[23px] pw-font-[600]">Carteira</p>
          <p className="pw-text-[#777E8F] pw-text-xs">{mainWallet?.address}</p>
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
          {organizedLoyalties?.map((wallet) => (
            <SwiperSlide style={{ width: 'auto' }} key={generateRandomUUID()}>
              <WalletCard
                balance={wallet?.balance ?? '0'}
                type={wallet?.type as any}
                currency={wallet?.currency}
                chainId={wallet?.chainId}
              />{' '}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
