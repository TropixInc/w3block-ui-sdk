/* eslint-disable react-hooks/exhaustive-deps */
import { lazy } from 'react';
const InternalPagesLayoutBase = lazy(() =>
  import(
    '../../../shared/components/InternalPagesLayoutBase/InternalPagesLayoutBase'
  ).then((m) => ({
    default: m.InternalPagesLayoutBase,
  }))
);

import { useTranslation } from 'react-i18next';

import {
  ConfigGenericTable,
  FilterTableType,
  FormatTypeColumn,
  GenericTable,
  W3blockAPI,
} from '../../../shared';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';

const _WithdrawsTemplateSDK = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const [translate] = useTranslation();

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
    columns: [
      {
        format: { type: FormatTypeColumn.USER },
        key: 'email',
        sortable: false,
        moreInfos: {
          name: 'name',
          cpf: 'cpf',
          phone: 'phone',
        },
        header: {
          label: translate('contacts>NameAndStatusContact>user'),
        },
      },
      {
        format: {
          type: FormatTypeColumn.WALLET,
        },
        key: 'mainWallet.address',
        sortable: false,
        moreInfos: {
          name: 'mainWallet.type',
        },
        header: {
          label: translate('tokens>pass>create>partners>walletAddress'),
        },
      },
      {
        format: { type: FormatTypeColumn.LOCALTIME },
        key: 'createdAt',
        sortable: true,
        sortableTamplate: 'sortBy=createdAt&orderBy={order}',
        preferredSortable: true,
        header: {
          label: translate('contracts>listContracts>criationDate'),
        },
      },
      {
        format: {
          type: FormatTypeColumn.MAPPING,
        },
        key: '',
        sortable: false,
        header: {
          label: 'Status',
        },
      },
    ],
  };

  return (
    <div className="pw-flex pw-flex-col pw-px-4 pw-py-5 pw-shadow-lg sm:pw-px-0 ">
      <OffpixButtonBase className="pw-bg-blue-200" variant="filled">
        Realizar saque
      </OffpixButtonBase>
      <GenericTable
        config={configTable}
        classes={{
          grid: {
            display: 'grid',
            gridTemplateColumns: '1.4fr 1.6fr 0.7fr 1fr 1fr 0.2fr',
          } as any,
        }}
      />
    </div>
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
