import { CSSProperties, lazy, useMemo } from 'react';

import _ from 'lodash';


import classNames from 'classnames';
import { ImagePlusTextData } from '../interfaces/Theme';
import { useDynamicApi } from '../provider/DynamicApiProvider';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData';
import { useDynamicString } from '../hooks/useDynamicString';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { ImageSDK } from '../../shared/components/ImageSDK';


export const ImagePlusText = ({ data }: { data: ImagePlusTextData }) => {
  const { datasource } = useDynamicApi();
  const isMobile = useIsMobile();
  const { styleData, contentData, mobileStyleData, mobileContentData, id } =
    data;

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
    imageClass,
    imageContainerClass,
    containerClass,
    imageCompression,
    imageSize,
  } = mergedStyleData;

  const { title: titleInput, content: contentInput } = mergedContentData;
  const { text: title } = useDynamicString(titleInput);
  const { text: content } = useDynamicString(contentInput);

  const isImageOnLeft = imagePosition === 'left' || imagePosition === undefined;

  const imgClassSize = useMemo(() => {
    if (isMobile) {
      return '100%';
    } else {
      if (imageSize) {
        return `${imageSize}%`;
      } else {
        return '260px';
      }
    }
  }, [imageSize, isMobile]);

  return (
    <div
      id={`sf-${id}`}
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
          className={`${containerClass ?? 'pw-gap-8'} pw-flex image-plus-text`}
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
          <div
            className={classNames(
              'pw-place-items-center',
              imageContainerClass ?? ''
            )}
            style={{ width: imgClassSize }}
          >
            <ImageSDK
              src={_.get(datasource, image?.assetUrl ?? '', image?.assetUrl)}
              className={imageClass ?? 'pw-w-full pw-rounded-lg'}
              quality={imageCompression}
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
              className="pw-prose-sm dangerouslyHTML"
              dangerouslySetInnerHTML={{
                __html: content ?? '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
