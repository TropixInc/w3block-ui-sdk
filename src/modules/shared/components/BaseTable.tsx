'use client';

import * as React from 'react';
import { Spinner } from './Spinner';
import { Pagination } from './Pagination';


export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  hideName?: boolean;
  name: string;
  width?: number | string;
}

type RowId = number | string;

export interface DataTableProps<TRowModel>
  extends Omit<
    React.DetailedHTMLProps<
      React.TableHTMLAttributes<HTMLTableElement>,
      HTMLTableElement
    >,
    'onClick'
  > {
  columns: ColumnDef<TRowModel>[];
  hideHead?: boolean;
  onClick?: (event: React.MouseEvent, row: TRowModel) => void;
  rows: TRowModel[];
  uniqueRowId?: (row: TRowModel) => RowId;
  isLoading?: boolean;
  pagination?: {
    pagesQuantity: number;
    currentPage: number;
    onChangePage: (nextPage: number) => void;
  };
}

export function BaseTable<TRowModel extends object & { id?: RowId | null }>({
  columns,
  hideHead,
  onClick,
  rows,
  uniqueRowId,
  isLoading,
  pagination,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  return (
    <>
      <table
        {...props}
        className="pw-w-full pw-rounded-lg pw-overflow-hidden pw-border pw-border-[#dee2e6] pw-text-black"
      >
        <thead
          style={{
            ...(hideHead && {
              visibility: 'collapse',
              '--TableCell-borderWidth': 0,
            }),
          }}
          className="pw-bg-[#0050FF] pw-text-left pw-text-white"
        >
          <tr>
            {columns?.map(
              (column): React.JSX.Element => (
                <th
                  key={column?.name}
                  style={{
                    width: column?.width,
                    minWidth: column?.width,
                    maxWidth: column?.width,
                    ...(column?.align && { textAlign: column?.align }),
                  }}
                  className="pw-p-4 pw-text-left pw-font-semibold pw-border-b pw-border-[#dee2e6]"
                >
                  {column?.hideName ? null : column?.name}
                </th>
              )
            )}
          </tr>
        </thead>
        {isLoading ? null : (
          <tbody>
            {rows?.map((row, index): React.JSX.Element => {
              const rowId = row?.id ? row?.id : uniqueRowId?.(row);
              return (
                <tr
                  key={rowId ?? index}
                  {...(onClick && {
                    onClick: (event: React.MouseEvent) => {
                      onClick(event, row);
                    },
                  })}
                  style={{ ...(onClick && { cursor: 'pointer' }) }}
                >
                  {columns?.map(
                    (column): React.JSX.Element => (
                      <td
                        key={column?.name}
                        style={{
                          ...(column?.align && { textAlign: column?.align }),
                        }}
                        className="pw-p-4 pw-border-b pw-border-[#dee2e6]"
                      >
                        {
                          (column?.formatter
                            ? column?.formatter(row, index)
                            : column?.field
                            ? row[column?.field]
                            : null) as React.ReactNode
                        }
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {isLoading ? (
        <div className="pw-flex pw-justify-center pw-items-center pw-my-5 pw-w-full">
          <Spinner />
        </div>
      ) : null}
      {pagination ? (
        <div className="pw-w-full pw-flex pw-items-center pw-justify-end pw-mt-5">
          <Pagination
            pagesQuantity={pagination.pagesQuantity}
            currentPage={pagination.currentPage}
            onChangePage={pagination.onChangePage}
          />
        </div>
      ) : null}
    </>
  );
}
