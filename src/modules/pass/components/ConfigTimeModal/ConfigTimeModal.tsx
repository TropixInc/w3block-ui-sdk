import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import { BaseTabs, TabDTO } from '../../../shared';
import { ModalBase } from '../../../shared/components/ModalBase';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import { ConfigPanel } from './ConfigPanel';

interface ConfigTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: {
    backdrop?: string;
    classComplement?: string;
    closeButton?: string;
    dialogCard?: string;
  };
  advancedTimeConfig: { [key: string]: Array<{ start: string; end: string }> };
  onChangeTimeAdvanced: (value: {
    [key: string]: Array<{ start: string; end: string }>;
  }) => void;
}

export const ConfigTimeModal = ({
  isOpen,
  onClose,
  classes,
  advancedTimeConfig,
  onChangeTimeAdvanced,
}: ConfigTimeModalProps) => {
  const [translate] = useTranslation();
  const [activeTab, setActiveTab] = useState('mon');
  const [internalTimeConfig, setInternalTimeConfig] =
    useState(advancedTimeConfig);

  const configTabs: Array<TabDTO> = [
    { name: translate('pass>configTimeModal>mon'), value: 'mon' },
    { name: translate('pass>configTimeModal>tue'), value: 'tue' },
    { name: translate('pass>configTimeModal>wed'), value: 'wed' },
    { name: translate('pass>configTimeModal>thu'), value: 'thu' },
    { name: translate('pass>configTimeModal>fri'), value: 'fri' },
    { name: translate('pass>configTimeModal>sat'), value: 'sat' },
    { name: translate('pass>configTimeModal>sun'), value: 'sun' },
  ];

  const handleChangePanelItems = (
    updatedItems: Array<{ start: string; end: string }>
  ) => {
    const updatedConfig = {
      ...internalTimeConfig,
      [activeTab]: updatedItems,
    };
    setInternalTimeConfig(updatedConfig);
  };

  const onCancel = () => {
    onChangeTimeAdvanced({
      mon: [{ end: '', start: '' }],
      tue: [{ end: '', start: '' }],
      wed: [{ end: '', start: '' }],
      thu: [{ end: '', start: '' }],
      fri: [{ end: '', start: '' }],
      sat: [{ end: '', start: '' }],
      sun: [{ end: '', start: '' }],
    });

    onClose();
  };

  const onConfirm = () => {
    const daysOfWeek = Object.keys(internalTimeConfig);

    const validDays = daysOfWeek.reduce((cleanedSchedule: any, day) => {
      const validItems = internalTimeConfig[day].filter(
        ({ start, end }) => start && end
      );

      // Adiciona o dia com os itens válidos no objeto cleanedSchedule
      if (validItems.length > 0) {
        cleanedSchedule[day] = validItems;
      }

      return cleanedSchedule;
    }, {});

    onChangeTimeAdvanced(validDays);

    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      classes={{
        backdrop: classNames(classes?.backdrop ?? ''),
        classComplement: classNames(classes?.classComplement ?? ''),
        closeButton: classNames(classes?.closeButton ?? ''),
        dialogCard: classNames(
          classes?.dialogCard ?? '',
          '!pw-px-0 !pw-w-full !pw-max-w-[500px]'
        ),
      }}
    >
      <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-8">
        <p className="pw-text-xl pw-font-medium">
          {translate('pass>configTimeModal>addConfigTimes')}
        </p>
        <BaseTabs
          tabs={configTabs}
          activeTab={activeTab}
          onChangeActiveTab={setActiveTab}
        />
        <ConfigPanel
          activeDay={activeTab}
          panelItems={internalTimeConfig[activeTab]}
          onChangePanelItems={handleChangePanelItems}
        />
        <div className="pw-mt-8 pw-w-full pw-flex pw-gap-x-3 pw-px-4">
          <OffpixButtonBase
            variant="outlined"
            onClick={() => onCancel()}
            className="pw-h-10 pw-w-full pw-flex pw-items-center pw-justify-center text-sm"
          >
            {translate('components>cancelButton>cancel')}
          </OffpixButtonBase>
          <OffpixButtonBase
            onClick={() => onConfirm()}
            className="pw-h-10 pw-w-full pw-flex pw-items-center pw-justify-center text-sm"
          >
            {translate('shared>myProfile>confirm')}
          </OffpixButtonBase>
        </div>
      </div>
    </ModalBase>
  );
};
