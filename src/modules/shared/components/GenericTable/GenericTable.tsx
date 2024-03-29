import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import classNames from 'classnames';
import _ from 'lodash';

import { useDynamicApi } from '../../../storefront/provider/DynamicApiProvider';
import useTruncate from '../../../tokens/hooks/useTruncate';
import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import ClearFilter from '../../assets/icons/clearFilterOutlined.svg?react';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
import FilterIcon from '../../assets/icons/filterOutlined.svg?react';
import MetamaskIcon from '../../assets/icons/metamask.svg?react';
import NoWallet from '../../assets/icons/notConfirmedWalletFilled.svg?react';
import W3blockIcon from '../../assets/icons/pixwayIconFilled.svg?react';
import { useCompanyById } from '../../hooks/useCompanyById';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import { usePaginatedGenericApiGet } from '../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import useTranslation from '../../hooks/useTranslation';
import {
  ConfigGenericTable,
  FormatApiData,
  FormatFilterType,
  FormatTypeColumn,
} from '../../interface/ConfigGenericTable';
import { Alert } from '../Alert';
import { GenerateGenericXlsReports } from '../GenerateGenericXlsReports';
import { GenericButtonActions } from '../GenericButtonActions';
import { Pagination } from '../Pagination';
import SmartGenericFilter from '../SmartGenericFilter/SmartGenericFilter';
import { Spinner } from '../Spinner';

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
    tableStyles,
    lineActions,
    externalFilterClasses,
    paginationType = 'default',
    filtersTitle,
    filtersSubtitle,
    tableTitle,
  } = config;
  const { config: configDynamic } = useDynamicApi();
  const isMobile = useIsMobile();
  const { companyId: tenantId } = useCompanyConfig();
  const { data: company } = useCompanyById(tenantId || '');
  const { name, companyId } = useCompanyConfig();
  const [translate] = useTranslation();
  const [isShowFilterKey, setIsShowFilterKey] = useState<string>();
  const [sort, setSort] = useState<string>('');
  const [filters, setFilters] = useState<any | undefined>();
  const [filterLabels, setFilterLabels] = useState<any | undefined>();
  const methods = useForm();
  const truncate = useTruncate();

  useEffect(() => {
    const itemSorteble = columns.find((item) => item.sortable);
    if (itemSorteble && itemSorteble?.sortableTamplate) {
      setSort(itemSorteble?.sortableTamplate?.replace('{order}', 'ASC'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainWalletAddress = company?.data?.operatorAddress ?? '';

  const tenantName = company?.data.id === companyId ? name : '';

  const [apiUrl, setApiUrl] = useState<string>();

  const [
    { data, isLoading, isError },
    { changePage, page, totalItems, totalPages },
  ] = usePaginatedGenericApiGet({
    url: apiUrl ? apiUrl : dataSource?.url ?? '',
    isPublicApi: dataSource?.isPublicApi,
    ...paginationMapping[paginationType],
  });

  const handleAction = (event: any, action: any, row: any) => {
    if (action && action.type == 'function') {
      event?.preventDefault();
      action.data(row);
    }
  };

  const getHref = (action: any, row: any) => {
    if (action && action.type == 'navigate') {
      let url = action.data;
      if (action.replacedQuery) {
        action.replacedQuery.forEach(
          (item: string) => (url = url.replace(`{${item}}`, _.get(row, item)))
        );

        return url;
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
    linkLabel?: string
  ) => {
    switch (format.type) {
      case FormatTypeColumn.LOCALTIME: {
        const createdDate = _.get(item, itemKey, '--');
        return new Date(createdDate).toLocaleDateString();
      }
      case FormatTypeColumn.MONEY: {
        const symbol = _.get(item, format.currencySymbolKey ?? '', '-');
        const value = _.get(item, itemKey, '');
        return `${symbol}${Number(value).toFixed(2)}`;
      }
      case FormatTypeColumn.MAPPING: {
        const value = _.get(item, itemKey, '');
        const formatedValue = _.get(format.mapping, value);
        const defaultValue = format.mapping.default;
        return formatedValue
          ? formatedValue
          : defaultValue
          ? defaultValue
          : value;
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
                  <CopyIcon className="pw-stroke-blue1" />
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

      default:
        return (
          <div className="pw-w-full">
            <p className="pw-text-ellipsis pw-overflow-hidden">
              {_.get(item, itemKey, '--') ?? '---'}
            </p>
          </div>
        );
    }
  };

  const renderFilterValues = (
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

  const onHandleSort = (value: string) => {
    if (sort.includes('ASC')) {
      setSort(value.replace('{order}', 'DESC'));
    } else if (sort.includes('DESC')) {
      setSort(value.replace('{order}', 'ASC'));
    }
  };

  const onClearFilter = (item: string) => {
    const removedFilter = _.omit(filters, item);
    const removedFilterLabels = _.omit(filterLabels, item);

    setFilters(removedFilter);
    setFilterLabels(removedFilterLabels);
  };

  const onClearAllFilter = () => {
    setFilters({});
    setFilterLabels({});
  };

  const renderClearFilterButton = () => {
    const filterValues = Object.values(filters || {});
    if (filterValues.some((item: any) => item?.length)) {
      return (
        <button
          className="pw-min-w-[165px] !pw-h-[44px] pw-px-4 pw-py-2 pw-flex pw-gap-x-3 pw-border pw-border-[#aaa] pw-rounded-md pw-items-center hover:pw-shadow-lg"
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
              <p className="pw-text-[15px] pw-font-semibold pw-mb-2">
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
                  .map(({ header, key }) => {
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
                        />
                      </div>
                    );
                  })}
              </div>
              <div
                className="pw-mt-2 sm:pw-mt-0"
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
                              linkLabel
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
        </div>

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
