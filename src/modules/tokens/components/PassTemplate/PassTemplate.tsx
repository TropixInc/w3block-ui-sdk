import { ReactNode } from 'react';
import { useToggle } from 'react-use';

import classNames from 'classnames';
import { add, format, getDay, isToday } from 'date-fns';

import { ReactComponent as ArrowLeftIcon } from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import { ReactComponent as CheckedIcon } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { ReactComponent as InfoCircledIcon } from '../../../shared/assets/icons/informationCircled.svg';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { DetailPass } from './DetailPass';
import { DetailsTemplate } from './DetailsTemplate';
import { DetailToken } from './DetailToken';
import { ErrorTemplate } from './ErrorTemplate';
import { InactiveDateUseToken } from './InactiveSection';
import { QrCodeSection } from './QrCodeSection';
import { UsedPass } from './UsedSection';

const Lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

const _PassTemplate = () => {
  const [translate] = useTranslation();
  const router = useRouter();
  const mode = (router.query.mode as string) || '';

  const [hasExpired, setHasExpired] = useToggle(false);

  const shortDay = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const token = {
    name: 'RIO World Skate Street World Championships',
    type: 'unique',
    id: '00000000000000000',
    detail: {
      name: '0Lorem Ipsum is simply dummy text of the printing.',
    },
    address: {
      name: 'Nome do endereço',
      street: 'Praça da Tijuca Rio de Janeiro',
      city: 'RJ',
      country: 'Brazil',
      rules: Lorem,
    },
  };
  const event = {
    date: '10/20/2023 14:30',
  };
  const detailsTokenMoked = [
    {
      title: 'token>pass>tokenName',
      description: token.detail.name,
      copyDescription: false,
      titleLink: '',
    },
    {
      title: 'token>pass>linkBlockchain',
      description: '',
      copyDescription: false,
      titleLink: 'd',
    },
    {
      title: 'token>pass>mintedBy',
      description: '0xf4207af...fe51c408f',
      copyDescription: true,
      titleLink: 'd',
    },
    {
      title: 'token>pass>network',
      description: 'MATIC Polygon',
      copyDescription: false,
      titleLink: '',
    },
  ];

  const eventDate =
    mode === 'actived2'
      ? add(new Date(), { seconds: 10 })
      : new Date(event.date);

  const today = isToday(eventDate);

  const isInactive = mode === 'inactive';

  return mode.includes('error') ? (
    mode === 'error-read' ? (
      <ErrorTemplate
        title={translate('token>pass>invalidQrCode')}
        description={translate('token>pass>notPossibleGenerateQrCode')}
        showButton={true}
      />
    ) : mode === 'error-use' ? (
      <ErrorTemplate
        title={translate('token>pass>invalidQrCode')}
        description={translate('token>pass>usedAllTokens')}
      />
    ) : mode === 'error-expired' ? (
      <ErrorTemplate
        title={translate('token>pass>expiredTime')}
        description={translate('token>pass>outsideAllowedTime')}
      />
    ) : null
  ) : (
    <div className="pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
      <div
        className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

        <p className="sm:pw-hidden pw-block">{translate('token>pass>title')}</p>
        <p className="pw-hidden sm:pw-block">{translate('token>pass>back')}</p>
      </div>

      {mode === 'used' ? <UsedPass /> : null}

      {isInactive ? (
        <InfoPass
          title={translate('token>pass>inactivePass')}
          description={translate('token>pass>inactivePassMessage')}
        />
      ) : null}

      {hasExpired ? (
        <InfoPass
          title={translate('token>pass>passUnavailable')}
          description={translate('token>pass>passUnavailableMessage')}
        />
      ) : null}

      <div className="pw-hidden sm:pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
        {translate('token>pass>title')}
      </div>

      <div className="pw-flex pw-flex-col">
        <div className="pw-flex pw-flex-col pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
          {mode === 'used' ? (
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

            <div className="pw-h-auto pw-bg-[#DCDCDC] pw-w-px" />

            <div className="pw-flex pw-flex-col pw-justify-center">
              <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                {token.name}
              </div>
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {token.address.street}
                {', '}
                {token.address.city}
                {' - '}
                {token.address.country}
              </div>
              <div className="pw-flex pw-items-center pw-gap-2">
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

          {isInactive ? <InactiveDateUseToken eventDate={eventDate} /> : null}
          {hasExpired && !isInactive ? (
            <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
              <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
                {today
                  ? translate('token>pass>tokenExpiredAt')
                  : translate('token>pass>tokenExpiredIn')}
                <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                  {format(eventDate, today ? 'HH:mm' : 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {!isInactive && (!hasExpired || mode === 'unlimited') ? (
          <QrCodeSection
            eventDate={eventDate}
            tokenId={token.id}
            setExpired={setHasExpired}
            hasExpiration={!(mode === 'unlimited')}
          />
        ) : null}
      </div>

      {!isInactive ? (
        <>
          <DetailsTemplate title={translate('token>pass>detailsPass')}>
            <DetailPass
              title={translate('token>pass>description')}
              description={Lorem}
            />

            <DetailPass
              title={translate('token>pass>benefict')}
              description={Lorem}
            />

            <DetailPass
              title={translate('token>pass>rules')}
              description={Lorem}
            />
          </DetailsTemplate>

          <DetailsTemplate title={translate('token>pass>useLocale')}>
            <div className="pw-w-full pw-h-[200px]pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] pw-flex pw-flex-col pw-gap-2">
              <div className="pw-flex pw-flex-col pw-gap-1">
                <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                  {token.address.name}
                </div>
                <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                  {token.address.street}
                  {', '}
                  {token.address.city}
                  {' - '}
                  {token.address.country}
                </div>
              </div>
              <div className="pw-flex pw-flex-col pw-gap-1">
                <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945]">
                  {translate('token>pass>rules')}
                </div>
                <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                  {token.address.rules}
                </div>
              </div>
            </div>
          </DetailsTemplate>

          <DetailsTemplate title={translate('token>pass>detailsToken')}>
            <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 xl:pw-grid-cols-4 pw-gap-[30px]">
              {detailsTokenMoked.map((item) => (
                <DetailToken
                  key={item.title}
                  title={translate(item.title)}
                  description={item.description}
                  copyDescription={item.copyDescription}
                  titleLink={item.titleLink}
                />
              ))}
            </div>
          </DetailsTemplate>
        </>
      ) : null}

      <div className="pw-flex pw-justify-center pw-items-center pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {translate('token>pass>purchaseMade', {
          date: '14/02/2022',
          time: '15:51',
          order: '1528',
        })}
      </div>

      {mode === 'used' ? (
        <div className=" pw-flex pw-flex-col pw-justify-center pw-items-center pw-gap-[12px] sm:pw-hidden">
          <PassButton model="primary">
            {translate('token>pass>tokenPage')}
          </PassButton>
          <PassButton model="secondary" onClick={() => router.back()}>
            {translate('token>pass>back')}
          </PassButton>
        </div>
      ) : null}
    </div>
  );
};

export const PassTemplate = () => (
  <TranslatableComponent>
    <_PassTemplate />
  </TranslatableComponent>
);

const PassButton = ({
  children,
  onClick,
  model = 'primary',
}: {
  model?: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
}) => (
  <button
    className={classNames(
      'pw-w-full pw-rounded-[48px] pw-py-[5px] pw-flex pw-justify-center pw-font-medium pw-text-[12px] pw-leading-[18px] pw-border',
      model === 'primary'
        ? 'pw-bg-[#295BA6] hover:pw-bg-[#4194CD] pw-text-white pw-border-[#FFFFFF] pw-shadow-[0px_2px_4px_rgba(0,0,0,0.26)] '
        : 'pw-bg-[#EFEFEF] pw-text-[#383857]  pw-border-[#295BA6]  hover:pw-shadow-[0px_2px_4px_rgba(0,0,0,0.25)] '
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export const InfoPass = ({
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
