/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ControllerRenderProps,
  FieldValues,
  useController,
} from 'react-hook-form';
import { useDebounce } from 'react-use';

import _ from 'lodash';

import { W3blockAPI } from '../../enums/W3blockAPI';
import { usePaginatedGenericApiGet } from '../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import useTranslation from '../../hooks/useTranslation';
import {
  FilterParameters,
  FormatFilterType,
} from '../../interface/ConfigGenericTable';
import GenericSearchFilter from '../GenericSearchFilter/GenericSearchFilter';
import { MultipleSelect } from '../MultipleSelect';

const SelectInput = lazy(() =>
  import('../SelectInput/SelectInput').then((module) => ({
    default: module.Selectinput,
  }))
);

interface DynamicProps {
  format: FormatFilterType | undefined;
  filterOptionsUrl?: string;
  filterContext?: W3blockAPI;
  dynamicFilterParameters?: FilterParameters | undefined;
  itemKey: string | undefined;
  onSelectedSearchItem?: (value: string) => void;
  field?: ControllerRenderProps<FieldValues, string>;
  onChangeFilterLabels?: (value: any) => void;
  searchSelectedItem?: string;
  filterLabels?: any;
  onSelected?: (value: string) => void;
  selected?: string;
  placeholder?: string;
  isPublicFilterApi?: boolean;
  searchFilterTemplate?: string;
}

export const DynamicGenericFilter = ({
  format,
  filterOptionsUrl,
  dynamicFilterParameters,
  itemKey,
  onSelectedSearchItem,
  field,
  onChangeFilterLabels,
  searchSelectedItem,
  filterLabels,
  onSelected,
  selected,
  placeholder,
  isPublicFilterApi,
  searchFilterTemplate,
}: DynamicProps) => {
  const [searchName, setSearchName] = useState<string | undefined>('');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);

  console.log(searchFilterTemplate, 'searchFilterTemplate');

  const setSearchValueCallback = useCallback(() => {
    setSearchValue(searchName);
  }, [searchName, setSearchValue]);

  useDebounce(setSearchValueCallback, 900, [setSearchValueCallback]);

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
        newParams['pagination[pageSize]'] = 50;
        newParams['pagination[page]'] = params?.page;
        newParams[searchFilterTemplate ?? ''] = searchValue;

        return newParams;
      },
    },
  };

  const [{ data }] = usePaginatedGenericApiGet({
    url: filterOptionsUrl ?? '',
    isPublicApi: isPublicFilterApi,
    search: searchValue,
    ...paginationMapping[dynamicFilterParameters?.paginationType || 'default'],
  });

  const options = useMemo(() => {
    if (data && dynamicFilterParameters) {
      const items = _.get(data, dynamicFilterParameters.itemsPath, []);

      const arrOptions = items.map((item: any) => ({
        value: _.get(item, dynamicFilterParameters.key, ''),
        label: _.get(item, dynamicFilterParameters.label, ''),
      }));

      return arrOptions;
    } else return [];
  }, [data, dynamicFilterParameters]);

  const getPlaceholderForMultipleSelect = (multpleSelected: Array<any>) => {
    if (multpleSelected && multpleSelected.length > 0) {
      const selected = multpleSelected.map((item) => {
        return options?.find(({ value }) => value === item);
      });

      if (selected.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (selected as Array<any>).map(({ label }) => label).join(', ');
      } else {
        return placeholder ?? 'Selecione';
      }
    } else {
      return placeholder ?? 'Selecione';
    }
  };

  useEffect(() => {
    const selectedItem = options?.find(
      ({ value }) => value === searchSelectedItem
    );

    onChangeFilterLabels &&
      onChangeFilterLabels({
        ...filterLabels,
        [itemKey ?? '']: selectedItem?.label,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, searchSelectedItem]);

  const renderFilter = (eachFilterType: FormatFilterType) => {
    switch (eachFilterType) {
      case FormatFilterType.SEARCH: {
        return (
          <GenericSearchFilter
            onSearch={setSearchName}
            search={searchName}
            showResponseModal={showResponseModal}
            onShowResponseModal={setShowResponseModal}
            items={options ?? []}
            inputPlaceholder={placeholder ?? 'Buscar'}
            classes={{
              root: '!pw-w-full',
              input:
                '!pw-w-full !pw-text-black !pw-placeholder-black pw-opacity-80',
            }}
            onSelectItemById={onSelectedSearchItem}
          />
        );
      }
      case FormatFilterType.SELECT: {
        return (
          <SelectInput
            onChange={onSelected as (value: string) => void}
            options={options ?? []}
            selected={selected ?? ''}
            placeholder={placeholder}
            className="pw-w-full"
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
            placeholder={getPlaceholderForMultipleSelect(field?.value || '')}
            options={options ?? []}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="pw-w-full pw-min-h-10 pw-flex pw-flex-col pw-items-center pw-justify-center">
      {format && renderFilter(format)}
    </div>
  );
};
