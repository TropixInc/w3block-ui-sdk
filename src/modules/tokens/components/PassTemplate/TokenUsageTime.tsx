import { useEffect } from 'react';
import { Trans } from 'react-i18next';

import { differenceInHours, format } from 'date-fns';

import { ReactComponent as ClockIcon } from '../../../shared/assets/icons/clockOutlined.svg';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';

export const TokenUsageTime = ({ date }: { date: Date }) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const tokenId = (router.query.tokenId as string) || '1';

  const differenceByHours = differenceInHours(date, new Date());
  return (
    <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
      {tokenId.includes('actived') ? (
        differenceByHours > 2 ? (
          <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
            {translate('token>pass>useThisToken')}
            <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
              {format(date, 'dd/MM/yyyy')}
            </span>
          </div>
        ) : (
          <TokenCountDown date={date} />
        )
      ) : (
        <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
          {translate('token>pass>validUntil')}
          <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
            {translate('token>pass>unlimited')}
          </span>
        </div>
      )}
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
