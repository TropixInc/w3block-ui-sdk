import { useContext } from 'react';

import { FormConfigurationContext } from '../contexts/FormConfigurationContext';

const useFormConfiguration = () => {
  const context = useContext(FormConfigurationContext);
  if (!context)
    throw new Error(
      'useFormConfiguration should be used as a child of FormConfigurationProvider'
    );
  return context;
};

export default useFormConfiguration;
