import classNames from 'classnames';

import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMergeMobileData } from '../hooks/useMergeMobileData/useMergeMobileData';
import { AlignmentEnum, ParagraphData } from '../interfaces';

const alignmentsText: AlignmentClassNameMap = {
  left: 'pw-text-left',
  right: 'pw-text-right',
  center: 'pw-text-center',
};
type AlignmentClassNameMap = Record<AlignmentEnum, string>;

export const Paragraph = ({ data }: { data: ParagraphData }) => {
  const { styleData, contentData, mobileStyleData, mobileContentData } = data;

  const mergedStyleData = useMergeMobileData(styleData, mobileStyleData);
  const mergedContentData = useMergeMobileData(contentData, mobileContentData);

  const { alignment, textColor, titleColor, margin, padding } = mergedStyleData;
  const { textInput, titleInput } = mergedContentData;

  const alignmentTextClass = alignmentsText[alignment ?? AlignmentEnum.LEFT];

  return (
    <div
      className="pw-container pw-mx-auto"
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <h2
        style={{ color: titleColor ?? 'black' }}
        className={classNames('pw-font-semibold pw-text-[19px]')}
      >
        {titleInput}
      </h2>
      <div
        style={{ color: textColor ?? 'black' }}
        className={classNames(alignmentTextClass, 'pw-text-sm pw-mt-4')}
        dangerouslySetInnerHTML={{ __html: textInput ?? '' }}
      />
    </div>
  );
};
