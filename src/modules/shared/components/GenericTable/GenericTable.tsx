import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import classNames from 'classnames';
import _ from 'lodash';

import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import useTruncate from '../../../tokens/hooks/useTruncate';
import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import ClearFilter from '../../assets/icons/clearFilterOutlined.svg?react';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
/* import FilterIcon from '../../assets/icons/filterOutlined.svg?react'; */
import MetamaskIcon from '../../assets/icons/metamask.svg?react';
import NoWallet from '../../assets/icons/notConfirmedWalletFilled.svg?react';
import W3blockIcon from '../../assets/icons/pixwayIconFilled.svg?react';
import { useRouterConnect } from '../../hooks';
import { useCompanyById } from '../../hooks/useCompanyById';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { useDynamicValueByTable } from '../../hooks/useDynamicValueByTable/useDynamicValueByTable';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import { usePaginatedGenericApiGet } from '../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import useTranslation from '../../hooks/useTranslation';
import {
  ConfigGenericTable,
  FormatApiData,
  /*  FormatFilterType, */
  FormatTypeColumn,
} from '../../interface/ConfigGenericTable';
import { Alert } from '../Alert';
import { GenerateGenericXlsReports } from '../GenerateGenericXlsReports';
import { Pagination } from '../Pagination';
import SmartGenericFilter from '../SmartGenericFilter/SmartGenericFilter';
import { Spinner } from '../Spinner';
import Line from './Line';

interface GenericTableProps {
  config: ConfigGenericTable;
  classes?: {
    root?: string;
    grid?: string;
    rows?: string;
  };
}

const paginationMapping = {
  default: {},
  strapi: {
    inputMap: (data: any) => {
      if (data) {
        return {
          totalItems: data?.meta?.pagination?.total,
          totalPages: data?.meta?.pagination?.pageCount,
        };
      }
    },
    outputMap: (params: any) => {
      const newParams = { ...params, page: undefined };
      newParams['pagination[pageSize]'] = 10;
      newParams['pagination[page]'] = params?.page;

      return newParams;
    },
  },
};

