import { useLocalStorage } from 'react-use';

import { useRouterConnect } from '../useRouterConnect';

export const useGetStorageData = (infoKey: string, id?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data] = useLocalStorage<any>(infoKey);
  const { query } = useRouterConnect();
  const queryId = query.sessionId;
  if (id) {
    const specificData = data[id];
    return specificData;
  } else if (queryId) {
    const specificData = data[queryId as string];
    return specificData;
  } else return data;
};
