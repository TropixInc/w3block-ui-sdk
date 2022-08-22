interface NavigationTabsPixwaySDKProps {
  tabs?: NavigationTabsPixwaySDKTabs[];
  className?: string;
  tabClassName?: string;
}

export interface NavigationTabsPixwaySDKTabs {
  name: string;
  router: string;
}

const defaultTabs: NavigationTabsPixwaySDKTabs[] = [
  { name: 'About', router: '/about' },
  { name: 'Teams', router: '/teams' },
  { name: 'Marketplace', router: '/marketplace' },
  { name: 'FAQ', router: '/faq' },
];

export const NavigationTabsPixwaySDK = ({
  tabs = defaultTabs,
  className,
  tabClassName,
}: NavigationTabsPixwaySDKProps) => {
  return (
    <div className={`pw-flex pw-gap-x-[24px] ${className}`}>
      {tabs.map((tab) => (
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
