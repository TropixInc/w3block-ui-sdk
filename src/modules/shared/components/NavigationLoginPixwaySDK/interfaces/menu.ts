import { ReactNode } from 'react';

export interface NavigationMenuTabs {
  name?: string;
  id?: string;
  route?: string;
  icon?: ReactNode;
  action?: () => void;
  isVisible: boolean;
}
