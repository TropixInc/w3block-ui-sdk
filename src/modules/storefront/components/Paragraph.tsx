import classNames from 'classnames';
import _ from 'lodash';

import { ImageSDK } from '../../shared/components/ImageSDK';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { AlignmentEnum, ParagraphData } from '../interfaces';
import { useDynamicApi } from '../provider/DynamicApiProvider';

const alignmentsText: AlignmentClassNameMap = {
  left: 'pw-text-left',
  right: 'pw-text-right',
  center: 'pw-text-center',
};
type AlignmentClassNameMap = Record<AlignmentEnum, string>;

export const Paragraph = ({ data }: { data: ParagraphData }) => {
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
    alignment,
    textColor,
    titleColor,
    margin,
    padding,
    titleFontFamily,
    titleSize,
    titleUnit,
    textFontFamily,
    textSize,
    textUnit,
    image,
  } = mergedStyleData;
  const { textInput, titleInput } = mergedContentData;

  const alignmentTextClass = alignmentsText[alignment ?? AlignmentEnum.LEFT];

  const { isDynamic, datasource, loading } = useDynamicApi();

  return (
    <div className="pw-container pw-mx-auto pw-flex pw-items-start pw-gap-2">
      {image?.assetUrl ? (
        <div className="pw-grid pw-place-items-center pw-mt-1 pw-min-w-[35px]">
          <ImageSDK
            src={_.get(datasource, image?.assetUrl ?? '', image?.assetUrl)}
            width={35}
            height={35}
          />
        </div>
      ) : null}
      <div
        style={{
          margin: convertSpacingToCSS(margin),
          padding: convertSpacingToCSS(padding),
        }}
      >
        <h2
          style={{
            color: titleColor ?? 'black',
            fontSize: `${titleSize ?? 18}${titleUnit ?? 'px'}`,
            fontFamily: titleFontFamily ?? "Poppins, 'sans-serif'",
          }}
          className={classNames('pw-font-semibold')}
        >
          {isDynamic
            ? loading
              ? ''
              : _.get(datasource, titleInput ?? '', '')
            : titleInput}
        </h2>
        <div
          style={{
            color: textColor ?? 'black',
            fontFamily: textFontFamily ?? "Poppins, 'sans-serif'",
            fontSize: `${textSize ?? 14}${textUnit ?? 'px'}`,
          }}
          className={classNames(alignmentTextClass, 'pw-text-sm pw-mt-4')}
          dangerouslySetInnerHTML={{
            __html: loading
              ? ''
              : _.get(datasource, textInput ?? '', textInput ?? ''),
          }}
        />
      </div>
    </div>
  );
};
