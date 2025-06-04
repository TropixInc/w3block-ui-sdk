import axios from 'axios';


import { W3blockAPI } from '../enums/W3blockAPI';
import { useAxios } from './useAxios';
import { usePaginatedQuery } from './usePaginatedQuery';
import { handleNetworkException } from '../utils/handleNetworkException';

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
    async (params) => {
      try {
        const newParams = outputMap ? outputMap(params) : params;

        if (isPublicApi) {
          if (disableParams) {
            if (searchType) {
              return await axios.get(url, {
                params: { [searchType]: search },
              });
            } else {
              return await axios.get(url, {
                params: { search: search },
              });
            }
          } else {
            return await axios.get(url, {
              params: { ...newParams, search: search },
            });
          }
        } else {
          return await internalAxios.get(url, {
            params: { ...newParams, search: search },
          });
        }
      } catch (error) {
        console.error('Error during API request:', error);
        throw handleNetworkException(error);
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
