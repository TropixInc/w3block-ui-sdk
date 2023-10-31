import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { usePrivateQuery } from '../usePrivateQuery/usePrivateQuery';

interface GenericProps {
  url: string;
  context?: W3blockAPI;
  enabled: boolean;
}

export const useGetGenericXlsReports = ({
  url,
  context,
  enabled,
}: GenericProps) => {
  const axios = useAxios(context ?? W3blockAPI.KEY);

  return usePrivateQuery(
    [url, context ?? '', enabled],
    (params) => axios.get(url, { params: { ...params } }),
    {
      enabled: Boolean(url && enabled),
      refetchInterval: 3000,
    }
  );
};
