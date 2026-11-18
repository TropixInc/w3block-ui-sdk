/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import format from 'date-fns/format';

import { BenefitStatus } from '../../pass/enums/BenefitStatus';
import { PassType } from '../../pass/enums/PassType';
import useGetBenefitsByEditionNumber from '../../pass/hooks/useGetBenefitsByEditionNumber';
import useGetPassById from '../../pass/hooks/useGetPassById';
import { BenefitAddress } from '../../pass/interfaces/PassBenefitDTO';
import { transformObjectToQuery } from '../../pass/utils/transformObjectToQuery';
import { BaseButton } from '../../shared/components/Buttons';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { Pagination } from '../../shared/components/Pagination';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { StatusPill } from '../../shared/components/ui/StatusPill';
import { Tone, UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { FormConfigurationContext } from '../contexts/FormConfigurationContext';
import useDynamicDataFromTokenCollection from '../hooks/useDynamicDataFromTokenCollection';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../interfaces/DimensionsValue';
import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';
import { SmartDataDisplayer } from './SmartDataDisplayer';

interface Props {
  contract: string;
  title: string;
  description: string;
  mainImage: string;
  tokenData: Record<string, string | Dimensions2DValue | Dimensions3DValue>;
  tokenTemplate: DynamicFormConfiguration;
  className?: string;
  /** Collection flagged as a pass: shows the benefits section even while loading / empty. */
  isPass?: boolean;
  /** Legacy alias of `isPass` (kept for InternalMultiplePassTemplate). */
  isMultiplePass?: boolean;
  tokenId?: string;
  collectionId?: string;
  editionNumber: string;
}

interface BenefitRow {
  id: string;
  name: string;
  type: string;
  local: string;
  period: string;
  status: BenefitStatus;
}

const PAGE_SIZE = 5;

const statusTone = (status: BenefitStatus): Tone =>
  status === BenefitStatus.active
    ? 'ok'
    : status === BenefitStatus.inactive
    ? 'bad'
    : 'grey';
const statusKey = (status: BenefitStatus) =>
  status === BenefitStatus.active
    ? 'tokens>StatusTag>active'
    : status === BenefitStatus.inactive
    ? 'tokens>StatusTag>inactive'
    : 'tokens>StatusTag>unavailable';

/**
 * Detail of one token the user holds: header, the pass benefits of this
 * edition (when the collection is a pass) and the token's own data.
 */
export const TokenDetailsCard = ({
  contract,
  description,
  mainImage,
  title,
  tokenData,
  tokenTemplate,
  className = '',
  isPass,
  isMultiplePass,
  tokenId = '',
  collectionId,
  editionNumber,
}: Props) => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [page, setPage] = useState(1);
  const dynamicData = useDynamicDataFromTokenCollection(
    tokenData,
    tokenTemplate
  );

  const {
    data: benefitsByEdition,
    isSuccess,
    isFetching: isLoadingBenefits,
  } = useGetBenefitsByEditionNumber({
    tokenPassId: collectionId as string,
    editionNumber: +editionNumber,
  });

  const { data: passData } = useGetPassById(collectionId ?? '');

  const hasBenefits = useMemo(
    () =>
      isSuccess &&
      Array.isArray(benefitsByEdition?.data) &&
      benefitsByEdition.data.length > 0,
    [benefitsByEdition, isSuccess]
  );
  const showPassSection = Boolean(isPass || isMultiplePass) || hasBenefits;

  const openBenefit = (id: string) =>
    router.pushConnect(
      PixwayAppRoutes.USE_BENEFIT.replace('{benefitId}', id).concat(
        transformObjectToQuery({ tokenId })
      )
    );

  const formatLocal = (type: string, address?: BenefitAddress) => {
    if (type == PassType.physical && address) {
      return [address.street, address.city].filter(Boolean).join(' · ');
    }
    return translate('token>pass>online');
  };

  const formatPeriod = (startsAt: string, endsAt?: string) => {
    const start = Date.parse(startsAt)
      ? format(new Date(startsAt), 'dd/MM/yyyy')
      : '';
    const end =
      endsAt && Date.parse(endsAt)
        ? format(new Date(endsAt), 'dd/MM/yyyy')
        : '';
    return end ? `${start} – ${end}` : start;
  };

  const rows = useMemo<BenefitRow[]>(() => {
    if (!Array.isArray(benefitsByEdition?.data)) return [];
    return benefitsByEdition.data.map((benefit) => ({
      id: benefit.id,
      name: benefit.name,
      type:
        benefit?.type === 'physical'
          ? translate('token>pass>typePhysical')
          : translate('token>pass>typeDigital'),
      local: formatLocal(benefit.type, benefit?.tokenPassBenefitAddresses?.[0]),
      period: formatPeriod(benefit.eventStartsAt, benefit?.eventEndsAt),
      status: benefit.status,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitsByEdition]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = useMemo<DataTableColumn<BenefitRow>[]>(
    () => [
      {
        key: 'name',
        header: translate('token>pass>benefict'),
        card: 'title',
        render: (row) => <span className="pw-font-semibold">{row.name}</span>,
      },
      {
        key: 'type',
        header: translate('tokens>tokenDetailsCard>type'),
        render: (row) => row.type,
      },
      {
        key: 'local',
        header: translate('pass>PassesDetail>local'),
        render: (row) => row.local,
      },
      {
        key: 'period',
        header: translate('pass>PassesDetail>period'),
        render: (row) => row.period || '—',
      },
      {
        key: 'status',
        header: translate('token>pass>status'),
        card: 'badge',
        render: (row) => (
          <StatusPill tone={statusTone(row.status)} size="sm">
            {translate(statusKey(row.status))}
          </StatusPill>
        ),
      },
      {
        key: 'action',
        header: '',
        align: 'right',
        card: 'action',
        render: (row) =>
          row.status === BenefitStatus.active ? (
            <BaseButton onClick={() => openBenefit(row.id)}>
              {translate('token>pass>benefits>useBenefit')}
            </BaseButton>
          ) : (
            <button
              type="button"
              className={UI.buttonSecondary}
              onClick={() => openBenefit(row.id)}
            >
              {translate('token>pass>benefits>viewBenefit')}
            </button>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, tokenId]
  );

  const pass = passData?.data;
  const edition = editionNumber
    ? `${translate('tokens>tokenTransferController>edition')} #${editionNumber}`
    : '';

  return (
    <div className={classNames('pw-flex pw-flex-col pw-gap-4', className)}>
      <PageHeader
        back={{
          label: translate('components>menu>myTokens'),
          href: router.routerToHref(PixwayAppRoutes.TOKENS),
        }}
        title={title}
        subtitle={[contract, edition].filter(Boolean).join(' · ')}
        actions={
          showPassSection ? (
            <StatusPill tone="info">{translate('token>pass>title')}</StatusPill>
          ) : undefined
        }
      />

      {showPassSection ? (
        <SectionCard
          title={translate('tokens>tokenDetailsCard>passBenefits')}
          flush
        >
          {pass?.description || pass?.rules ? (
            <div
              className={classNames(
                'pw-px-4 pw-pb-3 pw-grid pw-gap-2 pw-text-[13px] [&_p]:pw-m-0',
                UI.textSecondary
              )}
            >
              {pass?.description ? (
                <div dangerouslySetInnerHTML={{ __html: pass.description }} />
              ) : null}
              {pass?.rules ? (
                <div>
                  <span className={UI.label}>
                    {translate('tokens>tokenDetailsCard>usageRules')}
                  </span>
                  <div dangerouslySetInnerHTML={{ __html: pass.rules }} />
                </div>
              ) : null}
            </div>
          ) : null}
          <DataTable<BenefitRow>
            bare
            columns={columns}
            rows={pageRows}
            rowKey={(row) => row.id}
            loading={isLoadingBenefits && !benefitsByEdition}
            emptyState={
              <EmptyState
                bare
                title={translate('tokens>tokenDetailsCard>noBenefits')}
                className="pw-py-6"
              />
            }
            className="pw-px-2 pw-pb-2"
            footer={
              totalPages > 1 ? (
                <>
                  <span />
                  <Pagination
                    pagesQuantity={totalPages}
                    currentPage={page}
                    onChangePage={setPage}
                  />
                </>
              ) : undefined
            }
          />
        </SectionCard>
      ) : null}

      {mainImage || description || dynamicData ? (
        <SectionCard title={translate('tokens>tokenDetailsCard>aboutToken')}>
          <div
            className={classNames(
              'pw-grid pw-grid-cols-1 pw-gap-5',
              mainImage && 'sm:pw-grid-cols-[minmax(0,1fr)_260px]'
            )}
          >
            <div className="pw-grid pw-gap-4 pw-min-w-0 pw-content-start">
              {description ? (
                <div className="pw-grid pw-gap-0.5">
                  <span className={UI.label}>
                    {translate('connect>tokenDetailsCard>description')}
                  </span>
                  <p
                    className={classNames(
                      'pw-m-0 pw-text-[13.5px] pw-leading-relaxed pw-break-words',
                      UI.text
                    )}
                  >
                    {description}
                  </p>
                </div>
              ) : null}
              {dynamicData ? (
                <FormConfigurationContext.Provider value={tokenTemplate ?? {}}>
                  <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-5 pw-gap-y-4 pw-break-words [&_label]:pw-text-[11px] [&_label]:pw-font-semibold [&_label]:pw-uppercase [&_label]:pw-tracking-[0.04em] [&_label]:pw-text-[#6B7280]">
                    {dynamicData.map(
                      ({ id, value }: { id: any; value: any }) => (
                        <SmartDataDisplayer
                          fieldName={id}
                          key={id}
                          value={value}
                          inline
                          classes={{ label: 'pw-font-medium' }}
                        />
                      )
                    )}
                  </div>
                </FormConfigurationContext.Provider>
              ) : null}
            </div>
            {mainImage ? (
              <a
                target="_blank"
                href={mainImage}
                rel="noreferrer"
                className="pw-justify-self-center sm:pw-justify-self-end pw-w-full pw-max-w-[260px]"
              >
                <ImageSDK
                  controls={true}
                  className={classNames(
                    'pw-w-full pw-max-h-[260px] pw-object-contain pw-rounded-[10px] pw-border pw-bg-[#F7F8FA]',
                    UI.line
                  )}
                  src={mainImage}
                  alt=""
                  width={520}
                  quality="eco"
                />
              </a>
            ) : null}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
};
