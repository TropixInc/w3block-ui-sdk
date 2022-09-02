import { createContext } from 'react';

import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';

export const FormConfigurationContext = createContext<DynamicFormConfiguration>(
  {}
);
