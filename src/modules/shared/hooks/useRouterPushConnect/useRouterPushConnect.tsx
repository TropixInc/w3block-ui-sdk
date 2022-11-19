import { useLocation } from 'react-use';

import { useCompanyConfig } from '../useCompanyConfig';
import useRouter from '../useRouter';

export const useRouterPushConnect = () => {
  const router = useRouter();
  const { connectProxyPass } = useCompanyConfig();
  const location = useLocation();
  const push = (path: string) => {
    router.push(
      (location.hostname?.includes('localhost') ? '' : connectProxyPass ?? '') +
        path
    );
  };
  return { push };
};
