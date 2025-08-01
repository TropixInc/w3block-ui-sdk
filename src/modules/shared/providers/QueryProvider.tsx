'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const internalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

interface SDKQueryProviderProps {
  children: any;
  queryClient?: QueryClient;
}

export function SDKQueryProvider({
  children,
  queryClient,
}: SDKQueryProviderProps) {
  const client = queryClient || internalQueryClient;

  if (!queryClient) {
    console.warn('SDK usando QueryClient interno');
  }

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
