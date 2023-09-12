import { useMemo, useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import { AxiosResponse } from 'axios';

import { PixwayPaginatedResponse } from '../../interfaces/PixwayPaginatedResponse';
import { QueryConfig, usePrivateQuery } from '../usePrivateQuery';
import { useRouterConnect } from '../useRouterConnect';

export interface PaginatedQueryConfig {
  itemsPerPage?: number;
  initialPage?: number;
  search?: string;
  orderBy?: string;
  sortBy?: string;
  disableUrl?: boolean;
}

type QueryFunctionResponse<QueryData> = AxiosResponse<
  PixwayPaginatedResponse<QueryData>
>;

type PaginatedQueryFunctionReturnValue<QueryData> = Promise<
  QueryFunctionResponse<QueryData>
>;

type usePaginatedPrivateQueryReturnValue<QueryData> = [
  UseQueryResult<QueryFunctionResponse<QueryData>>,
  {
    page: number;
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

export const usePaginatedPrivateQuery = <QueryData>(
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
    ...rest
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PaginatedQueryConfig & QueryConfig<any, any, any> = {}
): usePaginatedPrivateQueryReturnValue<QueryData> => {
  const router = useRouterConnect();
  const [totalPages, setTotalPages] = useState(0);

  const defineInitialPage = () => {
    if (disableUrl) return 1;
    if (router.query.page) {
      return Number(router.query.page) > 0 ? Number(router.query.page) : 1;
    }

    return initialPage ?? 1;
  };

  const [page, setPage] = useState(defineInitialPage());
  const finalItemsPerPage = itemsPerPage ?? 10;
  const configQueryKey = [
    page.toString(),
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

  const queryResult = usePrivateQuery(
    Array.isArray(queryKey)
      ? queryKey.concat(configQueryKey)
      : [queryKey, ...configQueryKey],
    () => queryFn({ page, limit: itemsPerPage, orderBy, sortBy }),
    {
      ...rest,
      onSuccess: ({ data }) => {
        if (data.meta.totalPages !== totalPages) {
          setTotalPages(data.meta.totalPages);
        }

        if (page > data.meta.totalPages && !disableUrl) {
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

  return useMemo<usePaginatedPrivateQueryReturnValue<QueryData>>(() => {
    return [
      queryResult,
      {
        page,
        changePage: setPage,
        totalItems: queryResult.data?.data.meta.totalItems,
        totalPages,
      },
    ];
  }, [page, queryResult, totalPages]);
};
