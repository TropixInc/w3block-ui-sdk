import { useMemo, useState, useEffect } from 'react';


import { AxiosResponse } from 'axios';




import { PixwayPaginatedResponse } from '../interfaces/PixwayPaginatedResponse';

import { UseQueryResult } from '@tanstack/react-query';
import { QueryConfig, usePrivateQuery } from './usePrivateQuery';
import { useRouterConnect } from './useRouterConnect';
import { usePublicQuery } from './usePublicQuery';

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

  const getUrlPageParam = () => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('page');
  };

  const buildUrlWithPage = (pageValue: number) => {
    if (typeof window === 'undefined') return '/';
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(pageValue));
    return `${window.location.pathname}?${params.toString()}`;
  };

  const defineInitialPage = () => {
    if (disableUrl) {
      if (initialPage === 0) {
        return undefined;
      } else {
        return 1;
      }
    }
    const urlPage = getUrlPageParam();
    if (urlPage) {
      return Number(urlPage) > 0 ? Number(urlPage) : 1;
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
    if (!disableUrl && page !== undefined) {
      const url = buildUrlWithPage(page);
      const urlPage = getUrlPageParam();
      if (urlPage) {
        router.push(url);
      } else {
        router.replace(url);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const urlPage = getUrlPageParam();
    if (
      urlPage &&
      Number(urlPage) !== page &&
      !disableUrl
    ) {
      setPage(Number(urlPage));
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
          onSuccess: ({ data }: any) => {
            if (totalPages) {
              if (inputMap(data)?.totalPages !== totalPages) {
                setTotalPages(inputMap(data)?.totalPages ?? 1);
              }
            } else setTotalPages(1);

            if (page && page > inputMap(data)?.totalPages && !disableUrl) {
              router.replace(buildUrlWithPage(1));
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
          onSuccess: ({ data }: any) => {
            if (inputMap(data)?.totalPages !== totalPages) {
              setTotalPages(inputMap(data)?.totalPages ?? 1);
            }

            if (page && page > inputMap(data)?.totalPages && !disableUrl) {
              router.replace(buildUrlWithPage(1));
            }
          },
        }
      );

  return useMemo<usePaginatedQueryReturnValue<QueryData>>(() => {
    const derivedTotalPages = inputMap(queryResult?.data?.data)?.totalPages ?? totalPages;
    return [
      queryResult,
      {
        page,
        changePage: setPage,
        totalItems: inputMap(queryResult?.data?.data)?.totalItems,
        totalPages: derivedTotalPages,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryResult, totalPages]);
};
