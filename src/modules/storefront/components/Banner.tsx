import { CSSProperties } from 'react';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { isImage, isVideo } from '../../shared/utils/validators';
import { AlignmentEnum, BannerData, SpecificBannerInfo } from '../interfaces';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';

export const Banner = ({ data }: { data: BannerData }) => {
  const {
    styleData: {
      autoSlide,
      banners,
      bannerDisposition,
      bannerRatio,
      margin,
      padding,
    },
  } = data;
  const layoutClass =
    bannerDisposition === 'fullWidth' ? 'pw-w-full' : 'pw-container';

  return (
    <TranslatableComponent>
      <div
        className={`${layoutClass} pw-mx-auto`}
        style={{
          margin: convertSpacingToCSS(margin),
          padding: convertSpacingToCSS(padding),
        }}
      >
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
    overlay,
    buttonText,
    actionButton,
    subtitle,
    secondaryActionButton,
    secondaryButtonText,
    secondaryButtonLink,
    secondaryButtonTextColor,
    secondaryButtonColor,
  } = data;
  const rowAlignmentClass = rowAlignments[textAligment ?? AlignmentEnum.LEFT];
  const columnAlignmentClass =
    columnAlignments[textAligment ?? AlignmentEnum.LEFT];
  const alignmentTextClass = alignmentsText[textAligment ?? AlignmentEnum.LEFT];

  return (
    <div
      style={{
        background: `${
          overlay ? `linear-gradient(${overlayColor},${overlayColor})` : ''
        }, url('${backgroundUrl?.assetUrl}') `,
        backgroundPosition: 'center',
        backgroundColor: backgroundColor ?? '',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className={`${ratioClassName} pw-font-poppins pw-flex ${rowAlignmentClass} pw-items-center`}
    >
      <div
        className={`pw-h-max pw-flex pw-flex-col pw-px-4 sm:pw-px-0 ${columnAlignmentClass} pw-container pw-mx-auto pw-py-8`}
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

        <div className="pw-flex pw-gap-4">
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
          {secondaryActionButton && (
            <button
              style={{
                backgroundColor: secondaryButtonColor ?? 'white',
                color: secondaryButtonTextColor,
              }}
              className="pw-border-none pw-font-bold pw-text-xs pw-rounded-[60px] pw-px-4 pw-py-2 pw-mt-6"
              onClick={() => {
                const target = '_blank';
                window.open(secondaryButtonLink, target)?.focus();
              }}
            >
              {secondaryButtonText ?? 'Saiba mais'}
            </button>
          )}
        </div>
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
