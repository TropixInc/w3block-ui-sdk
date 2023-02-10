import { CSSProperties } from 'react';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ImageSDK } from '../../shared/components/ImageSDK';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { isImage, isVideo } from '../../shared/utils/validators';
import { AlignmentEnum, BannerData, SpecificBannerInfo } from '../interfaces';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Banner = ({ data }: { data: BannerData }) => {
  const {
    styleData: { autoSlide, banners, bannerDisposition, bannerRatio },
  } = data;
  const layoutClass =
    bannerDisposition === 'fullWidth' ? 'pw-w-full' : 'pw-container';

  return (
    <TranslatableComponent>
      <div className={`${layoutClass} pw-mx-auto`}>
        <Swiper
          navigation
          pagination
          autoplay={autoSlide ? { delay: 2500 } : false}
          modules={[Navigation, Pagination]}
          style={
            {
              '--swiper-pagination-color': '#F5F9FF',
              '--swiper-navigation-color': '#F5F9FF',
              '--swiper-pagination-bullet-inactive-color': '#F5F9FF4D',
            } as CSSProperties
          }
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.title}>
              <Slide
                data={banner}
                ratioClassName={ratios[bannerRatio ?? 'default']}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </TranslatableComponent>
  );
};

const Slide = ({
  data,
  ratioClassName,
}: {
  data: SpecificBannerInfo;
  ratioClassName?: string;
}) => {
  const {
    titleColor,
    subtitleColor,
    backgroundColor,
    buttonColor,
    buttonTextColor,
    textAligment,
    buttonLink,
    overlayColor,
    backgroundUrl,
    title,
    buttonText,
    actionButton,
    subtitle,
  } = data;
  const rowAlignmentClass = rowAlignments[textAligment ?? AlignmentEnum.LEFT];
  const columnAlignmentClass =
    columnAlignments[textAligment ?? AlignmentEnum.LEFT];
  const alignmentTextClass = alignmentsText[textAligment ?? AlignmentEnum.LEFT];

  const mediaType = guessMediaType(backgroundUrl?.assetUrl || '');
  let bg = '';
  if (mediaType === 'no-media') {
    bg = backgroundColor ?? '';
  } else if (mediaType === 'image' || !mediaType) {
    bg = `url('${backgroundUrl}')`;
  }

  const overlayProp = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), ${overlayColor})`;

  let overlayBg = bg;
  if (mediaType === 'image') {
    overlayBg = `${overlayProp}, ${bg}`;
  } else if (mediaType === 'video') {
    overlayBg = overlayProp;
  }

  const videoClass =
    mediaType === 'video' || mediaType === 'image' ? 'pw-absolute' : '';

  return (
    <div
      style={{
        backgroundImage: overlayBg,
        backgroundPosition: 'center',
        backgroundColor: backgroundColor,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className={`${ratioClassName} pw-font-poppins pw-flex ${rowAlignmentClass} pw-items-center`}
    >
      {mediaType === 'video' || mediaType === 'image' ? (
        <>
          <ImageSDK
            src={backgroundUrl?.assetUrl}
            className={`${ratioClassName} pw-w-full pw-bg-black`}
          />
          <div
            style={{
              background: overlayBg,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }}
            className={`pw-w-full pw-h-full pw-absolute`}
          ></div>
        </>
      ) : null}

      <div
        className={`pw-h-max pw-flex pw-flex-col pw-container pw-mx-auto ${columnAlignmentClass} ${videoClass} pw-py-8`}
      >
        <h2
          style={{ color: titleColor ?? 'white' }}
          className={`${alignmentTextClass} pw-font-poppins pw-font-semibold pw-text-4xl pw-max-w-[400px]`}
        >
          {title}
        </h2>
        <p
          style={{ color: subtitleColor ?? 'white' }}
          className={` ${alignmentTextClass} pw-font-medium text-xs pw-font-poppins pw-mt-4 pw-max-w-[230px]`}
        >
          {subtitle}
        </p>
        {actionButton && (
          <button
            style={{
              backgroundColor: buttonColor ?? 'white',
              color: buttonTextColor,
            }}
            className="pw-border-none pw-font-bold pw-text-xs pw-rounded-[60px] pw-px-4 pw-py-2 pw-mt-6"
            onClick={() => {
              const target = '_blank';
              window.open(buttonLink, target)?.focus();
            }}
          >
            {buttonText ?? 'Saiba mais'}
          </button>
        )}
      </div>
    </div>
  );
};

const ratios: Record<string, string> = {
  default: 'pw-aspect-[20/9]',
  '4:1': 'pw-aspect-[4/1]',
  '3:1': 'pw-aspect-[3/1]',
  '16:9': 'pw-aspect-video',
  '20:9': 'pw-aspect-[20/9]',
};

const rowAlignments: AlignmentClassNameMap = {
  left: 'pw-justify-start',
  right: 'pw-justify-end',
  center: 'pw-justify-center',
};
const columnAlignments: AlignmentClassNameMap = {
  left: 'pw-items-start',
  right: 'pw-items-end',
  center: 'pw-items-center',
};
const alignmentsText: AlignmentClassNameMap = {
  left: 'pw-text-left',
  right: 'pw-text-right',
  center: 'pw-text-center',
};
type AlignmentClassNameMap = Record<AlignmentEnum, string>;

export const guessMediaType = (media: string) => {
  if (!media) return 'no-media';
  if (isImage(media)) return 'image';
  if (isVideo(media)) return 'video';
};
