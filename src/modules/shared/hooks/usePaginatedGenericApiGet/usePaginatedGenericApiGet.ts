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
}

export const usePaginatedGenericApiGet = ({
  url,
  search,
  inputMap,
  outputMap,
  isPublicApi,
  enabled = true,
  internalTypeAPI,
}: GenericProps) => {
  const internalAxios = useAxios(internalTypeAPI || W3blockAPI.ID);
  return usePaginatedQuery(
    [url, search ?? ''],
    (params) => {
      const newParams = outputMap ? outputMap(params) : params;
      if (isPublicApi) {
        return axios.get(url, { params: { ...newParams } });
      } else {
        return internalAxios.get(url, { params: { ...newParams } });
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
