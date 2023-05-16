import { CSSProperties } from 'react';

import { ImageSDK } from '../../shared/components/ImageSDK';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { ImagePlusTextData } from '../interfaces';

import './ImagePlusText.css';

export const ImagePlusText = ({ data }: { data: ImagePlusTextData }) => {
  const { styleData, contentData, mobileStyleData, mobileContentData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );
  const mergedContentData = useMobilePreferenceDataWhenMobile(
    contentData,
    mobileContentData
  );

  const {
    image,
    imagePosition,
    textAlignment,
    titleColor,
    contentColor,
    margin,
    padding,
    backgroundUrl,
    backgroundSession,
    backgroundColor,
    overlay,
    overlayColor,
  } = mergedStyleData;

  const { title, content } = mergedContentData;

  const isImageOnLeft = imagePosition === 'left' || imagePosition === undefined;

  return (
    <div
      style={{
        background:
          backgroundSession && backgroundUrl
            ? `${
                overlay
                  ? `linear-gradient(${overlayColor},${overlayColor}),`
                  : ''
              } url('${backgroundUrl?.assetUrl}') `
            : '',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backgroundColor ?? 'rgba(255,255,255,0)',
      }}
      className="pw-w-full"
    >
      <div className="pw-container pw-mx-auto">
        <div
          className="pw-flex pw-gap-8 image-plus-text"
          style={
            {
              '--image-plus-text-direction-mobile': isImageOnLeft
                ? 'column'
                : 'column-reverse',
              '--image-plus-text-direction-desktop': isImageOnLeft
                ? 'row'
                : 'row-reverse',
              margin: convertSpacingToCSS(margin),
              padding: convertSpacingToCSS(padding),
            } as CSSProperties
          }
        >
          <div className="pw-grid pw-place-items-center">
            <ImageSDK
              src={image?.assetUrl}
              className="pw-max-w-[260px] pw-max-h-[274px] pw-rounded-lg"
              width={500}
              quality="eco"
            />
          </div>

          <div
            style={{ textAlign: textAlignment }}
            className="pw-px-2 sm:pw-px-0 pw-flex-1"
          >
            <h3
              style={{ color: titleColor }}
              className="pw-font-semibold pw-text-[19px]"
            >
              {title}
            </h3>
            <div
              style={{ color: contentColor }}
              className="pw-text-[15px]"
              dangerouslySetInnerHTML={{ __html: content ?? '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
