import { createContext } from 'react';

interface TokenAction {
  id: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export type ITokenActionContext = Array<TokenAction>;

// Check if context already exists (for symlink development)
const globalKey = '__TOKEN_ACTIONS_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<ITokenActionContext>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<ITokenActionContext>([]);
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const TokenActionsContext = context;
