import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';

import useTruncate from '../../../tokens/hooks/useTruncate';
import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import ClearFilter from '../../assets/icons/clearFilterOutlined.svg?react';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
import FilterIcon from '../../assets/icons/filterOutlined.svg?react';
import { useCompanyById } from '../../hooks/useCompanyById';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
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

export const GenericTable = ({ classes, config }: GenericTableProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    columns,
    dataSource,
    xlsReports,
    actions,
    tableStyles,
    lineActions,
    externalFilterClasses,
  } = config;

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
  const router = useRouter();
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
    context: dataSource?.urlContext,
  });

  const handleAction = (action: any, row: any) => {
    if (action && action.type == 'navigate') {
      let url = action.data;
      if (action.replacedQuery) {
        action.replacedQuery.forEach(
          (item: string) => (url = url.replace(`{${item}}`, _.get(row, item)))
        );

        router.push(url);
      }
    } else if (action && action.type == 'function') {
      action.data(row);
    }
  };

  useEffect(() => {
    const arrFilters = (filters && Object.values(filters)) || [];
    const filteredArrFilters = arrFilters?.filter(
      (item: string) => (item as string)?.length > 0
    );

    if (filteredArrFilters?.length) {
      if (dataSource?.url.includes('?')) {
        setApiUrl(`${dataSource?.url}&${filteredArrFilters.join('&')}&${sort}`);
      } else {
        setApiUrl(`${dataSource?.url}?${filteredArrFilters.join('&')}&${sort}`);
      }
    } else {
      if (sort) {
        if (dataSource?.url.includes('?')) {
          setApiUrl(`${dataSource?.url}&${sort}`);
        } else {
          setApiUrl(`${dataSource?.url}?${sort}`);
        }
      } else {
        setApiUrl(dataSource?.url);
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
    format: FormatApiData
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
        const formatedValue = _.get(format.mapping, value, '-');

        return formatedValue ? formatedValue : value;
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
          <img
            src={_.get(item, itemKey, '')}
            alt=""
            className="pw-w-10 pw-h-10 pw-rounded-md"
          />
        );
      }

      default:
        return (
          <div className="pw-w-full">
            <p className="pw-text-ellipsis pw-overflow-hidden">
              {_.get(item, itemKey, '--')}
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

  return (
    <div className="pw-w-full">
      <FormProvider {...methods}>
        <div className="pw-w-full pw-flex pw-justify-between">
          <div
            className={classNames(
              'pw-relative pw-w-full pw-mb-10 pw-gap-x-3 pw-flex pw-flex-wrap sm:pw-max-w-[1000px]',
              externalFilterClasses?.root ?? ''
            )}
          >
            {columns
              .filter((item) => item.header.filter?.placement === 'external')
              .map(({ header, key }) => (
                <div
                  key={key}
                  className={classNames(
                    'pw-w-full',
                    header.filter?.filterClass ?? ''
                  )}
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
                    dynamicFilterParameters={header.filter?.data?.parameters}
                  />
                </div>
              ))}
          </div>
          <div>
            {xlsReports?.url && (
              <GenerateGenericXlsReports
                url={xlsReports.url}
                context={xlsReports.urlContext}
                filters={filters}
                observerUrlReport={xlsReports.observerUrl}
                sort={sort}
              />
            )}
            {Object.values(filters || {}).length ? (
              <button
                className="-pw-mt-4 pw-px-4 pw-py-2 pw-flex pw-gap-x-3 pw-border pw-border-red-500 pw-rounded-md pw-items-center hover:pw-shadow-lg"
                onClick={() => onClearAllFilter()}
              >
                <span className="pw-text-red-500 pw-font-medium">
                  {translate('shared>genericTable>clearFilters')}
                </span>
                <ClearFilter className="pw-stroke-2 pw-stroke-red-500 pw-w-5 pw-h-5" />
              </button>
            ) : null}
          </div>
        </div>

        <div
          className={classNames(
            'pw-mb-10 pw-min-h-[500px] pw-rounded-t-2xl pw-overflow-auto',
            classes?.root ?? '',
            tableStyles?.root ?? ''
          )}
        >
          <div
            className={classNames(
              'pw-px-3 pw-h-[72px] pw-bg-[#DDE6F3] pw-gap-x-3 pw-rounded-t-2xl pw-w-[800px] pw-justify-between pw-text-sm pw-items-center pw-grid sm:pw-w-full',
              classes?.grid ?? '',
              tableStyles?.header ?? ''
            )}
          >
            {columns.map(({ sortable, header, key, sortableTamplate }) => (
              <div key={key} className="pw-w-full pw-relative">
                <div className="pw-flex pw-items-center pw-justify-between">
                  <p
                    className={classNames(
                      'pw-font-semibold pw-flex pw-flex-col pw-text-sm',
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
                            sort.includes(key) ? 'pw-bg-blue1' : 'pw-opacity-80'
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
          {!isLoading && data?.data.items.length ? (
            <div className="pw-h-auto pw-shadow-[#00000014] pw-shadow-[-7px_5px_8px_-1px] pw-border">
              {data?.data.items.map((item: any) => (
                <button
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  key={(item as any).id}
                  onClick={() => handleAction(lineActions?.action, item)}
                  disabled={!lineActions}
                  className={classNames(
                    'pw-w-full pw-justify-between pw-grid pw-items-center  pw-gap-x-2 pw-px-8 pw-py-[19px] pw-border-t',
                    classes?.grid ?? '',
                    tableStyles?.line ?? ''
                  )}
                >
                  {columns.map(({ key, format }) => (
                    <p key={key} className="pw-text-sm pw-text-left">
                      <span>{customizerValues(item as any, key, format)}</span>
                    </p>
                  ))}
                  <GenericButtonActions
                    dataItem={item}
                    actions={actions ?? []}
                  />
                </button>
              ))}
            </div>
          ) : null}
          {!isLoading && !data?.data?.items.length && !isError && (
            <Alert variant="information">
              {translate('token>pass>notResult')}
            </Alert>
          )}
          {isError && (
            <Alert variant="error" className="pw-mt-5">
              {translate('contact>inviteContactTemplate>error')}
            </Alert>
          )}
        </div>
        {totalItems && page > 1 ? (
          <div className="pw-flex pw-justify-end pw-gap-x-4 pw-items-center pw-mb-10">
            <p className="pw-text-sm pw-font-semibold">
              {translate('keytokenEditionsList>totalItems', {
                total: totalItems,
              })}
            </p>

            <Pagination
              currentPage={page}
              onChangePage={changePage}
              pagesQuantity={totalPages ?? 0}
            />
          </div>
        ) : null}
      </FormProvider>
    </div>
  );
};
