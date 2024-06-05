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
  return (
    <div className={`pw-flex pw-gap-x-6 ${classNames?.className ?? ''}`}>
      {tabs?.map((item, idx) => {
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
              {item.name}
            </a>
          );
        }
      })}
    </div>
  );
};
