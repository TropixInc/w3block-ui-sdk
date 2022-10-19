import TableHeader from '../TableHeader/TableHeader';
import TableRows from '../TableRow/TableRow';

export type ColumnType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
};

export type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnType<T, K>>;
};

const GenericTable = <T, K extends keyof T>({
  data,
  columns,
}: TableProps<T, K>): JSX.Element => {
  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[16px]">
      <div className="pw-w-full pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ">
        <TableHeader columns={columns} />
        <TableRows data={data} columns={columns} />
      </div>
    </div>
  );
};

export default GenericTable;
