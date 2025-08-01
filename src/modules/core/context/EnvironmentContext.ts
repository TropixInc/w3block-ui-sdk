import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

interface IEnvironmentContext {
  isProduction: boolean;
}

export const EnvironmentContext = createSymlinkSafeContext<IEnvironmentContext>(
  '__ENVIRONMENT_CONTEXT__',
  {
    isProduction: false,
  }
);
