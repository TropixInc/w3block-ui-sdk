import { BaseTabs, TabDTO } from '../../../shared';
import useTranslation from '../../../shared/hooks/useTranslation';
import { ConfigPanel } from '../ConfigTimeModal/ConfigPanel';

interface ConfigComponentProps {
  activeTab: string;
  onChangeActiveTab: (value: string) => void;
  panelItems: Array<{ start: string; end: string }>;
  onChangePanelItems?: (value: Array<{ start: string; end: string }>) => void;
}

export const ConfigTimeComponent = ({
  activeTab,
  onChangeActiveTab,
  onChangePanelItems,
  panelItems,
}: ConfigComponentProps) => {
  const [translate] = useTranslation();

  const configTabs: Array<TabDTO> = [
    { name: translate('pass>configTimeModal>mon'), value: 'mon' },
    { name: translate('pass>configTimeModal>tue'), value: 'tue' },
    { name: translate('pass>configTimeModal>wed'), value: 'wed' },
    { name: translate('pass>configTimeModal>thu'), value: 'thu' },
    { name: translate('pass>configTimeModal>fri'), value: 'fri' },
    { name: translate('pass>configTimeModal>sat'), value: 'sat' },
    { name: translate('pass>configTimeModal>sun'), value: 'sun' },
  ];

  return (
    <div className="">
      <p className="pw-text-xl pw-font-medium pw-text-center pw-text-black">
        {onChangePanelItems
          ? translate('pass>configTimeModal>addConfigTimes')
          : translate('constructor>passBenefit>avaliableTime')}
      </p>
      <BaseTabs
        tabs={configTabs}
        activeTab={activeTab}
        onChangeActiveTab={onChangeActiveTab}
      />
      <ConfigPanel
        activeDay={activeTab}
        panelItems={panelItems}
        onChangePanelItems={onChangePanelItems}
      />
    </div>
  );
};
