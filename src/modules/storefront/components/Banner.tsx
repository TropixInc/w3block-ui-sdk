import { CSSProperties, lazy } from 'react';

import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

//import { ImageSDK } from '../../shared/components/ImageSDK';
const ImageSDK = lazy(() =>
  import('../../shared/components/ImageSDK').then((module) => ({
    default: module.ImageSDK,
  }))
);
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import {
  useBreakpoints,
  breakpointsEnum,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import useIsMobile from '../../shared/hooks/useIsMobile/useIsMobile';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { threathUrlCloudinary } from '../../shared/utils/threathUrlCloudinary';
import { isImage, isVideo } from '../../shared/utils/validators';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { AlignmentEnum, BannerData, SpecificBannerInfo } from '../interfaces';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDynamicApi } from '../provider/DynamicApiProvider';

import _ from 'lodash';

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
    height,
    heightUnity,
  } = mergedStyleData;
  const layoutClass =
    bannerDisposition === 'fullWidth' ? 'pw-w-full' : 'pw-container';

  const isMobile = useIsMobile();

  const bannerHeight = () => {
    if (height && !heightUnity) {
      return height + 'px';
    }
    if (height && heightUnity) {
      return height + heightUnity;
    } else {
      return '60vh';
    }
  };

  return (
    <TranslatableComponent>
      <div
        className={`${layoutClass} pw-mx-auto`}
        style={{
          margin: convertSpacingToCSS(margin),
          height: bannerHeight(),
          overflow: 'hidden',
        }}
      >
        <Swiper
          navigation
          pagination
          autoplay={
            autoSlide
              ? {
                  delay: 3500,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: isMobile,
                }
              : false
          }
          modules={[Navigation, Pagination, Autoplay]}
          style={
            {
              '--swiper-pagination-color': '#F5F9FF',
              '--swiper-navigation-color': '#F5F9FF',
              '--swiper-pagination-bullet-inactive-color': '#F5F9FF4D',
              height: '100%',
            } as CSSProperties
          }
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.title}>
              <Slide
                height={height}
                data={{ ...banner, padding }}
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
  height,
}: {
  data: SpecificBannerInfo;
  ratioClassName?: string;
  height?: string;
  layoutClass?: string;
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
    padding,
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
    titleFontFamily,
    titleFontSize,
    titleFontBold,
    titleFontItalic,
    titleFontSizeType,
    subtitleFontFamily,
    subtitleFontSize,
    subtitleFontBold,
    subtitleFontItalic,
    subtitleFontSizeType,
    sideImagePosition,
    sideImageHeight,
    sideImageWidth,
    sideImageUrl,
  } = data;
  const { isDynamic, datasource } = useDynamicApi();
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

  const bgUrlThreath = threathUrlCloudinary({
    src: bgUrl?.assetUrl ?? '',
    InternalProps: { width: 1440, quality: 'best' },
  });
  const bg = `${
    overlay && overlayColor
      ? `linear-gradient(${overlayColor},${overlayColor}),`
      : ''
  } url("${
    isDynamic
      ? _.get(datasource, bgUrl?.assetUrl ?? '', bgUrlThreath)
      : bgUrlThreath
  }") no-repeat center`;

  return (
    <a
      href={
        actionButton && buttonLink && buttonLink != '' ? buttonLink : undefined
      }
    >
      <div
        style={{
          backgroundSize: 'cover',
          backgroundColor: backgroundColor,
          background: bg,
          padding: convertSpacingToCSS(padding),
          height: height ? height + 'px' : '60vh',
        }}
        className={`${ratioClassName} !pw-bg-cover pw-h-full pw-w-full  `}
      >
        {isVideo(
          isDynamic
            ? _.get(datasource, bgUrl?.assetUrl ?? '', bgUrl?.assetUrl ?? '')
            : bgUrl?.assetUrl ?? ''
        ) && (
          <ImageSDK
            src={
              isDynamic
                ? _.get(
                    datasource,
                    bgUrl?.assetUrl ?? '',
                    bgUrl?.assetUrl ?? ''
                  )
                : bgUrl?.assetUrl ?? ''
            }
            className={`${ratioClassName} pw-w-full pw-absolute -pw-z-10 pw-object-cover`}
            width={1440}
            height={parseInt(height ?? '60')}
            quality="best"
          />
        )}
        {sideImageUrl && sideImageUrl.assetUrl ? (
          <div className=" pw-h-full pw-absolute pw-z-0 pw-w-full">
            <div className="pw-container pw-mx-auto pw-h-full">
              <div className={`pw-relative pw-h-full`}>
                <div
                  style={{
                    height: sideImageHeight ? sideImageHeight : 'auto',
                    width: sideImageWidth ? sideImageWidth : 'auto',
                    left:
                      sideImagePosition == 'left-bottom' ||
                      sideImagePosition == 'left-center' ||
                      sideImagePosition == 'left-top'
                        ? '0'
                        : sideImagePosition == 'center-bottom' ||
                          sideImagePosition == 'center-center' ||
                          sideImagePosition == 'center-top'
                        ? '50%'
                        : 'auto',
                    right:
                      sideImagePosition == 'right-bottom' ||
                      sideImagePosition == 'right-center' ||
                      sideImagePosition == 'right-top'
                        ? '0'
                        : 'auto',
                    top:
                      sideImagePosition == 'left-top' ||
                      sideImagePosition == 'right-top' ||
                      sideImagePosition == 'center-top'
                        ? '0'
                        : sideImagePosition == 'left-center' ||
                          sideImagePosition == 'right-center' ||
                          sideImagePosition == 'center-center'
                        ? '50%'
                        : 'auto',
                    bottom:
                      sideImagePosition == 'center-bottom' ||
                      sideImagePosition == 'left-bottom' ||
                      sideImagePosition == 'right-bottom'
                        ? '0'
                        : 'auto',
                    transform:
                      sideImagePosition == 'center-bottom' ||
                      sideImagePosition == 'center-top'
                        ? 'translateX(-50%)'
                        : sideImagePosition == 'left-center' ||
                          sideImagePosition == 'right-center'
                        ? 'translateY(-50%)'
                        : sideImagePosition == 'center-center'
                        ? 'translate(-50%, -50%)'
                        : 'none',
                  }}
                  className="pw-absolute pw-top-0 pw-left-0 pw-w-full pw-h-full"
                >
                  <ImageSDK
                    src={
                      isDynamic
                        ? _.get(
                            datasource,
                            sideImageUrl?.assetUrl ?? '',
                            sideImageUrl?.assetUrl ?? ''
                          )
                        : sideImageUrl?.assetUrl ?? ''
                    }
                    className={`pw-object-contain pw-h-full pw-w-full`}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div
          className={`pw-flex ${rowAlignmentClass} pw-absolute pw-items-center pw-h-full pw-w-full pw-z-10`}
        >
          <div
            className={`pw-h-max pw-flex pw-flex-col pw-px-4 sm:pw-px-0 ${columnAlignmentClass} pw-container pw-mx-auto pw-py-8 pw-w-full`}
          >
            <h2
              style={{
                color: titleColor ?? 'white',
                fontFamily: titleFontFamily ?? '',
                fontSize:
                  titleFontSize && titleFontSize != '' && titleFontSize != '0'
                    ? titleFontSize +
                      (titleFontSizeType == 'rem' ? 'rem' : 'px')
                    : '',
                fontWeight:
                  titleFontBold != undefined
                    ? titleFontBold
                      ? 'bold'
                      : 'normal'
                    : 'bold',
                fontStyle: titleFontItalic ? 'italic' : 'normal',
                lineHeight:
                  titleFontSize &&
                  titleFontSize != '' &&
                  titleFontSize != '0' &&
                  titleFontSizeType != 'rem'
                    ? (
                        parseInt(titleFontSize) -
                        parseInt(titleFontSize) * 0.05
                      ).toFixed(0) + 'px'
                    : 'auto',
              }}
              className={`${alignmentTextClass} pw-font-semibold pw-text-[36px] pw-max-w-[550px]`}
            >
              {_.get(datasource, title ?? '', title)}
            </h2>
            <p
              style={{
                color: subtitleColor ?? 'white',
                fontFamily: subtitleFontFamily ?? '',
                fontSize:
                  subtitleFontSize &&
                  subtitleFontSize != '' &&
                  subtitleFontSize != '0'
                    ? subtitleFontSize +
                      (subtitleFontSizeType == 'rem' ? 'rem' : 'px')
                    : '',
                fontWeight: subtitleFontBold ? 'bold' : 'normal',
                fontStyle: subtitleFontItalic ? 'italic' : 'normal',
                lineHeight:
                  subtitleFontSize &&
                  subtitleFontSize != '' &&
                  subtitleFontSize != '0' &&
                  subtitleFontSizeType != 'rem'
                    ? (
                        parseInt(subtitleFontSize) -
                        parseInt(subtitleFontSize) * 0.05
                      ).toFixed(0) + 'px'
                    : 'auto',
              }}
              className={` ${alignmentTextClass} pw-font-medium text-xs pw-mt-4 pw-max-w-[450px]`}
            >
              {_.get(datasource, subtitle ?? '', subtitle)}
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
                  href={_.get(datasource, buttonLink ?? '', buttonLink)}
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
                  className="pw-font-bold pw-text-xs pw-rounded-[60px] pw-px-4 pw-py-2 pw-mt-6 pw-cursor-pointer pw-z-20"
                  href={_.get(
                    datasource,
                    secondaryButtonLink ?? '',
                    secondaryButtonLink
                  )}
                >
                  {secondaryButtonText ?? 'Saiba mais'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
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
