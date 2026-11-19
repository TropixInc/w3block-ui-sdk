import { useMemo } from 'react';

import classNames from 'classnames';
import format from 'date-fns/format';

import { ErrorBox } from '../../shared/components/ErrorBox';
import { InternalPagesLayoutBase } from '../../shared/components/InternalPagesLayoutBase';
import Skeleton from '../../shared/components/Skeleton';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import {
  DefinitionItem,
  DefinitionList,
} from '../../shared/components/ui/DefinitionList';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { Tone, UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { BenefitStatus } from '../enums/BenefitStatus';
import useGetPassBenefitById from '../hooks/useGetPassBenefitById';
import useGetPassBenefits from '../hooks/useGetPassBenefits';
import { TokenPassBenefitType } from '../interfaces/PassBenefitDTO';
import BenefitUsesList from './BenefitUsesList';

interface BenefitDetailsProps {
  benefitIdProp?: string;
}

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

const formatDay = (value?: string) =>
  value && Date.parse(value) ? format(new Date(value), 'dd/MM/yyyy') : '';

/** Only http(s) links are rendered as anchors. */
const httpUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};

/** Strip the trailing colon some legacy labels carry. */
const noColon = (value: string) => value.replace(/:\s*$/, '');

/**
 * One benefit as the operator sees it: summary, the uses registered so far,
 * description / rules and, for physical benefits, where it can be used.
 */
const _BenefitDetails = ({ benefitIdProp }: BenefitDetailsProps) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const benefitId = benefitIdProp || (router?.query?.benefitId as string) || '';

  const {
    data: benefit,
    isFetching: isLoadingBenefit,
    error: errorBenefit,
  } = useGetPassBenefitById(benefitId);

  const { data: benefitsList, error: errorBenefitsList } = useGetPassBenefits({
    tokenPassId: benefit?.data?.tokenPassId,
    chainId: benefit?.data?.tokenPass?.chainId,
    contractAddress: benefit?.data?.tokenPass?.contractAddress,
  });

  const addresses = useMemo(() => {
    const own = benefit?.data?.tokenPassBenefitAddresses;
    if (own?.length) return own;
    const fromList = benefitsList?.data?.items?.find(
      (item) => item?.id === benefitId
    );
    return fromList?.tokenPassBenefitAddresses ?? [];
  }, [benefit?.data, benefitId, benefitsList?.data?.items]);

  const data = benefit?.data;
  const isPhysical = data?.type == TokenPassBenefitType.PHYSICAL;

  const period = [formatDay(data?.eventStartsAt), formatDay(data?.eventEndsAt)]
    .filter(Boolean)
    .join(' – ');

  const summary: DefinitionItem[] = [
    {
      term: translate('tokens>tokenDetailsCard>type'),
      value: isPhysical
        ? translate('token>pass>typePhysical')
        : translate('token>pass>typeDigital'),
    },
    {
      term: noColon(translate('token>benefits>useLimit')),
      value:
        data?.useLimit != undefined
          ? data.useLimit
          : translate('pass>benefitDetails>noLimit'),
      muted: data?.useLimit == undefined,
    },
    {
      term: translate('pass>PassesDetail>period'),
      value: period || '—',
      muted: !period,
    },
    {
      term: translate('pass>PassesDetail>local'),
      value: isPhysical
        ? addresses.length
          ? addresses.map((address) => address?.name).join(', ')
          : '—'
        : translate('token>pass>online'),
      muted: isPhysical && !addresses.length,
    },
  ];

  const safeLink = httpUrl(data?.linkUrl);
  if (safeLink) {
    summary.push({
      term: translate('pass>benefitDetails>link'),
      value: (
        <a
          href={safeLink}
          target="_blank"
          rel="noreferrer"
          className={classNames(UI.link, 'pw-break-all')}
        >
          {safeLink}
        </a>
      ),
      wide: true,
    });
  }

  if (isLoadingBenefit && !benefit) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        <Skeleton className="pw-h-8 pw-w-2/3 pw-rounded" />
        <Skeleton className="pw-h-32 pw-w-full pw-rounded-[10px]" />
        <Skeleton className="pw-h-48 pw-w-full pw-rounded-[10px]" />
      </div>
    );
  }

  if (errorBenefit || errorBenefitsList) {
    return (
      <div className="pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0">
        {errorBenefit ? <ErrorBox customError={errorBenefit} /> : null}
        {errorBenefitsList ? (
          <ErrorBox customError={errorBenefitsList} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="pw-w-full sm:pw-max-w-[968px] pw-flex pw-flex-col pw-gap-4 pw-px-4 sm:pw-px-0 pw-font-roboto">
      <PageHeader
        back={{
          label: data?.tokenPass?.name || translate('token>pass>title'),
          href: data?.tokenPassId
            ? router.routerToHref(
                PixwayAppRoutes.TOKENPASS_DETAIL.replace(
                  '{tokenPassId}',
                  data.tokenPassId
                )
              )
            : router.routerToHref(PixwayAppRoutes.TOKENPASS),
        }}
        title={data?.name ?? ''}
        subtitle={translate('token>benefits>details')}
        actions={
          data?.status ? (
            <StatusPill tone={statusTone(data.status)}>
              {translate(statusKey(data.status))}
            </StatusPill>
          ) : undefined
        }
      />

      <SectionCard>
        <DefinitionList items={summary} />
      </SectionCard>

      <SectionCard title={translate('pass>benefitDetails>uses')} flush>
        <BenefitUsesList benefitId={benefitId} />
      </SectionCard>

      {data?.description || data?.rules ? (
        <SectionCard title={translate('token>benefits>details')}>
          <div
            className={classNames(
              'pw-grid pw-gap-4 pw-text-[13.5px] pw-leading-relaxed [&_p]:pw-m-0',
              UI.textSecondary
            )}
          >
            {data?.description ? (
              <div className="pw-grid pw-gap-0.5">
                <span className={UI.label}>
                  {translate('token>pass>description')}
                </span>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </div>
            ) : null}
            {data?.rules ? (
              <div className="pw-grid pw-gap-0.5">
                <span className={UI.label}>
                  {translate('token>pass>rules')}
                </span>
                <div dangerouslySetInnerHTML={{ __html: data.rules }} />
              </div>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {isPhysical && addresses.length ? (
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
    </div>
  );
};

export const BenefitDetails = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_BenefitDetails />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
