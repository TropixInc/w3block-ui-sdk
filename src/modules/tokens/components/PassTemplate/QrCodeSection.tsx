import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { add } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

import { useProfile } from '../../../shared';
import { Spinner } from '../../../shared/components/Spinner';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useTranslation from '../../../shared/hooks/useTranslation';
interface iQrCodeSection {
  hasExpired?: boolean;
  editionNumber: string;
  secret: string;
  isDynamic: boolean;
  benefitId: string;
  refetchSecret: () => void;
}

export const QrCodeSection = ({
  editionNumber,
  hasExpired,
  secret,
  isDynamic,
  benefitId,
  refetchSecret,
}: iQrCodeSection) => {
  const [codeQr, setCodeQr] = useState('');
  const { setNewCountdown: setQrCountDown, ...qrCountDown } = useCountdown();
  const [translate] = useTranslation();

  const { data: profile } = useProfile();

  useEffect(() => {
    if (qrCountDown.seconds === 0 && secret !== undefined) {
      refetchSecret();
      setQrCountDown(add(new Date(), { seconds: 15 }));
      setCodeQr(`${editionNumber},${profile?.data?.id},${secret},${benefitId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCountDown.isActive, secret]);

  return hasExpired ? (
    <></>
  ) : (
    <div className="pw-border-y pw-border-[#EFEFEF] pw-mt-2 pw-py-[16px] pw-max-w-full">
      <div className="pw-flex pw-flex-col pw-gap-[12px] sm:pw-gap-[16px] pw-p-[16px] sm:pw-px-[24px]">
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          {codeQr === '' ? (
            <div className="pw-w-[300px] pw-h-[300px] pw-flex pw-justify-center pw-items-center">
              <Spinner />
            </div>
          ) : (
            <QRCodeSVG value={String(codeQr)} size={300} />
          )}
        </div>

        <div className="pw-h-auto pw-bg-[#DCDCDC] pw-w-px" />

        <div className="pw-flex pw-flex-col pw-justify-center">
          <div className="pw-text-[15px] pw-leading-[22.5px] pw-font-bold pw-text-[#353945]">
            {translate('token>pass>identifierCode')}
          </div>
          <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F] pw-break-words">
            {secret}
          </div>
          {isDynamic && (
            <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#295BA6]">
              <Trans
                i18nKey={'token>pass>qrCodeExpires'}
                tOptions={{ seconds: qrCountDown.seconds }}
              >
                1<span className="pw-font-semibold">2</span>
              </Trans>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
