import { getI18nString } from '../../../../../../storefront/hooks/useDynamicString';
import { UseThemeConfig } from '../../../../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { useLocale } from '../../../../../hooks/useLocale';
import { NavigationTabsPixwaySDKProps } from '../NavigationTabsPixwaySDK';
import SubmenuItem from './SubmenuItem';

export const NavigationTabsPixwaySDKDesktop = ({
  classNames,
  tabs,
  textColor = 'black',
  bgColor,
  bgSelectionColor,
  textSelectionColor,
}: NavigationTabsPixwaySDKProps) => {
  const locale = useLocale();
  const theme = UseThemeConfig();
  return (
    <div className={`pw-flex pw-gap-x-6 ${classNames?.className ?? ''}`}>
      {tabs?.map((item, idx) => {
        const { text: name } = getI18nString(item.name, locale, theme);
        if (item.tabs?.length) {
          return (
            <SubmenuItem
              key={item.name + idx}
              item={item}
              bgColor={bgColor}
              bgSelectionColor={bgSelectionColor}
              textSelectionColor={textSelectionColor}
              textColor={textColor}
            />
          );
        } else {
          return (
            <a
              style={{ color: textColor }}
              key={item.name}
              href={item.router ?? ''}
            >
              {name}
            </a>
          );
        }
      })}
    </div>
  );
};
