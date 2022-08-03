import { ReactNode } from 'react';

import { PixwayRouterContext } from '../../context';

interface Props {
  children: ReactNode;
  router: any;
}

export const PixwaySDKNextRouterAdapter = ({ children, router }: Props) => {
  return (
    <PixwayRouterContext.Provider value={router}>
      {children}
    </PixwayRouterContext.Provider>
  );
};
