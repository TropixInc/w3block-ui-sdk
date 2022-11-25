import classNames from 'classnames';
import { format } from 'date-fns';

import useIsMobile from '../../../shared/hooks/useIsMobile/useIsMobile';
import useTranslation from '../../../shared/hooks/useTranslation';
import { FormConfigurationContext } from '../../contexts/FormConfigurationContext';
import useDynamicDataFromTokenCollection from '../../hooks/useDynamicDataFromTokenCollection';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../interfaces/DimensionsValue';
import { DynamicFormConfiguration } from '../../interfaces/DynamicFormConfiguration';
import { Breadcrumb } from '../Breadcrumb';
import { Button } from '../Button';
import GenericTable, { ColumnType } from '../GenericTable/GenericTable';
import { InternalPageTitle } from '../InternalPageTitle';
import { LineDivider } from '../LineDivider';
import { SmartDataDisplayer } from '../SmartDataDisplayer';
import { TextFieldDisplay } from '../SmartDisplay/TextFieldDisplay';
import StatusTag from '../StatusTag/StatusTag';

interface TableRow {
  pass: string;
  type: string;
  local: string;
  date: string;
  status: JSX.Element;
  actionComponent?: JSX.Element;
}

interface TableRowMobile {
  pass: string;
  type: string;
  status: JSX.Element;
  actionComponent?: JSX.Element;
}

export const mobileTableData = [
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="inativo" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="ativo" />,
    actionComponent: <Button>Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="inativo" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="ativo" />,
    actionComponent: <Button>Utilizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
];

export const tableData = [
  {
    pass: 'Desconto',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="inativo" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'bebida',
    type: 'Fisico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="ativo" />,
    actionComponent: <Button>Utilizar</Button>,
  },
  {
    pass: 'jantar',
    type: 'Fisico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'online',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="inativo" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'online',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="ativo" />,
    actionComponent: <Button>Utilizar</Button>,
  },
  {
    pass: 'Nome do pass',
    type: 'Físico',
    local: 'Aplicativo',
    date: format(new Date(), 'dd/MM/yyyy'),
    status: <StatusTag status="indisponível" />,
    actionComponent: <Button variant="secondary">Visualizar</Button>,
  },
];

export const mobileHeaders: ColumnType<TableRowMobile, keyof TableRowMobile>[] =
  [
    {
      key: 'pass',
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
interface Props {
  contract: string;
  title: string;
  description: string;
  mainImage: string;
  tokenData: Record<string, string | Dimensions2DValue | Dimensions3DValue>;
  tokenTemplate: DynamicFormConfiguration;
  className?: string;
  isMultiplePass?: boolean;
}

export const TokenDetailsCard = ({
  contract,
  description,
  mainImage,
  title,
  tokenData,
  tokenTemplate,
  className = '',
  isMultiplePass = false,
}: Props) => {
  const [translate] = useTranslation();
  const isMobile = useIsMobile();
  const dynamicData = useDynamicDataFromTokenCollection(
    tokenData,
    tokenTemplate
  );

  const renderTextValue = (label: string, value: string) => (
    <TextFieldDisplay label={label} value={value} inline />
  );

  const breadcrumbItems = [
    {
      url: '',
      name: 'Meus Tokens',
    },
    {
      url: '',
      name: title,
    },
  ];

  return (
    <div
      className={classNames(
        className,
        'pw-flex pw-flex-col pw-p-[17px] sm:pw-p-6 pw-bg-white pw-relative pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-mx-[22px] sm:pw-mx-0'
      )}
    >
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      <InternalPageTitle contract={contract} title={title} />
      <LineDivider />
      {isMultiplePass && (
        <div className="pw-flex pw-flex-col pw-gap-6">
          <p className="pw-font-poppins pw-font-semibold pw-text-[15px] pw-text-black">
            {translate('connect>TokenDetailCard>passAssociated')}
          </p>
          {isMobile ? (
            <GenericTable
              columns={mobileHeaders}
              data={mobileTableData}
              limitRowsNumber={3}
            />
          ) : (
            <GenericTable
              columns={headers}
              data={tableData}
              limitRowsNumber={5}
            />
          )}
        </div>
      )}
      <LineDivider />
      {mainImage || description ? (
        <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-4 sm:pw-py-6 sm:pw-gap-y-8 pw-w-full pw-break-words">
          {description ? (
            renderTextValue(
              translate('connect>tokenDetailsCard>description'),
              description
            )
          ) : (
            <div className="pw-hidden sm:pw-block" />
          )}
          {!!mainImage && (
            <img
              src={mainImage}
              alt=""
              className="pw-w-[432px] pw-h-[351px] pw-object-contain pw-rounded-[20px] pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)]"
            />
          )}
        </div>
      ) : null}
      <LineDivider />
      {dynamicData ? (
        <FormConfigurationContext.Provider value={tokenTemplate ?? {}}>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-x-[21px] pw-gap-y-8 sm:pw-gap-y-8 sm:pw-pt-6 pw-break-words">
            {dynamicData.map(({ id, value }: { id: any; value: any }) => (
              <SmartDataDisplayer
                fieldName={id}
                key={id}
                value={value}
                inline
                classes={{
                  label: 'pw-font-medium',
                }}
              />
            ))}
          </div>
        </FormConfigurationContext.Provider>
      ) : null}
    </div>
  );
};
