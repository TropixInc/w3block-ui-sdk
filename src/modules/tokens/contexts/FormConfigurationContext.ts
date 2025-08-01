import { createSymlinkSafeContext } from '../../shared/utils/createSymlinkSafeContext';

import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';

export const FormConfigurationContext = createSymlinkSafeContext<DynamicFormConfiguration>(
  '__FORM_CONFIGURATION_CONTEXT__',
  {}
);
