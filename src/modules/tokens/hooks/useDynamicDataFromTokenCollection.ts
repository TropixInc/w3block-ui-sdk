import { useMemo } from 'react';

import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';
import { DynamicFormFieldValue } from '../interfaces/DynamicFormFieldState';
import { orderTokenTemplateKeys } from '../utils/orderTokenTemplateKeys';

const useDynamicDataFromTokenCollection = (
  data?: Record<string, DynamicFormFieldValue>,
  template?: DynamicFormConfiguration
) => {
  return useMemo(() => {
    if (data && template) {
      const dynamicTokenDataKeys = Object.keys(data);
      const dynamicData = orderTokenTemplateKeys(
        Object.keys(template).filter(
          (templateKey) =>
            dynamicTokenDataKeys.includes(templateKey) &&
            data[templateKey] !== undefined &&
            data[templateKey] !== null
        ),
        template
      ).map((key) => ({
        value: data[key],
        id: key,
      }));

      return dynamicData.length ? dynamicData : null;
    }

    return null;
  }, [data, template]);
};

export default useDynamicDataFromTokenCollection;
