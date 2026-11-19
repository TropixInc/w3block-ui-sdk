/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
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
import CheckedIcon from '../../../shared/assets/icons/checkCircledOutlined.svg';
import InfoCircledIcon from '../../../shared/assets/icons/informationCircled.svg';
import { Alert } from '../../../shared/components/Alert';
import { BaseButton } from '../../../shared/components/Buttons';
import { ErrorBox } from '../../../shared/components/ErrorBox';
import { ImageSDK } from '../../../shared/components/ImageSDK';
import { InternalPagesLayoutBase } from '../../../shared/components/InternalPagesLayoutBase';
import { QrCodeValidated } from '../../../shared/components/QrCodeReader/QrCodeValidated';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import {
  DefinitionItem,
  DefinitionList,
} from '../../../shared/components/ui/DefinitionList';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { SectionCard } from '../../../shared/components/ui/SectionCard';
import { StatusPill } from '../../../shared/components/ui/StatusPill';
import { TONE_CLASSES, Tone, UI } from '../../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import useAdressBlockchainLink from '../../../shared/hooks/useAdressBlockchainLink';
import { useChainScanLink } from '../../../shared/hooks/useChainScanLink';
import { useHasWallet } from '../../../shared/hooks/useHasWallet';
import { useLocale } from '../../../shared/hooks/useLocale';
import { usePrivateRoute } from '../../../shared/hooks/usePrivateRoute';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import useTranslation from '../../../shared/hooks/useTranslation';
import { sanitizeHtml } from '../../../shared/utils/sanitizeHtml';
import { useGetCollectionMetadata } from '../../hooks/useGetCollectionMetadata';
import { usePublicTokenData } from '../../hooks/usePublicTokenData';
import { ErrorModal } from './ErrorModal';
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

