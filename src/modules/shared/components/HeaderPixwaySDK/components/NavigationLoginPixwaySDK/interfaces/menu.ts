import { ReactNode } from 'react';

export interface NavigationMenuTabs {
  name?: string;
  route?: string;
  icon?: ReactNode;
  action?: () => void;
}
