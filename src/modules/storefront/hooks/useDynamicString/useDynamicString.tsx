import { useMemo } from 'react';

import _ from 'lodash';

import { useDynamicApi } from '../../provider/DynamicApiProvider';

export const useDynamicString = (input: string | undefined) => {
  const { isDynamic, datasource, loading } = useDynamicApi();
  return useMemo(() => {
    // not dynamic, bypass
    if (!isDynamic) return { text: input, loaded: true, loading: false };

    const replacements = Array.from(
      (input ?? '').matchAll(new RegExp(/\{(.*?)\}/g))
    );
    let text = input ?? '';
    let loaded = true;
    replacements.forEach((item) => {
      const [q, key] = item;
      const [namespace] = (key || '').split('.');
      const hasFirstLoad = _.get(datasource, namespace);
      if (loaded && !hasFirstLoad) loaded = false;
      text = text.replace(
        q,
        _.get(datasource, key, hasFirstLoad ? q : 'loading...')
      );
    });
    return { text, loaded, loading };
  }, [datasource, input, isDynamic, loading]);
};
