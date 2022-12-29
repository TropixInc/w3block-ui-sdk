import { CSSProperties } from 'react';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import {
  BannerData,
  BannerDefault,
  SlideContentData,
  SlideContentDefault,
} from '../interfaces';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Banner = ({
  data,
  defaultData,
}: {
  data: BannerData;
  defaultData: BannerDefault;
}) => {
  const slides = data.slides;
  const layout = data.layout || defaultData.layout;
  const ratio = data.ratio || defaultData.ratio;

  const layoutClass = layout === 'full_width' ? 'pw-w-full' : 'pw-container';
  const aspectRatioClass = ratios[ratio];

  return (
    <div className={`${layoutClass} pw-mx-auto`}>
      <Swiper
        navigation
        pagination
        modules={[Navigation, Pagination]}
        style={
          {
            '--swiper-pagination-color': '#F5F9FF',
            '--swiper-navigation-color': '#F5F9FF',
            '--swiper-pagination-bullet-inactive-color': '#F5F9FF4D',
          } as CSSProperties
        }
      >
        {slides?.map((s) => (
          <SwiperSlide key={JSON.stringify(s)}>
            <Slide
              content={s}
              defaultContent={defaultData.slides}
              ratioClassName={aspectRatioClass}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const Slide = ({
  content,
  defaultContent,
  ratioClassName,
}: {
  content: SlideContentData;
  defaultContent: SlideContentDefault;
  ratioClassName: string;
}) => {
  const titleColor = content.titleColor || defaultContent.titleColor;
  const subtitleColor = content.subtitleColor || defaultContent.subtitleColor;
  const bgColor = content.bgColor || defaultContent.bgColor;
  const buttonBgColor =
    content.button?.bgColor || defaultContent.button.bgColor;
  const buttonTextColor =
    content.button?.textColor || defaultContent.button.textColor;
  const alignment = content.alignment || defaultContent.alignment;
  const rowAlignmentClass = rowAlignments[alignment];
  const columnAlignmentClass = columnAlignments[alignment];
  const alignmentTextClass = alignmentsText[alignment];
  const href = content.button?.href;
  const hrefType = content.button?.hrefType || defaultContent.button.hrefType;
  const overlay = content.overlayColor || defaultContent.overlayColor;

  const mediaType = guessMediaType(content.media || '');
  const bg =
    mediaType === 'no-media'
      ? bgColor
      : mediaType === 'image'
      ? `url('${content.media}')`
      : '';

  const overlayProp = `linear-gradient(0deg, rgba(0, 0, 0, 0.5), ${overlay})`;
  const overlayBg = !overlay
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
          <video
            src={content.media}
            className={`${ratioClassName} pw-w-full pw-bg-black`}
            autoPlay
            playsInline
            muted
            loop
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
          {content.title}
        </h2>
        <p style={{ color: subtitleColor }} className="pw-font-medium">
          {content.subtitle}
        </p>
        <button
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          className="pw-border-none pw-text-base pw-rounded-[60px] pw-px-4 pw-py-1"
          onClick={() => {
            const target = hrefType === 'external' ? '_blank' : '_self';
            window.open(href, target)?.focus();
          }}
        >
          {content.button?.text}
        </button>
      </div>
    </div>
  );
};

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
type AlignmentClassNameMap = Record<
  BannerDefault['slides']['alignment'],
  string
>;

const guessMediaType = (media: string) => {
  if (!media) return 'no-media';
  if (media.includes('.mp4')) return 'video';
  return 'image';
};
