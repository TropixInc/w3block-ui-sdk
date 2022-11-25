import { NavigationTabsPixwaySDKProps } from '../NavigationTabsPixwaySDK';

export const NavigationTabsPixwaySDKDesktop = ({
  classNames,
  tabs,
  textColor = 'black',
}: NavigationTabsPixwaySDKProps) => {
  return (
    <div className={`pw-flex pw-gap-x-[24px] ${classNames?.className}`}>
      {tabs?.map((tab) => (
        <a
          style={{ color: textColor }}
          className={`pw-font-poppins pw-text-[14px] pw-font-[600] ${classNames?.tabClassName}`}
          key={tab.name}
          href={tab.router}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};
