import { usePixwaySession } from '../usePixwaySession';

export const useToken = () => {
  const { data } = usePixwaySession();
  return (data?.accessToken as string) ?? '';
};
