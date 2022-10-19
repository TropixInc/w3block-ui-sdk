import { ReactI18NextChild } from 'react-i18next';

import { ColumnType } from '../GenericTable';

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnType<T, K>>;
};

const TableRows = <T, K extends keyof T>({
  data,
  columns,
}: TableRowsProps<T, K>): JSX.Element => {
  const rows = data.map((row, index) => {
    return (
      <tr key={`row-${index}`} className="pw-font-poppins">
        {columns.map((column, index2) => {
          return (
            <td
              className="odd:pw-text-[#777E8F] even:pw-text-[#353945] pw-text-sm  pw-min-w-[150px] pw-font-semibold pw-min-h-[64px] pw-p-4"
              key={`cell-${index2}`}
            >
              {row[column.key] as ReactI18NextChild}
            </td>
          );
        })}
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

export default TableRows;
