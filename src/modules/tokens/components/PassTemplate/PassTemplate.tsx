import { ReactNode, useMemo } from 'react';

import classNames from 'classnames';
import { format, getDay, isSameDay, isToday } from 'date-fns';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { formatAddressProps } from '../../../pass';
import { BenefitStatus } from '../../../pass/enums/BenefitStatus';
import useGetPassBenefitById from '../../../pass/hooks/useGetPassBenefitById';
import useGetPassBenefits from '../../../pass/hooks/useGetPassBenefits';
import useGetQRCodeSecret from '../../../pass/hooks/useGetQRCodeSecret';
import { TokenPassBenefitType } from '../../../pass/interfaces/PassBenefitDTO';
import { InternalPagesLayoutBase } from '../../../shared';
import { ReactComponent as ArrowLeftIcon } from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import { ReactComponent as CheckedIcon } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { ReactComponent as InfoCircledIcon } from '../../../shared/assets/icons/informationCircled.svg';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { DetailPass } from './DetailPass';
import { DetailsTemplate } from './DetailsTemplate';
import { DetailToken } from './DetailToken';
import { ErrorTemplate } from './ErrorTemplate';
import { InactiveDateUseToken } from './InactiveSection';
import { QrCodeSection } from './QrCodeSection';
import { UsedPass } from './UsedSection';

interface PassTemplateProps {
  tokenIdProp?: string;
  benefitIdProp?: string;
  successValidationProp?: string;
}

