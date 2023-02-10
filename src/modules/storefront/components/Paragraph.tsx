import classNames from 'classnames';

import { AlignmentEnum, ParagraphData } from '../interfaces';

const alignmentsText: AlignmentClassNameMap = {
  left: 'pw-text-left',
  right: 'pw-text-right',
  center: 'pw-text-center',
};
type AlignmentClassNameMap = Record<AlignmentEnum, string>;

export const Paragraph = ({ data }: { data: ParagraphData }) => {
  const {
    styleData: { alignment, textColor, textInput, titleColor, titleInput },
  } = data;

  const alignmentTextClass = alignmentsText[alignment ?? AlignmentEnum.LEFT];

  return (
    <div className="pw-container pw-mx-auto">
      <h2
        style={{ color: titleColor ?? 'black' }}
        className={classNames('pw-font-poppins pw-font-semibold pw-text-xl')}
      >
        {titleInput}
      </h2>
      <p
        style={{ color: textColor ?? 'black' }}
        className={classNames(alignmentTextClass, 'pw-font-poppins pw-text-sm')}
      >
        {textInput}
      </p>
    </div>
  );
};
