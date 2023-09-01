import classNames from 'classnames';
import _ from 'lodash';

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

  const { alignment, textColor, titleColor, margin, padding } = mergedStyleData;
  const { textInput, titleInput } = mergedContentData;

  const alignmentTextClass = alignmentsText[alignment ?? AlignmentEnum.LEFT];

  const { isDynamic, datasource } = useDynamicApi();

  return (
    <div className="pw-container pw-mx-auto">
      <div
        style={{
          margin: convertSpacingToCSS(margin),
          padding: convertSpacingToCSS(padding),
        }}
      >
        <h2
          style={{ color: titleColor ?? 'black' }}
          className={classNames('pw-font-semibold pw-text-[19px]')}
        >
          {isDynamic ? _.get(datasource, titleInput ?? '', '') : titleInput}
        </h2>
        <div
          style={{ color: textColor ?? 'black' }}
          className={classNames(alignmentTextClass, 'pw-text-sm pw-mt-4')}
          dangerouslySetInnerHTML={{
            __html: _.get(datasource, textInput!, textInput ?? ''),
          }}
        />
      </div>
    </div>
  );
};
