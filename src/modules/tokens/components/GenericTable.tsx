import { useEffect, useMemo, useState } from 'react';
import { DataGridPagination } from './DataGridPagination';
import TableHeader from './TableHeader';
import TableRows from './TableRow';

export type ColumnType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
};

export type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnType<T, K>>;
  limitRowsNumber?: number;
  showPagination?: boolean;
  itensPerPage?: number;
};

const GenericTable = <T, K extends keyof T>({
  data,
  columns,
  limitRowsNumber = data?.length,
  showPagination = false,
  itensPerPage = 10,
}: TableProps<T, K>): JSX.Element => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsDisplaying = useMemo(() => {
    const startIndex = (page - 1) * itensPerPage;
    const lastIndex = page * itensPerPage;
    return data.slice(startIndex, lastIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data]);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itensPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[16px]">
      <div className="pw-w-full pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ">
        <TableHeader columns={columns} />
        <TableRows
          data={itemsDisplaying}
          columns={columns}
          limitRowsNumber={limitRowsNumber}
        />
      </div>
      {showPagination && totalPages > 1 ? (
        <DataGridPagination
          changePage={setPage}
          totalPages={totalPages}
          page={page}
        />
      ) : null}
    </div>
  );
};

export default GenericTable;
