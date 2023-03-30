import { HeaderPixwaySDK, NavigationTabsPixwaySDKTabs } from '../../shared';
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
      fontFamily,
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
      tabs={tabs?.map(mapOptionsToTabs)}
      fontFamily={fontFamily}
    />
  );
};

type Item = {
  label: string;
  value: string;
};

type ItemWithTabs = Item & { tabs: { label: string; value: string }[] };

const mapOptionsToTabs = (item: ItemWithTabs): NavigationTabsPixwaySDKTabs => {
  if (item.value) return { name: item.label, router: item.value };

  return {
    name: item.label,
    tabs: item.tabs.map((t: Item) => ({ name: t.label, router: t.value })),
  };
};
