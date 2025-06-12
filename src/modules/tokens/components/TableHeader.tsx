import classNames from 'classnames';
import { ColumnType } from './GenericTable';

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnType<T, K>>;
  className?: string;
  thClass?: string;
};

const TableHeader = <T, K extends keyof T>({
  columns,
  className = '',
  thClass = '',
}: TableHeaderProps<T, K>): JSX.Element => {
  const headers = columns.map((column, index) => {
    return (
      <th
        key={`headCell-${index}`}
        className={classNames(
          'pw-py-[13.5px] sm:pw-pl-[20px] pw-pl-2 pw-text-left pw-w-[95px] sm:pw-min-w-[150px] pw-text-[14px] pw-text-[#FFFFFF] pw-font-semibold pw-leading-[21px]',
          thClass
        )}
      >
        {column.header}
      </th>
    );
  });

  return (
    <thead
      className={classNames(
        'pw-flex pw-justify-between pw-bg-brand-primary pw-border pw-rounded-t-[16px]',
        className
      )}
    >
      {headers}
    </thead>
  );
};

export default TableHeader;
