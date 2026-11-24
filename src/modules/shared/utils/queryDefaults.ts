/**
 * Shared react-query defaults for the SDK and its hosts.
 *
 * - `staleTime` 60 s: the same screen mounts the same hooks several times
 *   (header, layout, page); with 0 every mount refetched.
 * - no refetch on window focus: switching tabs used to re-run every query
 *   on the page.
 * - a single retry, and none for 4xx: a 400/401/403/404 is deterministic,
 *   retrying it only multiplies the calls (the default was 3 retries).
 */
export const SDK_QUERY_STALE_TIME_MS = 60 * 1000;

interface ErrorLike {
  status?: unknown;
  response?: { status?: unknown };
}

export function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const e = error as ErrorLike;
  const status = e.response?.status ?? e.status;
  return typeof status === 'number' ? status : undefined;
}

export function isClientError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status !== undefined && status >= 400 && status < 500;
}

export function shouldRetryQuery(
  failureCount: number,
  error: unknown
): boolean {
  return failureCount < 1 && !isClientError(error);
}

export const sdkQueryDefaults = {
  queries: {
    staleTime: SDK_QUERY_STALE_TIME_MS,
    refetchOnWindowFocus: false,
    retry: shouldRetryQuery,
  },
};
