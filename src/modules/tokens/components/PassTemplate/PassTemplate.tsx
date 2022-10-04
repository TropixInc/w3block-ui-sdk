import { ReactNode, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { add, format, getDay } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

import { ReactComponent as ArrowLeftIcon } from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import { ReactComponent as CheckedIcon } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { ReactComponent as CloseCircledIcon } from '../../../shared/assets/icons/closeCircledOutlined.svg';
import { ReactComponent as ErrorIcon } from '../../../shared/assets/icons/errorIconRed.svg';
import { ReactComponent as InfoCircledIcon } from '../../../shared/assets/icons/informationCircled.svg';
import useCountdown from '../../../shared/hooks/useCountdown/useCountdown';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { DetailPass } from './DetailPass';
import { Details } from './Details';
import { DetailToken } from './DetailToken';
import { TokenUsageTime } from './TokenUsageTime';

const Lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

export const PassTemplate = () => {
  const [codeQr, setCodeQr] = useState(0);
  const { setNewCountdown: setQrCountDown, ...qrCountDown } = useCountdown();
  const [translate] = useTranslation();
  const router = useRouter();
  const tokenId = (router.query.tokenId as string) || 'inactive';

  useEffect(() => {
    if (qrCountDown.seconds === 0) {
      setQrCountDown(add(new Date(), { seconds: 60 }));
      setCodeQr((codeQr) => codeQr + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCountDown.isActive]);

  const shortDay = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const token = {
    name: 'RIO World Skate Street World Championships',
    address: 'Praça da Tijuca Rio de Janeiro, RJ - Brasil',
    type: 'unique',
    id: '00000000000000000',
    detail: {
      name: '0Lorem Ipsum is simply dummy text of the printing.',
    },
  };
  const event = {
    date: '10/20/2022 14:30',
  };

  const eventDate =
    tokenId === 'actived2'
      ? add(new Date(), { hours: 2 })
      : new Date(event.date);

  return tokenId.includes('error') ? (
    tokenId === 'error-read' ? (
      <ErrorTemplate
        title={translate('token>pass>invalidQrCode')}
        description={translate('token>pass>notPossibleGenerateQrCode')}
        showButton={true}
      />
    ) : tokenId === 'error-use' ? (
      <ErrorTemplate
        title={translate('token>pass>invalidQrCode')}
        description={translate('token>pass>usedAllTokens')}
      />
    ) : tokenId === 'error-expired' ? (
      <ErrorTemplate
        title={translate('token>pass>expiredTime')}
        description={translate('token>pass>outsideAllowedTime')}
      />
    ) : null
  ) : (
    <div className="pw-flex pw-flex-col pw-max-w-[968px] pw-w-full sm:pw-rounded-[20px] pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px]">
      <div
        className="pw-hidden sm:pw-flex pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="pw-stroke-[#295BA6]" />

        {translate('token>pass>back')}
      </div>

      {tokenId === 'used' ? <UsedPass /> : null}

      {tokenId === 'inactive' ? (
        <InfoPass
          title={translate('token>pass>inactivePass')}
          description={translate('token>pass>inactivePassMessage')}
        />
      ) : null}

      {tokenId === 'expired' ? (
        <InfoPass
          title={translate('token>pass>passUnavailable')}
          description={translate('token>pass>passUnavailableMessage')}
        />
      ) : null}

      <div className="pw-flex pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
        <ArrowLeftIcon
          className=" pw-cursor-pointer sm:pw-hidden pw-stroke-[#295BA6]"
          onClick={() => router.back()}
        />
        {translate('token>pass>title')}
      </div>

      <div className="pw-flex pw-flex-col pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
        {tokenId === 'used' ? (
          <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-mb-[16px] pw-pb-[16px] pw-px-[24px] pw-border-b pw-border-[#EFEFEF]">
            <div className="pw-w-[20px] pw-h-[20px]">
              <CheckedIcon className="pw-stroke-[#295BA6] pw-w-[20px] pw-h-[20px]" />
            </div>
            <div className="pw-text-[#353945] pw-font-bold pw-text-[14px] pw-leading-[21px] pw-text-center">
              {translate('token>pass>checkedTime', { time: '12h30' })}
            </div>
          </div>
        ) : null}

        <div className="pw-flex pw-gap-[16px] pw-px-[24px]">
          <div className="pw-flex pw-flex-col pw-w-[120px] pw-justify-center pw-items-center">
            <div className="pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#295BA6] pw-text-center">
              {shortDay[getDay(eventDate)]}
            </div>
            <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F] pw-text-center pw-w-[50px]">
              {format(eventDate, 'dd MMM yyyy')}
            </div>
            <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945] pw-text-center">
              {format(eventDate, "HH'h'mm")}
            </div>
          </div>
          <div className="pw-h-[119px] sm:pw-h-[101px] pw-bg-[#DCDCDC] pw-w-[1px]" />
          <div className="pw-flex pw-flex-col pw-justify-center">
            <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
              {token.name}
            </div>
            <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
              {token.address}
            </div>
            <div className="pw-flex pw-gap-1">
              <span className="pw-text-[14px] pw-leading-[21px] pw-font-semibold pw-text-[#353945]">
                {translate('token>pass>use')}
              </span>
              <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
                {token.type === 'unique'
                  ? translate('token>pass>unique')
                  : translate('token>pass>youStillHave', { quantity: 5 })}
              </div>
            </div>
          </div>
        </div>

        {tokenId === 'inactive' ? (
          <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
            <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
              {translate('token>pass>useThisTokenFrom')}
              <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                {format(eventDate, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
        ) : null}

        {tokenId === 'expired' ? (
          <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
            <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
              {translate('token>pass>tokenExpiredIn')}
              <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                {format(eventDate, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {tokenId.includes('actived') || tokenId === 'unlimited' ? (
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
                {token.id}
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
      ) : null}

      <Details title={translate('token>pass>detailsPass')}>
        <DetailPass
          title={translate('token>pass>description')}
          description={Lorem}
        />

        <DetailPass
          title={translate('token>pass>benefict')}
          description={Lorem}
        />

        <DetailPass title={translate('token>pass>rules')} description={Lorem} />
      </Details>

      <Details title={translate('token>pass>useLocale')}>
        <div className="pw-w-[200px] pw-h-[200px]pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)]" />
        <div className="pw-w-[200px] pw-h-[200px]pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)]" />
        <div className="pw-w-[200px] pw-h-[200px]pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)]" />
      </Details>

      <Details title={translate('token>pass>detailsToken')}>
        <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-4 pw-gap-[30px]">
          <DetailToken
            title={translate('token>pass>tokenName')}
            description={token.detail.name}
          />
          <DetailToken
            title={translate('token>pass>linkBlockchain')}
            description=""
            titleLink="d"
          />
          <DetailToken
            title={translate('token>pass>mintedBy')}
            description="0xf4207af...fe51c408f"
            copyDescription={true}
            titleLink="d"
          />
          <DetailToken
            title={translate('token>pass>network')}
            description="MATIC Polygon"
          />
        </div>
      </Details>

      <div className="pw-flex pw-justify-center pw-items-center pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {translate('token>pass>purchaseMade', {
          date: '14/02/2022',
          time: '15:51',
          order: '1528',
        })}
      </div>

      {tokenId === 'used' ? (
        <div className=" pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[12px] sm:pw-hidden">
          <Button>{translate('token>pass>tokenPage')}</Button>
          <Button onClick={() => router.back()}>
            {translate('token>pass>back')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const Button = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => (
  <div
    className="pw-w-full pw-rounded-[48px] pw-py-[5px] pw-flex pw-justify-center pw-bg-[#EFEFEF] hover:pw-bg-[#295BA6] pw-text-[#FFFFFF] sm:pw-text-[#383857] pw-font-medium pw-text-[12px] pw-leading-[18px] pw-border-[#295BA6] hover:pw-border-[#FFFFFF] pw-border hover:pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] pw-cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);

const InfoPass = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="pw-bg-[#E5EDF9] pw-rounded-[8px] pw-w-full pw-p-[16px_16px_24px] pw-flex pw-gap-[8px]">
      <div className="pw-w-[17px] pw-h-[17px]">
        <InfoCircledIcon className="pw-w-[17px] pw-h-[17px]" />
      </div>
      <div className="pw-flex pw-flex-col ">
        <div className="pw-text-[#295BA6] pw-font-semibold pw-text-[15px] pw-leading-[22.5px]">
          {title}
        </div>
        <div className="pw-text-[#333333] pw-font-normal pw-text-[14px] pw-leading-[21px]">
          {description}
        </div>
      </div>
    </div>
  );
};

const UsedPass = () => {
  const [translate] = useTranslation();
  return (
    <div className="pw-relative pw-flex pw-flex-col pw-justify-center pw-items-center pw-rounded-[8px] pw-w-full pw-gap-[24px]">
      <div className="pw-w-[36px] pw-h-[36px]">
        <CheckedIcon className="pw-stroke-[#76DE8D] pw-w-[36px] pw-h-[36px]" />
      </div>
      <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-center">
        {translate('token>pass>qrCodeValidated')}
      </div>
    </div>
  );
};

const ErrorTemplate = ({
  title,
  description,
  showButton = false,
}: {
  title: string;
  description: string;
  showButton?: boolean;
}) => {
  const [translate] = useTranslation();
  const router = useRouter();
  return (
    <div className="pw-relative pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-[32px] pw-px-[23px] pw-gap-[36px]">
      <div className="pw-absolute pw-right-[18px] pw-top-[18px] pw-w-[36px] pw-h-[36px] pw-rounded-full pw-border pw-border-[#777E8F] pw-flex pw-justify-center pw-items-center pw-cursor-pointer">
        <CloseCircledIcon className="pw-w-[8.5px] pw-h-[8.5px] pw-stroke-[#353945]" />
      </div>

      <div className="pw-w- pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[24px]">
        <ErrorIcon className="pw-w-[36px] pw-h-[36px]" />
        <div className="pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[23px] pw-text-center">
          {title}
        </div>
      </div>
      <div className="pw-w-[320px] pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {description}
      </div>
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[12px] pw-w-full">
        {showButton ? (
          <Button>{translate('token>pass>generateNewQrCode')}</Button>
        ) : null}
        <Button onClick={() => router.back()}>
          {translate('token>pass>back')}
        </Button>
      </div>
    </div>
  );
};
