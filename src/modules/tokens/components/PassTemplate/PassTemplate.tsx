import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

import classNames from 'classnames';
import { format, getDay, isSameDay } from 'date-fns';

import { VerifyBenefit } from '../../../pass/components/VerifyBenefit';
import { BenefitStatus } from '../../../pass/enums/BenefitStatus';
import useGetBenefitsByEditionNumber from '../../../pass/hooks/useGetBenefitsByEditionNumber';
import useGetPassBenefitById from '../../../pass/hooks/useGetPassBenefitById';
import useGetQRCodeSecret from '../../../pass/hooks/useGetQRCodeSecret';
import usePostSelfUseBenefit from '../../../pass/hooks/usePostSelfUseBenefit';
import {
  TokenPassBenefitType,
  VerifyBenefitResponse,
} from '../../../pass/interfaces/PassBenefitDTO';
import ArrowLeftIcon from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import CheckedIcon from '../../../shared/assets/icons/checkCircledOutlined.svg';
import InfoCircledIcon from '../../../shared/assets/icons/informationCircled.svg';
import { ErrorBox } from '../../../shared/components/ErrorBox';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';

import { useChainScanLink } from '../../../shared/hooks/useChainScanLink';

import { useLocale } from '../../../shared/hooks/useLocale';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';

import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';


import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { ErrorModal } from './ErrorModal';
import { UsedPass } from './UsedSection';
import { Alert } from '../../../shared/components/Alert';
import { ImageSDK } from '../../../shared/components/ImageSDK';
import { InternalPagesLayoutBase } from '../../../shared/components/InternalPagesLayoutBase';
import { QrCodeValidated } from '../../../shared/components/QrCodeReader/QrCodeValidated';
import { Spinner } from '../../../shared/components/Spinner';
import useAdressBlockchainLink from '../../../shared/hooks/useAdressBlockchainLink';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { useProfile } from '../../../shared/hooks/useProfile';
import { DetailPass } from './DetailPass';
import { DetailsTemplate } from './DetailsTemplate';
import { DetailToken } from './DetailToken';
import { QrCodeSection } from './QrCodeSection';

import { useGetCollectionMetadata } from '../../hooks/useGetCollectionMetadata';
import { Button } from '../Button';
import useTranslation from '../../../shared/hooks/useTranslation';

interface PassTemplateProps {
  tokenIdProp?: string;
  benefitIdProp?: string;
  successValidationProp?: string;
}

interface formatAddressProps {
  type: TokenPassBenefitType;
}

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

