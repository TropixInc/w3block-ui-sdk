import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios/useAxios';
import { usePrivateQuery } from '../usePrivateQuery/usePrivateQuery';

interface GenericProps {
  url: string;
  context?: W3blockAPI;
}

export const UseGenericApiGet = ({ url, context }: GenericProps) => {
  const axios = useAxios(context ?? W3blockAPI.KEY);

  return usePrivateQuery([url, context ?? ''], () => axios.get(url), {
    enabled: Boolean(url),
    refetchOnWindowFocus: false,
  });
};
