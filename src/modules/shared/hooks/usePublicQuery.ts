import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

export type QueryConfig<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

export const usePublicQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey>,
  options?: QueryConfig<TQueryFnData, TError, TData>
) => {
  return useQuery(queryKey, queryFn, options);
};
