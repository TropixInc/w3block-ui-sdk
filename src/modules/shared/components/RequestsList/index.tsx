/* eslint-disable @typescript-eslint/no-unused-vars */
import { W3blockAPI } from '../../enums';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import {
  ConfigGenericTable,
  FilterTableType,
  FormatFilterType,
  FormatTypeColumn,
} from '../../interface';
import { GenericTable } from '../GenericTable';
import RequestItemWrapper from '../RequestItemWrapper';

const RequestsList = () => {
  const { companyId: tenantId } = useCompanyConfig();

  const statusDisplayMap = [
    {
      value: 'approved',
      label: 'Aprovado',
    },
    {
      value: 'requiredReview',
      label: 'Pendente revisão',
    },
    {
      value: 'created',
      label: 'Criado',
    },
    {
      value: 'draft',
      label: 'Rascunho',
    },
    {
      value: 'denied',
      label: 'Recusado',
    },
  ];

  const onRenderExpansibleComponent = (
    data: any,
    setOpenExpansible: (value: boolean) => void,
    setIsUpdateList: (value: boolean) => void
  ) => {
    if (data) {
      return (
        <RequestItemWrapper
          contextId={data.contextId}
          onChangeIsRenderKycItem={setOpenExpansible}
          slugContext={data.context.slug}
          userId={data.userId}
          userContextId={data.id}
          setIsUpdateList={setIsUpdateList}
        />
      );
    }
  };

  const configTable: ConfigGenericTable = {
    localeItems: 'data.items',
    isLineExplansible: true,
    filtersTitle: 'Filtre o resultado',
    expansibleComponent: (
      data: any,
      setOpenExpansible: (value: boolean) => void,
      setIsUpdateList: (value: boolean) => void
    ) => onRenderExpansibleComponent(data, setOpenExpansible, setIsUpdateList),

    externalFilterClasses: {
      container: {
        width: '100%',
        marginBottom: '20px',
      },

      buttonsContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '10px',
        fontSize: '14px',
        marginTop: '0px',
      },
      reportsButton: {
        fontSize: '14px',
        backgroundColor: '#0050FF',
      },
    },
    dataSource: {
      url: `/users/${tenantId}/contexts/find?contextType=form&excludeSelfContexts=true&sortBy=createdAt&orderBy=DESC`,
      urlContext: W3blockAPI.ID,
      type: FilterTableType.DYNAMIC,
      isPublicApi: false,
    },
    tableStyles: {
      root: { width: '100%' },
      header: '!pw-grid-cols-[18%_20%] !pw-text-black',
      line: '!pw-grid-cols-[18%_20%] !pw-text-black',
    },

    columns: [
      {
        format: { type: FormatTypeColumn.TEXT },
        key: 'context.description',
        sortable: false,
        header: {
          label: 'Tipo',
          filter: {
            format: FormatFilterType.SELECT,
            type: FilterTableType.DYNAMIC,
            data: {
              url: `/tenant-context/${tenantId}?type=form`,
              filterUrlContext: W3blockAPI.ID,
              parameters: {
                itemsPath: 'data.items',
                key: 'contextId',
                label: 'context.description',
                dependencies: {},
              },
            },
            filterTemplate: 'contextId={context.description}',
            filterClass: { width: '30%' },
            placement: 'external',
            placeholder: 'Selecione o formulário',
          },
        },
      },
      {
        format: {
          type: FormatTypeColumn.USER,
        },
        key: 'user.email',
        sortable: false,
        header: {
          label: 'Usuário',
          filter: {
            format: FormatFilterType.SEARCH,
            type: FilterTableType.DYNAMIC,
            data: {
              url: `/users/${tenantId}`,
              filterUrlContext: W3blockAPI.ID,
              parameters: {
                itemsPath: 'data.items',
                key: 'id',
                label: 'email',
                filterDynamicParameter: 'email',
                dependencies: {},
              },
            },
            filterTemplate: 'userId={user.email}',
            filterClass: { width: '37%' },
            placement: 'external',
            placeholder: 'Busque por usuário',
          },
        },
        moreInfos: {
          name: 'user.name',
        },
      },
      {
        format: {
          type: FormatTypeColumn.LOCALDATEHOURTIME,
        },
        key: 'createdAt',
        sortable: true,
        header: {
          label: 'Data de criação',
        },
      },
      {
        format: {
          type: FormatTypeColumn.MAPPING,
          mapping: {
            approved: 'Aprovado',
            requiredReview: 'Pendente revisão',
            created: 'Criado',
            draft: 'Rascunho',
            denied: 'Recusado',
          },
        },
        key: 'status',
        initialSortParameter: 'created',
        sortable: false,
        header: {
          label: 'Situação',
          filter: {
            format: FormatFilterType.MULTISELECT,
            type: FilterTableType.STATIC,
            filterTemplate: 'status={status}',
            values: statusDisplayMap,
            filterClass: { width: '30%' },
            placement: 'external',
            placeholder: 'Selecione a situação',
          },
        },
      },
    ],
  };

  return (
    <div>
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

export default RequestsList;
