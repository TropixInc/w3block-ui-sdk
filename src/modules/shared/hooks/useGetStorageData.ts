import { useLocalStorage } from 'react-use';
import { useRouterConnect } from './useRouterConnect';



export const useGetStorageData = (infoKey: string, id?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data] = useLocalStorage<any>(infoKey);
  const { query } = useRouterConnect();
  const queryId = query.sessionId;
  if (data) {
    if (id && data[id]) {
      return data[id];
    } else if (queryId && data[queryId as string]) {
      return data[queryId as string];
    } else return data;
  }
};
