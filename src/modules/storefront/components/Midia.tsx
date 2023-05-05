import classNames from 'classnames';

import { ImageSDK } from '../../shared/components/ImageSDK';
import {
  breakpointsEnum,
  useBreakpoints,
} from '../../shared/hooks/useBreakpoints/useBreakpoints';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { AlignmentEnum, MidiaData } from '../interfaces';

const ratios: Record<string, string> = {
  default: '',
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
  const { styleData, mobileStyleData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    mediaUrl,
    mediaUrlMobile,
    mediaLink,
    imageDisposition,
    imageRatio,
    imageAlignment,
    margin,
    padding,
  } = mergedStyleData;

  const layoutClass =
    imageDisposition === 'fixed' ? 'pw-container' : 'pw-w-full';

  const rowAlignmentClass = rowAlignments[imageAlignment ?? AlignmentEnum.LEFT];

  const ratio = ratios[imageRatio ?? 'default'];

  const breakpoint = useBreakpoints();

  const breakPointsMobile = [breakpointsEnum.SM, breakpointsEnum.XS];
  const isMobile = mediaUrlMobile && breakPointsMobile.includes(breakpoint);
  const bgUrl = isMobile ? mediaUrlMobile : mediaUrl;

  return (
    <div
      className="pw-w-full"
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div className={classNames(ratio, layoutClass, 'pw-mx-auto')}>
        <a href={mediaLink}>
          <ImageSDK
            className={classNames(
              ratio,
              rowAlignmentClass,
              '!pw-object-center pw-object-cover pw-w-full pw-h-full'
            )}
            src={bgUrl?.assetUrl}
            width={1440}
            quality="best"
          />
        </a>
      </div>
    </div>
  );
};
