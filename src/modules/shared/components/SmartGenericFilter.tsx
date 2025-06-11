/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { lazy, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { useClickAway, useDebounce } from 'react-use';

import _, { isArray } from 'lodash';

import { W3blockAPI } from '../enums/W3blockAPI';
import { FilterTableType, FormatFilterType, FilterParameters } from '../interfaces/ConfigGenericTable';
import { BaseInput } from './BaseInput';
import { DateFilter } from './DateFilter';
import { SelectInput } from './SelectInput';
import { MultipleSelect } from './MultipleSelect';
import { GenericWalletFilter } from './GenericWalletFilter';
import NumberRange from './NumberRange';
import { DynamicGenericFilter } from './DynamicGenericFilter';
import { Option } from "./GenericSearchFilter"
import useTranslation from '../hooks/useTranslation';


interface GenericFilterDto {
  filterType: FilterTableType | undefined;
  filterFormat: FormatFilterType | undefined;
  itemShowFilterKey: string | undefined;
  itemKey: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeFilter?: (value: any) => void;
  filterOptions?: Array<Option>;
  onCloseFilters: (value: undefined) => void;
  filterTemplate?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterLabels?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeFilterLabels?: (value: any) => void;
  filterOptionsUrl?: string;
  filterContext?: W3blockAPI;
  dynamicFilterParameters?: FilterParameters | undefined;
  filterPlaceholder?: string;
  isPublicFilterApi?: boolean;
  isFilterDependency?: boolean;
  filterDependencies?: {
    [key: string]: {
      required: boolean;
      urlParam: string;
    };
  };
  isTranslatable?: boolean;
  translatePrefix?: string;
}

const SmartGenericFilter = ({
  filterType,
  filterFormat,
  itemShowFilterKey,
  itemKey,
  filters,
  onChangeFilter,
  filterOptions,
  onCloseFilters,
  filterTemplate,
  filterLabels,
  onChangeFilterLabels,
  filterOptionsUrl,
  filterContext,
  dynamicFilterParameters,
  filterPlaceholder,
  isPublicFilterApi,
  isFilterDependency,
  filterDependencies,
  isTranslatable,
  translatePrefix,
}: GenericFilterDto) => {
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [selected, setSelected] = useState<string | undefined>('');
  const [searchSelectedItem, setSearchSelectedItem] = useState<string>();
  const [searchStaticValue, setSearchStaticValue] = useState<string>();
  const [walletFilter, setWalletFilter] = useState('');
  const [translate] = useTranslation();
  const [multSelected, setMultSelected] = useState<Array<string> | undefined>(
    []
  );

  const [endDate, setEndDate] = useState<Date>();
  const [numberRange, setNumberRange] = useState<{
    start: string | undefined;
    end: string | undefined;
  }>();

  useEffect(() => {
    if (filterFormat === FormatFilterType.SEARCH) {
      if (!_.get(filterLabels, itemKey || '')) {
        setSearchStaticValue('');
      }
    }

    if (filterFormat === FormatFilterType.LOCALDATE) {
      if (!_.get(filterLabels, itemKey || '')) {
        setStartDate(undefined);
      }
    }

    if (filterFormat === FormatFilterType.WALLET) {
      if (!_.get(filterLabels, itemKey || '')) {
        setWalletFilter('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLabels]);

  const { field } = useController({ name: itemKey ?? '' });

  const divRef = useRef<HTMLDivElement>(null);
  useClickAway(divRef, () => {
    onCloseFilters(undefined);
  });

  useDebounce(
    () => {
      if (
        filterType === FilterTableType.STATIC &&
        filterFormat === FormatFilterType.SEARCH &&
        onChangeFilter
      ) {
        if (searchStaticValue) {
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: filterTemplate?.replace(
              `{${itemKey}}`,
              searchStaticValue ?? ''
            ),
          });

          onChangeFilterLabels &&
            onChangeFilterLabels({
              ...filterLabels,
              [itemKey ?? '']: searchStaticValue,
            });
        } else {
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: '',
          });
        }
      }
    },
    800,
    [searchStaticValue]
  );

  const onCancelDates = () => {
    onChangeFilter &&
      onChangeFilter({
        ...filters,
        [itemKey ?? '']: { from: '', to: '' },
      });
    onCloseFilters(undefined);
  };

  useEffect(() => {
    if (numberRange?.start) {
      onChangeFilter &&
        onChangeFilter({
          ...filters,
          [itemKey ?? '']: numberRange,
        });

      onChangeFilterLabels &&
        onChangeFilterLabels({
          ...filterLabels,
          [itemKey ?? '']: [numberRange?.start, numberRange?.end],
        });

      onCloseFilters(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberRange]);

  useEffect(() => {
    if (startDate && endDate) {
      onChangeFilter &&
        onChangeFilter({
          ...filters,
          [itemKey ?? '']: filterTemplate
            ?.replace('{dateFrom}', startDate?.toISOString())
            .replace('{dateTo}', endDate.toISOString()),
        });

      onChangeFilterLabels &&
        onChangeFilterLabels({
          ...filterLabels,
          [itemKey ?? '']: [
            startDate.toLocaleDateString(),
            endDate.toLocaleDateString(),
          ],
        });

      onCloseFilters(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  useEffect(() => {
    if (FormatFilterType.SELECT || FormatFilterType.MULTISELECT) {
      if (isArray(field.value)) {
        setMultSelected(field.value);
      } else {
        setSelected(field.value);
      }

      onChangeFilterLabels &&
        onChangeFilterLabels({
          ...filterLabels,
          [itemKey ?? '']: field.value,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  useEffect(() => {
    if (FormatFilterType.SELECT) {
      if (selected) {
        onChangeFilter &&
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: filterTemplate?.replace(
              `{${itemKey}}`,
              selected ?? ''
            ),
          });

        onCloseFilters(undefined);
      } else {
        const newFilters = filters;
        const removedItemFilters = _.omit(newFilters, itemKey || '');
        onChangeFilter && onChangeFilter(removedItemFilters);

        onCloseFilters(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTemplate, selected]);

  useEffect(() => {
    if (FormatFilterType.WALLET) {
      if (walletFilter) {
        onChangeFilter &&
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: filterTemplate?.replace(
              `{${itemKey}}`,
              walletFilter ?? ''
            ),
          });

        onCloseFilters(undefined);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTemplate, walletFilter]);

  useEffect(() => {
    if (FormatFilterType.SEARCH) {
      if (searchSelectedItem) {
        onChangeFilter &&
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: filterTemplate?.replace(
              `{${itemKey}}`,
              searchSelectedItem ?? ''
            ),
          });

        onCloseFilters(undefined);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTemplate, searchSelectedItem]);

  useEffect(() => {
    if (FormatFilterType.SEARCH) {
      if (!_.has(filterLabels, itemKey ?? '')) {
        setSearchSelectedItem(undefined);
      }
    }
  }, [filterLabels, itemKey]);

  useEffect(() => {
    if (multSelected) {
      const mountFilterString = multSelected?.map(
        (item) => `${itemKey}=${item}`
      );
      if (mountFilterString?.length) {
        onChangeFilter &&
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: mountFilterString.join('&'),
          });
      } else {
        onChangeFilter &&
          onChangeFilter({
            ...filters,
            [itemKey ?? '']: '',
          });
      }
      onCloseFilters(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multSelected]);

  useEffect(() => {
    if (FormatFilterType.SELECT || FormatFilterType.MULTISELECT) {
      // eslint-disable-next-line no-prototype-builtins
      if (filters && !filters.hasOwnProperty(itemKey)) {
        setMultSelected(undefined);
        setSelected(undefined);
        field.onChange('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, itemKey]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPlaceholderForMultipleSelect = (
    multpleSelected: Array<any>,
    isTranslatable?: boolean,
    translatePrefix?: string
  ) => {
    if (multpleSelected && multpleSelected?.length > 0) {
      const selected = multpleSelected.map((item) => {
        return filterOptions?.find(({ value }) => value === item);
      });

      if (selected?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (selected as Array<any>)
          .map(({ label }) =>
            isTranslatable
              ? translate(`${translatePrefix || ''}${label}`)
              : label
          )
          .join(', ');
      } else {
        return filterPlaceholder ?? 'Selecione';
      }
    } else {
      return filterPlaceholder ?? 'Selecione';
    }
  };
  const renderFilter = (eachFilterType: FormatFilterType) => {
    switch (eachFilterType) {
      case FormatFilterType.LOCALDATE: {
        return (
          <DateFilter
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            defaultDate={defaultDate}
            onChangeDefaultDate={setDefaultDate}
            onCancel={onCancelDates}
            startDate={startDate}
            endDate={endDate}
            placeholder={filterPlaceholder}
          />
        );
      }
      case FormatFilterType.SELECT: {
        return (
          <SelectInput
            options={filterOptions ?? []}
            selected={selected ?? ''}
            onChange={setSelected}
            className="pw-w-full"
            placeholder={filterPlaceholder}
            isTranslatable={isTranslatable}
            translatePrefix={translatePrefix}
          />
        );
      }
      case FormatFilterType.MULTISELECT: {
        return (
          <MultipleSelect
            classes={{
              root: 'pw-w-full !pw-h-11 pw-relative pw-z-1 sm:pw-max-w-[270px]',
              button: 'pw-h-11 pw-z-1',
            }}
            name="status"
            placeholder={getPlaceholderForMultipleSelect(
              field.value,
              isTranslatable,
              translatePrefix
            )}
            options={filterOptions ?? []}
            isTranslatable={isTranslatable}
            translatePrefix={translatePrefix}
          />
        );
      }
      case FormatFilterType.SEARCH: {
        return (
          <BaseInput
            type="text"
            placeholder={filterPlaceholder ?? 'Buscar'}
            value={searchStaticValue}
            onChange={(e) => setSearchStaticValue(e.target.value)}
          />
        );
      }
      case FormatFilterType.WALLET: {
        return (
          <GenericWalletFilter
            onChangeWallet={setWalletFilter}
            wallet={walletFilter}
            placeholder={filterPlaceholder}
          />
        );
      }
      case FormatFilterType.NUMBER: {
        return (
          <NumberRange
            onMutateRange={setNumberRange}
            onCloseFilters={onCloseFilters}
          />
        );
      }
      default:
        return <p className="pw-w-full">{filters[itemKey ?? '']}</p>;
    }
  };

  return itemShowFilterKey === itemKey ? (
    <div ref={divRef} className="pw-w-full pw-bg-white pw-rounded-md">
      {filterFormat && filterType === FilterTableType.STATIC ? (
        renderFilter(filterFormat)
      ) : (
        <DynamicGenericFilter
          format={filterFormat}
          filterOptionsUrl={filterOptionsUrl}
          filterContext={filterContext}
          dynamicFilterParameters={dynamicFilterParameters}
          itemKey={itemKey}
          field={field}
          onSelectedSearchItem={setSearchSelectedItem}
          onChangeFilterLabels={onChangeFilterLabels}
          searchSelectedItem={searchSelectedItem}
          filterLabels={filterLabels}
          onSelected={setSelected}
          selected={selected}
          placeholder={filterPlaceholder}
          isPublicFilterApi={isPublicFilterApi}
          searchFilterTemplate={filterTemplate}
          isFilterDependency={isFilterDependency}
          filterDependencies={filterDependencies}
          filters={filters}
        />
      )}
    </div>
  ) : null;
};

export default SmartGenericFilter;
