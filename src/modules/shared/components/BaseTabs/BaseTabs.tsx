import { Tab } from '@headlessui/react';
import classNames from 'classnames';

export interface TabDTO {
  name: string;
  value: string;
  panelConfig?: Array<any>;
}

export interface BaseTabsProps {
  tabs: Array<TabDTO>;
  activeTab: string;
  onChangeActiveTab: (value: string) => void;
}

export const BaseTabs = ({
  tabs,
  activeTab,
  onChangeActiveTab,
}: BaseTabsProps) => {
  return (
    <div>
      <div>
        <Tab.Group>
          <Tab.List className="pw-flex pw-gap-1 pw-mt-4 sm:pw-gap-4">
            {tabs.map((tab) => (
              <Tab
                onClick={() => onChangeActiveTab(tab.value)}
                className={classNames(
                  activeTab === tab.value ? 'pw-bg-blue-300' : '',
                  'pw-rounded-full pw-py-1 pw-text-xs pw-px-3 pw-font-semibold pw-text-black focus:pw-outline-none hover:pw-bg-blue-200 sm:pw-text-base'
                )}
                key={tab.value}
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};
