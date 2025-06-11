import { ReactI18NextChild } from 'react-i18next';

import classNames from 'classnames';
import { ColumnType } from './GenericTable';

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnType<T, K>>;
  limitRowsNumber?: number;
  className?: string;
};

const TableRows = <T, K extends keyof T>({
  data,
  columns,
  limitRowsNumber = data?.length,
  className = '',
}: TableRowsProps<T, K>): JSX.Element => {
  const rows = data.map((row, index) => {
    return index < limitRowsNumber ? (
      <tr key={`row-${index}`} className="pw-font-poppins">
        {columns.map((column, index2) => {
          return (
            <td
              className={classNames(
                'odd:pw-text-[#777E8F] even:pw-text-[#353945] pw-break-normal pw-text-sm sm:pw-min-w-[150px] pw-w-3/12 pw-font-semibold pw-min-h-[64px] pw-p-2 sm:pw-p-4',
                className
              )}
              key={`cell-${index2}`}
            >
              {row[column.key] as ReactI18NextChild}
            </td>
          );
        })}
      </tr>
    ) : null;
  });

  return <tbody className="pw-bg-white">{rows}</tbody>;
};

export default TableRows;
