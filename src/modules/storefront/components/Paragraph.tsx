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
    <div className="pw-p-15">
      <h1
        className={classNames(
          titleColor ? titleColor : 'pw-font-black',
          'pw-font-poppins pw-font-semibold pw-text-xl'
        )}
      >
        {titleInput}
      </h1>
      <p
        className={classNames(
          textColor ? textColor : 'pw-font-black',
          alignmentTextClass,
          'pw-font-poppins pw-font-normal pw-text-sm'
        )}
      >
        {textInput}
      </p>
    </div>
  );
};
