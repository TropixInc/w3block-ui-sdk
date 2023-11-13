import axios from 'axios';

import { usePaginatedQuery } from '../usePaginatedQuery';

interface GenericProps {
  url: string;
  search?: string;
  inputMap?: (data: any) => any;
  outputMap?: (data: any) => any;
  isPublicApi?: boolean;
}

export const usePaginatedGenericApiGet = ({
  url,
  search,
  inputMap,
  outputMap,
  isPublicApi,
}: GenericProps) => {
  return usePaginatedQuery(
    [url, search ?? ''],
    (params) => {
      const newParams = outputMap ? outputMap(params) : params;
      return axios.get(url, { params: { ...newParams } });
    },

    {
      enabled: Boolean(url),
      refetchOnWindowFocus: false,
      disableUrl: true,
      inputMap: inputMap,
      isPublicApi,
    }
  );
};
