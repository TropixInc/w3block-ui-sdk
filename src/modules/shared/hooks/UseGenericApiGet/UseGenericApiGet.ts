import { W3blockAPI } from '../../enums/W3blockAPI';
import { handleNetworkException } from '../../utils/handleNetworkException';
import { useAxios } from '../useAxios/useAxios';
import { usePrivateQuery } from '../usePrivateQuery/usePrivateQuery';

interface GenericProps {
  url: string;
  context?: W3blockAPI;
}

export const UseGenericApiGet = ({ url, context }: GenericProps) => {
  const axios = useAxios(context ?? W3blockAPI.KEY);

  return usePrivateQuery(
    [url, context ?? ''],
    async () => {
      try {
        const response = await axios.get(url);
        return response;
      } catch (err) {
        console.error('Erro ao realizar requisição genérica:', err);
        throw handleNetworkException(err);
      }
    },
    {
      enabled: Boolean(url),
      refetchOnWindowFocus: false,
    }
  );
};
