import { lazy, useMemo, useState } from 'react';

import { format } from 'date-fns';

const Spinner = lazy(() =>
  import('../../../shared/components/Spinner').then((mod) => ({
    default: mod.Spinner,
  }))
);
const DataGridPagination = lazy(() =>
  import('../../../tokens/components/DataGridPagination').then((mod) => ({
    default: mod.DataGridPagination,
  }))
);

import useTranslation from '../../../../../dist/src/modules/shared/hooks/useTranslation';
import { ColumnType } from '../../../tokens/components/GenericTable';
import TableHeader from '../../../tokens/components/TableHeader/TableHeader';
import TableRows from '../../../tokens/components/TableRow/TableRow';
import { useGetBenefitUses } from '../../hooks/useGetBenefitUses';

interface DataTable {
  name?: string;
  date?: string;
  cpf?: string;
  tokenEdition?: number;
}

interface Props {
  benefitId: string;
}

const BenefitUsesList = ({ benefitId }: Props) => {
  const [page, setPage] = useState(1);
  const { data: benefitUses, isLoading } = useGetBenefitUses({
    query: { benefitId, page },
  });
  const [translate] = useTranslation();

  const columns: ColumnType<DataTable, keyof DataTable>[] = [
    { key: 'name', header: 'Nome' },
    { key: 'cpf', header: 'CPF' },
    { key: 'tokenEdition', header: 'Edição do Token' },
    { key: 'date', header: 'Horário' },
  ];

  const itemsDisplaying: DataTable[] = useMemo(() => {
    const formattedData = benefitUses?.items.map((val) => {
      const date = format(new Date(val.usedAt), 'dd/MM/yyyy HH:mm:ss');
      return {
        name: val?.user?.name,
        cpf: val?.user?.cpf,
        tokenEdition: val?.editionNumber,
        date,
      };
    });

    return formattedData ?? [];
  }, [benefitUses]);

  if (benefitUses?.items && benefitUses?.items?.length < 1)
    return (
      <div className="pw-w-full pw-text-[#353945] pw-font-bold pw-text-[18px] pw-leading-[22.5px] pw-text-left ">
        {translate('pass>benefitUsesList>noUse')}
      </div>
    );
  else
    return (
      <div className="pw-w-full pw-flex pw-flex-col pw-gap-[16px]">
        {isLoading ? (
          <div className="pw-w-full pw-h-full pw-flex pw-justify-center pw-items-center">
            <Spinner />
          </div>
        ) : (
          <div className="pw-overflow-x-scroll">
            <div className="pw-w-[1065px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ">
              <>
                <TableHeader
                  columns={columns}
                  className="!pw-gap-[114px] !pw-justify-normal"
                  thClass="!pw-w-[150px] !pw-pl-[20px]"
                />
                <TableRows
                  data={itemsDisplaying}
                  columns={columns}
                  className="!pw-w-[266.25px] !pw-p-4"
                />
              </>
            </div>
          </div>
        )}
        {benefitUses?.meta && benefitUses?.meta?.totalPages > 1 ? (
          <DataGridPagination
            changePage={setPage}
            totalPages={benefitUses?.meta?.totalPages}
            page={page}
          />
        ) : null}
      </div>
    );
};

export default BenefitUsesList;
