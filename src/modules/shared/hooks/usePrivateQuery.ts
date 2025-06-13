
/* import { useToken } from '../useToken'; */

import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useToken } from "./useToken";

export type QueryConfig<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

export const usePrivateQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey>,
  options?: QueryConfig<TQueryFnData, TError, TData>
) => {
  const token = useToken();
  const enabled = Object.keys(options ?? {}).includes('enabled')
    ? options?.enabled && Boolean(token)
    : Boolean(token); 

  return useQuery(
    queryKey,
    queryFn,
    options ? { ...options, enabled} : {enabled} 
  );
};
