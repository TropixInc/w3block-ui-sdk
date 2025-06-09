import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import classNames from 'classnames';
import add from 'date-fns/add';
import { QRCodeSVG } from 'qrcode.react';
import { Spinner } from '../../../shared/components/Spinner';
import useCountdown from '../../../shared/hooks/useCountdown';
import { useProfile } from '../../../shared/hooks/useProfile';


interface iQrCodeSection {
  hasExpired?: boolean;
  editionNumber: string;
  secret: string;
  isDynamic: boolean;
  benefitId: string;
  refetchSecret: () => void;
  size?: number;
  rootClassnames?: string;
  isRenderSecretCode?: boolean;
  userId?: string;
}

export const QrCodeSection = ({
  editionNumber,
  hasExpired,
  secret,
  isDynamic,
  benefitId,
  refetchSecret,
  size = 300,
  rootClassnames,
  isRenderSecretCode = true,
  userId,
}: iQrCodeSection) => {
  const [codeQr, setCodeQr] = useState('');
  const { setNewCountdown: setQrCountDown, ...qrCountDown } = useCountdown();
  const [translate] = useTranslation();

  const { data: profile } = useProfile();
  const idToUse = userId ? userId : profile?.data?.id;
  useEffect(() => {
    if (qrCountDown.seconds === 0 && secret !== undefined) {
      refetchSecret();
      setQrCountDown(add(new Date(), { seconds: 15 }));
      setCodeQr(`${editionNumber},${idToUse},${secret},${benefitId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCountDown.isActive, secret]);

  return hasExpired ? (
    <></>
  ) : (
    <div
      className={classNames(
        'pw-border-y pw-border-[#EFEFEF] pw-mt-2 pw-py-[16px] pw-max-w-full',
        rootClassnames ?? ''
      )}
    >
      <div
        className={`pw-flex pw-flex-col ${
          isRenderSecretCode ? 'pw-gap-[12px] sm:pw-gap-[16px]' : ''
        } pw-p-[16px] sm:pw-px-[24px]`}
      >
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          {codeQr === '' ? (
            <div className="pw-w-[300px] pw-h-[300px] pw-flex pw-justify-center pw-items-center">
              <Spinner />
            </div>
          ) : (
            <QRCodeSVG value={String(codeQr)} size={size} />
          )}
        </div>

        <div className="pw-h-auto pw-bg-[#DCDCDC] pw-w-px" />

        {isRenderSecretCode ? (
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
        ) : null}
      </div>
    </div>
  );
};
