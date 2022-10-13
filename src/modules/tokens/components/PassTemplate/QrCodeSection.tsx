import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { add, compareDesc } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
import { TokenUsageTime } from './TokenUsageTime';

interface iQrCodeSection {
  tokenId: string;
  eventDate: Date;
  setExpired: (i: boolean) => void;
}

export const QrCodeSection = ({
  tokenId,
  eventDate,
  setExpired,
}: iQrCodeSection) => {
  const [codeQr, setCodeQr] = useState(0);
  const { setNewCountdown: setQrCountDown, ...qrCountDown } = useCountdown();
  const [translate] = useTranslation();

  useEffect(() => {
    if (qrCountDown.seconds === 0) {
      setQrCountDown(add(new Date(), { seconds: 60 }));
      setCodeQr((codeQr) => codeQr + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCountDown.isActive]);

  const expired = compareDesc(eventDate, new Date()) === 1;
  expired && setExpired(true);

  return expired ? (
    <></>
  ) : (
    <div className="pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
      <div className="pw-flex pw-gap-[12px] sm:pw-gap-[16px] pw-px-[24px]">
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          <QRCodeSVG value={String(codeQr)} size={120} level="H" />
        </div>
        <div className="pw-h-[101px] pw-bg-[#DCDCDC] pw-w-[1px]" />
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
      <TokenUsageTime date={eventDate} />
    </div>
  );
};
