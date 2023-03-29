import { ReactNode, useMemo } from 'react';

import classNames from 'classnames';
import { format, getDay, isSameDay } from 'date-fns';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { BenefitStatus } from '../../../pass/enums/BenefitStatus';
import useGetBenefitsByEditionNumber from '../../../pass/hooks/useGetBenefitsByEditionNumber';
import useGetPassBenefitById from '../../../pass/hooks/useGetPassBenefitById';
import useGetQRCodeSecret from '../../../pass/hooks/useGetQRCodeSecret';
import { TokenPassBenefitType } from '../../../pass/interfaces/PassBenefitDTO';
import { InternalPagesLayoutBase } from '../../../shared';
import { ReactComponent as ArrowLeftIcon } from '../../../shared/assets/icons/arrowLeftOutlined.svg';
import { ReactComponent as CheckedIcon } from '../../../shared/assets/icons/checkCircledOutlined.svg';
import { ReactComponent as InfoCircledIcon } from '../../../shared/assets/icons/informationCircled.svg';
import { Alert } from '../../../shared/components/Alert';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import useAdressBlockchainLink from '../../../shared/hooks/useAdressBlockchainLink/useAdressBlockchainLink';
import { useChainScanLink } from '../../../shared/hooks/useChainScanLink';
import { useLocale } from '../../../shared/hooks/useLocale';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { DetailPass } from './DetailPass';
import { DetailsTemplate } from './DetailsTemplate';
import { DetailToken } from './DetailToken';
import { QrCodeSection } from './QrCodeSection';
import { UsedPass } from './UsedSection';

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
  const { pass } = useFlags();
  const [translate] = useTranslation();
  const locale = useLocale();
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

  const editionNumber = useMemo(() => {
    if (isTokenSucceed) {
      return publicTokenResponse?.data?.edition?.currentNumber;
    } else {
      return '';
    }
  }, [isTokenSucceed, publicTokenResponse?.data?.edition?.currentNumber]);

  const { data: benefitsResponse, isLoading: isLoadingBenefitsResponse } =
    useGetBenefitsByEditionNumber({
      tokenPassId: publicTokenResponse?.data?.group?.collectionId ?? '',
      editionNumber: +editionNumber,
    });

  const benefitData = benefitsResponse?.data.filter(
    (e) => e.id === benefit?.data.id
  );

  const { data: secret } = useGetQRCodeSecret({
    benefitId,
    editionNumber: editionNumber as string,
  });

  const hasExpired =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('ended the period of use');

  const waitCheckin =
    secret?.data?.statusCode === 400 &&
    secret?.data?.message?.includes('has check-in');

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
      benefitData[0]?.tokenPassBenefitAddresses
    ) {
      return `${benefitData[0]?.tokenPassBenefitAddresses[0]?.street}-${benefitData[0]?.tokenPassBenefitAddresses[0]?.city}`;
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

  const hasExpiration = benefit?.data?.eventEndsAt ? true : false;

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
    benefitData && benefitData[0]?.status === BenefitStatus.inactive;

  const isUnavaible =
    benefitData && benefitData[0]?.status === BenefitStatus.unavailable;

  const isDynamic = benefitData && benefitData[0]?.dynamicQrCode;

  const usesLeft =
    benefitData && benefitData[0]?.useAvailable >= 0
      ? benefitData[0].useAvailable
      : benefitData && benefitData[0]?.useLimit;

  const isSecretError = secret?.data?.error;

  const isSecretUndefined = secret?.data?.secret === undefined;

  if (isLoadingBenefit || isLoadingBenefitsResponse || isLoadingToken) {
    return (
      <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
        <Spinner />
      </div>
    );
  }
  if (pass) {
    return (
      <div className="pw-flex pw-flex-col pw-w-full sm:pw-rounded-[20px] sm:pw-p-[24px] sm:pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-gap-[30px] pw-mb-10">
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
                      {shortDay[(getDay(eventDate), locale)]}
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
                  {publicTokenResponse?.data?.information?.title} -{' '}
                  {benefitData && benefitData[0]?.name}
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
            </div>
            {(isInactive || isUnavaible) && !reachedUsageLimit && (
              <div className="pw-w-full pw-flex pw-flex-col pw-justify-center pw-items-center pw-mt-[16px] pw-pt-[16px] pw-px-[24px] pw-border-t pw-border-[#EFEFEF]">
                <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center">
                  {benefit?.data?.eventEndsAt
                    ? translate('token>pass>useThisTokenUntil')
                    : translate('token>pass>useThisTokenFrom')}
                  <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                    {format(
                      new Date(benefit?.data?.eventStartsAt || ''),
                      'dd/MM/yyyy'
                    )}
                    {benefit?.data?.eventEndsAt &&
                      translate('token>pass>until') +
                        format(
                          new Date(benefit?.data?.eventEndsAt || ''),
                          'dd/MM/yyyy'
                        )}
                  </span>
                </div>
                {benefit?.data?.checkInStartsAt && (
                  <div className="pw-flex pw-flex-col pw-text-[#353945] pw-font-normal pw-text-[14px] pw-leading-[21px] pw-text-center pw-mt-5">
                    {translate('token>pass>checkinAvaibleAt')}
                    <span className="pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px]">
                      {benefit?.data?.checkInStartsAt?.slice(0, 5)}
                      {benefit?.data?.checkInEndsAt &&
                        ' - ' + benefit?.data?.checkInEndsAt?.slice(0, 5)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          {!isSecretError &&
            !isInactive &&
            !isUnavaible &&
            !isSecretUndefined &&
            isBenefitSucceed &&
            isTokenSucceed && (
              <QrCodeSection
                eventDate={{
                  startDate: new Date(benefit?.data?.eventStartsAt),
                  endDate: new Date(benefit?.data?.eventEndsAt ?? ''),
                  checkInEnd: benefit?.data?.checkInEndsAt,
                  checkInStart: benefit?.data?.checkInStartsAt,
                }}
                hasExpiration={hasExpiration}
                hasExpired={hasExpired}
                editionNumber={
                  publicTokenResponse?.data?.edition?.currentNumber as string
                }
                secret={secret?.data?.secret}
                isDynamic={isDynamic ?? false}
              />
            )}
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

          {benefit?.data?.type == TokenPassBenefitType.PHYSICAL ? (
            <DetailsTemplate
              title={translate('token>pass>useLocale')}
              autoExpand={true}
            >
              {benefitData &&
                benefitData[0]?.tokenPassBenefitAddresses?.map((address) => (
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
                        CEP: {address?.postalCode}
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
    );
  } else {
    return null;
  }
};

export const PassTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_PassTemplate />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
