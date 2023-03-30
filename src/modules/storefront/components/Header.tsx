import { HeaderPixwaySDK } from '../../shared';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { useMobilePreferenceDataWhenMobile } from '../hooks/useMergeMobileData/useMergeMobileData';
import { MainModuleThemeInterface } from '../interfaces';

export const Header = ({ data }: { data: MainModuleThemeInterface }) => {
  const { styleData, mobileStyleData } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    backgroundColor,
    textColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hoverTextColor,
    tabs,
    logoSrc,
    brandName,
    margin,
    padding,
    fontFamily,
  } = mergedStyleData;

  return (
    <HeaderPixwaySDK
      logoSrc={logoSrc?.assetUrl}
      bgColor={backgroundColor}
      textColor={textColor}
      brandText={brandName}
      margin={convertSpacingToCSS(margin)}
      padding={convertSpacingToCSS(padding)}
      tabs={tabs?.map((l: any) => ({
        name: l.label,
        router: l.value,
      }))}
      fontFamily={fontFamily}
    />
  );
};
