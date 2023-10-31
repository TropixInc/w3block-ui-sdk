import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { usePaginatedPrivateQuery } from '../usePaginatedPrivateQuery';

interface GenericProps {
  url: string;
  context?: W3blockAPI;
  search?: string;
}

export const usePaginatedGenericApiGet = ({
  url,
  context,
  search,
}: GenericProps) => {
  const axios = useAxios(context ?? W3blockAPI.KEY);

  return usePaginatedPrivateQuery(
    [url, context ?? '', search ?? ''],
    (params) => axios.get(url, { params: { ...params, search: search } }),
    {
      enabled: Boolean(url),
      refetchOnWindowFocus: false,
    }
  );
};
