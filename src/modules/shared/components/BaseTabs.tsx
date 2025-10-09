import { Tab } from '@headlessui/react';
import classNames from 'classnames';

import CheckIcon from '../assets/icons/checkOutlined.svg';
import XIcon from '../assets/icons/xFilled.svg';

export interface TabDTO {
  name: string;
  value: string;
  panelConfig?: Array<any>;
}

export interface BaseTabsProps {
  tabs: Array<TabDTO>;
  activeTab: string;
  onChangeActiveTab: (value: string) => void;
  invalidDays: any;
  checkinItems?: any;
}

export const BaseTabs = ({
  tabs,
  activeTab,
  onChangeActiveTab,
  invalidDays,
  checkinItems
}: BaseTabsProps) => {

  return (
    <div>
      <div>
        <Tab.Group>
          <Tab.List className="pw-flex pw-gap-1 pw-mt-4 sm:pw-gap-4">
            {tabs?.map((tab) => (
              <div key={tab?.value}>
                <Tab
                  onClick={() => onChangeActiveTab(tab.value)}
                  className={classNames(
                    activeTab === tab?.value ? 'pw-bg-blue-300' : '',
                    checkinItems[tab?.value] ? 'pw-border pw-border-blue-300' : "",
                    'pw-rounded-full pw-py-1 pw-text-xs pw-px-3 pw-font-semibold pw-text-black focus:pw-outline-none hover:pw-bg-blue-200 sm:pw-text-base'
                  )}
                >
                  {tab?.name}
                </Tab>
                {invalidDays ? (
                  <div className="pw-mt-2 pw-flex pw-justify-center">
                    {invalidDays[tab?.value as any] === 'valid' ? (
                      <CheckIcon className="pw-stroke-green-500 pw-stroke-2" />
                    ) : null}
                    {invalidDays[tab?.value as any] === 'error' ? (
                      <XIcon className="pw-fill-red-500 pw-w-[11px] pw-h-[11px]" />
                    ) : null}
                  </div>
                ) : null}

              </div>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};