/** Tone box used for "benefit inactive / unavailable" notices. */
export const InfoPass = ({
  title,
  description,
  tone = 'warn',
}: {
  title: string;
  description: string;
  tone?: Tone;
}) => {
  return (
    <div
      className={classNames(
        'pw-rounded-[10px] pw-w-full pw-p-3.5 pw-flex pw-gap-2.5 pw-text-[13px]',
        TONE_CLASSES[tone]
      )}
    >
      <InfoCircledIcon className="pw-w-4 pw-h-4 pw-shrink-0 pw-mt-0.5" />
      <div className="pw-grid pw-gap-0.5">
        <div className="pw-font-semibold">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
};

const statusTone = (status?: BenefitStatus): Tone =>
  status === BenefitStatus.active
    ? 'ok'
    : status === BenefitStatus.inactive
    ? 'bad'
    : 'grey';
const statusKey = (status?: BenefitStatus) =>
  status === BenefitStatus.active
    ? 'tokens>StatusTag>active'
    : status === BenefitStatus.inactive
    ? 'tokens>StatusTag>inactive'
    : 'tokens>StatusTag>unavailable';

/** Locale strings of the old layout end with ":"; the definition list has its own labels. */
const noColon = (value: string) => value.replace(/:\s*$/, '');

const shortHash = (value?: string) =>
  value && value.length > 18
    ? `${value.slice(0, 10)}…${value.slice(-6)}`
    : value ?? '';

/** Small "Copiar" text button for hashes. */
const CopyButton = ({ value }: { value: string }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [translate] = useTranslation();
  return (
    <button
      type="button"
      className={classNames(UI.link, 'pw-bg-transparent pw-border-0 pw-p-0')}
      onClick={() => {
        copyToClipboard(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied
        ? translate('tokens>passTemplate>copied')
        : translate('tokens>passTemplate>copy')}
    </button>
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
    isFetching: isLoadingBenefit,
    error: errorBenefit,
  } = useGetPassBenefitById(benefitId);

  const {
    data: collectionData,
    isFetching: collectionLoading,
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
    isFetching: isLoadingToken,
    error: errorPublicToken,
  } = usePublicTokenData({
    contractAddress: benefit?.data?.tokenPass?.contractAddress ?? '',
    chainId: String(benefit?.data?.tokenPass?.chainId) ?? '',
    tokenId: String(
      tokenId ? tokenId : collectionData?.items?.[0]?.tokenId ?? ''
    ),
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
    isFetching: isLoadingBenefitsResponse,
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
    isFetching: isFetchingSecret,
    refetch: refetchSecret,
  } = useGetQRCodeSecret({
    benefitId,
    editionNumber: editionNumber as string,
  });

  const isLoadingSecret = isFetchingSecret && !secret?.data?.secret;

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
      return [
        benefitData?.tokenPassBenefitAddresses[0]?.street,
        benefitData?.tokenPassBenefitAddresses[0]?.city,
      ]
        .filter(Boolean)
        .join(' · ');
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

    const dayClass = classNames('pw-font-semibold pw-text-[13.5px]', UI.text);
    const timeClass = classNames('pw-text-[13.5px]', UI.textSecondary);

    type Week = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'all';
    const response: JSX.Element[] = [];
    Object.keys(benefit?.data?.checkIn ?? {}).forEach((val) => {
      response.push(
        val !== 'special' ? (
          <div key={val} className="pw-flex pw-flex-wrap pw-gap-x-1">
            <p className={classNames(dayClass, 'pw-m-0')}>
              {weekDay[locale][val as Week]}
            </p>
            <div className="pw-flex">
              {val !== 'all' &&
                benefit?.data?.checkIn?.[val]?.map(
                  (val: { start: string; end: string }, index: number) => {
                    return (
                      <p
                        key={val.start}
                        className={classNames(timeClass, 'pw-m-0')}
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
                <div key={val} className="pw-flex pw-flex-wrap pw-gap-x-1">
                  <p className={classNames(dayClass, 'pw-m-0')}>
                    {locale == 'en' ? (
                      <>
                        {`Every ${ordinal[locale][value.data.nthWeek]} ${
                          weekDay1[locale][value.data.weekday]
                        } of the month`}
                      </>
                    ) : (
                      <>
                        {`Toda ${
                          ordinal[locale][value.data.nthWeek]
                        } semana do mês
                        na ${weekDay1[locale][value.data.weekday]}`}
                      </>
                    )}
                  </p>
                  <div>
                    <p className={classNames(timeClass, 'pw-m-0')}>
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

  // ---------------------------------------------------------------- pieces
  const formatDate = (value?: string) =>
    value && Date.parse(value) ? format(new Date(value), 'dd/MM/yyyy') : '';

  const usagePeriod = benefit?.data?.eventEndsAt
    ? `${formatDate(benefit?.data?.eventStartsAt)}${translate(
        'token>pass>until'
      )}${formatDate(benefit?.data?.eventEndsAt)}`
    : benefit?.data?.eventStartsAt
    ? `${translate('token>pass>useThisTokenFrom')} ${formatDate(
        benefit?.data?.eventStartsAt
      )}`
    : '';

  const periodItems: DefinitionItem[] = [
    ...(usagePeriod
      ? [
          {
            term: translate('tokens>passTemplate>usagePeriod'),
            value: usagePeriod,
          },
        ]
      : []),
    ...(benefit?.data?.checkIn
      ? [
          {
            term: translate('tokens>passTemplate>checkIn'),
            value: (
              <div className="pw-grid pw-gap-0.5">{renderCheckInTime()}</div>
            ),
            wide: true,
          },
        ]
      : []),
  ];

  const eventDateBlock =
    eventDate !== undefined ? (
      <div
        className={classNames(
          'pw-flex pw-flex-col pw-items-center pw-justify-center pw-rounded-[10px] pw-px-4 pw-py-3 pw-min-w-[96px]',
          UI.surfaceGrey
        )}
      >
        <span className={classNames('pw-text-[18px] pw-font-bold', UI.text)}>
          {shortDay[locale][getDay(eventDate)]}
        </span>
        <span className={classNames('pw-text-[12px]', UI.textMuted)}>
          {format(eventDate, 'dd MMM yyyy')}
        </span>
        <span
          className={classNames('pw-text-[13px] pw-font-semibold', UI.text)}
        >
          {format(eventDate, "HH'h'mm")}
        </span>
      </div>
    ) : null;

  const descriptionCard = (
    <SectionCard title={translate('token>pass>detailsPass')}>
      <DefinitionList
        items={[
          {
            term: translate('token>pass>description'),
            value: (
              <div
                className="pw-font-normal [&_p]:pw-m-0"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(benefit?.data?.description ?? ''),
                }}
              />
            ),
            wide: true,
          },
          ...(benefit?.data?.rules
            ? [
                {
                  term: translate('token>pass>rules'),
                  value: (
                    <div
                      className="pw-font-normal [&_p]:pw-m-0"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(benefit?.data?.rules ?? ''),
                      }}
                    />
                  ),
                  wide: true,
                },
              ]
            : []),
        ]}
      />
    </SectionCard>
  );

  const notices: ReactNode = (
    <>
      {successValidation == 'true' && (
        <SectionCard>
          <UsedPass />
        </SectionCard>
      )}
      {(isInactive || waitCheckin) && (
        <InfoPass
          title={translate('token>pass>inactivePass')}
          description={translate('token>pass>inactivePassMessage')}
        />
      )}
      {(hasExpired || reachedUsageLimit) && isUnavaible && (
        <InfoPass
          tone="grey"
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
    </>
  );

  if (
    isLoadingBenefit ||
    isLoadingBenefitsResponse ||
    isLoadingToken ||
    isLoadingSecret
  ) {
    return (
      <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center pw-py-16">
        <Spinner />
      </div>
    );
  }

  if (tokenId) {
    const canSelfUse =
      benefit?.data?.allowSelfUse &&
      !isSecretError &&
      !isInactive &&
      !isUnavaible &&
      isBenefitSucceed &&
      isTokenSucceed;
    const showQr =
      !isSecretError &&
      !isInactive &&
      !isUnavaible &&
      isBenefitSucceed &&
      isTokenSucceed &&
      !errorPublicToken;
    const addresses = benefitData?.tokenPassBenefitAddresses ?? [];

    return errorBenefit || errorBenefitsResponse ? (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <ErrorBox customError={errorBenefit} />
        <ErrorBox customError={errorBenefitsResponse} />
      </div>
    ) : (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-mb-10">
        <PageHeader
          back={{
            label: translate('token>pass>back'),
            onClick: () => router.back(),
          }}
          title={
            benefitData?.name ??
            benefit?.data?.name ??
            translate('token>pass>title')
          }
          subtitle={[
            publicTokenResponse?.data?.information?.title,
            isBenefitSucceed
              ? formatAddress({ type: benefit?.data?.type })
              : '',
          ]
            .filter(Boolean)
            .join(' · ')}
          actions={
            canSelfUse ? (
              <BaseButton onClick={() => setShowVerify(true)}>
                {translate('token>pass>selfUse')}
              </BaseButton>
            ) : undefined
          }
        />

        {notices}

        <SectionCard>
          {successValidation == 'true' ? (
            <div
              className={classNames(
                'pw-flex pw-items-center pw-justify-center pw-gap-2 pw-pb-3 pw-mb-3 pw-border-b pw-text-[13px] pw-font-semibold',
                UI.line,
                UI.text
              )}
            >
              <CheckedIcon className="pw-stroke-brand-primary pw-w-5 pw-h-5" />
              {translate('token>pass>checkedTime', {
                time: format(new Date(), 'HH:mm'),
              })}
            </div>
          ) : null}

          <div className="pw-flex pw-flex-col sm:pw-flex-row sm:pw-items-center pw-gap-4">
            {eventDateBlock}
            <div className="pw-flex pw-flex-wrap pw-items-center pw-gap-x-3 pw-gap-y-2 pw-min-w-0">
              <StatusPill tone={statusTone(benefitData?.status)}>
                {translate(statusKey(benefitData?.status))}
              </StatusPill>
              {!hasExpired && benefitData ? (
                <span
                  className={classNames('pw-text-[13px]', UI.textSecondary)}
                >
                  {usesLeft === 0
                    ? translate('token>pass>noMoreUses')
                    : usesLeft === 1
                    ? translate('tokens>passTemplate>oneUseLeft')
                    : translate('tokens>passTemplate>usesLeft', {
                        quantity: usesLeft,
                      })}
                </span>
              ) : null}
            </div>
          </div>

          <ErrorBox customError={errorPublicToken} />

          {showQr ? (
            <QrCodeSection
              hasExpired={hasExpired}
              editionNumber={
                publicTokenResponse?.data?.edition?.currentNumber as string
              }
              benefitId={benefitId}
              secret={secret?.data?.secret}
              isDynamic={isDynamic ?? false}
              refetchSecret={refetchSecret}
              rootClassnames="pw-mt-4 pw-border-b-0 pw-pb-0"
            />
          ) : null}

          {periodItems.length ? (
            <DefinitionList
              items={periodItems}
              className={classNames('pw-pt-4 pw-mt-2 pw-border-t', UI.line)}
            />
          ) : null}
        </SectionCard>

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
              tokenPassBenefitAddresses={benefitData?.tokenPassBenefitAddresses}
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
              tokenPassBenefitAddresses={benefitData?.tokenPassBenefitAddresses}
              errorUseBenefit={errorSelfUser}
            />
          </>
        )}

        {descriptionCard}

        {benefit?.data?.type == TokenPassBenefitType.PHYSICAL &&
        addresses.length ? (
          <SectionCard title={translate('token>pass>useLocale')}>
            <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-3">
              {addresses.map((address) => (
                <div
                  key={`${address?.name}-${address?.street}`}
                  className={classNames(
                    'pw-rounded-[10px] pw-border pw-p-3.5 pw-grid pw-gap-1 pw-text-[13px]',
                    UI.line,
                    UI.textSecondary
                  )}
                >
                  <span
                    className={classNames(
                      'pw-text-[14px] pw-font-semibold',
                      UI.text
                    )}
                  >
                    {address?.name}
                  </span>
                  <span>
                    {[address?.street, address?.number]
                      .filter(Boolean)
                      .join(', ')}
                    {address?.city ? `, ${address.city}` : ''}
                    {address?.state ? ` - ${address.state}` : ''}
                  </span>
                  {address?.postalCode ? (
                    <span>
                      {translate('tokens>passTemplate>postalCode')}:{' '}
                      {address.postalCode}
                    </span>
                  ) : null}
                  {address?.rules ? (
                    <div className="pw-mt-1">
                      <span className={UI.label}>
                        {translate('token>pass>rules')}
                      </span>
                      <div>{address.rules}</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title={translate('tokens>passTemplate>tokenDetails')}>
          <DefinitionList
            items={[
              {
                term: noColon(translate('token>pass>tokenName')),
                value: publicTokenResponse?.data?.information?.title ?? '—',
              },
              {
                term: noColon(translate('token>pass>network')),
                value: 'MATIC Polygon',
              },
              {
                term: translate('token>pass>linkBlockchain'),
                value: addresBlockchainLink ? (
                  <a
                    href={addresBlockchainLink}
                    target="_blank"
                    rel="noreferrer"
                    className={UI.link}
                  >
                    {translate('tokens>passTemplate>viewOnBlockchain')}
                  </a>
                ) : (
                  '—'
                ),
              },
              {
                term: noColon(translate('token>pass>mintedBy')),
                value: publicTokenResponse?.data?.edition?.mintedHash ? (
                  <span className="pw-inline-flex pw-items-center pw-gap-2 pw-min-w-0">
                    {chainScanLink ? (
                      <a
                        href={chainScanLink}
                        target="_blank"
                        rel="noreferrer"
                        className={classNames(
                          UI.link,
                          'pw-font-mono pw-text-[12.5px]'
                        )}
                      >
                        {shortHash(publicTokenResponse.data.edition.mintedHash)}
                      </a>
                    ) : (
                      <span className="pw-font-mono pw-text-[12.5px]">
                        {shortHash(publicTokenResponse.data.edition.mintedHash)}
                      </span>
                    )}
                    <CopyButton
                      value={publicTokenResponse.data.edition.mintedHash}
                    />
                  </span>
                ) : (
                  '—'
                ),
              },
            ]}
          />
        </SectionCard>

        {successValidation ? (
          <div className="pw-flex pw-flex-col pw-gap-2 sm:pw-hidden">
            <BaseButton
              className="pw-w-full"
              onClick={() => router.push(PixwayAppRoutes.WALLET)}
            >
              {translate('token>pass>tokenPage')}
            </BaseButton>
            <button
              type="button"
              className={classNames(UI.buttonSecondary, 'pw-w-full')}
              onClick={() => router.back()}
            >
              {translate('token>pass>back')}
            </button>
          </div>
        ) : null}
      </div>
    );
  } else {
    return errorBenefit || errorCollectionData || errorBenefitsResponse ? (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <ErrorBox customError={errorBenefit} />
        <ErrorBox customError={errorCollectionData} />
        <ErrorBox customError={errorBenefitsResponse} />
      </div>
    ) : (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-mb-10">
        {collectionLoading || collectionData?.items.length === 1 ? (
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center pw-py-16">
            <Spinner />
          </div>
        ) : (
          <>
            <PageHeader
              back={{
                label: translate('token>pass>back'),
                onClick: () => router.back(),
              }}
              title={benefit?.data?.name ?? translate('token>pass>title')}
              subtitle={benefit?.data?.tokenPass?.tokenName}
            />

            <SectionCard title={translate('tokens>passTemplate>chooseToken')}>
              <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4">
                {eventDateBlock}
                <div className="pw-flex-1 pw-min-w-0">
                  {collectionData?.items.length === 0 ? (
                    <EmptyState
                      bare
                      title={translate('tokens>passTemplate>notTokenBenefit')}
                      className="pw-py-4"
                    />
                  ) : (
                    <>
                      <p
                        className={classNames(
                          'pw-m-0 pw-mb-3 pw-text-[13px]',
                          UI.textSecondary
                        )}
                      >
                        {translate('tokens>passTemplate>moreTokensBenefit1')}{' '}
                        <b className={UI.text}>{benefit?.data.name}</b>{' '}
                        {translate('tokens>passTemplate>moreTokensBenefit2')}:
                      </p>
                      <div className="pw-grid pw-gap-2">
                        {collectionData?.items.map((val: any) => (
                          <div
                            key={val.id}
                            className={classNames(
                              'pw-flex pw-items-center pw-gap-3 pw-rounded-[10px] pw-border pw-p-3',
                              UI.line
                            )}
                          >
                            <ImageSDK
                              src={val.mainImage}
                              className="pw-w-14 pw-h-14 pw-rounded-[8px] pw-object-cover pw-shrink-0"
                            />
                            <div className="pw-flex-1 pw-min-w-0">
                              <p
                                className={classNames(
                                  'pw-m-0 pw-text-[13.5px] pw-font-semibold pw-truncate',
                                  UI.text
                                )}
                              >
                                {val.name ||
                                  benefit?.data?.tokenPass?.tokenName}
                              </p>
                              <p
                                className={classNames(
                                  'pw-m-0 pw-text-[12.5px]',
                                  UI.textMuted
                                )}
                              >
                                {translate(
                                  'tokens>tokenTransferController>edition'
                                )}{' '}
                                #{val.editionNumber}
                              </p>
                            </div>
                            <BaseButton
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
                            </BaseButton>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {periodItems.length ? (
                <DefinitionList
                  items={periodItems}
                  className={classNames('pw-pt-4 pw-mt-4 pw-border-t', UI.line)}
                />
              ) : null}
            </SectionCard>

            {descriptionCard}
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
