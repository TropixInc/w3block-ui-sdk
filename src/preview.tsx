import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import { StorefrontPreview } from './modules/storefront';

import './modules/core/styles.css';

const Previewer = () => {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <StorefrontPreview />
    </QueryClientProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Previewer />);
