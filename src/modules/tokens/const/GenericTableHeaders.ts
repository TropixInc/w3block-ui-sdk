import { ReactNode } from 'react';

import { ColumnType } from '../components/GenericTable';

export interface TableRow {
  name?: string;
  type?: string;
  local?: string;
  date?: string;
  status?: ReactNode;
  actionComponent?: ReactNode;
}

export interface TableRowMobile {
  name?: string;
  type?: string;
  status?: JSX.Element;
  actionComponent?: JSX.Element;
}

export const mobileHeaders: ColumnType<TableRowMobile, keyof TableRowMobile>[] =
  [
    {
      key: 'name',
      header: 'Pass',
    },
    {
      key: 'type',
      header: 'Tipo',
    },
    {
      key: 'status',
      header: '',
    },
    {
      key: 'actionComponent',
      header: '',
    },
  ];

export const headers: ColumnType<TableRow, keyof TableRow>[] = [
  {
    key: 'name',
    header: 'Pass',
  },
  {
    key: 'type',
    header: 'Tipo',
  },
  {
    key: 'local',
    header: 'Local',
  },
  {
    key: 'date',
    header: 'Data',
  },
  {
    key: 'status',
    header: 'Status',
  },
  {
    key: 'actionComponent',
    header: '',
  },
];
