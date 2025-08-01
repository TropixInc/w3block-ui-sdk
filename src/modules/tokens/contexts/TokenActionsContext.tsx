import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

interface TokenAction {
  id: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export type ITokenActionContext = Array<TokenAction>;

export const TokenActionsContext = createSymlinkSafeContext<ITokenActionContext>(
  '__TOKEN_ACTIONS_CONTEXT__',
  []
);
