/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { lazy } from 'react';
const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((m) => ({
    default: m.InternalPagesLayoutBase,
  }))
);

import {
  ConfigGenericTable,
  FilterTableType,
  FormatTypeColumn,
  GenericTable,
  W3blockAPI,
  useRouterConnect,
} from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import useTranslation from '../../../shared/hooks/useTranslation';
import WithdrawAdminActions from '../../components/WithdrawAdmin/WithdrawAdminActions';

const _WithdrawsAdminTemplateSDK = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const [translate] = useTranslation();
  const { query } = useRouterConnect();
  const id = query.id as string;
  const configTable: ConfigGenericTable = {
    localeItems: 'data.items',
    isLineExplansible: false,
    externalFilterClasses: {
      buttonsContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '10px',
        fontSize: '14px',
      },
      reportsButton: {
        fontSize: '14px',
        backgroundColor: '#0050FF',
      },
    },
    dataSource: {
      url: `/${tenantId}/withdraws/admin?sortBy=createdAt`,
      urlContext: W3blockAPI.KEY,
      type: FilterTableType.DYNAMIC,
      isPublicApi: false,
    },
    lineActions: {
      action: {
        data: '/withdraws/admin?id={id}',
        replacedQuery: ['id'],
        type: 'navigate',
      },
    },
    tableStyles: {
      root: { width: '100%' },
      header: '!pw-grid-cols-[18%_20%]',
      line: '!pw-grid-cols-[18%_20%]',
    },
    columns: [
      {
        format: { type: FormatTypeColumn.TEXT },
        key: 'user.name',
        sortable: false,
        header: {
          label: 'Usuário',
        },
      },
      {
        format: { type: FormatTypeColumn.LOCALTIME },
        key: 'createdAt',
        sortable: false,
        header: {
          label: 'Data',
        },
      },
      {
        format: {
          type: FormatTypeColumn.TEXT,
        },
        key: 'amount',
        sortable: false,
        header: {
          label: 'Valor',
        },
      },
      {
        format: {
          type: FormatTypeColumn.MAPPING,
          mapping: {
            pending: 'Pendente',
            escrowing_resources: 'Retendo recursos',
            ready_to_transfer_funds: 'Pronto para transferir',
            concluded: 'Concluído',
            failed: 'Falha',
            refused: 'Recusado',
          },
        },
        key: 'status',
        sortable: false,
        header: {
          label: 'Status',
        },
      },
    ],
  };

  return (
    <>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
        <div className="pw-flex pw-justify-between">
          <p className="pw-text-[23px] pw-font-[600]">
            {translate('auth>withdrawModal>withdrawReports')}
          </p>
        </div>
      </div>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden pw-my-[20px]">
        {id ? (
          <WithdrawAdminActions id={id} />
        ) : (
          <GenericTable config={configTable} />
        )}
      </div>
    </>
  );
};

export const WithdrawsAdminTemplateSDK = () => {
  useGuardPagesWithOptions({ needAdmin: true });
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WithdrawsAdminTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
