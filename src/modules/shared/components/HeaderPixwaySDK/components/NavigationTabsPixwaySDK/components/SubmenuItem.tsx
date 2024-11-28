import { useRef } from 'react';

import {
  ControlledMenu,
  MenuItem,
  SubMenu,
  useHover,
  useMenuState,
} from '@szhsin/react-menu';

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { getI18nString } from '../../../../../../storefront/hooks/useDynamicString';
import { UseThemeConfig } from '../../../../../../storefront/hooks/useThemeConfig/useThemeConfig';
import ArrowDown from '../../../../../assets/icons/arrowDown.svg?react';
import { useLocale } from '../../../../../hooks/useLocale';
import { NavigationTabsPixwaySDKTabs } from '../NavigationTabsPixwaySDK';

interface SubmenuItemProps {
  item: NavigationTabsPixwaySDKTabs;
  bgColor?: string;
  textColor?: string;
  bgSelectionColor?: string;
  textSelectionColor?: string;
}

const SubmenuItem = ({
  item,
  bgColor,
  textColor,
  bgSelectionColor,
  textSelectionColor,
}: SubmenuItemProps) => {
  const ref = useRef(null);
  const locale = useLocale();
  const theme = UseThemeConfig();
  const { text: itemName } = getI18nString(item.name, locale, theme);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const onRenderMenu = (item: NavigationTabsPixwaySDKTabs) => {
    const { text: menuName } = getI18nString(item.name, locale, theme);
    if (item.tabs) {
      return item.tabs.map((subm, idx) => (
        <SubMenu
          menuStyle={{
            backgroundColor: bgColor,
            color: textColor,
            padding: 0,
          }}
          key={item.name + idx}
          itemProps={{ className: '!pw-p-0' }}
          label={({ hover, open }) => (
            <span
              className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
              style={{
                color: hover || open ? textSelectionColor : textColor,
                backgroundColor: hover || open ? bgSelectionColor : '',
                opacity: open ? 0.8 : 1,
              }}
            >
              {menuName}
            </span>
          )}
        >
          {onRenderMenu(subm)}
        </SubMenu>
      ));
    } else {
      return (
        <MenuItem href={item.router} className="!pw-p-0">
          {({ hover }) => {
            return (
              <div
                className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                style={{
                  backgroundColor: hover ? bgSelectionColor : '',
                  color: hover ? textSelectionColor : textColor,
                }}
              >
                <p>{menuName}</p>
              </div>
            );
          }}
        </MenuItem>
      );
    }
  };

  return (
    <>
      <div
        className="pw-cursor-pointer pw-flex pw-gap-x-1 pw-items-center"
        key={item.name}
        ref={ref}
        {...anchorProps}
        style={{ color: textColor }}
      >
        {itemName}
        <ArrowDown style={{ stroke: textColor }} />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={ref}
        onClose={() => toggle(false)}
        menuStyle={{ backgroundColor: bgColor }}
      >
        {item?.tabs?.map((sub, idx) => {
          const { text: subName } = getI18nString(sub.name, locale, theme);
          if (sub.tabs) {
            return onRenderMenu(sub);
          } else {
            return (
              <MenuItem
                key={sub.name + idx}
                href={sub.router}
                className="!pw-p-0"
              >
                {({ hover }) => {
                  return (
                    <div
                      className="pw-block pw-p-[0.375rem_1.5rem] pw-w-full"
                      style={{
                        backgroundColor: hover ? bgSelectionColor : '',
                        color: hover ? textSelectionColor : textColor,
                      }}
                    >
                      <p>{subName}</p>
                    </div>
                  );
                }}
              </MenuItem>
            );
          }
        })}
      </ControlledMenu>
    </>
  );
};

export default SubmenuItem;