export const GenericTable = ({ classes, config }: GenericTableProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    columns,
    localeItems,
    dataSource,
    xlsReports,
    actions,
    isLineExplansible,
    tableStyles,
    lineActions,
    externalFilterClasses,
    paginationType = 'default',
    filtersTitle,
    filtersSubtitle,
    tableTitle,
    expansibleComponent,
  } = config;
  const { config: configDynamic } = useDynamicApi();
  const router = useRouterConnect();
  const isMobile = useIsMobile();
  const { companyId: tenantId } = useCompanyConfig();
  const { data: company } = useCompanyById(tenantId || '');
  const getValue = useDynamicValueByTable();
  const { name, companyId } = useCompanyConfig();
  const [translate, locale] = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isShowFilterKey, setIsShowFilterKey] = useState<string>();
  const [sort, setSort] = useState<string>('');
  const [filters, setFilters] = useState<any | undefined>();
  const [filterLabels, setFilterLabels] = useState<any | undefined>();
  const [apiUrl, setApiUrl] = useState<string>();
  const methods = useForm();
  const [isUpdateList, setIsUpdateList] = useState(false);
  const truncate = useTruncate();

  useEffect(() => {
    const itemSorteble = columns.filter((item) => item.sortable);
    const preferSortable = itemSorteble.find((item) => item.preferredSortable);

    if (preferSortable && preferSortable?.sortableTamplate) {
      setSort(
        preferSortable?.sortableTamplate?.replace(
          '{order}',
          preferSortable.initialSortParameter
            ? preferSortable.initialSortParameter
            : 'DESC'
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainWalletAddress = company?.data?.operatorAddress ?? '';

  const tenantName = company?.data.id === companyId ? name : '';

  const [
    { data, isLoading, isError, refetch },
    { changePage, page, totalItems, totalPages },
  ] = usePaginatedGenericApiGet({
    internalTypeAPI: dataSource?.urlContext,
    url: apiUrl ? apiUrl : dataSource?.url ?? '',
    isPublicApi: dataSource?.isPublicApi,
    ...paginationMapping[paginationType],
  });

  useEffect(() => {
    if (isUpdateList) {
      refetch().finally(() => {
        setIsUpdateList(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateList]);

  const handleAction = (event: any, action: any, row: any) => {
    if (action && action.type == 'function') {
      event?.preventDefault();
      action.data(row);
    } else if (action && action.type == 'navigate') {
      getHref(lineActions?.action, row);
    } else {
      null;
    }
  };

  const getHref = (action: any, row: any) => {
    if (action && action.type == 'navigate') {
      let url = action.data;
      if (action.replacedQuery) {
        action.replacedQuery.forEach(
          (item: string) => (url = url.replace(`{${item}}`, _.get(row, item)))
        );

        router.pushConnect(url);
      }
    } else if (action && action.type == 'function') {
      return '';
    }
  };

  useEffect(() => {
    const arrFilters = (filters && Object.values(filters)) || [];
    const filteredArrFilters = arrFilters?.filter(
      (item: string) => (item as string)?.length > 0
    );

    let replacedUrl = dataSource?.url;

    const replacements = Array.from(
      (dataSource?.url ?? '').matchAll(new RegExp(/{(\w+)}*/g))
    );

    replacements.forEach((item) => {
      const y = configDynamic?.groups[item[1]];

      if (y !== undefined) {
        replacedUrl = replacedUrl?.replace(item[0], y);
      }
    });

    if (filteredArrFilters?.length) {
      changePage(1);
    }

    if (replacedUrl && filteredArrFilters?.length) {
      if (replacedUrl.includes('?')) {
        setApiUrl(`${replacedUrl}&${filteredArrFilters.join('&')}&${sort}`);
      } else {
        setApiUrl(`${replacedUrl}?${filteredArrFilters.join('&')}&${sort}`);
      }
    } else {
      if (replacedUrl && sort) {
        if (replacedUrl.includes('?')) {
          setApiUrl(`${replacedUrl}&${sort}`);
        } else {
          setApiUrl(`${replacedUrl}?${sort}`);
        }
      } else {
        setApiUrl(replacedUrl);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash || '');
  };

  const customizerValues = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    itemKey: string,
    format: FormatApiData,
    basicUrl?: string,
    keyInCollection?: string,
    moreInfos?: any,
    hrefLink?: string,
    linkLabel?: string,
    isTranslatable?: boolean,
    translatePrefix?: string,
    isDynamic?: boolean
  ) => {
    switch (format.type) {
      case FormatTypeColumn.LOCALTIME: {
        const date = _.get(item, itemKey, '--');

        return new Date(date).toLocaleDateString(locale.language, {
          timeZone: 'UTC',
        });
      }
      case FormatTypeColumn.LOCALDATEHOURTIME: {
        const date = _.get(item, itemKey, '--');
        return new Date(date).toLocaleString(locale.language);
      }
      case FormatTypeColumn.MONEY: {
        const symbol = _.get(item, format.currencySymbolKey ?? '', '-');
        const value = _.get(item, itemKey, '');
        return `${symbol}${Number(value).toFixed(2)}`;
      }
      case FormatTypeColumn.MAPPING: {
        const value = _.get(item, itemKey, '');
        const formatedValue = _.get(
          format.mapping,
          value,
          format.mapping.default
        );
        const dynamicValue = getValue(formatedValue, item);

        return dynamicValue ? dynamicValue : formatedValue || value;
      }
      case FormatTypeColumn.HASH: {
        const value = _.get(item, itemKey, '');
        const truncateValue = `${truncate(value || '', {
          maxCharacters: 5,
        })}${(value ?? '').slice(-4)}`;

        return (
          <div>
            <div className="pw-flex pw-items-center pw-gap-x-1">
              <p>{truncateValue}</p>
              {value && (
                <button onClick={() => handleCopy(value)}>
                  <CopyIcon className="pw-stroke-[#71b1ff]" />
                </button>
              )}
            </div>
            {mainWalletAddress === value && (
              <p className="pw-text-sm pw-font-medium pw-opacity-70">
                {tenantName}
              </p>
            )}
          </div>
        );
      }
      case FormatTypeColumn.THUMBNAIL: {
        return (
          <div className="block pw-min-w-10 pw-min-h-10 pw-w-10 pw-h-10 pw-rounded-md">
            {_.get(item, itemKey, '') ? (
              <img
                src={
                  basicUrl
                    ? `${basicUrl}${_.get(item, itemKey, '')}`
                    : _.get(item, itemKey, '')
                }
                alt=""
                className="block pw-min-w-10 pw-min-h-10 pw-w-10 pw-h-10 pw-rounded-md"
              />
            ) : (
              <div className="block pw-min-w-10 pw-min-h-10 pw-w-10 pw-h-10 pw-rounded-md pw-border"></div>
            )}
          </div>
        );
      }
      case FormatTypeColumn.COLLECTION: {
        const value = _.get(item, itemKey, '');
        const valueRendered = _.get(value[0], keyInCollection ?? '', '');

        if (value?.length > 1) {
          return (
            <p>
              <p>{valueRendered}</p>
              <p className="pw-text-xs pw-opacity-70">{`+${
                value?.length - 1
              } academia(s)`}</p>
            </p>
          );
        } else {
          return valueRendered;
        }
      }

      case FormatTypeColumn.USER: {
        return (
          <div className="pw-w-full">
            <div className="pw-w-full pw-flex pw-gap-x-1 pw-flex-col">
              <p className="pw-w-[165px] pw-text-ellipsis pw-overflow-hidden sm:pw-w-full">
                {_.get(item, itemKey, '--')}
              </p>
              <p className="pw-w-[165px] pw-text-ellipsis pw-overflow-hidden  pw-text-xs pw-opacity-60 pw-flex pw-flex-col sm:pw-w-full">
                <span>{_.get(item, moreInfos.name, '')}</span>
                <span>{_.get(item, moreInfos.cpf, '')}</span>
                <span>{_.get(item, moreInfos.phone, '')}</span>
              </p>
            </div>
          </div>
        );
      }
      case FormatTypeColumn.WALLET: {
        if (_.get(item, itemKey)) {
          return (
            <div className="pw-w-[200px] pw-flex pw-gap-2 pw-items-center sm:pw-w-full">
              {_.get(item, moreInfos.name, '') === 'metamask' ? (
                <MetamaskIcon className="!pw-w-6 !pw-h-6 sm:!pw-w-10 sm:!pw-h-10" />
              ) : (
                <W3blockIcon className="!pw-w-6 !pw-h-6 pw-fill-[#5682C3] pw-stroke-[#DDE6F3] sm:!pw-w-10 sm:!pw-h-10" />
              )}

              <div>
                <p className="pw-w-full pw-text-sm">
                  {_.get(item, moreInfos.name, '') === 'metamask'
                    ? translate('shared>genericTable>metamaskWallet')
                    : translate('addFunds>type>weblockWallet')}
                </p>
                <p className="pw-w-[150px] pw-text-sm pw-text-ellipsis pw-overflow-hidden sm:pw-w-full">
                  {_.get(item, itemKey)}
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="pw-flex pw-items-center">
              <NoWallet className="!pw-w-6 !pw-h-6 sm:!pw-w-10 sm:!pw-h-10" />
              <p className="text-sm text-[#A9A9A9] line-clamp-1">
                {translate('contacts>contactItem>notConfimed')}
              </p>
            </div>
          );
        }
      }

      case FormatTypeColumn.LINK: {
        return (
          <a
            className="pw-font-medium pw-text-blue-600"
            href={hrefLink?.replace('{replacedValue}', _.get(item, itemKey))}
          >
            {linkLabel}
          </a>
        );
      }

      default: {
        const value = _.get(item, itemKey);
        const dynamicValue = getValue(itemKey, item);
        return (
          <div className="pw-w-full">
            <p className="pw-text-ellipsis pw-overflow-hidden">
              {isTranslatable && value ? (
                translate(`${translatePrefix || ''}${value ?? '---'}`)
              ) : (
                <p>
                  {isDynamic && dynamicValue ? dynamicValue : value || '--'}
                </p>
              )}
            </p>
          </div>
        );
      }
    }
  };

  /*   const renderFilterValues = (
    values: any,
    type?: FormatFilterType,
    options?: any
  ) => {
    switch (type) {
      case FormatFilterType.LOCALDATE:
        {
          if (values?.length) {
            return `${translate('commerce>salesReportsFiltersSection>from')}: ${
              values[0]
            } - ${translate('commerce>salesReportsFiltersSection>until')}: ${
              values[1]
            }`;
          }
        }
        break;
      case FormatFilterType.NUMBER:
        {
          if (values?.length) {
            return `${translate('commerce>salesReportsFiltersSection>from')}: ${
              values[0]
            } - ${translate('commerce>salesReportsFiltersSection>until')}: ${
              values[1]
            }`;
          }
        }
        break;
      case FormatFilterType.MULTISELECT:
        {
          const selected = (values as Array<string>)?.map((item) => {
            return (options as Array<{ value: string }>)?.find(
              ({ value }) => value === item
            );
          });
          if (selected?.length > 0) {
            return (selected as Array<any>)
              .map(({ label }) => label)
              .join(', ');
          }
        }
        break;
      case FormatFilterType.SELECT: {
        const selected = (
          options as Array<{ value: string; label: string }>
        )?.find(({ value }) => value === values);
        return selected ? selected?.label : '';
      }

      default: {
        return values ? values : '';
      }
    }
  };
 */
  const onHandleSort = (value: string) => {
    if (sort.includes('ASC')) {
      setSort(value.replace('{order}', 'DESC'));
    } else if (sort.includes('DESC')) {
      setSort(value.replace('{order}', 'ASC'));
    }
  };

  /*   const onClearFilter = (item: string) => {
    const removedFilter = _.omit(filters, item);
    const removedFilterLabels = _.omit(filterLabels, item);

    setFilters(removedFilter);
    setFilterLabels(removedFilterLabels);
  };
 */
  const onClearAllFilter = () => {
    setFilters({});
    setFilterLabels({});
  };

  const handleCalcColumnSpan = () => {
    let columnsLength = columns.filter((item) => item.header.label).length;

    if (actions) columnsLength = columnsLength + 1;

    return (columnsLength = columnsLength + 1);
  };

  const renderClearFilterButton = () => {
    const filterValues = Object.values(filters || {});
    if (filterValues.some((item: any) => item?.length)) {
      return (
        <button
          className="pw-w-full pw-min-w-[165px] !pw-h-[44px] pw-px-4 pw-py-2 pw-flex pw-gap-x-3 pw-border pw-border-[#aaa] pw-rounded-md pw-items-center pw-justify-center hover:pw-shadow-lg"
          onClick={() => onClearAllFilter()}
          style={externalFilterClasses?.clearFilterButton}
        >
          <span className="pw-text-[#aaa] pw-font-medium">
            {translate('shared>genericTable>clearFilters')}
          </span>
          <ClearFilter className="pw-stroke-2 pw-stroke-[#aaa] pw-w-5 pw-h-5" />
        </button>
      );
    } else return null;
  };

  return (
    <div className="pw-w-full pw-mt-20">
      <FormProvider {...methods}>
        <div className="pw-text-black">
          <div style={externalFilterClasses?.container}>
            {filtersTitle ? (
              <p className="pw-text-[22px] pw-font-semibold pw-mb-2">
                {filtersTitle}
              </p>
            ) : null}
            {filtersSubtitle ? (
              <p className="pw-text-[14px] pw-font-semibold pw-mb-2">
                {filtersSubtitle}
              </p>
            ) : null}
            <div
              style={externalFilterClasses?.wrapper}
              className="pw-w-full sm:pw-flex sm:pw-justify-between"
            >
              <div
                style={externalFilterClasses?.root}
                className={classNames(
                  'pw-relative pw-w-full pw-gap-x-3 pw-gap-y-3 pw-flex-wrap sm:pw-max-w-[900px] sm:pw-flex'
                )}
              >
                {columns
                  .filter(
                    (item) => item.header.filter?.placement === 'external'
                  )
                  .map(({ header, key, isTranslatable, translatePrefix }) => {
                    return (
                      <div
                        key={key}
                        style={
                          !isMobile ? (header.filter?.filterClass as any) : {}
                        }
                        className="pw-w-full"
                      >
                        <SmartGenericFilter
                          filterType={header.filter?.type}
                          filterFormat={header.filter?.format}
                          filterOptions={header.filter?.values}
                          itemShowFilterKey={key}
                          itemKey={key}
                          filters={filters}
                          onChangeFilter={setFilters}
                          onCloseFilters={setIsShowFilterKey}
                          filterLabels={filterLabels}
                          onChangeFilterLabels={setFilterLabels}
                          filterTemplate={
                            header.filter?.replacedFilterTemplate
                              ? header.filter?.replacedFilterTemplate
                              : header.filter?.filterTemplate
                          }
                          filterOptionsUrl={header.filter?.data?.url}
                          filterContext={header.filter?.data?.filterUrlContext}
                          dynamicFilterParameters={
                            header.filter?.data?.parameters
                          }
                          filterPlaceholder={header.filter?.placeholder}
                          isPublicFilterApi={
                            header.filter?.data?.isPublicFilterApi
                          }
                          isFilterDependency={
                            header.filter?.data?.parameters?.isFilterDependency
                          }
                          filterDependencies={
                            header.filter?.data?.parameters?.dependencies
                          }
                          isTranslatable={isTranslatable}
                          translatePrefix={translatePrefix}
                        />
                      </div>
                    );
                  })}
              </div>
              <div
                className="pw-mt-1 pw-w-full sm:pw-mt-1 sm:pw-ml-1 sm:pw-max-w-[200px]"
                style={externalFilterClasses?.buttonsContainer}
              >
                {xlsReports?.url && (
                  <GenerateGenericXlsReports
                    url={xlsReports.url}
                    context={xlsReports.urlContext}
                    filters={filters}
                    observerUrlReport={xlsReports.observerUrl}
                    sort={sort}
                    styleClass={externalFilterClasses?.reportsButton}
                  />
                )}
                {renderClearFilterButton()}
              </div>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'pw-w-full pw-overflow-auto',
            classes?.root ?? ''
          )}
          style={tableStyles?.root as any}
        >
          {tableTitle ? (
            <p className="pw-text-[22px] pw-font-semibold pw-mt-5 pw-mb-4">
              {tableTitle}
            </p>
          ) : null}
          <div className="pw-rounded-t-2xl">
            <table
              className={classNames(
                tableStyles?.table ?? '',
                'pw-w-full pw-border-collapse pw-border pw-rounded-t-2xl pw-relative'
              )}
            >
              <thead className="pw-rounded-2xl">
                <tr
                  className={classNames(
                    'pw-h-[72px] pw-bg-[#DDE6F3] pw-px-1 !pw-border-b-0 pw-rounded-2xl pw-text-sm pw-items-center pw-w-full',
                    tableStyles?.header ?? ''
                  )}
                >
                  {columns
                    .filter(({ header }) => header.label)
                    .map(
                      ({
                        sortable,
                        header,
                        key,
                        sortableTamplate,
                        columnStyles,
                      }) => (
                        <th
                          className={classNames(
                            'pw-text-left pw-px-3 pw-relative'
                          )}
                          key={key}
                          scope="col"
                        >
                          <div
                            className={classNames(
                              columnStyles,
                              'pw-flex pw-gap-2 pw-items-center'
                            )}
                          >
                            {header.label}
                            {sortable ? (
                              <div className="pw-flex pw-gap-x-1 pw-items-center">
                                <div className="pw-relative pw-z-20">
                                  <button
                                    className={classNames(
                                      'pw-w-6 pw-h-6 pw-flex pw-items-center pw-justify-center pw-rounded-[4px] pw-stroke-2',
                                      sort.includes(
                                        key.replace('attributes.', '')
                                      )
                                        ? 'pw-bg-blue-200'
                                        : 'pw-opacity-80'
                                    )}
                                    onClick={() =>
                                      onHandleSort(sortableTamplate ?? '')
                                    }
                                  >
                                    <ArrowDown
                                      className={classNames(
                                        sort.includes(
                                          key.replace('attributes.', '')
                                        )
                                          ? 'pw-stroke-white'
                                          : 'pw-stroke-blue-700',
                                        sort.includes(
                                          key.replace('attributes.', '')
                                        ) && sort.includes('ASC')
                                          ? 'pw-rotate-180'
                                          : 'pw-rotate-0'
                                      )}
                                    />
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </th>
                      )
                    )}
                  {actions || isLineExplansible ? (
                    <th
                      className={classNames(
                        'pw-text-left pw-px-3 pw-w-[40px] pw-relative'
                      )}
                      scope="col"
                    ></th>
                  ) : null}
                </tr>
              </thead>
              <div
                className={classNames(
                  isLoading ||
                    isError ||
                    !_.get(data, localeItems ?? '', [])?.length
                    ? 'pw-h-20 pw-flex pw-items-end'
                    : ''
                )}
              >
                {!isLoading &&
                  !_.get(data, localeItems ?? '', [])?.length &&
                  !isError && (
                    <Alert
                      variant="information"
                      className="pw-bg-[#eee] pw-text-[#999] pw-w-full pw-absolute"
                    >
                      {translate('token>pass>notResult')}
                    </Alert>
                  )}
                {isError && (
                  <Alert variant="error" className="pw-w-full pw-absolute">
                    {translate('contact>inviteContactTemplate>error')}
                  </Alert>
                )}

                {isLoading && (
                  <div className="pw-w-full pw-flex pw-py-5 pw-items-center pw-justify-center pw-absolute">
                    <Spinner />
                  </div>
                )}
              </div>

              <tbody className="">
                {!isLoading && _.get(data, localeItems ?? '', [])?.length
                  ? _.get(data, localeItems ?? '', []).map((item: any) => (
                      <Line
                        columns={columns}
                        customizerValues={customizerValues}
                        handleAction={handleAction}
                        handleCalcColumnSpan={handleCalcColumnSpan}
                        item={item}
                        tableStyles={tableStyles}
                        actions={actions}
                        isLineExplansible={isLineExplansible}
                        key={item.id}
                        lineActions={lineActions}
                        expansibleComponent={expansibleComponent}
                        setIsUpdateList={setIsUpdateList}
                      />
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>

        {/*         <div
          className={classNames(
            'pw-w-full pw-overflow-auto',
            classes?.root ?? ''
          )}
          style={tableStyles?.root as any}
        >
          {tableTitle ? (
            <p className="pw-text-[22px] pw-font-semibold pw-mt-5 pw-mb-4">
              {tableTitle}
            </p>
          ) : null}

          <div
            style={classes?.grid as any}
            className={classNames(
              'pw-h-[72px] pw-bg-[#DDE6F3] pw-px-3 pw-gap-x-2 !pw-border-b-0 pw-rounded-t-2xl pw-w-[800px] pw-text-sm pw-items-center pw-grid sm:pw-w-full',
              tableStyles?.header ?? ''
            )}
          >
            {columns
              .filter(({ header }) => header.label)
              .map(({ sortable, header, key, sortableTamplate }) => (
                <div key={key} className="pw-w-full pw-relative">
                  <div className="pw-flex pw-items-center pw-justify-between">
                    <p
                      className={classNames(
                        'pw-font-semibold pw-text-left pw-flex pw-flex-col pw-text-sm',
                        header.filter ? 'pw-w-[70%]' : 'pw-w-full'
                      )}
                    >
                      <span>{header.label}</span>
                      {header.filter?.placement !== 'external' ? (
                        <span className="pw-text-xs pw-font-normal pw-opacity-90 pw-line-clamp-2">
                          {renderFilterValues(
                            (filterLabels as any)?.[key],
                            header.filter?.format,
                            header.filter?.values
                          )}
                        </span>
                      ) : null}
                    </p>
                    <div className="pw-flex pw-gap-x-1 pw-items-center">
                      {sortable ? (
                        <div className="pw-relative pw-z-20">
                          <button
                            className={classNames(
                              'pw-w-6 pw-h-6 pw-flex pw-items-center pw-justify-center pw-rounded-[4px] pw-stroke-2',
                              sort.includes(key)
                                ? 'pw-bg-blue1'
                                : 'pw-opacity-80'
                            )}
                            onClick={() => onHandleSort(sortableTamplate ?? '')}
                          >
                            <ArrowDown
                              className={classNames(
                                sort.includes(key)
                                  ? 'pw-stroke-white'
                                  : 'pw-stroke-blue1',
                                sort.includes('ASC')
                                  ? 'pw-rotate-180'
                                  : 'pw-rotate-0'
                              )}
                            />
                          </button>
                        </div>
                      ) : null}
                      {header.filter?.placement !== 'external' ? (
                        <>
                          {(filterLabels as any)?.[key]?.length ? (
                            <button
                              className="pw-w-6 pw-h-6"
                              onClick={() => onClearFilter(key)}
                            >
                              <ClearFilter className="pw-stroke-2 pw-stroke-red-500 pw-w-5 pw-h-5" />
                            </button>
                          ) : null}
                          {header.filter ? (
                            <div>
                              <button
                                className={classNames(
                                  'pw-w-6 pw-h-6 pw-flex pw-items-center pw-justify-center pw-rounded-[4px]',
                                  (filterLabels as any)[key]?.length
                                    ? 'pw-bg-blue1'
                                    : 'pw-opacity-80'
                                )}
                                onClick={() => setIsShowFilterKey(key)}
                              >
                                <FilterIcon
                                  className={classNames(
                                    (filterLabels as any)[key]?.length
                                      ? 'pw-stroke-white'
                                      : 'pw-stroke-blue1'
                                  )}
                                />
                              </button>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="pw-absolute pw-w-full">
                    <SmartGenericFilter
                      filterType={header.filter?.type}
                      filterFormat={header.filter?.format}
                      filterOptions={header.filter?.values}
                      itemShowFilterKey={isShowFilterKey}
                      itemKey={key}
                      filters={filters}
                      onChangeFilter={setFilters}
                      onCloseFilters={setIsShowFilterKey}
                      filterLabels={filterLabels}
                      onChangeFilterLabels={setFilterLabels}
                      filterTemplate={
                        header.filter?.replacedFilterTemplate
                          ? header.filter?.replacedFilterTemplate
                          : header.filter?.filterTemplate
                      }
                      filterOptionsUrl={header.filter?.data?.url}
                      filterContext={header.filter?.data?.filterUrlContext}
                      dynamicFilterParameters={header.filter?.data?.parameters}
                      filterPlaceholder={header.filter?.placeholder}
                      isPublicFilterApi={header.filter?.data?.isPublicFilterApi}
                      isFilterDependency={
                        header.filter?.data?.parameters?.isFilterDependency
                      }
                      filterDependencies={
                        header.filter?.data?.parameters?.dependencies
                      }
                    />
                  </div>
                </div>
              ))}
          </div>

          {isLoading && (
            <div className="pw-w-full pw-flex pw-py-10 pw-items-center pw-justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && _.get(data, localeItems ?? '', [])?.length ? (
            <div className="pw-h-auto pw-w-[800px] pw-border pw-border-t-0 pw-rounded-b-2xl sm:pw-w-full">
              {_.get(data, localeItems ?? '', []).map((item: any) => (
                <a
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  key={(item as any).id}
                  onClick={(e) => handleAction(e, lineActions?.action, item)}
                  href={getHref(lineActions?.action, item)}
                  style={classes?.grid as any}
                  className={classNames(
                    'pw-w-[800px] pw-grid  pw-px-3 pw-items-center pw-gap-x-2 pw-py-[19px] pw-border-t sm:pw-w-full ',
                    tableStyles?.line ?? '',
                    lineActions ? 'pw-cursor-pointer' : 'pw-cursor-default'
                  )}
                >
                  {columns
                    .filter(({ header }) => header.label)
                    .map(
                      ({
                        key,
                        format,
                        header,
                        keyInCollection,
                        moreInfos,
                        hrefLink,
                        linkLabel,
                        isTranslatable,
                        translatePrefix,
                      }) => (
                        <p key={key} className="pw-text-sm pw-text-left">
                          <span>
                            {customizerValues(
                              item as any,
                              key,
                              format,
                              header.baseUrl,
                              keyInCollection,
                              moreInfos,
                              hrefLink,
                              linkLabel,
                              isTranslatable,
                              translatePrefix
                            )}
                          </span>
                        </p>
                      )
                    )}
                  <GenericButtonActions
                    dataItem={item}
                    actions={actions ?? []}
                  />
                </a>
              ))}
            </div>
          ) : null}
          {!isLoading &&
            !_.get(data, localeItems ?? '', [])?.length &&
            !isError && (
              <Alert
                variant="information"
                className="pw-bg-[#eee] pw-text-[#999]"
              >
                {translate('token>pass>notResult')}
              </Alert>
            )}
          {isError && (
            <Alert variant="error" className="pw-mt-5">
              {translate('contact>inviteContactTemplate>error')}
            </Alert>
          )}
        </div> */}

        {totalItems && totalPages && totalPages > 1 ? (
          <div className="pw-flex pw-justify-end pw-gap-x-4 pw-items-center pw-mb-10 pw-mt-2">
            <p className="pw-text-sm pw-font-semibold">
              {translate('keytokenEditionsList>totalItems', {
                total: totalItems,
              })}
            </p>

            <Pagination
              currentPage={page ?? 1}
              onChangePage={changePage}
              pagesQuantity={totalPages ?? 0}
            />
          </div>
        ) : null}
      </FormProvider>
    </div>
  );
};
