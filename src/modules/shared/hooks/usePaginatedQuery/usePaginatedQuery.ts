import { useMemo, useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import { AxiosResponse } from 'axios';

import { PixwayPaginatedResponse } from '../../interface/PixwayPaginatedResponse';
import { QueryConfig, usePrivateQuery } from '../usePrivateQuery';
import { usePublicQuery } from '../usePublicQuery';
import { useRouterConnect } from '../useRouterConnect';

export interface PaginatedQueryConfig {
  itemsPerPage?: number;
  initialPage?: number;
  search?: string;
  orderBy?: string;
  sortBy?: string;
  disableUrl?: boolean;
  inputMap?: (data: any) => { totalItems: number; totalPages: number };
  isPublicApi?: boolean;
}

type QueryFunctionResponse<QueryData> = AxiosResponse<
  PixwayPaginatedResponse<QueryData>
>;

type PaginatedQueryFunctionReturnValue<QueryData> = Promise<
  QueryFunctionResponse<QueryData>
>;

type usePaginatedQueryReturnValue<QueryData> = [
  UseQueryResult<QueryFunctionResponse<QueryData>>,
  {
    page: number | undefined;
    changePage: (nextPage: number) => void;
    totalItems?: number;
    totalPages?: number;
  }
];

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  walletAddresses?: Array<string>;
}

export const usePaginatedQuery = <QueryData>(
  queryKey: string | Array<string | number>,
  queryFn: (
    params: QueryParams
  ) => PaginatedQueryFunctionReturnValue<QueryData>,
  {
    initialPage,
    itemsPerPage,
    search,
    sortBy,
    orderBy,
    disableUrl = false,
    inputMap = (data) => data?.meta,
    isPublicApi = false,
    ...rest
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PaginatedQueryConfig & QueryConfig<any, any, any> = {}
): usePaginatedQueryReturnValue<QueryData> => {
  const router = useRouterConnect();
  const [totalPages, setTotalPages] = useState(1);

  const defineInitialPage = () => {
    if (disableUrl) {
      if (initialPage === 0) {
        return undefined;
      } else {
        return 1;
      }
    }
    if (router.query.page) {
      return Number(router.query.page) > 0 ? Number(router.query.page) : 1;
    }

    return initialPage ?? 1;
  };

  const [page, setPage] = useState(defineInitialPage());

  const finalItemsPerPage = itemsPerPage ?? 10;
  const configQueryKey = [
    page ? page.toString() : '',
    finalItemsPerPage.toString(),
    search ?? '',
    orderBy ?? '',
    sortBy ?? '',
  ];

  useEffect(() => {
    if (!disableUrl) {
      const newQuery = {
        ...router.query,
        page,
      };
      if (router.query.page) {
        router.push({
          query: newQuery,
        });
      } else {
        router.replace({
          query: newQuery,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (
      router.query.page &&
      Number(router.query.page) !== page &&
      !disableUrl
    ) {
      setPage(Number(router.query.page));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const queryResult = isPublicApi
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      usePublicQuery(
        Array.isArray(queryKey)
          ? queryKey.concat(configQueryKey)
          : [queryKey, ...configQueryKey],
        () => queryFn({ page, limit: itemsPerPage, orderBy, sortBy }),
        {
          ...rest,
          onSuccess: ({ data }) => {
            if (totalPages) {
              if (inputMap(data)?.totalPages !== totalPages) {
                setTotalPages(inputMap(data)?.totalPages ?? 1);
              }
            } else setTotalPages(1);

            if (page && page > inputMap(data)?.totalPages && !disableUrl) {
              router.replace({
                query: {
                  ...router.query,
                  page: 1,
                },
              });
            }
          },
        }
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      usePrivateQuery(
        Array.isArray(queryKey)
          ? queryKey.concat(configQueryKey)
          : [queryKey, ...configQueryKey],
        () => queryFn({ page, limit: itemsPerPage, orderBy, sortBy }),
        {
          ...rest,
          onSuccess: ({ data }) => {
            if (inputMap(data)?.totalPages !== totalPages) {
              setTotalPages(inputMap(data)?.totalPages ?? 1);
            }

            if (page && page > inputMap(data)?.totalPages && !disableUrl) {
              router.replace({
                query: {
                  ...router.query,
                  page: 1,
                },
              });
            }
          },
        }
      );

  return useMemo<usePaginatedQueryReturnValue<QueryData>>(() => {
    return [
      queryResult,
      {
        page,
        changePage: setPage,
        totalItems: inputMap(queryResult?.data?.data)?.totalItems,
        totalPages,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryResult, totalPages]);
};
