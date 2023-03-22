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
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';

export const Banner = ({ data }: { data: BannerData }) => {
  const { styleData, mobileStyleData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    autoSlide,
    banners,
    bannerDisposition,
    bannerRatio,
    margin,
    padding,
  } = mergedStyleData;
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
    backgroundUrlMobile,
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
    buttonBorderColor,
    secondaryButtonBorderColor,
  } = data;
  const rowAlignmentClass = rowAlignments[textAligment ?? AlignmentEnum.LEFT];
  const columnAlignmentClass =
    columnAlignments[textAligment ?? AlignmentEnum.LEFT];
  const alignmentTextClass = alignmentsText[textAligment ?? AlignmentEnum.LEFT];
  const breakpoint = useBreakpoints();
  const bgUrl =
    backgroundUrlMobile &&
    (breakpoint == breakpointsEnum.SM || breakpoint == breakpointsEnum.XS)
      ? backgroundUrlMobile
      : backgroundUrl;
  const bg = `${
    overlay && overlayColor
      ? `linear-gradient(${overlayColor},${overlayColor}),`
      : ''
  } url("${bgUrl?.assetUrl}") no-repeat center`;

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundColor: backgroundColor,
        background: bg,
      }}
      className={`${ratioClassName} !pw-bg-cover  pw-flex ${rowAlignmentClass} pw-items-center`}
    >
      {isVideo(bgUrl?.assetUrl ?? '') && (
        <ImageSDK
          src={bgUrl?.assetUrl}
          className={`${ratioClassName} pw-w-full pw-absolute -pw-z-10 pw-object-cover`}
        />
      )}
      <div
        className={`pw-h-max pw-flex pw-flex-col pw-px-4 sm:pw-px-0 ${columnAlignmentClass} pw-container pw-mx-auto pw-py-8`}
      >
        <h2
          style={{ color: titleColor ?? 'white' }}
          className={`${alignmentTextClass} pw-font-semibold pw-text-4xl pw-max-w-[550px]`}
        >
          {title}
        </h2>
        <p
          style={{ color: subtitleColor ?? 'white' }}
          className={` ${alignmentTextClass} pw-font-medium text-xs pw-mt-4 pw-max-w-[450px]`}
        >
          {subtitle}
        </p>

        <div className="pw-flex pw-gap-4">
          {actionButton && (
            <a
              style={{
                backgroundColor: buttonColor ?? 'white',
                color: buttonTextColor,
                borderColor: buttonBorderColor ?? 'transparent',
                borderWidth: buttonBorderColor ? '2px' : '0',
              }}
              className=" pw-font-bold pw-text-xs pw-rounded-[60px] pw-px-4 pw-py-2 pw-mt-6 pw-cursor-pointer"
              href={buttonLink}
              target="_blank"
              rel="noreferrer"
            >
              {buttonText ?? 'Saiba mais'}
            </a>
          )}
          {secondaryActionButton && (
            <a
              style={{
                backgroundColor: secondaryButtonColor ?? 'white',
                color: secondaryButtonTextColor,
                borderColor: secondaryButtonBorderColor ?? 'transparent',
                borderWidth: secondaryButtonBorderColor ? '2px' : '0',
              }}
              className=" pw-font-bold pw-text-xs pw-rounded-[60px] pw-px-4 pw-py-2 pw-mt-6 pw-cursor-pointer"
              href={secondaryButtonLink}
              target="_blank"
              rel="noreferrer"
            >
              {secondaryButtonText ?? 'Saiba mais'}
            </a>
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
