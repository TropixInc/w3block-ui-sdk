import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ImageSDK } from '../../../shared/components/ImageSDK';

interface ProductImage {
  assetId?: string;
  original?: string;
}

interface ProductImageGalleryProps {
  images?: ProductImage[];
  disableImageDisplay?: boolean;
}

const IMAGE_CLASS =
  'xl:pw-w-[500px] sm:pw-w-[400px] pw-w-[347px] pw-max-h-[437px] pw-rounded-[14px] pw-object-cover pw-object-center';

export const ProductImageGallery = ({
  images = [],
  disableImageDisplay,
}: ProductImageGalleryProps) => {
  if (disableImageDisplay || !images?.length) return null;

  if (images.length > 1) {
    return (
      <Swiper
        className="xl:pw-w-[500px] sm:pw-w-[400px] pw-w-[347px] pw-max-h-[437px]"
        modules={[Pagination]}
        pagination={{ clickable: true }}
      >
        {images.map((res) => (
          <SwiperSlide key={res.assetId}>
            <ImageSDK
              src={res?.original ?? ''}
              width={1200}
              quality="best"
              className={IMAGE_CLASS}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <ImageSDK
      src={images[0]?.original ?? ''}
      width={1200}
      quality="best"
      className={IMAGE_CLASS}
    />
  );
};
