import _ from 'lodash';

export const useDynamicValueByTable = () => {
  return (input: string, itemApi: any) => {
    const replacements = Array.from(
      (input ?? '').matchAll(new RegExp(/\{(.*?)\}/g))
    );
    let text = input ?? '';
    replacements.forEach((item) => {
      const [q, key] = item;
      text = text.replace(q, _.get(itemApi, key, ''));
    });
    return text;
  };
};
