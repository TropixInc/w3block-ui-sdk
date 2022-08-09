import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import { useToken } from '../useToken';

export const usePrivateQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
) => {
  const token = useToken();
  const enabled = Object.keys(options ?? {}).includes('enabled')
    ? options?.enabled && Boolean(token)
    : Boolean(token);
  return useQuery(
    queryKey,
    queryFn,
    options ? { ...options, enabled } : { enabled }
  );
};
