import { useEffect } from 'react';
import { Trans } from 'react-i18next';

import differenceInHours from 'date-fns/differenceInHours';
import format from 'date-fns/format';

import { PassDates } from '../../../pass/interfaces/PassDates';
import ClockIcon from '../../../shared/assets/icons/clockOutlined.svg?react';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
interface Props {
  date: PassDates;
  hasExpiration: boolean;
}

export const TokenUsageTime = ({ date, hasExpiration }: Props) => {
  const [translate] = useTranslation();
  const differenceByHours =
    date?.endDate && differenceInHours(date?.endDate, new Date());

  if (date.endDate && hasExpiration && differenceByHours) {
    return differenceByHours > 2 ? (
      <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
        <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
          {date.endDate
            ? translate('token>pass>useThisTokenUntil')
            : translate('token>pass>useThisTokenFrom')}
          <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
            {format(new Date(date.startDate), 'dd/MM/yyyy')}
            {date.endDate &&
              translate('token>pass>until') +
                format(new Date(date.endDate || ''), 'dd/MM/yyyy')}
          </span>
        </div>
        {date.checkInStart && (
          <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center pw-mt-5">
            {translate('token>pass>checkinAvaibleAt')}
            <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
              {date.checkInStart?.slice(0, 5)}
              {date.checkInEnd && ' - ' + date.checkInEnd?.slice(0, 5)}
            </span>
          </div>
        )}
      </div>
    ) : (
      <TokenCountDown date={date.endDate} />
    );
  }
  return (
    <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
      <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
          {translate('token>pass>unlimited')}
        </span>
      </div>
    </div>
  );
};

const TokenCountDown = ({ date }: { date: Date }) => {
  const { setNewCountdown, ...countDown } = useCountdown();
  useEffect(() => {
    setNewCountdown(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pw-flex pw-flex-wrap pw-items-center pw-justify-center pw-w-full pw-gap-1 pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
      <ClockIcon className="pw-stroke-[#295BA6]" />
      <Trans
        i18nKey={'token>pass>itRemainsForTheUseOfThatToken'}
        tOptions={{
          hours: countDown.hours,
          minutes: countDown.minutes,
          seconds: countDown.seconds,
        }}
      >
        Faltam
        <span className="pw-text-[#295BA6] pw-font-bold pw-text-[18px] pw-leading-[23px]">
          time
        </span>
        <div className="pw-block pw-w-full">para a utilização desse token.</div>
      </Trans>
    </div>
  );
};
