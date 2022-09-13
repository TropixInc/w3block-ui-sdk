import { createContext } from 'react';

interface TokenAction {
  id: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export type ITokenActionContext = Array<TokenAction>;

export const TokenActionsContext = createContext<ITokenActionContext>([]);
