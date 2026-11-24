'use client';
import { ReactNode, useContext } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  defaultContext,
} from '@tanstack/react-query';

import { sdkQueryDefaults } from '../utils/queryDefaults';

let internalQueryClient: QueryClient | undefined;

const getInternalQueryClient = () => {
  if (!internalQueryClient) {
    internalQueryClient = new QueryClient({ defaultOptions: sdkQueryDefaults });
  }
  return internalQueryClient;
};

interface SDKQueryProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Provides a QueryClient to the SDK.
 *
 * - With `queryClient`, that client is used (the host's cache).
 * - Without one, reuses the client already in context when there is one, so a
 *   template wrapped in its own `SDKQueryProvider` does not fork the cache
 *   from the host app's provider (every query under it was refetched from
 *   scratch and ignored the host's defaults).
 * - Only when there is no client at all does it fall back to an internal one.
 */
export function SDKQueryProvider({
  children,
  queryClient,
}: SDKQueryProviderProps) {
  const inherited = useContext(defaultContext);

  if (!queryClient && inherited) {
    return <>{children}</>;
  }

  const client = queryClient || getInternalQueryClient();

  if (!queryClient) {
    console.warn('SDK usando QueryClient interno');
  }

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
