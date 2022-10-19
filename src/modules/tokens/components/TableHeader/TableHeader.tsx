import { ColumnType } from '../GenericTable';

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnType<T, K>>;
};

const TableHeader = <T, K extends keyof T>({
  columns,
}: TableHeaderProps<T, K>): JSX.Element => {
  const headers = columns.map((column, index) => {
    return (
      <th
        key={`headCell-${index}`}
        className="pw-py-[13.5px] pw-pl-[20px] pw-text-left pw-min-w-[150px] pw-text-[14px] pw-text-[#FFFFFF] pw-font-semibold pw-leading-[21px]"
      >
        {column.header}
      </th>
    );
  });

  return (
    <thead className="pw-flex pw-justify-between pw-bg-brand-primary pw-border pw-rounded-t-[16px]">
      <tr>{headers}</tr>
    </thead>
  );
};

export default TableHeader;
