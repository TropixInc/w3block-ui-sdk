/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';
import { usePaginatedGenericApiGet } from '../../hooks/usePaginatedGenericApiGet';
import { useRouterConnect } from '../../hooks/useRouterConnect';
import { InputDataDTO } from '../SmartInputsController';
import { Spinner } from '../Spinner';

export interface Options {
  label: string;
  value: string;
}

interface Props {
  configData?: InputDataDTO;
  docValue?: string | object | undefined;
  options: Options[];
  type?: DataTypesEnum;
}

const paginationMapping = {
  internal: {},
  external: {
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

      return newParams;
    },
  },
};

export const SelectorRead = ({
  configData,
  options,
  docValue,
  type,
}: Props) => {
  const router = useRouterConnect();
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [{ data }] = usePaginatedGenericApiGet({
    url: configData?.url ?? '',
    isPublicApi: configData?.isPublicApi,
    ...paginationMapping[configData?.paginationType || 'internal'],
    enabled: Boolean(configData && configData.url),
    disableParams: configData?.disableParams,
    searchType: configData?.searchType,
  });

  const dynamicOptions = useMemo(() => {
    if (data) {
      const response = _.get(data, configData?.responsePath || '', []);
      if (response.length) {
        if (configData?.approverPath) {
          return response.map((item) => ({
            label: _.get(item, configData?.labelPath || '', ''),
            value: {
              id: _.get(item, configData?.valuePath || '', '').toString(),
              userId: _.get(item, configData?.approverPath || '', ''),
            },
          }));
        } else
          return response.map((item) => ({
            label: _.get(item, configData?.labelPath || '', ''),
            value: _.get(item, configData?.valuePath || '', '').toString(),
          }));
      } else return [];
    } else return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getPlaceholderForMultipleSelect = (selectedArray: any) => {
    const selected = (selectedArray as Array<string>).map((item) => {
      if (type === DataTypesEnum.DynamicSelect)
        return (dynamicOptions as any)?.find(
          (value: any) => value.value === item
        );
      else
        return options?.find((value: any) => {
          return value.value === item;
        });
    });
    if (selected?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (selected as Array<any>).map(({ label }) => label).join(', ');
    } else {
      return 'Selecione';
    }
  };

  useEffect(() => {
    if (docValue && dynamicOptions.length) {
      const value = () => {
        if (configData?.isMultiple) {
          const jsonValues = JSON.parse(docValue as string);
          return getPlaceholderForMultipleSelect(jsonValues?.values);
        } else
          return (dynamicOptions as any).find((val: any) => {
            if (configData?.approverPath) {
              return val.value.id === (docValue as any).id;
            } else return val.value === docValue;
          })?.label;
      };
      setInputValue(value());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configData?.approverPath, docValue, dynamicOptions]);

  useEffect(() => {
    if (docValue && options.length) {
      const value =
        configData?.isMultiple && typeof docValue !== 'string'
          ? getPlaceholderForMultipleSelect(docValue)
          : options?.find((val) => {
              return val.value === docValue;
            })?.label;
      setInputValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configData?.isMultiple, docValue, options]);

  if (router.query.delay) {
    return (
      <div className="pw-mb-6 pw-mx-auto pw-w-full">
        <Spinner />
      </div>
    );
  }

  return <span>{inputValue}</span>;
};
