import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { add, compareDesc } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

import { useProfile } from '../../../shared';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
import { TokenUsageTime } from './TokenUsageTime';

interface iQrCodeSection {
  tokenId: string;
  eventDate: Date;
  hasExpiration?: boolean;
  setExpired: (i: boolean) => void;
  editionNumber: string;
  secret: string;
}

export const QrCodeSection = ({
  tokenId,
  eventDate,
  hasExpiration = true,
  setExpired,
  editionNumber,
  secret,
}: iQrCodeSection) => {
  const [codeQr, setCodeQr] = useState('');
  const { setNewCountdown: setQrCountDown, ...qrCountDown } = useCountdown();
  const [translate] = useTranslation();

  const { data: profile } = useProfile();

  useEffect(() => {
    if (qrCountDown.seconds === 0) {
      setQrCountDown(add(new Date(), { seconds: 60 }));
      setCodeQr(`${editionNumber};${profile?.data?.id};${secret}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCountDown.isActive]);

  const expired = compareDesc(eventDate, new Date()) === 1;
  expired && setExpired(true);

  return expired ? (
    <></>
  ) : (
    <div className="pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px] pw-max-w-[347px] sm:pw-max-w-full">
      <div className="pw-flex pw-gap-[12px] sm:pw-gap-[16px] pw-p-[16px] sm:pw-px-[24px]">
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          <QRCodeSVG value={String(codeQr)} size={120} />
        </div>

        <div className="pw-h-auto pw-bg-[#DCDCDC] pw-w-px" />

        <div className="pw-flex pw-flex-col pw-justify-center">
          <div className="pw-text-[15px] pw-leading-[22.5px] pw-font-bold pw-text-[#353945]">
            {translate('token>pass>identifierCode')}
          </div>
          <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
            {tokenId}
          </div>
          <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#295BA6]">
            <Trans
              i18nKey={'token>pass>qrCodeExpires'}
              tOptions={{ seconds: qrCountDown.seconds }}
            >
              1<span className="pw-font-semibold">2</span>
            </Trans>
          </div>
        </div>
      </div>
      <TokenUsageTime hasExpiration={hasExpiration} date={eventDate} />
    </div>
  );
};
