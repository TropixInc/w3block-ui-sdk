import { useMemo, useState } from 'react';

import { format } from 'date-fns';

import { Pagination } from '../../shared/components/Pagination';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/ui/DataTable';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import useTranslation from '../../shared/hooks/useTranslation';
import { useGetBenefitUses } from '../hooks/useGetBenefitUses';

interface UseRow {
  id: string;
  name: string;
  cpf: string;
  tokenEdition: string;
  date: string;
}

interface Props {
  benefitId: string;
}

/**
 * Uses registered for one benefit (operator view): who used it, with which
 * token edition and when. Meant to sit inside a flush SectionCard.
 */
const BenefitUsesList = ({ benefitId }: Props) => {
  const [page, setPage] = useState(1);
  const { data: benefitUses, isFetching } = useGetBenefitUses({
    query: { benefitId, page },
  });
  const [translate] = useTranslation();

  const rows = useMemo<UseRow[]>(
    () =>
      (benefitUses?.items ?? []).map((use) => ({
        id: use.id,
        name: use?.user?.name || use?.user?.email || '—',
        cpf: use?.user?.cpf || '—',
        tokenEdition:
          use?.editionNumber != undefined ? `#${use.editionNumber}` : '—',
        date: Date.parse(use.usedAt)
          ? format(new Date(use.usedAt), 'dd/MM/yyyy HH:mm')
          : '—',
      })),
    [benefitUses]
  );

  const columns = useMemo<DataTableColumn<UseRow>[]>(
    () => [
      {
        key: 'name',
        header: translate('pass>benefitUsesList>name'),
        card: 'title',
        render: (row) => <span className="pw-font-semibold">{row.name}</span>,
      },
      {
        key: 'cpf',
        header: translate('pass>benefitUsesList>cpf'),
        render: (row) => row.cpf,
      },
      {
        key: 'tokenEdition',
        header: translate('pass>benefitUsesList>edition'),
        render: (row) => row.tokenEdition,
      },
      {
        key: 'date',
        header: translate('pass>benefitUsesList>time'),
        card: 'meta',
        render: (row) => row.date,
      },
    ],
    [translate]
  );

  const totalPages = benefitUses?.meta?.totalPages ?? 1;

  return (
    <DataTable<UseRow>
      bare
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      loading={isFetching && !benefitUses}
      emptyState={
        <EmptyState
          bare
          title={translate('pass>benefitUsesList>noUse')}
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
  );
};

export default BenefitUsesList;
