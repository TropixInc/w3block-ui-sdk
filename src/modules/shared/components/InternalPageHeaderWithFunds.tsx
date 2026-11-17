import { ReactNode } from 'react';

import { useHasWallet } from '../hooks/useHasWallet';
import { PageHeader } from './ui/PageHeader';

interface InternalPageHeaderWithFundsProps {
  title?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

/**
 * Page header used by the internal templates (orders, cards, profile,
 * requests, resale). Keeps the previous API and adds `subtitle`/`actions`;
 * `children` still render inside the same card, below the title.
 */
export const InternalpageHeaderWithFunds = ({
  title = 'Carteira',
  subtitle,
  actions,
  children,
}: InternalPageHeaderWithFundsProps) => {
  useHasWallet({});

  return (
    <PageHeader title={title} subtitle={subtitle} actions={actions}>
      {children}
    </PageHeader>
  );
};
