import axios from 'axios';

import { W3blockAPI } from '../../enums';
import { useAxios } from '../useAxios';
import { usePaginatedQuery } from '../usePaginatedQuery';

interface GenericProps {
  url: string;
  search?: string;
  inputMap?: (data: any) => any;
  outputMap?: (data: any) => any;
  isPublicApi?: boolean;
  enabled?: boolean;
  internalTypeAPI?: W3blockAPI;
  disableParams?: boolean;
  searchType?: string;
}

export const usePaginatedGenericApiGet = ({
  url,
  search,
  inputMap,
  outputMap,
  isPublicApi,
  enabled = true,
  internalTypeAPI,
  disableParams = false,
  searchType,
}: GenericProps) => {
  const internalAxios = useAxios(internalTypeAPI || W3blockAPI.ID);

  return usePaginatedQuery(
    [url, search ?? ''],
    (params) => {
      const newParams = outputMap ? outputMap(params) : params;
      if (isPublicApi) {
        if (disableParams) {
          if (searchType)
            return axios.get(url, {
              params: { [searchType]: search },
            });
          else
            return axios.get(url, {
              params: { search: search },
            });
        } else
          return axios.get(url, { params: { ...newParams, search: search } });
      } else {
        return internalAxios.get(url, {
          params: { ...newParams, search: search },
        });
      }
    },

    {
      enabled: Boolean(url && enabled),
      refetchOnWindowFocus: false,
      disableUrl: true,
      inputMap: inputMap,
      isPublicApi,
    }
  );
};
