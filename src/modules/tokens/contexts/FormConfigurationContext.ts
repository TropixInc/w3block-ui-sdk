import { createContext } from 'react';

import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';

// Check if context already exists (for symlink development)
const globalKey = '__FORM_CONFIGURATION_CONTEXT__';
declare global {
  interface Window {
    [key: string]: any;
  }
}

let context: React.Context<DynamicFormConfiguration>;

if (typeof window !== 'undefined' && window[globalKey]) {
  context = window[globalKey];
} else {
  context = createContext<DynamicFormConfiguration>({});
  if (typeof window !== 'undefined') {
    window[globalKey] = context;
  }
}

export const FormConfigurationContext = context;
