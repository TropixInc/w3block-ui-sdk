/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { BaseButton, GenericTable, InternalPagesLayoutBase } from "../../shared/components";
import TranslatableComponent from "../../shared/components/TranslatableComponent";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { useRouterConnect } from "../../shared/hooks/useRouterConnect";
import { useUserWallet } from "../../shared/hooks/useUserWallet/useUserWallet";
import { ConfigGenericTable, FilterTableType, FormatTypeColumn } from "../../shared/interfaces/ConfigGenericTable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WithdrawInternal from "../components/WithdrawInternal";
import WithdrawModal from "../components/WithdrawModal";


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
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden pw-mb-[20px]">
        <div className="pw-flex pw-justify-between">
          <p className="pw-text-[23px] pw-font-[600]">
            {translate('components>menu>withdraws')}
          </p>
        </div>
      </div>
      <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
        {isOpen ? (
          <WithdrawModal
            onClose={() => setIsOpen(false)}
            balance={loyaltyWallet?.[0]?.withdrawableBalance}
            contractId={loyaltyWallet?.[0]?.contractId}
            currency={loyaltyWallet?.[0]?.currency}
          />
        ) : id ? (
          <WithdrawInternal id={id} currency={loyaltyWallet?.[0]?.currency} />
        ) : (
          <>
            <div className="pw-flex pw-items-end pw-justify-end pw-w-full pw-mb-4">
              <BaseButton onClick={() => setIsOpen(true)}>
                {translate('auth>withdrawModal>makeWithdraw')}
              </BaseButton>
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
