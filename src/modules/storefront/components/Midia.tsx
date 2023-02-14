import classNames from 'classnames';

import { ImageSDK } from '../../shared/components/ImageSDK';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { AlignmentEnum, MidiaData } from '../interfaces';

const ratios: Record<string, string> = {
  default: 'pw-aspect-[20/9]',
  '4:1': 'pw-aspect-[4/1]',
  '3:1': 'pw-aspect-[3/1]',
  '16:9': 'pw-aspect-video',
  '20:9': 'pw-aspect-[20/9]',
};

type AlignmentClassNameMap = Record<AlignmentEnum, string>;
const rowAlignments: AlignmentClassNameMap = {
  left: 'pw-object-left',
  right: 'pw-object-right',
  center: 'pw-object-center',
};

export const Midia = ({ data }: { data: MidiaData }) => {
  const {
    styleData: {
      midiaUrl,
      imageDisposition,
      imageRatio,
      imageAlignment,
      margin,
      padding,
    },
  } = data;

  const layoutClass =
    imageDisposition === 'fixed' ? 'pw-container' : 'pw-w-full';

  const rowAlignmentClass = rowAlignments[imageAlignment ?? AlignmentEnum.LEFT];

  return (
    <div
      className="pw-w-full"
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div
        className={classNames(
          ratios[imageRatio ?? 'default'],
          layoutClass,
          'pw-mx-auto'
        )}
      >
        <ImageSDK
          className={classNames(rowAlignmentClass, 'pw-object-cover')}
          src={midiaUrl?.assetUrl}
        />
      </div>
    </div>
  );
};
