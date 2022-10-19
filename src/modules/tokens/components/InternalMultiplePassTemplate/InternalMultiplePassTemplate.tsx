import { format } from 'date-fns';

import { InternalPagesLayoutBase } from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { Button } from '../Button/Button';
import GenericTable, { ColumnType } from '../GenericTable/GenericTable';
import StatusTag from '../StatusTag/StatusTag';

interface TableRow {
  pass: string;
  type: string;
  local: string;
  date: string;
  status: JSX.Element;
  actionComponent?: JSX.Element;
}

const tableData = [
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="inactive" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="active" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="unavailable" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
];

const headers: ColumnType<TableRow, keyof TableRow>[] = [
  {
    key: 'pass',
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

const _InternalMultiplePassTemplate = ({
  passName,
  contract,
}: {
  passName: string;
  contract: string;
}) => {
  return (
    <div className="pw-bg-white pw-flex pw-flex-col pw-font-poppins pw-rounded-[8px] pw-w-full pw-p-[16px_16px_24px] pw-gap-[8px]">
      <div>
        <p className=" pw-font-normal pw-text-sm pw-text-[#777E8F]">
          Token Pass
        </p>
        <p className="pw-font-bold pw-text-2xl pw-leading-9 pw-text-black">
          {passName}
        </p>
        <div className="pw-flex pw-items-center pw-mt-3">
          <p className="pw-font-semibold pw-text-[15px] pw-leading-[22.5px] pw-text-black">
            Contrato utilizado:
          </p>
          <p className="pw-font-normal pw-ml-1 pw-text-[15px] pw-leading-[22.5px] pw-text-[#777E8F]">
            {contract}
          </p>
        </div>
        <div className="pw-w-full pw-border pw-border-[#E4E4E4] pw-my-6"></div>
      </div>
      <GenericTable columns={headers} data={tableData} />
    </div>
  );
};

export const InternalMultiplePassTemplate = () => (
  <TranslatableComponent>
    <InternalPagesLayoutBase>
      <_InternalMultiplePassTemplate
        passName="Nome do Pass teste"
        contract="Contrato padrão"
      />
    </InternalPagesLayoutBase>
  </TranslatableComponent>
);
