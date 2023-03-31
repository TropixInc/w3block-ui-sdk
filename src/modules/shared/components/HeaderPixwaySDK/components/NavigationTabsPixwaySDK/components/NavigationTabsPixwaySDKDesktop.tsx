import { NavigationTabsPixwaySDKProps } from '../NavigationTabsPixwaySDK';

export const NavigationTabsPixwaySDKDesktop = ({
  classNames,
  tabs,
  textColor = 'black',
  bgColor,
}: NavigationTabsPixwaySDKProps) => {
  return (
    <div className={`pw-flex pw-gap-x-[24px] ${classNames?.className}`}>
      {tabs?.map((tab) => {
        if (tab.tabs?.length) {
          return (
            <div key={tab.name} className="pw-relative pw-group">
              <span
                style={{ color: textColor }}
                className={`pw-text-sm pw-font-semibold pw-cursor-pointer pw-underline ${classNames?.tabClassName}`}
              >
                {tab.name}
              </span>

              <div className="pw-hidden group-hover:pw-block">
                <div className="pw-top-8 pw-flex pw-justify-center">
                  <div
                    style={{ backgroundColor: bgColor }}
                    className={`
                      pw-absolute pw-z-10
                      pw-py-4 pw-px-1 pw-rounded-2xl pw-w-[160px]
                      pw-flex pw-flex-col pw-gap-4 pw-text-center pw-justify-center
                      pw-drop-shadow-lg
                  `}
                  >
                    {tab.tabs.map((t) => {
                      return (
                        <a
                          style={{ color: textColor }}
                          className={`pw-text-sm pw-font-semibold ${classNames?.tabClassName}`}
                          key={t.name}
                          href={t.router}
                        >
                          {t.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <a
            style={{ color: textColor }}
            className={`pw-text-sm pw-font-semibold ${classNames?.tabClassName}`}
            key={tab.name}
            href={tab.router}
          >
            {tab.name}
          </a>
        );
      })}
    </div>
  );
};
