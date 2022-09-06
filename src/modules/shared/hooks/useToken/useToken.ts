import { useSessionUser } from '../useSessionUser';

export const useToken = () => {
  const data = useSessionUser();
  return data?.accessToken ?? '';
};