const _PassTemplate = ({
  tokenIdProp,
  benefitIdProp,
  successValidationProp,
}: PassTemplateProps) => {
  const { pass } = useFlags();
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const tokenId = tokenIdProp || (router?.query?.tokenId as string) || '';
  const benefitId = benefitIdProp || (router?.query?.benefitId as string) || '';
  const successValidation =
    successValidationProp || (router?.query?.success as string) || '';

  const {
    data: benefit,
    isSuccess: isBenefitSucceed,
    isLoading: isLoadingBenefit,
  } = useGetPassBenefitById(benefitId);

  const {
    data: publicTokenResponse,
    isSuccess: isTokenSucceed,
    isLoading: isLoadingToken,
  } = usePublicTokenData({
    contractAddress: benefit?.data?.tokenPass?.contractAddress ?? '',
    chainId: String(benefit?.data?.tokenPass?.chainId) ?? '',
    tokenId,
  });

  const { data: benefitsResponse, isLoading: isLoadingBenefitsResponse } =
    useGetPassBenefits({
      contractAddress: benefit?.data?.tokenPass?.contractAddress ?? '',
      chainId: String(benefit?.data?.tokenPass?.chainId) ?? '',
      tokenPassId: publicTokenResponse?.data?.group?.collectionId ?? '',
    });

  const benefitData = benefitsResponse?.data.items.filter(
    (e) => e.id === benefit?.data.id
  );

  const editionNumber = useMemo(() => {
    if (isTokenSucceed) {
      return publicTokenResponse?.data?.edition?.currentNumber;
    } else {
      return '';
    }
  }, [isTokenSucceed, publicTokenResponse?.data?.edition?.currentNumber]);

  const { data: secret, isSuccess: isSecretSucceed } = useGetQRCodeSecret({
    benefitId,
    editionNumber: editionNumber as string,
  });

  const mode = useMemo(() => {
    if (benefit?.data?.useLimit == 0) {
      return 'error-use';
    } else if (
      secret?.data?.statusCode === 400 &&
      !secret?.data?.message?.includes('ended the period of use')
    ) {
      return 'error-read';
    } else {
      return '';
    }
  }, [benefit?.data?.useLimit, secret]);

  const shortDay = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  const formatAddress = ({ type, benefit }: formatAddressProps) => {
    if (
      type == TokenPassBenefitType.PHYSICAL &&
      benefit?.tokenPassBenefitAddresses
    ) {
      return `${benefit?.tokenPassBenefitAddresses[0]?.street}-${benefit?.tokenPassBenefitAddresses[0]?.city}`;
    } else {
      return 'Online';
    }
  };

  const detailsToken = [
    {
      title: 'token>pass>tokenName',
      description: publicTokenResponse?.data?.information?.title,
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
      description: publicTokenResponse?.data?.edition?.mintedHash,
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

  const hasExpiration = benefit?.data?.eventEndsAt ? true : false;

  const isSingleDate =
    benefit &&
    isSameDay(
      new Date(benefit.data.eventStartsAt),
      new Date(benefit.data.eventEndsAt)
    );

  const eventDate = isSingleDate
    ? new Date(benefit.data.eventStartsAt)
    : undefined;

  const today = eventDate !== undefined && isToday(eventDate);

  const isInactive =
    benefitData && benefitData[0]?.status === BenefitStatus.inactive;

  const isUnavaible =
    benefitData && benefitData[0]?.status === BenefitStatus.unavailable;

  const hasExpired =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('ended the period of use');

  return isLoadingBenefit || isLoadingBenefitsResponse || isLoadingToken ? (
    <Spinner />
  ) : mode.includes('error') ? (
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
    ) : null
  ) : pass ? (
    <div className="pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
      <div
        className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

        <p className="sm:pw-hidden pw-block">{translate('token>pass>title')}</p>
        <p className="pw-hidden sm:pw-block">{translate('token>pass>back')}</p>
      </div>

      {successValidation == 'true' && <UsedPass />}

      {isInactive && (
        <InfoPass
          title={translate('token>pass>inactivePass')}
          description={translate('token>pass>inactivePassMessage')}
        />
      )}

      {(hasExpired || isUnavaible) && (
        <InfoPass
          title={translate('token>pass>passUnavailable')}
          description={translate('token>pass>passUnavailableMessage')}
        />
      )}

      <div className="pw-hidden sm:pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
        {translate('token>pass>title')}
      </div>

      <div className="pw-flex pw-flex-col">
        <div className="pw-flex pw-flex-col pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
          {successValidation == 'true' ? (
            <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-mb-[16px] pw-pb-[16px] pw-px-[24px] pw-border-b pw-border-[#EFEFEF]">
              <div className="pw-w-[20px] pw-h-[20px]">
                <CheckedIcon className="pw-stroke-[#295BA6] pw-w-[20px] pw-h-[20px]" />
              </div>
              <div className="pw-text-[#353945] pw-font-bold pw-text-[14px] pw-leading-[21px] pw-text-center">
                {translate('token>pass>checkedTime', {
                  time: format(new Date(), 'HH:mm'),
                })}
              </div>
            </div>
          ) : null}

          <div className="pw-flex pw-gap-[16px] pw-px-[24px]">
            {eventDate !== undefined && (
              <>
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
              </>
            )}
            <div className="pw-flex pw-flex-col pw-justify-center">
              <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                {publicTokenResponse?.data?.information?.title}
              </div>
              <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                {isBenefitSucceed &&
                  formatAddress({
                    type: benefit?.data?.type,
                    benefit: benefit?.data,
                  })}
              </div>
              {!hasExpired && (
                <div className="pw-flex pw-items-center pw-gap-2">
                  <span className="pw-text-[14px] pw-leading-[21px] pw-font-semibold pw-text-[#353945]">
                    {translate('token>pass>use')}
                  </span>
                  <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
                    {benefit?.data?.useLimit === 1
                      ? translate('token>pass>unique')
                      : translate('token>pass>youStillHave', {
                          quantity: benefit?.data?.useLimit,
                        })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {isInactive && (
            <InactiveDateUseToken
              eventDate={new Date(benefit?.data?.eventStartsAt || '')}
              title={translate('token>pass>useThisTokenFrom')}
            />
          )}
          {hasExpired ? (
            <div className="pw-w-full pw-flex pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
              <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
                {today
                  ? translate('token>pass>tokenExpiredAt')
                  : translate('token>pass>tokenExpiredIn')}
                <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                  {format(
                    new Date(benefit?.data?.eventEndsAt || ''),
                    today ? 'HH:mm' : 'dd/MM/yyyy'
                  )}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {!hasExpired &&
        !isInactive &&
        !isUnavaible &&
        isBenefitSucceed &&
        isTokenSucceed &&
        isSecretSucceed ? (
          <QrCodeSection
            eventDate={new Date(benefit?.data?.eventEndsAt)}
            tokenId={publicTokenResponse?.data?.token?.tokenId ?? ''}
            hasExpiration={hasExpiration}
            hasExpired={hasExpired}
            editionNumber={
              publicTokenResponse?.data?.edition?.currentNumber as string
            }
            secret={secret?.data?.secret}
          />
        ) : null}
      </div>

      <>
        <DetailsTemplate title={translate('token>pass>detailsPass')}>
          <DetailPass
            title={translate('token>pass>description')}
            description={benefit?.data?.description ?? ''}
          />

          <DetailPass
            title={translate('token>pass>rules')}
            description={benefit?.data?.rules ?? ''}
          />
        </DetailsTemplate>

        {benefit?.data?.type == TokenPassBenefitType.PHYSICAL ? (
          <DetailsTemplate title={translate('token>pass>useLocale')}>
            {benefit?.data?.tokenPassBenefitAddresses?.map((address) => (
              <div
                key={address?.name}
                className="pw-w-full pw-h-[200px]pw-rounded-[16px] pw-p-[24px] pw-shadow-[0px_4px_15px_rgba(0,0,0,0.07)] pw-flex pw-flex-col pw-gap-2"
              >
                <div className="pw-flex pw-flex-col pw-gap-1">
                  <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                    {address?.name}
                  </div>
                  <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                    {address?.street}
                    {', '}
                    {address?.city}
                    {' - '}
                    {address?.state}
                  </div>
                </div>
                <div className="pw-flex pw-flex-col pw-gap-1">
                  <div className="pw-text-[15px] pw-leading-[23px] pw-font-semibold pw-text-[#353945]">
                    {translate('token>pass>rules')}
                  </div>
                  <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                    {address?.rules}
                  </div>
                </div>
              </div>
            ))}
          </DetailsTemplate>
        ) : null}

        <DetailsTemplate title={translate('token>pass>detailsToken')}>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 xl:pw-grid-cols-4 pw-gap-[30px]">
            {detailsToken.map((item) => (
              <DetailToken
                key={item?.title}
                title={translate(item?.title)}
                description={item?.description ?? ''}
                copyDescription={item?.copyDescription}
                titleLink={item?.titleLink}
              />
            ))}
          </div>
        </DetailsTemplate>
      </>

      <div className="pw-flex pw-justify-center pw-items-center pw-text-[#777E8F] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
        {translate('token>pass>purchaseMade', {
          date: '14/02/2022',
          time: '15:51',
          order: '1528',
        })}
      </div>

      {successValidation && pass ? (
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
  ) : null;
};

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

export const PassTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_PassTemplate />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
