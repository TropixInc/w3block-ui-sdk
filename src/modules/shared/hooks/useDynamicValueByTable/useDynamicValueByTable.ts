import _ from 'lodash';

export const useDynamicValueByTable = () => {
  return (input: string, itemApi: any) => {
    const replacements = Array.from(
      (input ?? '').matchAll(new RegExp(/\{(.*?)\}/g))
    );
    let text = input ?? '';
    let loaded = true;
    replacements.forEach((item) => {
      const [q, key] = item;
      const [namespace] = (key || '').split('.');
      const hasFirstLoad = _.get(itemApi, namespace);
      if (loaded && !hasFirstLoad) loaded = false;
      text = text.replace(q, _.get(itemApi, key, ''));
    });
    return { text, loaded };
  };
};
