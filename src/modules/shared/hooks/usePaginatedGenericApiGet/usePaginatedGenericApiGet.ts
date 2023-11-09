import axios from 'axios';

import { usePaginatedPrivateQuery } from '../usePaginatedPrivateQuery';

interface GenericProps {
  url: string;
  search?: string;
  inputMap?: (data: any) => any;
  outputMap?: (data: any) => any;
}

export const usePaginatedGenericApiGet = ({
  url,
  search,
  inputMap,
  outputMap,
}: GenericProps) => {
  return usePaginatedPrivateQuery(
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
    }
  );
};
