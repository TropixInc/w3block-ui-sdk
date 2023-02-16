import { HeaderPixwaySDK } from '../../shared';
import { convertSpacingToCSS } from '../../shared/utils/convertSpacingToCSS';
import { MainModuleThemeInterface } from '../interfaces';

export const Header = (props: { data: MainModuleThemeInterface }) => {
  const {
    styleData: {
      backgroundColor,
      textColor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hoverTextColor,
      tabs,
      logoSrc,
      brandName,
      margin,
      padding,
    },
  } = props.data;

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
    />
  );
};
