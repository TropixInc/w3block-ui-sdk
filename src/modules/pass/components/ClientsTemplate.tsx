import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';

import { ErrorBox } from '../../shared/components/ErrorBox';
import { Pagination } from '../../shared/components/Pagination';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { SectionCard } from '../../shared/components/ui/SectionCard';
import { UI } from '../../shared/components/ui/tokens';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { usePrivateRoute } from '../../shared/hooks/usePrivateRoute';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { useGetBenefitUses } from '../hooks/useGetBenefitUses';
import { BaseTemplate } from './BaseTemplate';

interface UseRow {
  id: string;
  client: string;
  email: string;
  cpf: string;
  benefit: string;
  benefitId: string;
  pass: string;
  edition: string;
  date: string;
}

const formatDateTime = (value?: string) =>
  value && Date.parse(value)
    ? format(new Date(value), 'dd/MM/yyyy HH:mm')
    : '—';

/**
 * Operator view of everyone who used a benefit of the tenant's passes:
 * who, which benefit / pass, which token edition and when. Backed by the
 * tenant-wide usages endpoint (admins see everything; operators get the
 * API's own error when they lack access).
 */
export const ClientTemplate = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const [page, setPage] = useState(1);
  const { isLoading: isCheckingAuth, isAuthorized } = usePrivateRoute();
  const { data, isFetching, error } = useGetBenefitUses({
    query: { page },
    enabled: isAuthorized,
  });

  const rows = useMemo<UseRow[]>(
    () =>
      (data?.items ?? []).map((use) => ({
        id: use.id,
        client: use?.user?.name || use?.user?.email || '—',
        email: use?.user?.name && use?.user?.email ? use.user.email : '',
        cpf: use?.user?.cpf || '—',
        benefit: use?.tokenPassBenefit?.name || '—',
        benefitId: use?.tokenPassBenefitId,
        pass: use?.tokenPassBenefit?.tokenPass?.name || '',
        edition:
          use?.editionNumber != undefined ? `#${use.editionNumber}` : '—',
        date: formatDateTime(use?.usedAt || use?.createdAt),
      })),
    [data]
  );

  const columns = useMemo<DataTableColumn<UseRow>[]>(
    () => [
      {
        key: 'client',
        header: translate('pass>clients>client'),
        card: 'title',
        render: (row) => (
          <div className="pw-grid pw-min-w-0 pw-leading-tight">
            <span className="pw-font-semibold pw-truncate">{row.client}</span>
            {row.email ? (
              <span
                className={classNames(
                  'pw-text-[12px] pw-truncate pw-font-normal',
                  UI.textFaint
                )}
              >
                {row.email}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        key: 'cpf',
        header: translate('pass>benefitUsesList>cpf'),
        render: (row) => row.cpf,
      },
      {
        key: 'benefit',
        header: translate('pass>clients>benefit'),
        render: (row) => (
          <div className="pw-grid pw-min-w-0 pw-leading-tight">
            {row.benefitId ? (
              <a
                href={router.routerToHref(
                  PixwayAppRoutes.BENEFIT_DETAILS.replace(
                    '{benefitId}',
                    row.benefitId
                  )
                )}
                className={classNames(UI.link, 'pw-truncate')}
              >
                {row.benefit}
              </a>
            ) : (
              <span className="pw-truncate">{row.benefit}</span>
            )}
            {row.pass ? (
              <span
                className={classNames(
                  'pw-text-[12px] pw-truncate',
                  UI.textFaint
                )}
              >
                {row.pass}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        key: 'edition',
        header: translate('pass>benefitUsesList>edition'),
        render: (row) => row.edition,
      },
      {
        key: 'date',
        header: translate('pass>benefitUsesList>time'),
        render: (row) => row.date,
      },
    ],
    [router, translate]
  );

  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.totalItems ?? 0;

  if (isCheckingAuth || !isAuthorized) return null;

  return (
    <BaseTemplate
      title={translate('components>menu>clients')}
      subtitle={translate('pass>clients>subtitle')}
    >
      {error ? (
        <ErrorBox customError={error} />
      ) : (
        <SectionCard title={translate('pass>clients>uses')} flush>
          <DataTable<UseRow>
            bare
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            loading={isFetching && !data}
            emptyState={
              <EmptyState
                bare
                title={translate('token>pass>notResult')}
                className="pw-py-6"
              />
            }
            className="pw-px-2 pw-pb-2"
            footer={
              totalItems > 0 ? (
                <>
                  <span>
                    {translate('shared>table>pageOf', {
                      page,
                      pages: totalPages,
                      total: totalItems,
                    })}
                  </span>
                  {totalPages > 1 ? (
                    <Pagination
                      pagesQuantity={totalPages}
                      currentPage={page}
                      onChangePage={setPage}
                    />
                  ) : null}
                </>
              ) : undefined
            }
          />
        </SectionCard>
      )}
    </BaseTemplate>
  );
};
