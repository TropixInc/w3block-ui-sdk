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
import { useModalController } from '../../../shared/hooks/useModalController';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import WithdrawModal from '../../components/WithdrawModal/WithdrawModal';

const _WithdrawsTemplateSDK = () => {
  const { companyId: tenantId } = useCompanyConfig();
  const [translate] = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isOpen, openModal, closeModal } = useModalController();

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
        format: { type: FormatTypeColumn.LOCALTIME },
        key: 'email',
        sortable: false,
        moreInfos: {
          name: 'name',
          cpf: 'cpf',
          phone: 'phone',
        },
        header: {
          label: 'Data',
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
    <>
      <div className="pw-flex pw-flex-col pw-px-4 pw-pt-5 pw-shadow-lg sm:pw-px-0 ">
        <div className="pw-flex pw-pr-5 pw-items-end pw-justify-end pw-w-full">
          <OffpixButtonBase
            className="pw-max-w-[320px] pw-w-full"
            variant="filled"
          >
            Realizar saque
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
      </div>
      <WithdrawModal isOpen onClose={closeModal} />
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
