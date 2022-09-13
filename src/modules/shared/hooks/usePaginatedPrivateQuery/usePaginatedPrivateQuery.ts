import { useMemo, useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import { AxiosResponse } from 'axios';

import { OffpixPaginatedResponse } from '../../../tokens/interfaces/OffpixPaginatedResponse';
import { usePrivateQuery, QueryConfig } from '../usePrivateQuery';
import useRouter from '../useRouter';

export interface PaginatedQueryConfig {
  itemsPerPage?: number;
  initialPage?: number;
  search?: string;
  orderBy?: string;
  sortBy?: string;
  disableUrl?: boolean;
}

type QueryFunctionResponse<QueryData> = AxiosResponse<
  OffpixPaginatedResponse<QueryData>
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

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
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
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PaginatedQueryConfig & QueryConfig<any, any, any> = {}
): usePaginatedPrivateQueryReturnValue<QueryData> => {
  const router = useRouter();
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