const _PassTemplate = ({
  tokenIdProp,
  benefitIdProp,
  successValidationProp,
}: PassTemplateProps) => {
  const [translate] = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [selfUseData, setUseBenefitData] = useState<VerifyBenefitResponse>();
  const locale = useLocale();
  const router = useRouterConnect();

  const tokenId = tokenIdProp || (router?.query?.tokenId as string) || '';
  const benefitId = benefitIdProp || (router?.query?.benefitId as string) || '';
  const successValidation =
    successValidationProp || (router?.query?.success as string) || '';

  const { data: profile } = useProfile();

  const {
    data: benefit,
    isSuccess: isBenefitSucceed,
    isLoading: isLoadingBenefit,
    error: errorBenefit,
  } = useGetPassBenefitById(benefitId);

  const {
    data: collectionData,
    isLoading: collectionLoading,
    error: errorCollectionData,
  } = useGetCollectionMetadata({
    id: benefit?.data?.tokenPassId ?? '',
    query: {
      limit: 50,
      walletAddresses: [profile?.data?.mainWallet?.address ?? ''],
    },
  });

  const {
    data: publicTokenResponse,
    isSuccess: isTokenSucceed,
    isLoading: isLoadingToken,
    error: errorPublicToken,
  } = usePublicTokenData({
    contractAddress: benefit?.data?.tokenPass?.contractAddress ?? '',
    chainId: String(benefit?.data?.tokenPass?.chainId) ?? '',
    tokenId: String(tokenId ? tokenId : (collectionData?.items?.[0]?.tokenId ?? "")),
  });

  const editionNumber = useMemo(() => {
    if (isTokenSucceed) {
      return publicTokenResponse?.data?.edition?.currentNumber;
    } else {
      return '';
    }
  }, [isTokenSucceed, publicTokenResponse?.data?.edition?.currentNumber]);

  const {
    data: benefitsResponse,
    isLoading: isLoadingBenefitsResponse,
    error: errorBenefitsResponse,
  } = useGetBenefitsByEditionNumber({
    tokenPassId: publicTokenResponse?.data?.group?.collectionId ?? '',
    editionNumber: +editionNumber,
  });

  const benefitData = benefitsResponse?.data.find(
    (e) => e.id === benefit?.data.id
  );

  const {
    data: secret,
    isLoading: isLoadingSecret,
    refetch: refetchSecret,
  } = useGetQRCodeSecret({
    benefitId,
    editionNumber: editionNumber as string,
  });

  const {
    mutate: selfUseBenefit,
    isPending: isUseLoading,
    isSuccess: isUseSuccess,
    isError: isUseError,
    error: errorSelfUser,
  } = usePostSelfUseBenefit();

  useEffect(() => {
    if (isUseSuccess) {
      setShowSuccess(true);
      setShowVerify(false);
    }
  }, [isUseSuccess]);

  useEffect(() => {
    if (isUseError) {
      setShowError(true);
      setShowVerify(false);
    }
  }, [isUseError]);

  const handleClose = () => {
    router.push(PixwayAppRoutes.WALLET);
    setShowSuccess(false);
  };

  const hasExpired =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('ended the period of use');

  const waitCheckin =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('check-in');

  const reachedUsageLimit =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('reached the usage limit');

  const waitingToStart =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('will start the period of use');

  const shortDay = {
    'pt-BR': ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
    en: ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'],
  };

  const formatAddress = ({ type }: formatAddressProps) => {
    if (
      type == TokenPassBenefitType.PHYSICAL &&
      benefitData &&
      benefitData?.tokenPassBenefitAddresses
    ) {
      return `${benefitData?.tokenPassBenefitAddresses[0]?.street}-${benefitData?.tokenPassBenefitAddresses[0]?.city}`;
    } else {
      return 'Online';
    }
  };
  const chainScanLink = useChainScanLink(
    benefit && +benefit?.data?.tokenPass?.chainId,
    publicTokenResponse?.data?.edition?.mintedHash
  );
  const addresBlockchainLink = useAdressBlockchainLink(
    benefit && +benefit?.data?.tokenPass?.chainId,
    benefit?.data?.tokenPass?.contractAddress
  );

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
      titleLink: addresBlockchainLink,
    },
    {
      title: 'token>pass>mintedBy',
      description: publicTokenResponse?.data?.edition?.mintedHash,
      copyDescription: true,
      titleLink: chainScanLink,
    },
    {
      title: 'token>pass>network',
      description: 'MATIC Polygon',
      copyDescription: false,
      titleLink: '',
    },
  ];

  const isSingleDate =
    benefit &&
    benefit?.data?.eventEndsAt &&
    isSameDay(
      new Date(benefit.data.eventStartsAt),
      new Date(benefit.data.eventEndsAt)
    );

  const eventDate = isSingleDate
    ? new Date(benefit.data.eventStartsAt)
    : undefined;

  const isInactive =
    benefitData && benefitData?.status === BenefitStatus.inactive;

  const isUnavaible =
    benefitData && benefitData?.status === BenefitStatus.unavailable;

  const isDynamic = benefitData && benefitData?.dynamicQrCode;

  const usesLeft =
    benefitData && benefitData?.useAvailable >= 0
      ? benefitData.useAvailable
      : benefitData && benefitData?.useLimit;

  const isSecretError = secret?.data?.error;

  const renderCheckInTime = () => {
    const weekDay = {
      'pt-BR': {
        sun: 'Domingo',
        mon: 'Segunda-feira',
        tue: 'Terça-feira',
        wed: 'Quarta-feira',
        thu: 'Quinta-feira',
        fri: 'Sexta-feira',
        sat: 'Sábado',
        all: 'Todos os dias',
      },
      en: {
        sun: 'Sunday',
        mon: 'Monday',
        tue: 'Tuesday',
        wed: 'Wednesday',
        thu: 'Thursday',
        fri: 'Friday',
        sat: 'Saturday',
        all: 'All days',
      },
    };

    const weekDay1 = {
      'pt-BR': [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado',
      ],
      en: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
    };

    const ordinal = {
      'pt-BR': ['primeira', 'segunda', 'terceira', 'quarta'],
      en: ['first', 'second', 'third', 'fourth'],
    };

    type Week = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'all';
    const response: JSX.Element[] = [];
    Object.keys(benefit?.data?.checkIn ?? {}).forEach((val) => {
      response.push(
        val !== 'special' ? (
          <div key={val} className="pw-flex sm:pw-flex-row pw-flex-col">
            <p className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
              {weekDay[locale][val as Week]}
            </p>
            <div className="pw-flex">
              {val !== 'all' &&
                benefit?.data?.checkIn?.[val]?.map(
                  (val: { start: string; end: string }, index: number) => {
                    return (
                      <p
                        key={val.start}
                        className="pw-text-[#777E8F] pw-font-semibold pw-text-[18px] pw-leading-[23px]"
                      >
                        {index > 0 ? ', ' : ': '}
                        {val.start}
                        {val?.end && ' - ' + val.end}
                      </p>
                    );
                  }
                )}
            </div>
          </div>
        ) : (
          benefit?.data?.checkIn?.[val]?.map(
            (value: {
              start: string;
              end: string;
              data: { nthWeek: number; weekday: number };
            }) => {
              return (
                <div key={val} className="pw-flex sm:pw-flex-row pw-flex-col">
                  <p className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                    {locale == 'en' ? (
                      <>
                        {`Every ${ordinal[locale][value.data.nthWeek]} ${weekDay1[locale][value.data.weekday]
                          } of the month`}
                      </>
                    ) : (
                      <>
                        {`Toda ${ordinal[locale][value.data.nthWeek]
                          } semana do mês
                        na ${weekDay1[locale][value.data.weekday]}`}
                      </>
                    )}
                  </p>
                  <div>
                    <p className="pw-text-[#777E8F] pw-font-semibold pw-text-[18px] pw-leading-[23px]">
                      {value?.start && ': ' + value.start}
                      {value?.end && ' - ' + value.end}
                    </p>
                  </div>
                </div>
              );
            }
          )
        )
      );
    });

    const sorter = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      all: 7,
      special: 8,
    };
    response.sort((a, b) => {
      const day1 = a.key as Week;
      const day2 = b.key as Week;
      return sorter[day1] - sorter[day2];
    });
    return response;
  };

  useEffect(() => {
    if (collectionData?.items.length === 1) {
      router.pushConnect(
        PixwayAppRoutes.USE_BENEFIT.replace('{benefitId}', benefitId).concat(
          `?tokenId=${collectionData?.items[0].tokenId}`
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionData?.items]);

  const handleUseBenefit = () =>
    selfUseBenefit(
      {
        body: { editionNumber: editionNumber, userId: profile?.data?.id || '' },
        benefitId,
      },
      {
        onSuccess(data) {
          setUseBenefitData(data.data);
        },
      }
    );

  if (
    isLoadingBenefit ||
    isLoadingBenefitsResponse ||
    isLoadingToken ||
    isLoadingSecret
  ) {
    return (
      <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
        <Spinner />
      </div>
    );
  }
  if (tokenId) {
    return errorBenefit || errorBenefitsResponse ? (
      <>
        <ErrorBox customError={errorBenefit} />
        <ErrorBox customError={errorBenefitsResponse} />
      </>
    ) : (
      <div className="pw-mx-[22px] sm:pw-mx-0 ">
        <div className="pw-bg-white pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
          <div
            className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

            <p className="sm:pw-hidden pw-block">
              {translate('token>pass>title')}
            </p>
            <p className="pw-hidden sm:pw-block">
              {translate('token>pass>back')}
            </p>
          </div>

          {successValidation == 'true' && <UsedPass />}

          {(isInactive || waitCheckin) && (
            <InfoPass
              title={translate('token>pass>inactivePass')}
              description={translate('token>pass>inactivePassMessage')}
            />
          )}

          {(hasExpired || reachedUsageLimit) && isUnavaible && (
            <InfoPass
              title={translate('token>pass>passUnavailable')}
              description={translate('token>pass>passUnavailableMessage')}
            />
          )}

          {isSecretError &&
            !hasExpired &&
            !waitCheckin &&
            !reachedUsageLimit &&
            !waitingToStart && (
              <Alert variant="error">{secret?.data?.message}</Alert>
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
                        {shortDay[locale][getDay(eventDate)]}
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
                <div className="pw-flex sm:pw-flex-row pw-flex-col pw-w-full sm:pw-justify-between pw-justify-center">
                  <div className="pw-flex pw-flex-col pw-justify-center">
                    <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                      {publicTokenResponse?.data?.information?.title} -{' '}
                      {benefitData && benefitData?.name}
                    </div>
                    <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                      {isBenefitSucceed &&
                        formatAddress({
                          type: benefit?.data?.type,
                        })}
                    </div>
                    {!hasExpired && (
                      <div className="pw-flex pw-items-center pw-gap-2">
                        <span className="pw-text-[14px] pw-leading-[21px] pw-font-semibold pw-text-[#353945]">
                          {translate('token>pass>use')}
                        </span>
                        <div className="pw-text-[13px] pw-leading-[19.5px] pw-font-normal pw-text-[#777E8F]">
                          {usesLeft === 0
                            ? translate('token>pass>noMoreUses')
                            : translate('token>pass>youStillHave', {
                              quantity: usesLeft,
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                  {benefit?.data?.allowSelfUse &&
                    !isSecretError &&
                    !isInactive &&
                    !isUnavaible &&
                    isBenefitSucceed &&
                    isTokenSucceed && (
                      <Button
                        onClick={() => setShowVerify(true)}
                        className="!pw-h-[40px] !pw-mb-auto !pw-mt-[20px] sm:!pw-mt-auto"
                      >
                        {translate('token>pass>selfUse')}
                      </Button>
                    )}
                </div>
              </div>
              <ErrorBox customError={errorPublicToken} />
              {!isSecretError &&
                !isInactive &&
                !isUnavaible &&
                isBenefitSucceed &&
                isTokenSucceed &&
                !errorPublicToken && (
                  <QrCodeSection
                    hasExpired={hasExpired}
                    editionNumber={
                      publicTokenResponse?.data?.edition
                        ?.currentNumber as string
                    }
                    benefitId={benefitId}
                    secret={secret?.data?.secret}
                    isDynamic={isDynamic ?? false}
                    refetchSecret={refetchSecret}
                  />
                )}
              {errorBenefit ? (
                <ErrorBox customError={errorBenefit} />
              ) : (
                <div className="pw-w-full pw-flex pw-flex-col pw-pt-[16px] pw-px-[16px]">
                  <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px]">
                    {benefit?.data?.eventEndsAt
                      ? translate('token>pass>useThisTokenUntil')
                      : translate('token>pass>useThisTokenFrom')}
                    <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                      {benefit?.data?.eventStartsAt &&
                        format(
                          new Date(benefit?.data?.eventStartsAt),
                          'dd/MM/yyyy'
                        )}
                      {benefit?.data?.eventEndsAt &&
                        translate('token>pass>until') +
                        format(
                          new Date(benefit?.data?.eventEndsAt),
                          'dd/MM/yyyy'
                        )}
                    </span>
                  </div>
                  {benefit?.data?.checkIn && (
                    <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-mt-5">
                      {translate('token>pass>checkinAvaibleAt')}
                      {renderCheckInTime()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {benefit?.data?.allowSelfUse && (
            <>
              <ErrorModal
                hasOpen={showError}
                onClose={() => setShowError(false)}
              />
              <QrCodeValidated
                hasOpen={showSuccess}
                onClose={handleClose}
                name={selfUseData?.tokenPassBenefit?.name}
                type={selfUseData?.tokenPassBenefit?.type}
                tokenPassBenefitAddresses={
                  benefitData?.tokenPassBenefitAddresses
                }
                userEmail={selfUseData?.user?.email}
                userName={selfUseData?.user?.name}
              />
              <VerifyBenefit
                hasOpen={showVerify}
                isLoading={isUseLoading}
                onClose={() => setShowVerify(false)}
                useBenefit={handleUseBenefit}
                data={benefitData}
                user={{ email: profile?.data.email, name: profile?.data.name }}
                tokenPassBenefitAddresses={
                  benefitData?.tokenPassBenefitAddresses
                }
                errorUseBenefit={errorSelfUser}
              />
            </>
          )}

          <>
            <DetailsTemplate
              title={translate('token>pass>detailsPass')}
              autoExpand={true}
            >
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
              <DetailsTemplate
                title={translate('token>pass>useLocale')}
                autoExpand={true}
              >
                {benefitData?.tokenPassBenefitAddresses?.map((address) => (
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
                        {address?.number}
                        {', '}
                        {address?.city}
                        {' - '}
                        {address?.state}
                      </div>
                      <div className="pw-text-[14px] pw-leading-[21px] pw-font-normal pw-text-[#777E8F]">
                        {translate('tokens>passTemplate>postalCode')}:{' '}
                        {address?.postalCode}
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

          {successValidation ? (
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
      </div>
    );
  } else {
    return errorBenefit || errorCollectionData || errorBenefitsResponse ? (
      <>
        <ErrorBox customError={errorBenefit} />
        <ErrorBox customError={errorCollectionData} />
        <ErrorBox customError={errorBenefitsResponse} />
      </>
    ) : (
      <div className="pw-px-4 sm:pw-px-0">
        {collectionLoading || collectionData?.items.length === 1 ? (
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="pw-bg-white pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
              <div
                className="pw-relative pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-cursor-pointer pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#353945]"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon className="pw-absolute pw-left-0 sm:pw-relative pw-stroke-[#295BA6]" />

                <p className="sm:pw-hidden pw-block">
                  {translate('token>pass>title')}
                </p>
                <p className="pw-hidden sm:pw-block">
                  {translate('token>pass>back')}
                </p>
              </div>
              <div className="pw-hidden sm:pw-flex pw-justify-center sm:pw-justify-start pw-items-center pw-gap-1 pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#353945]">
                {translate('token>pass>title')}
              </div>
              <div className="pw-flex pw-flex-col">
                <div className="pw-flex pw-flex-col pw-rounded-[16px] pw-border pw-border-[#EFEFEF] pw-py-[16px]">
                  <div className="pw-flex pw-gap-[16px] pw-px-[16px]">
                    {eventDate !== undefined && (
                      <>
                        <div className="pw-flex pw-flex-col pw-w-[120px] pw-justify-center pw-items-center">
                          <div className="pw-text-[24px] pw-leading-[36px] pw-font-bold pw-text-[#295BA6] pw-text-center">
                            {shortDay[locale][getDay(eventDate)]}
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
                    <div className="pw-text-[18px] pw-leading-[23px] pw-font-bold pw-text-[#295BA6]">
                      {benefit?.data.tokenPass.tokenName} - {benefit?.data.name}
                    </div>
                  </div>
                  <div className="pw-p-4">
                    {collectionData?.items.length === 0 ? (
                      <p className="pw-text-black pw-text-base pw-font-semibold">
                        {translate('tokens>passTemplate>notTokenBenefit')}
                      </p>
                    ) : (
                      <>
                        <p className="pw-text-black pw-text-base pw-font-medium">
                          {translate('tokens>passTemplate>moreTokensBenefit1')}{' '}
                          <b>{benefit?.data.name}</b>{' '}
                          {translate('tokens>passTemplate>moreTokensBenefit2')}:{' '}
                        </p>
                        {collectionData?.items.map((val: { id: Key | null | undefined; mainImage: string | undefined; editionNumber: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | Iterable<ReactNode> | null | undefined; tokenId: any; }) => {
                          return (
                            <div
                              key={val.id}
                              className="pw-flex pw-flex-row pw-items-center pw-gap-5 pw-border-b pw-border-[#EFEFEF] pw-p-3"
                            >
                              <ImageSDK
                                src={val.mainImage}
                                className="pw-h-[120px]"
                              />
                              <div className="pw-flex pw-flex-col">
                                <p className="pw-text-black pw-text-base pw-mb-2">
                                  {translate(
                                    'tokens>tokenTransferController>edition'
                                  )}
                                  : {'#'}
                                  {val.editionNumber}
                                </p>
                                <Button
                                  className="pw-w-full"
                                  onClick={() =>
                                    router.pushConnect(
                                      PixwayAppRoutes.USE_BENEFIT.replace(
                                        '{benefitId}',
                                        benefitId
                                      ).concat(`?tokenId=${val.tokenId}`)
                                    )
                                  }
                                >
                                  {translate('token>pass>benefits>useBenefit')}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                  <div className="pw-w-full pw-flex pw-flex-col pw-px-[16px]">
                    <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px]">
                      {benefit?.data?.eventEndsAt
                        ? translate('token>pass>useThisTokenUntil')
                        : translate('token>pass>useThisTokenFrom')}
                      <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                        {benefit?.data?.eventStartsAt &&
                          format(
                            new Date(benefit?.data?.eventStartsAt),
                            'dd/MM/yyyy'
                          )}
                        {benefit?.data?.eventEndsAt &&
                          translate('token>pass>until') +
                          format(
                            new Date(benefit?.data?.eventEndsAt),
                            'dd/MM/yyyy'
                          )}
                      </span>
                    </div>
                    {benefit?.data?.checkIn && (
                      <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-mt-5">
                        {translate('token>pass>checkinAvaibleAt')}
                        {renderCheckInTime()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <>
                <DetailsTemplate
                  title={translate('token>pass>detailsPass')}
                  autoExpand={true}
                >
                  <DetailPass
                    title={translate('token>pass>description')}
                    description={benefit?.data?.description ?? ''}
                  />

                  <DetailPass
                    title={translate('token>pass>rules')}
                    description={benefit?.data?.rules ?? ''}
                  />
                </DetailsTemplate>
              </>
            </div>
          </>
        )}
      </div>
    );
  }
};

export const PassTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  useHasWallet({});
  if (!isAuthorized || isLoading) {
    return null;
  }
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <_PassTemplate />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
