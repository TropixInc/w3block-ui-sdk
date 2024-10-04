import classNames from 'classnames';
import _ from 'lodash';

import { ImageSDK } from '../../shared/components/ImageSDK';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useDynamicString } from '../hooks/useDynamicString';
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

  const { datasource } = useDynamicApi();
  const { text: title } = useDynamicString(titleInput);
  const { text: content } = useDynamicString(textInput);

  return (
    <div className="pw-container pw-mx-auto" id={`sf-${id}`}>
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
          {title}
        </h2>
        <div
          style={{
            color: textColor ?? 'black',
            fontFamily: textFontFamily ?? "Poppins, 'sans-serif'",
            fontSize: `${textSize ?? 14}${textUnit ?? 'px'}`,
          }}
          className={classNames(alignmentTextClass, 'pw-text-sm pw-mt-4')}
          dangerouslySetInnerHTML={{
            __html: content !== 'null' ? content ?? '' : 'Não disponível',
          }}
        />
      </div>
    </div>
  );
};
