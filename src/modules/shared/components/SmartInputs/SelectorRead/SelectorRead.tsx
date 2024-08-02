/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';

import { useRouterConnect } from '../../../hooks';
import { usePaginatedGenericApiGet } from '../../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import { InputDataDTO } from '../../SmartInputsController';
import { Spinner } from '../../Spinner';

export interface Options {
  label: string;
  value: string;
}

interface Props {
  configData?: InputDataDTO;
  docValue?: string | object | undefined;
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
  // profilePage = false,
  docValue,
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

  useEffect(() => {
    if (docValue && dynamicOptions) {
      const value = (dynamicOptions as any).find((val: any) => {
        if (configData?.approverPath) {
          return val.value.id === (docValue as any).id;
        } else return val.value === docValue;
      })?.label;
      setInputValue(value);
    }
  }, [configData?.approverPath, docValue, dynamicOptions]);

  if (router.query.delay) {
    return (
      <div className="pw-mb-6 pw-mx-auto pw-w-full">
        <Spinner />
      </div>
    );
  }

  return <span>{inputValue}</span>;
};
