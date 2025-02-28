import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
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
    async (params) => {
      try {
        const response = await axios.get(url, { params: { ...params } });
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar relatório XLS genérico:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: Boolean(url && enabled),
      refetchInterval: 3000,
    }
  );
};
