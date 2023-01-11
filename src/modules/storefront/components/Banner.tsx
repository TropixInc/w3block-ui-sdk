import { CSSProperties } from 'react';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { isImage, isVideo } from '../../shared/utils/validators';

export const Banner = ({ data }: { data: BannerProps }) => {
  const { slides, layout, ratio, autoSlide, slideStyle } = data;

  const layoutClass = layout === 'full_width' ? 'pw-w-full' : 'pw-container';

  return (
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
        {slides?.map((slide) => (
          <SwiperSlide key={slide.title}>
            <Slide
              data={{ ...slideStyle, ...slide }}
              ratioClassName={ratios[ratio]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export type BannerData = {
  type: 'banner';
  slides?: SlideContentData[];
} & Partial<BannerDefault>;

export type BannerDefault = {
  layout: Layout;
  ratio: Ratio;
  autoSlide: boolean;
  slideStyle: SlideContentDefault;
};

type BannerProps = Omit<BannerData & BannerDefault, 'type'>;

type Ratio = '20:9' | '16:9' | '3:1' | '4:1' | 'default';
type Layout = 'full_width' | 'fixed';

const Slide = ({
  data,
  ratioClassName,
}: {
  data: SlideContentData & SlideContentDefault;
  ratioClassName?: string;
}) => {
  const {
    titleColor,
    subtitleColor,
    bgColor,
    buttonBgColor,
    buttonTextColor,
    alignment,
    buttonHref,
    buttonHrefType,
    overlayColor,
    media,
    title,
    buttonText,
    subtitle,
  } = data;
  const rowAlignmentClass = rowAlignments[alignment];
  const columnAlignmentClass = columnAlignments[alignment];
  const alignmentTextClass = alignmentsText[alignment];

  const mediaType = guessMediaType(media || '');
  const bg =
    mediaType === 'no-media'
      ? bgColor
      : mediaType === 'image'
      ? `url('${media}')`
      : '';

  const overlayProp = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), ${overlayColor})`;
  const overlayBg = !overlayColor
    ? bg
    : mediaType === 'image'
    ? `${overlayProp}, ${bg}`
    : overlayProp;
  const videoClass = mediaType === 'video' && 'pw-absolute';

  return (
    <div
      style={{
        background: overlayBg,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }}
      className={`${ratioClassName} pw-font-poppins pw-flex ${rowAlignmentClass} pw-items-center`}
    >
      {mediaType === 'video' && (
        <>
          <ImageSDK
            src={media}
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
      )}

      <div
        className={`pw-h-max pw-flex pw-flex-col ${columnAlignmentClass} ${videoClass} pw-px-14 pw-py-8`}
      >
        <h2
          style={{ color: titleColor }}
          className={`${alignmentTextClass} pw-font-semibold pw-text-4xl`}
        >
          {title}
        </h2>
        <p style={{ color: subtitleColor }} className="pw-font-medium">
          {subtitle}
        </p>
        <button
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          className="pw-border-none pw-text-base pw-rounded-[60px] pw-px-4 pw-py-1"
          onClick={() => {
            const target = buttonHrefType === 'external' ? '_blank' : '_self';
            window.open(buttonHref, target)?.focus();
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

type SlideContentData = {
  media?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
} & Partial<SlideContentDefault>;

type SlideContentDefault = {
  bgColor: string;
  overlayColor: string;
  alignment: Alignment;
  titleColor: string;
  subtitleColor: string;
  buttonTextColor: string;
  buttonBgColor: string;
  buttonHrefType: 'internal' | 'external';
};

type Alignment = 'left' | 'center' | 'right';

const ratios: Record<BannerDefault['ratio'], string> = {
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
type AlignmentClassNameMap = Record<Alignment, string>;

const guessMediaType = (media: string) => {
  if (!media) return 'no-media';
  if (isImage(media)) return 'image';
  if (isVideo(media)) return 'video';
};
