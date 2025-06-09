import { DynamicFormConfiguration } from '../interfaces/DynamicFormConfiguration';

export const orderTokenTemplateKeys = (
  keys: Array<string>,
  template: DynamicFormConfiguration
) => {
  return keys.sort((keyA, keyB) => {
    const keyAOrder = template[keyA].config.order;
    const keyBOrder = template[keyB].config.order;
    if (keyBOrder === undefined && keyAOrder === undefined) return 0;
    if (keyBOrder === undefined) return -1;
    if (keyAOrder === undefined) return 1;
    return keyAOrder - keyBOrder;
  });
};
