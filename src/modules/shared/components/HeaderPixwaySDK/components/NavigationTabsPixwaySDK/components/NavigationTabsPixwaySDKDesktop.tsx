import { NavigationTabsPixwaySDKProps } from '../NavigationTabsPixwaySDK';

export const NavigationTabsPixwaySDKDesktop = ({
  className,
  tabs,
  tabClassName,
}: NavigationTabsPixwaySDKProps) => {
  return (
    <div className={`pw-flex pw-gap-x-[24px] ${className}`}>
      {tabs?.map((tab) => (
        <a
          className={`pw-font-poppins pw-text-[14px] pw-font-[600] ${tabClassName}`}
          key={tab.name}
          href={tab.router}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};
