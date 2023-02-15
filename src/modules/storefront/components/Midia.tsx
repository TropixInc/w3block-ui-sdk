import classNames from 'classnames';

import { ImageSDK } from '../../shared/components/ImageSDK';
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
    styleData: { midiaUrl, imageDisposition, imageRatio, imageAlignment },
  } = data;

  const layoutClass =
    imageDisposition === 'fixed' ? 'pw-container' : 'pw-w-full';

  const rowAlignmentClass = rowAlignments[imageAlignment ?? AlignmentEnum.LEFT];

  const ratio = ratios[imageRatio ?? 'default'];

  return (
    <div className="pw-w-full">
      <div className={classNames(ratio, layoutClass, 'pw-mx-auto')}>
        <ImageSDK
          className={classNames(
            ratio,
            rowAlignmentClass,
            'pw-object-cover pw-w-full pw-h-full'
          )}
          src={midiaUrl?.assetUrl}
        />
      </div>
    </div>
  );
};
