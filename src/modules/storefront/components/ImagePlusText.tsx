import { CSSProperties } from 'react';

import { ImageSDK } from '../../shared/components/ImageSDK';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { ImagePlusTextData } from '../interfaces';

import './ImagePlusText.css';

export const ImagePlusText = ({ data }: { data: ImagePlusTextData }) => {
  const { styleData, contentData } = data;
  const {
    image,
    imagePosition,
    textAlignment,
    titleColor,
    contentColor,
    margin,
    padding,
  } = styleData;

  return (
    <div className="pw-w-full">
      <div className="pw-container pw-mx-auto">
        <div
          className="pw-flex pw-gap-8 image-plus-text"
          style={
            {
              '--image-plus-text-direction-mobile':
                imagePosition === 'left' ? 'column' : 'column-reverse',
              '--image-plus-text-direction-desktop':
                imagePosition === 'left' ? 'row' : 'row-reverse',
              margin: convertSpacingToCSS(margin),
              padding: convertSpacingToCSS(padding),
            } as CSSProperties
          }
        >
          <div className="pw-grid pw-place-items-center">
            <ImageSDK
              src={image?.assetUrl}
              className="pw-max-w-[260px] pw-max-h-[274px] pw-rounded-lg"
            />
          </div>

          <div
            style={{ textAlign: textAlignment }}
            className="pw-px-2 sm:pw-px-0"
          >
            <h3
              style={{ color: titleColor }}
              className="pw-font-semibold pw-text-[19px]"
            >
              {contentData.title}
            </h3>
            <p style={{ color: contentColor }} className="pw-text-[15px]">
              {contentData.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
