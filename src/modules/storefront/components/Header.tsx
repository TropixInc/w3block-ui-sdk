import { HeaderPixwaySDK, useRouterConnect } from '../../shared';
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
    },
  } = props.data;

  const { routerToHref } = useRouterConnect();
  return (
    <HeaderPixwaySDK
      logoSrc={logoSrc?.assetUrl}
      bgColor={backgroundColor}
      textColor={textColor}
      brandText={brandName}
      tabs={tabs?.map((l: any) => ({
        name: l.label,
        router: routerToHref(l.value),
      }))}
    />
  );
};
