/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { isAfter, parse } from 'date-fns';

import { ModalBase } from '../../shared/components/ModalBase';
import useTranslation from '../../shared/hooks/useTranslation';
import { ConfigTimeComponent } from './ConfigTimeComponent';
import { BaseButton } from '../../shared/components/Buttons';

interface TimeDTO {
  [key: string]: Array<{ start: string; end: string }>;
}

interface ConfigTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: {
    backdrop?: string;
    classComplement?: string;
    closeButton?: string;
    dialogCard?: string;
  };
  advancedTimeConfig: TimeDTO;
  onChangeTimeAdvanced: (value: TimeDTO) => void;
}

const isEndAfterStart = (start: string, end: string): boolean => {
  const startDate = parse(start, 'HH:mm', new Date());
  const endDate = parse(end, 'HH:mm', new Date());
  return isAfter(endDate, startDate);
};

export const ConfigTimeModal = ({
  isOpen,
  onClose,
  classes,
  advancedTimeConfig,
  onChangeTimeAdvanced,
}: ConfigTimeModalProps) => {
  const [translate] = useTranslation();
  const [activeTab, setActiveTab] = useState('mon');
  const [isValidTimes, setIsValidTimes] = useState(false);
  const [invalidDays, setInvalidDays] = useState<any>();
  const [internalTimeConfig, setInternalTimeConfig] = useState<TimeDTO>({
    mon: [{ end: '', start: '' }],
    tue: [{ end: '', start: '' }],
    wed: [{ end: '', start: '' }],
    thu: [{ end: '', start: '' }],
    fri: [{ end: '', start: '' }],
    sat: [{ end: '', start: '' }],
    sun: [{ end: '', start: '' }],
  });

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

  useEffect(() => {
    if (advancedTimeConfig) {
      setInternalTimeConfig(advancedTimeConfig);
    }
  }, [advancedTimeConfig]);

  useEffect(() => {
    const feedback: any = {};
    let allValid = true;

    Object.entries(internalTimeConfig).forEach(([day, ranges]) => {
      const hasFilledRanges = ranges.some(({ start, end }) => start && end);

      if (!hasFilledRanges) {
        return; // Skip day without any complete time range
      }

      const hasInvalidRange = ranges.some(({ start, end }) => {
        if (!start || !end) return false;
        return !isEndAfterStart(start, end);
      });

      feedback[day as keyof TimeDTO] = hasInvalidRange ? 'error' : 'valid';

      if (hasInvalidRange) {
        allValid = false;
      }
    });

    setInvalidDays(feedback);
    setIsValidTimes(allValid);
  }, [internalTimeConfig]);

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
        <ConfigTimeComponent
          activeTab={activeTab}
          onChangeActiveTab={setActiveTab}
          panelItems={internalTimeConfig?.[activeTab ?? '']}
          onChangePanelItems={handleChangePanelItems}
          invalidDays={invalidDays}
        />
        <div className="pw-mt-8 pw-w-full pw-flex pw-gap-x-3 pw-px-4">
          <BaseButton
            variant="outlined"
            onClick={() => onCancel()}
            className="pw-h-10 pw-w-full pw-flex pw-items-center pw-justify-center text-sm"
          >
            {translate('components>cancelButton>cancel')}
          </BaseButton>
          <BaseButton
            disabled={!isValidTimes}
            onClick={() => onConfirm()}
            className="pw-h-10 pw-w-full pw-flex pw-items-center pw-justify-center text-sm"
          >
            {translate('shared>myProfile>confirm')}
          </BaseButton>
        </div>
      </div>
    </ModalBase>
  );
};
