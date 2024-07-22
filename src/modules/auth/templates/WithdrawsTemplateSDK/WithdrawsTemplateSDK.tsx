/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, useState } from 'react';
const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((m) => ({
    default: m.InternalPagesLayoutBase,
  }))
);

import useTranslation from '../../../../../dist/src/modules/shared/hooks/useTranslation';
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
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import WithdrawInternal from '../../components/WithdrawInternal/WithdrawInternal';
import WithdrawModal from '../../components/WithdrawModal/WithdrawModal';

const _WithdrawsTemplateSDK = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [translate] = useTranslation();
  const { query } = useRouterConnect();
  const { loyaltyWallet } = useUserWallet();
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
      url: `/${tenantId}/withdraws`,
      urlContext: W3blockAPI.KEY,
      type: FilterTableType.DYNAMIC,
      isPublicApi: false,
    },
    tableStyles: {
      root: { width: '100%' },
      header: '!pw-grid-cols-[18%_20%]',
      line: '!pw-grid-cols-[18%_20%]',
    },
    lineActions: {
      action: {
        data: '/withdraws?id={id}',
        replacedQuery: ['id'],
        type: 'navigate',
      },
    },
    columns: [
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
            escrowing_resources: 'Pendente',
            ready_to_transfer_funds: 'Pendente',
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
      <div className="pw-flex pw-flex-col pw-px-4 pw-pt-5 pw-shadow-lg sm:pw-px-0 ">
        {isOpen ? (
          <WithdrawModal
            onClose={() => setIsOpen(false)}
            balance={loyaltyWallet?.[0]?.balance}
            contractId={loyaltyWallet?.[0]?.contractId}
            currency={loyaltyWallet?.[0]?.currency}
          />
        ) : id ? (
          <WithdrawInternal id={id} currency={loyaltyWallet?.[0]?.currency} />
        ) : (
          <>
            <div className="pw-flex pw-pr-5 pw-items-end pw-justify-end pw-w-full">
              <OffpixButtonBase
                className="sm:pw-px-3 pw-px-0 pw-w-[180px] pw-h-10 pw-flex pw-items-center pw-justify-center pw-text-lg"
                variant="filled"
                onClick={() => setIsOpen(true)}
              >
                {translate('auth>withdrawModal>makeWithdraw')}
              </OffpixButtonBase>
            </div>
            <GenericTable
              config={configTable}
              classes={{
                grid: {
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.6fr 0.7fr 1fr 1fr 0.2fr',
                } as any,
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export const WithdrawsTemplateSDK = () => {
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase
        classes={{ middleSectionContainer: 'pw-mb-[85px]' }}
      >
        <_WithdrawsTemplateSDK />
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
