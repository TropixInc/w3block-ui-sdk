import React, { lazy, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { useClickAway, useDebounce } from 'react-use';

import _, { isArray } from 'lodash';

import { W3blockAPI } from '../../enums/W3blockAPI';

const SelectInput = lazy(() =>
  import('../SelectInput/SelectInput').then((module) => ({
    default: module.Selectinput,
  }))
);

import {
  FilterParameters,
  FilterTableType,
  FormatFilterType,
} from '../../interface/ConfigGenericTable';
import { DateFilter } from '../DateFilter/DateFilter';
import { DynamicGenericFilter } from '../DynamicGenericFilter/DynamicGenericFilter';
import { Option } from '../GenericSearchFilter/GenericSearchFilter';
import { MultipleSelect } from '../MultipleSelect';
import NumberRange from '../NumberRange/NumberRange';

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
}: GenericFilterDto) => {
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [selected, setSelected] = useState<string | undefined>('');
  const [searchSelectedItem, setSearchSelectedItem] = useState<string>();
  const [searchStaticValue, setSearchStaticValue] = useState<string>();
  const [multSelected, setMultSelected] = useState<Array<string> | undefined>(
    []
  );
  const [endDate, setEndDate] = useState<Date>();
  const [numberRange, setNumberRange] = useState<{
    start: string | undefined;
    end: string | undefined;
  }>();

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
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTemplate, selected]);

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
  const getPlaceholderForMultipleSelect = (multpleSelected: Array<any>) => {
    if (multpleSelected && multpleSelected.length > 0) {
      const selected = multpleSelected.map((item) => {
        return filterOptions?.find(({ value }) => value === item);
      });

      if (selected.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (selected as Array<any>).map(({ label }) => label).join(', ');
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
          />
        );
      }
      case FormatFilterType.MULTISELECT: {
        return (
          <MultipleSelect
            classes={{
              root: 'pw-w-full !pw-h-[42px] pw-relative pw-z-1 sm:pw-max-w-[270px]',
              button: 'pw-h-[42px] pw-z-1',
            }}
            name="status"
            placeholder={getPlaceholderForMultipleSelect(field.value)}
            options={filterOptions ?? []}
          />
        );
      }
      case FormatFilterType.SEARCH: {
        return (
          <div className="pw-w-full pw-min-w-[200px] pw-h-[42px] pw-rounded-lg pw-border pw-border-[#B9D1F3]">
            <input
              className="pw-w-full pw-h-[40px] pw-rounded-lg pw-outline-none pw-px-2"
              type="text"
              placeholder={filterPlaceholder ?? 'Buscar'}
              value={searchStaticValue}
              onChange={(e) => setSearchStaticValue(e.target.value)}
            />
          </div>
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
    <div ref={divRef} className="pw-w-full pw-bg-white pw-rounded-md pw-mt-1">
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
        />
      )}
    </div>
  ) : null;
};

export default SmartGenericFilter;
